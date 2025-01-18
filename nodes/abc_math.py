import ast
import operator as op
import math

# 定义 AnyType 类
class AnyType(str):
    def __ne__(self, __value: object) -> bool:
        return False

class AbcMath:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "optional": {
                "a": (AnyType("*"), {"default": 0.0}),  # 使用 AnyType 允许更多类型的输入
                "b": (AnyType("*"), {"default": 0.0}),
                "c": (AnyType("*"), {"default": 0.0}),
            },
            "required": {
                "value": ("STRING", {"multiline": False, "default": ""}),
            },
        }

    RETURN_TYPES = ("INT", "FLOAT",)
    FUNCTION = "execute"
    CATEGORY = "KayTool"

    def execute(self, value, a=0.0, b=0.0, c=0.0):
        try:
            if hasattr(a, 'shape'):
                a = list(a.shape)
            if hasattr(b, 'shape'):
                b = list(b.shape)
            if hasattr(c, 'shape'):
                c = list(c.shape)

            if isinstance(a, str):
                a = float(a) if '.' in a or 'e' in a.lower() else int(a)
            if isinstance(b, str):
                b = float(b) if '.' in b or 'e' in b.lower() else int(b)
            if isinstance(c, str):
                c = float(c) if '.' in c or 'e' in c.lower() else int(c)

            operators = {
                ast.Add: op.add,
                ast.Sub: op.sub,
                ast.Mult: op.mul,
                ast.Div: op.truediv,
                ast.FloorDiv: op.floordiv,
                ast.Pow: op.pow,
                ast.USub: op.neg,
                ast.Mod: op.mod,
                ast.Eq: op.eq,
                ast.NotEq: op.ne,
                ast.Lt: op.lt,
                ast.LtE: op.le,
                ast.Gt: op.gt,
                ast.GtE: op.ge,
                ast.And: lambda x, y: x and y,
                ast.Or: lambda x, y: x or y,
                ast.Not: op.not_
            }

            op_functions = {
                'min': min,
                'max': max,
                'round': round,
                'sum': sum,
                'len': len,
            }

            def eval_(node):
                if isinstance(node, ast.Num):  # number (Python < 3.8)
                    return node.n
                elif isinstance(node, ast.Constant):  # number (Python >= 3.8)
                    return node.value
                elif isinstance(node, ast.Name):  # variable
                    if node.id == "a":
                        return a
                    if node.id == "b":
                        return b
                    if node.id == "c":
                        return c
                elif isinstance(node, ast.BinOp):  # <left> <operator> <right>
                    return operators[type(node.op)](eval_(node.left), eval_(node.right))
                elif isinstance(node, ast.UnaryOp):  # <operator> <operand> e.g., -1
                    return operators[type(node.op)](eval_(node.operand))
                elif isinstance(node, ast.Compare):  # comparison operators
                    left = eval_(node.left)
                    for op_, comparator in zip(node.ops, node.comparators):
                        if not operators[type(op_)](left, eval_(comparator)):
                            return 0
                    return 1
                elif isinstance(node, ast.BoolOp):  # boolean operators (And, Or)
                    values = [eval_(value) for value in node.values]
                    return operators[type(node.op)](*values)
                elif isinstance(node, ast.Call):  # custom function
                    if isinstance(node.func, ast.Name) and node.func.id in op_functions:
                        args = [eval_(arg) for arg in node.args]
                        return op_functions[node.func.id](*args)
                elif isinstance(node, ast.Subscript):  # indexing or slicing
                    value = eval_(node.value)
                    if isinstance(node.slice, ast.Index):  # Python < 3.9
                        index = eval_(node.slice.value)
                    else:  # Python >= 3.9
                        index = eval_(node.slice)
                    return value[index] if isinstance(index, int) and 0 <= index < len(value) else 0
                else:
                    return 0

            parsed_expression = ast.parse(value, mode='eval')
            result = eval_(parsed_expression.body)

            if math.isnan(result):
                result = 0.0

            return (int(round(result)), float(result))
        except Exception:
            return (0, 0.0)


# 导出必须的变量
NODE_CLASS_MAPPINGS = {
    "Abc_Math": AbcMath,  # 确保与 __init__.py 中的键一致
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "Abc_Math": "Abc Math",  # 确保与 __init__.py 中的显示名称一致
}