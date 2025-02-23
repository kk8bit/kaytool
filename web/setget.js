import { app } from "../../../scripts/app.js";

//基于diffus 3的SetGet：https://github.com/diffus3/ComfyUI-extensions

console.log("[KayTool] Loading SetGet extension");

const LGraphNode = LiteGraph.LGraphNode;

function showAlert(message) {
    app.extensionManager.toast.add({
        severity: 'warn',
        summary: "KayTool Set/Get",
        detail: `${message}. Most likely you're missing custom nodes`,
        life: 5000,
    });
}

app.registerExtension({
    name: "KayTool.SetGet",
    registerCustomNodes() {
        console.log("[KayTool] Registering KaySetNode and KayGetNode");

        class KaySetNode extends LGraphNode {
            defaultVisibility = true;
            serialize_widgets = true;
            drawConnection = false;
            currentGetters = null;
            slotColor = "#FFF";
            canvas = app.canvas;
            menuEntry = "Show connections";

            constructor(title) {
                super(title);

                // 直接设置节点样式
                this.shape = "box";  // 设置节点形状
                this.color = "#222"; // 设置节点颜色
                this.bgcolor = "#000"; // 设置节点背景颜色

                if (!this.properties) {
                    this.properties = { "previousName": "" };
                }
                this.properties.showOutputText = KaySetNode.defaultVisibility;

                const node = this;

                this.addWidget(
                    "text",
                    "ID",
                    '',
                    (s) => {
                        node.validateName(node.graph);
                        if (this.widgets[0].value !== '') {
                            this.title = "🛜Set_" + this.widgets[0].value;
                        }
                        this.update();
                        this.properties.previousName = this.widgets[0].value;
                    },
                    {}
                );

                this.addInput("*", "*");
                this.addOutput("*", '*');

                this.onConnectionsChange = function (slotType, slot, isChangeConnect, link_info) {
                    if (slotType === 1 && !isChangeConnect) { // Disconnect
                        if (this.inputs[slot].name === '') {
                            this.inputs[slot].type = '*';
                            this.inputs[slot].name = '*';
                            this.title = "🛜Set";
                            this.widgets[0].value = '';
                        }
                    }
                    if (slotType === 2 && !isChangeConnect) {
                        this.outputs[slot].type = '*';
                        this.outputs[slot].name = '*';
                    }
                    if (link_info && node.graph && slotType === 1 && isChangeConnect) { // Connect
                        const fromNode = node.graph._nodes.find((n) => n.id === link_info.origin_id);
                        if (fromNode && fromNode.outputs && fromNode.outputs[link_info.origin_slot]) {
                            const type = fromNode.outputs[link_info.origin_slot].type;
                            // 仅更新输入类型，不设置 ID 的值
                            this.inputs[0].type = type;
                            this.inputs[0].name = type;
                        } else {
                            showAlert("Node input undefined.");
                        }
                    }
                    if (link_info && node.graph && slotType === 2 && isChangeConnect) {
                        const fromNode = node.graph._nodes.find((n) => n.id === link_info.origin_id);
                        if (fromNode && fromNode.inputs && fromNode.inputs[link_info.origin_slot]) {
                            const type = fromNode.inputs[link_info.origin_slot].type;
                            this.outputs[0].type = type;
                            this.outputs[0].name = type;
                        } else {
                            showAlert("Node output undefined.");
                        }
                    }
                    this.update();
                };

                this.validateName = function (graph) {
                    let widgetValue = this.widgets[0].value;
                    if (widgetValue !== '') {
                        let tries = 1;
                        const existingValues = new Set();
                        graph._nodes.forEach(otherNode => {
                            if (otherNode !== this && otherNode.type === 'KaySetNode') {
                                existingValues.add(otherNode.widgets[0].value);
                            }
                        });
                        let baseValue = widgetValue;
                        while (existingValues.has(widgetValue)) {
                            widgetValue = `${baseValue}_${tries}`;
                            tries++;
                        }
                        this.widgets[0].value = widgetValue;
                        this.title = "🛜Set_" + widgetValue;
                        this.update();
                    }
                };

                this.clone = function () {
                    const cloned = KaySetNode.prototype.clone.apply(this);
                    cloned.inputs[0].name = '*';
                    cloned.inputs[0].type = '*';
                    cloned.value = '';
                    cloned.properties.previousName = '';
                    cloned.size = cloned.computeSize();
                    return cloned;
                };

                this.onAdded = function (graph) {
                    this.validateName(graph);
                };

                this.update = function () {
                    if (!this.graph) return;
                    const getters = this.findGetters(this.graph);
                    getters.forEach(getter => getter.setType(this.inputs[0].type));
                    if (this.widgets[0].value) {
                        const gettersWithPreviousName = this.findGetters(this.graph, true);
                        gettersWithPreviousName.forEach(getter => getter.setName(this.widgets[0].value));
                    }
                    const allGetters = this.graph._nodes.filter(n => n.type === "KayGetNode");
                    allGetters.forEach(n => { if (n.setComboValues) n.setComboValues(); });
                };

                this.findGetters = function (graph, checkForPreviousName) {
                    const name = checkForPreviousName ? this.properties.previousName : this.widgets[0].value;
                    return graph._nodes.filter(n => n.type === 'KayGetNode' && n.widgets[0].value === name && name !== '');
                };

                this.isVirtualNode = true;
            }

            onRemoved() {
                const allGetters = this.graph._nodes.filter(n => n.type === "KayGetNode");
                allGetters.forEach(n => { if (n.setComboValues) n.setComboValues([this]); });
            }

            getExtraMenuOptions(_, options) {
                this.menuEntry = this.drawConnection ? "Hide connections" : "Show connections";
                options.unshift(
                    {
                        content: this.menuEntry,
                        callback: () => {
                            this.currentGetters = this.findGetters(this.graph);
                            if (this.currentGetters.length === 0) return;
                            let linkType = this.currentGetters[0].outputs[0].type;
                            this.slotColor = this.canvas.default_connection_color_byType[linkType];
                            this.drawConnection = !this.drawConnection;
                            this.canvas.setDirty(true, true);
                        },
                        has_submenu: true,
                        submenu: {
                            title: "Color",
                            options: [{
                                content: "Highlight",
                                callback: () => {
                                    this.slotColor = "orange";
                                    this.canvas.setDirty(true, true);
                                }
                            }],
                        },
                    },
                    {
                        content: "Hide all connections",
                        callback: () => {
                            const allNodes = this.graph._nodes.filter(n => n.type === "KayGetNode" || n.type === "KaySetNode");
                            allNodes.forEach(n => n.drawConnection = false);
                            this.drawConnection = false;
                            this.canvas.setDirty(true, true);
                        },
                    }
                );
                this.currentGetters = this.findGetters(this.graph);
                if (this.currentGetters.length) {
                    let gettersSubmenu = this.currentGetters.map(getter => ({
                        content: `${getter.title} id: ${getter.id}`,
                        callback: () => {
                            this.canvas.centerOnNode(getter);
                            this.canvas.selectNode(getter, false);
                            this.canvas.setDirty(true, true);
                        },
                    }));
                    options.unshift({
                        content: "Getters",
                        has_submenu: true,
                        submenu: { title: "GetNodes", options: gettersSubmenu }
                    });
                }
            }

            onDrawForeground(ctx) {
                if (this.drawConnection) this._drawVirtualLinks(app.canvas, ctx);
            }

            _drawVirtualLinks(lGraphCanvas, ctx) {
                if (!this.currentGetters?.length) return;
                const title = this.getTitle ? this.getTitle() : this.title;
                const title_width = ctx.measureText(title).width;
                const start_node_slotpos = !this.flags.collapsed
                    ? [this.size[0], LiteGraph.NODE_TITLE_HEIGHT * 0.5]
                    : [title_width + 55, -15];
                const defaultLink = { type: 'default', color: this.slotColor };
                for (const getter of this.currentGetters) {
                    const end_node_slotpos = !this.flags.collapsed
                        ? [getter.pos[0] - this.pos[0] + this.size[0], getter.pos[1] - this.pos[1]]
                        : [getter.pos[0] - this.pos[0] + title_width + 50, getter.pos[1] - this.pos[1] - 30];
                    lGraphCanvas.renderLink(ctx, start_node_slotpos, end_node_slotpos, defaultLink, false, null, this.slotColor, LiteGraph.RIGHT, LiteGraph.LEFT);
                }
            }
        }

        LiteGraph.registerNodeType("KaySetNode", Object.assign(KaySetNode, { 
            title: "🛜Set"
        }));
        KaySetNode.category = "KayTool";

        class KayGetNode extends LGraphNode {
            defaultVisibility = true;
            serialize_widgets = true;
            drawConnection = false;
            slotColor = "#FFF";
            currentSetter = null;
            canvas = app.canvas;

            constructor(title) {
                super(title);

                // 直接设置节点样式
                this.shape = "box";  // 设置节点形状
                this.color = "#222"; // 设置节点颜色
                this.bgcolor = "#000"; // 设置节点背景颜色

                if (!this.properties) this.properties = {};
                this.properties.showOutputText = KayGetNode.defaultVisibility;
                const node = this;
                this.addWidget(
                    "combo",
                    "ID",
                    "",
                    () => this.onRename(),
                    {
                        values: () => {
                            const setterNodes = node.graph._nodes.filter(n => n.type === 'KaySetNode');
                            return setterNodes.map(n => n.widgets[0].value).sort();
                        }
                    }
                );

                this.addOutput("*", '*');

                this.onConnectionsChange = function () {
                    this.validateLinks();
                };

                this.setName = function (name) {
                    node.widgets[0].value = name;
                    node.onRename();
                    node.serialize();
                };

                this.onRename = function () {
                    const setter = this.findSetter(node.graph);
                    if (setter) {
                        const linkType = setter.inputs[0].type;
                        this.setType(linkType);
                        this.title = "🛜Get_" + setter.widgets[0].value;
                    } else {
                        this.setType('*');
                    }
                };

                this.clone = function () {
                    const cloned = KayGetNode.prototype.clone.apply(this);
                    cloned.size = cloned.computeSize();
                    return cloned;
                };

                this.validateLinks = function () {
                    if (this.outputs[0].type !== '*' && this.outputs[0].links) {
                        this.outputs[0].links.filter(linkId => {
                            const link = node.graph.links[linkId];
                            return link && (link.type !== this.outputs[0].type && link.type !== '*');
                        }).forEach(linkId => node.graph.removeLink(linkId));
                    }
                };

                this.setType = function (type) {
                    this.outputs[0].name = type;
                    this.outputs[0].type = type;
                    this.validateLinks();
                };

                this.findSetter = function (graph) {
                    const name = this.widgets[0].value;
                    return graph._nodes.find(n => n.type === 'KaySetNode' && n.widgets[0].value === name && name !== '');
                };

                this.goToSetter = function () {
                    const setter = this.findSetter(this.graph);
                    this.canvas.centerOnNode(setter);
                    this.canvas.selectNode(setter, false);
                };

                this.isVirtualNode = true;
            }

            getInputLink(slot) {
                const setter = this.findSetter(this.graph);
                if (setter) {
                    const slotInfo = setter.inputs[slot];
                    return this.graph.links[slotInfo.link];
                } else {
                    const errorMessage = `No KaySetNode found for ${this.widgets[0].value} (${this.type})`;
                    showAlert(errorMessage);
                }
            }

            getExtraMenuOptions(_, options) {
                const menuEntry = this.drawConnection ? "Hide connections" : "Show connections";
                options.unshift(
                    {
                        content: "Go to setter",
                        callback: () => this.goToSetter(),
                    },
                    {
                        content: menuEntry,
                        callback: () => {
                            this.currentSetter = this.findSetter(this.graph);
                            if (!this.currentSetter) return;
                            const linkType = this.currentSetter.inputs[0].type;
                            this.drawConnection = !this.drawConnection;
                            this.slotColor = this.canvas.default_connection_color_byType[linkType];
                            this.canvas.setDirty(true, true);
                        },
                    }
                );
            }

            onDrawForeground(ctx) {
                if (this.drawConnection) this._drawVirtualLink(app.canvas, ctx);
            }

            _drawVirtualLink(lGraphCanvas, ctx) {
                if (!this.currentSetter) return;
                const defaultLink = { type: 'default', color: this.slotColor };
                const start_node_slotpos = [
                    this.currentSetter.pos[0] - this.pos[0],
                    this.currentSetter.pos[1] - this.pos[1]
                ];
                const end_node_slotpos = [0, -LiteGraph.NODE_TITLE_HEIGHT * 0.5];
                lGraphCanvas.renderLink(ctx, start_node_slotpos, end_node_slotpos, defaultLink, false, null, this.slotColor);
            }
        }

        LiteGraph.registerNodeType("KayGetNode", Object.assign(KayGetNode, { 
            title: "🛜Get"
        }));
        KayGetNode.category = "KayTool";
    },
});