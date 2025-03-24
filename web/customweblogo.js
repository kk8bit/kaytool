import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "KayTool.CustomWebLogo",
    async setup() {
        function updateFavicon(dataUrl) {
            let link = document.querySelector("link[rel='icon']");
            if (!link) {
                link = document.createElement("link");
                link.rel = "icon";
                document.head.appendChild(link);
            }
            link.href = dataUrl || "/favicon.ico";
        }

        app.ui.settings.addSetting({
            id: "KayTool.CustomWebLogo",
            name: "File must be < 1MB",
            type: "image",
            tooltip: "This is a test feature. File must be < 1MB to avoid potential errors",
            defaultValue: null,
            category: ["KayTool", "Custom Web Logo (BETA)", "CustomWebLogo"],
            onChange: (newVal) => {
                if (newVal && typeof newVal === "string" && newVal.startsWith("data:image/")) {
                    updateFavicon(newVal);
                } else {
                    updateFavicon(null);
                }
            },
        });

        const savedLogo = app.ui.settings.getSettingValue("KayTool.CustomWebLogo");
        updateFavicon(savedLogo && savedLogo.startsWith("data:image/") ? savedLogo : null);
    },
});