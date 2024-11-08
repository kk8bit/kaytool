# KayTool

[中文说明](./README.zh.md) | [Changelog](./CHANGELOG.md)


KayTool is a custom node utility package developed for ComfyUI. I plan to add more features in the future.

# Custom Save Images Node:
![preview_custom_save_image_node](https://github.com/user-attachments/assets/c11c03e4-31e0-4c05-be6e-27d1835c161b)

## Current Features:
### ColorAdjustment Node Feature Description

- Supports adjustments for image exposure, contrast, color temperature, tint, and saturation
    - Exposure and Contrast: Range from -100 to +100
    - Color Temperature: Range from -100 to +100, where negative values add blue and positive values add yellow
    - Tint: Range from -100 to +100, where negative values add green and positive values add magenta
    - Saturation: Range from -100 to +100

- Provides a selection list of popular Instagram-style filters for easy application.
    - All filters are sequentially numbered, with an added "None" option to apply no filter

- Customizable filter strength
    - Strength ranges from 0 to 100 (0 means no filter applied, 100 means full filter application)

- Option to "apply all filters" generates and returns a sequence of images with each filter effect applied

- After adjusting exposure, contrast, color temperature, tint, and saturation, the selected filter is applied

### CustomSaveImage Node Feature Description (English)

- Choose the image format for saving (PNG or JPG)
- Customizable JPG image quality (0-100)
- Supports two color profiles (sRGB IEC61966-2.1 and Adobe RGB (1998))
    - When Adobe RGB is selected, the image is automatically converted to the Adobe RGB color space to ensure color accuracy
- Option to save metadata (including workflow information, author, copyright info, and custom prompts)
- Customizable metadata fields:
    - Author
    - Copyright Info
- Automatically generates a unique filename to ensure each saved image has a distinct name
- Automatically creates an output folder `output/Custom_Save_Image` to store all generated images
- When saved in PNG format, metadata is stored as PNG information (PngInfo); when saved in JPG format, metadata is stored in EXIF format

## Additional Notes:
- To save in **JPG** format, the **metadata** option must be set to **False**.
- When saving with **metadata** (workflow information), the format will automatically switch to **PNG**, and any **JPG** settings will be ignored.
- For smaller file sizes without noticeable quality loss, set the **JPG** quality to 40. Lower values may cause visible compression artifacts (blockiness).

# Installation and Usage:
Clone this project into your `ComfyUI/custom_nodes` directory, and make sure to place the `sRGB Profile.icc` and `AdobeRGB1998.icc` files in the `resources` directory.