import os
import json
from aiohttp import web
from .api import resources
from .api import clean_vram 

from .nodes.custom_save_image import CustomSaveImage
from .nodes.color_adjustment import ColorAdjustment
from .nodes.strong_prompt import StrongPrompt
from .nodes.display_any import DisplayAny
from .nodes.abc_math import AbcMath
from .nodes.image_size_extractor import ImageSizeExtractor
from .nodes.text import Text
from .nodes.slider_1000 import Slider1000
from .nodes.slider_100 import Slider100
from .nodes.slider_10 import Slider10
from .nodes.to_int import ToInt
from .nodes.remove_bg import RemoveBG
from .nodes.rembg_loader import RemBGLoader
from .nodes.birefnet_loader import KayBiRefNetLoader 
from .nodes.preview_mask import PreviewMask
from .nodes.mask_blur_plus import MaskBlurPlus
from .nodes.preview_mask_plus import PreviewMaskPlus
from .nodes.ab_images import ABImages
from .nodes.load_image_folder import LoadImageFolder
from .nodes.image_composer import ImageComposer
from .nodes.image_cropper import ImageCropper
from .nodes.image_resizer import ImageResizer
from .nodes.mask_filler import MaskFiller
from .nodes.image_mask_composer import ImageMaskComposer

NODE_CLASS_MAPPINGS = {
    "Custom_Save_Image": CustomSaveImage,
    "Color_Adjustment": ColorAdjustment,
    "Strong_Prompt": StrongPrompt,
    "Display_Any": DisplayAny,
    "Abc_Math": AbcMath,
    "Image_Size_Extractor": ImageSizeExtractor,
    "Text": Text,
    "Slider_1000": Slider1000,
    "Slider_100": Slider100,
    "Slider_10": Slider10,
    "To_Int": ToInt,
    "Remove_BG": RemoveBG,
    "RemBG_Loader": RemBGLoader,
    "Kay_BiRefNet_Loader": KayBiRefNetLoader,  
    "Preview_Mask": PreviewMask,
    "Mask_Blur_Plus": MaskBlurPlus,
    "Preview_Mask_Plus": PreviewMaskPlus,
    "AB_Images": ABImages,
    "Load_Image_Folder": LoadImageFolder,
    "Image_Composer": ImageComposer,
    "Image_Cropper": ImageCropper,
    "Image_Resizer": ImageResizer,
    "Mask_Filler": MaskFiller,
    "Image_Mask_Composer": ImageMaskComposer,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "Custom_Save_Image": "𝙆 Custom Save Image",
    "Color_Adjustment": "𝙆 Color Adjustment",
    "Strong_Prompt": "𝙆 Strong Prompt",
    "Display_Any": "𝙆 Display Any",
    "Abc_Math": "𝙆 abc Math",
    "Image_Size_Extractor": "𝙆 Image Size Extractor",
    "Text": "𝙆 Text",
    "Slider_1000": "𝙆 Slider 1000",
    "Slider_100": "𝙆 Slider 100",
    "Slider_10": "𝙆 Slider 10",
    "To_Int": "𝙆 To Int",
    "Remove_BG": "𝙆 Remove BG",
    "RemBG_Loader": "𝙆 RemBG Loader",
    "Kay_BiRefNet_Loader": "𝙆 BiRefNet Loader",  
    "Preview_Mask": "𝙆 Preview Mask",
    "Mask_Blur_Plus": "𝙆 Mask Blur +",
    "Preview_Mask_Plus": "𝙆 Preview Mask +",
    "AB_Images": "𝙆 ab Images",
    "Load_Image_Folder": "𝙆 Load Image Folder",
    "Image_Composer": "𝙆 Image Composer",
    "Image_Cropper": "𝙆 Image Cropper",
    "Image_Resizer": "𝙆 Image Resizer",
    "Mask_Filler": "𝙆 Mask Filler",
    "Image_Mask_Composer": "𝙆 Image Mask Composer",
}

WEB_DIRECTORY = "web"