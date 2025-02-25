import os

from .nodes.custom_save_image import CustomSaveImage
from .nodes.color_adjustment import ColorAdjustment
from .nodes.strong_prompt import StrongPrompt
from .nodes.baidu_translater import BaiduTranslater
from .nodes.display_any import DisplayAny
from .nodes.abc_math import AbcMath
from .nodes.image_size_extractor import ImageSizeExtractor
from .nodes.tencent_translater import TencentTranslater
from .nodes.text import Text 
from .nodes.aio_translater import AIOTranslater 

NODE_CLASS_MAPPINGS = {
    "Custom_Save_Image": CustomSaveImage,
    "Color_Adjustment": ColorAdjustment,
    "Strong_Prompt": StrongPrompt,
    "Baidu_Translater": BaiduTranslater,
    "Display_Any": DisplayAny,
    "Abc_Math": AbcMath,
    "Image_Size_Extractor": ImageSizeExtractor,
    "Tencent_Translater": TencentTranslater,
    "Text": Text,
    "AIO_Translater": AIOTranslater,  
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "Custom_Save_Image": "Custom Save Image",
    "Color_Adjustment": "Color Adjustment",
    "Strong_Prompt": "Strong Prompt",
    "Baidu_Translater": "Baidu Translater",
    "Display_Any": "Display Any",
    "Abc_Math": "abc Math",
    "Image_Size_Extractor": "Image Size Extractor",
    "Tencent_Translater": "Tencent Translater",
    "Text": "Text",
    "AIO_Translater": "AIO Translater", 
}

WEB_DIRECTORY = "web"