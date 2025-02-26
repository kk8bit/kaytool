import { app } from "../../scripts/app.js";
import { setupGenericDisplay } from "./common_display.js";

app.registerExtension({
    name: "KayTool.GenericDisplay",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {

        const nodesWithDisplay = ["Display_Any", "To_Int", "Abc_Math"];
        if (nodesWithDisplay.includes(nodeData.name)) {
            setupGenericDisplay(nodeType, nodeData.name);
        }
    },
});