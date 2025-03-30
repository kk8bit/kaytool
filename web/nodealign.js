import { app } from "../../../scripts/app.js";

// SVG 定义（已包含你的现有 SVG，新增参考代码中的两个）
const kayAlignBottomSvg = `<svg t="1725534360155" class="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1662" width="100%"><path d="M1170.285714 987.428571a36.571429 36.571429 0 0 0-36.571428-36.571428H36.571429a36.571429 36.571429 0 0 0 0 73.142857h1097.142857a36.571429 36.571429 0 0 0 36.571428-36.571429z m-219.428571-146.285714v-512a36.571429 36.571429 0 0 0-36.571429-36.571428h-219.428571a36.571429 36.571429 0 0 0-36.571429 36.571428v512a36.571429 36.571429 0 0 0 36.571429 36.571429h219.428571a36.571429 36.571429 0 0 0 36.571429-36.571429z m-438.857143 0V36.571429a36.571429 36.571429 0 0 0-36.571429-36.571429h-219.428571a36.571429 36.571429 0 0 0-36.571429 36.571429v804.571428a36.571429 36.571429 0 0 0 36.571429 36.571429h219.428571a36.571429 36.571429 0 0 0 36.571429-36.571429z" fill="#666666" p-id="1663"></path></svg>`;
const kayAlignCenterHorizontallySvg = `<svg t="1725534379860" class="icon" viewBox="0 0 1243 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2250" width="100%"><path d="M548.571429 472.356571h146.285714V231.643429a36.571429 36.571429 0 0 1 36.571428-36.571429h219.428572a36.571429 36.571429 0 0 1 36.571428 36.571429v240.713142h179.785143a39.643429 39.643429 0 0 1 0 79.286858H987.428571v240.713142a36.571429 36.571429 0 0 1-36.571428 36.571429h-219.428572a36.571429 36.571429 0 0 1-36.571428-36.571429V551.64571h-146.285714V950.857143a36.571429 36.571429 0 0 1-36.571429 36.571428H292.571429a36.571429 36.571429 0 0 1-36.571429-36.571428V551.643429H76.214857a39.643429 39.643429 0 1 1 0-79.286858H256V73.142857A36.571429 36.571429 0 0 1 292.571429 36.571429h219.428571a36.571429 36.571429 0 0 1 36.571429 36.571428v399.213714z" fill="#666666" p-id="2251"></path></svg>`;
const kayAlignCenterVerticallySvg = `<svg t="1725534363707" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1809" width="100%"><path d="M477.312 576V448H266.688a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32h210.624V34.688a34.688 34.688 0 0 1 69.376 0V192h210.624a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32H546.688v128H896a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32H546.688v157.312a34.688 34.688 0 0 1-69.376 0V832H128a32 32 0 0 1-32-32v-192A32 32 0 0 1 128 576h349.312z" fill="#666666" p-id="1810"></path></svg>`;
const kayAlignLeftSvg = `<svg t="1725534370541" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2103" width="100%"><path d="M96 0a32 32 0 0 1 32 32v960a32 32 0 0 1-64 0V32A32 32 0 0 1 96 0z m128 192h448a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32h-448a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32z m0 384h704a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32h-704a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32z" fill="#666666" p-id="2104"></path></svg>`;
const kayAlignRightSvg = `<svg t="1725534384109" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2397" width="100%"><path d="M928 0a32 32 0 0 1 32 32v960a32 32 0 0 1-64 0V32a32 32 0 0 1 32-32z m-576 192h448a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32h-448a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32z m-256 384h704a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32v-192A32 32 0 0 1 96 576z" fill="#666666" p-id="2398"></path></svg>`;
const kayAlignTopSvg = `<svg t="1725534367556" class="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1956" width="100%"><path d="M1170.285714 36.571429a36.571429 36.571429 0 0 1-36.571428 36.571428H36.571429a36.571429 36.571429 0 0 1 0-73.142857h1097.142857a36.571429 36.571429 0 0 1 36.571428 36.571429z m-219.428571 146.285714v512a36.571429 36.571429 0 0 1-36.571429 36.571428h-219.428571a36.571429 36.571429 0 0 1-36.571429-36.571428v-512a36.571429 36.571429 0 0 1 36.571429-36.571429h219.428571a36.571429 36.571429 0 0 1 36.571429 36.571429z m-438.857143 0v804.571428a36.571429 36.571429 0 0 1-36.571429 36.571429h-219.428571a36.571429 36.571429 0 0 1-36.571429-36.571429v-804.571428a36.571429 36.571429 0 0 1 36.571429-36.571429h219.428571a36.571429 36.571429 0 0 1 36.571429 36.571429z" fill="#666666" p-id="1957"></path></svg>`;
const kayEqualWidthSvg = `<svg t="1725606034670" class="icon" viewBox="0 0 1088 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7213" width="100%"><path d="M978.24 480a42.688 42.688 0 0 1-42.688 42.688H172.928a42.688 42.688 0 0 1-42.688-42.688V213.312c0-23.552 19.072-42.624 42.688-42.624h762.624c23.552 0 42.688 19.072 42.688 42.624V480z" fill="#666666" p-id="7214"></path><path d="M256.96 734.144c0-14.08 11.456-25.6 25.6-25.6h543.36a25.6 25.6 0 0 1 0 51.2h-543.36a25.6 25.6 0 0 1-25.6-25.6z" fill="#666666" p-id="7215"></path><path d="M136.64 745.216a12.8 12.8 0 0 1 0-22.144l184.192-106.368a12.8 12.8 0 0 1 19.2 11.072v212.736a12.8 12.8 0 0 1-19.2 11.072l-184.192-106.368zM971.84 745.216a12.8 12.8 0 0 0 0-22.144l-184.256-106.368a12.8 12.8 0 0 0-19.2 11.072v212.736a12.8 12.8 0 0 0 19.2 11.072l184.256-106.368z" fill="#666666" p-id="7216"></path></svg>`;
const kayEqualHeightSvg = `<svg t="1725606224564" class="icon" viewBox="0 0 1088 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7790" width="100%"><path d="M572.16 936a42.688 42.688 0 0 1-42.688-42.688V130.688c0-23.616 19.136-42.688 42.688-42.688h266.688c23.552 0 42.624 19.072 42.624 42.688v762.624a42.688 42.688 0 0 1-42.624 42.688H572.16z" fill="#666666" p-id="7791"></path><path d="M318.016 214.72c14.08 0 25.6 11.456 25.6 25.6v543.36a25.6 25.6 0 1 1-51.2 0v-543.36c0-14.144 11.456-25.6 25.6-25.6z" fill="#666666" p-id="7792"></path><path d="M306.944 94.4a12.8 12.8 0 0 1 22.144 0l106.368 184.192a12.8 12.8 0 0 1-11.072 19.2H211.648a12.8 12.8 0 0 1-11.072-19.2l106.368-184.192zM306.944 929.6a12.8 12.8 0 0 0 22.144 0l106.368-184.192a12.8 12.8 0 0 0-11.072-19.2H211.648a12.8 12.8 0 0 0-11.072 19.2l106.368 184.192z" fill="#666666" p-id="7793"></path></svg>`;
const kayHorizontalDistributionSvg = `<svg t="1725534354023" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1515" width="100%"><path d="M96 0a32 32 0 0 1 32 32v960a32 32 0 0 1-64 0V32A32 32 0 0 1 96 0z m832 0a32 32 0 0 1 32 32v960a32 32 0 0 1-64 0V32a32 32 0 0 1 32-32zM384 800v-576a32 32 0 0 1 32-32h192a32 32 0 0 1 32 32v576a32 32 0 0 1-32 32h-192a32 32 0 0 1-32-32z" fill="#666666" p-id="1516"></path></svg>`;
const kayVerticalDistributionSvg = `<svg t="1725534350231" class="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1368" width="100%"><path d="M1170.285714 36.571429a36.571429 36.571429 0 0 1-36.571428 36.571428H36.571429a36.571429 36.571429 0 0 1 0-73.142857h1097.142857a36.571429 36.571429 0 0 1 36.571428 36.571429z m0 950.857142a36.571429 36.571429 0 0 1-36.571428 36.571429H36.571429a36.571429 36.571429 0 0 1 0-73.142857h1097.142857a36.571429 36.571429 0 0 1 36.571428 36.571428zM256 365.714286h658.285714a36.571429 36.571429 0 0 1 36.571429 36.571428v219.428572a36.571429 36.571429 0 0 1-36.571429 36.571428h-658.285714a36.571429 36.571429 0 0 1-36.571429-36.571428v-219.428572a36.571429 36.571429 0 0 1 36.571429-36.571428z" fill="#666666" p-id="1369"></path></svg>`;

