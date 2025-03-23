import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "KayTool.CustomWebLogo",

    async setup() {
        let fileInput;
        let logoFiles = await getLogoList(); 
        let logoOptions = ["none", ...logoFiles]; 

        
        async function getLogoList() {
            try {
                const response = await fetch("/kaytool/logo_list");
                const data = await response.json();
                return data.files || [];
            } catch (e) {
                console.error("[KayTool] Failed to load logo list:", e);
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

        
        async function loadSettings() {
            try {
                const response = await fetch("/kaytool/load_settings");
                const settings = await response.json();
                return settings.CustomWebLogo || "none";
            } catch (e) {
                console.error("[KayTool] Failed to load settings:", e);
                return "none";
            }
        }

        
        async function deleteLogo(filename) {
            try {
                const response = await fetch("/kaytool/delete_logo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ filename })
                });
                if (response.ok) {
                    if (filename === app.ui.settings.getSettingValue("KayTool.CustomWebLogo")) {
                        app.ui.settings.setSettingValue("KayTool.CustomWebLogo", "none");
                        updateFavicon("none");
                        saveSettings("CustomWebLogo", "none");
                    }
                    logoFiles = await getLogoList();
                    logoOptions = ["none", ...logoFiles];
                    const setting = app.ui.settings.settings.get("KayTool.CustomWebLogo");
                    setting.options = logoOptions;
                    app.ui.settings.addSetting({
                        id: "KayTool.CustomWebLogo",
                        name: setting.name,
                        type: "combo",
                        options: logoOptions,
                        defaultValue: setting.defaultValue || "none",
                        onChange: setting.onChange
                    });
                    refreshContextMenu();
                } else {
                    console.error("[KayTool] Failed to delete logo:", response.statusText);
                }
            } catch (e) {
                console.error("[KayTool] Failed to delete logo:", e);
            }
        }

        
        function refreshContextMenu() {
            const canvas = app.canvas;
            if (canvas) {
                canvas._onMenuClose(); 
                setTimeout(() => canvas._onMenu(), 100); 
            }
        }

        
        let currentLogo = await loadSettings();
        updateFavicon(currentLogo);

        
        app.ui.settings.addSetting({
            id: "KayTool.CustomWebLogo",
            name: "Set Web Logo",
            tooltip: "Images in “/ComfyUI/custom_nodes/kaytool/logo” or managed via KayTool menu",
            type: "combo",
            options: logoOptions,
            defaultValue: "none",
            onChange: (value) => {
                saveSettings("CustomWebLogo", value);
                updateFavicon(value);
            }
        });
        app.ui.settings.setSettingValue("KayTool.CustomWebLogo", currentLogo);

        
        const orig = LGraphCanvas.prototype.getCanvasMenuOptions;
        LGraphCanvas.prototype.getCanvasMenuOptions = function () {
            const options = orig.apply(this, arguments);
            const showLogoOptions = app.ui.settings.getSettingValue("KayTool.Menu.ShowLogoOptions", true);

            if (showLogoOptions) {
                
                let kaytoolMenu = options.find(opt => opt?.content === "KayTool");

                if (!kaytoolMenu) {
                    
                    kaytoolMenu = {
                        content: "KayTool",
                        submenu: {
                            options: []
                        }
                    };
                    options.push(null, kaytoolMenu);
                }

                
                kaytoolMenu.submenu.options.push({
                    content: "Web Logo",
                    submenu: {
                        options: [
                            {
                                content: "Import",
                                callback: () => {
                                    if (!fileInput) {
                                        fileInput = document.createElement("input");
                                        Object.assign(fileInput, {
                                            type: "file",
                                            style: "display: none",
                                            onchange: async () => {
                                                const file = fileInput.files[0];
                                                if (file) {
                                                    const formData = new FormData();
                                                    formData.append("logo", file);
                                                    try {
                                                        const response = await fetch("/kaytool/upload_logo", {
                                                            method: "POST",
                                                            body: formData,
                                                        });
                                                        if (response.ok) {
                                                            const newLogoName = file.name;
                                                            app.ui.settings.setSettingValue("KayTool.CustomWebLogo", newLogoName);
                                                            updateFavicon(newLogoName);
                                                            saveSettings("CustomWebLogo", newLogoName);
                                                            logoFiles = await getLogoList();
                                                            logoOptions = ["none", ...logoFiles];
                                                            app.ui.settings.settings.get("KayTool.CustomWebLogo").options = logoOptions;
                                                            refreshContextMenu();
                                                        } else {
                                                            console.error("[KayTool] Upload failed:", response.statusText);
                                                        }
                                                    } catch (e) {
                                                        console.error("[KayTool] Failed to upload logo:", e);
                                                    }
                                                }
                                            },
                                        });
                                        document.body.append(fileInput);
                                    }
                                    fileInput.accept = ".png,.jpg,.jpeg,.ico";
                                    fileInput.click();
                                },
                            },
                            {
                                content: "Set Web Logo",
                                submenu: {
                                    options: logoOptions.map(logo => ({
                                        content: logo,
                                        callback: () => {
                                            app.ui.settings.setSettingValue("KayTool.CustomWebLogo", logo);
                                            updateFavicon(logo);
                                        },
                                    })),
                                },
                            },
                            {
                                content: "Delete Web Logo",
                                submenu: {
                                    options: logoFiles.map(logo => ({
                                        content: logo,
                                        callback: () => {
                                            deleteLogo(logo);
                                        },
                                    })),
                                },
                            },
                        ],
                    },
                });
            }

            return options;
        };
    },
});