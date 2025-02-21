import os

# 导入所有节点类
from .nodes.custom_save_image import CustomSaveImage
from .nodes.color_adjustment import ColorAdjustment
from .nodes.strong_prompt import StrongPrompt
from .nodes.baidu_translater import BaiduTranslater
from .nodes.display_any import DisplayAny  # 添加新的 DisplayAny 节点
from .nodes.abc_math import AbcMath  # 确保路径正确
from .nodes.image_size_extractor import ImageSizeExtractor  # 添加 ImageSizeExtractor 节点
from .nodes.tencent_translater import TencentTranslater  # 导入 TencentTranslater 节点

# 节点类映射
NODE_CLASS_MAPPINGS = {
    "Custom_Save_Image": CustomSaveImage,
    "Color_Adjustment": ColorAdjustment,
    "Strong_Prompt": StrongPrompt,
    "Baidu_Translater": BaiduTranslater, 
    "Display_Any": DisplayAny,
    "Abc_Math": AbcMath,
    "Image_Size_Extractor": ImageSizeExtractor,  # 添加 ImageSizeExtractor 映射
    "Tencent_Translater": TencentTranslater,  # 添加 TencentTranslater 映射
}

# 节点显示名称映射
NODE_DISPLAY_NAME_MAPPINGS = {
    "Custom_Save_Image": "Custom Save Image",
    "Color_Adjustment": "Color Adjustment",
    "Strong_Prompt": "Strong Prompt",
    "Baidu_Translater": "Baidu Translater", 
    "Display_Any": "Display Any",
    "Abc_Math": "abc Math",  # 显示名称映射
    "Image_Size_Extractor": "Image Size Extractor",  # 添加 Image Size Extractor 显示名称映射
    "Tencent_Translater": "Tencent Translater",  # 添加 Tencent Translater 显示名称映射
}

# 定义 Web 目录路径
WEB_DIRECTORY = "web"