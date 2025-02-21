import json
import requests

class TencentTranslater:

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(s):
        input_types = {
            "required": {
                "Text_A": ("STRING", {"multiline": True}),
                "Text_B": ("STRING", {"multiline": True}),
                "Translate": ("BOOLEAN", {"default": True}),
                "From": (['Auto', 'zh', 'en'], {"default": "Auto"}),
                "To": (['en', 'zh'], {"default": "en"}),
            }
        }
        return input_types

    CATEGORY = "KayTool"

    RETURN_TYPES = ("STRING", "STRING")
    RETURN_NAMES = ("A", "B")
    FUNCTION = "translate_texts"

    DESCRIPTION = "The TencentTranslater node provides a convenient way to translate text using the Tencent Translate API. It supports multiple languages and allows users to specify source and target languages."

    def initData(self, source_lang, target_lang, translate_text):
        return {
            "header": {
                "fn": "auto_translation",
                "client_key": "browser-chrome-110.0.0-Mac OS-df4bd4c5-a65d-44b2-a40f-42f34f3535f2-1677486696487"  # Hard-coded client key
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

    def translate_texts(self, Text_A, Text_B, Translate, From, To):
        if not Translate:
            # If translation is disabled, return the original texts.
            return (Text_A, Text_B)

        from_lang_map = {'Auto': None, 'zh': 'zh', 'en': 'en'}
        to_lang_map = {'en': 'en', 'zh': 'zh'}

        source_lang = from_lang_map[From]
        target_lang = to_lang_map[To]

        def translate_text(text):
            if not text:
                return ""
            url = 'https://transmart.qq.com/api/imt'
            post_data = self.initData(source_lang, target_lang, text)
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
                print(f"Error during translation: {e}")
                raise RuntimeError("Error during translation")

        translated_a = translate_text(Text_A)
        translated_b = translate_text(Text_B)

        return (translated_a, translated_b)