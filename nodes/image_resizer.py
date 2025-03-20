import torch
import numpy as np
from PIL import Image

class ImageResizer:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "image": ("IMAGE",),
                "width": ("INT", {"default": 0, "min": 0, "max": 8192, "step": 1}),
                "height": ("INT", {"default": 0, "min": 0, "max": 8192, "step": 1}),
                "keep_ratio": ("BOOLEAN", {"default": True}),
            },
            "optional": {
                "mask": ("MASK",),  
            }
        }

    RETURN_TYPES = ("IMAGE", "MASK")
    RETURN_NAMES = ("IMAGE", "MASK")
    FUNCTION = "resize_image"
    CATEGORY = "KayTool/Image"

    def resize_image(self, image, width, height, keep_ratio, mask=None):
        
        image = image[0].cpu().numpy()  
        image_pil = Image.fromarray((image * 255).astype(np.uint8))
        orig_width, orig_height = image_pil.size

       
        target_width = width if width > 0 else orig_width
        target_height = height if height > 0 else orig_height

        if keep_ratio:
           
            if width > 0 and height > 0:
               
                scale = min(target_width / orig_width, target_height / orig_height)
                target_width = int(orig_width * scale)
                target_height = int(orig_height * scale)
            elif width > 0:
               
                scale = target_width / orig_width
                target_height = int(orig_height * scale)
            elif height > 0:
              
                scale = target_height / orig_height
                target_width = int(orig_width * scale)

       
        resized_image_pil = image_pil.resize((target_width, target_height), Image.Resampling.LANCZOS)

  
        if mask is None:
        
            mask = torch.zeros((orig_height, orig_width), dtype=torch.float32)
        mask_np = (mask.cpu().numpy() * 255).astype(np.uint8)
        if mask_np.ndim == 3:  
            mask_np = mask_np.squeeze()
        mask_pil = Image.fromarray(mask_np)
        resized_mask_pil = mask_pil.resize((target_width, target_height), Image.Resampling.NEAREST) 

       
        resized_image_tensor = torch.from_numpy(np.array(resized_image_pil).astype(np.float32) / 255.0).unsqueeze(0)
        resized_mask_tensor = torch.from_numpy(np.array(resized_mask_pil).astype(np.float32) / 255.0)

        return (resized_image_tensor, resized_mask_tensor)