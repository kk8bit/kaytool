from .nodes.custom_save_image import CustomSaveImage
from .nodes.color_adjustment import ColorAdjustment

NODE_CLASS_MAPPINGS = {
    "Custom_Save_Image": CustomSaveImage,
    "Color_Adjustment": ColorAdjustment,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "Custom_Save_Image": "Custom Save Image",
    "Color_Adjustment": "Color Adjustment",
}