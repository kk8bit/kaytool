# Changelog

## [0.36.7] - 2025-03-20
### Added
- 增加`image_composer`节点
- 增加`image_cropper`节点
- 增加`image_resizer`节点
- 增加`mask_filler`节点
- 增加右键快捷菜单的`Run`功能的条件判断
- 增加KayTool右键快捷功能设置项


## [0.26.3] - 2025-03-12
### Added
- 增加Load Image Folder节点
- 增加`remove bg` `mask blur plus` `mask preview plus`节点的invert mask功能

## [0.25.1] - 2025-03-12
### Added
- 增加节点右键菜单 Run 功能（快速对节点调试）
- 增加组右键菜单 Run 功能（快速对组节点调试）

## [0.21.0] - 2025-03-02
### Added
- 增加BiRefNet

## [0.20.0] - 2025-02-27
### Added
- 增加AIO翻译节点

- 增加RemBG背景移除节点组

- 增加Mask遮罩处理节点组

- 增加Mask预览节点

- Slider滑块节点组

- 增加Text节点

- 增加To Int节点

- 增加部分节点的数据显示功能

## [0.9.0] - 2025-02-24
### Added
- 增加腾讯AI翻译节点
  Add Tencent AI translation nod
  e
- 增加Set&Get无线传输节点
  Add Set&Get wireless transmission node


## [0.7.0] - 2025-01-19
### Added
- 增加abc数学 abc Math 节点，支持多种数学运算。  
  Added the abc Math node, supporting various mathematical operations.
  
- 增加图像尺寸获取 Image Size 节点，支持获取图像的宽度、高度。
  Added the Image Size node, supporting the retrieval of image width and height.  


## [0.3.6] - 2025-01-18
### Added
- 增加大壮提示词 Strong Prompt 节点，支持负向提示词零化功能以及预设样式编辑与导入。  
  Added the Strong Prompt node, supporting negative prompt nullification and preset style editing and importing.  
- 增加百度AI翻译 Baidu Translater 节点，支持双文本翻译、自动检测语言及百度API配置。  
  Added the Baidu Translator node, supporting dual-text translation, auto language detection, and Baidu API configuration.  
- 增加显示任何 Display Any 节点，用于调试或检查工作流输出内容。  
  Added the Display Any node, useful for debugging or inspecting workflow output.  

---

## [0.1.4] - 2024-10-28
### Updated
- 将色彩调节的数值调节改为滑条。  
  Changed numerical adjustment for Color Adjustment to sliders.  

---

## [0.1.3] - 2024-10-23
### Added
- 色彩调节节点中增加滤镜强度调节。  
  Added filter intensity adjustment in the Color Adjustment node.  

---

## [0.1.2] - 2024-10-23
### Added
- 增加色彩调节节点。  
  Added the Color Adjustment node.  
- 支持模拟相机曝光调节、对比度、色温、色调、饱和度调节。  
  Supported simulated camera exposure adjustment, contrast, color temperature, hue, and saturation adjustment.  
- 增加网红滤镜。  
  Added trendy filters.  
- 支持所有滤镜一键预览。  
  Supported one-click preview for all filters.  

---

## [0.0.1] - 2024-10-19
### Added
- 创建自定义保存图像节点。  
  Created the Custom SaveImage node.  
- 支持保存为 PNG 和 JPG 格式。  
  Supported saving in PNG and JPG formats.  
- 添加 JPG 质量调整选项。  
  Added JPG quality adjustment option.  
- 支持嵌入作者和版权信息。  
  Supported embedding author and copyright information.  
- 支持选择 sRGB IEC61966-2.1 和 Adobe RGB (1998) 颜色配置文件。  
  Supported selecting sRGB IEC61966-2.1 and Adobe RGB (1998) color profiles.  
- 当选择 Adobe RGB 时，自动将图像转换为 Adobe RGB并保证色彩准确。  
  Automatically converted images to Adobe RGB for accurate colors when selected.  
- 支持保存元数据到 PNG 文件，包括 `prompt` 和 `extra_pnginfo`。  
  Supported saving metadata in PNG files, including `prompt` and `extra_pnginfo`.  
- 自动生成唯一文件名。  
  Automatically generated unique filenames.  
