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

    RETURN_TYPES = ("REMBG_LOADER",)  
    FUNCTION = "execute"
    CATEGORY = "KayTool/Background Removal"

    def execute(self, model, providers):

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