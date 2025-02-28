import torch
from torchvision import transforms as T
import comfy.model_management
import torch.nn.functional as F

class RemoveBG:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "rembg_loader": ("REMBG_LOADER",),  # 确保类型与 RemBGLoader 输出一致
                "image": ("IMAGE",),
                "Preview": ([
                    "none",
                    "Black",
                    "White",
                    "Red",
                    "Green",
                    "Blue"
                ],),
                "Blur": ("INT", {
                    "default": 0,
                    "min": 0,
                    "max": 256,
                    "step": 1,
                    "display": "slider"
                }),
                "Expand": ("FLOAT", {
                    "default": 0.0,
                    "min": -5.0,
                    "max": 5.0,
                    "step": 0.1,
                    "display": "slider"
                }),
            },
        }

    RETURN_TYPES = ("IMAGE", "MASK",)
    FUNCTION = "execute"
    CATEGORY = "KayTool/Background Removal"

    def execute(self, rembg_loader, image, Preview, Blur, Expand):
        # 图像预处理
        image = image.permute([0, 3, 1, 2])
        output = []
        for img in image:
            img_pil = T.ToPILImage()(img)
            img_processed = rembg_loader.process(img_pil)
            img_tensor = T.ToTensor()(img_processed)
            output.append(img_tensor)
        output = torch.stack(output, dim=0)
        output = output.permute([0, 2, 3, 1])

        # 提取遮罩
        mask = output[:, :, :, 3] if output.shape[3] == 4 else torch.ones_like(output[:, :, :, 0])
        foreground = image.permute([0, 2, 3, 1])[:, :, :, :3] if image.shape[1] == 4 else image.permute([0, 2, 3, 1])

        # 遮罩预处理
        if mask.dim() == 2:
            mask = mask.unsqueeze(0)
        device = comfy.model_management.get_torch_device()
        mask = mask.to(device)

        # 遮罩扩展
        if Expand != 0.0:
            expand_pixels = int(abs(Expand) * 10)
            kernel_size = 2 * expand_pixels + 1
            padding = expand_pixels
            if Expand > 0.0:
                mask = F.max_pool2d(mask.unsqueeze(1), kernel_size=kernel_size, stride=1, padding=padding).squeeze(1)
            else:
                mask = -F.max_pool2d(-mask.unsqueeze(1), kernel_size=kernel_size, stride=1, padding=padding).squeeze(1)

        # 遮罩模糊
        if Blur > 0:
            if Blur % 2 == 0:
                Blur += 1
            mask = T.functional.gaussian_blur(mask.unsqueeze(1), kernel_size=int(Blur)).squeeze(1)

        mask = mask.to(comfy.model_management.intermediate_device())
        alpha = mask.unsqueeze(-1).repeat(1, 1, 1, 3)

        # 根据 Preview 选项生成结果
        if Preview == "none":
            return (foreground * alpha, mask)

        color_map = {
            "Black": [0, 0, 0],
            "White": [1, 1, 1],
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