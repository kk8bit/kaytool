import os
from pathlib import Path

class RemBGLoader:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "model": ([
                    "u2net",
                    "u2netp",
                    "u2net_human_seg",
                    "isnet-general-use", 
                    "isnet-anime"
                ],),
                "providers": ([
                    "auto",
                    "CPU",
                    "CUDA",
                    "CoreML",
                ],),
            },
        }

    RETURN_TYPES = ("REMOVE_BG",)  
    FUNCTION = "execute"
    CATEGORY = "KayTool/Remove BG"

    def execute(self, model, providers):
        
        # 模型交给 rembg 自己管理（默认 ~/.rembg/models/，可用 REMBG_HOME 或 U2NET_HOME 环境变量改）。
        # 以前这里把 U2NET_HOME 指到插件目录：修改的是整个进程的环境变量，会影响同一个
        # ComfyUI 里其他用 rembg 的插件，而且 rembg 本来就没有别的方式指定目录。

        if providers == "auto":
            providers = self.get_default_provider()

        class Session:
            def __init__(self, model, providers):
                from rembg import new_session
                self.session = new_session(model, providers=[providers + "ExecutionProvider"])

            def process(self, image):
                from rembg import remove
                return remove(image, session=self.session)

        return (Session(model, providers),)

    @staticmethod
    def get_default_provider():
        import torch

        if torch.cuda.is_available():
            return "CUDA"
        elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
            return "CoreML"
        else:
            return "CPU"