import os
import numpy as np
from PIL import Image, ImageEnhance
import torch
import subprocess

# 安装 pilgram 库（如果尚未安装）
try:
    import pilgram
except ImportError:
    subprocess.check_call(['pip', 'install', 'pilgram'])

# 将 tensor 转换为 PIL 图像
def tensor2pil(image):
    return Image.fromarray(np.clip(255. * image.cpu().numpy().squeeze(), 0, 255).astype(np.uint8))

# 将 PIL 图像转换为 tensor
def pil2tensor(image):
    return torch.from_numpy(np.array(image).astype(np.float32) / 255.0).unsqueeze(0)

# 动态获取所有 pilgram 滤镜，并为每个滤镜编号，增加一个 "None" 选项
def get_pilgram_filters():
    filters = [f for f in dir(pilgram) if not f.startswith('_') and callable(getattr(pilgram, f))]
    numbered_filters = [f"{i+1}_{filters[i]}" for i in range(len(filters))]
    numbered_filters.insert(0, "None")
    return numbered_filters

class ColorAdjustment:
    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "image": ("IMAGE",),
                "exposure": ("INT", {"default": 0, "min": -100, "max": 100}),
                "contrast": ("INT", {"default": 0, "min": -100, "max": 100}),
                "temperature": ("INT", {"default": 0, "min": -100, "max": 100}),  # 色温
                "tint": ("INT", {"default": 0, "min": -100, "max": 100}),
                "saturation": ("INT", {"default": 0, "min": -100, "max": 100}),
                "style": (get_pilgram_filters(),),
            },
            "optional": {
                "All": ("BOOLEAN", {"default": False}),
            },
        }

    RETURN_TYPES = ("IMAGE",)
    FUNCTION = "apply_filter"
    CATEGORY = "KayTool"

    def apply_filter(self, image, exposure=0, contrast=0, temperature=0, tint=0, saturation=0, style="None", All=False):
        if All:
            tensors = []
            for img in image:
                pil_img = tensor2pil(img)
                pil_img = self.adjust_exposure_contrast_color(pil_img, exposure, contrast, temperature, tint, saturation)

                for filter_name in get_pilgram_filters():
                    if filter_name == "None":
                        continue
                    filter_name_clean = filter_name.split('_', 1)[1]
                    filter_func = getattr(pilgram, filter_name_clean)
                    filtered_image = pil2tensor(filter_func(pil_img))
                    tensors.append(filtered_image)

            tensors = torch.cat(tensors, dim=0)
            return (tensors,)
        else:
            tensors = []
            for img in image:
                pil_img = tensor2pil(img)
                pil_img = self.adjust_exposure_contrast_color(pil_img, exposure, contrast, temperature, tint, saturation)

                if style != "None":
                    filter_name_clean = style.split('_', 1)[1]
                    filter_func = getattr(pilgram, filter_name_clean)
                    pil_img = filter_func(pil_img)

                tensors.append(pil2tensor(pil_img))

            tensors = torch.cat(tensors, dim=0)
            return (tensors,)

    # 调整曝光、对比度、色温、色调和饱和度的方法
    def adjust_exposure_contrast_color(self, img, exposure, contrast, temperature, tint, saturation):
        if exposure == 0 and contrast == 0 and temperature == 0 and tint == 0 and saturation == 0:
            return img

        if exposure != 0:
            exposure_factor = 1 + (exposure / 100.0)
            enhancer = ImageEnhance.Brightness(img)
            img = enhancer.enhance(exposure_factor)

        if contrast != 0:
            contrast_factor = 1 + (contrast / 100.0)
            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(contrast_factor)

        if temperature != 0:
            img = self.adjust_temperature(img, temperature)

        if tint != 0:
            img = self.adjust_tint(img, tint)

        if saturation != 0:
            saturation_factor = 1 + (saturation / 100.0)
            enhancer = ImageEnhance.Color(img)
            img = enhancer.enhance(saturation_factor)

        return img

    # 色温调整函数（负值增加蓝色，正值增加黄色）
    def adjust_temperature(self, img, temperature):
        img_array = np.array(img)
        if temperature > 0:
            img_array[:, :, 2] = np.clip(img_array[:, :, 2] * (1 - temperature / 100.0), 0, 255)
            img_array[:, :, 0] = np.clip(img_array[:, :, 0] * (1 + temperature / 100.0), 0, 255)
        else:
            img_array[:, :, 2] = np.clip(img_array[:, :, 2] * (1 + abs(temperature) / 100.0), 0, 255)
            img_array[:, :, 0] = np.clip(img_array[:, :, 0] * (1 - abs(temperature) / 100.0), 0, 255)
        return Image.fromarray(img_array)

    # 色调调整函数
    def adjust_tint(self, img, tint):
        img_array = np.array(img)
        if tint > 0:
            img_array[:, :, 1] = np.clip(img_array[:, :, 1] * (1 - tint / 100.0), 0, 255)
            img_array[:, :, 0] = np.clip(img_array[:, :, 0] * (1 + tint / 100.0), 0, 255)
            img_array[:, :, 2] = np.clip(img_array[:, :, 2] * (1 + tint / 100.0), 0, 255)
        else:
            img_array[:, :, 1] = np.clip(img_array[:, :, 1] * (1 + abs(tint) / 100.0), 0, 255)
            img_array[:, :, 0] = np.clip(img_array[:, :, 0] * (1 - abs(tint) / 100.0), 0, 255)
            img_array[:, :, 2] = np.clip(img_array[:, :, 2] * (1 - abs(tint) / 100.0), 0, 255)
        return Image.fromarray(img_array)