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
        if len(image.shape) == 4:  
            batch, height, width, _ = image.shape
        elif len(image.shape) == 3:  
            height, width, _ = image.shape
        else:
            raise ValueError("Unexpected image shape. Expected 3D or 4D tensor.")
        
        return (width, height)