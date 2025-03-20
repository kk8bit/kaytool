import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";

console.log("[KayTool] Loading QuickAdd extension");

const UNSUPPORTED_NODES = new Set([
  "Group",
  "Reroute",
  "Note"
]);

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

function kayGetUpstreamNodes(node, graph) {
    const upstreamNodes = new Set();
    function traverse(node) {
        if (!node.inputs) return;
        for (const input of node.inputs) {
            if (input.link) {
                const link = graph.links[input.link];
                if (link) {
                    const originNode = graph._nodes_by_id[link.origin_id];
                    if (originNode && !upstreamNodes.has(originNode)) {
                        upstreamNodes.add(originNode);
                        traverse(originNode);
                    }
                }
            }
        }
    }
    traverse(node);
    return Array.from(upstreamNodes);
}

function kayGetOutputNodes(nodes) {
    return ((nodes === null || nodes === void 0 ? void 0 : nodes.filter((n) => {
        var _a;
        return (n.mode != LiteGraph.NEVER &&
            ((_a = n.constructor.nodeData) === null || _a === void 0 ? void 0 : _a.output_node));
    })) || []);
}

function kayRecursiveAddNodes(nodeId, oldOutput, newOutput) {
    let currentId = nodeId;
    let currentNode = oldOutput[currentId];
    if (!currentNode || newOutput[currentId]) return;
    newOutput[currentId] = currentNode;
    for (const inputValue of Object.values(currentNode.inputs || {})) {
        if (Array.isArray(inputValue)) {
            kayRecursiveAddNodes(inputValue[0], oldOutput, newOutput);
        }
    }
    return newOutput;
}

const KayToolState = {
    queueNodeIds: null,
    mousePos: null,
    activeGroup: null
};

function initializeHooks() {
    const originalApiQueuePrompt = api.queuePrompt;
    api.queuePrompt = async function (index, prompt) {
        if (KayToolState.queueNodeIds?.length && prompt.output) {
            const oldOutput = prompt.output;
            let newOutput = {};
            for (const queueNodeId of KayToolState.queueNodeIds) {
                kayRecursiveAddNodes(String(queueNodeId), oldOutput, newOutput);
            }
            prompt.output = newOutput;
        }
        return originalApiQueuePrompt.apply(this, [index, prompt]);
    };

    const originalDraw = LGraphCanvas.prototype.draw;
    LGraphCanvas.prototype.draw = function() {
        if (this.canvas_mouse) {
            KayToolState.mousePos = [this.canvas_mouse[0], this.canvas_mouse[1]];
            KayToolState.activeGroup = app.graph.getGroupOnPos(...KayToolState.mousePos);
        }
        return originalDraw.apply(this, arguments);
    };
}

async function kayExecuteNodes(graph, nodesToRun) {
    KayToolState.queueNodeIds = nodesToRun.map(n => n.id);
    try {
        return await app.queuePrompt(0);
    } finally {
        KayToolState.queueNodeIds = null;
    }
}

function addGroupMenuHandler() {
    const originalGetCanvasMenuOptions = LGraphCanvas.prototype.getCanvasMenuOptions;

    LGraphCanvas.prototype.getCanvasMenuOptions = function() {
        const original = originalGetCanvasMenuOptions ?
            originalGetCanvasMenuOptions.apply(this, arguments) || [] : [];

        if (KayToolState.activeGroup && KayToolState.mousePos) {
            try {
                const groupNodes = KayToolState.activeGroup._nodes || [];
                if (groupNodes.length === 0) {
                    return original;
                }

                const allNodesToRun = new Set(groupNodes);
                groupNodes.forEach(node => {
                    const upstream = kayGetUpstreamNodes(node, app.graph);
                    upstream.forEach(upNode => allNodesToRun.add(upNode));
                });
                const nodesToRun = Array.from(allNodesToRun);
                const outputNodes = kayGetOutputNodes(nodesToRun);

                const showRunOption = app.ui.settings.getSettingValue("Kaytool.ShowRunOption", true);
                const customMenu = [];

                if (showRunOption) {
                    customMenu.push({
                        content: "𝙆 ▶️ Run Group",
                        disabled: !outputNodes.length,
                        callback: async () => {
                            const graph = app.graph;
                            const groupNodes = KayToolState.activeGroup._nodes || [];
                            if (!groupNodes.length) return;

                            const allNodesToRun = new Set(groupNodes);
                            groupNodes.forEach(node => {
                                const upstream = kayGetUpstreamNodes(node, graph);
                                upstream.forEach(upNode => allNodesToRun.add(upNode));
                            });
                            const nodesToRun = Array.from(allNodesToRun);

                            try {
                                await kayExecuteNodes(graph, nodesToRun);
                                app.graph.setDirtyCanvas(true, true);
                            } catch (error) {
                                console.error("[KayTool] Group execution failed:", error);
                                app.extensionManager.toast.add({
                                    severity: 'error',
                                    summary: "KayTool Quick Run",
                                    detail: `Failed to execute group: ${error.message}`,
                                    life: 5000,
                                });
                            }
                        }
                    });
                }

                return [...customMenu, ...original.filter(item => item !== null)];
            } catch(e) {
                console.error("[KayTool] Group menu error:", e);
            }
        }

        return original;
    };
}

app.registerExtension({
    name: "KayTool.QuickAdd",
    beforeRegisterNodeDef(nodeType, nodeData) {
        if (nodeData.input?.required && !UNSUPPORTED_NODES.has(nodeData.name)) {
            addMenuHandler(nodeType, function (_, options) {
                if (UNSUPPORTED_NODES.has(this.type)) return;

                const upstreamNodes = kayGetUpstreamNodes(this, app.graph);
                const nodesToRun = [this, ...upstreamNodes];
                const outputNodes = kayGetOutputNodes(nodesToRun);

                const safeOptions = Array.isArray(options) ? options : [];
                const showRunOption = app.ui.settings.getSettingValue("Kaytool.ShowRunOption", true);
                const showSetGetOptions = app.ui.settings.getSettingValue("Kaytool.ShowSetGetOptions", true);

                if (showSetGetOptions) {
                    safeOptions.unshift(
                        {
                            content: "𝙆 🛜 Get",
                            callback: () => { addNode("KayGetNode", this, { side: "left", offset: 20 }); }
                        },
                        {
                            content: "𝙆 🛜 Set",
                            callback: () => { addNode("KaySetNode", this, { side: "right", offset: 20 }); }
                        }
                    );
                }

                if (showRunOption) {
                    safeOptions.unshift({
                        content: "𝙆 ▶️ Run",
                        disabled: !outputNodes.length,
                        callback: async () => {
                            const node = this;
                            const graph = app.graph;
                            const upstreamNodes = kayGetUpstreamNodes(node, graph);
                            const nodesToRun = [node, ...upstreamNodes];

                            try {
                                await kayExecuteNodes(graph, nodesToRun);
                                app.graph.setDirtyCanvas(true, true);
                            } catch (error) {
                                console.error("[KayTool] Execution failed:", error);
                                app.extensionManager.toast.add({
                                    severity: 'error',
                                    summary: "KayTool Quick Run",
                                    detail: `Failed to execute node ${node.id}: ${error.message}`,
                                    life: 5000,
                                });
                            }
                        }
                    });
                }

                options.splice(0, options.length, ...safeOptions.filter(Boolean));
            });
        }
    },
    setup() {
        initializeHooks();
        addGroupMenuHandler();
        console.log("[KayTool] QuickAdd extension setup complete");
    }
});