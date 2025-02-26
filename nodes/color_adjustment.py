import os
import numpy as np
from PIL import Image, ImageEnhance
import torch
import subprocess

try:
    import pilgram
except ImportError:
    subprocess.check_call(['pip', 'install', 'pilgram'])


def tensor2pil(image):
    return Image.fromarray(np.clip(255. * image.cpu().numpy().squeeze(), 0, 255).astype(np.uint8))

# 将 PIL 图像转换为 tensor
def pil2tensor(image):
    return torch.from_numpy(np.array(image).astype(np.float32) / 255.0).unsqueeze(0)


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
                "exposure": ("FLOAT", {
                    "default": 0,
                    "min": -100,
                    "max": 100,
                    "step": 1,
                    "display": "slider"
                }),
                "contrast": ("FLOAT", {
                    "default": 0,
                    "min": -100,
                    "max": 100,
                    "step": 1,
                    "display": "slider"
                }),
                "temperature": ("FLOAT", {
                    "default": 0,
                    "min": -100,
                    "max": 100,
                    "step": 1,
                    "display": "slider"
                }),
                "tint": ("FLOAT", {
                    "default": 0,
                    "min": -100,
                    "max": 100,
                    "step": 1,
                    "display": "slider"
                }),
                "saturation": ("FLOAT", {
                    "default": 0,
                    "min": -100,
                    "max": 100,
                    "step": 1,
                    "display": "slider"
                }),
                "style": (get_pilgram_filters(),),
                "strength": ("FLOAT", {
                    "default": 100,
                    "min": 0,
                    "max": 100,
                    "step": 1,
                    "display": "slider"
                })
            },
            "optional": {
                "All": ("BOOLEAN", {"default": False}),
            },
        }

    RETURN_TYPES = ("IMAGE",)
    FUNCTION = "apply_filter"
    CATEGORY = "KayTool"

    def apply_filter(self, image, exposure=0, contrast=0, temperature=0, tint=0, saturation=0, style="None", strength=100, All=False):
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
                    filtered_image = self.apply_strength(filter_func(pil_img), pil_img, strength)
                    tensors.append(pil2tensor(filtered_image))

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
                    filtered_img = filter_func(pil_img)
                    pil_img = self.apply_strength(filtered_img, pil_img, strength)

                tensors.append(pil2tensor(pil_img))

            tensors = torch.cat(tensors, dim=0)
            return (tensors,)

    # 根据强度应用滤镜
    def apply_strength(self, filtered_img, original_img, strength):
        if strength == 100:
            return filtered_img
        elif strength == 0:
            return original_img
        else:
            return Image.blend(original_img, filtered_img, strength / 100.0)

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