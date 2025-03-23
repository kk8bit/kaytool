import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "KayTool.StarToMe",

    setup() {
        const orig = LGraphCanvas.prototype.getCanvasMenuOptions;
        LGraphCanvas.prototype.getCanvasMenuOptions = function () {
            const options = orig.apply(this, arguments);
            const showStarToMe = app.ui.settings.getSettingValue("KayTool.Menu.ShowStarToMe", true);

            if (showStarToMe) {
                
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
                    content: "⭐ Star to me",
                    callback: () => {
                        window.open("https://github.com/kk8bit/kaytool", "_blank");
                    }
                });
            }

            return options;
        };
    },
});