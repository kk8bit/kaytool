class Slider10:
    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "value": ("INT", {
                    "default": 5,
                    "min": 0,
                    "max": 10,
                    "step": 1,
                    "display": "slider"
                }),
            },
        }

    RETURN_TYPES = ("INT",)
    FUNCTION = "get_value"
    CATEGORY = "KayTool"

    def get_value(self, value):
        return (value,)