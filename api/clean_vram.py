import torch
import gc
from aiohttp import web
from server import PromptServer

pynvml_available = False
try:
    import pynvml
    pynvml.nvmlInit()
    pynvml_available = True
except (ImportError, pynvml.NVMLError):
    pass

async def clean_vram(request):
    try:
        if torch.backends.mps.is_available() or not torch.cuda.is_available():
            return web.Response(text="你的硬件不支持该功能哟 ≧﹏≦！Sorry! Your hardware doesn't support this feature!")

        memory_used_before = torch.cuda.memory_reserved() / (1024 ** 3)
        gc.collect()
        torch.cuda.empty_cache()
        from comfy.model_management import unload_all_models
        unload_all_models()
        torch.cuda.empty_cache()
        torch.cuda.synchronize()
        memory_used_after = torch.cuda.memory_reserved() / (1024 ** 3)
        freed_memory = memory_used_before - memory_used_after

        total_used_before = 0
        total_used_after = 0
        if pynvml_available:
            handle = pynvml.nvmlDeviceGetHandleByIndex(0)
            mem_info_before = pynvml.nvmlDeviceGetMemoryInfo(handle)
            total_used_before = mem_info_before.used / (1024 ** 3)
            mem_info_after = pynvml.nvmlDeviceGetMemoryInfo(handle)
            total_used_after = mem_info_after.used / (1024 ** 3)

        message = f"VRAM Cleaned: Freed {freed_memory:.2f} GB (Allocated: {memory_used_before:.2f} GB -> {memory_used_after:.2f} GB, Total: {total_used_before:.2f} GB -> {total_used_after:.2f} GB)"
        if freed_memory == 0 and total_used_before == total_used_after and total_used_before > 0:
            message += " (No additional VRAM freed, restart may be required)"
        return web.Response(text=message)

    except Exception as e:
        return web.Response(text=f"Error cleaning VRAM: {str(e)}", status=500)

PromptServer.instance.routes.post("/kaytool/clean_vram")(clean_vram)