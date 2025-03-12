import os
from pathlib import Path
import torch
from PIL import Image

class BiRefNetLoader:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "model": (["BiRefNet", "BiRefNet_HR", "BiRefNet-portrait"],),
                "providers": (["auto", "cpu", "cuda", "mps"],),
            },
        }

    RETURN_TYPES = ("REMOVE_BG",)
    FUNCTION = "execute"
    CATEGORY = "KayTool/Remove BG"

    def execute(self, model, providers):
        base_path = Path(__file__).parent.parent
        
        model_map = {
            "BiRefNet": "ZhengPeng7/BiRefNet",
            "BiRefNet_HR": "ZhengPeng7/BiRefNet_HR",
            "BiRefNet-portrait": "ZhengPeng7/BiRefNet-portrait"
        }
        full_model_name = model_map[model]
        model_dir = base_path / "models" / "BiRefNet" / full_model_name  

        if providers == "auto":
            providers = self.get_default_provider()

        class BiRefNetSession:
            def __init__(self, model, providers, model_dir):
                self.model_name = model
                self.providers = providers
                self.model_dir = model_dir
                self.model = None

            def process(self, image):
                from torchvision import transforms
                import torch.nn.functional as F
                import numpy as np
                from transformers import AutoModelForImageSegmentation

                if self.model is None:
                    self.model_dir.mkdir(parents=True, exist_ok=True)
                    self.model = AutoModelForImageSegmentation.from_pretrained(
                        self.model_name, trust_remote_code=True, cache_dir=str(self.model_dir)
                    )
                    self.device = torch.device(self.providers)  # 确保 device 是 torch.device 对象
                    self.model.to(self.device)

                transform = transforms.Compose([
                    transforms.Resize((1024, 1024)),
                    transforms.ToTensor(),
                    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
                ])
                orig_w, orig_h = image.size
                im_tensor = transform(image).unsqueeze(0).to(self.device)

                with torch.no_grad():
                    result = self.model(im_tensor)[-1].sigmoid().cpu()
                result = torch.squeeze(F.interpolate(result, size=(orig_h, orig_w)))
                ma = torch.max(result)
                mi = torch.min(result)
                mask = (result - mi) / (ma - mi)

                mask_array = (mask * 255).numpy().astype(np.uint8)
                mask_pil = Image.fromarray(mask_array)
                output_image = Image.new("RGBA", image.size, (0, 0, 0, 0))
                output_image.paste(image.convert("RGB"), (0, 0), mask_pil)
                return output_image

        return (BiRefNetSession(full_model_name, providers, model_dir),)

    @staticmethod
    def get_default_provider():
        import torch
        if torch.cuda.is_available():
            return "cuda"
        elif torch.backends.mps.is_available():
            return "mps"
        else:
            return "cpu"