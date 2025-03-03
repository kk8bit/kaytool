import { app } from "../../scripts/app.js";
import { ComfyWidgets } from "../../scripts/widgets.js";


function setupGenericDisplay(nodeType, nodeName) {
    const onExecuted = nodeType.prototype.onExecuted;
    nodeType.prototype.onExecuted = function (message) {

        onExecuted?.apply(this, arguments);


        if (this.widgets && this.widgets.length > 0) {
            for (let i = 1; i < this.widgets.length; i++) {
                this.widgets[i]?.onRemove?.();
            }
            this.widgets.length = 1;
        }


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


app.registerExtension({
    name: "KayTool.GenericDisplay",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        const nodesWithDisplay = ["Display_Any", "To_Int", "Abc_Math","Image_Size_Extractor"];
        if (nodesWithDisplay.includes(nodeData.name)) {
            setupGenericDisplay(nodeType, nodeData.name);
        }
    },
});