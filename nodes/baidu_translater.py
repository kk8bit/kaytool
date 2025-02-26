import os
import json
import requests
import random
from hashlib import md5

JSON_DIR = os.path.join(os.path.dirname(__file__), "../json")

def make_md5(s, encoding='utf-8'):
    return md5(s.encode(encoding)).hexdigest()

class BaiduTranslater:

    _config_data = None

    @classmethod
    def _load_config(cls):
        if cls._config_data is not None:
            return
        
        config_path = os.path.join(JSON_DIR, "Baidu_Translater_config.json")
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                cls._config_data = json.load(f)
        except Exception as e:
            print(f"Error loading Baidu Translater config JSON: {e}")
            cls._config_data = {}

    @classmethod
    def INPUT_TYPES(s):
        s._load_config()
        
        input_types = {
            "required": {
                "Text_A": ("STRING", {"multiline": True, "placeholder": "Text A"}),
                "Text_B": ("STRING", {"multiline": True, "placeholder": "Text B"}),
                "Translate": ("BOOLEAN", {"default": True, "label": "Enable Translation (启用翻译)", "tooltip": "Toggle this switch to enable or disable the translation function. (切换此开关以启用或禁用翻译功能。)"}),  # 参数名称为 Translate，默认值为 true
                "From": (
                    [
                        'Auto',
                        '中文（简体）',
                        '中文（繁体）',
                        'English'
                    ],
                    {"default": "Auto", "tooltip": "Select the source language of the text. 'Auto' will automatically detect the language. (选择文本的源语言。'自动检测'将自动识别语言。)"}
                ),
                "To": ([
                         'English',
                         '中文（简体）',
                         '中文（繁体）'
                       ], {"default": "English", "tooltip": "Choose the target language into which the text will be translated. (选择文本要翻译成的目标语言。)"}),
                "ID": ("STRING", {"multiline": False, "placeholder": "Input AppId (输入 AppId)", 
                                 "tooltip": "Enter your Baidu API App ID here. You can obtain an App ID and API key by registering at https://fanyi-api.baidu.com/. (在此处输入你的百度 API App ID。你可以通过注册 https://fanyi-api.baidu.com/ 获得 App ID 和 API 密钥。)"}),
                "Key": ("STRING", {"multiline": False, "placeholder": "Input AppKey (输入 AppKey)", 
                                  "tooltip": "Enter your Baidu API App Key here. You can obtain an App ID and API key by registering at https://fanyi-api.baidu.com/. (在此处输入你的百度 API App Key。你可以通过注册 https://fanyi-api.baidu.com/ 获得 App ID 和 API 密钥。)"}),
            }
        }

        # Load the saved appid and appkey if they exist
        if s._config_data:
            input_types["required"]["ID"] = ("STRING", {"multiline": False, "default": s._config_data.get('baidu_appid', ''), "tooltip": input_types["required"]["ID"][1]["tooltip"]})
            input_types["required"]["Key"] = ("STRING", {"multiline": False, "default": s._config_data.get('baidu_appkey', ''), "tooltip": input_types["required"]["Key"][1]["tooltip"]})

        return input_types

    CATEGORY = "KayTool"

    RETURN_TYPES = ("STRING", "STRING")
    RETURN_NAMES = ("A", "B")
    FUNCTION = "translate_texts"
    
    OUTPUT_TOOLTIPS = (
        "Translated text corresponding to input Text A. (对应输入文本 A 的翻译文本。)",
        "Translated text corresponding to input Text B. (对应输入文本 B 的翻译文本。)"
    )

    DESCRIPTION = "The BaiduTranslater node provides a convenient way to translate text using the Baidu Translate API. It supports multiple languages and allows users to specify source and target languages. Users must provide their own Baidu API App ID and App Key, which can be obtained from https://fanyi-api.baidu.com/. (BaiduTranslater 节点提供了一种使用百度翻译 API 翻译文本的便捷方式。它支持多种语言，并允许用户指定源语言和目标语言。用户必须提供自己的百度 API App ID 和 App Key，这些可以从 https://fanyi-api.baidu.com/ 获取。)"

    def __init__(self):
        self.appid, self.appkey = self.load_config()

    def load_config(self):
        self._load_config()
        return self._config_data.get('baidu_appid', ''), self._config_data.get('baidu_appkey', '')

    def save_config(self, appid, appkey):
        config_path = os.path.join(JSON_DIR, "Baidu_Translater_config.json")
        config = {'baidu_appid': appid, 'baidu_appkey': appkey}
        try:
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(config, f, ensure_ascii=False, indent=4)
        except Exception as e:
            print(f"Error saving Baidu Translater config JSON: {e}")

    def translate_texts(self, Text_A, Text_B, Translate, From, To, ID, Key):
        if not Translate:
            # If translation is disabled, return the original texts.
            return (Text_A, Text_B)

        # If user has entered new appid or appkey, save them
        if ID != self.appid or Key != self.appkey:
            self.save_config(ID, Key)
            self.appid, self.appkey = ID, Key

        from_lang_map = {
            'Auto': 'auto',
            '中文（简体）': 'zh',
            '中文（繁体）': 'cht',
            'English': 'en'
        }
        to_lang_map = {
            'English': 'en',
            '中文（简体）': 'zh',
            '中文（繁体）': 'cht'
        }
        from_lang = from_lang_map[From]
        to_lang = to_lang_map[To]
        endpoint = 'https://api.fanyi.baidu.com'
        path = '/api/trans/vip/translate'
        url = endpoint + path

        def translate_text(text):
            if not text:
                return ""
            query = text
            salt = random.randint(32768, 65536)
            sign = make_md5(self.appid + query + str(salt) + self.appkey)

            headers = {'Content-Type': 'application/x-www-form-urlencoded'}
            payload = {'appid': self.appid, 'q': query, 'from': from_lang, 'to': to_lang, 'salt': salt, 'sign': sign}

            r = requests.post(url, data=payload, headers=headers)
            result = r.json()
            if r.status_code != 200 or 'error_code' in result:
                error_msg = f"Translation failed with status code {r.status_code}: {result.get('error_msg', 'Unknown error')}"
                print(error_msg)
                raise RuntimeError(error_msg)

            try:
                return result['trans_result'][0]['dst']
            except (IndexError, KeyError):
                print("Unexpected response format:", result)
                raise RuntimeError("Unexpected response format from translation service.")

        # Attempt to translate both texts regardless of whether appid and appkey are empty or not.
        try:
            translated_a = translate_text(Text_A)
            translated_b = translate_text(Text_B)
        except RuntimeError as e:
            # If there's an error during translation, re-raise the exception to inform the user.
            raise RuntimeError(f"An error occurred during translation: {e}")

        return (translated_a, translated_b)

# Ensure the JSON directory exists
os.makedirs(JSON_DIR, exist_ok=True)