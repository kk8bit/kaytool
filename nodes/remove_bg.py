import torch
from torchvision import transforms as T
import comfy.model_management
import torch.nn.functional as F
import hashlib

class RemoveBG:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "remove_bg": ("REMOVE_BG",),
                "image": ("IMAGE",),
                "invert_mask": ("BOOLEAN", {"default": False, "tooltip": "Invert mask values (0->1, 1->0)"}),
                "Preview": (["none", "Black", "White", "Gray", "Red", "Green", "Blue"],),
                "Blur": ("INT", {"default": 0, "min": 0, "max": 256, "step": 1, "display": "slider"}),
                "Expand": ("FLOAT", {"default": 0.0, "min": -5.0, "max": 5.0, "step": 0.1, "display": "slider"}),
            },
        }

    RETURN_TYPES = ("IMAGE", "MASK",)
    FUNCTION = "execute"
    CATEGORY = "KayTool/Remove BG"

    def __init__(self):
        self.cache = {
            "input_hash": None,
            "raw_mask": None,
            "foreground": None,
            "remove_bg": None
        }

    def get_input_hash(self, remove_bg, image):
        image_data = torch.cat(image, dim=0).cpu().numpy().tobytes() if isinstance(image, list) else image.cpu().numpy().tobytes()
        hash_obj = hashlib.sha256()
        hash_obj.update(str(id(remove_bg)).encode('utf-8'))
        hash_obj.update(image_data)
        return hash_obj.hexdigest()

    def execute(self, remove_bg, image, invert_mask, Preview, Blur, Expand):
        current_hash = self.get_input_hash(remove_bg, image)

        if (self.cache["input_hash"] != current_hash or
            self.cache["remove_bg"] != remove_bg or
            self.cache["raw_mask"] is None):
            
            if isinstance(image, list):
                image = torch.cat(image, dim=0)

            image = image.permute([0, 3, 1, 2])
            output = []
            for img in image:
                img_pil = T.ToPILImage()(img)
                img_processed = remove_bg.process(img_pil)
                img_tensor = T.ToTensor()(img_processed)
                output.append(img_tensor)
            output = torch.stack(output, dim=0)
            output = output.permute([0, 2, 3, 1])

            raw_mask = output[:, :, :, 3] if output.shape[3] == 4 else torch.ones_like(output[:, :, :, 0])
            foreground = image.permute([0, 2, 3, 1])[:, :, :, :3] if image.shape[1] == 4 else image.permute([0, 2, 3, 1])

            self.cache["input_hash"] = current_hash
            self.cache["raw_mask"] = raw_mask.clone()
            self.cache["foreground"] = foreground.clone()
            self.cache["remove_bg"] = remove_bg

        raw_mask = self.cache["raw_mask"]
        foreground = self.cache["foreground"]

        mask = raw_mask.clone()
        if invert_mask:
            mask = 1. - mask

        if mask.dim() == 2:
            mask = mask.unsqueeze(0)
        device = comfy.model_management.get_torch_device()
        mask = mask.to(device)

        if Expand != 0.0:
            expand_pixels = int(abs(Expand) * 10)
            kernel_size = 2 * expand_pixels + 1
            padding = expand_pixels
            if Expand > 0.0:
                mask = F.max_pool2d(mask.unsqueeze(1), kernel_size=kernel_size, stride=1, padding=padding).squeeze(1)
            else:
                mask = -F.max_pool2d(-mask.unsqueeze(1), kernel_size=kernel_size, stride=1, padding=padding).squeeze(1)

        if Blur > 0:
            if Blur % 2 == 0:
                Blur += 1
            mask = T.functional.gaussian_blur(mask.unsqueeze(1), kernel_size=int(Blur)).squeeze(1)

        mask = mask.to(comfy.model_management.intermediate_device())
        alpha = mask.unsqueeze(-1)

        if Preview == "none":
            result = torch.cat((foreground, alpha), dim=-1)
        else:
            color_map = {
                "Black": [0, 0, 0],
                "White": [1, 1, 1],
                "Gray": [0.5, 0.5, 0.5],
                "Red": [1, 0, 0],
                "Green": [0, 1, 0],
                "Blue": [0, 0, 1],
            }
            background_color_rgb = color_map.get(Preview, [0, 0, 0])
            background = torch.tensor(background_color_rgb).view(1, 1, 1, 3).repeat(
                foreground.shape[0], foreground.shape[1], foreground.shape[2], 1
            )
            result = foreground * alpha + background * (1 - alpha)

        return (result, mask)