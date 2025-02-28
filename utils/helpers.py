import torch

def get_default_provider():
    if torch.cuda.is_available():
        return "CUDA"  
    elif hasattr(torch, "backends") and hasattr(torch.backends, "rocm"):
        return "ROCM"  
    else:
        return "CPU"  