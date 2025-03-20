import torch
import numpy as np
from PIL import Image

class ImageCropper:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "image_composer_data": ("DATA",),
                "image": ("IMAGE",),
                "target": (["a", "b"], {"default": "a"}),
            },
            "optional": {
                "mask": ("MASK",),
            }
        }

    RETURN_TYPES = ("IMAGE", "MASK")
    RETURN_NAMES = ("IMAGE", "MASK")
    FUNCTION = "crop_image"
    CATEGORY = "KayTool/Image"

    def crop_image(self, image_composer_data, image, target, mask=None):
        image = image[0].cpu().numpy()
        image_pil = Image.fromarray((image * 255).astype(np.uint8))
        orig_height, orig_width = image_pil.size[1], image_pil.size[0]

        if target == "a":
            x1, y1, x2, y2 = image_composer_data["a_position"]
        else:
            x1, y1, x2, y2 = image_composer_data["b_position"]

        cropped_image = image_pil.crop((x1, y1, x2, y2))

        if mask is None:
            mask = torch.zeros((orig_height, orig_width), dtype=torch.float32)
        mask_np = (mask.cpu().numpy() * 255).astype(np.uint8)
        if mask_np.ndim == 3:
            mask_np = mask_np.squeeze()
        mask_pil = Image.fromarray(mask_np)
        cropped_mask = mask_pil.crop((x1, y1, x2, y2))

        cropped_image_tensor = torch.from_numpy(np.array(cropped_image).astype(np.float32) / 255.0).unsqueeze(0)
        cropped_mask_tensor = torch.from_numpy(np.array(cropped_mask).astype(np.float32) / 255.0)

        return (cropped_image_tensor, cropped_mask_tensor)