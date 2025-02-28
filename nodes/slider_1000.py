class Slider1000:
    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "value": ("INT", {
                    "default": 500,
                    "min": 0,
                    "max": 1000,
                    "step": 1,
                    "display": "slider"
                }),
            },
        }

    RETURN_TYPES = ("INT",)
    FUNCTION = "get_value"
    CATEGORY = "KayTool/Slider"

    def get_value(self, value):
        return (value,)