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
from .nodes.remove_bg import RemoveBG
from .nodes.rembg_loader import RemBGLoader 
from .nodes.birefnet_loader import BiRefNetLoader 
from .nodes.preview_mask import PreviewMask
from .nodes.mask_blur_plus import MaskBlurPlus 
from .nodes.preview_mask_plus import PreviewMaskPlus

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
    "To_Int": ToInt,
    "Remove_BG": RemoveBG,
    "RemBG_Loader": RemBGLoader,  
    "BiRefNet_Loader": BiRefNetLoader, 
    "Preview_Mask": PreviewMask,
    "Mask_Blur_Plus": MaskBlurPlus,  
    "Preview_Mask_Plus": PreviewMaskPlus,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "Custom_Save_Image": "𝙆 Custom Save Image",
    "Color_Adjustment": "𝙆 Color Adjustment",
    "Strong_Prompt": "𝙆 Strong Prompt",
    "Baidu_Translater": "𝙆 Baidu Translater",
    "Display_Any": "𝙆 Display Any",
    "Abc_Math": "𝙆 abc Math",
    "Image_Size_Extractor": "𝙆 Image Size Extractor",
    "Tencent_Translater": "𝙆 Tencent Translater",
    "Text": "𝙆 Text",
    "AIO_Translater": "𝙆 AIO Translater",
    "Slider_1000": "𝙆 Slider 1000",
    "Slider_100": "𝙆 Slider 100",
    "Slider_10": "𝙆 Slider 10",
    "To_Int": "𝙆 To Int",
    "Remove_BG": "𝙆 Remove BG",
    "RemBG_Loader": "𝙆 RemBG Loader",  
    "BiRefNet_Loader": "𝙆 BiRefNet Loader",  
    "Preview_Mask": "𝙆 Preview Mask",
    "Mask_Blur_Plus": "𝙆 Mask Blur +",  
    "Preview_Mask_Plus": "𝙆 Preview Mask +",
}

WEB_DIRECTORY = "web"