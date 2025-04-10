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
                                message: "🧹 **Clean:** Working...",
                                size: "medium",
                                bgColor: "#fff3cd"
                            });

                            try {
                                const response = await fetch("/kaytool/clean_vram", { method: "POST" });
                                const message = await response.text();

                                hideNotification(notifyElement);

                                if (!response.ok) {
                                    showNotification({
                                        message: message || "🧹 **Clean:** Failed due to server error",
                                        bgColor: "#f8d7da",
                                        size: "medium",
                                        timeout: 7000
                                    });
                                    return;
                                }

                                const match = message.match(/Freed ([\d.]+) GB \(Allocated: ([\d.]+) GB -> ([\d.]+) GB, Total: ([\d.]+) GB -> ([\d.]+) GB\)/);
                                if (match) {
                                    showNotification({
                                        message: `🧹 **Clean:** Done!  
**${match[2]} GB** ➔ **${match[3]} GB** 
(Total: ${match[4]} GB ➔ ${match[5]} GB)`,
                                        bgColor: "#d4edda",
                                        size: "medium",
                                        timeout: 8000
                                    });
                                } else {
                                    showNotification({
                                        message: `🧹 **Clean:** ${message}`,
                                        bgColor: "#d4edda",
                                        size: "medium",
                                        timeout: 8000
                                    });
                                }
                            } catch (err) {
                                hideNotification(notifyElement);
                                showNotification({
                                    message: `🧹 **Clean:** ${err.message}`,
                                    bgColor: "#f8d7da",
                                    size: "medium",
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