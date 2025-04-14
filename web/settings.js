import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "KayTool.Settings",
    async setup() {
        function updateSetGetNodeColors() {
            const fgColor = "#" + app.ui.settings.getSettingValue("KayTool.SetGetForegroundColor");
            const bgColor = "#" + app.ui.settings.getSettingValue("KayTool.SetGetBackgroundColor");
            const allNodes = app.graph._nodes;
            allNodes.forEach(node => {
                if (node.type === "KaySetNode" || node.type === "KayGetNode") {
                    node.color = fgColor;
                    node.bgcolor = bgColor;
                }
            });
            app.graph.setDirtyCanvas(true);
        }

        const settings = [
            {
                id: "KayTool.ShowRunOption",
                name: "Show '▶️ Run' option in node context menu",
                type: "boolean",
                defaultValue: true,
                category: ["KayTool", "▶️ Run", "ShowRunOption"],
            },
            {
                id: "KayTool.ShowSetGetOptions",
                name: "Show 'Set/Get' options in node context menu",
                type: "boolean",
                defaultValue: true,
                category: ["KayTool", "🛜 Set/Get", "ShowSetGetOptions"],
            },
            {
                id: "KayTool.ShiftR",
                name: "Use 'Shift+R' to quickly run selected node",
                type: "boolean",
                defaultValue: true,
                category: ["KayTool", "▶️ Run", "ShiftR"],
            },
            {
                id: "KayTool.ShowWorkflowPNG",
                name: "Show 'Workflow PNG' option in KayTool menu",
                type: "boolean",
                defaultValue: true,
                category: ["KayTool", "Workflow PNG", "ShowWorkflowPNG"],
            },
            {
                id: "KayTool.ShowStarToMe",
                name: "Show 'Star to me' option in KayTool menu",
                type: "boolean",
                defaultValue: true,
                category: ["KayTool", "Menu", "ShowStarToMe"],
            },
            {
                id: "KayTool.ShowCleanVRAM",
                name: "Show '🧹 Clean VRAM' option in KayTool menu",
                type: "boolean",
                defaultValue: true,
                category: ["KayTool", "Menu", "ShowCleanVRAM"],
            },
            {
                id: "KayTool.WorkflowPNG",
                name: "Margin size for Workflow PNG export",
                type: "slider",
                defaultValue: 100,
                attrs: { min: 0, max: 200, step: 10 },
                category: ["KayTool", "Workflow PNG", "MarginSize"],
            },
            {
                id: "KayTool.SetGetForegroundColor",
                name: "Set/Get Node Foreground Color",
                type: "color",
                defaultValue: "000000",
                category: ["KayTool", "🛜 Set/Get", "SetGetForegroundColor"],
                onChange: (newVal) => {
                    updateSetGetNodeColors();
                }
            },
            {
                id: "KayTool.SetGetBackgroundColor",
                name: "Set/Get Node Background Color",
                type: "color",
                defaultValue: "000000",
                category: ["KayTool", "🛜 Set/Get", "SetGetBackgroundColor"],
                onChange: (newVal) => {
                    updateSetGetNodeColors();
                }
            },
            {
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
                onChange: (value) => {
                    if (window.KayNodeAlignmentManager) {
                        window.KayNodeAlignmentManager.updateDisplayMode(value);
                    }
                }
            },
            {
                id: "KayTool.EnableAlignmentShortcuts",
                name: "Enable Shift+WASD for Quick Alignment (Up/Left/Down/Right)",
                type: "boolean",
                defaultValue: true,
                category: ["KayTool", "NodeAlignment", "Shortcuts"],
                tooltip: "Use Shift+W (Up), Shift+A (Left), Shift+S (Down), Shift+D (Right) to align selected nodes."
            },
            {
                id: "KayTool.NodeAlignBackgroundOpacity",
                name: "Node Alignment Toolbar Background Opacity",
                type: "slider",
                defaultValue: 0,
                attrs: { min: 0, max: 100, step: 1 },
                category: ["KayTool", "NodeAlignment", "BackgroundOpacity"],
                onChange: (newVal) => {
                    const toolbar = document.getElementById('kay-node-alignment-toolbar');
                    if (toolbar) {
                        const bgColor = app.ui.settings.getSettingValue("KayTool.NodeAlignBackgroundColor") || "000000";
                        const opacity = newVal / 100;
                        toolbar.style.background = `rgba(${parseInt(bgColor.substr(0, 2), 16)}, ${parseInt(bgColor.substr(2, 2), 16)}, ${parseInt(bgColor.substr(4, 2), 16)}, ${opacity})`;
                    }
                }
            },
            {
                id: "KayTool.NodeAlignBackgroundColor",
                name: "Node Alignment Toolbar Background Color",
                type: "color",
                defaultValue: "000000",
                category: ["KayTool", "NodeAlignment", "BackgroundColor"],
                onChange: (newVal) => {
                    const toolbar = document.getElementById('kay-node-alignment-toolbar');
                    if (toolbar && newVal) {
                        const opacity = app.ui.settings.getSettingValue("KayTool.NodeAlignBackgroundOpacity") / 100;
                        toolbar.style.background = `rgba(${parseInt(newVal.substr(0, 2), 16)}, ${parseInt(newVal.substr(2, 2), 16)}, ${parseInt(newVal.substr(4, 2), 16)}, ${opacity})`;
                    }
                }
            },
            {
                id: "KayTool.NodeAlignIconBackgroundColor",
                name: "Node Alignment Icon Background Color",
                type: "color",
                defaultValue: "363636",
                category: ["KayTool", "NodeAlignment", "IconBackgroundColor"],
                tooltip: "Use parameter “363636” to match ComfyUI menu bar color for an icon-free background effect",
                onChange: (newVal) => {
                    const buttons = document.querySelectorAll('.kay-align-button');
                    buttons.forEach(btn => btn.style.backgroundColor = `#${newVal}`);
                }
            },
            {
                id: "KayTool.NodeAlignIconColor",
                name: "Node Alignment Icon Color",
                type: "color",
                defaultValue: "999999",
                category: ["KayTool", "NodeAlignment", "IconColor"],
                onChange: (newVal) => {
                    const buttons = document.querySelectorAll('.kay-align-button');
                    buttons.forEach(btn => {
                        const svg = btn.querySelector('svg');
                        if (svg) svg.querySelectorAll('path').forEach(path => path.setAttribute('fill', `#${newVal}`));
                    });
                }
            },
            {
                id: "KayTool.NodeAlignDividerColor",
                name: "Node Alignment Divider Color",
                type: "color",
                defaultValue: "f0ff00",
                category: ["KayTool", "NodeAlignment", "DividerColor"],
                onChange: (newVal) => {
                    const dividers = document.querySelectorAll('.kay-toolbar-divider');
                    dividers.forEach(divider => divider.style.background = `#${newVal}`);
                }
            },
            {
                id: "KayTool.EnableResourceMonitor",
                name: "Enable Resource Monitor button in menu",
                type: "boolean",
                defaultValue: true,
                category: ["KayTool", "Resource Monitor", "EnableResourceMonitor"],
                onChange: (newVal) => {
                    if (window.KayResourceMonitor) {
                        window.KayResourceMonitor.updateEnabledState(newVal);
                    }
                }
            },
            {
                id: "KayTool.ResourceMonitorEdgeFade",
                name: "Enable Resource Monitor Chart Edge Fade",
                type: "boolean",
                defaultValue: true,
                category: ["KayTool", "Resource Monitor", "EdgeFade"],
                onChange: (newVal) => {
                    if (window.KayResourceMonitor) {
                        window.KayResourceMonitor.edgeFadeEnabled = newVal;
                        window.KayResourceMonitor.drawCurves();
                    }
                }
            },
            {
                id: "KayTool.ResourceMonitorBackgroundOpacity",
                name: "Resource Monitor Background Opacity",
                type: "slider",
                defaultValue: 50,
                attrs: { min: 0, max: 100, step: 1 },
                category: ["KayTool", "Resource Monitor", "BackgroundOpacity"],
                onChange: (newVal) => {
                    const opacity = newVal / 100;
                    if (window.KayResourceMonitor && window.KayResourceMonitor.toolbar) {
                        window.KayResourceMonitor.toolbar.style.background = `rgba(0, 0, 0, ${opacity})`;
                    }
                }
            },
            {
                id: "KayTool.GuLuLuSize",
                name: "GuLuLu Size (px)",
                type: "slider",
                defaultValue: 39,
                attrs: { min: 36, max: 120, step: 1 },
                category: ["KayTool", "GuLuLu", "Size"],
                onChange: (newVal) => {
                    if (window.KayGuLuLuManager) {
                        window.KayGuLuLuManager.updateSize(newVal);
                    }
                }
            },
            {
                id: "KayTool.EnableGuLuLu",
                name: "GuLuLu stay with you!",
                tooltip: "GuLuLu will inherit KayTool's notification items for streaming output, support adjustments to the notification box position, and include powerful right-click menu options.",
                type: "boolean",
                defaultValue: true,
                category: ["KayTool", "GuLuLu", "EnableGuLuLu"],
                onChange: (newVal) => {
                    if (window.KayGuLuLuManager) {
                        window.KayGuLuLuManager.updateEnabledState(newVal);
                    }
                }
            }
        ];

        try {
            for (const setting of settings) {
                app.ui.settings.addSetting(setting);
            }
            updateSetGetNodeColors();
        } catch (error) {
            console.error("Error in KayTool.Settings setup:", error);
            throw error;
        }
    }
});