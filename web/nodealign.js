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
    dragState: { isDragging: false, offsetX: 0, offsetY: 0 },
    hasShownTooltip: false,
    isVisible: true,
    isPermanent: true,
    position: { leftPercentage: 50, topPercentage: 5, isAttached: false, insertIndex: 0 },
    menuElement: null,
    insertionIndicator: null,

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        try {
            this.canvas = document.querySelector('#graph-canvas');
            if (!this.canvas || !app.menu) {
                console.log("Canvas or app.menu not ready, retrying...");
                setTimeout(() => this.init(), 100);
                return;
            }

            this.loadPosition();
            this.waitForMenuElement(() => {
                this.setupToolbar();
                requestAnimationFrame(() => this.restorePosition());
                const displayMode = app.ui.settings.getSettingValue("KayTool.NodeAlignDisplayMode") || "permanent";
                this.updateDisplayMode(displayMode);
                this.bindCanvasEvents();  
            });
        } catch (error) {
            console.error("Error in KayNodeAlignmentManager.init:", error);
        }
    },

    loadPosition() {
        try {
            const savedPosition = JSON.parse(localStorage.getItem('KayNodeAlignToolbarPosition'));
            if (savedPosition && typeof savedPosition.leftPercentage === 'number' && typeof savedPosition.topPercentage === 'number') {
                this.position = {
                    leftPercentage: savedPosition.leftPercentage,
                    topPercentage: savedPosition.topPercentage,
                    isAttached: savedPosition.isAttached || false,
                    insertIndex: savedPosition.insertIndex || 0
                };
            } else {
                this.setDefaultPosition();
            }
        } catch (error) {
            console.error("Error loading position:", error);
            this.setDefaultPosition();
        }
    },

    waitForMenuElement(callback) {
        try {
            this.menuElement = document.querySelector('.comfyui-menu');
            if (this.menuElement) {
                callback();
            } else {
                const observer = new MutationObserver(() => {
                    this.menuElement = document.querySelector('.comfyui-menu');
                    if (this.menuElement) {
                        observer.disconnect();
                        callback();
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            }
        } catch (error) {
            console.error("Error in waitForMenuElement:", error);
        }
    },

    setupToolbar() {
        try {
            const bgColor = app.ui.settings.getSettingValue("KayTool.NodeAlignBackgroundColor");
            const opacity = app.ui.settings.getSettingValue("KayTool.NodeAlignBackgroundOpacity") / 100;
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
                #kay-node-alignment-toolbar.floating {
                    position: fixed;
                }
                #kay-node-alignment-toolbar.attached {
                    position: relative;
                    margin-left: 10px;
                }
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
                    transition: background-color 0.3s ease-in-out, transform 0.1s ease;
                    flex-shrink: 0;
                }
                .kay-align-button svg {
                    width: 70%;
                    height: 70%;
                }
                .kay-toolbar-divider {
                    width: 3.2px;
                    height: 15px;
                    background: #${dividerColor};
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

            this.toolbarContainer = document.createElement('div');
            this.toolbarContainer.id = 'kay-node-alignment-toolbar';
            this.toolbarContainer.classList.add(this.position.isAttached ? 'attached' : 'floating');

            if (opacity > 0 && /^[0-9A-Fa-f]{6}$/.test(bgColor)) {
                this.toolbarContainer.style.background = `rgba(${parseInt(bgColor.substr(0, 2), 16)}, ${parseInt(bgColor.substr(2, 2), 16)}, ${parseInt(bgColor.substr(4, 2), 16)}, ${opacity})`;
            } else {
                this.toolbarContainer.style.background = '';
            }

            if (this.position.isAttached) {
                const menuChildren = Array.from(this.menuElement.children).filter(child => child !== this.insertionIndicator);
                const insertIndex = Math.min(this.position.insertIndex, menuChildren.length);
                const insertBeforeElement = menuChildren[insertIndex] || null;
                if (insertBeforeElement) {
                    this.menuElement.insertBefore(this.toolbarContainer, insertBeforeElement);
                } else {
                    this.menuElement.appendChild(this.toolbarContainer);
                }
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
        } catch (error) {
            console.error("Error in setupToolbar:", error);
        }
    },

    adjustColor(hex, amount) {
        try {
            let color = hex.replace("#", "");
            if (color.length === 3) color = color.split('').map(c => c + c).join('');
            const r = parseInt(color.substr(0, 2), 16);
            const g = parseInt(color.substr(2, 2), 16);
            const b = parseInt(color.substr(4, 2), 16);
            const brightness = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
            const adjust = brightness > 127 ? -amount : amount;
            return `#${[r, g, b].map(c => Math.max(0, Math.min(255, c + adjust)).toString(16).padStart(2, '0')).join('')}`;
        } catch (error) {
            console.error("Error in adjustColor:", error);
            return `#${hex}`;
        }
    },

    getWindowRect() {
        return { width: window.innerWidth, height: window.innerHeight };
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
        try {
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
        } catch (error) {
            console.error("Error in addTooltip:", error);
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
        const windowRect = this.getWindowRect();
        const toolbarRect = this.toolbarContainer.getBoundingClientRect();
        let left = (this.position.leftPercentage / 100) * windowRect.width - toolbarRect.width / 2;
        let top = (this.position.topPercentage / 100) * windowRect.height;
        left = Math.max(0, Math.min(left, windowRect.width - toolbarRect.width));
        top = Math.max(0, Math.min(top, windowRect.height - toolbarRect.height));
        this.toolbarContainer.style.left = `${left}px`;
        this.toolbarContainer.style.top = `${top}px`;
    },

    onDragStart(e) {
        if (this.dragState.isDragging) return;
        const rect = this.toolbarContainer.getBoundingClientRect();
        this.dragState = {
            isDragging: false,
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top
        };
    },

    onDragging(e) {
        if (!this.dragState.offsetX && !this.dragState.offsetY) return;

        if (!this.dragState.isDragging) {
            this.dragState.isDragging = true;
            if (this.position.isAttached) {
                this.detachFromMenu(true);
            }
            if (this.menuElement) this.menuElement.style.backgroundColor = '#d0ff00';
        }

        const windowRect = this.getWindowRect();
        const toolbarRect = this.toolbarContainer.getBoundingClientRect();
        let left = e.clientX - this.dragState.offsetX;
        let top = e.clientY - this.dragState.offsetY;

        left = Math.max(0, Math.min(left, windowRect.width - toolbarRect.width));
        top = Math.max(0, Math.min(top, windowRect.height - toolbarRect.height));

        this.toolbarContainer.style.left = `${left}px`;
        this.toolbarContainer.style.top = `${top}px`;

        if (this.menuElement) {
            const menuRect = this.menuElement.getBoundingClientRect();
            const attachThreshold = 0;
            const toolbarBottom = toolbarRect.top + toolbarRect.height;

            if (toolbarBottom > menuRect.top - attachThreshold && toolbarRect.top < menuRect.bottom + attachThreshold) {
                this.menuElement.style.backgroundColor = '#000000';
                this.insertionIndicator.style.display = 'block';
                const menuChildren = Array.from(this.menuElement.children).filter(child => child !== this.insertionIndicator && child !== this.toolbarContainer);
                const toolbarCenterX = toolbarRect.left + toolbarRect.width / 2;

                for (let i = 0; i < menuChildren.length; i++) {
                    const childRect = menuChildren[i].getBoundingClientRect();
                    if (toolbarCenterX < childRect.left + childRect.width / 2) {
                        let indicatorLeft = childRect.left - menuRect.left;
                        indicatorLeft = Math.max(0, Math.min(indicatorLeft, menuRect.width - this.insertionIndicator.offsetWidth));
                        this.insertionIndicator.style.left = `${indicatorLeft}px`;
                        break;
                    }
                }

                if (toolbarCenterX > (menuChildren[menuChildren.length - 1]?.getBoundingClientRect().right || 0)) {
                    const lastChildRect = menuChildren[menuChildren.length - 1].getBoundingClientRect();
                    let indicatorLeft = lastChildRect.right - menuRect.left;
                    indicatorLeft = Math.max(0, Math.min(indicatorLeft, menuRect.width - this.insertionIndicator.offsetWidth));
                    this.insertionIndicator.style.left = `${indicatorLeft}px`;
                }
            } else {
                this.menuElement.style.backgroundColor = '#d0ff00';
                this.insertionIndicator.style.display = 'none';
            }
        }
    },

    onDragEnd() {
        if (!this.dragState.isDragging) {
            this.dragState = { isDragging: false, offsetX: 0, offsetY: 0 };
            if (this.menuElement) this.menuElement.style.backgroundColor = '';
            if (this.insertionIndicator) this.insertionIndicator.style.display = 'none';
            return;
        }

        this.dragState.isDragging = false;
        this.dragState.offsetX = 0;
        this.dragState.offsetY = 0;

        const windowRect = this.getWindowRect();
        const toolbarRect = this.toolbarContainer.getBoundingClientRect();
        const menuRect = this.menuElement.getBoundingClientRect();

        const attachThreshold = 0;
        const toolbarBottom = toolbarRect.top + toolbarRect.height;
        if (toolbarBottom > menuRect.top - attachThreshold && toolbarRect.top < menuRect.bottom + attachThreshold) {
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
        if (this.menuElement) this.menuElement.style.backgroundColor = '';
        if (this.insertionIndicator) this.insertionIndicator.style.display = 'none';
    },

    attachToMenu(insertBeforeElement = null) {
        if (this.position.isAttached) return;
        this.position.isAttached = true;
        this.toolbarContainer.classList.remove('floating');
        this.toolbarContainer.classList.add('attached');
        this.toolbarContainer.style.left = '';
        this.toolbarContainer.style.top = '';
        if (insertBeforeElement) {
            this.menuElement.insertBefore(this.toolbarContainer, insertBeforeElement);
        } else {
            this.menuElement.appendChild(this.toolbarContainer);
        }
    },

    detachFromMenu(isDragging = false) {
        if (!this.position.isAttached || !isDragging) return;
        this.position.isAttached = false;
        this.toolbarContainer.classList.remove('attached');
        this.toolbarContainer.classList.add('floating');
        document.body.appendChild(this.toolbarContainer);
        this.updatePosition();
    },

    restorePosition() {
        if (this.position.isAttached && this.menuElement && this.toolbarContainer) {
            const menuChildren = Array.from(this.menuElement.children).filter(child => child !== this.insertionIndicator && child !== this.toolbarContainer);
            if (menuChildren.length === 0) {
                setTimeout(() => this.restorePosition(), 500);
                return;
            }
            const insertIndex = Math.min(this.position.insertIndex, menuChildren.length);
            const insertBeforeElement = menuChildren[insertIndex] || null;
            this.attachToMenu(insertBeforeElement);
        } else {
            this.position.isAttached = false;
            this.updatePosition();
        }
    },

    setDefaultPosition() {
        this.position = { leftPercentage: 50, topPercentage: 5, isAttached: false, insertIndex: 0 };
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
        try {
            const effectiveMode = mode || "permanent";
            this.isPermanent = effectiveMode === "permanent";

            if (effectiveMode === "disabled") {
                this.hide();
            } else if (effectiveMode === "permanent") {
                this.show();
            } else if (effectiveMode === "on-select") {
                const selectedNodes = this.getSelectedNodes();
                if (selectedNodes.length >= 2) {
                    this.show();
                } else {
                    this.hide();
                }
            }
        } catch (error) {
            console.error("Error in updateDisplayMode:", error);
        }
    },

    bindCanvasEvents() {
        if (!this.canvas) return;
        this.canvas.removeEventListener('click', this.handleCanvasClick);
        this.handleCanvasClick = () => {
            const currentMode = app.ui.settings.getSettingValue("KayTool.NodeAlignDisplayMode") || "permanent";
            this.updateDisplayMode(currentMode);
        };
        this.canvas.addEventListener('click', this.handleCanvasClick);
    },

    cleanup() {
        document.removeEventListener('mousemove', this.onDragging);
        document.removeEventListener('mouseup', this.onDragEnd);
        document.removeEventListener('selectstart', e => this.dragState.isDragging && e.preventDefault());
        if (this.canvas) this.canvas.removeEventListener('click', this.handleCanvasClick);
        if (this.toolbarContainer) this.toolbarContainer.remove();
        if (this.insertionIndicator) this.insertionIndicator.remove();
        this.isInitialized = false;
    }
};

function initializeKayNodeAlignment() {
    try {
        const displayMode = app.ui.settings.getSettingValue("KayTool.NodeAlignDisplayMode") || "permanent";
        if (displayMode === "disabled") return;

        const canvas = document.querySelector('canvas#graph-canvas');
        if (canvas) {
            KayNodeAlignmentManager.init();
        } else {
            console.log("Canvas not found, retrying in 1s...");
            setTimeout(initializeKayNodeAlignment, 1000);
        }
    } catch (error) {
        console.error("Error in initializeKayNodeAlignment:", error);
        throw error;
    }
}

app.registerExtension({
    name: "KayTool.NodeAlign",
    init() {
        try {
            initializeKayNodeAlignment();
            // 将全局引用暴露给 settings.js
            window.KayNodeAlignmentManager = KayNodeAlignmentManager;
            window.initializeKayNodeAlignment = initializeKayNodeAlignment;
        } catch (error) {
            console.error("Error in extension init:", error);
            throw error;
        }
    }
});