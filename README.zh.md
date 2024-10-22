# KayTool

[更新日志](./CHANGELOG.md)

这是一个为 ComfyUI 开发的自定义节点实用工具包，在未来我会陆续为它增加功能

# 自定义保存图片节点:
![preview_custom_save_image_node](https://github.com/user-attachments/assets/4934de86-e723-450d-b0bb-817f23b20cff)

## 当前功能：

- 选择保存图片的格式（PNG 或 JPG）
- 选择是否保存元数据（工作流信息）
- 支持两种颜色配置文件（sRGB IEC61966-2.1 和 Adobe RGB (1998)）
- 当选择 Adobe RGB 时，自动将图像转换为 Adobe RGB并保证色彩准确
- 自定义 JPG 图片质量（0-100）
- 可以嵌入作者和版权信息
- 自动生成唯一文件名
- 在默认的`output`文件夹下，自动创建`custom_save_images`文件夹，以保存所有的图片

## 一些说明

- 要保存”JPG“格式，必须将"metadata“设置为"False"
- 当选择保存"metadata“(工作流信息)时，将自动切换为"PNG"格式，并忽略"JPG"格式的设置
- 如果你需要更小容量但不损失肉眼可见的画质，可以讲"JPG"图片质量设置为 40，更低的数值将肉眼可见色块

# 安装与使用

- 将本项目克隆到你的 `ComfyUI/custom_nodes`目录下，并确保将 sRGB Profile.icc 和AdobeRGB1998.icc 文件放在 resources 目录中