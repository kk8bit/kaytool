import os
import json
import re
import random
import string
import numpy as np
from PIL import Image
from PIL.PngImagePlugin import PngInfo
from PIL import ImageCms
from datetime import datetime
import folder_paths
import shutil

class CustomSaveImage:
    def __init__(self):
        self.compress_level = 4

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "preview_only": ("BOOLEAN", {"default": False}),
                "images": ("IMAGE",),
                "filename_prefix": ("STRING", {
                    "default": "Custom_Save_Image",
                    "tooltip": "Supports: %KSampler.seed%, %KSampler.steps%, %KSampler.cfg%, %KSampler.sampler_name%, %KSampler.scheduler%, %KSampler.denoise%, %date:yyyy-MM-dd%, %time:HH-mm-ss%, %width%, %height%"
                }),
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

    def save_images(self, images, preview_only=False, filename_prefix="Custom_Save_Image", save_metadata=True, format="PNG", 
                    jpg_quality=95, author="", copyright_info="", color_profile="sRGB IEC61966-2.1", prompt=None, extra_pnginfo=None):
        temp_dir = folder_paths.get_temp_directory()
        os.makedirs(temp_dir, exist_ok=True)

        output_dir = self.get_output_directory() if not preview_only else None
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)

        results = []
        srgb_profile_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'resources', 'sRGB Profile.icc')
        adobergb_profile_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'resources', 'AdobeRGB1998.icc')

        for idx, image in enumerate(images):
            i = 255. * image.cpu().numpy()
            img = Image.fromarray(np.clip(i, 0, 255).astype(np.uint8))

            if color_profile == "Adobe RGB (1998)":
                img = self.convert_to_adobe_rgb(img, srgb_profile_path, adobergb_profile_path)
                icc_profile_path = adobergb_profile_path
            else:
                icc_profile_path = srgb_profile_path

            icc_profile = self.load_icc_profile(icc_profile_path)

  
            base_prefix = self.parse_filename_prefix(filename_prefix, prompt, image)
            temp_prefix = f"{base_prefix}_temp_{''.join(random.choice(string.ascii_lowercase) for _ in range(5))}"

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

                temp_filename = f"{temp_prefix}_{self.get_unique_filename(idx)}.{format.lower()}"
                temp_full_path = os.path.join(temp_dir, temp_filename)
                img.save(temp_full_path, pnginfo=metadata, icc_profile=icc_profile)

            else:
                if format == "PNG":
                    metadata = PngInfo()
                    if author:
                        metadata.add_text("Author", author)
                    if copyright_info:
                        metadata.add_text("Copyright", copyright_info)

                    temp_filename = f"{temp_prefix}_{self.get_unique_filename(idx)}.png"
                    temp_full_path = os.path.join(temp_dir, temp_filename)
                    img.save(temp_full_path, pnginfo=metadata, icc_profile=icc_profile)

                elif format == "JPG":
                    exif_data = img.getexif()
                    if author:
                        exif_data[0x013B] = author
                    if copyright_info:
                        exif_data[0x8298] = copyright_info
                    exif_bytes = exif_data.tobytes()

                    temp_filename = f"{temp_prefix}_{self.get_unique_filename(idx)}.jpg"
                    temp_full_path = os.path.join(temp_dir, temp_filename)
                    img.save(temp_full_path, quality=jpg_quality, exif=exif_bytes, icc_profile=icc_profile)


            results.append({
                "filename": temp_filename,
                "subfolder": "",
                "type": "temp",
            })


            if not preview_only:
                final_filename = f"{base_prefix}_{self.get_unique_filename(idx)}.{format.lower()}"
                final_full_path = os.path.join(output_dir, final_filename)
                shutil.copy2(temp_full_path, final_full_path)

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

    def get_unique_filename(self, idx):
        import time
        return f"{int(time.time() * 1000)}_{idx:03d}" 

    def get_output_directory(self):
        return os.path.join(os.getcwd(), "output", "Custom_Save_Image")

    def parse_filename_prefix(self, prefix, prompt, image):

        if not prefix or not isinstance(prefix, str):
            return "Custom_Save_Image"


        def replace_date_time(match):
            prefix_type, format_str = match.group(1), match.group(2)
            try:
                format_str = (format_str.replace('yyyy', '%Y')
                                       .replace('MM', '%m')
                                       .replace('dd', '%d')
                                       .replace('HH', '%H')
                                       .replace('mm', '%M')
                                       .replace('ss', '%S'))
                now = datetime.now()
                return now.strftime(format_str)
            except ValueError:
                return match.group(0)


        prefix = re.sub(r'(%date|%time):([^%]+)%', replace_date_time, prefix)


        ksamplers = self.extractksampler_from_prompt(prompt)

        
        for index, params in enumerate(ksamplers, start=1):
            for key, value in params.items():
                placeholder = f'%KSampler.{key}%' if len(ksamplers) == 1 else f'%KSampler_{index}.{key}%'
                prefix = prefix.replace(placeholder, str(value))


        if image is not None:
            height, width, _ = image.shape 
            prefix = prefix.replace('%width%', str(width))  
            prefix = prefix.replace('%height%', str(height)) 

        return prefix

    def extractksampler_from_prompt(self, prompt):
        """从 prompt 中提取所有 KSampler 的参数"""
        ksamplers = []
        for node_id, node_data in prompt.items():
            if isinstance(node_data, dict) and node_data.get("class_type") == "KSampler":
                inputs = node_data.get("inputs", {})
                params = {}
                for key in ["seed", "steps", "cfg", "sampler_name", "scheduler", "denoise"]:
                    if key in inputs:
                        params[key] = inputs[key]
                ksamplers.append(params)
        return ksamplers