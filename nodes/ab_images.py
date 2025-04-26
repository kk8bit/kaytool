from nodes import PreviewImage

class ABImages(PreviewImage):
    """A node that compares two images in the UI with Slide mode."""

    NAME = "AB Images"
    CATEGORY = "KayTool"
    FUNCTION = "compare_images"

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "a": ("IMAGE",), 
            },
            "optional": {
                "b": ("IMAGE",),  
            },
            "hidden": {
                "prompt": "PROMPT",
                "extra_pnginfo": "EXTRA_PNGINFO"
            },
        }

    def compare_images(self,
                      a=None, 
                      b=None,  
                      filename_prefix="KayTool.ab_images.",
                      prompt=None,
                      extra_pnginfo=None):
        result = {"ui": {"a": [], "b": []}}  
        
        if a is not None and len(a) > 0:
            result["ui"]["a"] = self.save_images(a, filename_prefix, prompt, extra_pnginfo)["ui"]["images"]
        if b is not None and len(b) > 0:
            result["ui"]["b"] = self.save_images(b, filename_prefix, prompt, extra_pnginfo)["ui"]["images"]

        return result