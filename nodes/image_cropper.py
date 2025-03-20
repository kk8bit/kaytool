import torch
import numpy as np
from PIL import Image

class ImageCropper:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "image_composer_data": ("DATA",),  
                "target": (["a", "b"], {"default": "a"}), 
            }
        }

    RETURN_TYPES = ("IMAGE", "MASK")
    RETURN_NAMES = ("IMAGE", "MASK")
    FUNCTION = "crop_image"
    CATEGORY = "KayTool/Image"

    def crop_image(self, image_composer_data, target):
        
        composed_image_tensor = image_composer_data.get("composed_image")
        mask_out_tensor = image_composer_data.get("mask_out")

        
        image = composed_image_tensor[0].cpu().numpy() 
        image_pil = Image.fromarray((image * 255).astype(np.uint8))

       
        if target == "a":
            x1, y1, x2, y2 = image_composer_data["a_position"]
        else:  # "b"
            x1, y1, x2, y2 = image_composer_data["b_position"]

       
        cropped_image = image_pil.crop((x1, y1, x2, y2))

        
        mask_np = (mask_out_tensor.cpu().numpy() * 255).astype(np.uint8)
        if mask_np.ndim == 3:  
            mask_np = mask_np.squeeze()
        mask_pil = Image.fromarray(mask_np)
        cropped_mask = mask_pil.crop((x1, y1, x2, y2))

       
        cropped_image_tensor = torch.from_numpy(np.array(cropped_image).astype(np.float32) / 255.0).unsqueeze(0)
        cropped_mask_tensor = torch.from_numpy(np.array(cropped_mask).astype(np.float32) / 255.0)

        return (cropped_image_tensor, cropped_mask_tensor)