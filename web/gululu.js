import { app } from "../../../scripts/app.js";
import { marked } from "./lib/marked.esm.js";

// 全局动作注册表
const KayToolActions = window.KayToolActions || {};
window.KayToolActions = KayToolActions;

// GuLuLu 管理器
const KayGuLuLuManager = {
    container: null,
    dragState: { isDragging: false, offsetX: 0, offsetY: 0 },
    state: { left: 100, top: 100, transform: "scaleX(1)" },
    pixelCanvas: null,
    pixelCtx: null,
    pixelDataCache: null,
    imgSrc: "/extensions/KayTool/resources/GuLuLu.gif",
    effectiveBounds: null,
    isAnimating: false,
    animationTimer: null,
    contextMenu: null,
    isEnabled: true,
    size: 39, // 默认尺寸
    // GuLuLu 右键菜单配置
    menuConfig: [
        { label: "Say Hello", action: "playAnimation" },
        { label: "🧹 Clean VRAM", action: "cleanVRAM" },
        { label: "📦 Workflow PNG", action: "exportWorkflowPNG" },
        { label: "⭐ Star to me", action: "starToMe" }
    ],

    init() {
        this.isEnabled = app.ui.settings.getSettingValue("KayTool.EnableGuLuLu") ?? true;
        this.size = app.ui.settings.getSettingValue("KayTool.GuLuLuSize") ?? 39;
        this.loadState();
        this.injectStyles();
        this.setupGuLuLu();
        this.updatePosition();
        window.KayGuLuLuManager = this;
        window.addEventListener("resize", () => this.updatePosition());
        if (this.isEnabled) {
            this.startRandomAnimation();
        }
    },

    injectStyles() {
        document.head.insertAdjacentHTML(
            "beforeend",
            `<style>
            #kay-gululu-container {
                position: fixed;
                z-index: 10002;
                user-select: none;
                pointer-events: none;
                display: none;
            }
            #kay-gululu-container.enabled {
                display: block;
            }
            #kay-gululu-container img {
                width: ${this.size}px;
                height: auto;
                display: block;
                pointer-events: auto;
            }
            .gululu-context-menu {
                position: fixed;
                background: #333;
                border: 2px solid #000;
                border-radius: 8px;
                box-shadow: 4px 4px 0 #999;
                padding: 8px 0;
                z-index: 10002;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                color: #fff;
                white-space: nowrap;
                overflow-y: auto;
            }
            .gululu-context-menu::-webkit-scrollbar {
                width: 8px;
            }
            .gululu-context-menu::-webkit-scrollbar-track {
                background: #333;
                border-left: 2px solid #000;
            }
            .gululu-context-menu::-webkit-scrollbar-thumb {
                background: #f0ff00;
                border: 50px solid #f0ff00;
            }
            .gululu-context-menu-item {
                padding: 4px 12px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
                white-space: nowrap;
            }
            .gululu-context-menu-item:hover {
                background: #555;
            }
        </style>`
        );
    },

    setupGuLuLu() {
        if (!this.container) {
            this.container = document.createElement("div");
            this.container.id = "kay-gululu-container";
            const img = document.createElement("img");
            img.src = this.imgSrc;
            img.alt = "GuLuLu";
            img.onload = () => {
                this.updatePixelDataCache();
                this.updatePosition();
            };
            this.container.appendChild(img);
            document.body.appendChild(this.container);

            this.pixelCanvas = document.createElement("canvas");
            this.pixelCanvas.style.display = "none";
            document.body.appendChild(this.pixelCanvas);
            this.pixelCtx = this.pixelCanvas.getContext("2d", { willReadFrequently: true });
        }

        this.container.classList.toggle("enabled", this.isEnabled);
        this.bindEvents();
    },

    bindEvents() {
        if (this.container) {
            this.container.removeEventListener("mousemove", this.handleMouseMove);
            this.container.removeEventListener("mousedown", this.onDragStart);
            this.container.removeEventListener("contextmenu", this.onContextMenu);
        }
        document.removeEventListener("mousemove", this.onDragging);
        document.removeEventListener("mouseup", this.onDragEnd);
        document.removeEventListener("click", this.hideContextMenu);

        if (this.container && this.isEnabled) {
            this.container.addEventListener("mousemove", this.handleMouseMove.bind(this));
            this.container.addEventListener("mousedown", this.onDragStart.bind(this));
            this.container.addEventListener("contextmenu", this.onContextMenu.bind(this));
        }
        document.addEventListener("mousemove", this.onDragging.bind(this));
        document.addEventListener("mouseup", this.onDragEnd.bind(this));
        document.addEventListener("click", this.hideContextMenu.bind(this));
    },

    updateSize(newSize) {
        this.size = newSize;
        const img = this.container?.querySelector("img");
        if (img) {
            img.style.width = `${this.size}px`;
            this.updatePixelDataCache();
            this.updatePosition();
        }
    },

    playAnimation() {
        if (!this.isEnabled || this.isAnimating || !this.container) return;

        this.isAnimating = true;
        const img = this.container.querySelector("img");
        if (img) {
            const src = img.src;
            img.src = "";
            img.src = src;
            setTimeout(() => {
                this.isAnimating = false;
            }, 2000);
        }
    },

    startRandomAnimation() {
        const getRandomInterval = () => {
            const min = 300 * 1000; // 10 秒
            const max = 1200 * 1000; // 30 秒
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        const scheduleNextAnimation = () => {
            clearTimeout(this.animationTimer);
            if (!this.isEnabled) return;
            const interval = getRandomInterval();
            this.animationTimer = setTimeout(() => {
                this.playAnimation();
                scheduleNextAnimation();
            }, interval);
        };

        scheduleNextAnimation();
    },

    updateEnabledState(enabled) {
        this.isEnabled = enabled;
        if (!this.container) {
            this.setupGuLuLu();
        } else {
            this.container.classList.toggle("enabled", enabled);
            this.bindEvents();
        }
        if (enabled) {
            this.updatePosition();
            this.startRandomAnimation();
        } else {
            clearTimeout(this.animationTimer);
        }
    },

    loadState() {
        const savedState = localStorage.getItem("kay-gululu-state");
        if (savedState) {
            this.state = JSON.parse(savedState);
        }
    },

    saveState() {
        localStorage.setItem("kay-gululu-state", JSON.stringify(this.state));
    },

    updatePosition() {
        if (!this.container || !this.isEnabled) return;
        const { windowRect, containerRect } = this.getRect();

        if (!this.pixelDataCache && this.container.querySelector("img").complete) {
            this.updatePixelDataCache();
        }

        const bounds = this.effectiveBounds || { left: 0, top: 0, width: containerRect.width, height: containerRect.height };
        this.state.left = Math.max(-bounds.left, Math.min(this.state.left, windowRect.width - (bounds.left + bounds.width)));
        this.state.top = Math.max(-bounds.top, Math.min(this.state.top, windowRect.height - (bounds.top + bounds.height)));

        this.container.style.left = `${this.state.left}px`;
        this.container.style.top = `${this.state.top}px`;

        const midPoint = windowRect.width / 2;
        this.state.transform = containerRect.left + containerRect.width / 2 > midPoint ? "scaleX(-1)" : "scaleX(1)";
        this.container.style.transform = this.state.transform;
    },

    getRect() {
        return {
            windowRect: { width: window.innerWidth, height: window.innerHeight },
            containerRect: this.container?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 },
        };
    },

    updatePixelDataCache() {
        const { containerRect } = this.getRect();
        if (containerRect.width === 0 || containerRect.height === 0) {
            return;
        }
        this.pixelCanvas.width = containerRect.width;
        this.pixelCanvas.height = containerRect.height;
        this.pixelCtx.clearRect(0, 0, this.pixelCanvas.width, this.pixelCanvas.height);
        this.pixelCtx.drawImage(this.container.querySelector("img"), 0, 0, containerRect.width, containerRect.height);
        this.pixelDataCache = this.pixelCtx.getImageData(0, 0, this.pixelCanvas.width, this.pixelCanvas.height);

        this.calculateEffectiveBounds();
    },

    calculateEffectiveBounds() {
        if (!this.pixelDataCache) return;

        const data = this.pixelDataCache.data;
        const width = this.pixelCanvas.width;
        const height = this.pixelCanvas.height;
        let minX = width,
            minY = height,
            maxX = 0,
            maxY = 0;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                if (data[index + 3] !== 0) {
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            }
        }

        this.effectiveBounds = {
            left: minX,
            top: minY,
            width: maxX - minX + 1,
            height: maxY - minY + 1,
        };
    },

    isPixelTransparent(x, y) {
        if (!this.pixelDataCache) return true;
        const index = (y * this.pixelDataCache.width + x) * 4;
        return this.pixelDataCache.data[index + 3] === 0;
    },

    handleMouseMove(e) {
        const { containerRect } = this.getRect();
        const offsetX = e.clientX - containerRect.left;
        const offsetY = e.clientY - containerRect.top;

        if (offsetX >= 0 && offsetX < containerRect.width && offsetY >= 0 && offsetY < containerRect.height) {
            this.container.style.cursor = this.isPixelTransparent(offsetX, offsetY) ? "default" : "move";
        }
    },

    onDragStart(e) {
        e.preventDefault();
        const { containerRect } = this.getRect();
        const offsetX = e.clientX - containerRect.left;
        const offsetY = e.clientY - containerRect.top;

        if (this.isPixelTransparent(offsetX, offsetY)) return;

        this.dragState.isDragging = true;
        this.dragState.offsetX = offsetX;
        this.dragState.offsetY = offsetY;
    },

    onDragging(e) {
        if (!this.dragState.isDragging) return;

        const { windowRect, containerRect } = this.getRect();
        this.state.left = e.clientX - this.dragState.offsetX;
        this.state.top = e.clientY - this.dragState.offsetY;

        const bounds = this.effectiveBounds || { left: 0, top: 0, width: containerRect.width, height: containerRect.height };
        this.state.left = Math.max(-bounds.left, Math.min(this.state.left, windowRect.width - (bounds.left + bounds.width)));
        this.state.top = Math.max(-bounds.top, Math.min(this.state.top, windowRect.height - (bounds.top + bounds.height)));

        this.updatePosition();
    },

    onDragEnd() {
        if (this.dragState.isDragging) {
            this.dragState.isDragging = false;
            this.saveState();
            this.updatePosition();
        }
    },

    onContextMenu(e) {
        e.preventDefault();
        const { containerRect } = this.getRect();
        const offsetX = e.clientX - containerRect.left;
        const offsetY = e.clientY - containerRect.top;

        if (this.isPixelTransparent(offsetX, offsetY)) return;

        this.hideContextMenu();
        this.showContextMenu(e.clientX, e.clientY);
    },

    showContextMenu(x, y) {
        const menuItems = [];

        // 根据 menuConfig 动态生成菜单项
        this.menuConfig.forEach((config) => {
            let action;
            if (config.action === "playAnimation") {
                action = () => this.playAnimation();
            } else if (KayToolActions[config.action]) {
                action = () => KayToolActions[config.action]();
            }
            if (action) {
                menuItems.push({
                    label: config.label,
                    action,
                });
            }
        });

        this.contextMenu = document.createElement("div");
        this.contextMenu.className = "gululu-context-menu";
        document.body.appendChild(this.contextMenu);

        // 先创建菜单项以计算宽度
        const tempDiv = document.createElement("div");
        tempDiv.style.visibility = "hidden";
        tempDiv.style.position = "absolute";
        tempDiv.style.fontFamily = "'Courier New', monospace";
        tempDiv.style.fontSize = "14px";
        tempDiv.style.fontWeight = "bold";
        tempDiv.style.padding = "4px 12px";
        tempDiv.style.whiteSpace = "nowrap";
        document.body.appendChild(tempDiv);

        let maxWidth = 0;
        menuItems.forEach((item) => {
            tempDiv.textContent = item.label;
            const itemWidth = tempDiv.getBoundingClientRect().width;
            maxWidth = Math.max(maxWidth, itemWidth);
        });
        document.body.removeChild(tempDiv);

        // 设置菜单固定宽度（包括 padding）
        this.contextMenu.style.width = `${maxWidth + 6}px`; // 12px 左右 padding

        menuItems.forEach((item) => {
            const menuItem = document.createElement("div");
            menuItem.className = "gululu-context-menu-item";
            menuItem.textContent = item.label;
            menuItem.addEventListener("click", (e) => {
                e.stopPropagation();
                item.action();
                this.hideContextMenu();
            });
            this.contextMenu.appendChild(menuItem);
        });

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const { containerRect } = this.getRect();
        const gululuCenterY = containerRect.top + containerRect.height / 2;
        const isAboveHalf = gululuCenterY < windowHeight / 2;

        let menuLeft = x;
        let menuTop = y;

        // 计算菜单高度并检查边界
        let { height: menuHeight } = this.contextMenu.getBoundingClientRect();

        // 垂直方向调整，避免遮挡 GuLuLu，并处理滚动
        if (isAboveHalf) {
            menuTop = y;
            if (menuTop + menuHeight > windowHeight - 10) {
                // 接近底部边界，限制高度，启用滚动
                this.contextMenu.style.maxHeight = `${windowHeight - 20}px`; // 上下各留10px
                menuTop = 10; // 确保顶部不贴边
            }
        } else {
            menuTop = y - menuHeight;
            if (menuTop < 10) {
                // 接近顶部边界，限制高度，启用滚动
                this.contextMenu.style.maxHeight = `${windowHeight - 20}px`; // 上下各留10px
                menuTop = 10; // 确保顶部不贴边
            }
        }

        // 水平方向：优先贴近点击点，允许超出右边界
        const { width: menuWidth } = this.contextMenu.getBoundingClientRect();
        if (menuLeft + menuWidth > windowWidth) {
            menuLeft = windowWidth - menuWidth;
        }

        this.contextMenu.style.left = `${menuLeft - 10}px`;
        this.contextMenu.style.top = `${menuTop}px`;
    },

    hideContextMenu() {
        if (this.contextMenu) {
            this.contextMenu.remove();
            this.contextMenu = null;
        }
    },
};

