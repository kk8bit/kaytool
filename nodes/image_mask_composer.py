import torch
from PIL import Image
import numpy as np

class ImageMaskComposer:
    def __init__(self):
        pass
    
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "image": ("IMAGE",),
                "mask": ("MASK",),
                "background_color": (["black", "white", "gray", "red", "green", "blue"], {
                    "default": "black"
                }),
            }
        }

    RETURN_TYPES = ("IMAGE",)
    FUNCTION = "compose"
    CATEGORY = "KayTool/Image"

    def compose(self, image, mask, background_color):
        color_map = {
            "black": [0, 0, 0],
            "white": [255, 255, 255],
            "gray": [128, 128, 128],
            "red": [255, 0, 0],
            "green": [0, 255, 0],
            "blue": [0, 0, 255]
        }
        
        bg_color = color_map[background_color]
        
        image = image[0].cpu().numpy()
        mask = mask.cpu().numpy()
        
        if len(mask.shape) == 3:
            mask = mask[0]
            
        height, width = image.shape[:2]
        
        if mask.shape != (height, width):
            mask = np.array(Image.fromarray(mask).resize((width, height), Image.NEAREST))
            
        mask = np.expand_dims(mask, axis=2)
        mask = np.repeat(mask, 3, axis=2)
        
        bg = np.ones_like(image) * np.array(bg_color) / 255.0

        output = image * mask + bg * (1 - mask)
        
        output = torch.from_numpy(output).unsqueeze(0)
        
        return (output,)