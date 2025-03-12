import torch
from torchvision import transforms as T
import comfy.model_management
import torch.nn.functional as F

class MaskBlurPlus:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "invert_mask": ("BOOLEAN", {"default": False, "tooltip": "Invert mask values (0->1, 1->0)"}),
                "mask": ("MASK",),
                "blur": ("INT", {
                    "default": 0,
                    "min": 0,
                    "max": 256,
                    "step": 1,
                    "display": "slider"
                }),
                "expand": ("FLOAT", {
                    "default": 0.0,
                    "min": -5.0,
                    "max": 5.0,
                    "step": 0.1,
                    "display": "slider"
                }),
            }
        }

    RETURN_TYPES = ("MASK",)
    FUNCTION = "execute"
    CATEGORY = "KayTool/Mask"

    def execute(self, invert_mask, mask, blur, expand):
        if mask.dim() == 2:
            mask = mask.unsqueeze(0)
        device = comfy.model_management.get_torch_device()
        mask = mask.to(device)

      
        if invert_mask:
            mask = 1. - mask

        if expand != 0.0:
            expand_pixels = int(abs(expand) * 10)
            kernel_size = 2 * expand_pixels + 1
            padding = expand_pixels
            if expand > 0.0:
                mask = F.max_pool2d(mask.unsqueeze(1), kernel_size=kernel_size, stride=1, padding=padding).squeeze(1)
            else:
                mask = -F.max_pool2d(-mask.unsqueeze(1), kernel_size=kernel_size, stride=1, padding=padding).squeeze(1)
        if blur > 0:
            if blur % 2 == 0:
                blur += 1
            mask = T.functional.gaussian_blur(mask.unsqueeze(1), kernel_size=int(blur)).squeeze(1)
        mask = mask.to(comfy.model_management.intermediate_device())
        return (mask,)