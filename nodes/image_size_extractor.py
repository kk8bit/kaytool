class ImageSizeExtractor:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "image": ("IMAGE",),
            }
        }

    RETURN_TYPES = ("INT", "INT")
    RETURN_NAMES = ("width", "height")
    FUNCTION = "execute"
    CATEGORY = "KayTool"
    OUTPUT_NODE = True  # 标记为输出节点，确保即使没有下游连接也会执行

    def execute(self, image):
        try:
            if len(image.shape) == 4:  # Batch of images (batch, height, width, channels)
                batch, height, width, _ = image.shape
            elif len(image.shape) == 3:  # Single image (height, width, channels)
                height, width, _ = image.shape
            else:
                raise ValueError("Unexpected image shape. Expected 3D or 4D tensor.")
            
            # 格式化显示文本为简写形式
            display_text = f"W: {width}, H: {height}"
            return {"ui": {"text": display_text}, "result": (width, height)}
        
        except Exception as e:
            # 如果输入无效或为空，返回默认值
            display_text = "W: none, H: none"
            print(f"[ImageSizeExtractor] Error processing image: {e}")
            return {"ui": {"text": display_text}, "result": (0, 0)}