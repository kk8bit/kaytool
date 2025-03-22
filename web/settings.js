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
                app.ui.settings.setSettingValue("Kaytool.CustomWebLogo", settings.CustomWebLogo || "none");
                app.ui.settings.setSettingValue("Kaytool.ShiftR", settings.ShiftR ?? true);
            } catch (e) {
                console.error("[Kaytool] Failed to load settings:", e);
                app.ui.settings.setSettingValue("Kaytool.ShowRunOption", true);
                app.ui.settings.setSettingValue("Kaytool.ShowSetGetOptions", true);
                app.ui.settings.setSettingValue("Kaytool.CustomWebLogo", "none");
                app.ui.settings.setSettingValue("Kaytool.ShiftR", true);
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
        
        await loadSettings();
        
        const logoFiles = await getLogoList();
        const logoOptions = ["none", ...logoFiles];
        
        app.ui.settings.addSetting({
            id: "Kaytool.ShowRunOption",
            name: "Show Kaytool “▶️ Run” Option in Right-Click Menu",
            type: "boolean",
            defaultValue: true,
            onChange: (value) => {
                saveSettings("ShowRunOption", value);
            }
        });

        app.ui.settings.addSetting({
            id: "Kaytool.ShowSetGetOptions",
            name: "Show Kaytool “🛜 Set/Get” Options in Right-Click Menu",
            type: "boolean",
            defaultValue: true,
            onChange: (value) => {
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

        app.ui.settings.addSetting({
            id: "Kaytool.ShiftR",
            name: "Use “Shift+R” to quickly execute “▶️ Run” on the selected node.",
            type: "boolean",
            defaultValue: true,
            onChange: (value) => {
                saveSettings("ShiftR", value);
            }
        });
        
        const currentLogo = app.ui.settings.getSettingValue("Kaytool.CustomWebLogo", "none");
        updateFavicon(currentLogo);
    }
});