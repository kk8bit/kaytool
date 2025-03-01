# KayTool

[更新日志(CHANGELOG)](./CHANGELOG.md)

这是一个为 ComfyUI 开发的自定义节点实用工具包，起初只是为了自己用方便，在未来我会陆续为它增加功能。

This is a custom node utility package developed for ComfyUI. Initially created for personal convenience, I will continue adding features in the future.

## 节点预览 Nodes Preview(不全 Not ALL):

![preview_custom_save_image_node](https://github.com/user-attachments/assets/92ef9b39-97f2-4076-903e-79ce7a7375ea)

## 当前功能 Current Features:



**所有KayTool节点包用到的资源都在ComfyUI/custom_nodes/kaytool文件夹内。| All KayTool node packages use resources in the ComfyUI/custom_nodes/kaytool folder.**

### BiRefNet背景移除处理节点 BiRefNet Background Removal Processing Node

[BiRefNet仓库](https://github.com/zhengpeng7/birefnet)

- 强大的BiRefNet预训练模型：`BiRefNet`、`BiRefNet_HR`、`BiRefNet-portrait`，适用于不同背景移除场景。  
  **Offers multiple powerful pre-trained model options**: `BiRefNet`, `BiRefNet_HR`, `BiRefNet-portrait`, suitable for various background removal scenarios.

- 支持多种硬件加速（如 CPU、CUDA、MPS 等），可根据设备自动优化性能。  
  **Supports various hardware acceleration options** (e.g., CPU, CUDA, MPS) with automatic performance optimization based on the device.

- 兼容 `REMOVE_BG` 类型输出，供后续节点使用。  
  **Compatible with `REMOVE_BG` type output**, for use in subsequent nodes.

### 背景移除加载器 & 处理节点 RemBGLoader & RemoveBG

[RemBG仓库](https://github.com/danielgatis/rembg)

- **RemBGLoader**: 提供多种高效的预训练模型选择（如 `u2net`、`isnet-general-use`、`sam` 等），适用于不同背景移除场景。支持多种硬件加速提供者（如 CPU、CUDA、TensorRT 等），可根据设备自动优化性能。加载的模型会作为 `REMBG_LOADER` 类型输出，供后续节点使用。
- **RemoveBG**: 使用加载的背景移除模型处理图像，生成透明背景或指定颜色背景。支持遮罩模糊和扩展功能，增强背景移除效果。提供多种背景预览选项（黑、白、红、绿、蓝），便于快速验证结果。输出处理后的图像和遮罩，满足后续合成或编辑需求。
- 整体流程：通过 **RemBGLoader** 加载模型并配置硬件加速，然后使用 **RemoveBG** 对图像进行背景移除处理，支持灵活调整遮罩效果和背景样式。
- **RemBGLoader**: Offers multiple pre-trained model options (e.g., `u2net`, `isnet-general-use`, `sam`) for different background removal scenarios. Supports various hardware acceleration providers (e.g., CPU, CUDA, TensorRT) with automatic performance optimization based on the device. The loaded model is output as a `REMBG_LOADER` type for use in subsequent nodes.
- **RemoveBG**: Processes images using the loaded background removal model to generate transparent or custom-colored backgrounds. Supports mask blurring and expansion for enhanced background removal effects. Offers multiple background preview options (black, white, red, green, blue) for quick result validation. Outputs the processed image and mask for subsequent compositing or editing needs.
- Combined Workflow: Load the model and configure hardware acceleration using **RemBGLoader**, then process images with **RemoveBG** for background removal, with flexible adjustments for mask effects and background styles.
---

### 无线数据传输节点 Set & Get

- 提供 `Set` 和 `Get` 两种节点，通过唯一的 ID 实现**无线数据传输**，帮助建立干净整洁的工作流
- **Set 节点**：允许用户定义唯一的 ID，并动态设置输入数据类型，支持实时验证和更新，确保数据的唯一性和一致性
- **Get 节点**：通过匹配的 ID 无线获取对应的 Set 节点数据，自动同步数据类型，减少节点间的复杂连接
- 支持多种数据类型（如字符串、数字、图像等），并动态调整连接类型，提升工作流的灵活性
- 提供错误提示和调试功能，确保节点间数据传输的正确性，避免因连接错误导致的工作流中断
- **核心优势**：通过无线数据传输机制，大幅简化节点布局，帮助用户构建更加**干净、整洁、高效**的工作流
- Provides `Set` and `Get` nodes to enable **wireless data transfer** via unique IDs, helping to create clean and organized workflows
- **Set Node**: Allows users to define a unique ID and dynamically set input data types, with real-time validation and updates to ensure data uniqueness and consistency
- **Get Node**: Wirelessly retrieves data from the corresponding Set node by matching ID, automatically synchronizing data types and reducing complex connections between nodes
- Supports various data types (e.g., strings, numbers, images) with dynamic adjustment of connection types, enhancing workflow flexibility
- Includes error notifications and debugging features to ensure correct data transmission between nodes, avoiding workflow interruptions caused by connection errors
- **Key Advantage**: Simplifies node layouts through wireless data transfer, enabling users to build **cleaner, more organized, and efficient workflows**
---

### 数学表达式计算节点 AbcMath

- 支持动态解析数学表达式
- 提供多种运算符和函数支持（加、减、乘、除、幂、取模等）
- 支持变量 `a`、`b`、`c` 的灵活输入（数字或数组形状）
- 内置常用数学函数（`min`、`max`、`round`、`sum`、`len` 等）
- 自动处理 NaN 值，确保结果稳定性
- 输出整数和浮点数两种格式
- 适用于复杂计算场景
- Supports dynamic parsing of mathematical expressions
- Provides a wide range of operators and functions (addition, subtraction, multiplication, division, power, modulo, etc.)
- Flexible input for variables `a`, `b`, and `c` (numbers or array shapes)
- Built-in common math functions (`min`, `max`, `round`, `sum`, `len`, etc.)
- Automatically handles NaN values to ensure result stability
- Outputs results in both integer and float formats
- Suitable for complex calculation scenarios

---

### 自动翻译节点 AIOTranslater

- 支持单文本输入的自动翻译
- 内置高效 AI 翻译引擎，无需手动获取 API 密钥
- 提供高质量翻译结果，适用于多种语言场景
- 支持多种目标语言选择（英语、中文、德语、西班牙语等）
- 自动检测源语言，简化用户操作
- 高效稳定，适合快速集成到工作流中
- Supports automatic translation of single text input
- Built-in high-efficiency AI translation engine, no need to manually obtain API keys
- Provides high-quality translations for various language scenarios
- Offers multiple target language options (English, Chinese, German, Spanish, etc.)
- Automatically detects source language for simplified user experience
- Efficient and stable, ideal for quick integration into workflows
---

### 大壮提示词生成节点 StrongPrompt

- 基于 CLIP 模型生成高质量的正向和负向提示词嵌入
- 支持灵活的预设样式选择，快速构建复杂提示词
- 提供多种控制开关（启用/禁用负向输出、预设样式、ID 输入等）
- 自动加载本地 JSON 文件中的预设样式数据，无需手动配置
- 支持通过 ID 快速选择多个样式组合
- 可零化负向提示词嵌入，满足特定场景需求
- 适用于扩散模型的条件化输入，提升生成效果
- Generates high-quality positive and negative prompt embeddings using the CLIP model
- Supports flexible preset style selection for quickly building complex prompts
- Provides multiple control switches (enable/disable negative output, presets, IDs input, etc.)
- Automatically loads preset style data from local JSON files without manual configuration
- Supports quick selection of multiple styles via IDs
- Can zero out negative prompt embeddings to meet specific scenario requirements
- Suitable for diffusion model conditioning inputs to enhance generation results
---

### 图像色彩调整节点 ColorAdjustment

- 提供全面的图像色彩调整功能，包括曝光、对比度、色温、色调和饱和度
- 支持多种预设滤镜（基于 `pilgram` 库），快速应用流行风格
- 可通过强度滑块精确控制滤镜效果
- 支持批量处理图像，满足高效工作流需求
- 提供灵活的开关选项，一键启用所有滤镜组合
- 适用于图像后期处理与风格化生成
- Offers comprehensive image color adjustments including exposure, contrast, temperature, tint, and saturation
- Supports multiple preset filters (based on the `pilgram` library) for quick application of popular styles
- Allows precise control of filter effects via a strength slider
- Supports batch processing of images for efficient workflows
- Provides flexible switch options to enable all filter combinations with one click
- Suitable for image post-processing and stylized generation
---

### 自定义图像保存节点 CustomSaveImage

- 支持自定义文件名前缀和后缀，确保输出文件名的唯一性
- 提供灵活的图像保存功能，支持多种格式（PNG、JPG）
- 可选择色彩配置文件（sRGB IEC61966-2.1 或 Adobe RGB 1998），确保色彩准确性
- 支持保存元数据（作者信息、版权信息、生成提示词等）
- 提供高质量 JPG 保存选项，可自定义压缩质量
- 自动生成唯一文件名，避免覆盖已有文件
- 适用于需要精确控制输出图像的工作流
- Supports custom filename prefixes and suffixes to ensure the recognizability of output filenames
- Offers flexible image saving functionality with support for multiple formats (PNG, JPG)
- Allows selection of color profiles (sRGB IEC61966-2.1 or Adobe RGB 1998) to ensure color accuracy
- Supports saving metadata (author info, copyright info, generation prompts, etc.)
- Provides high-quality JPG saving options with customizable compression quality
- Automatically generates unique filenames to prevent overwriting existing files
- Suitable for workflows requiring precise control over output images

#### 变量使用说明
- 变量名大小写敏感，请确保正确输入
- Variable names are case-sensitive; please ensure correct input

在 `filename_prefix` 中，可以使用以下动态变量来自定义文件名：
In `filename_prefix`, you can use the following dynamic variables to customize the filename:

##### 1. 日期和时间
- `%date:yyyy-MM-dd%`：当前日期，例如 `2023-10-05`
- `%time:HH-mm-ss%`：当前时间，例如 `14-30-45`

##### 2. KSampler 参数
支持以下变量，多个 `KSampler` 节点会自动编号（如 `_1`, `_2`）：
- `%KSampler.seed%`：随机种子值
- `%KSampler.steps%`：采样步数
- `%KSampler.cfg%`：CFG 值
- `%KSampler.sampler_name%`：采样器名称
- `%KSampler.scheduler%`：调度器名称
- `%KSampler.denoise%`：去噪强度

##### 3. 图像信息
- `%width%`：图像宽度（像素）
- `%height%`：图像高度（像素）

---

### 百度翻译节点 BaiduTranslater

- 使用百度翻译 API 提供高质量的多语言翻译服务
- 支持自动检测源语言及多种目标语言选择（中文简体、中文繁体、英语等）
- 需要用户提供百度 API 的 App ID 和 App Key（可在 [百度翻译开放平台](https://fanyi-api.baidu.com/) 注册获取）
- 自动保存用户输入的 API 配置，简化后续使用
- 提供灵活的启用/禁用翻译功能开关
- 适用于需要精准翻译的多语言工作流
- Utilizes Baidu Translate API to provide high-quality multi-language translation services
- Supports automatic detection of source language and multiple target language options (Simplified Chinese, Traditional Chinese, English, etc.)
- Requires users to provide Baidu API App ID and App Key (can be obtained by registering at [Baidu Translate Open Platform](https://fanyi-api.baidu.com/))
- Automatically saves user-entered API configurations for simplified subsequent use
- Provides a flexible switch to enable or disable the translation function
- Suitable for multi-language workflows requiring precise translations
---

### 通用显示节点 DisplayAny

- 可接收任意类型的输入并将其转换为字符串显示
- 提供灵活的调试和查看功能，适用于任何数据类型
- 输出结果可直接用于后续节点或日志记录
- 简化复杂工作流中的数据可视化需求
- Supports receiving any type of input and converting it to a string for display
- Provides flexible debugging and viewing capabilities, suitable for any data type
- The output can be directly used in subsequent nodes or for logging
- Simplifies data visualization needs in complex workflows
---

### 图像尺寸提取节点 ImageSizeExtractor

- 自动提取输入图像的宽度和高度
- 支持批量图像（4D 张量）和单张图像（3D 张量）输入
- 输出图像的宽度和高度，便于后续处理或计算
- 适用于需要动态获取图像尺寸的工作流
- Automatically extracts the width and height of the input image
- Supports batched images (4D tensor) and single images (3D tensor)
- Outputs the width and height of the image for subsequent processing or calculations
- Suitable for workflows requiring dynamic retrieval of image dimensions
---

### 高级遮罩处理节点 MaskBlurPlus

- 提供遮罩的模糊和扩展功能，增强遮罩的灵活性
- 支持动态调整模糊半径和扩展强度
- 模糊功能使用高斯模糊算法，确保平滑过渡
- 扩展功能支持正向扩展（扩大遮罩）和负向扩展（缩小遮罩）
- 适用于图像分割、遮罩优化等高级工作流
- Provides mask blurring and expansion capabilities to enhance mask flexibility
- Supports dynamic adjustment of blur radius and expansion intensity
- Blurring uses Gaussian blur algorithm for smooth transitions
- Expansion supports both positive (enlarging the mask) and negative (shrinking the mask) adjustments
- Suitable for advanced workflows such as image segmentation and mask optimization
---

### 遮罩预览增强节点 PreviewMaskPlus

- 提供多种遮罩预览模式，包括纯色背景（黑、白、红、绿、蓝）和原始遮罩视图
- 支持动态调整预览样式，便于快速查看遮罩效果
- 自动将遮罩与图像叠加，生成直观的可视化结果
- 适用于遮罩调试、图像合成及分割任务
- 输出预览图像到临时目录，方便快速访问
- Offers multiple mask preview modes, including solid color backgrounds (black, white, red, green, blue) and raw mask view
- Supports dynamic adjustment of preview styles for quick visualization of mask effects
- Automatically overlays the mask with the image to generate intuitive visual results
- Suitable for mask debugging, image compositing, and segmentation tasks
- Outputs preview images to a temporary directory for easy access
---

### 遮罩预览节点 PreviewMask

- 提供遮罩的快速可视化功能，将单通道遮罩转换为 RGB 图像
- 支持动态调整遮罩范围，确保兼容不同输入格式
- 输出预览图像到临时目录，便于快速查看和调试
- 适用于遮罩生成、图像分割等任务的初步验证
- Offers quick visualization of masks by converting single-channel masks into RGB images
- Supports dynamic adjustment of mask ranges to ensure compatibility with different input formats
- Outputs preview images to a temporary directory for easy viewing and debugging
- Suitable for preliminary validation in mask generation and image segmentation tasks
---

### Slider 精度节点系列（Slider10、Slider100、Slider1000）

- 提供三种不同精度的滑块输入节点，分别支持 0-10、0-100 和 0-1000 的整数范围
- 每种精度滑块均支持动态调整，默认值居中，适用于不同精度需求的场景
- 输出整数值，便于直接用于后续计算或参数控制
- 整体设计灵活，满足从粗略到精细的多种工作流需求
- Provides three slider input nodes with different precision levels, supporting integer ranges of 0-10, 0-100, and 0-1000 respectively.
- Each slider supports dynamic adjustment with a default centered value, suitable for various precision requirements.
- Outputs integer values for direct use in subsequent calculations or parameter control.
- The overall design is flexible, meeting workflow needs ranging from coarse to fine adjustments.
---

### 文本处理节点 Text

- 提供一个多行文本输入框，支持动态输入和编辑
- 输出原始文本内容，便于直接用于后续节点或日志记录
- 适用于需要灵活处理文本的工作流场景
- Provides a multi-line text input box with support for dynamic input and editing
- Outputs the original text content for direct use in subsequent nodes or logging
- Suitable for workflow scenarios requiring flexible text handling
---

### 转换为整数节点 To Int

- 将任意类型的输入转换为整数，支持动态数据处理
- 自动对浮点数进行四舍五入，并将无效输入默认为 0
- 输出结果以文本形式显示，便于调试和验证
- 适用于需要将数据标准化为整数的工作流场景
- Converts any type of input to an integer, supporting dynamic data processing
- Automatically rounds floating-point numbers and defaults invalid inputs to 0
- Outputs the result as text for easy debugging and verification
- Suitable for workflow scenarios requiring data normalization to integers
---

---

# 安装 Installation

- 使用 ComfyUI Manager 搜索 KayTool 安装
- 克隆项目到 `ComfyUI/custom_nodes` 目录下，并确保将色彩配置文件放在 resources 目录中

Install via ComfyUI Manager by searching for KayTool.
Clone this project into your `ComfyUI/custom_nodes` directory, ensuring color profile files are placed in the resources directory.