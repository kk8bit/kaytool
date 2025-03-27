import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "KayTool.Settings",
    setup() {
        app.ui.settings.addSetting({
            id: "KayTool.ShowRunOption",
            name: "Show '▶️ Run' option in node context menu",
            type: "boolean",
            defaultValue: true,
            category: ["KayTool", "▶️ Run", "ShowRunOption"],
        });

        app.ui.settings.addSetting({
            id: "KayTool.ShowSetGetOptions",
            name: "Show 'Set/Get' options in node context menu",
            type: "boolean",
            defaultValue: true,
            category: ["KayTool", "🛜 Set/Get", "ShowSetGetOptions"],
            tooltip: "Toggles visibility of 'Set/Get' options in node context menus."
        });

        app.ui.settings.addSetting({
            id: "KayTool.ShiftR",
            name: "Use 'Shift+R' to quickly run selected node",
            type: "boolean",
            defaultValue: true,
            category: ["KayTool", "▶️ Run", "ShiftR"],
        });

        app.ui.settings.addSetting({
            id: "KayTool.ShowWorkflowPNG",
            name: "Show 'Workflow PNG' option in KayTool menu",
            type: "boolean",
            defaultValue: true,
            category: ["KayTool", "Workflow PNG", "ShowWorkflowPNG"],
        });

        app.ui.settings.addSetting({
            id: "KayTool.ShowStarToMe",
            name: "Show 'Star to me' option in KayTool menu",
            type: "boolean",
            defaultValue: true,
            category: ["KayTool", "Menu", "ShowStarToMe"],
        });

        app.ui.settings.addSetting({
            id: "KayTool.WorkflowPNG",
            name: "Margin size for Workflow PNG export",
            type: "slider",
            defaultValue: 100,
            attrs: { min: 0, max: 200, step: 10 },
            category: ["KayTool", "Workflow PNG", "MarginSize"],
            tooltip: "Default value: 100."
        });

        app.ui.settings.addSetting({
            id: "KayTool.SetGetForegroundColor",
            name: "Set/Get Node Foreground Color",
            type: "color",
            defaultValue: "000000",
            category: ["KayTool", "🛜 Set/Get", "ForegroundColor"],
            onChange: (newVal) => {
                if (/^[0-9A-Fa-f]{6}$/.test(newVal)) {
                    updateSetGetNodeColors();
                    if (app.graph) app.graph.setDirtyCanvas(true, true);
                }
            }
        });

        app.ui.settings.addSetting({
            id: "KayTool.SetGetBackgroundColor",
            name: "Set/Get Node Background Color",
            type: "color",
            defaultValue: "000000",
            category: ["KayTool", "🛜 Set/Get", "BackgroundColor"],
            onChange: (newVal) => {
                if (/^[0-9A-Fa-f]{6}$/.test(newVal)) {
                    updateSetGetNodeColors();
                    if (app.graph) app.graph.setDirtyCanvas(true, true);
                }
            }
        });

        app.ui.settings.addSetting({
            id: "KayTool.NodeAlignDisplayMode",
            name: "Node Alignment Toolbar Display Mode",
            type: "combo",
            options: [
                { value: "permanent", text: "Permanent" },
                { value: "on-select", text: "Show on Node Selection" },
                { value: "disabled", text: "Disabled" }
            ],
            defaultValue: "permanent",
            category: ["KayTool", "NodeAlignment", "DisplayMode"],
            tooltip: "Controls when the node alignment toolbar is displayed.",
            onChange: (value) => {
                if (window.KayNodeAlignmentManager) {
                    if (value === "disabled") {
                        if (KayNodeAlignmentManager.isInitialized) {
                            KayNodeAlignmentManager.cleanup();
                        }
                    } else if (!KayNodeAlignmentManager.isInitialized) {
                        const initFn = window.initializeKayNodeAlignment;
                        if (initFn) initFn();
                    } else {
                        KayNodeAlignmentManager.updateDisplayMode(value);
                        const selectedNodes = KayNodeAlignmentManager.getSelectedNodes();
                        if (value === "on-select") {
                            selectedNodes.length >= 2 ? KayNodeAlignmentManager.show() : KayNodeAlignmentManager.hide();
                        } else {
                            KayNodeAlignmentManager.show();
                        }
                    }
                }
            }
        });

        app.ui.settings.addSetting({
            id: "KayTool.NodeAlignBackgroundColor",
            name: "Node Alignment Toolbar Background Color",
            type: "color",
            defaultValue: "000000",
            category: ["KayTool", "NodeAlignment", "BackgroundColor"],
            onChange: (newVal) => {
                const toolbar = document.getElementById('kay-node-alignment-toolbar');
                if (toolbar && /^[0-9A-Fa-f]{6}$/.test(newVal)) {
                    toolbar.style.background = `#${newVal}`;
                }
            }
        });

        app.ui.settings.addSetting({
            id: "KayTool.NodeAlignIconBackgroundColor",
            name: "Node Alignment Icon Background Color",
            type: "color",
            defaultValue: "2b2b2b",
            category: ["KayTool", "NodeAlignment", "IconBackgroundColor"],
            onChange: (newVal) => {
                const buttons = document.querySelectorAll('.kay-align-button');
                if (/^[0-9A-Fa-f]{6}$/.test(newVal)) {
                    buttons.forEach(btn => btn.style.backgroundColor = `#${newVal}`);
                }
            }
        });

        app.ui.settings.addSetting({
            id: "KayTool.NodeAlignIconColor",
            name: "Node Alignment Icon Color",
            type: "color",
            defaultValue: "666666",
            category: ["KayTool", "NodeAlignment", "IconColor"],
            onChange: (newVal) => {
                const buttons = document.querySelectorAll('.kay-align-button');
                if (/^[0-9A-Fa-f]{6}$/.test(newVal)) {
                    buttons.forEach(btn => {
                        const svg = btn.querySelector('svg');
                        if (svg) svg.querySelectorAll('path').forEach(path => path.setAttribute('fill', `#${newVal}`));
                    });
                }
            }
        });

        app.ui.settings.addSetting({
            id: "KayTool.NodeAlignDividerColor",
            name: "Node Alignment Divider Color",
            type: "color",
            defaultValue: "1e1e1e",
            category: ["KayTool", "NodeAlignment", "DividerColor"],
            onChange: (newVal) => {
                const dividers = document.querySelectorAll('.kay-toolbar-divider');
                if (/^[0-9A-Fa-f]{6}$/.test(newVal)) {
                    dividers.forEach(divider => divider.style.background = `#${newVal}`);
                }
            }
        });
    },
    init() {
        if (!app.graph) {
            const checkGraph = setInterval(() => {
                if (app.graph) {
                    clearInterval(checkGraph);
                    updateSetGetNodeColors();
                }
            }, 100);
        } else {
            updateSetGetNodeColors();
        }
    }
});

function updateSetGetNodeColors() {
    const fgColor = "#" + app.ui.settings.getSettingValue("KayTool.SetGetForegroundColor");
    const bgColor = "#" + app.ui.settings.getSettingValue("KayTool.SetGetBackgroundColor");
    if (app.graph && app.graph._nodes) {
        app.graph._nodes.forEach(node => {
            if (node.type === "KaySetNode" || node.type === "KayGetNode" || node.type === "KayGet多元Node") {
                node.color = fgColor;
                node.bgcolor = bgColor;
                if (node.updateColors) node.updateColors();
            }
        });
        app.graph.setDirtyCanvas(true, true);
    }
}