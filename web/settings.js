import { app } from "/scripts/app.js";

app.registerExtension({
    name: "Kaytool.Settings",
    async setup() {
        async function loadSettings() {
            try {
                const response = await fetch("/kaytool/load_settings");
                const settings = await response.json();
                app.ui.settings.setSettingValue("Kaytool.ShowRunOption", settings.ShowRunOption ?? true);
                app.ui.settings.setSettingValue("Kaytool.ShowSetGetOptions", settings.ShowSetGetOptions ?? true);
                app.ui.settings.setSettingValue("Kaytool.ShowCustomLogo", settings.ShowCustomLogo ?? true);
            } catch (e) {
                console.error("[Kaytool] Failed to load settings:", e);
                app.ui.settings.setSettingValue("Kaytool.ShowRunOption", true);
                app.ui.settings.setSettingValue("Kaytool.ShowSetGetOptions", true);
                app.ui.settings.setSettingValue("Kaytool.ShowCustomLogo", true);
            }
        }

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

        async function updateFavicon() {
            const showLogo = app.ui.settings.getSettingValue("Kaytool.ShowCustomLogo", true);
            let link = document.querySelector("link[rel='icon']");
            if (!link) {
                link = document.createElement("link");
                link.rel = "icon";
                document.head.appendChild(link);
            }
            if (showLogo) {
                const response = await fetch("/kaytool/logo");
                if (response.ok) {
                    link.href = "/kaytool/logo?" + new Date().getTime();
                } else {
                    link.href = "/favicon.ico";
                }
            } else {
                link.href = "/favicon.ico";
            }
        }

        app.ui.settings.addSetting({
            id: "Kaytool.ShowRunOption",
            name: "Show Kaytool ▶️ Run Option in Right-Click Menu",
            type: "boolean",
            defaultValue: true,
            onChange: (value) => {
                console.log("Kaytool Run Option display set to:", value);
                saveSettings("ShowRunOption", value);
            }
        });

        app.ui.settings.addSetting({
            id: "Kaytool.ShowSetGetOptions",
            name: "Show Kaytool 🛜 Set/Get Options in Right-Click Menu",
            type: "boolean",
            defaultValue: true,
            onChange: (value) => {
                console.log("Kaytool Set/Get Options display set to:", value);
                saveSettings("ShowSetGetOptions", value);
            }
        });

        app.ui.settings.addSetting({
            id: "Kaytool.ShowCustomLogo",
            name: "Rename the LOGO file to “logo.(png/jpg/jpeg/ico)” and place it in “/ComfyUI/custom_nodes/kaytool”",
            type: "boolean",
            defaultValue: true,
            options: [
                { value: true, text: "Enabled" },
                { value: false, text: "Disabled" }
            ],
            onChange: (value) => {
                saveSettings("ShowCustomLogo", value);
                updateFavicon();
            }
        });

        await loadSettings();
        await updateFavicon();
    }
});