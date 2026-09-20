import asyncio
import logging
import platform
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
            ram_used = round(ram.used / (1024 ** 3), 1)
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

class KayResourceMonitor:
    def __init__(self, initial_rate=1.0):
        self.rate = initial_rate
        self.collector = None
        self.running = False
        self.task = None

    def adjust_rate(self, cpu_percent):
        if cpu_percent > 80:
            return 2
        elif cpu_percent > 50:
            return 1
        return 0.5

    async def send_message(self, data):
        try:
            await PromptServer.instance.send("kaytool.resources", data)
        except Exception:
            pass

    async def monitor_loop(self):
        # 整个循环兜住：这是 create_task 起的任务，没人 await 它的结果，
        # 抛出去只会在 GC 时留下一句 "Task exception was never retrieved"，
        # 用户看到的就是监视器静默不工作，且 running 还卡在 True。
        try:
            if self.collector is None:
                self.collector = KayResourceCollector()
            self.running = True
            while self.running:
                data = self.collector.get_status()
                self.rate = self.adjust_rate(data["cpu_percent"])
                await self.send_message(data)
                await asyncio.sleep(self.rate)
        except asyncio.CancelledError:
            raise
        except Exception:
            logging.exception("[KayTool] Resource monitor stopped unexpectedly")
        finally:
            self.running = False

    def start(self):
        if self.running:
            self.stop()
        if self.rate <= 0:
            return
        # 在主事件循环中创建任务
        self.task = asyncio.create_task(self.monitor_loop())

    def stop(self):
        self.running = False
        if self.task is not None:
            self.task.cancel()
            self.task = None

monitor = KayResourceMonitor(initial_rate=1.0)
routes = PromptServer.instance.routes

@routes.post("/kaytool/start_monitor")
async def start_monitor_endpoint(request):
    monitor.start()
    return web.Response(text="Monitor started")

@routes.post("/kaytool/stop_monitor")
async def stop_monitor_endpoint(request):
    monitor.stop()
    return web.Response(text="Monitor stopped")