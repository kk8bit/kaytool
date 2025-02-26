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
from .nodes.slider_1000 import Slider1000
from .nodes.slider_100 import Slider100
from .nodes.slider_10 import Slider10
from .nodes.to_int import ToInt  

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
    "Slider_1000": Slider1000,
    "Slider_100": Slider100,
    "Slider_10": Slider10,
    "To_Int": ToInt  
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
    "Slider_1000": "Slider 1000",
    "Slider_100": "Slider 100",
    "Slider_10": "Slider 10",
    "To_Int": "To Int"  
}

WEB_DIRECTORY = "web"