import torch
from torchvision import transforms as T
import comfy.model_management
import os
import random
import string
import folder_paths
from nodes import SaveImage

class PreviewMaskPlus(SaveImage):
    def __init__(self):
        self.output_dir = folder_paths.get_temp_directory()
        self.type = "temp"
        self.prefix_append = "_temp_" + ''.join(random.choice(string.ascii_lowercase) for _ in range(5))
        self.compress_level = 4

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "image": ("IMAGE",),
                "mask": ("MASK",),
                "Preview": (["mask", "Black", "White", "Red", "Green", "Blue"],),
            },
            "hidden": {"prompt": "PROMPT", "extra_pnginfo": "EXTRA_PNGINFO"},
        }

    RETURN_TYPES = ()
    FUNCTION = "execute"
    CATEGORY = "KayTool/Mask"

    def execute(self, image, mask, Preview, filename_prefix="ComfyUI", prompt=None, extra_pnginfo=None):
        
        device = comfy.model_management.get_torch_device()

        
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
        mask = mask.to(device)  

        
        if Preview == "mask":
           
            preview = mask.unsqueeze(-1).expand(-1, -1, -1, 3)
        else:
           
            image = image.permute([0, 3, 1, 2])  
            image = image.permute([0, 2, 3, 1])  
            foreground = image[:, :, :, :3] if image.shape[3] == 4 else image
            foreground = foreground.to(device)  

            alpha = mask.unsqueeze(-1).expand(-1, -1, -1, 3)
            color_map = {
                "Black": [0, 0, 0],
                "White": [1, 1, 1],
                "Red": [1, 0, 0],
                "Green": [0, 1, 0],
                "Blue": [0, 0, 1],
            }
            background_color_rgb = color_map.get(Preview, [0, 0, 0])
            background = torch.tensor(background_color_rgb, device=device).view(1, 1, 1, 3).repeat(
                foreground.shape[0], foreground.shape[1], foreground.shape[2], 1
            ) 
            preview = foreground * alpha + background * (1 - alpha)

        
        preview = preview.to(device)

        
        return self.save_images(preview, filename_prefix, prompt, extra_pnginfo)