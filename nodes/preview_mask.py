import os
import random
import string
import torch
import folder_paths
from torchvision import transforms as T
from nodes import SaveImage

class PreviewMask(SaveImage):
    def __init__(self):
        self.output_dir = folder_paths.get_temp_directory()
        self.type = "temp"
        self.prefix_append = "_temp_" + ''.join(random.choice(string.ascii_lowercase) for _ in range(5))
        self.compress_level = 4

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {"mask": ("MASK",), },
            "hidden": {"prompt": "PROMPT", "extra_pnginfo": "EXTRA_PNGINFO"},
        }

    RETURN_TYPES = ()
    FUNCTION = "execute"
    CATEGORY = "KayTool/Mask"

    def execute(self, mask, filename_prefix="ComfyUI", prompt=None, extra_pnginfo=None):
        if not isinstance(mask, torch.Tensor):
            raise ValueError("Input mask must be a PyTorch tensor.")
        if mask.dim() not in [2, 3]:
            raise ValueError("Input mask must have 2 or 3 dimensions.")
        if mask.dtype == torch.uint8:
            mask = mask.float() / 255.0
        elif mask.max() > 1.0:
            mask = mask / mask.max()
        if mask.dim() == 2:
            mask = mask.unsqueeze(0)
        preview = mask.unsqueeze(-1).expand(-1, -1, -1, 3)
        return self.save_images(preview, filename_prefix, prompt, extra_pnginfo)