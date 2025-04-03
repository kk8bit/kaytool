from server import PromptServer
import psutil
import asyncio
import json
from aiohttp import web
from cpuinfo import get_cpu_info
import pynvml
import platform

PLATFORM = platform.system()
IS_MACOS = PLATFORM == "Darwin"
IS_LINUX = PLATFORM == "Linux"
IS_WINDOWS = PLATFORM == "Windows"

PYNVML_AVAILABLE = False
if IS_LINUX or IS_WINDOWS:
    try:
        pynvml.nvmlInit()
        PYNVML_AVAILABLE = True
    except pynvml.NVMLError:
        PYNVML_AVAILABLE = False

CPU_NAME = get_cpu_info().get('brand_raw', "Unknown")
GPU_INFO_CACHE = None
LAST_GPU_UPDATE = 0
GPU_CACHE_INTERVAL = 0.5

async def get_gpu_info():
    global GPU_INFO_CACHE, LAST_GPU_UPDATE
    current_time = asyncio.get_event_loop().time()
    if GPU_INFO_CACHE is None or (current_time - LAST_GPU_UPDATE) >= GPU_CACHE_INTERVAL:
        if IS_MACOS:
            GPU_INFO_CACHE = "GPU monitoring not supported on macOS"
        elif PYNVML_AVAILABLE:
            try:
                device_count = pynvml.nvmlDeviceGetCount()
                gpu_info = []
                for i in range(device_count):
                    handle = pynvml.nvmlDeviceGetHandleByIndex(i)
                    name = pynvml.nvmlDeviceGetName(handle)
                    if isinstance(name, bytes):
                        name = name.decode('utf-8')
                    util = pynvml.nvmlDeviceGetUtilizationRates(handle)
                    mem_info = pynvml.nvmlDeviceGetMemoryInfo(handle)
                    gpu_info.append({
                        "index": i,
                        "name": name,
                        "load": float(util.gpu),
                        "memory_used": float(mem_info.used) / (1024 ** 3),
                        "memory_total": float(mem_info.total) / (1024 ** 3),
                        "memory_percent": (float(mem_info.used) / float(mem_info.total)) * 100
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
    try:
        cpu_percent = psutil.cpu_percent(interval=0.1)
        cpu_count = psutil.cpu_count()
        ram = psutil.virtual_memory()
        ram_total = round(ram.total / (1024 ** 3), 1)
        ram_used = round(ram.used / (1024 ** 3), 1)
        ram_percent = ram.percent

        gpu_info = await get_gpu_info()

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