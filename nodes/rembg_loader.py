from ..utils.helpers import get_default_provider

class RemBGLoader:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "model": ([
                    "u2net", 
                    "u2netp", 
                    "u2net_human_seg", 
                    "u2net_cloth_seg", 
                    "silueta", 
                    "isnet-general-use", 
                    "isnet-anime", 
                    "sam"
                ],),
                "providers": ([
                    "auto",
                    "CPU",
                    "CUDA",
                    "ROCM",
                    "DirectML",
                    "OpenVINO",
                    "CoreML",
                    "Tensorrt",
                    "Azure"
                ],),
            },
        }

    RETURN_TYPES = ("REMBG_LOADER",)  
    FUNCTION = "execute"
    CATEGORY = "KayTool/Background Removal"

    def execute(self, model, providers):
        if providers == "auto":
            providers = get_default_provider()

        class Session:
            def __init__(self, model, providers):
                from rembg import new_session
                self.session = new_session(model, providers=[providers + "ExecutionProvider"])

            def process(self, image):
                from rembg import remove
                return remove(image, session=self.session)

        return (Session(model, providers),)