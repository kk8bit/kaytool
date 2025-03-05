import { app } from "../../../scripts/app.js";

console.log("[KayTool] Loading QuickAdd extension");

// Inspired by：https://github.com/kijai/ComfyUI-KJNodes
function addMenuHandler(nodeType, cb) {
    const getOpts = nodeType.prototype.getExtraMenuOptions;
    nodeType.prototype.getExtraMenuOptions = function () {
        const r = getOpts ? getOpts.apply(this, arguments) : [];
        cb.apply(this, arguments);
        return r;
    };
}

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
    async beforeRegisterNodeDef(nodeType, nodeData, app) {

        if (nodeData.input && nodeData.input.required) {
            addMenuHandler(nodeType, function (_, options) {
                options.unshift(
                    {
                        content: "add 🛜 Out",
                        callback: () => { addNode("KayoutNode", this, { side: "right", offset: 20 }); }
                    },
                    {
                        content: "add 🛜 In",
                        callback: () => { addNode("KayInNode", this, { side: "left", offset: 20 }); }
                    }
                );
            });
        }
    },
    async setup() {
        console.log("[KayTool] QuickAdd extension setup complete");
    }
});