import { app } from "../../../scripts/app.js";

// Based on diffus3's SetGet: https://github.com/diffus3/ComfyUI-extensions
// Inspired by: https://github.com/kijai/ComfyUI-KJNodes

console.log("[KayTool] Loading 𝙆 🛜Set and 𝙆 🛜Get extension");

const LGraphNode = LiteGraph.LGraphNode;

function showAlert(message) {
    app.extensionManager.toast.add({
        severity: 'warn',
        summary: "KayTool 𝙆 🛜Set/Get",
        detail: `${message} Most likely you're missing custom nodes`,
        life: 5000,
    });
}

app.registerExtension({
    name: "KayTool.SetGet",
    registerCustomNodes() {
        console.log("[KayTool] Registering 𝙆 🛜Set and 𝙆 🛜Get");

        class KaysetNode extends LGraphNode {
            defaultVisibility = true;
            serialize_widgets = true;
            canvas = app.canvas;

            constructor(title) {
                super(title);

                this.color = "#000";
                this.bgcolor = "#000";

                if (!this.properties) {
                    this.properties = { "previousName": "" };
                }
                this.properties.showOutputText = KaysetNode.defaultVisibility;

                const node = this;

                this.addWidget(
                    "text",
                    "ID",
                    '',
                    (s) => {
                        node.validateName(node.graph);
                        if (this.widgets[0].value !== '') {
                            this.title = "𝙆 🛜Set_" + this.widgets[0].value;
                        }
                        this.update();
                        this.properties.previousName = this.widgets[0].value;
                    },
                    {}
                );

                this.addInput("*", "*");

                this.onConnectionsChange = function (slotType, slot, isChangeConnect, link_info) {
                    if (slotType === 1 && !isChangeConnect) {
                        if (this.inputs[slot].name === '') {
                            this.inputs[slot].type = '*';
                            this.inputs[slot].name = '*';
                            this.title = "𝙆 🛜Set";
                            this.widgets[0].value = '';
                        }
                    }
                    if (link_info && node.graph && slotType === 1 && isChangeConnect) {
                        const fromNode = node.graph._nodes.find((n) => n.id === link_info.origin_id);
                        if (fromNode && fromNode.outputs && fromNode.outputs[link_info.origin_slot]) {
                            const type = fromNode.outputs[link_info.origin_slot].type;
                            this.inputs[0].type = type;
                            this.inputs[0].name = type;
                        } else {
                            showAlert("Node input undefined.");
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
                            if (otherNode !== this && otherNode.type === 'KaysetNode') {
                                existingValues.add(otherNode.widgets[0].value);
                            }
                        });
                        let baseValue = widgetValue;
                        while (existingValues.has(widgetValue)) {
                            widgetValue = `${baseValue}_${tries}`;
                            tries++;
                        }
                        this.widgets[0].value = widgetValue;
                        this.title = "𝙆 🛜Set_" + widgetValue;
                        this.update();
                    }
                };

                this.clone = function () {
                    const cloned = KaysetNode.prototype.clone.apply(this);
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
                const getters = this.findGetters(this.graph);
                if (getters.length === 1) {
                    options.unshift({
                        content: "Go to 𝙆 🛜Get",
                        callback: () => {
                            const getter = getters[0];
                            this.canvas.centerOnNode(getter);
                            this.canvas.selectNode(getter, false);
                            this.canvas.setDirty(true, true);
                        },
                    });
                } else if (getters.length > 1) {
                    let getNodesSubmenu = getters.map(getter => ({
                        content: `${getter.title} id: ${getter.id}`,
                        callback: () => {
                            this.canvas.centerOnNode(getter);
                            this.canvas.selectNode(getter, false);
                            this.canvas.setDirty(true, true);
                        },
                    }));
                    options.unshift({
                        content: "𝙆 🛜Get Nodes",
                        has_submenu: true,
                        submenu: { title: "𝙆 🛜Get Nodes", options: getNodesSubmenu }
                    });
                }
            }
        }

        LiteGraph.registerNodeType("KaysetNode", Object.assign(KaysetNode, {
            title: "𝙆 🛜Set"
        }));
        KaysetNode.category = "KayTool";

        class KayGetNode extends LGraphNode {
            defaultVisibility = true;
            serialize_widgets = true;
            canvas = app.canvas;

            constructor(title) {
                super(title);

                this.color = "#000";
                this.bgcolor = "#000";

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
                            const setterNodes = node.graph._nodes.filter(n => n.type === 'KaysetNode');
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
                        this.title = "𝙆 🛜Get_" + setter.widgets[0].value;
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
                    return graph._nodes.find(n => n.type === 'KaysetNode' && n.widgets[0].value === name && name !== '');
                };

                this.goToSetter = function () {
                    const setter = this.findSetter(this.graph);
                    if (setter) {
                        this.canvas.centerOnNode(setter);
                        this.canvas.selectNode(setter, false);
                    } else {
                        showAlert(`No 𝙆 🛜Set found for ID: ${this.widgets[0].value}`);
                    }
                };

                this.isVirtualNode = true;
            }

            getInputLink(slot) {
                const setter = this.findSetter(this.graph);
                if (setter) {
                    const slotInfo = setter.inputs[slot];
                    return this.graph.links[slotInfo.link];
                } else {
                    const errorMessage = `No 𝙆 🛜Set found for ${this.widgets[0].value} (${this.type})`;
                    showAlert(errorMessage);
                }
            }

            getExtraMenuOptions(_, options) {
                options.unshift({
                    content: "Go to 𝙆 🛜Set",
                    callback: () => this.goToSetter(),
                });
            }
        }

        LiteGraph.registerNodeType("KayGetNode", Object.assign(KayGetNode, {
            title: "𝙆 🛜Get"
        }));
        KayGetNode.category = "KayTool";
    },
});