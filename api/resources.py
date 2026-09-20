import logging
import platform
import time
import psutil
from server import PromptServer
from aiohttp import web

PLATFORM = platform.system()
IS_MACOS = PLATFORM == "Darwin"
IS_LINUX = PLATFORM == "Linux"
IS_WINDOWS = PLATFORM == "Windows"

pynvml_instance = None
pynvml_available = False
CPU_NAME = None

class KayResourceCollector:
    def __init__(self):
        self.cpu_count = psutil.cpu_count()
        self._initialize_hardware()

    def _initialize_hardware(self):
        global pynvml_instance, pynvml_available, CPU_NAME
        if CPU_NAME is None:
            try:
                import cpuinfo
                CPU_NAME = cpuinfo.get_cpu_info().get('brand_raw', "Unknown")
            except Exception:
                CPU_NAME = "Unknown"

        if pynvml_instance is None and (IS_LINUX or IS_WINDOWS):
            try:
                import pynvml
                pynvml.nvmlInit()
                pynvml_instance = pynvml
                pynvml_available = True
            except Exception:
                # 不能写成 except (ImportError, pynvml.NVMLError)：import 失败时 pynvml
                # 这个名字根本没绑定，求值 except 子句本身就会抛 NameError，而它不在
                # 捕获范围内 —— 于是「没装 pynvml」这个本该被兜住的场景反而把监控打死。
                pynvml_instance = None
                pynvml_available = False

    def get_status(self):
        try:
            cpu_percent = psutil.cpu_percent(interval=None)
            ram = psutil.virtual_memory()
            ram_total = round(ram.total / (1024 ** 3), 1)
            # 不能用 ram.used：在 macOS 上它只算 active+wired，而 ram.percent 的定义是
            # (total - available) / total，两者口径不同，显示出来就是「10.1/24GB (68%)」这种自相矛盾。
            # 用 total - available 才和百分比自洽，也接近活动监视器的「已使用内存」。
            ram_used = round((ram.total - ram.available) / (1024 ** 3), 1)
            ram_percent = ram.percent
            gpu_info = self.get_gpu_info() if not IS_MACOS and pynvml_available else []
            return {
                "cpu_percent": cpu_percent,
                "cpu_count": self.cpu_count,
                "cpu_name": CPU_NAME or "Unknown",
                "ram_total": ram_total,
                "ram_used": ram_used,
                "ram_percent": ram_percent,
                "gpu": gpu_info
            }
        except Exception:
            return {
                "cpu_percent": 0,
                "cpu_count": self.cpu_count,
                "cpu_name": CPU_NAME or "Unknown",
                "ram_total": 0,
                "ram_used": 0,
                "ram_percent": 0,
                "gpu": "Error"
            }

    def get_gpu_info(self):
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
            return gpu_info
        except Exception:
            return "GPU information unavailable"

# 前端按需轮询，这里只负责按需采集。多个标签页同时拉时靠一个很短的缓存去重，
# 也避免 psutil.cpu_percent(interval=None) 的「距上次调用」基准被多个客户端互相打乱。
_collector = None
_cache = {"at": 0.0, "data": None}
CACHE_TTL_SECONDS = 0.2


def _get_status_cached():
    global _collector
    now = time.monotonic()
    if _cache["data"] is None or now - _cache["at"] > CACHE_TTL_SECONDS:
        if _collector is None:
            _collector = KayResourceCollector()
        _cache["data"] = _collector.get_status()
        _cache["at"] = now
    return _cache["data"]


routes = PromptServer.instance.routes


@routes.get("/kaytool/resources")
async def resources_endpoint(request):
    try:
        return web.json_response(_get_status_cached())
    except Exception:
        logging.exception("[KayTool] Failed to collect resource status")
        return web.json_response({"error": "unavailable"}, status=500)
