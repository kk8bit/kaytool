class DisplayAny:
    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "input": (("*", {})),  
            },
        }

    RETURN_TYPES = ("STRING",)
    FUNCTION = "execute"
    OUTPUT_NODE = True
    CATEGORY = "KayTool"
    NAME = "Display_Any"

    @classmethod
    def VALIDATE_INPUTS(cls, input_types):
        return True

    def execute(self, input):
       
        text = str(input)
        
        
        return {"ui": {"text": text}, "result": (text,)}


__all__ = ['DisplayAny']