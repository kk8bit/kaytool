import os
import json
import numpy as np
from PIL import Image
from PIL.PngImagePlugin import PngInfo
from PIL import ImageCms

class CustomSaveImage:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "images": ("IMAGE",),
                "filename_prefix": ("STRING", {"default": "Custom_Save_Image"}),
                "color_profile": (["sRGB IEC61966-2.1", "Adobe RGB (1998)"], {"default": "sRGB IEC61966-2.1"}),
                "format": (["PNG", "JPG"], {"default": "PNG"}),
                "jpg_quality": ("INT", {"default": 95, "min": 0, "max": 100}),
                "author": ("STRING", {"default": ""}),
                "copyright_info": ("STRING", {"default": ""}),
                "save_metadata": ("BOOLEAN", {"default": False}),
            },
            "hidden": {"prompt": "PROMPT", "extra_pnginfo": "EXTRA_PNGINFO"},
        }

    RETURN_TYPES = ()
    FUNCTION = "save_images"
    OUTPUT_NODE = True
    CATEGORY = "KayTool"

    def save_images(self, images, filename_prefix="Custom_Save_Image", save_metadata=True, format="PNG", jpg_quality=95, 
                    author="", copyright_info="", color_profile="sRGB IEC61966-2.1", prompt=None, extra_pnginfo=None):
        output_dir = self.get_output_directory()
        os.makedirs(output_dir, exist_ok=True)

        results = []
        # 更新 ICC profile 路径
        srgb_profile_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'resources', 'sRGB Profile.icc')
        adobergb_profile_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'resources', 'AdobeRGB1998.icc')

        for image in images:
            i = 255. * image.cpu().numpy()
            img = Image.fromarray(np.clip(i, 0, 255).astype(np.uint8))

            if color_profile == "Adobe RGB (1998)":
                img = self.convert_to_adobe_rgb(img, srgb_profile_path, adobergb_profile_path)
                icc_profile_path = adobergb_profile_path
            else:
                icc_profile_path = srgb_profile_path

            icc_profile = self.load_icc_profile(icc_profile_path)

            if save_metadata:
                metadata = PngInfo()
                if author:
                    metadata.add_text("Author", author)
                if copyright_info:
                    metadata.add_text("Copyright", copyright_info)
                if prompt is not None:
                    metadata.add_text("prompt", json.dumps(prompt))
                if extra_pnginfo is not None:
                    for k, v in extra_pnginfo.items():
                        metadata.add_text(k, json.dumps(v))

                filename = f"{filename_prefix}_{self.get_unique_filename()}.png"
                full_output_path = os.path.join(output_dir, filename)
                img.save(full_output_path, pnginfo=metadata, icc_profile=icc_profile)

            else:
                if format == "PNG":
                    metadata = PngInfo()
                    if author:
                        metadata.add_text("Author", author)
                    if copyright_info:
                        metadata.add_text("Copyright", copyright_info)

                    filename = f"{filename_prefix}_{self.get_unique_filename()}.png"
                    full_output_path = os.path.join(output_dir, filename)
                    img.save(full_output_path, pnginfo=metadata, icc_profile=icc_profile)

                elif format == "JPG":
                    exif_data = img.getexif()
                    if author:
                        exif_data[0x013B] = author
                    if copyright_info:
                        exif_data[0x8298] = copyright_info
                    exif_bytes = exif_data.tobytes()

                    filename = f"{filename_prefix}_{self.get_unique_filename()}.jpg"
                    full_output_path = os.path.join(output_dir, filename)
                    img.save(full_output_path, quality=jpg_quality, exif=exif_bytes, icc_profile=icc_profile)

            results.append({
                "filename": filename,
                "subfolder": "Custom_Save_Image",
                "type": "output",
            })

        return {"ui": {"images": results}, "status": "Images saved successfully"}

    def convert_to_adobe_rgb(self, img, srgb_profile_path, adobergb_profile_path):
        srgb_profile = ImageCms.getOpenProfile(srgb_profile_path)
        adobergb_profile = ImageCms.getOpenProfile(adobergb_profile_path)
        img = ImageCms.profileToProfile(img, srgb_profile, adobergb_profile)
        return img

    def load_icc_profile(self, path):
        try:
            with open(path, "rb") as f:
                return f.read()
        except FileNotFoundError:
            raise Exception(f"ICC profile not found at: {path}")

    def get_unique_filename(self):
        import time
        return f"{int(time.time() * 1000)}"

    def get_output_directory(self):
        return os.path.join(os.getcwd(), "output", "Custom_Save_Image")