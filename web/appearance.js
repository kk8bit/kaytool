// web/appearance_extension.js

import { app } from "../../../scripts/app.js";

const COLOR_THEMES = {
    red: { nodeColor: "#332222", nodeBgColor: "#553333" },
    green: { nodeColor: "#223322", nodeBgColor: "#335533" },
    blue: { nodeColor: "#222233", nodeBgColor: "#333355" },
    pale_blue: { nodeColor: "#2a363b", nodeBgColor: "#3f5159" },
    cyan: { nodeColor: "#223333", nodeBgColor: "#335555" },
    purple: { nodeColor: "#332233", nodeBgColor: "#553355" },
    yellow: { nodeColor: "#443322", nodeBgColor: "#665533" },
    black: { nodeColor: "#000", nodeBgColor: "#000" },
    none: { nodeColor: null, nodeBgColor: null } 
};

const NODE_COLORS = {
    "Strong_Prompt": "blue",
    "Baidu_Translater": "cyan",
    "Tencent_Translater": "cyan",
    "Display_Any": "pale_blue",  
    "Color_Adjustment": "blue",
    "Custom_Save_Image": "black",
    "Abc_Math": "cyan",
    "Image_Size_Extractor": "pale_blue",
    "Text": "pale_blue",
    "AIO_Translater": "cyan",
    "RemBG_Loader": "purple",
    "Remove_BG": "purple",
    "Preview_Mask_Plus": "cyan",
    "Mask_Blur_Plus": "cyan",
    "Preview_Mask": "pale_blue",
    "To_Int": "pale_blue",
    "Slider_1000": "blue",
    "Slider_100": "blue",
    "Slider_10": "blue",
};

function setNodeColors(node, theme) {
    if (!theme) return;
    //node.shape = "box";  // Uncomment this line to see the node shape 
    if (theme.nodeColor && theme.nodeBgColor) {
        node.color = theme.nodeColor;
        node.bgcolor = theme.nodeBgColor;
    }
}


app.registerExtension({
    name: "kaytool.appearance",
    nodeCreated(node) {
        
        if (NODE_COLORS.hasOwnProperty(node.comfyClass)) {
            const colorKey = NODE_COLORS[node.comfyClass];
            const theme = COLOR_THEMES[colorKey];
            setNodeColors(node, theme);
        }
    }
});