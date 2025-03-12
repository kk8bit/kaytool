import torch
from torchvision import transforms as T
import comfy.model_management
import os
import random
import string
import folder_paths
from nodes import SaveImage
import torch.nn.functional as F

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
                "Preview": (["none", "image", "mask", "Black", "White", "Gray", "Red", "Green", "Blue"],),
                "image": ("IMAGE", {}),
                "mask": ("MASK", {}),
            },
            "hidden": {"prompt": "PROMPT", "extra_pnginfo": "EXTRA_PNGINFO"},
        }

    RETURN_TYPES = ()
    FUNCTION = "execute"
    CATEGORY = "KayTool/Mask"

    def execute(self, Preview, image, mask, filename_prefix="ComfyUI", prompt=None, extra_pnginfo=None):
        device = comfy.model_management.get_torch_device()

        # Ensure image is in the correct format
        image = image.permute([0, 3, 1, 2])
        image = image.permute([0, 2, 3, 1])
        foreground = image[:, :, :, :3] if image.shape[3] == 4 else image
        foreground = foreground.to(device)

        # Ensure mask is in the correct format
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

        # Resize mask to match image dimensions
        target_height, target_width = foreground.shape[1], foreground.shape[2]
        mask_height, mask_width = mask.shape[1], mask.shape[2]
        if mask_height > target_height:
            mask = mask[:, :target_height, :]
        if mask_width > target_width:
            mask = mask[:, :, :target_width]
        if mask_height < target_height or mask_width < target_width:
            padding = (0, max(0, target_width - mask_width), 0, max(0, target_height - mask_height))
            mask = F.pad(mask, padding, "constant", 0)

        # Generate preview based on selected option
        if Preview == "image":
            preview = foreground
        elif Preview == "mask":
            preview = mask.unsqueeze(-1).expand(-1, -1, -1, 3)
        elif Preview == "none":
            alpha = mask.unsqueeze(-1)
            preview = torch.cat((foreground, alpha), dim=-1)
        else:
            alpha = mask.unsqueeze(-1).expand(-1, -1, -1, 3)
            color_map = {
                "Black": [0, 0, 0],
                "White": [1, 1, 1],
                "Gray": [0.5, 0.5, 0.5],
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