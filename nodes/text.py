class Text:
    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "text": ("STRING", {
                    "multiline": True,  
                    "dynamicPrompts": False,  
                }),
            },
        }

    RETURN_TYPES = ("STRING",)  
    FUNCTION = "process_text"
    OUTPUT_NODE = True  
    CATEGORY = "KayTool"
    NAME = "Text"  

    def process_text(self, text):
        result_text = str(text)  
        
        return {"ui": {"text": result_text}, "result": (result_text,)} 

__all__ = ['Text']