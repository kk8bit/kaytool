import { app } from "../../../scripts/app.js";
import { showNotification, hideNotification } from "./notification.js";

app.registerExtension({
    name: "KayTool.CleanVRAM",
    setup() {
        const originalGetCanvasMenuOptions = LGraphCanvas.prototype.getCanvasMenuOptions;
        LGraphCanvas.prototype.getCanvasMenuOptions = function (...args) {
            const options = originalGetCanvasMenuOptions.apply(this, args) || [];
            const newOptions = [...options];
            const showCleanVRAM = app.ui.settings.getSettingValue("KayTool.ShowCleanVRAM");

            if (showCleanVRAM) {
                let kaytoolMenu = newOptions.find(opt => opt?.content === "KayTool") || {
                    content: "KayTool",
                    submenu: { options: [] }
                };

                if (!newOptions.includes(kaytoolMenu)) {
                    newOptions.push(null, kaytoolMenu);
                }

                if (!kaytoolMenu.submenu.options.some(opt => opt?.content === "🧹 Clean VRAM")) {
                    kaytoolMenu.submenu.options.push({
                        content: "🧹 Clean VRAM",
                        async callback() {
                            const notifyElement = showNotification({
                                message: "🧹 <b>Clean:</b> Working...",
                                size: "small",
                                bgColor: "#fff3cd"
                            });

                            try {
                                const response = await fetch("/kaytool/clean_vram", { method: "POST" });
                                const message = await response.text();
                                hideNotification(notifyElement);

                                const match = message.match(/Freed ([\d.]+) GB \(Total: ([\d.]+) GB -> ([\d.]+) GB\)/);
                                showNotification({
                                    message: response.ok && match
                                        ? `🧹 **Clean:** Done!\n${match[2]} GB ➔ ${match[3]} GB`
                                        : `🧹 <b>Clean:</b> ${message}`,
                                    bgColor: response.ok && match ? "#d4edda" : "#f8d7da",
                                    size: "small",
                                    timeout: 5000
                                });
                            } catch (err) {
                                hideNotification(notifyElement);
                                showNotification({
                                    message: `🧹 <b>Clean:</b> ${err.message}`,
                                    bgColor: "#f8d7da",
                                    size: "small",
                                    timeout: 5000
                                });
                            }
                        }
                    });
                }
            }
            return newOptions;
        };
    }
});