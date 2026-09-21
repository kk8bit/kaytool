# KayTool

[更新日志 (CHANGELOG)](./CHANGELOG.md)

这是一个为 ComfyUI 开发的自定义节点实用工具包，起初只是为了自己用方便，在未来我会陆续为它增加功能。

This is a custom node utility package developed for ComfyUI. Initially created for personal convenience, I will continue adding features in the future.

## 最新更新 / Last Update

### [0.71.2] - 2026-09-21
- 修正 Registry 元数据里的仓库地址大小写，使 ComfyUI-Manager 能把 Registry 条目与列表条目合并显示（此前会显示为两个包，其中一个无版本号、无星数、排序垫底）  
- Aligned the repository URL in the registry metadata with ComfyUI-Manager's list entry so Manager merges them into one (they showed as two packs, one without a version or stars, sorted to the bottom)  
- 修复资源监视器的内存已用量与百分比口径不一致的问题（macOS 上会显示成「10.1/24GB (68%)」这种自相矛盾的数值）；现在两者都按「总量 − 可用」计算，与活动监视器一致  
- Fixed the resource monitor's RAM figure disagreeing with its own percentage (on macOS it could read "10.1/24GB (68%)"); both now derive from total − available, matching Activity Monitor

### [0.71.1] - 2026-09-20
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

### [0.71.0] - 2026-09-20
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

### [0.70.12] - 2025-05-15
- 将Shift+R快捷键功能改为Alt+R，解决了输入大写的“R”冲突  
- Changed shortcut from Shift+R to Alt+R to resolve conflict with typing uppercase "R"

### [0.70.0] - 2025-04-14
- 设置菜单对UI完全自定义  
- Fully customizable UI through settings menu  
- 整合notification到gululu统一控制  
- Integrated notifications into Gululu for unified control  
- 新增GuLuLu  
- Added GuLuLu  
- 新增GuLuLu右键菜单  
- Added right-click menu for GuLuLu  
- 新增GuLuLu设置项  
- Added settings options for GuLuLu  
- 新增GuLuLu继承KayTool通知为流式输出  
- Added stream output feature for KayTool notifications in GuLuLu  
- 修复Settings中设置项的bug  
- Fixed bugs in settings items within Settings  
- 修复Monitor的初始位置问题  
- Fixed initial position issue of Monitor  
- 增强Clean VRAM兼容性  
- Enhanced compatibility for Clean VRAM  
- 修复setget颜色设置问题  
- Fixed setget color configuration issues  
- 新增KayToolActions适配GuLuLu右键菜单  
- Added KayToolActions support for GuLuLu right-click menu  
- UI初始配色调整  
- Adjusted default color scheme for UI



# 节点预览 Nodes Preview (不全 Not All):

