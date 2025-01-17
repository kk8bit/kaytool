# KayTool

[更新日志](./CHANGELOG.md) [CHANGELOG](./CHANGELOG.md)

这是一个为 ComfyUI 开发的自定义节点实用工具包，起初只是为了自己用方便，在未来我会陆续为它增加功能  
This is a custom node utility package developed for ComfyUI. Initially created for personal convenience, I will continue adding features in the future.

## 节点预览 Nodes Preview: 
 
![preview_custom_save_image_node](https://github.com/user-attachments/assets/92ef9b39-97f2-4076-903e-79ce7a7375ea)

## 当前功能 Nodes:


### 大壮提示词 Strong Prompt Node:

- Flux + K采样器组合时控制负向提示词零化功能（negative out）
- 提供选择预设样式，商用出图神器
- IDs组预设
- 各个组的开关，方便长期挂载
- 预设非常方便编辑和导入，可以导入各种专业提示词增强  
  **编辑**: `KayTool/json/strong_prompt.json`

- Control the nullification of negative prompts with the Flux + K Sampler combination (negative out)
- Offer preset style selection for professional outputs
- Predefined ID groups
- Group switches for persistent usage
- Easy-to-edit and import presets for professional prompt enhancement  
  **Edit**: `KayTool/json/strong_prompt.json`

---

### 百度AI翻译 Baidu Translator Node:

- 用户可以输入两个不同的文本（Text_A 和 Text_B）进行翻译
- 支持自动检测、中文（简体/繁体）和英文
- 快速启用或禁用翻译
- 配置百度 API [https://fanyi-api.baidu.com/](https://fanyi-api.baidu.com/)
- 自动存储 API 信息，避免重复调用节点时反复输入
- 质量很高的AI翻译，国内可用

- Translate two separate texts (Text_A and Text_B)
- Support auto-detection, Simplified/Traditional Chinese, and English
- Quick enable/disable of translation
- Configure Baidu API [https://fanyi-api.baidu.com/](https://fanyi-api.baidu.com/)
- Automatically save API credentials to avoid repeated input
- High-quality AI translation accessible in China

---

### 啥都能显示 Display Any Node:

- 可以输入任何数据类型（如数字、文本、列表等）
- 在用户界面上显示转换后的文本，方便查看
- 返回一个字符串类型的输出，可用于后续处理
- 这个节点非常适合用来调试或检查工作流中各步骤的输出内容

- Accept any data type input (e.g., numbers, text, lists)
- Display the converted text in the user interface for easier inspection
- Return a string output for subsequent processing
- Ideal for debugging or checking workflow outputs

---

### 色彩调节 Color Adjustment Node:

- 支持对图片的曝光、对比度、色温、色调和饱和度进行调节
  - 曝光和对比度：范围为-100到+100
  - 色温：范围为-100到+100，负值增加蓝色，正值增加黄色
  - 色调：范围为-100到+100，负值增加绿色，正值增加洋红
  - 饱和度：范围为-100到+100

- Adjust exposure, contrast, color temperature, hue, and saturation of images:
  - Exposure and contrast: Range -100 to +100
  - Color temperature: Range -100 to +100 (negative for blue, positive for yellow)
  - Hue: Range -100 to +100 (negative for green, positive for magenta)
  - Saturation: Range -100 to +100

---

### 自定义图片存储 Custom SaveImage Node:

- 选择保存图片的格式（PNG 或 JPG）
- 自定义 JPG 图片质量（0-100）
- 支持两种颜色配置文件（sRGB IEC61966-2.1 和 Adobe RGB (1998)）
  - 当选择 Adobe RGB 时，自动将图像转换为 Adobe RGB 色彩空间以确保色彩准确
- 选择是否保存元数据（包括工作流、作者、版权信息和自定义提示）
- 自动生成唯一文件名，以确保每个保存的图像有独立名称
- 自动创建输出文件夹 `output/Custom_Save_Image`，用于保存所有生成的图片
- 要保存 “JPG” 格式，必须将 "metadata" 设置为 "False"
- 如果选择保存 "metadata" (工作流信息)，自动切换为 "PNG" 格式，并忽略 "JPG" 设置

- Select image save format (PNG or JPG)
- Customize JPG quality (0-100)
- Support two color profiles (sRGB IEC61966-2.1 and Adobe RGB (1998))
  - Automatically convert images to Adobe RGB color space when selected for accuracy
- Choose whether to save metadata (workflow, author, copyright, custom prompts)
- Automatically generate unique filenames for each saved image
- Automatically create an output folder `output/Custom_Save_Image` to store images
- To save in "JPG" format, set "metadata" to "False"
- If saving "metadata" (workflow info), the format will automatically switch to "PNG", ignoring "JPG" settings

---

# Installation & Usage:

- 使用 ComfyUI Manager 搜索 KayTool 进行安装
- 将本项目克隆到你的 `ComfyUI/custom_nodes` 目录下，并确保将 sRGB Profile.icc 和 AdobeRGB1998.icc 文件放在 resources 目录中

- Install via ComfyUI Manager by searching for KayTool
- Clone this project into your `ComfyUI/custom_nodes` directory, ensuring the sRGB Profile.icc and AdobeRGB1998.icc files are placed in the resources directory