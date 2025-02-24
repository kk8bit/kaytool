class Text:
    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "text": ("STRING", {
                    "multiline": True,  
                    #"default": "text",  
                    "dynamicPrompts": False,  
                }),
            },
        }

    RETURN_TYPES = ("*",)  
    RETURN_NAMES = ("*",)  
    FUNCTION = "process_text"  
    CATEGORY = "KayTool"  
    #OUTPUT_NODE = True  

    def process_text(self, text):

        return (text,)