class ToInt:
    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "input": (("*", {})),  
            },
        }

    RETURN_TYPES = ("INT",)
    FUNCTION = "execute"
    OUTPUT_NODE = True
    CATEGORY = "KayTool"
    NAME = "To Int"

    @classmethod
    def VALIDATE_INPUTS(cls, input_types):
        return True

    def execute(self, input):
        try:
            rounded_value = int(round(float(input)))
        except (ValueError, TypeError):
            rounded_value = 0
        text = str(rounded_value)
        return {"ui": {"text": text}, "result": (rounded_value,)}

__all__ = ['ToInt']