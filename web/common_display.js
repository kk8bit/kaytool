import { app } from "../../scripts/app.js";
import { ComfyWidgets } from "../../scripts/widgets.js";

// 定义通用显示逻辑
function setupGenericDisplay(nodeType, nodeName) {
    const onExecuted = nodeType.prototype.onExecuted;
    nodeType.prototype.onExecuted = function (message) {
        // 调用原始的 onExecuted 方法（如果存在）
        onExecuted?.apply(this, arguments);

        // 清理多余的 widgets
        if (this.widgets && this.widgets.length > 0) {
            for (let i = 1; i < this.widgets.length; i++) {
                this.widgets[i]?.onRemove?.();
            }
            this.widgets.length = 1;
        }

        // 查找或创建 "displaytext" widget
        let textWidget = Array.isArray(this.widgets)
            ? this.widgets.find(w => w && w.name === "displaytext")
            : null;

        if (!textWidget) {
            try {
                textWidget = ComfyWidgets["STRING"](this, "displaytext", ["STRING", { multiline: true }], app).widget;
                if (textWidget && textWidget.inputEl) {
                    textWidget.inputEl.readOnly = true;
                    textWidget.inputEl.style.border = "none";
                    textWidget.inputEl.style.backgroundColor = "transparent";
                }
            } catch (error) {
                console.error(`[${nodeName}] Failed to create text widget:`, error);
            }
        }

        // 更新 "displaytext" widget 的值
        if (message && message.hasOwnProperty("text")) {
            const text = message["text"];
            if (textWidget) {
                textWidget.value = Array.isArray(text) ? text.join("") : text;
            } else {
                console.warn(`[${nodeName}] Text widget not available to set value.`);
            }
        } else {
            console.warn(`[${nodeName}] Message does not contain a "text" property.`);
        }
    };
}

// 注册扩展
app.registerExtension({
    name: "KayTool.GenericDisplay",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        const nodesWithDisplay = ["Display_Any", "To_Int", "Abc_Math"];
        if (nodesWithDisplay.includes(nodeData.name)) {
            setupGenericDisplay(nodeType, nodeData.name);
        }
    },
});