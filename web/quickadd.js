import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";

console.log("[KayTool] Loading QuickAdd extension");

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

function getUpstreamNodes(node, graph) {
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

function recursiveAddNodes(nodeId, oldOutput, newOutput) {
    let currentId = nodeId;
    let currentNode = oldOutput[currentId];
    if (!currentNode || newOutput[currentId]) return;
    newOutput[currentId] = currentNode;
    for (const inputValue of Object.values(currentNode.inputs || {})) {
        if (Array.isArray(inputValue)) {
            recursiveAddNodes(inputValue[0], oldOutput, newOutput);
        }
    }
    return newOutput;
}

const KayToolState = {
    queueNodeIds: null,
    lastAdjustedMouseEvent: null
};

function initializeHooks() {
    const originalApiQueuePrompt = api.queuePrompt;
    api.queuePrompt = async function (index, prompt) {
        if (KayToolState.queueNodeIds?.length && prompt.output) {
            const oldOutput = prompt.output;
            let newOutput = {};
            for (const queueNodeId of KayToolState.queueNodeIds) {
                recursiveAddNodes(String(queueNodeId), oldOutput, newOutput);
            }
            prompt.output = newOutput;
            console.log("[KayTool] Filtered prompt:", JSON.stringify(prompt, null, 2));
        }
        const response = originalApiQueuePrompt.apply(this, [index, prompt]);
        return response;
    };

    const originalAdjustMouseEvent = LGraphCanvas.prototype.adjustMouseEvent;
    LGraphCanvas.prototype.adjustMouseEvent = function (e) {
        originalAdjustMouseEvent.apply(this, [...arguments]);
        KayToolState.lastAdjustedMouseEvent = e;
    };
}

async function executeNodes(graph, nodesToRun) {
    KayToolState.queueNodeIds = nodesToRun.map(n => n.id);
    try {
        console.log("[KayTool] Executing nodes:", KayToolState.queueNodeIds);
        const result = await app.queuePrompt(0);
        console.log("[KayTool] Queue result:", result);
        return result;
    } catch (error) {
        throw error;
    } finally {
        KayToolState.queueNodeIds = null;
    }
}

function addGroupMenuHandler() {
    const originalGetCanvasMenuOptions = LGraphCanvas.prototype.getCanvasMenuOptions;
    LGraphCanvas.prototype.getCanvasMenuOptions = function (...args) {
        const existingOptions = originalGetCanvasMenuOptions.apply(this, [...args]);
        const group = KayToolState.lastAdjustedMouseEvent
            ? app.graph.getGroupOnPos(KayToolState.lastAdjustedMouseEvent.canvasX, KayToolState.lastAdjustedMouseEvent.canvasY)
            : null;

        if (group) {
            existingOptions.unshift(
                {
                    content: "𝙆 ▶️ Run Group",
                    callback: async () => {
                        const graph = app.graph;
                        const groupNodes = group._nodes || [];
                        if (!groupNodes.length) {
                            app.extensionManager.toast.add({
                                severity: 'warn',
                                summary: "KayTool Quick Run",
                                detail: "No nodes in group to run",
                                life: 3000,
                            });
                            return;
                        }

                        const allNodesToRun = new Set(groupNodes);
                        groupNodes.forEach(node => {
                            const upstream = getUpstreamNodes(node, graph);
                            upstream.forEach(upNode => allNodesToRun.add(upNode));
                        });
                        const nodesToRun = Array.from(allNodesToRun);

                        let canRun = true;
                        for (const n of nodesToRun) {
                            if (n.inputs) {
                                for (const input of n.inputs) {
                                    if (input.link === null && input.type !== "*" && !input.optional) {
                                        canRun = false;
                                        console.log(`[KayTool] Cannot run group: Node ${n.id} (${n.type}) has unconnected required input: ${input.name}`);
                                        app.extensionManager.toast.add({
                                            severity: 'warn',
                                            summary: "KayTool Quick Run",
                                            detail: `Cannot run group: Node ${n.id} (${n.type}) has unconnected required input: ${input.name}`,
                                            life: 5000,
                                        });
                                        break;
                                    }
                                }
                            }
                            if (!canRun) break;
                        }

                        if (canRun) {
                            try {
                                await executeNodes(graph, nodesToRun);
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
                    }
                },
                null // “▶️ Run Group”组后的分隔线
            );
        }

        return existingOptions;
    };
}

app.registerExtension({
    name: "KayTool.QuickAdd",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.input && nodeData.input.required) {
            addMenuHandler(nodeType, function (_, options) {
                options.unshift(
                    {
                        content: "𝙆 ▶️ Run",
                        callback: async () => {
                            const node = this;
                            const graph = app.graph;
                            const upstreamNodes = getUpstreamNodes(node, graph);
                            const nodesToRun = [node, ...upstreamNodes];

                            let canRun = true;
                            for (const n of nodesToRun) {
                                if (n.inputs) {
                                    for (const input of n.inputs) {
                                        if (input.link === null && input.type !== "*" && !input.optional) {
                                            canRun = false;
                                            console.log(`[KayTool] Cannot run: Node ${n.id} (${n.type}) has unconnected required input: ${input.name}`);
                                            app.extensionManager.toast.add({
                                                severity: 'warn',
                                                summary: "KayTool Quick Run",
                                                detail: `Cannot run: Node ${n.id} (${n.type}) has unconnected required input: ${input.name}`,
                                                life: 5000,
                                            });
                                            break;
                                        }
                                    }
                                }
                                if (!canRun) break;
                            }

                            if (canRun) {
                                try {
                                    await executeNodes(graph, nodesToRun);
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
                        }
                    },
                    null, // “▶️ Run”组后的分隔线
                    {
                        content: "𝙆 🛜 Set",
                        callback: () => { addNode("KaySetNode", this, { side: "right", offset: 20 }); }
                    },
                    {
                        content: "𝙆 🛜 Get",
                        callback: () => { addNode("KayGetNode", this, { side: "left", offset: 20 }); }
                    },
                    null // “+ 🛜 Set”和“+ 🛜 Get”组后的分隔线
                );
            });
        }
    },
    async setup() {
        initializeHooks();
        addGroupMenuHandler();
        console.log("[KayTool] QuickAdd extension setup complete");
    }
});