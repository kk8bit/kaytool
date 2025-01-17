// web/appearance_extension.js

import { app } from "../../../scripts/app.js";

const COLOR_THEMES = {
    blue: { nodeColor: "#222233", nodeBgColor: "#333355" },
    green: { nodeColor: "#223322", nodeBgColor: "#335533" },
    pale_blue: { nodeColor: "#2a363b", nodeBgColor: "#3f5159" },
    purple: { nodeColor: "#323", nodeBgColor: "#535" },
    black: { nodeColor: "#333", nodeBgColor: "#000" }
};


const NODE_COLORS = {
    "Strong_Prompt": "blue",
    "Baidu_Translater": "green",
    "Display_Any": "pale_blue",  
    "Color_Adjustment": "purple",
    "Custom_Save_Image": "black"
};

function setNodeColors(node, theme) {
    if (!theme) return;
    node.shape = "box";
    if (theme.nodeColor && theme.nodeBgColor) {
        node.color = theme.nodeColor;
        node.bgcolor = theme.nodeBgColor;
    }
}

// 创建扩展对象并注册
app.registerExtension({
    name: "kaytool.appearance",
    nodeCreated(node) {
        // 检查是否需要应用主题
        if (NODE_COLORS.hasOwnProperty(node.comfyClass)) {
            const colorKey = NODE_COLORS[node.comfyClass];
            const theme = COLOR_THEMES[colorKey];
            setNodeColors(node, theme);
        }
    }
});