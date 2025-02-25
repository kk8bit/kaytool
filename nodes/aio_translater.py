import json
import requests

class AIOTranslater:
    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(s):
        input_types = {
            "required": {
                "Text": ("STRING", {"multiline": True}),
                "To": ([
                    "English",      # 英语
                    "中文",         # 中文 (zh)
                    "Deutsch",      # 德语
                    "Español",      # 西班牙语
                    "Français",     # 法语
                    "Italiano",     # 意大利语
                    "日本語",        # 日语
                    "한국어",        # 韩语
                    "Português",    # 葡萄牙语
                    "Русский",      # 俄语
                    "العربية",      # 阿拉伯语
                    "ไทย",          # 泰语
                    "Türkçe",       # 土耳其语
                    "Tiếng Việt"    # 越南语
                ], {"default": "English"}),
            }
        }
        return input_types

    CATEGORY = "KayTool"

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("Translated_Text",)
    FUNCTION = "translate_text"

    DESCRIPTION = "The AIOTranslater node provides automatic translation of a single text input using the Tencent Translate API with support for multiple target languages."

    def initData(self, source_lang, target_lang, translate_text):
        return {
            "header": {
                "fn": "auto_translation",
                "client_key": "browser-chrome-110.0.0-Mac OS-df4bd4c5-a65d-44b2-a40f-42f34f3535f2-1677486696487"
            },
            "type": "plain",
            "model_category": "normal",
            "source": {
                "lang": source_lang,
                "text_list": [translate_text]
            },
            "target": {
                "lang": target_lang
            }
        }

    def translate_text(self, Text, To):
        # 语言名称到代码的映射
        lang_map = {
            "English": "en",
            "中文": "zh",       # 恢复为 zh
            "Deutsch": "de",
            "Español": "es",
            "Français": "fr",
            "Italiano": "it",
            "日本語": "ja",
            "한국어": "ko",
            "Português": "pt",
            "Русский": "ru",
            "العربية": "ar",
            "ไทย": "th",
            "Türkçe": "tr",
            "Tiếng Việt": "vi"
        }

        # 获取目标语言代码
        target_lang = lang_map[To]

        def translate_single_text(text):
            if not text:
                return ""
            url = 'https://transmart.qq.com/api/imt'
            post_data = self.initData(None, target_lang, text)
            headers = {
                'Content-Type': 'application/json',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                'referer': 'https://transmart.qq.com/zh-CN/index'
            }
            try:
                response = requests.post(url, headers=headers, data=json.dumps(post_data))
                result = response.json()
                if response.status_code != 200 or 'auto_translation' not in result or not result['auto_translation']:
                    error_msg = f"Translation failed with status code {response.status_code}: {result.get('error_msg', 'Unknown error')}"
                    print(error_msg)
                    raise RuntimeError(error_msg)
                return '\n'.join(result['auto_translation'])
            except Exception as e:
                error_msg = f"Error during translation: {str(e)}"
                print(error_msg)
                raise RuntimeError(error_msg)

        translated_text = translate_single_text(Text)
        return (translated_text,)