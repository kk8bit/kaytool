from server import PromptServer
import psutil
import asyncio
import json
from aiohttp import web
import platform

cpuinfo = None
pynvml = None

PLATFORM = platform.system()
IS_MACOS = PLATFORM == "Darwin"
IS_LINUX = PLATFORM == "Linux"
IS_WINDOWS = PLATFORM == "Windows"

async def get_gpu_info(pynvml_available, pynvml_instance):
    global GPU_INFO_CACHE, LAST_GPU_UPDATE
    current_time = asyncio.get_event_loop().time()
    if GPU_INFO_CACHE is None or (current_time - LAST_GPU_UPDATE) >= 0.5:
        if IS_MACOS:
            GPU_INFO_CACHE = "GPU monitoring not supported on macOS"
        elif pynvml_available:
            try:
                device_count = pynvml_instance.nvmlDeviceGetCount()
                gpu_info = []
                for i in range(device_count):
                    handle = pynvml_instance.nvmlDeviceGetHandleByIndex(i)
                    name = pynvml_instance.nvmlDeviceGetName(handle)
                    if isinstance(name, bytes):
                        name = name.decode('utf-8')
                    util = pynvml_instance.nvmlDeviceGetUtilizationRates(handle)
                    mem_info = pynvml_instance.nvmlDeviceGetMemoryInfo(handle)
                    gpu_info.append({
                        "index": i,
                        "name": name,
                        "load": float(util.gpu),
                        "memory_used": float(mem_info.used) / (1024 ** 3),
                        "memory_total": float(mem_info.total) / (1024 ** 3),
                        "memory_percent": (float(mem_info.used) / float(mem_info.total)) * 100,
                        "temperature": float(pynvml_instance.nvmlDeviceGetTemperature(handle, pynvml_instance.NVML_TEMPERATURE_GPU))
                    })
                GPU_INFO_CACHE = gpu_info
            except Exception:
                GPU_INFO_CACHE = "GPU information unavailable"
        else:
            GPU_INFO_CACHE = "GPU information unavailable"
        LAST_GPU_UPDATE = current_time
    return GPU_INFO_CACHE

@PromptServer.instance.routes.get("/kaytool/resources")
async def fetch_resources(request):
    global cpuinfo, pynvml
    try:
        if cpuinfo is None:
            import cpuinfo
            CPU_NAME = cpuinfo.get_cpu_info().get('brand_raw', "Unknown")
        else:
            CPU_NAME = cpuinfo.get_cpu_info().get('brand_raw', "Unknown")

        pynvml_available = False
        pynvml_instance = None
        if (IS_LINUX or IS_WINDOWS) and pynvml is None:
            try:
                import pynvml
                pynvml_instance = pynvml
                pynvml_instance.nvmlInit()
                pynvml_available = True
            except pynvml.NVMLError:
                pynvml_available = False
        elif pynvml is not None:
            pynvml_available = True
            pynvml_instance = pynvml

        # 获取实时数据
        cpu_percent = psutil.cpu_percent(interval=0.1)
        cpu_count = psutil.cpu_count()
        ram = psutil.virtual_memory()
        ram_total = round(ram.total / (1024 ** 3), 1)
        ram_used = round(ram.used / (1024 ** 3), 1)
        ram_percent = ram.percent

        gpu_info = await get_gpu_info(pynvml_available, pynvml_instance)

        data = {
            "cpu_percent": cpu_percent,
            "cpu_count": cpu_count,
            "cpu_name": CPU_NAME,
            "ram_total": ram_total,
            "ram_used": ram_used,
            "ram_percent": ram_percent,
            "gpu": gpu_info
        }
        return web.Response(text=json.dumps(data), content_type='application/json')
    except Exception as e:
        return web.Response(text=json.dumps({"error": str(e)}), status=500)

GPU_INFO_CACHE = None
LAST_GPU_UPDATE = 0