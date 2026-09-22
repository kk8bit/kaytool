# Changelog

## [0.71.3] - 2026-09-22
- GuLuLu 的像素点击判定增加图片加载保护：图片未就绪、加载失败或被替换成无法加载的文件时不再抛错，也不会把小人误判为「整只透明、点不到」（思路来自 EndoTheDev 的 PR #22）
- GuLuLu's pixel hit-testing now guards against the image not being ready, failing to load or being replaced with an unloadable file: no more exceptions, and the sprite no longer becomes unclickable (approach from EndoTheDev's PR #22)
- 资源监视器面板改为独立合成层（`will-change: transform`），它每帧重绘时不再连带重绘被它盖住的那块主画布
- The resource monitor panel now gets its own compositor layer (`will-change: transform`), so its per-frame redraw no longer forces the main canvas region beneath it to repaint
- 资源监视器的数据行和顶部的工作流进度条改为只创建一次：条形每帧用 transform 平滑跟随曲线（不触发布局），文字每 100ms 更新。此前每帧重写整块 innerHTML 并新建 canvas 量字宽，每秒数百次 DOM 重建，是拖动画布时掉帧的来源之一；现在单次开销降到 0.01ms 以下
- The resource monitor's data rows and the workflow progress bar are now built once: bars follow the curves every frame via transform (no layout), text updates every 100ms. Previously every frame rewrote the whole innerHTML and created a canvas per row to measure text — hundreds of DOM rebuilds a second and one cause of dropped frames while panning; each update now costs under 0.01ms

## [0.71.2] - 2026-09-21
- 修正 Registry 元数据里的仓库地址大小写，使 ComfyUI-Manager 能把 Registry 条目与列表条目合并显示（此前会显示为两个包，其中一个无版本号、无星数、排序垫底）
- Aligned the repository URL in the registry metadata with ComfyUI-Manager's list entry so Manager merges them into one (they showed as two packs, one without a version or stars, sorted to the bottom)
- 修复资源监视器的内存已用量与百分比口径不一致的问题（macOS 上会显示成「10.1/24GB (68%)」这种自相矛盾的数值）；现在两者都按「总量 − 可用」计算，与活动监视器一致
- Fixed the resource monitor's RAM figure disagreeing with its own percentage (on macOS it could read "10.1/24GB (68%)"); both now derive from total − available, matching Activity Monitor

## [0.71.1] - 2026-09-20
- 移除 AIO / Tencent / Baidu 三个翻译节点，改为独立仓库 [ComfyUI-kaytool-translate](https://github.com/kk8bit/ComfyUI-kaytool-translate)（Git 安装，节点标识不变，旧工作流装上即恢复）。原因：Registry 安全扫描会把任何网络请求标记为需人工审核，翻译节点无法避免；拆出后核心包不再被卡。核心包同时不再依赖 `requests`
- Removed the AIO / Tencent / Baidu translation nodes into a separate repository, [ComfyUI-kaytool-translate](https://github.com/kk8bit/ComfyUI-kaytool-translate) (installed from Git; node identifiers unchanged, so existing workflows recover once it is installed). The Registry's security scan flags any network request for manual review, which translation cannot avoid; splitting them out keeps the core package from being held up. The core package no longer depends on `requests`
- 资源监视器改为前端按需轮询（0.5–2 秒自适应），不再由后端常驻任务推送：面板关闭或标签页在后台时后端完全不采集；多标签页共享 200ms 缓存
- The resource monitor now polls on demand from the frontend (adaptive 0.5–2s) instead of a resident backend task pushing over WebSocket: nothing is collected while the panel is closed or the tab is in the background; multiple tabs share a 200ms cache
- RemBG 模型不再强制下载到插件目录，改由 rembg 自行管理（默认 `~/.rembg/models/`，可用 `REMBG_HOME` 环境变量更改）。此前的做法会修改整个进程的环境变量，影响同一 ComfyUI 内其他使用 rembg 的插件。**升级后首次使用会重新下载模型**，原插件目录下 `models/RemBG/` 里的文件可删除或移动过去
- RemBG models are no longer forced into the plugin folder; rembg manages them itself (default `~/.rembg/models/`, configurable via `REMBG_HOME`). The old approach modified the process-wide environment and affected other rembg-based plugins in the same ComfyUI. **Models will be re-downloaded once after upgrading**; files under the plugin's `models/RemBG/` can be deleted or moved over
- 资源监视器的曲线在高分屏上不再模糊：画布按 devicePixelRatio 配置后备缓冲，去掉了导致纵向压扁的写死高度；面板最小高度提高到 150，缩到最小也能完整显示底部数据行
- The resource monitor chart is no longer blurry on HiDPI displays: the canvas backing store now follows devicePixelRatio and the hardcoded height that squashed it vertically is gone; the panel's minimum height is now 150 so the data rows always fit
- 修复资源监视器在 Linux/Windows 上未安装 pynvml 时会静默失效的问题（异常处理自身写错，反而在该兜底的场景抛出 NameError）；监控循环也加上了整体保护，任何意外都不会再让监视器无声停摆
- Fixed the resource monitor silently dying on Linux/Windows when pynvml isn't installed (its own error handling raised a NameError in exactly the case it was meant to cover); the monitor loop is now guarded so an unexpected failure can no longer stop it without a trace
- 修复 Workflow PNG 导出失败时画布视图被留在导出状态、只能刷新页面才能恢复的问题；导出失败现在也会明确提示（大工作流可能超出浏览器画布上限），不再静默无反应
- Fixed a failed Workflow PNG export leaving the canvas stuck in its export state until the page was reloaded; failures are now reported instead of silently doing nothing (a very large workflow can exceed the browser's canvas limit)
- 给三个翻译节点的网络请求加上超时（连接 10 秒、读取 30 秒）。此前 requests 默认永不超时，对端连上却不回包会把整个工作流队列无限期堵死且无任何提示；百度翻译节点的网络异常也统一转成可读报错
- Added timeouts to the three translator nodes (10s connect, 30s read). requests never times out by default, so a server that accepted the connection but never replied would block the whole workflow queue indefinitely with nothing reported; network failures in the Baidu node are now reported as readable errors too
- 修复自定义图像保存节点把图片写到进程工作目录、并且无视 ComfyUI `--output-directory` 设置的问题；现在始终保存到 ComfyUI 的输出目录下的 `Custom_Save_Image` 子目录
- Fixed Custom Save Image writing to the process working directory and ignoring ComfyUI's `--output-directory`; it now always saves under ComfyUI's own output directory, in the `Custom_Save_Image` subfolder
- 数学表达式计算节点支持三角函数、对数指数和常量（`sin`/`cos`/`tan`/`atan2`/`sqrt`/`log`/`exp`/`pi`/`e` 等），三角函数以弧度为单位，可用 `radians()` 转换
- AbcMath now supports trigonometric, logarithmic and exponential functions plus constants (`sin`, `cos`, `tan`, `atan2`, `sqrt`, `log`, `exp`, `pi`, `e`, …); trigonometry works in radians, convert with `radians()`
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
