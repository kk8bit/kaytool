import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "KayTool.KayNodes",
    async setup() {
        console.log("[KayTool] Enhancing virtual connections");
        const originalComputeVisibleNodes = LGraphCanvas.prototype.computeVisibleNodes;
        LGraphCanvas.prototype.computeVisibleNodes = function () {
            const visibleNodesSet = new Set(originalComputeVisibleNodes.apply(this, arguments));
            for (const node of this.graph._nodes) {
                if ((node.type === "KaySetNode" || node.type === "KayGetNode") && node.drawConnection) {
                    visibleNodesSet.add(node);
                }
            }
            return Array.from(visibleNodesSet);
        };
    }
});