let stylesInjected = false;

const KayNodeAlignmentManager = {
    isInitialized: false,
    toolbarContainer: null,
    dragState: { isDragging: false, offsetX: 0, offsetY: 0 },
    hasShownTooltip: false,
    isVisible: true,
    position: { leftPercentage: 50, topPercentage: 5, isAttached: false, insertIndex: 0 },
    menuElement: null,
    insertionIndicator: null,

    async init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        await this.waitForElements();
        this.injectStyles();
        this.loadPosition();
        this.setupToolbar();
        this.restorePosition();
        this.bindCanvasEvents();

        const displayMode = app.ui.settings.getSettingValue("KayTool.NodeAlignDisplayMode") || "permanent";
        this.updateDisplayMode(displayMode);
    },

    waitForElements() {
        return new Promise(resolve => {
            const checkElements = () => {
                this.canvas = document.querySelector('#graph-canvas');
                this.menuElement = document.querySelector('.comfyui-menu');
                if (this.canvas && this.menuElement) {
                    resolve();
                } else {
                    requestAnimationFrame(checkElements);
                }
            };
            requestAnimationFrame(checkElements);
        });
    },

    injectStyles() {
        if (stylesInjected) return;
        const bgColor = app.ui.settings.getSettingValue("KayTool.NodeAlignBackgroundColor");
        const iconColor = app.ui.settings.getSettingValue("KayTool.NodeAlignIconColor");
        const dividerColor = app.ui.settings.getSettingValue("KayTool.NodeAlignDividerColor");
        document.head.insertAdjacentHTML('beforeend', `<style>
            #kay-node-alignment-toolbar {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 4px;
                border-radius: 4px;
                z-index: 10000;
                height: 32px;
                white-space: nowrap;
                user-select: none;
                pointer-events: auto;
            }
            #kay-node-alignment-toolbar.floating { position: fixed; }
            #kay-node-alignment-toolbar.attached { position: relative; margin-left: 10px; }
            .kay-align-button {
                width: 25px;
                height: 25px;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #${app.ui.settings.getSettingValue("KayTool.NodeAlignIconBackgroundColor")};
                border: none;
                cursor: pointer;
                padding: 0;
                border-radius: 4px;
                transition: background-color 0.3s ease-in-out;
                flex-shrink: 0;
                position: relative;
                overflow: hidden;
            }
            .kay-align-button svg {
                width: 66%;
                height: 66%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                transition: transform 0.1s ease;
            }
            .kay-toolbar-divider {
                width: 3.2px;
                height: 15px;
                background: #${dividerColor};
                border-radius: 9px;
                cursor: grab;
                flex-shrink: 0;
            }
            .kay-toolbar-divider:active { cursor: grabbing; }
            #kay-align-tooltip {
                position: absolute;
                bottom: -20px;
                right: 0;
                background: #333;
                color: #fff;
                padding: 5px 10px;
                border-radius: 6px;
                display: none;
                z-index: 10001;
                white-space: nowrap;
                font-size: 12px;
            }
            #kay-insertion-indicator {
                position: absolute;
                width: 5px;
                height: 100%;
                background-color: #d0ff00;
                z-index: 10001;
                pointer-events: none;
                transition: left 0.1s ease;
                top: 0;
            }
            .comfyui-menu {
                position: relative;
                display: flex;
                align-items: center;
                transition: background-color 0.5s ease;
            }
        </style>`);
        stylesInjected = true;
    },

    loadPosition() {
        const savedPosition = JSON.parse(localStorage.getItem('KayNodeAlignToolbarPosition')) || {};
        this.position = {
            leftPercentage: savedPosition.leftPercentage || 50,
            topPercentage: savedPosition.topPercentage || 5,
            isAttached: savedPosition.isAttached || false,
            insertIndex: savedPosition.insertIndex || 0
        };
    },

    setupToolbar() {
        const bgColor = app.ui.settings.getSettingValue("KayTool.NodeAlignBackgroundColor");
        const opacity = app.ui.settings.getSettingValue("KayTool.NodeAlignBackgroundOpacity") / 100;
        const iconColor = app.ui.settings.getSettingValue("KayTool.NodeAlignIconColor");

        this.toolbarContainer = document.createElement('div');
        this.toolbarContainer.id = 'kay-node-alignment-toolbar';
        this.toolbarContainer.classList.add(this.position.isAttached ? 'attached' : 'floating');
        if (opacity > 0 && /^[0-9A-Fa-f]{6}$/.test(bgColor)) {
            this.toolbarContainer.style.background = `rgba(${parseInt(bgColor.substr(0, 2), 16)}, ${parseInt(bgColor.substr(2, 2), 16)}, ${parseInt(bgColor.substr(4, 2), 16)}, ${opacity})`;
        }

        if (this.position.isAttached) {
            const menuChildren = Array.from(this.menuElement.children).filter(child => child !== this.insertionIndicator);
            const insertIndex = Math.min(this.position.insertIndex, menuChildren.length);
            const insertBeforeElement = menuChildren[insertIndex] || null;
            this.menuElement.insertBefore(this.toolbarContainer, insertBeforeElement);
        } else {
            document.body.appendChild(this.toolbarContainer);
        }

        this.insertionIndicator = document.createElement('div');
        this.insertionIndicator.id = 'kay-insertion-indicator';
        this.insertionIndicator.style.display = 'none';
        this.menuElement.appendChild(this.insertionIndicator);

        this.getAlignmentButtons().forEach(btn => {
            const el = document.createElement(btn.type === 'divider' ? 'div' : 'button');
            el.className = btn.type === 'divider' ? 'kay-toolbar-divider' : 'kay-align-button';
            if (btn.type !== 'divider') {
                el.id = btn.id;
                el.innerHTML = btn.svg.replace(/fill="#666666"/g, `fill="#${iconColor}"`);
                el.addEventListener('click', e => btn.action.call(this, e));
                el.addEventListener('mouseover', () => {
                    const baseColor = app.ui.settings.getSettingValue("KayTool.NodeAlignIconBackgroundColor");
                    el.style.backgroundColor = this.adjustColor(baseColor, 65);
                });
                el.addEventListener('mouseout', () => {
                    const baseColor = app.ui.settings.getSettingValue("KayTool.NodeAlignIconBackgroundColor");
                    el.style.backgroundColor = `#${baseColor}`;
                });
                el.addEventListener('mousedown', () => el.style.transform = 'scale(0.95)');
                el.addEventListener('mouseup', () => el.style.transform = '');
                el.addEventListener('mouseleave', () => el.style.transform = '');
            } else {
                el.addEventListener('mousedown', e => this.onDragStart(e));
            }
            this.toolbarContainer.appendChild(el);
        });

        document.addEventListener('mousemove', this.onDragging.bind(this));
        document.addEventListener('mouseup', this.onDragEnd.bind(this));
        document.addEventListener('selectstart', e => this.dragState.isDragging && e.preventDefault());

        this.addTooltip();
    },

    adjustColor(hex, amount) {
        let color = hex.replace("#", "");
        if (color.length === 3) color = color.split('').map(c => c + c).join('');
        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);
        const b = parseInt(color.substr(4, 2), 16);
        const brightness = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        const adjust = brightness > 127 ? -amount : amount;
        return `#${[r, g, b].map(c => Math.max(0, Math.min(255, c + adjust)).toString(16).padStart(2, '0')).join('')}`;
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
            { id: 'kay-equal-height', svg: kayEqualHeightSvg, action: this.equalHeight },
            { type: 'divider' }, 
            { id: 'kay-horizontal-distribution', svg: kayHorizontalDistributionSvg, action: this.horizontalDistribution },
            { id: 'kay-vertical-distribution', svg: kayVerticalDistributionSvg, action: this.verticalDistribution }
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
        if (this.toolbarContainer) {
            this.toolbarContainer.style.display = 'flex';
            if (!this.position.isAttached) this.updatePosition();
        }
    },

    hide() {
        this.isVisible = false;
        if (this.toolbarContainer) {
            this.toolbarContainer.style.display = 'none';
        }
    },

    updatePosition() {
        if (!this.toolbarContainer || !this.isVisible || this.position.isAttached) return;
        const { windowRect, toolbarRect } = this.getRect();
        let left = (this.position.leftPercentage / 100) * windowRect.width - toolbarRect.width / 2;
        let top = (this.position.topPercentage / 100) * windowRect.height;
        left = Math.max(0, Math.min(left, windowRect.width - toolbarRect.width));
        top = Math.max(0, Math.min(top, windowRect.height - toolbarRect.height));
        this.toolbarContainer.style.left = `${left}px`;
        this.toolbarContainer.style.top = `${top}px`;
    },

    getRect() {
        return {
            windowRect: { width: window.innerWidth, height: window.innerHeight },
            toolbarRect: this.toolbarContainer.getBoundingClientRect(),
            menuRect: this.menuElement.getBoundingClientRect()
        };
    },

    onDragStart(e) {
        e.preventDefault();
        const { toolbarRect } = this.getRect();
        this.dragState = {
            isDragging: true,
            offsetX: e.clientX - toolbarRect.left,
            offsetY: e.clientY - toolbarRect.top
        };
    },

    onDragging(e) {
        if (!this.dragState.isDragging) return;

        const { windowRect, toolbarRect, menuRect } = this.getRect();

        if (this.position.isAttached) {
            this.detachFromMenu(true);
            this.menuElement.style.backgroundColor = '#d0ff00';
        }

        let left = e.clientX - this.dragState.offsetX;
        let top = e.clientY - this.dragState.offsetY;
        left = Math.max(0, Math.min(left, windowRect.width - toolbarRect.width));
        top = Math.max(0, Math.min(top, windowRect.height - toolbarRect.height));
        this.toolbarContainer.style.left = `${left}px`;
        this.toolbarContainer.style.top = `${top}px`;

        const toolbarBottom = toolbarRect.top + toolbarRect.height;
        if (toolbarBottom > menuRect.top && toolbarRect.top < menuRect.bottom) {
            this.menuElement.style.backgroundColor = '#000000';
            this.insertionIndicator.style.display = 'block';
            const menuChildren = Array.from(this.menuElement.children).filter(child => child !== this.insertionIndicator && child !== this.toolbarContainer);
            const toolbarCenterX = toolbarRect.left + toolbarRect.width / 2;
            let indicatorLeft = 0;
            for (let i = 0; i < menuChildren.length; i++) {
                const childRect = menuChildren[i].getBoundingClientRect();
                if (toolbarCenterX < childRect.left + childRect.width / 2) {
                    indicatorLeft = childRect.left - menuRect.left;
                    break;
                }
                indicatorLeft = menuChildren[menuChildren.length - 1]?.getBoundingClientRect().right - menuRect.left || 0;
            }
            this.insertionIndicator.style.left = `${Math.max(0, Math.min(indicatorLeft, menuRect.width - this.insertionIndicator.offsetWidth))}px`;
        } else {
            this.menuElement.style.backgroundColor = '#d0ff00';
            this.insertionIndicator.style.display = 'none';
        }
    },

    onDragEnd() {
        if (!this.dragState.isDragging) return;

        this.dragState.isDragging = false;
        this.dragState.offsetX = 0;
        this.dragState.offsetY = 0;

        const { windowRect, toolbarRect, menuRect } = this.getRect();
        if (toolbarRect.top + toolbarRect.height > menuRect.top && toolbarRect.top < menuRect.bottom) {
            const menuChildren = Array.from(this.menuElement.children).filter(child => child !== this.insertionIndicator && child !== this.toolbarContainer);
            const toolbarCenterX = toolbarRect.left + toolbarRect.width / 2;
            let insertIndex = 0;
            for (let i = 0; i < menuChildren.length; i++) {
                const childRect = menuChildren[i].getBoundingClientRect();
                if (toolbarCenterX < childRect.left + childRect.width / 2) {
                    insertIndex = i;
                    break;
                }
                insertIndex = i + 1;
            }
            this.attachToMenu(menuChildren[insertIndex]);
            this.position.isAttached = true;
            this.position.insertIndex = insertIndex;
        } else {
            this.position.leftPercentage = ((toolbarRect.left + toolbarRect.width / 2) / windowRect.width) * 100;
            this.position.topPercentage = (toolbarRect.top / windowRect.height) * 100;
            this.position.isAttached = false;
            this.position.insertIndex = 0;
        }

        localStorage.setItem('KayNodeAlignToolbarPosition', JSON.stringify(this.position));
        this.menuElement.style.backgroundColor = '';
        this.insertionIndicator.style.display = 'none';
    },

    attachToMenu(insertBeforeElement) {
        this.position.isAttached = true;
        this.toolbarContainer.classList.remove('floating');
        this.toolbarContainer.classList.add('attached');
        this.toolbarContainer.style.left = '';
        this.toolbarContainer.style.top = '';
        this.menuElement.insertBefore(this.toolbarContainer, insertBeforeElement || null);
    },

    detachFromMenu(isDragging) {
        if (!isDragging) return;
        this.position.isAttached = false;
        this.toolbarContainer.classList.remove('attached');
        this.toolbarContainer.classList.add('floating');
        document.body.appendChild(this.toolbarContainer);
        this.updatePosition();
    },

    restorePosition() {
        if (!this.position.isAttached || !this.menuElement || !this.toolbarContainer) {
            this.position.isAttached = false;
            this.updatePosition();
            return;
        }
        const menuChildren = Array.from(this.menuElement.children).filter(child => child !== this.insertionIndicator && child !== this.toolbarContainer);
        const insertIndex = Math.min(this.position.insertIndex, menuChildren.length);
        this.attachToMenu(menuChildren[insertIndex]);
    },

    getSelectedNodes() {
        const nodes = Object.values(app.canvas.selected_nodes || {});
        return nodes;
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
        if (nodes.length) nodes.forEach(n => n.size[0] = nodes[0].size[0]);
        this.redraw();
    },

    equalHeight() {
        const nodes = this.getSelectedNodes();
        if (nodes.length) nodes.forEach(n => n.size[1] = nodes[0].size[1]);
        this.redraw();
    },

    horizontalDistribution() {
        const nodes = this.getSelectedNodes();
        const axis = 0;
        if (nodes.length > 1) {
            nodes.sort((a, b) => a.pos[axis] - b.pos[axis]);
            const min = Math.min(...nodes.map(node => node.pos[axis]));
            const max = Math.max(...nodes.map(node => node.pos[axis] + node.size[axis]));
            const totalSize = nodes.reduce((sum, node) => sum + node.size[axis], 0);
            const spacing = (max - min - totalSize) / (nodes.length - 1);
            let current = min;
            nodes.forEach(node => {
                node.pos[axis] = current;
                current += node.size[axis] + spacing;
            });
            this.redraw();
        }
    },

    verticalDistribution() {
        const nodes = this.getSelectedNodes();
        if (nodes.length > 1) {
            const axis = 1;
            const otherAxis = 0;
            const tolerance = 100;
            const minSpacing = 20;

            const columns = [];
            nodes.forEach(node => {
                let foundColumn = null;
                for (let column of columns) {
                    const columnX = column[0].pos[otherAxis];
                    if (Math.abs(columnX - node.pos[otherAxis]) <= tolerance) {
                        foundColumn = column;
                        break;
                    }
                }
                if (foundColumn) {
                    foundColumn.push(node);
                } else {
                    columns.push([node]);
                }
            });

            const columnHeights = columns.map(column => {
                const minY = Math.min(...column.map(node => node.pos[axis]));
                const maxY = Math.max(...column.map(node => node.pos[axis] + node.size[axis]));
                return maxY - minY;
            });
            const maxColumnHeight = Math.max(...columnHeights);

            columns.forEach(column => {
                if (column.length > 1) {
                    column.sort((a, b) => a.pos[axis] - b.pos[axis]);
                    const minY = Math.min(...column.map(node => node.pos[axis]));
                    const totalSize = column.reduce((sum, node) => sum + node.size[axis], 0);
                    let spacing = (maxColumnHeight - totalSize) / (column.length - 1);
                    spacing = Math.max(spacing, minSpacing);
                    let currentY = column[0].pos[axis];
                    column.forEach((node, idx) => {
                        if (idx === 0) {
                            currentY += node.size[axis] + spacing;
                        } else {
                            node.pos[axis] = currentY;
                            currentY += node.size[axis] + spacing;
                        }
                        node.pos[otherAxis] = column[0].pos[otherAxis];
                    });
                }
            });
            this.redraw();
        }
    },

    redraw() {
        if (app.canvas) app.canvas.setDirty(true, true);
    },

    updateDisplayMode(mode) {
        const effectiveMode = mode || "permanent";
        if (effectiveMode === "disabled") {
            this.hide();
        } else if (effectiveMode === "permanent") {
            this.show();
        } else if (effectiveMode === "on-select") {
            const selectedNodes = this.getSelectedNodes();
            if (selectedNodes.length >= 2) this.show();
            else this.hide();
        }
    },

    bindCanvasEvents() {
        if (!this.canvas) return;
        this.canvas.addEventListener('click', () => {
            const currentMode = app.ui.settings.getSettingValue("KayTool.NodeAlignDisplayMode") || "permanent";
            this.updateDisplayMode(currentMode);
        });
    }
};

function initializeKayNodeAlignment() {
    if (!KayNodeAlignmentManager.isInitialized) {
        KayNodeAlignmentManager.init();
    } else {
        const displayMode = app.ui.settings.getSettingValue("KayTool.NodeAlignDisplayMode") || "permanent";
        KayNodeAlignmentManager.updateDisplayMode(displayMode);
    }
}

app.registerExtension({
    name: "KayTool.NodeAlign",
    init() {
        initializeKayNodeAlignment();
        window.KayNodeAlignmentManager = KayNodeAlignmentManager;
        window.initializeKayNodeAlignment = initializeKayNodeAlignment;
    }
});