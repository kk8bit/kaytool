import { app } from "../../../scripts/app.js";

const UNSUPPORTED_NODES = new Set(["Group", "Reroute", "Note"]);

function addNode(name, nextTo, options = {}) {
    options = { side: "left", select: true, shiftY: 0, shiftX: 0, ...options };
    const node = LiteGraph.createNode(name);
    app.graph.add(node);
    node.pos = [
        options.side === "left" ? nextTo.pos[0] - (node.size[0] + options.offset) : nextTo.pos[0] + nextTo.size[0] + options.offset,
        nextTo.pos[1] + options.shiftY,
    ];
    if (options.select) {
        app.canvas.selectNode(node, false);
    }
    return node;
}

app.registerExtension({
    name: "KayTool.QuickAdd",
    beforeRegisterNodeDef(nodeType, nodeData) {
        if (nodeData.input?.required && !UNSUPPORTED_NODES.has(nodeData.name)) {
            const originalGetExtraMenuOptions = nodeType.prototype.getExtraMenuOptions;
            nodeType.prototype.getExtraMenuOptions = function(_, options) {
                originalGetExtraMenuOptions?.apply(this, arguments);
                if (UNSUPPORTED_NODES.has(this.type)) return;

                if (app.ui.settings.getSettingValue("KayTool.ShowSetGetOptions")) {
                    options.unshift(
                        { content: "𝙆 🛜 Set", callback: () => { addNode("KaySetNode", this, { side: "right", offset: 20 }); } },
                        { content: "𝙆 🛜 Get", callback: () => { addNode("KayGetNode", this, { side: "left", offset: 20 }); } }
                    );
                }
            };
        }
    }
});
