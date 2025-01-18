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

    def execute(self, image):
        if len(image.shape) == 4:  # 如果是批次图像 (batch, height, width, channels)
            batch, height, width, _ = image.shape
        elif len(image.shape) == 3:  # 单张图像 (height, width, channels)
            height, width, _ = image.shape
        else:
            raise ValueError("Unexpected image shape. Expected 3D or 4D tensor.")
        
        return (width, height)