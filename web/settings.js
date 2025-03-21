import { app } from "/scripts/app.js";

app.registerExtension({
    name: "Kaytool.Settings",
    async setup() {
        // 加载设置
        async function loadSettings() {
            try {
                const response = await fetch("/kaytool/load_settings");
                const settings = await response.json();
                app.ui.settings.setSettingValue("Kaytool.ShowRunOption", settings.ShowRunOption ?? true);
                app.ui.settings.setSettingValue("Kaytool.ShowSetGetOptions", settings.ShowSetGetOptions ?? true);
                app.ui.settings.setSettingValue("Kaytool.CustomWebLogo", settings.CustomWebLogo || "none");
            } catch (e) {
                console.error("[Kaytool] Failed to load settings:", e);
                app.ui.settings.setSettingValue("Kaytool.ShowRunOption", true);
                app.ui.settings.setSettingValue("Kaytool.ShowSetGetOptions", true);
                app.ui.settings.setSettingValue("Kaytool.CustomWebLogo", "none");
            }
        }

        // 保存设置
        async function saveSettings(key, value) {
            try {
                await fetch("/kaytool/save_settings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ [key]: value })
                });
            } catch (e) {
                console.error("[Kaytool] Failed to save settings:", e);
            }
        }

        // 获取 logo 文件列表
        async function getLogoList() {
            try {
                const response = await fetch("/kaytool/logo_list");
                const data = await response.json();
                return data.files || [];
            } catch (e) {
                console.error("[Kaytool] Failed to load logo list:", e);
                return [];
            }
        }

        // 更新 favicon
        function updateFavicon(value) {
            let link = document.querySelector("link[rel='icon']");
            if (!link) {
                link = document.createElement("link");
                link.rel = "icon";
                document.head.appendChild(link);
            }
            if (value === "none") {
                link.href = "/favicon.ico";
            } else {
                link.href = `/kaytool/logo/${value}?${new Date().getTime()}`;
            }
        }

        // 先加载设置
        await loadSettings();

        // 获取 logo 文件列表并生成选项
        const logoFiles = await getLogoList();
        const logoOptions = ["none", ...logoFiles];

        // 添加设置项
        app.ui.settings.addSetting({
            id: "Kaytool.ShowRunOption",
            name: "Show Kaytool “▶️ Run” Option in Right-Click Menu",
            type: "boolean",
            defaultValue: true,
            onChange: (value) => {
                console.log("Kaytool Run Option display set to:", value);
                saveSettings("ShowRunOption", value);
            }
        });

        app.ui.settings.addSetting({
            id: "Kaytool.ShowSetGetOptions",
            name: "Show Kaytool “🛜 Set/Get” Options in Right-Click Menu",
            type: "boolean",
            defaultValue: true,
            onChange: (value) => {
                console.log("Kaytool Set/Get Options display set to:", value);
                saveSettings("ShowSetGetOptions", value);
            }
        });

        app.ui.settings.addSetting({
            id: "Kaytool.CustomWebLogo",
            name: "Place LOGO Images in “/ComfyUI/custom_nodes/kaytool/logo”",
            type: "combo",
            options: logoOptions,
            defaultValue: "none",
            onChange: (value) => {
                saveSettings("CustomWebLogo", value);
                updateFavicon(value);
            }
        });

        // 初始化 favicon
        const currentLogo = app.ui.settings.getSettingValue("Kaytool.CustomWebLogo", "none");
        updateFavicon(currentLogo);
    }
});