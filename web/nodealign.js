import { app } from "../../../scripts/app.js";

// Based on /NodeAligner by Tenney95 GitHub:https://github.com/Tenney95/ComfyUI-NodeAligner

const kayAlignBottomSvg = `<svg t="1725534360155" class="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1662" width="100%"><path d="M1170.285714 987.428571a36.571429 36.571429 0 0 0-36.571428-36.571428H36.571429a36.571429 36.571429 0 0 0 0 73.142857h1097.142857a36.571429 36.571429 0 0 0 36.571428-36.571429z m-219.428571-146.285714v-512a36.571429 36.571429 0 0 0-36.571429-36.571428h-219.428571a36.571429 36.571429 0 0 0-36.571429 36.571428v512a36.571429 36.571429 0 0 0 36.571429 36.571429h219.428571a36.571429 36.571429 0 0 0 36.571429-36.571429z m-438.857143 0V36.571429a36.571429 36.571429 0 0 0-36.571429-36.571429h-219.428571a36.571429 36.571429 0 0 0-36.571429 36.571429v804.571428a36.571429 36.571429 0 0 0 36.571429 36.571429h219.428571a36.571429 36.571429 0 0 0 36.571429-36.571429z" fill="#666666" p-id="1663"></path></svg>`;
const kayAlignCenterHorizontallySvg = `<svg t="1725534379860" class="icon" viewBox="0 0 1243 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2250" width="100%"><path d="M548.571429 472.356571h146.285714V231.643429a36.571429 36.571429 0 0 1 36.571428-36.571429h219.428572a36.571429 36.571429 0 0 1 36.571428 36.571429v240.713142h179.785143a39.643429 39.643429 0 0 1 0 79.286858H987.428571v240.713142a36.571429 36.571429 0 0 1-36.571428 36.571429h-219.428572a36.571429 36.571429 0 0 1-36.571428-36.571429V551.64571h-146.285714V950.857143a36.571429 36.571429 0 0 1-36.571429 36.571428H292.571429a36.571429 36.571429 0 0 1-36.571429-36.571428V551.643429H76.214857a39.643429 39.643429 0 1 1 0-79.286858H256V73.142857A36.571429 36.571429 0 0 1 292.571429 36.571429h219.428571a36.571429 36.571429 0 0 1 36.571429 36.571428v399.213714z" fill="#666666" p-id="2251"></path></svg>`;
const kayAlignCenterVerticallySvg = `<svg t="1725534363707" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1809" width="100%"><path d="M477.312 576V448H266.688a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32h210.624V34.688a34.688 34.688 0 0 1 69.376 0V192h210.624a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32H546.688v128H896a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32H546.688v157.312a34.688 34.688 0 0 1-69.376 0V832H128a32 32 0 0 1-32-32v-192A32 32 0 0 1 128 576h349.312z" fill="#666666" p-id="1810"></path></svg>`;
const kayAlignLeftSvg = `<svg t="1725534370541" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2103" width="100%"><path d="M96 0a32 32 0 0 1 32 32v960a32 32 0 0 1-64 0V32A32 32 0 0 1 96 0z m128 192h448a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32h-448a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32z m0 384h704a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32h-704a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32z" fill="#666666" p-id="2104"></path></svg>`;
const kayAlignRightSvg = `<svg t="1725534384109" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2397" width="100%"><path d="M928 0a32 32 0 0 1 32 32v960a32 32 0 0 1-64 0V32a32 32 0 0 1 32-32z m-576 192h448a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32h-448a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32z m-256 384h704a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32v-192A32 32 0 0 1 96 576z" fill="#666666" p-id="2398"></path></svg>`;
const kayAlignTopSvg = `<svg t="1725534367556" class="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1956" width="100%"><path d="M1170.285714 36.571429a36.571429 36.571429 0 0 1-36.571428 36.571428H36.571429a36.571429 36.571429 0 0 1 0-73.142857h1097.142857a36.571429 36.571429 0 0 1 36.571428 36.571429z m-219.428571 146.285714v512a36.571429 36.571429 0 0 1-36.571429 36.571428h-219.428571a36.571429 36.571429 0 0 1-36.571429-36.571428v-512a36.571429 36.571429 0 0 1 36.571429-36.571429h219.428571a36.571429 36.571429 0 0 1 36.571429 36.571429z m-438.857143 0v804.571428a36.571429 36.571429 0 0 1-36.571429 36.571429h-219.428571a36.571429 36.571429 0 0 1-36.571429-36.571429v-804.571428a36.571429 36.571429 0 0 1 36.571429-36.571429h219.428571a36.571429 36.571429 0 0 1 36.571429 36.571429z" fill="#666666" p-id="1957"></path></svg>`;
const kayEqualWidthSvg = `<svg t="1725606034670" class="icon" viewBox="0 0 1088 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7213" width="100%"><path d="M978.24 480a42.688 42.688 0 0 1-42.688 42.688H172.928a42.688 42.688 0 0 1-42.688-42.688V213.312c0-23.552 19.072-42.624 42.688-42.624h762.624c23.552 0 42.688 19.072 42.688 42.624V480z" fill="#666666" p-id="7214"></path><path d="M256.96 734.144c0-14.08 11.456-25.6 25.6-25.6h543.36a25.6 25.6 0 0 1 0 51.2h-543.36a25.6 25.6 0 0 1-25.6-25.6z" fill="#666666" p-id="7215"></path><path d="M136.64 745.216a12.8 12.8 0 0 1 0-22.144l184.192-106.368a12.8 12.8 0 0 1 19.2 11.072v212.736a12.8 12.8 0 0 1-19.2 11.072l-184.192-106.368zM971.84 745.216a12.8 12.8 0 0 0 0-22.144l-184.256-106.368a12.8 12.8 0 0 0-19.2 11.072v212.736a12.8 12.8 0 0 0 19.2 11.072l184.256-106.368z" fill="#666666" p-id="7216"></path></svg>`;
const kayEqualHeightSvg = `<svg t="1725606224564" class="icon" viewBox="0 0 1088 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7790" width="100%"><path d="M572.16 936a42.688 42.688 0 0 1-42.688-42.688V130.688c0-23.616 19.136-42.688 42.688-42.688h266.688c23.552 0 42.624 19.072 42.624 42.688v762.624a42.688 42.688 0 0 1-42.624 42.688H572.16z" fill="#666666" p-id="7791"></path><path d="M318.016 214.72c14.08 0 25.6 11.456 25.6 25.6v543.36a25.6 25.6 0 1 1-51.2 0v-543.36c0-14.144 11.456-25.6 25.6-25.6z" fill="#666666" p-id="7792"></path><path d="M306.944 94.4a12.8 12.8 0 0 1 22.144 0l106.368 184.192a12.8 12.8 0 0 1-11.072 19.2H211.648a12.8 12.8 0 0 1-11.072-19.2l106.368-184.192zM306.944 929.6a12.8 12.8 0 0 0 22.144 0l106.368-184.192a12.8 12.8 0 0 0-11.072-19.2H211.648a12.8 12.8 0 0 0-11.072 19.2l106.368 184.192z" fill="#666666" p-id="7793"></path></svg>`;

