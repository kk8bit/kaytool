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
    OUTPUT_NODE = True  

    def execute(self, image):
        try:
            if len(image.shape) == 4:  
                batch, height, width, _ = image.shape
            elif len(image.shape) == 3:  
                height, width, _ = image.shape
            else:
                raise ValueError("Unexpected image shape. Expected 3D or 4D tensor.")
            
            
            display_text = f"W: {width}, H: {height}"
            return {"ui": {"text": display_text}, "result": (width, height)}
        
        except Exception as e:
            
            display_text = "W: none, H: none"
            print(f"[ImageSizeExtractor] Error processing image: {e}")
            return {"ui": {"text": display_text}, "result": (0, 0)}