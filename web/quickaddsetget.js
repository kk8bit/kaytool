import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";

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
    return (nodes?.filter((n) => n.mode != LiteGraph.NEVER && n.constructor.nodeData?.output_node) || []);
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

async function kayExecuteNodes(graph, nodesToRun) {
    KayToolState.queueNodeIds = nodesToRun.map(n => n.id);
    try {
        return await app.queuePrompt(0);
    } finally {
        KayToolState.queueNodeIds = null;
    }
}

app.registerExtension({
    name: "KayTool.QuickAdd",
    setup() {
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

        const originalGetCanvasMenuOptions = LGraphCanvas.prototype.getCanvasMenuOptions;
        LGraphCanvas.prototype.getCanvasMenuOptions = function() {
            const options = originalGetCanvasMenuOptions.apply(this, arguments);
            const showRunOption = app.ui.settings.getSettingValue("KayTool.ShowRunOption");
            if (KayToolState.activeGroup && KayToolState.mousePos && showRunOption) {
                const groupNodes = KayToolState.activeGroup._nodes || [];
                if (groupNodes.length > 0) {
                    const allNodesToRun = new Set(groupNodes);
                    groupNodes.forEach(node => {
                        const upstream = kayGetUpstreamNodes(node, app.graph);
                        upstream.forEach(upNode => allNodesToRun.add(upNode));
                    });
                    const nodesToRun = Array.from(allNodesToRun);
                    const outputNodes = kayGetOutputNodes(nodesToRun);
                    options.unshift({
                        content: "𝙆 ▶️ Run (Group)",
                        disabled: !outputNodes.length,
                        callback: async () => {
                            await kayExecuteNodes(app.graph, nodesToRun);
                            app.graph.setDirtyCanvas(true, true);
                        }
                    });
                }
            }
            return options;
        };

        document.addEventListener('keydown', async (e) => {
            const shiftR = app.ui.settings.getSettingValue("KayTool.ShiftR");
            if (!shiftR) return;
            if (e.altKey && (e.key === 'r' || e.key === '®')) {
                e.preventDefault();
                e.stopPropagation();
                const selectedNodes = app.canvas.selected_nodes ? Object.values(app.canvas.selected_nodes) : [];
                if (selectedNodes.length === 0) return;
                const selectedNode = selectedNodes[0];
                if (UNSUPPORTED_NODES.has(selectedNode.type)) return;
                const upstreamNodes = kayGetUpstreamNodes(selectedNode, app.graph);
                const nodesToRun = [selectedNode, ...upstreamNodes];
                const outputNodes = kayGetOutputNodes(nodesToRun);
                if (!outputNodes.length) return;
                await kayExecuteNodes(app.graph, nodesToRun);
                app.graph.setDirtyCanvas(true, true);
            }
        });
    },
    beforeRegisterNodeDef(nodeType, nodeData) {
        if (nodeData.input?.required && !UNSUPPORTED_NODES.has(nodeData.name)) {
            const originalGetExtraMenuOptions = nodeType.prototype.getExtraMenuOptions;
            nodeType.prototype.getExtraMenuOptions = function(_, options) {
                originalGetExtraMenuOptions?.apply(this, arguments);
                if (UNSUPPORTED_NODES.has(this.type)) return;

                const upstreamNodes = kayGetUpstreamNodes(this, app.graph);
                const nodesToRun = [this, ...upstreamNodes];
                const outputNodes = kayGetOutputNodes(nodesToRun);

                const showRunOption = app.ui.settings.getSettingValue("KayTool.ShowRunOption");
                const showSetGetOptions = app.ui.settings.getSettingValue("KayTool.ShowSetGetOptions");

                if (showRunOption) {
                    options.unshift({
                        content: "𝙆 ▶️ Run",
                        disabled: !outputNodes.length,
                        callback: async () => {
                            await kayExecuteNodes(app.graph, nodesToRun);
                            app.graph.setDirtyCanvas(true, true);
                        }
                    });
                }

                if (showSetGetOptions) {
                    options.unshift(
                        { content: "𝙆 🛜 Set", callback: () => { addNode("KaySetNode", this, { side: "right", offset: 20 }); } },
                        { content: "𝙆 🛜 Get", callback: () => { addNode("KayGetNode", this, { side: "left", offset: 20 }); } }
                    );
                }
            };
        }
    }
});