# kaytool/nodes/load_image_folder.py
import os
import torch
import numpy as np
from PIL import Image, ImageOps
import folder_paths

class LoadImageFolder:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "path": ("STRING", {
                    "default": "",
                    "tooltip": "Path to folder containing images"
                }),
                "subfolders": ("BOOLEAN", {
                    "default": False,
                    "tooltip": "Include images from subfolders"
                })
            }
        }

    CATEGORY = "KayTool"
    RETURN_TYPES = ("IMAGE", "MASK")
    RETURN_NAMES = ("images", "masks")
    OUTPUT_IS_LIST = (True, True)
    FUNCTION = "load_images"
    OUTPUT_NODE = True

    def load_images(self, path, subfolders):
       
        valid_extensions = ['.jpg', '.jpeg', '.png', '.bmp']

        
        target_dir = path if path and os.path.isdir(path) else folder_paths.get_input_directory()

       
        def get_image_files(directory, include_subfolders):
            image_files = []
            if include_subfolders:
                for root, _, files in os.walk(directory):
                    for f in files:
                        if any(f.lower().endswith(ext) for ext in valid_extensions):
                            image_files.append(os.path.join(root, f))
            else:
                image_files = [
                    os.path.join(directory, f) for f in os.listdir(directory)
                    if any(f.lower().endswith(ext) for ext in valid_extensions)
                ]
            return sorted(image_files)

        image_files = get_image_files(target_dir, subfolders)

        if not image_files:
            raise FileNotFoundError(f"No valid images found in '{target_dir}'")

      
        images = []
        masks = []

       
        for image_path in image_files:
            try:
                img = Image.open(image_path)
                img = ImageOps.exif_transpose(img)

            
                if img.mode == 'RGBA':
                    image = img.convert("RGB")
                    mask = np.array(img.split()[3]).astype(np.float32) / 255.0
                    mask = 1. - torch.from_numpy(mask)
                else:
                    image = img.convert("RGB")
                    mask = torch.zeros((img.height, img.width), dtype=torch.float32)

                image_np = np.array(image).astype(np.float32) / 255.0
                image_tensor = torch.from_numpy(image_np)[None,]

                images.append(image_tensor)
                masks.append(mask.unsqueeze(0))

            except Exception as e:
                print(f"Error loading {image_path}: {str(e)}")
                continue

       
        if not images:
            placeholder_image = torch.zeros((1, 64, 64, 3), dtype=torch.float32)
            placeholder_mask = torch.zeros((1, 64, 64), dtype=torch.float32)
            return ([placeholder_image], [placeholder_mask])

        return (images, masks)

    @classmethod
    def IS_CHANGED(s, path, subfolders):
        if not path or not os.path.isdir(path):
            return float("NaN")
        return float(os.path.getmtime(path))

    @classmethod
    def VALIDATE_INPUTS(s, path, subfolders):
        if path and not os.path.isdir(path):
            return f"Invalid path: {path}"
        return True