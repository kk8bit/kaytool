# KayTool

[更新日志(CHANGELOG)](./CHANGELOG.md)

这是一个为 ComfyUI 开发的自定义节点实用工具包，起初只是为了自己用方便，在未来我会陆续为它增加功能。
This is a custom node utility package developed for ComfyUI. Initially created for personal convenience, I will continue adding features in the future.

## 节点预览 Nodes Preview(不全 Not ALL):

![preview_custom_save_image_node](https://github.com/user-attachments/assets/92ef9b39-97f2-4076-903e-79ce7a7375ea)

## 当前功能 Current Features:

### 大壮提示词 Strong Prompt Node

- 控制 Flux + K 采样器组合时负向提示词零化功能（negative out）
- 提供选择预设样式，商用出图神器
- 包含 IDs 组预设
- 各个组的开关，方便长期挂载
- 预设编辑和导入简便，支持各种专业提示词增强  
  **编辑路径**: `KayTool/json/strong_prompt.json`

Control the nullification of negative prompts with the Flux + K Sampler combination.
Offer preset styles for professional outputs.
Include predefined ID groups and group switches for persistent usage.
Easy-to-edit and import presets for professional prompt enhancement.  
**Edit Path**: `KayTool/json/strong_prompt.json`

---

### 百度AI翻译 Baidu Translator Node

- 支持输入两个文本（Text_A 和 Text_B）进行翻译
- 支持自动检测、简体/繁体中文和英文
- 快速启用或禁用翻译
- 配置百度 API [链接](https://fanyi-api.baidu.com/)
- 自动存储 API 信息避免重复输入
- 国内可用的高质量 AI 翻译

Support translation of two separate texts.
Support auto-detection, Simplified/Traditional Chinese, and English.
Quick enable/disable of translation.
Configure Baidu API [Link](https://fanyi-api.baidu.com/)
Automatically save API credentials to avoid repeated input.
High-quality AI translation accessible in China.

---

### 数学运算节点 Abc Math Node

- 支持多种数据类型作为输入（如整数、浮点数、字符串表示的数值等）
- 使用变量 `a`, `b`, `c` 进行数学表达式的计算
- 返回整形和浮点型的结果，适用于需要数值结果的场景
- 提供算术、比较运算功能，支持自定义函数调用

#### 支持的表达式和基本用法 Supported Expressions and Basic Usage:

##### 算术运算 Arithmetic Operations:
- 加法 Addition: `a + b`
- 减法 Subtraction: `a - b`
- 乘法 Multiplication: `a * b`
- 除法 Division: `a / b`
- 幂运算 Power: `a ** b`
- 取模 Modulo: `a % b`

##### 比较运算 Comparison Operations:
- 等于 Equal to: `a == b`
- 不等于 Not equal to: `a != b`
- 小于 Less than: `a < b`
- 小于等于 Less than or equal to: `a <= b`
- 大于 Greater than: `a > b`
- 大于等于 Greater than or equal to: `a >= b`

##### 逻辑运算 Logical Operations:
- 逻辑与 And: `a and b`
- 逻辑或 Or: `a or b`
- 逻辑非 Not: `not a`

##### 内置函数 Built-in Functions:
- 最小值 Min: `min(a, b)`
- 最大值 Max: `max(a, b)`
- 四舍五入 Round: `round(a)`
- 求和 Sum: `sum([a, b, c])` (接受列表参数)
- 长度 Len: `len([a, b, c])` (接受列表参数)

##### 示例用法 Example Usage:
- 计算两数之和 Calculate sum: `value = "a + b"`
- 找三个数中最大值 Find max: `value = "max(a, b, c)"`
- 判断数是否在两个数之间 Check range: `value = "a > b and a < c"`

允许通过字符串形式的数学表达式进行复杂运算。用户可以利用提供的变量 (`a`, `b`, `c`) 和一系列操作符以及内置函数构建表达式。

Allow complex calculations by entering mathematical expressions in string form. Use provided variables (`a`, `b`, `c`) along with operators and built-in functions.

---

### 图像尺寸提取节点 Image Size Extractor Node

- 从输入图像数据中提取宽度和高度信息
- Extract width and height information from the input image data

---

### 啥都能显示 Display Any Node

- 接受任何数据类型输入（如数字、文本、列表等）
- 显示转换后的文本，方便查看
- 返回字符串类型的输出，可用于后续处理
- 适合调试或检查工作流输出内容

Accept any data type input and display converted text for inspection.
Return a string output for subsequent processing.
Ideal for debugging or checking workflow outputs.

---

### 色彩调节 Color Adjustment Node

- 调节图片的曝光、对比度、色温、色调和饱和度
  - 曝光和对比度：范围 -100 到 +100
  - 色温：范围 -100 到 +100，负值增加蓝色，正值增加黄色
  - 色调：范围 -100 到 +100，负值增加绿色，正值增加洋红
  - 饱和度：范围 -100 到 +100

Adjust exposure, contrast, color temperature, hue, and saturation of images within specified ranges.

---

### 自定义图片存储 Custom SaveImage Node

- 选择保存图片的格式（PNG 或 JPG）
- 自定义 JPG 图片质量（0-100）
- 支持两种颜色配置文件（sRGB IEC61966-2.1 和 Adobe RGB (1998)）
  - 选择 Adobe RGB 时，自动将图像转换为 Adobe RGB 色彩空间
- 选择是否保存元数据（包括工作流、作者、版权信息和自定义提示）
- 自动生成唯一文件名确保每个保存的图像有独立名称
- 创建输出文件夹 `output/Custom_Save_Image` 用于保存图片
- 保存 “JPG” 格式时，"metadata" 必须设置为 "False"
- 如果选择保存 "metadata"，格式自动切换为 "PNG"

Select image save format and customize JPG quality.
Support two color profiles with automatic conversion for Adobe RGB.
Choose whether to save metadata including workflow, author, copyright, and custom prompts.
Automatically generate unique filenames and create an output folder.
To save as "JPG", set "metadata" to "False".
If saving "metadata", format switches to "PNG".

---

# 安装 Installation

- 使用 ComfyUI Manager 搜索 KayTool 安装
- 克隆项目到 `ComfyUI/custom_nodes` 目录下，并确保将色彩配置文件放在 resources 目录中

Install via ComfyUI Manager by searching for KayTool.
Clone this project into your `ComfyUI/custom_nodes` directory, ensuring color profile files are placed in the resources directory.