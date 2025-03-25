import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "KayTool.StarToMe",
    setup() {
        const originalGetCanvasMenuOptions = LGraphCanvas.prototype.getCanvasMenuOptions;
        LGraphCanvas.prototype.getCanvasMenuOptions = function () {
            const options = originalGetCanvasMenuOptions.apply(this, arguments) || [];
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
                    newOptions.push(null, kaytoolMenu); 
                }

                kaytoolMenu.submenu.options = kaytoolMenu.submenu.options || [];
                const starOptionExists = kaytoolMenu.submenu.options.some(
                    opt => opt && opt.content === "⭐ Star to me"
                );
                if (!starOptionExists) {
                    kaytoolMenu.submenu.options.push({
                        content: "⭐ Star to me",
                        callback: () => {
                            window.open("https://github.com/kk8bit/kaytool", "_blank");
                        }
                    });
                }

                return newOptions;
            }

            return options;
        };
    }
});