const KayNodeAlignmentManager = {
    isInitialized: false,
    toolbarContainer: null,
    dragState: { isDragging: false, initialX: 0, initialY: 0, startX: 0, startY: 0 },
    hasShownTooltip: false,
    isVisible: true,
    isPermanent: true,
    position: { leftPercentage: 50, topPercentage: 5 },

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        this.canvas = document.querySelector('#graph-canvas');
        if (!this.canvas) {
            setTimeout(() => this.init(), 100);
            return;
        }

        const bgColor = app.ui.settings.getSettingValue("KayTool.NodeAlignBackgroundColor") || "000000";
        const iconBgColor = app.ui.settings.getSettingValue("KayTool.NodeAlignIconBackgroundColor") || "2b2b2b";
        const iconColor = app.ui.settings.getSettingValue("KayTool.NodeAlignIconColor") || "666666";

        document.head.insertAdjacentHTML('beforeend', `<style>
            #kay-node-alignment-toolbar {
                position: absolute;
                display: flex;
                align-items: center;
                gap: 4px;
                background: #${bgColor};
                padding: 4px;
                border-radius: 4px;
                z-index: 9999;
                height: 32px;
                white-space: nowrap;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                pointer-events: auto;
            }
            .kay-align-button {
                width: 25px;
                height: 25px;
                display: flex; /* 使用 flex 布局 */
                justify-content: center; /* 水平居中 */
                align-items: center; /* 垂直居中 */
                background-color: #${iconBgColor};
                border: none;
                cursor: pointer;
                padding: 0; /* 移除 padding，确保 SVG 占满 */
                border-radius: 4px;
                transition: background-color .3s ease;
                flex-shrink: 0;
            }
            .kay-align-button svg {
                width: 70%; /* SVG 占满按钮 */
                height: 70%;
            }
            .kay-toolbar-divider {
                width: 3.2px;
                height: 15px;
                background: #1e1e1e;
                border-radius: 9px;
                cursor: grab;
                flex-shrink: 0;
            }
            .kay-toolbar-divider:active {
                cursor: grabbing;
            }
            #kay-align-tooltip {
                position: absolute;
                bottom: -20px;
                right: 0;
                background: #333;
                color: #fff;
                padding: 5px 10px;
                border-radius: 6px;
                display: none;
                z-index: 1001;
                white-space: nowrap;
                font-size: 12px;
            }
        </style>`);

        this.toolbarContainer = document.createElement('div');
        this.toolbarContainer.id = 'kay-node-alignment-toolbar';
        this.canvas.parentElement.appendChild(this.toolbarContainer);

        this.getAlignmentButtons().forEach(btn => {
            const el = document.createElement(btn.type === 'divider' ? 'div' : 'button');
            el.className = btn.type === 'divider' ? 'kay-toolbar-divider' : 'kay-align-button';
            if (btn.type !== 'divider') {
                el.id = btn.id;
                el.innerHTML = btn.svg.replace(/fill="#666666"/g, `fill="#${iconColor}"`);
                el.addEventListener('click', e => btn.action.call(this, e));
                el.addEventListener('mouseover', () => {
                    const baseColor = app.ui.settings.getSettingValue("KayTool.NodeAlignIconBackgroundColor") || "2b2b2b";
                    el.style.backgroundColor = this.adjustColor(baseColor, 36);
                });
                el.addEventListener('mouseout', () => {
                    el.style.backgroundColor = `#${app.ui.settings.getSettingValue("KayTool.NodeAlignIconBackgroundColor") || "2b2b2b"}`;
                });
            } else {
                el.addEventListener('mousedown', e => {
                    e.preventDefault();
                    this.onDragStart(e);
                });
            }
            this.toolbarContainer.appendChild(el);
        });

        document.addEventListener('mousemove', this.onDragging.bind(this));
        document.addEventListener('mouseup', this.onDragEnd.bind(this));
        document.addEventListener('selectstart', e => this.dragState.isDragging && e.preventDefault());

        this.addTooltip();
        const displayMode = app.ui.settings.getSettingValue("KayTool.NodeAlignDisplayMode") || "permanent";
        this.updateDisplayMode(displayMode);

        this.restorePosition();
        this.updatePosition();

        this.resizeObserver = new ResizeObserver(() => {
            this.updatePosition();
        });
        this.resizeObserver.observe(this.canvas.parentElement);

        window.addEventListener('resize', () => {
            setTimeout(() => this.updatePosition(), 100);
        });
    },

    adjustColor(hex, amount) {
        let color = hex.replace("#", "");
        if (color.length === 3) {
            color = color.split('').map(c => c + c).join('');
        }
        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);
        const b = parseInt(color.substr(4, 2), 16);

        const brightness = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        const adjust = brightness > 127 ? -amount : amount;

        const newR = Math.max(0, Math.min(255, r + adjust));
        const newG = Math.max(0, Math.min(255, g + adjust));
        const newB = Math.max(0, Math.min(255, b + adjust));

        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    },

    getCanvasRect() {
        const containerRect = this.canvas.parentElement.getBoundingClientRect();
        return {
            width: containerRect.width,
            height: containerRect.height
        };
    },

    getAlignmentButtons() {
        return [
            { id: 'kay-align-left', svg: kayAlignLeftSvg, action: this.alignLeft },
            { id: 'kay-align-center-vertically', svg: kayAlignCenterVerticallySvg, action: this.alignCenterVertically },
            { id: 'kay-align-right', svg: kayAlignRightSvg, action: this.alignRight },
            { type: 'divider' },
            { id: 'kay-align-top', svg: kayAlignTopSvg, action: this.alignTop },
            { id: 'kay-align-center-horizontally', svg: kayAlignCenterHorizontallySvg, action: this.alignCenterHorizontally },
            { id: 'kay-align-bottom', svg: kayAlignBottomSvg, action: this.alignBottom },
            { type: 'divider' },
            { id: 'kay-equal-width', svg: kayEqualWidthSvg, action: this.equalWidth },
            { id: 'kay-equal-height', svg: kayEqualHeightSvg, action: this.equalHeight }
        ];
    },

    addTooltip() {
        const tooltip = document.createElement('div');
        tooltip.id = 'kay-align-tooltip';
        tooltip.textContent = 'Node alignment toolbar';
        this.toolbarContainer.appendChild(tooltip);
        if (!this.hasShownTooltip) {
            this.toolbarContainer.addEventListener('mouseenter', () => {
                if (!this.hasShownTooltip) {
                    setTimeout(() => {
                        tooltip.style.display = 'block';
                        this.hasShownTooltip = true;
                    }, 1000);
                }
            });
            this.toolbarContainer.addEventListener('mouseleave', () => tooltip.remove());
        }
    },

    show() {
        this.isVisible = true;
        this.toolbarContainer.style.display = 'flex';
        this.updatePosition();
    },

    hide() {
        this.isVisible = false;
        this.toolbarContainer.style.display = 'none';
    },

    updatePosition() {
        if (!this.toolbarContainer || !this.isVisible) return;

        const canvasRect = this.getCanvasRect();
        const toolbarRect = this.toolbarContainer.getBoundingClientRect();

        let left = (this.position.leftPercentage / 100) * canvasRect.width - toolbarRect.width / 2;
        let top = (this.position.topPercentage / 100) * canvasRect.height;

        const snapThreshold = 10;
        if (left < snapThreshold) left = 0;
        if (left + toolbarRect.width > canvasRect.width - snapThreshold) left = canvasRect.width - toolbarRect.width;
        if (top < snapThreshold) top = 0;
        if (top + toolbarRect.height > canvasRect.height - snapThreshold) top = canvasRect.height - toolbarRect.height;

        left = Math.max(0, Math.min(left, canvasRect.width - toolbarRect.width));
        top = Math.max(0, Math.min(top, canvasRect.height - toolbarRect.height));

        this.toolbarContainer.style.left = `${left}px`;
        this.toolbarContainer.style.top = `${top}px`;
        this.toolbarContainer.style.transform = 'none';
    },

    onDragStart(e) {
        if (this.dragState.isDragging) return;
        const canvasRect = this.getCanvasRect();
        this.dragState = {
            isDragging: true,
            initialX: e.clientX,
            initialY: e.clientY,
            startX: this.toolbarContainer.offsetLeft,
            startY: this.toolbarContainer.offsetTop,
            canvasWidth: canvasRect.width,
            canvasHeight: canvasRect.height
        };
    },

    onDragging(e) {
        if (!this.dragState.isDragging) return;

        const toolbarRect = this.toolbarContainer.getBoundingClientRect();
        let left = this.dragState.startX + (e.clientX - this.dragState.initialX);
        let top = this.dragState.startY + (e.clientY - this.dragState.initialY);

        left = Math.max(0, Math.min(left, this.dragState.canvasWidth - toolbarRect.width));
        top = Math.max(0, Math.min(top, this.dragState.canvasHeight - toolbarRect.height));

        this.toolbarContainer.style.left = `${left}px`;
        this.toolbarContainer.style.top = `${top}px`;
    },

    onDragEnd() {
        if (!this.dragState.isDragging) return;
        this.dragState.isDragging = false;

        const canvasRect = this.getCanvasRect();
        const toolbarRect = this.toolbarContainer.getBoundingClientRect();

        this.position.leftPercentage = ((parseFloat(this.toolbarContainer.style.left) + toolbarRect.width / 2) / canvasRect.width) * 100;
        this.position.topPercentage = (parseFloat(this.toolbarContainer.style.top) / canvasRect.height) * 100;

        localStorage.setItem('KayNodeAlignToolbarPosition', JSON.stringify(this.position));
        this.updatePosition();
    },

    restorePosition() {
        try {
            const savedPosition = JSON.parse(localStorage.getItem('KayNodeAlignToolbarPosition'));
            if (savedPosition && typeof savedPosition.leftPercentage === 'number' && typeof savedPosition.topPercentage === 'number') {
                this.position = savedPosition;
            } else {
                this.setDefaultPosition();
            }
        } catch {
            this.setDefaultPosition();
        }
        this.updatePosition();
    },

    setDefaultPosition() {
        const nodes = app.graph ? app.graph._nodes : [];
        if (nodes.length > 0) {
            const avgX = nodes.reduce((sum, n) => sum + n.pos[0], 0) / nodes.length;
            const avgY = nodes.reduce((sum, n) => sum + n.pos[1], 0) / nodes.length;
            const canvasRect = this.getCanvasRect();
            this.position.leftPercentage = avgX > canvasRect.width / 2 ? 25 : 75;
            this.position.topPercentage = avgY > canvasRect.height / 2 ? 5 : 25;
        } else {
            this.position = { leftPercentage: 50, topPercentage: 5 };
        }
    },

    getSelectedNodes() {
        return Object.values(app.canvas.selected_nodes || []);
    },

    alignLeft() {
        const nodes = this.getSelectedNodes();
        const minX = Math.min(...nodes.map(n => n.pos[0]));
        nodes.forEach(n => n.pos[0] = minX);
        this.redraw();
    },

    alignRight() {
        const nodes = this.getSelectedNodes();
        const maxX = Math.max(...nodes.map(n => n.pos[0] + n.size[0]));
        nodes.forEach(n => n.pos[0] = maxX - n.size[0]);
        this.redraw();
    },

    alignTop() {
        const nodes = this.getSelectedNodes();
        const minY = Math.min(...nodes.map(n => n.pos[1]));
        nodes.forEach(n => n.pos[1] = minY);
        this.redraw();
    },

    alignBottom() {
        const nodes = this.getSelectedNodes();
        const maxY = Math.max(...nodes.map(n => n.pos[1] + n.size[1]));
        nodes.forEach(n => n.pos[1] = maxY - n.size[1]);
        this.redraw();
    },

    alignCenterHorizontally() {
        const nodes = this.getSelectedNodes();
        const minY = Math.min(...nodes.map(n => n.pos[1]));
        const maxY = Math.max(...nodes.map(n => n.pos[1] + n.size[1]));
        const centerY = (minY + maxY) / 2;
        nodes.forEach(n => n.pos[1] = centerY - n.size[1] / 2);
        this.redraw();
    },

    alignCenterVertically() {
        const nodes = this.getSelectedNodes();
        const minX = Math.min(...nodes.map(n => n.pos[0]));
        const maxX = Math.max(...nodes.map(n => n.pos[0] + n.size[0]));
        const centerX = (minX + maxX) / 2;
        nodes.forEach(n => n.pos[0] = centerX - n.size[0] / 2);
        this.redraw();
    },

    equalWidth() {
        const nodes = this.getSelectedNodes();
        if (nodes.length === 0) return;
        const firstNodeWidth = nodes[0].size[0];
        nodes.forEach(n => n.size[0] = firstNodeWidth);
        this.redraw();
    },

    equalHeight() {
        const nodes = this.getSelectedNodes();
        if (nodes.length === 0) return;
        const firstNodeHeight = nodes[0].size[1];
        nodes.forEach(n => n.size[1] = firstNodeHeight);
        this.redraw();
    },

    redraw() {
        if (app.canvas) app.canvas.setDirty(true, true);
    },

    updateDisplayMode(mode) {
        if (mode === "disabled") {
            this.hide();
            return;
        }
        this.isPermanent = mode === "permanent";
        if (this.isPermanent) {
            this.show();
        } else {
            const selectedNodes = this.getSelectedNodes();
            selectedNodes.length >= 2 ? this.show() : this.hide();
        }
    },

    cleanup() {
        if (this.resizeObserver) this.resizeObserver.disconnect();
        document.removeEventListener('mousemove', this.onDragging.bind(this));
        document.removeEventListener('mouseup', this.onDragEnd.bind(this));
        document.removeEventListener('selectstart', e => this.dragState.isDragging && e.preventDefault());
        if (this.toolbarContainer) this.toolbarContainer.remove();
        this.isInitialized = false;
    }
};

function initializeKayNodeAlignment() {
    const displayMode = app.ui.settings.getSettingValue("KayTool.NodeAlignDisplayMode") || "permanent";
    if (displayMode === "disabled") {
        return;
    }

    const canvas = document.querySelector('canvas#graph-canvas');
    if (canvas) {
        KayNodeAlignmentManager.init();
        canvas.addEventListener('click', () => {
            const currentMode = app.ui.settings.getSettingValue("KayTool.NodeAlignDisplayMode") || "permanent";
            if (currentMode !== "disabled") {
                KayNodeAlignmentManager.updateDisplayMode(currentMode);
            } else {
                KayNodeAlignmentManager.hide();
            }
        });
    } else {
        setTimeout(initializeKayNodeAlignment, 1000);
    }
}

app.registerExtension({
    name: "KayTool.NodeAlign",
    init() {
        initializeKayNodeAlignment();
    }
});