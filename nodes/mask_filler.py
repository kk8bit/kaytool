import torch
import numpy as np
import cv2

class MaskFiller:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "mask": ("MASK",), 
            }
        }

    RETURN_TYPES = ("MASK",)
    RETURN_NAMES = ("MASK",)
    FUNCTION = "fill_mask"
    CATEGORY = "KayTool/Mask"

    def fill_mask(self, mask):
        
        mask_np = mask.cpu().numpy()
        if mask_np.ndim == 3: 
            mask_np = mask_np.squeeze()
        
   
        mask_np = (mask_np * 255).astype(np.uint8)

      
        contours, _ = cv2.findContours(mask_np, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

       
        filled_mask_np = mask_np.copy()

        
        for contour in contours:
           
            cv2.drawContours(filled_mask_np, [contour], -1, 255, thickness=cv2.FILLED)

        
        filled_mask_tensor = torch.from_numpy(filled_mask_np.astype(np.float32) / 255.0)

        return (filled_mask_tensor,)