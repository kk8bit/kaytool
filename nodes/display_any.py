class DisplayAny:
    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "input": (("*", {})),  # 接受任何类型的输入
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
        # 简单转换为字符串
        text = str(input)
        
        # 关键在于返回格式，参考其他作者的实现
        return {"ui": {"text": text}, "result": (text,)}

# 导出必须的变量
__all__ = ['DisplayAny']