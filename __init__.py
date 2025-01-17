import os
from .nodes.custom_save_image import CustomSaveImage
from .nodes.color_adjustment import ColorAdjustment
from .nodes.strong_prompt import StrongPrompt
from .nodes.baidu_translater import BaiduTranslater
from .nodes.display_any import DisplayAny  # 添加新的 DisplayAny 节点

# 节点类映射
NODE_CLASS_MAPPINGS = {
    "Custom_Save_Image": CustomSaveImage,
    "Color_Adjustment": ColorAdjustment,
    "Strong_Prompt": StrongPrompt,
    "Baidu_Translater": BaiduTranslater, 
    "Display_Any": DisplayAny,  # 添加新的 DisplayAny 节点映射
}

# 节点显示名称映射
NODE_DISPLAY_NAME_MAPPINGS = {
    "Custom_Save_Image": "Custom Save Image",
    "Color_Adjustment": "Color Adjustment",
    "Strong_Prompt": "Strong Prompt",
    "Baidu_Translater": "Baidu Translater", 
    "Display_Any": "Display Any",  # 添加新的 DisplayAny 显示名称映射
}

# 定义 Web 目录路径
WEB_DIRECTORY = "web"

# 如果有其他初始化代码或设置，可以继续添加在这里