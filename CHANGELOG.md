# Changelog

## [未发布 Unreleased]
- 批量图片载入节点新增 `filenames` 输出（原文件名），配合自定义图像保存节点新增的 `exact_filename` 开关，即可按原文件名保存批处理结果
- Load Image Folder gained a `filenames` output, and Custom Save Image an `exact_filename` toggle, so batch results can be saved under their original names

## [0.71.0] - 2026-09-20
- 自定义图标新增开关，关闭后恢复 ComfyUI 默认图标；并把该功能的措辞统一为「浏览器标签页图标」——它一直只改标签页图标，不会替换界面左上角的 ComfyUI 标志
- Added a toggle for the custom icon, which restores ComfyUI's own icon when off, and renamed the feature to "browser tab icon": it only ever changed the tab icon, never the ComfyUI logo in the interface
- 等宽/等高改为取选中节点中的最大值，不再取「第一个被选中的节点」（以前谁先被点到就以谁为准，看起来像随机缩水）
- Equal width/height now use the largest of the selected nodes instead of whichever was selected first, which made the result look arbitrary
- 修复 ab Images 节点在新版前端下交互功能全部失效的问题（显示图像、A/B 切换、右键菜单、最小尺寸限制）
- Fixed ab Images losing all of its interactions on the current frontend (image display, A/B switching, context menu, minimum size)
- 修复通过 ComfyUI Manager 安装时 GuLuLu 图片加载不出来的问题
- Fixed the GuLuLu image failing to load when installed via ComfyUI Manager
- 移除 𝙆 Run（含右键菜单的 Run / Run Group 和 Alt+R 快捷键）。ComfyUI 已内置局部执行，该功能不再需要；它劫持队列接口还会导致官方的局部执行退化为运行整个工作流、UI 里设置的预览方式失效
- Removed the Run feature (the Run / Run Group context menu items and the Alt+R shortcut). ComfyUI now has partial execution built in, and our override was breaking it into a full-workflow run and disabling the preview method set in the UI
- 修复在设置中关闭 Monitor 按钮后，刷新页面按钮又会出现的问题
- Fixed the Monitor button reappearing after a refresh once it had been turned off in settings
- 修复缺少 pilgram 时会尝试调用 pip 安装、在没有 pip 的虚拟环境中导致整个插件加载失败的问题
- Fixed a missing pilgram triggering a pip install that breaks loading the whole plugin in environments without pip
- 补齐 pyproject.toml 中缺失的依赖声明（pilgram、requests）
- Declared the dependencies missing from pyproject.toml (pilgram, requests)
- 修复节点排版工具栏在新版前端下完全消失、快捷键同时失效的问题
- Fixed the node align toolbar disappearing entirely on the current frontend, which also disabled its shortcuts
- 工具栏改为完全自由的浮窗，自带拖拽手柄，拖到哪就停在哪，不再依附于官方「运行」按钮
- The toolbar is now a freely floating panel with its own drag handle; it stays wherever you drop it, no longer tied to the official Run button

## [0.70.12] - 2025-05-15
- 将Shift+R快捷键功能改为Alt+R，解决了输入大写的“R”冲突

## [0.70.0] - 2025-04-14
- 设置菜单对UI完全自定义
- 整合notification到gululu统一控制
- 新增GuLuLu
- 新增GuLuLu右键菜单
- 新增GuLuLu设置项
- 新增GuLuLu继承KayTool通知为流式输出
- 修复Settings中设置项的bug
- 修复Monitor的初始位置问题
- 增强Clean VRAM兼容性
- 修复setget颜色设置问题
- 新增KayToolActions适配GuLuLu右键菜单
- UI初始配色调整

## [0.65.0] - 2025-04-9
- 大幅度提升Monitor性能
- 增加Clean VRAM
- 增加通知窗口
- 修改Workflow PNG交互方式

## [0.60.0] - 2025-04-4
- 增加工作流进度监视器
- 增加工作流时间统计

## [0.57.0] - 2025-04-4
- 增加Resource monitor的温度表
- 鼠标可穿透monitor容器

## [0.56.0] - 2025-04-3
- 增加Resource monitor

## [0.51.0] - 2025-03-31
- node align 新增快捷键`Shift+WASD`

# Changelog
## [0.50.5] - 2025-03-27
- node align bar可吸附菜单栏
- node align bar显示模式实时更新


## [0.50.0] - 2025-03-27
- 代码优化
- 增加node align bar(节点对齐工具栏)

## [0.37.0] - 2025-03-25 23:30

- 增加多语言支持

## [0.36.0] - 2025-03-25 02:00

- 修复参数获取报错问题(reading 'id")
- 规范所有前端代码采用新的api接口
- 其他一堆功能更新和梳理


## [0.35.0] - 2025-03-23
- 整理设置项
- 增加右键`KayTool菜单`  
- 增加KayTool菜单下的`workflow PNG`导出功能
- 支持workflow在设置菜单中自定义边宽
- 增加KayTool菜单下的自定义Logo的上传、删除功能
- 增加`Star to me`

## [0.32.0] - 2025-03-22
- 增加`Shift+R`快捷键快速运行节点(可通过KayTool设置关闭)
- 增加`image_mask_composer`节点

## [0.31.0] - 2025-03-20
- 增加自定义ComfyUI logo功能

## [0.30.7] - 2025-03-20

- 增加`image_composer`节点
- 增加`image_cropper`节点
- 增加`image_resizer`节点
- 增加`mask_filler`节点
- 增加右键快捷菜单的`Run`功能的条件判断
- 增加KayTool右键快捷功能设置项


## [0.26.3] - 2025-03-12

- 增加Load Image Folder节点
- 增加`remove bg` `mask blur plus` `mask preview plus`节点的invert mask功能

## [0.25.1] - 2025-03-12

- 增加节点右键菜单 Run 功能（快速对节点调试）
- 增加组右键菜单 Run 功能（快速对组节点调试）

## [0.21.0] - 2025-03-02

- 增加BiRefNet

## [0.20.0] - 2025-02-27

- 增加AIO翻译节点

- 增加RemBG背景移除节点组

- 增加Mask遮罩处理节点组

- 增加Mask预览节点

- Slider滑块节点组

- 增加Text节点

- 增加To Int节点

- 增加部分节点的数据显示功能

## [0.9.0] - 2025-02-24

- 增加腾讯AI翻译节点
  Add Tencent AI translation nod
  e
- 增加Set&Get无线传输节点
  Add Set&Get wireless transmission node


## [0.7.0] - 2025-01-19

- 增加abc数学 abc Math 节点，支持多种数学运算。  
  Added the abc Math node, supporting various mathematical operations.
  
- 增加图像尺寸获取 Image Size 节点，支持获取图像的宽度、高度。
  Added the Image Size node, supporting the retrieval of image width and height.  


## [0.3.6] - 2025-01-18

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

- 色彩调节节点中增加滤镜强度调节。  
  Added filter intensity adjustment in the Color Adjustment node.  

---

## [0.1.2] - 2024-10-23

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
