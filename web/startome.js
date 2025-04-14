import { app } from "../../../scripts/app.js";

// 全局动作注册表
const KayToolActions = window.KayToolActions || {};
window.KayToolActions = KayToolActions;

function starToMe() {
    window.open("https://github.com/kk8bit/kaytool", "_blank");
}

// 注册 StarToMe 动作
KayToolActions.starToMe = starToMe;

app.registerExtension({
    name: "KayTool.StarToMe",
    setup() {
        const originalGetCanvasMenuOptions = LGraphCanvas.prototype.getCanvasMenuOptions;
        LGraphCanvas.prototype.getCanvasMenuOptions = function (...args) {
            const options = originalGetCanvasMenuOptions.apply(this, args) || [];
            const newOptions = [...options];
            const showStarToMe = app.ui.settings.getSettingValue("KayTool.ShowStarToMe") ?? true;

            if (showStarToMe) {
                let kaytoolMenu = newOptions.find(opt => opt?.content === "KayTool") || {
                    content: "KayTool",
                    submenu: { options: [] }
                };

                if (!newOptions.includes(kaytoolMenu)) {
                    newOptions.push(null, kaytoolMenu);
                }

                if (!kaytoolMenu.submenu.options.some(opt => opt?.content === "⭐ Star to me")) {
                    kaytoolMenu.submenu.options.push({
                        content: "⭐ Star to me",
                        callback: starToMe
                    });
                }
            }

            return newOptions;
        };
    }
});