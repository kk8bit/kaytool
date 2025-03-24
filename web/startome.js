import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "KayTool.StarToMe",

    setup() {
        const orig = LGraphCanvas.prototype.getCanvasMenuOptions;
        LGraphCanvas.prototype.getCanvasMenuOptions = function () {
            const options = orig.apply(this, arguments) || []; 
            const showStarToMe = app.ui.settings.getSettingValue("KayTool.ShowStarToMe"); 

            if (showStarToMe) {
                const newOptions = [...options]; 
                let kaytoolMenu = newOptions.find(opt => opt && opt.content === "KayTool");

                if (!kaytoolMenu) {
                    kaytoolMenu = {
                        content: "KayTool",
                        submenu: {
                            options: []
                        }
                    };
                }

                kaytoolMenu.submenu.options = kaytoolMenu.submenu.options || []; 
                kaytoolMenu.submenu.options.push({
                    content: "⭐ Star to me",
                    callback: () => {
                        window.open("https://github.com/kk8bit/kaytool", "_blank");
                    }
                });

                return newOptions;
            }

            return options;
        };
    },
});