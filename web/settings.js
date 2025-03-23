import { app } from "/scripts/app.js";

app.registerExtension({
    name: "KayTool.Settings",
    async setup() {
        async function loadSettings() {
            try {
                const response = await fetch("/kaytool/load_settings");
                const settings = await response.json();
                app.ui.settings.setSettingValue("KayTool.QuickAccess.ShowRunOption", settings.ShowRunOption ?? true);
                app.ui.settings.setSettingValue("KayTool.QuickAccess.ShowSetGetOptions", settings.ShowSetGetOptions ?? true);
                app.ui.settings.setSettingValue("KayTool.Hotkeys.ShiftR", settings.ShiftR ?? true);
                app.ui.settings.setSettingValue("KayTool.Menu.ShowWorkflowPNG", settings.ShowWorkflowPNG ?? true);
                app.ui.settings.setSettingValue("KayTool.Menu.ShowLogoOptions", settings.ShowLogoOptions ?? true);
                app.ui.settings.setSettingValue("KayTool.Menu.ShowStarToMe", settings.ShowStarToMe ?? true);
                app.ui.settings.setSettingValue("KayTool.WorkflowPNG", settings.MarginSize ?? 100); 
            } catch (e) {
                console.error("[KayTool] Failed to load settings:", e);
                app.ui.settings.setSettingValue("KayTool.QuickAccess.ShowRunOption", true);
                app.ui.settings.setSettingValue("KayTool.QuickAccess.ShowSetGetOptions", true);
                app.ui.settings.setSettingValue("KayTool.Hotkeys.ShiftR", true);
                app.ui.settings.setSettingValue("KayTool.Menu.ShowWorkflowPNG", true);
                app.ui.settings.setSettingValue("KayTool.Menu.ShowLogoOptions", true);
                app.ui.settings.setSettingValue("KayTool.Menu.ShowStarToMe", true); 
                app.ui.settings.setSettingValue("KayTool.WorkflowPNG", 100); 
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
                console.error("[KayTool] Failed to save settings:", e);
            }
        }
        
        await loadSettings();
        
        app.ui.settings.addSetting({
            id: "KayTool.QuickAccess.ShowRunOption",
            name: "Show “▶️ Run” options in node right-click menu",
            type: "boolean",
            defaultValue: true,
            onChange: (value) => {
                saveSettings("ShowRunOption", value);
            }
        });

        app.ui.settings.addSetting({
            id: "KayTool.QuickAccess.ShowSetGetOptions",
            name: "Show “🛜 Set/Get” options in node right-click menu",
            type: "boolean",
            defaultValue: true,
            onChange: (value) => {
                saveSettings("ShowSetGetOptions", value);
            }
        });

        app.ui.settings.addSetting({
            id: "KayTool.Hotkeys.ShiftR",
            name: "Use “Shift+R” to quickly execute “▶️ Run” on the selected node",
            type: "boolean",
            defaultValue: true,
            onChange: (value) => {
                saveSettings("ShiftR", value);
            }
        });

        app.ui.settings.addSetting({
            id: "KayTool.Menu.ShowWorkflowPNG",
            name: "Show “Workflow PNG” Options in KayTool Menu",
            type: "boolean",
            defaultValue: true,
            onChange: (value) => {
                saveSettings("ShowWorkflowPNG", value);
            }
        });

        app.ui.settings.addSetting({
            id: "KayTool.Menu.ShowLogoOptions",
            name: "Show “Logo” Options in KayTool Menu",
            type: "boolean",
            defaultValue: true,
            onChange: (value) => {
                saveSettings("ShowLogoOptions", value);
            }
        });

        app.ui.settings.addSetting({
            id: "KayTool.Menu.ShowStarToMe",
            name: "Show “⭐️ Star to me” Option in KayTool Menu",
            type: "boolean",
            defaultValue: true,
            onChange: (value) => {
                saveSettings("ShowStarToMe", value);
            }
        });

        
        app.ui.settings.addSetting({
            id: "KayTool.WorkflowPNG",
            name: "Margin Size for Workflow PNG Export",
            type: "slider",
            defaultValue: 100,
            attrs: { min: 0, max: 200, step: 10 },
            onChange: (value) => {
                saveSettings("MarginSize", value);
            }
        });
    }
});