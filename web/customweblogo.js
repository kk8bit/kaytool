import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "KayTool.CustomWebLogo",
    async setup() {
        // setup 跑在页面加载时、任何任务开始之前，此刻的图标就是 ComfyUI 的常态图标，
        // 记下来供关闭开关时还原。不要退回写死的 /favicon.ico —— 新版 ComfyUI 上它是 404。
        const originalFavicon = document.querySelector("link[rel='icon']")?.href || null;

        function updateFavicon(dataUrl) {
            const href = dataUrl || originalFavicon;
            if (!href) return; // 没有可还原的目标就别乱动，交给 ComfyUI 自己管
            let link = document.querySelector("link[rel='icon']");
            if (!link) {
                link = document.createElement("link");
                link.rel = "icon";
                document.head.appendChild(link);
            }
            link.href = href;
        }

        function applyLogo() {
            const enabled = app.ui.settings.getSettingValue("KayTool.EnableCustomWebLogo");
            const logo = app.ui.settings.getSettingValue("KayTool.CustomWebLogo");
            const usable = enabled && typeof logo === "string" && logo.startsWith("data:image/");
            updateFavicon(usable ? logo : null);
        }

        app.ui.settings.addSetting({
            id: "KayTool.EnableCustomWebLogo",
            name: "Use a custom browser tab icon",
            type: "boolean",
            defaultValue: true,
            tooltip: "Only affects the browser tab icon (favicon). Turn this off to keep ComfyUI's own icon.",
            category: ["KayTool", "Browser Tab Icon", "EnableCustomWebLogo"],
            onChange: () => applyLogo(),
        });

        app.ui.settings.addSetting({
            id: "KayTool.CustomWebLogo",
            name: "Icon image (must be < 1MB)",
            type: "image",
            tooltip: "Replaces the browser tab icon only, not the ComfyUI logo in the interface. File must be < 1MB.",
            defaultValue: null,
            category: ["KayTool", "Browser Tab Icon", "CustomWebLogo"],
            onChange: () => applyLogo(),
        });

        applyLogo();
    },
});
