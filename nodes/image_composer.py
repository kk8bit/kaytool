import torch
import numpy as np
from PIL import Image

class ImageComposer:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "image_a": ("IMAGE",),
                "mask_a": ("MASK",),
                "image_b": ("IMAGE",), 
                "position": (["top", "bottom", "left", "right"], {"default": "top"}),
            },
            "optional": {
                "mask_b": ("MASK",),  
            }
        }

    RETURN_TYPES = ("IMAGE", "MASK", "DATA")
    RETURN_NAMES = ("IMAGE", "MASK", "DATA")
    FUNCTION = "compose_images"
    CATEGORY = "KayTool/Image"

    def compose_images(self, image_a, mask_a=None, image_b=None, position=None, mask_b=None):
       
        image_a = image_a[0].cpu().numpy() 
        image_a_pil = Image.fromarray((image_a * 255).astype(np.uint8))
        a_width, a_height = image_a_pil.size

        
        image_b = image_b[0].cpu().numpy()
        image_b_pil = Image.fromarray((image_b * 255).astype(np.uint8))
        b_width, b_height = image_b_pil.size

        
        if mask_a is None:
            mask_a_np = np.zeros((a_height, a_width), dtype=np.uint8)
        else:
            mask_a_np = (mask_a.cpu().numpy() * 255).astype(np.uint8)
            if mask_a_np.ndim == 3:  
                mask_a_np = mask_a_np.squeeze()
        mask_a_pil = Image.fromarray(mask_a_np)

        
        if position in ["top", "bottom"]:
            scale = a_width / b_width
            new_b_width = a_width
            new_b_height = int(b_height * scale)
        else:  
            scale = a_height / b_height
            new_b_width = int(b_width * scale)
            new_b_height = a_height

        image_b_pil = image_b_pil.resize((new_b_width, new_b_height), Image.Resampling.LANCZOS)

       
        if position in ["top", "bottom"]:
            new_width = a_width
            new_height = a_height + new_b_height
        else:
            new_width = a_width + new_b_width
            new_height = a_height

        
        composed_image = Image.new("RGB", (new_width, new_height), (0, 0, 0))
        if position == "top":
            composed_image.paste(image_a_pil, (0, 0))
            composed_image.paste(image_b_pil, (0, a_height))
            a_pos = (0, 0, a_width, a_height)
            b_pos = (0, a_height, new_b_width, new_height)
        elif position == "bottom":
            composed_image.paste(image_b_pil, (0, 0))
            composed_image.paste(image_a_pil, (0, new_b_height))
            a_pos = (0, new_b_height, a_width, new_height)
            b_pos = (0, 0, new_b_width, new_b_height)
        elif position == "left":
            composed_image.paste(image_a_pil, (0, 0))
            composed_image.paste(image_b_pil, (a_width, 0))
            a_pos = (0, 0, a_width, a_height)
            b_pos = (a_width, 0, new_width, new_b_height)
        else:  
            composed_image.paste(image_b_pil, (0, 0))
            composed_image.paste(image_a_pil, (new_b_width, 0))
            a_pos = (new_b_width, 0, new_width, a_height)
            b_pos = (0, 0, new_b_width, new_b_height)

        
        mask_out = Image.new("L", (new_width, new_height), 0) 
        mask_out.paste(mask_a_pil, (a_pos[0], a_pos[1]))

       
        if mask_b is None:
            mask_b_np = np.zeros((b_height, b_width), dtype=np.uint8)
        else:
            mask_b_np = (mask_b.cpu().numpy() * 255).astype(np.uint8)
            if mask_b_np.ndim == 3:  
                mask_b_np = mask_b_np.squeeze()
        mask_b_pil = Image.fromarray(mask_b_np).resize((new_b_width, new_b_height), Image.Resampling.LANCZOS)
        mask_out.paste(mask_b_pil, (b_pos[0], b_pos[1]))

        composed_image_tensor = torch.from_numpy(np.array(composed_image).astype(np.float32) / 255.0).unsqueeze(0)
        mask_out_tensor = torch.from_numpy(np.array(mask_out).astype(np.float32) / 255.0)

     
        data = {
            "a_position": a_pos,
            "b_position": b_pos,
            "a_size": (a_width, a_height),
            "b_size": (new_b_width, new_b_height),
            "composed_image": composed_image_tensor,  
            "mask_out": mask_out_tensor,  
        }

        return (composed_image_tensor, mask_out_tensor, data)