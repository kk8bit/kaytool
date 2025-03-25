import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "KayTool.Settings",
    async setup() {
        app.ui.settings.addSetting({
            id: "KayTool.ShowRunOption",
            name: "Show '▶️ Run' option in node context menu",
            type: "boolean",
            defaultValue: true,
            category: ["KayTool", "▶️ Run", "ShowRunOption"],
            onChange: (value) => {
            }
        });

        app.ui.settings.addSetting({
            id: "KayTool.ShowSetGetOptions",
            name: "Show '🛜 Set/Get' options in node context menu",
            type: "boolean",
            defaultValue: true,
            category: ["KayTool", "🛜 Set/Get", "ShowSetGetOptions"],
            onChange: (value) => {
            }
        });

        app.ui.settings.addSetting({
            id: "KayTool.ShiftR",
            name: "Use 'Shift+R' to quickly '▶️ Run' selected Node",
            type: "boolean",
            defaultValue: true,
            category: ["KayTool", "▶️ Run", "Shift R"],
            onChange: (value) => {
            }
        });

        app.ui.settings.addSetting({
            id: "KayTool.ShowWorkflowPNG",
            name: "Show 'Workflow PNG' option in KayTool menu",
            type: "boolean",
            defaultValue: true,
            category: ["KayTool", "workflow PNG", "ShowWorkflowPNG"],
            onChange: (value) => {
            }
        });

        app.ui.settings.addSetting({
            id: "KayTool.ShowStarToMe",
            name: "Show '⭐️ Star to me' option in KayTool menu",
            type: "boolean",
            defaultValue: true,
            category: ["KayTool", "KayTool Menu", "ShowStarToMe"],
            onChange: (value) => {
            }
        });

        app.ui.settings.addSetting({
            id: "KayTool.WorkflowPNG",
            name: "Margin size for Workflow PNG export",
            type: "slider",
            defaultValue: 100,
            attrs: { min: 0, max: 200, step: 10 },
            category: ["KayTool", "workflow PNG", "WorkflowPNG"],
            onChange: (value) => {
            }
        });

        app.ui.settings.addSetting({
            id: "KayTool.SetGetForegroundColor",
            name: "Set/Get Node Foreground Color",
            type: "color",
            defaultValue: "000000",
            category: ["KayTool", "🛜 Set/Get", "SetGetForegroundColor"],
            onChange: (newVal) => {
                updateSetGetNodeColors();
            }
        });

        app.ui.settings.addSetting({
            id: "KayTool.SetGetBackgroundColor",
            name: "Set/Get Node Background Color",
            type: "color",
            defaultValue: "000000",
            category: ["KayTool", "🛜 Set/Get", "SetGetBackgroundColor"],
            onChange: (newVal) => {
                updateSetGetNodeColors();
            }
        });

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

        updateSetGetNodeColors();
    }
});