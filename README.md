# KayTool

[中文说明](./README.zh.md)


KayTool is a custom node utility package developed for ComfyUI. I plan to add more features in the future.

# Custom Save Images Node:
![preview_custom_save_image_node](https://github.com/user-attachments/assets/4934de86-e723-450d-b0bb-817f23b20cff)

## Current Features:
- Choose the image format to save (PNG or JPG)
- Option to save metadata (workflow information)
- Support for two color profiles (sRGB IEC61966-2.1 and Adobe RGB (1998))
- Automatically convert images to Adobe RGB when selected, ensuring color accuracy
- Customize JPG image vquality (0-100)
- Ability to embed author and copyright information
- Automatically generate unique filenames
- Automatically create a `custom_save_images` folder in the default `output` directory to save all images

## Additional Notes:
- To save in **JPG** format, the **metadata** option must be set to **False**.
- When saving with **metadata** (workflow information), the format will automatically switch to **PNG**, and any **JPG** settings will be ignored.
- For smaller file sizes without noticeable quality loss, set the **JPG** quality to 40. Lower values may cause visible compression artifacts (blockiness).

# Installation and Usage:
Clone this project into your `ComfyUI/custom_nodes` directory, and make sure to place the `sRGB Profile.icc` and `AdobeRGB1998.icc` files in the `resources` directory.