import { app } from "/scripts/app.js";

app.registerExtension({
    name: "Kaytool.Settings",
    async setup() {
        app.ui.settings.addSetting({
            id: "Kaytool.ShowRunOption",
            name: "Show Kaytool ▶️ Run Option in Right-Click Menu",
            type: "boolean",
            defaultValue: true,
            onChange: (value) => {
                console.log("Kaytool Run Option display set to:", value);
            }
        });

        app.ui.settings.addSetting({
            id: "Kaytool.ShowSetGetOptions",
            name: "Show Kaytool 🛜 Set/Get Options in Right-Click Menu",
            type: "boolean",
            defaultValue: true,
            onChange: (value) => {
                console.log("Kaytool Set/Get Options display set to:", value);
            }
        });
    }
});