// 通知框函数（保持不变）
export function showNotification({ 
    message, 
    bgColor = "#fff3cd", 
    timeout = 0, 
    onYes = null, 
    onNo = null, 
    size = "small"
}) {
    const sizes = {
        small: { maxWidth: "250px", maxHeight: "150px", padding: "12px 16px" },
        medium: { maxWidth: "400px", maxHeight: "300px", padding: "12px 16px" },
        large: { maxWidth: "600px", maxHeight: "450px", padding: "12px 16px" }
    };
    const selectedSize = sizes[size] || sizes.small;

    const div = document.createElement("div");
    Object.assign(div.style, {
        position: "fixed",
        width: selectedSize.maxWidth,
        padding: selectedSize.padding,
        backgroundColor: bgColor,
        color: "#333",
        fontFamily: "'Courier New', monospace",
        fontSize: "14px",
        wordWrap: "break-word",
        zIndex: "10000",
        border: "2px solid #000",
        borderRadius: "12px",
        boxShadow: "4px 4px 0 #999",
        opacity: "0",
        transition: "opacity 0.3s ease-in-out",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        boxSizing: "border-box"
    });
    document.body.appendChild(div);

    const isGuLuLuEnabled = window.KayGuLuLuManager && window.KayGuLuLuManager.isEnabled;
    if (isGuLuLuEnabled) {
        window.KayGuLuLuManager.playAnimation();
    }

    let tail, tailBorder;
    if (isGuLuLuEnabled) {
        tail = document.createElement("div");
        Object.assign(tail.style, {
            position: "absolute",
            width: "0",
            height: "0",
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            zIndex: "-1"
        });
        div.appendChild(tail);

        tailBorder = document.createElement("div");
        Object.assign(tailBorder.style, {
            position: "absolute",
            width: "0",
            height: "0",
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            zIndex: "-2"
        });
        div.appendChild(tailBorder);
    }

    const closeButton = document.createElement("div");
    closeButton.textContent = "X";
    Object.assign(closeButton.style, {
        position: "absolute",
        top: "12px",
        left: "12px",
        width: "12px",
        height: "12px",
        backgroundColor: "#dc3545",
        border: "2px solid #000",
        borderRadius: "50%",
        fontSize: "10px",
        lineHeight: "10px",
        textAlign: "center",
        cursor: "pointer",
        boxShadow: "2px 2px 0 #999"
    });
    closeButton.addEventListener("click", () => hideNotification(div));
    closeButton.addEventListener("mousedown", () => {
        closeButton.style.transform = "translate(1px, 1px)";
        closeButton.style.boxShadow = "0 0 0 #999";
    });
    document.addEventListener("mouseup", () => {
        closeButton.style.transform = "translate(0, 0)";
        closeButton.style.boxShadow = "2px 2px 0 #999";
    });
    div.appendChild(closeButton);

    const contentDiv = document.createElement("div");
    Object.assign(contentDiv.style, {
        marginTop: "20px",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "0 4px 0 0",
        boxSizing: "border-box",
        wordBreak: "break-word",
        fontFamily: "'Courier New', monospace",
        whiteSpace: "pre-wrap"
    });
    contentDiv.style.cssText += `
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #333; border-left: 2px solid #000; }
        ::-webkit-scrollbar-thumb { background: #999; border: 2px solid #000; }
    `;
    div.appendChild(contentDiv);

    let buttonContainer = null;
    if (onYes || onNo) {
        buttonContainer = document.createElement("div");
        Object.assign(buttonContainer.style, {
            display: "flex",
            gap: "8px",
            justifyContent: "flex-end",
            marginTop: "4px",
            paddingBottom: "4px"
        });
        div.appendChild(buttonContainer);

        if (onYes) {
            const yesButton = document.createElement("button");
            yesButton.textContent = "Yes";
            Object.assign(yesButton.style, {
                padding: "4px 8px",
                backgroundColor: "#28a745",
                border: "2px solid #000",
                borderRadius: "8px",
                fontFamily: "'Courier New', monospace",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#fff",
                cursor: "pointer",
                boxShadow: "2px 2px 0 #999"
            });
            yesButton.addEventListener("mousedown", () => {
                yesButton.style.transform = "translate(1px, 1px)";
                yesButton.style.boxShadow = "0 0 0 #999";
            });
            document.addEventListener("mouseup", () => {
                yesButton.style.transform = "translate(0, 0)";
                yesButton.style.boxShadow = "2px 2px 0 #999";
            });
            yesButton.addEventListener("click", () => {
                hideNotification(div);
                onYes();
            });
            buttonContainer.appendChild(yesButton);
        }

        if (onNo) {
            const noButton = document.createElement("button");
            noButton.textContent = "No";
            Object.assign(noButton.style, {
                padding: "4px 8px",
                backgroundColor: "#dc3545",
                border: "2px solid #000",
                borderRadius: "8px",
                fontFamily: "'Courier New', monospace",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#fff",
                cursor: "pointer",
                boxShadow: "2px 2px 0 #999"
            });
            noButton.addEventListener("mousedown", () => {
                noButton.style.transform = "translate(1px, 1px)";
                noButton.style.boxShadow = "0 0 0 #999";
            });
            document.addEventListener("mouseup", () => {
                noButton.style.transform = "translate(0, 0)";
                noButton.style.boxShadow = "2px 2px 0 #999";
            });
            noButton.addEventListener("click", () => {
                hideNotification(div);
                onNo();
            });
            buttonContainer.appendChild(noButton);
        }
    }

    const updatePosition = () => {
        if (isGuLuLuEnabled && window.KayGuLuLuManager && window.KayGuLuLuManager.container) {
            const gululu = window.KayGuLuLuManager;
            const containerRect = gululu.container.getBoundingClientRect();
            const windowRect = { width: window.innerWidth, height: window.innerHeight };
            const notificationRect = div.getBoundingClientRect();
            const bounds = gululu.effectiveBounds || { left: 0, top: 0, width: containerRect.width, height: containerRect.height };

            const gululuCenterX = containerRect.left + containerRect.width / 2;
            const isLeftSide = gululuCenterX < windowRect.width / 2;
            const horizontalOffset = 10;

            const gululuCenterY = containerRect.top + containerRect.height / 2;
            const isTopHalf = gululuCenterY < windowRect.height / 2;
            const verticalOffset = -26;

            let left, top;

            if (isLeftSide) {
                left = containerRect.right + horizontalOffset;
                if (tail) {
                    tail.style.left = "-8px";
                    tail.style.right = "auto";
                    tail.style.borderRight = `8px solid ${bgColor}`;
                    tail.style.borderLeft = "none";
                    tail.style.borderTop = "6px solid transparent";
                    tail.style.borderBottom = "6px solid transparent";
                }
                if (tailBorder) {
                    tailBorder.style.left = "-10px";
                    tailBorder.style.right = "auto";
                    tailBorder.style.borderRight = "10px solid #000";
                    tailBorder.style.borderLeft = "none";
                    tailBorder.style.borderTop = "8px solid transparent";
                    tailBorder.style.borderBottom = "8px solid transparent";
                }
            } else {
                left = containerRect.left - notificationRect.width - horizontalOffset;
                if (tail) {
                    tail.style.right = "-8px";
                    tail.style.left = "auto";
                    tail.style.borderLeft = `8px solid ${bgColor}`;
                    tail.style.borderRight = "none";
                    tail.style.borderTop = "6px solid transparent";
                    tail.style.borderBottom = "6px solid transparent";
                }
                if (tailBorder) {
                    tailBorder.style.right = "-10px";
                    tailBorder.style.left = "auto";
                    tailBorder.style.borderLeft = "10px solid #000";
                    tailBorder.style.borderRight = "none";
                    tailBorder.style.borderTop = "8px solid transparent";
                    tailBorder.style.borderBottom = "8px solid transparent";
                }
            }

            if (isTopHalf) {
                top = containerRect.top + bounds.top + bounds.height + verticalOffset;
                if (tail) {
                    tail.style.top = "12px";
                    tail.style.bottom = "auto";
                    tail.style.transform = "none";
                }
                if (tailBorder) {
                    tailBorder.style.top = "10px";
                    tailBorder.style.bottom = "auto";
                    tailBorder.style.transform = "none";
                }
            } else {
                top = containerRect.top + bounds.top - notificationRect.height - verticalOffset;
                if (tail) {
                    tail.style.top = "auto";
                    tail.style.bottom = "12px";
                    tail.style.transform = "none";
                }
                if (tailBorder) {
                    tailBorder.style.top = "auto";
                    tailBorder.style.bottom = "10px";
                    tailBorder.style.transform = "none";
                }
            }

            left = Math.max(0, Math.min(left, windowRect.width - notificationRect.width));
            top = Math.max(0, Math.min(top, windowRect.height - notificationRect.height));

            div.style.left = `${left}px`;
            div.style.top = `${top}px`;
        } else {
            div.style.left = "20px";
            div.style.bottom = "20px";
            div.style.top = "auto";
        }
    };

    const updateHeights = () => {
        const buttonHeight = buttonContainer ? buttonContainer.offsetHeight : 0;
        const totalExtraHeight = buttonHeight + 36;
        div.style.maxHeight = `calc(${selectedSize.maxHeight} + ${totalExtraHeight}px)`;
        contentDiv.style.maxHeight = `calc(${selectedSize.maxHeight} - ${totalExtraHeight}px)`;
        updatePosition();
    };
    updateHeights();

    const throttle = (func, limit) => {
        let lastCall = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastCall >= limit) {
                func(...args);
                lastCall = now;
            }
        };
    };
    const onGuLuLuMove = throttle(updatePosition, 16);
    if (isGuLuLuEnabled) {
        document.addEventListener("mousemove", onGuLuLuMove);
        document.addEventListener("mouseup", onGuLuLuMove);
    }
    window.addEventListener("resize", updatePosition);

    const cleanup = () => {
        document.removeEventListener("mousemove", onGuLuLuMove);
        document.removeEventListener("mouseup", onGuLuLuMove);
        window.removeEventListener("resize", updatePosition);
    };

    try {
        marked.setOptions({ breaks: true, gfm: true });

        if (!message || typeof message !== "string" || message.trim() === "") {
            contentDiv.textContent = "无消息显示";
            updateHeights();
            return div;
        }

        if (isGuLuLuEnabled) {
            const chars = message.split("");
            let charIndex = 0;
            let currentMarkdown = "";
            let renderedHtml = "";

            function typeWriter() {
                if (charIndex >= chars.length) {
                    if (currentMarkdown.trim()) {
                        renderedHtml += marked.parse(currentMarkdown);
                    }
                    contentDiv.innerHTML = renderedHtml;
                    updateHeights();
                    return;
                }

                currentMarkdown += chars[charIndex];
                const isNewline = chars[charIndex] === "\n";
                const isDoubleNewline = isNewline && charIndex > 0 && chars[charIndex - 1] === "\n";

                if (isDoubleNewline) {
                    if (currentMarkdown.trim()) {
                        renderedHtml += marked.parse(currentMarkdown);
                        currentMarkdown = "";
                    }
                    contentDiv.innerHTML = renderedHtml;
                } else {
                    contentDiv.innerHTML = renderedHtml + `<div>${currentMarkdown}</div>`;
                }

                charIndex++;
                setTimeout(typeWriter, 50);
            }

            setTimeout(typeWriter, 300);
        } else {
            contentDiv.innerHTML = marked.parse(message);
            updateHeights();
        }
    } catch (e) {
        contentDiv.textContent = message || "显示消息出错";
        updateHeights();
    }

    setTimeout(() => (div.style.opacity = "1"), 10);
    if (timeout > 0) {
        setTimeout(() => {
            cleanup();
            hideNotification(div);
        }, timeout);
    }

    const originalHide = hideNotification.bind(null, div);
    div.hide = () => {
        cleanup();
        originalHide();
    };

    return div;
}

export function hideNotification(element) {
    if (element?.parentNode) {
        element.style.opacity = "0";
        setTimeout(() => element.parentNode?.removeChild(element), 300);
    }
}

// 注册扩展
app.registerExtension({
    name: "KayTool.GuLuLu",
    init() {
        KayGuLuLuManager.init();
    },
    cleanup() {
        document.removeEventListener("mousemove", KayGuLuLuManager.onDragging);
        document.removeEventListener("mouseup", KayGuLuLuManager.onDragEnd);
        document.removeEventListener("click", KayGuLuLuManager.hideContextMenu);
        KayGuLuLuManager.container?.remove();
        KayGuLuLuManager.pixelCanvas?.remove();
        KayGuLuLuManager.contextMenu?.remove();
        clearTimeout(KayGuLuLuManager.animationTimer);
        delete window.KayGuLuLuManager;
    },
});