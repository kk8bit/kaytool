import { app } from "../../scripts/app.js";
import { ComfyWidgets } from "../../scripts/widgets.js";

app.registerExtension({
    name: "kaytool.Display_Any",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (!nodeData?.category?.startsWith("KayTool")) {
            return;
        }

        if (nodeData.name === "Display_Any") {
            const onExecuted = nodeType.prototype.onExecuted;

            nodeType.prototype.onExecuted = function (message) {
                onExecuted?.apply(this, arguments);

                // 清除旧的小部件（除了第一个）
                if (this.widgets && this.widgets.length > 0) {
                    for (let i = 1; i < this.widgets.length; i++) {
                        this.widgets[i]?.onRemove?.();
                    }
                    this.widgets.length = 1;
                }

                // 检查 "text" 小部件是否已经存在，并且确保widgets是数组类型
                let textWidget;
                if (Array.isArray(this.widgets)) {
                    textWidget = this.widgets.find(w => w && w.name === "displaytext");
                }

                if (!textWidget) {
                    try {
                        textWidget = ComfyWidgets["STRING"](this, "displaytext", ["STRING", { multiline: true }], app).widget;
                        if (textWidget && textWidget.inputEl) {
                            textWidget.inputEl.readOnly = true;
                            textWidget.inputEl.style.border = "none";
                            textWidget.inputEl.style.backgroundColor = "transparent";
                        }
                    } catch (error) {
                        console.error('Failed to create text widget:', error);
                    }
                }

                // 修改这行来处理文本
                if (message && message.hasOwnProperty("text")) {
                    const text = message["text"];
                    if (textWidget) {
                        textWidget.value = Array.isArray(text) ? text.join("") : text;
                    } else {
                        console.warn('Text widget not available to set value.');
                    }
                } else {
                    console.warn('Message does not contain a "text" property.');
                }
            };
        }
    },
});