![preview_custom_save_image_node](https://github.com/user-attachments/assets/92ef9b39-97f2-4076-903e-79ce7a7375ea)

# 当前功能 Current Features

**📌 所有 KayTool 节点包用到的资源都在 `ComfyUI/custom_nodes/kaytool` 文件夹内。| All KayTool node packages use resources in the `ComfyUI/custom_nodes/kaytool` folder.**

**⚙️ 在ComfyUI左下角的设置菜单里，所有 KayTool 的相关功能都支持自定义设置。| All KayTool features support custom settings in the ComfyUI settings menu.**


## 资源监视器 Resource Monitor

- 强大且专业的ComfyUI资源监控工具
  A powerful and professional ComfyUI resource monitoring tool.
- 实时显示工作流运行状态，包括当前节点、当前节点组、当前节点组运行时间等。
  Displays real-time workflow status, including the current node, current node, and current workflow running time.
- 实时显示当前 ComfyUI 资源使用情况，包括内存占用、显存占用、CPU 占用等。
  Displays real-time resource usage information, including memory usage, GPU memory usage, and CPU usage.
- 支持曲线统计表以精确评估工作流资源消耗情况。
  Supports curve statistics for accurate evaluation of workflow resource consumption.
- 支持自定义颜色设置，可根据个人喜好调整显示效果。
  Supports custom color settings, allowing personal preference adjustments.

https://github.com/user-attachments/assets/2cd4179c-57fa-42dc-ae50-2feae9708e42

## 节点排版工具栏 Node Align Toolbar

- 支持节点多种对齐方式的工具栏
  Supports node alignment tools.
- 工具栏显示模式可以在设置菜单中（KayTool）进行配置。
  The display mode of the toolbar can be configured in the settings menu (KayTool).
- 工具栏所有元素均支持自定义颜色。
  All elements of the toolbar support custom color.
- 支持快捷键“Shift + wasd"进行节点对齐。
  Supports shortcut key "Shift + wasd" for node alignment.

https://github.com/user-attachments/assets/b8d1d3f0-04d1-46c5-968a-e433778b73e6

## 咕噜噜 GuLuLu

- 主打陪伴的咕噜噜，支持调整KayTool的通知位置
  GuLuLu, featuring companionship, supports adjusting KayTool notification positions.
- 继承KayTool的通知为流式输出
  Inherits KayTool notifications as streaming output.
- 提供强大的右键菜单项目，快速调用KayTool的进阶功能
  Provides powerful right-click menu items, quickly calling KayTool's advanced features. 

## workflow PNG功能 Workflow Export to PNG

- 支持在右键菜单中`KayTool-workflow PNG`将当前工作流节点地图保存为PNG格式并内嵌工作流信息。
  Supports saving the current workflow node map as a PNG format and embedding workflow information in the right-click menu.



## 自定义浏览器标签页图标 Custom Browser Tab Icon

- 在设置菜单中（KayTool）自定义浏览器标签页的图标（favicon），支持 PNG、JPG、JPEG 格式。
  Customize the browser tab icon (favicon) in the settings menu (KayTool), supporting PNG, JPG, and JPEG formats.
- 注意：只影响浏览器标签页的图标，不会改变界面左上角的 ComfyUI 标志。
  Note: this only affects the browser tab icon. It does not change the ComfyUI logo shown in the interface.



## BiRefNet 背景移除处理节点 BiRefNet Background Removal Processing Node

[BiRefNet 仓库](https://github.com/zhengpeng7/birefnet)

- 强大的 BiRefNet 预训练模型：`BiRefNet`、`BiRefNet_HR`、`BiRefNet-portrait`，适用于不同背景移除场景。  
  **Offers multiple powerful pre-trained model options**: `BiRefNet`, `BiRefNet_HR`, `BiRefNet-portrait`, suitable for various background removal scenarios.  
- 支持多种硬件加速（如 CPU、CUDA、MPS 等），可根据设备自动优化性能。  
  **Supports various hardware acceleration options** (e.g., CPU, CUDA, MPS) with automatic performance optimization based on the device.  
- 兼容 `REMOVE_BG` 类型输出，供后续节点使用。  
  **Compatible with `REMOVE_BG` type output**, for use in subsequent nodes.



## 背景移除加载器 & 处理节点 RemBGLoader & RemoveBG

[RemBG 仓库](https://github.com/danielgatis/rembg)

- **RemBGLoader**: 提供多种高效的预训练模型选择（如 `u2net`、`isnet-general-use`、`sam` 等），适用于不同背景移除场景。支持多种硬件加速提供者（如 CPU、CUDA、TensorRT 等），可根据设备自动优化性能。加载的模型会作为 `REMBG_LOADER` 类型输出，供后续节点使用。  
- **RemoveBG**: 使用加载的背景移除模型处理图像，生成透明背景或指定颜色背景。支持遮罩模糊和扩展功能，增强背景移除效果。提供多种背景预览选项（黑、白、红、绿、蓝），便于快速验证结果。输出处理后的图像和遮罩，满足后续合成或编辑需求。  
- 整体流程：通过 **RemBGLoader** 加载模型并配置硬件加速，然后使用 **RemoveBG** 对图像进行背景移除处理，支持灵活调整遮罩效果和背景样式。  
- **RemBGLoader**: Offers multiple pre-trained model options (e.g., `u2net`, `isnet-general-use`, `sam`) for different background removal scenarios. Supports various hardware acceleration providers (e.g., CPU, CUDA, TensorRT) with automatic performance optimization based on the device. The loaded model is output as a `REMBG_LOADER` type for use in subsequent nodes.  
- **RemoveBG**: Processes images using the loaded background removal model to generate transparent or custom-colored backgrounds. Supports mask blurring and expansion for enhanced background removal effects. Offers multiple background preview options (black, white, red, green, blue) for quick result validation. Outputs the processed image and mask for subsequent compositing or editing needs.  
- Combined Workflow: Load the model and configure hardware acceleration using **RemBGLoader**, then process images with **RemoveBG** for background removal, with flexible adjustments for mask effects and background styles.



## 批量图片载入节点 Load Image Folder

- 提供图片的批量载入及批处理。  
  Provide batch loading and batch processing of images.  
- 支持 image 和 mask 的批量输出。  
  Support batch output of images and masks.
- 新增 `filenames` 输出，逐张给出图片的原文件名（不含扩展名）。配合 𝙆 Custom Save Image 的 `exact_filename` 开关，即可按原文件名保存处理结果。  
  Adds a `filenames` output with each image's original name (without extension). Pair it with the `exact_filename` toggle on 𝙆 Custom Save Image to save results under their original names.

## 无线数据传输节点 Set & Get

- 提供 `Set` 和 `Get` 两种节点，通过唯一的 ID 实现**无线数据传输**，帮助建立干净整洁的工作流。  
- **Set 节点**：允许用户定义唯一的 ID，并动态设置输入数据类型，支持实时验证和更新，确保数据的唯一性和一致性。  
- **Get 节点**：通过匹配的 ID 无线获取对应的 Set 节点数据，自动同步数据类型，减少节点间的复杂连接。  
- 支持多种数据类型（如字符串、数字、图像等），并动态调整连接类型，提升工作流的灵活性。  
- 提供错误提示和调试功能，确保节点间数据传输的正确性，避免因连接错误导致的工作流中断。  
- **核心优势**：通过无线数据传输机制，大幅简化节点布局，帮助用户构建更加**干净、整洁、高效**的工作流。  
- Provides `Set` and `Get` nodes to enable **wireless data transfer** via unique IDs, helping to create clean and organized workflows.  
- **Set Node**: Allows users to define a unique ID and dynamically set input data types, with real-time validation and updates to ensure data uniqueness and consistency.  
- **Get Node**: Wirelessly retrieves data from the corresponding Set node by matching ID, automatically synchronizing data types and reducing complex connections between nodes.  
- Supports various data types (e.g., strings, numbers, images) with dynamic adjustment of connection types, enhancing workflow flexibility.  
- Includes error notifications and debugging features to ensure correct data transmission between nodes, avoiding workflow interruptions caused by connection errors.  
- **Key Advantage**: Simplifies node layouts through wireless data transfer, enabling users to build **cleaner, more organized, and efficient workflows**.



## 数学表达式计算节点 AbcMath

- 支持动态解析数学表达式。  
- 提供多种运算符和函数支持（加、减、乘、除、幂、取模等）。  
- 支持变量 `a`、`b`、`c` 的灵活输入（数字或数组形状）。  
- 内置常用数学函数（`min`、`max`、`round`、`sum`、`len`、`abs`、`sqrt`、`floor`、`ceil`、`hypot` 等）。  
- 支持三角函数与对数指数（`sin`、`cos`、`tan`、`asin`、`acos`、`atan`、`atan2`、`sinh`、`cosh`、`tanh`、`exp`、`log`、`log10`、`log2`），以及常量 `pi`、`e`、`tau`。  
- 三角函数以弧度为单位，可用 `radians()` / `degrees()` 转换，例如 `sin(radians(a))`。  
- 自动处理 NaN 和无穷值，确保结果稳定性。  
- 输出整数和浮点数两种格式。  
- 适用于复杂计算场景。  
- Supports dynamic parsing of mathematical expressions.  
- Provides a wide range of operators and functions (addition, subtraction, multiplication, division, power, modulo, etc.).  
- Flexible input for variables `a`, `b`, and `c` (numbers or array shapes).  
- Built-in common math functions (`min`, `max`, `round`, `sum`, `len`, `abs`, `sqrt`, `floor`, `ceil`, `hypot`, etc.).  
- Trigonometric, exponential and logarithmic functions (`sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`, `sinh`, `cosh`, `tanh`, `exp`, `log`, `log10`, `log2`), plus the constants `pi`, `e` and `tau`.  
- Trigonometric functions work in radians; use `radians()` / `degrees()` to convert, e.g. `sin(radians(a))`.  
- Automatically handles NaN and infinite values to ensure result stability.  
- Outputs results in both integer and float formats.  
- Suitable for complex calculation scenarios.



## 大壮提示词生成节点 StrongPrompt

- 基于 CLIP 模型生成高质量的正向和负向提示词嵌入。  
- 支持灵活的预设样式选择，快速构建复杂提示词。  
- 提供多种控制开关（启用/禁用负向输出、预设样式、ID 输入等）。  
- 自动加载本地 JSON 文件中的预设样式数据，无需手动配置。  
- 支持通过 ID 快速选择多个样式组合。  
- 可零化负向提示词嵌入，满足特定场景需求。  
- 适用于扩散模型的条件化输入，提升生成效果。  
- Generates high-quality positive and negative prompt embeddings using the CLIP model.  
- Supports flexible preset style selection for quickly building complex prompts.  
- Provides multiple control switches (enable/disable negative output, presets, IDs input, etc.).  
- Automatically loads preset style data from local JSON files without manual configuration.  
- Supports quick selection of multiple styles via IDs.  
- Can zero out negative prompt embeddings to meet specific scenario requirements.  
- Suitable for diffusion model conditioning inputs to enhance generation results.



## 图像色彩调整节点 ColorAdjustment

- 提供全面的图像色彩调整功能，包括曝光、对比度、色温、色调和饱和度。  
- 支持多种预设滤镜（基于 `pilgram` 库），快速应用流行风格。  
- 可通过强度滑块精确控制滤镜效果。  
- 支持批量处理图像，满足高效工作流需求。  
- 提供灵活的开关选项，一键启用所有滤镜组合。  
- 适用于图像后期处理与风格化生成。  
- Offers comprehensive image color adjustments including exposure, contrast, temperature, tint, and saturation.  
- Supports multiple preset filters (based on the `pilgram` library) for quick application of popular styles.  
- Allows precise control of filter effects via a strength slider.  
- Supports batch processing of images for efficient workflows.  
- Provides flexible switch options to enable all filter combinations with one click.  
- Suitable for image post-processing and stylized generation.



## 自定义图像保存节点 CustomSaveImage

- 支持自定义文件名前缀和后缀，确保输出文件名的唯一性。  
- 提供灵活的图像保存功能，支持多种格式（PNG、JPG）。  
- 可选择色彩配置文件（sRGB IEC61966-2.1 或 Adobe RGB 1998），确保色彩准确性。  
- 支持保存元数据（作者信息、版权信息、生成提示词等）。  
- 提供高质量 JPG 保存选项，可自定义压缩质量。  
- 自动生成唯一文件名，避免覆盖已有文件。  
- 适用于需要精确控制输出图像的工作流。  
- Supports custom filename prefixes and suffixes to ensure the recognizability of output filenames.  
- Offers flexible image saving functionality with support for multiple formats (PNG, JPG).  
- Allows selection of color profiles (sRGB IEC61966-2.1 or Adobe RGB 1998) to ensure color accuracy.  
- Supports saving metadata (author info, copyright info, generation prompts, etc.).  
- Provides high-quality JPG saving options with customizable compression quality.  
- Automatically generates unique filenames to prevent overwriting existing files.  
- Suitable for workflows requiring precise control over output images.
- `exact_filename` 开关：开启后 `filename_prefix` 就是最终文件名，不再追加时间戳。重名会自动加 `_1`、`_2` 后缀，不会覆盖已有文件。  
  `exact_filename`: when on, `filename_prefix` is used as the final filename with no timestamp appended. Existing files are never overwritten — a `_1`, `_2` suffix is added instead.

### 变量使用说明 Variable Usage Notes

- 变量名大小写敏感，请确保正确输入。  
  Variable names are case-sensitive; please ensure correct input.

在 `filename_prefix` 中，可以使用以下动态变量来自定义文件名：  
In `filename_prefix`, you can use the following dynamic variables to customize the filename:

#### 1. 日期和时间 Date and Time

- `%date:yyyy-MM-dd%`：当前日期，例如 `2023-10-05`  
- `%time:HH-mm-ss%`：当前时间，例如 `14-30-45`

#### 2. KSampler 参数 KSampler Parameters

支持以下变量，多个 `KSampler` 节点会自动编号（如 `_1`, `_2`）：  
- `%KSampler.seed%`：随机种子值  
- `%KSampler.steps%`：采样步数  
- `%KSampler.cfg%`：CFG 值  
- `%KSampler.sampler_name%`：采样器名称  
- `%KSampler.scheduler%`：调度器名称  
- `%KSampler.denoise%`：去噪强度

#### 3. 图像信息 Image Information

- `%width%`：图像宽度（像素）  
- `%height%`：图像高度（像素）



## 通用显示节点 DisplayAny

- 可接收任意类型的输入并将其转换为字符串显示。  
- 提供灵活的调试和查看功能，适用于任何数据类型。  
- 输出结果可直接用于后续节点或日志记录。  
- 简化复杂工作流中的数据可视化需求。  
- Supports receiving any type of input and converting it to a string for display.  
- Provides flexible debugging and viewing capabilities, suitable for any data type.  
- The output can be directly used in subsequent nodes or for logging.  
- Simplifies data visualization needs in complex workflows.



## 图像尺寸提取节点 ImageSizeExtractor

- 自动提取输入图像的宽度和高度。  
- 支持批量图像（4D 张量）和单张图像（3D 张量）输入。  
- 输出图像的宽度和高度，便于后续处理或计算。  
- 适用于需要动态获取图像尺寸的工作流。  
- Automatically extracts the width and height of the input image.  
- Supports batched images (4D tensor) and single images (3D tensor).  
- Outputs the width and height of the image for subsequent processing or calculations.  
- Suitable for workflows requiring dynamic retrieval of image dimensions.



## 高级遮罩处理节点 MaskBlurPlus

- 提供遮罩的模糊和扩展功能，增强遮罩的灵活性。  
- 支持动态调整模糊半径和扩展强度。  
- 模糊功能使用高斯模糊算法，确保平滑过渡。  
- 扩展功能支持正向扩展（扩大遮罩）和负向扩展（缩小遮罩）。  
- 适用于图像分割、遮罩优化等高级工作流。  
- Provides mask blurring and expansion capabilities to enhance mask flexibility.  
- Supports dynamic adjustment of blur radius and expansion intensity.  
- Blurring uses Gaussian blur algorithm for smooth transitions.  
- Expansion supports both positive (enlarging the mask) and negative (shrinking the mask) adjustments.  
- Suitable for advanced workflows such as image segmentation and mask optimization.



## 遮罩预览增强节点 PreviewMaskPlus

- 提供多种遮罩预览模式，包括纯色背景（黑、白、红、绿、蓝）和原始遮罩视图。  
- 支持动态调整预览样式，便于快速查看遮罩效果。  
- 自动将遮罩与图像叠加，生成直观的可视化结果。  
- 适用于遮罩调试、图像合成及分割任务。  
- 输出预览图像到临时目录，方便快速访问。  
- Offers multiple mask preview modes, including solid color backgrounds (black, white, red, green, blue) and raw mask view.  
- Supports dynamic adjustment of preview styles for quick visualization of mask effects.  
- Automatically overlays the mask with the image to generate intuitive visual results.  
- Suitable for mask debugging, image compositing, and segmentation tasks.  
- Outputs preview images to a temporary directory for easy access.



## 遮罩预览节点 PreviewMask

- 提供遮罩的快速可视化功能，将单通道遮罩转换为 RGB 图像。  
- 支持动态调整遮罩范围，确保兼容不同输入格式。  
- 输出预览图像到临时目录，便于快速查看和调试。  
- 适用于遮罩生成、图像分割等任务的初步验证。  
- Offers quick visualization of masks by converting single-channel masks into RGB images.  
- Supports dynamic adjustment of mask ranges to ensure compatibility with different input formats.  
- Outputs preview images to a temporary directory for easy viewing and debugging.  
- Suitable for preliminary validation in mask generation and image segmentation tasks.



## Slider 精度节点系列 (Slider10、Slider100、Slider1000)

- 提供三种不同精度的滑块输入节点，分别支持 0-10、0-100 和 0-1000 的整数范围。  
- 每种精度滑块均支持动态调整，默认值居中，适用于不同精度需求的场景。  
- 输出整数值，便于直接用于后续计算或参数控制。  
- 整体设计灵活，满足从粗略到精细的多种工作流需求。  
- Provides three slider input nodes with different precision levels, supporting integer ranges of 0-10, 0-100, and 0-1000 respectively.  
- Each slider supports dynamic adjustment with a default centered value, suitable for various precision requirements.  
- Outputs integer values for direct use in subsequent calculations or parameter control.  
- The overall design is flexible, meeting workflow needs ranging from coarse to fine adjustments.



## 文本处理节点 Text

- 提供一个多行文本输入框，支持动态输入和编辑。  
- 输出原始文本内容，便于直接用于后续节点或日志记录。  
- 适用于需要灵活处理文本的工作流场景。  
- Provides a multi-line text input box with support for dynamic input and editing.  
- Outputs the original text content for direct use in subsequent nodes or logging.  
- Suitable for workflow scenarios requiring flexible text handling.



## 转换为整数节点 To Int

- 将任意类型的输入转换为整数，支持动态数据处理。  
- 自动对浮点数进行四舍五入，并将无效输入默认为 0。  
- 输出结果以文本形式显示，便于调试和验证。  
- 适用于需要将数据标准化为整数的工作流场景。  
- Converts any type of input to an integer, supporting dynamic data processing.  
- Automatically rounds floating-point numbers and defaults invalid inputs to 0.  
- Outputs the result as text for easy debugging and verification.  
- Suitable for workflow scenarios requiring data normalization to integers.



## 图像合成节点 Image Composer

- 支持两张图像的合成，提供灵活的位置选项（顶部、底部、左侧、右侧）。  
- 输入图像 A 和 B，分别支持可选的遮罩输入，自动处理遮罩缺失情况。  
- 输出合成后的图像、遮罩和位置数据，便于后续裁切或编辑。  
- 适用于图像拼接、布局设计等工作流。  
- Supports compositing two images with flexible position options (top, bottom, left, right).  
- Inputs images A and B with optional mask inputs, automatically handling missing masks.  
- Outputs the composited image, mask, and positional data for subsequent cropping or editing.  
- Suitable for workflows involving image stitching and layout design.



## 图像裁切节点 Image Cropper

- 根据 `Image Composer` 的位置数据裁切合成图像。  
- 通过单一输入接收图像和遮罩数据，简化工作流连接。  
- 支持选择裁切目标（图像 A 或 B），输出裁切后的图像和遮罩。  
- 适用于从合成图像中提取特定区域的工作流。  
- Crops the composited image based on positional data from `Image Composer`.  
- Receives image and mask data via a single input, simplifying workflow connections.  
- Supports selecting the crop target (image A or B), outputting the cropped image and mask.  
- Suitable for workflows extracting specific regions from composited images.



## 图像遮罩合成节点 Image Mask Composer

- 支持图片和遮罩合成后填充背景
- supports image and mask composition with background filling

## 图像缩放节点 Image Resizer

- 支持图像和遮罩的动态缩放，提供宽度、高度和比例保持选项。  
- 若无遮罩输入，自动生成与图像同尺寸的全黑遮罩。  
- 支持指定宽度或高度（0 表示保持原尺寸），并根据比例开关调整尺寸。  
- 适用于需要调整图像尺寸或标准化输入的工作流。  
- Supports dynamic resizing of images and masks with options for width, height, and aspect ratio preservation.  
- Automatically generates a full-black mask of the same size if no mask is provided.  
- Allows specifying width or height (0 retains original size), adjusting dimensions based on the aspect ratio switch.  
- Suitable for workflows requiring image resizing or input standardization.



## 遮罩填充节点 Mask Filler


- 自动填充遮罩中的闭合区域（如圆圈内部），优化遮罩效果。  
- 输入单通道遮罩，输出填充后的遮罩，保留非闭合区域不变。  
- 使用轮廓检测算法，确保精确填充所有闭合形状。  
- 适用于遮罩绘制、图像分割等需要完善遮罩的工作流。  
- Automatically fills closed regions in a mask (e.g., inside circles) to enhance mask quality.  
- Inputs a single-channel mask and outputs the filled mask, preserving non-closed areas unchanged.  
- Utilizes contour detection algorithms to ensure precise filling of all closed shapes.  
- Suitable for workflows involving mask drawing and image segmentation that require refined masks.



# 翻译节点 Translation Nodes

自 0.71.1 起，`𝙆 AIO Translater`、`𝙆 Tencent Translater`、`𝙆 Baidu Translater` 三个翻译节点已移出本包，改为独立仓库 [ComfyUI-kaytool-translate](https://github.com/kk8bit/ComfyUI-kaytool-translate)，以 Git 方式安装。节点标识不变，旧工作流装上即可继续使用。原因：Comfy Registry 的安全扫描会将任何发起网络请求的节点标记为需人工审核，而翻译节点无法不发请求。
As of 0.71.1 the three translation nodes live in a separate repository, [ComfyUI-kaytool-translate](https://github.com/kk8bit/ComfyUI-kaytool-translate), installed from Git. Node identifiers are unchanged, so existing workflows work again once it is installed. The Comfy Registry's security scan flags any node that makes network requests for manual review, and translation cannot avoid that.

# 安装 Installation

- 使用 ComfyUI Manager 搜索 `KayTool` 安装。  
- 克隆项目到 `ComfyUI/custom_nodes` 目录下，并确保将色彩配置文件放在 resources 目录中。  

Install via ComfyUI Manager by searching for `KayTool`.  
Clone this project into your `ComfyUI/custom_nodes` directory, ensuring color profile files are placed in the resources directory.