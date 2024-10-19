import os
import json
import numpy as np
from PIL import Image
from PIL.PngImagePlugin import PngInfo
from PIL import ExifTags, TiffImagePlugin, ImageCms

class CustomSaveImage:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "images": ("IMAGE",),
                "filename_prefix": ("STRING", {"default": "Custom_Save_Image"}),
                "save_metadata": ("BOOLEAN", {"default": True}),
                "color_profile": (["sRGB IEC61966-2.1", "Adobe RGB (1998)"], {"default": "sRGB IEC61966-2.1"}),  # 将 color_profile 移到 save_metadata 下面
                "format": (["PNG", "JPG"], {"default": "PNG"}),
                "jpg_quality": ("INT", {"default": 95, "min": 0, "max": 100}),
                "author": ("STRING", {"default": ""}),
                "copyright_info": ("STRING", {"default": ""})
            },
            "hidden": {"prompt": "PROMPT", "extra_pnginfo": "EXTRA_PNGINFO"},
        }

    RETURN_TYPES = ()
    FUNCTION = "save_images"

    OUTPUT_NODE = True

    CATEGORY = "KayTool"

    def save_images(self, images, filename_prefix="Custom_Save_Image", save_metadata=True, format="PNG", jpg_quality=95, author="", copyright_info="", color_profile="sRGB IEC61966-2.1", prompt=None, extra_pnginfo=None):
        output_dir = self.get_output_directory()
        os.makedirs(output_dir, exist_ok=True)  # 确保目录存在

        results = []  # 存储图片保存路径以供UI预览使用

        # 动态获取 sRGB 和 AdobeRGB 的 ICC profile 路径
        srgb_profile_path = os.path.join(os.path.dirname(__file__), 'resources', 'sRGB Profile.icc')
        adobergb_profile_path = os.path.join(os.path.dirname(__file__), 'resources', 'AdobeRGB1998.icc')

        for image in images:
            i = 255. * image.cpu().numpy()
            img = Image.fromarray(np.clip(i, 0, 255).astype(np.uint8))

            # 处理颜色配置文件
            if color_profile == "Adobe RGB (1998)":
                img = self.convert_to_adobe_rgb(img, srgb_profile_path, adobergb_profile_path)
                icc_profile_path = adobergb_profile_path
            else:
                icc_profile_path = srgb_profile_path

            # 加载选择的 ICC profile
            icc_profile = self.load_icc_profile(icc_profile_path)

            # 如果 save_metadata 为 True，默认保存为 PNG
            if save_metadata:
                metadata = PngInfo()

                # 无论 save_metadata，始终嵌入作者和版权信息
                if author:
                    metadata.add_text("Author", author)
                if copyright_info:
                    metadata.add_text("Copyright", copyright_info)

                # 嵌入额外元数据
                if prompt is not None:
                    metadata.add_text("prompt", json.dumps(prompt))
                if extra_pnginfo is not None:
                    for k, v in extra_pnginfo.items():
                        metadata.add_text(k, json.dumps(v))

                # 保存为 PNG 格式，嵌入所选颜色配置文件
                filename = f"{filename_prefix}_{self.get_unique_filename()}.png"
                full_output_path = os.path.join(output_dir, filename)
                img.save(full_output_path, pnginfo=metadata, icc_profile=icc_profile)

            # 如果 save_metadata 为 False，保存为指定的格式
            else:
                if format == "PNG":
                    metadata = PngInfo()

                    # 嵌入作者和版权信息
                    if author:
                        metadata.add_text("Author", author)
                    if copyright_info:
                        metadata.add_text("Copyright", copyright_info)

                    # 保存为 PNG 格式
                    filename = f"{filename_prefix}_{self.get_unique_filename()}.png"
                    full_output_path = os.path.join(output_dir, filename)
                    img.save(full_output_path, pnginfo=metadata, icc_profile=icc_profile)

                elif format == "JPG":
                    exif_data = img.getexif()

                    # 嵌入作者和版权信息
                    if author:
                        exif_data[0x013B] = author  # EXIF中的作者字段（Artist）
                    if copyright_info:
                        exif_data[0x8298] = copyright_info  # EXIF中的版权字段（Copyright）

                    exif_bytes = exif_data.tobytes()

                    # 保存为 JPG 格式，附加 EXIF 和 ICC profile
                    filename = f"{filename_prefix}_{self.get_unique_filename()}.jpg"
                    full_output_path = os.path.join(output_dir, filename)
                    img.save(full_output_path, quality=jpg_quality, exif=exif_bytes, icc_profile=icc_profile)

            # 添加保存的图片信息用于UI预览
            results.append({
                "filename": filename,
                "subfolder": "Custom_Save_Image",
                "type": "output",
            })

        # 返回给UI的图片预览信息
        return {"ui": {"images": results}, "status": "Images saved successfully"}

    def convert_to_adobe_rgb(self, img, srgb_profile_path, adobergb_profile_path):
        """
        将图像从 sRGB 转换为 Adobe RGB
        """
        srgb_profile = ImageCms.getOpenProfile(srgb_profile_path)
        adobergb_profile = ImageCms.getOpenProfile(adobergb_profile_path)
        img = ImageCms.profileToProfile(img, srgb_profile, adobergb_profile)
        return img

    def load_icc_profile(self, path):
        """
        加载 ICC profile，如果加载失败，抛出异常
        """
        try:
            with open(path, "rb") as f:
                return f.read()
        except FileNotFoundError:
            raise Exception(f"ICC profile not found at: {path}")

    def get_unique_filename(self):
        """
        生成基于时间戳的唯一文件名
        """
        import time
        return f"{int(time.time() * 1000)}"

    def get_output_directory(self):
        """
        返回输出目录
        """
        return os.path.join(os.getcwd(), "output", "Custom_Save_Image")

# 这个函数用于注册节点
def register_custom_node():
    NODE_CLASS_MAPPINGS = {"CustomSaveImage": CustomSaveImage}
    NODE_DISPLAY_NAME_MAPPINGS = {"CustomSaveImage": "Custom Save Image"}
    return NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS