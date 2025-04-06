import { app } from "../../../scripts/app.js";
import { api } from "../../scripts/api.js"; 
class PromptExecution {
    constructor(id) {
        this.promptApi = null;
        this.executedNodeIds = [];
        this.totalNodes = 0;
        this.currentlyExecuting = null;
        this.errorDetails = null;
        this.id = id;
    }
    setPrompt(prompt) {
        this.promptApi = prompt.output;
        this.totalNodes = Object.keys(this.promptApi).length;
    }
    getApiNode(nodeId) {
        return this.promptApi?.[String(nodeId)] || null; 
    }
    getNodeLabel(nodeId) {
        const apiNode = this.getApiNode(nodeId);
        let label = apiNode?._meta?.title || apiNode?.class_type || undefined;
        if (!label) {
            const graphNode = window?.app?.graph?.getNodeById(Number(nodeId));
            label = graphNode?.title || graphNode?.type || undefined;
        }
        return label || "Unknown";
    }
    executing(nodeId, step, maxSteps) {
        if (nodeId == null) {
            this.currentlyExecuting = null;
            return;
        }
        if (this.currentlyExecuting?.nodeId !== nodeId) {
            if (this.currentlyExecuting != null && !this.executedNodeIds.includes(this.currentlyExecuting.nodeId)) {
                this.executedNodeIds.push(this.currentlyExecuting.nodeId);
            }
            this.currentlyExecuting = { nodeId, nodeLabel: this.getNodeLabel(nodeId), pass: 0 };
            const apiNode = this.getApiNode(nodeId);
            if (apiNode?.class_type === "UltimateSDUpscale") {
                this.currentlyExecuting.pass--;
                this.currentlyExecuting.maxPasses = -1;
            } else if (apiNode?.class_type === "IterativeImageUpscale") {
                this.currentlyExecuting.maxPasses = apiNode?.inputs["steps"] ?? -1;
            }
        }
        if (step != null && maxSteps != null) {
            if (!this.currentlyExecuting.step || step < this.currentlyExecuting.step) {
                this.currentlyExecuting.pass++;
            }
            this.currentlyExecuting.step = step;
            this.currentlyExecuting.maxSteps = maxSteps;
        }
    }
    error(details) {
        this.errorDetails = details;
    }
}

const KayResourceMonitor = {
    toolbar: null,
    chartCanvas: null,
    dataDisplay: null,
    menuButton: null,
    workflowProgressEl: null,

    dataHistory: { cpu: [], ram: [], gpu: [], gpuMem: [], gpuTemp: [] },
    displayHistory: { cpu: [], ram: [], gpu: [], gpuMem: [], gpuTemp: [] },
    current: { 
        cpu: 0, ram: 0, gpu: 0, gpuMem: 0, gpuTemp: 0,
        ramUsed: 0, ramTotal: 0, gpuMemUsed: 0, gpuMemTotal: 0
    },
    target: {
        cpu: 0, ram: 0, gpu: 0, gpuMem: 0, gpuTemp: 0,
        ramTotal: 0, ramUsed: 0, gpuMemTotal: 0, gpuMemUsed: 0,
        cpuName: "Unknown", gpuName: "Unknown"
    },
    workflowProgress: {
        percentage: 0,
        nodePercentage: 0,
        currentNodePercentage: 0,         startTime: null,
        totalDuration: null,
        currentNode: "Idle",
        currentNodeLabel: "Idle",         easeOutStartTime: null,
        isInterrupted: false,
        isProgressUnknown: false,         queueCount: 0,     },
    currentWorkflow: {
        percentage: 0,
    },
    promptsMap: new Map(),
    currentExecution: null,
    lastQueueRemaining: 0,

    cpuCores: 4,
    dragState: { isDragging: false, offsetX: 0, offsetY: 0 },
    resizeState: { isResizing: false, startX: 0, startY: 0, startWidth: 0, startHeight: 0 },
    position: { left: 0, top: 0 },
    size: { width: 250, height: 219 },
    lastUpdate: 0, lastCurveUpdate: 0, lastDisplayUpdate: 0,
    maxPoints: 6000,
    fetchInterval: 500,
    curveInterval: 0,
    displayInterval: 0,
    smoothFactor: 0.02,
    easeOutDuration: 500,
    minWidth: 150,
    minHeight: 90,
    maxHeight: 219,
    edgeThreshold: 10,
    resizeHandleSize: 10,

    colors: {
        cpu: 'rgba(253, 170, 4, 0.86)',
        ram: 'rgba(10, 124, 254, 0.86)',
        gpu: 'rgba(255, 38, 0, 0.86)',
        gpuMem: 'rgba(97, 208, 12, 0.86)',
        gpuTemp: 'rgba(167, 43, 255, 0.86)',
        header: 'rgba(128, 128, 128, 0.5)',
        workflow: 'rgba(208, 255, 0, 0.86)',
    },

    styles: {
        toolbar: `position: fixed; display: flex; flex-direction: column; color: rgba(186, 186, 186, 0.8); padding: 10px; border-radius: 5px; z-index: 10000; user-select: none; pointer-events: none; max-height: 219px;`, 
        header: `margin-bottom: 5px; font-weight: bold; font-size: 10px;`,
        headerText: `cursor: grab; pointer-events: auto; display: inline-block;`, 
        canvas: `margin-top: 5px; margin-bottom: 10px; width: 100%; height: 100px; pointer-events: none;`,
        display: `display: flex; flex-direction: column; font-size: 10px; flex-grow: 1; overflow: hidden; pointer-events: none;`,
        resizeHandle: `position: absolute; bottom: 0; right: 0; width: 8px; height: 8px; border-bottom: 1px solid; border-right: 1px solid; cursor: se-resize; pointer-events: auto;`, 
        dot: (color) => `display: inline-block; width: 3px; height: 3px; border-radius: 50%; background: ${color}; margin-right: 5px; flex-shrink: 0; transition: background 0.5s ease;`,
        bar: (width) => `display: inline-block; width: ${width}px; height: 3px; background: rgba(200, 200, 200, 0.3); margin-right: 5px; position: relative; flex-shrink: 0;`,
        fill: (color, percent) => `position: absolute; top: 0; left: 0; width: ${percent}%; height: 100%; background: ${color};`,
        row: `display: flex; align-items: center; height: 11px; line-height: 11px;  white-space: nowrap;`,
        text: `overflow: hidden; text-overflow: ellipsis; font-size: 10px;`
    },

    isVisible: true,
    animationFrameId: null,
    isEnabled: true,
    isInitialized: false,
    edgeFadeEnabled: true,

    easeOutQuad(t) {
        return t * (2 - t);
    },

    async init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        this.currentWorkflow.percentage = 0;
        this.workflowProgress.currentNodePercentage = 0;
        this.loadVisibility();
        this.startMonitoring();
        this.bindEvents();
        await this.loadSettings();
        this.setupUI();
        this.setupWorkflowListener();
    },

    async loadSettings() {
        this.isEnabled = app.ui.settings.getSettingValue("KayTool.EnableResourceMonitor");
        this.edgeFadeEnabled = app.ui.settings.getSettingValue("KayTool.ResourceMonitorEdgeFade");
    },

    loadVisibility() {
        const visible = localStorage.getItem('KayResourceMonitorVisible');
        this.isVisible = visible === null ? true : visible === 'true';
    },

    saveVisibility() {
        localStorage.setItem('KayResourceMonitorVisible', this.isVisible.toString());
    },

    setupUI() {
        this.toolbar = document.createElement('div');
        this.toolbar.id = 'kay-resource-monitor';
        const opacity = app.ui.settings.getSettingValue("KayTool.ResourceMonitorBackgroundOpacity") / 100;
        this.toolbar.style.cssText = `${this.styles.toolbar} width: ${this.size.width}px; height: ${this.size.height}px; left: ${this.position.left}px; top: ${this.position.top}px; display: ${this.isVisible && this.isEnabled ? 'flex' : 'none'}; background: rgba(0, 0, 0, ${opacity});`;

        const header = document.createElement('div');
        header.style.cssText = this.styles.header;
        const headerText = document.createElement('span');
        headerText.style.cssText = this.styles.headerText;
        headerText.textContent = "𝙆 Resource Monitor";
        header.appendChild(headerText);
        this.toolbar.appendChild(header);

        this.workflowProgressEl = document.createElement('div');
        this.workflowProgressEl.style.cssText = this.styles.row;
        this.updateWorkflowProgress();
        this.toolbar.appendChild(this.workflowProgressEl);

        this.chartCanvas = document.createElement('canvas');
        this.chartCanvas.style.cssText = this.styles.canvas;
        this.chartCanvas.width = this.size.width - 20;
        this.chartCanvas.height = 100;
        this.toolbar.appendChild(this.chartCanvas);

        this.dataDisplay = document.createElement('div');
        this.dataDisplay.style.cssText = this.styles.display;
        this.toolbar.appendChild(this.dataDisplay);

        this.resizeHandle = document.createElement('div');
        this.resizeHandle.style.cssText = `${this.styles.resizeHandle} border-color: ${this.colors.header};`;
        this.toolbar.appendChild(this.resizeHandle);

        document.body.appendChild(this.toolbar);
        this.loadPosition();
        this.loadSize();
        this.onResize();
        this.bindToolbarEvents();

        if (this.isEnabled && this.isVisible) {
            this.startAnimation();
        }
    },

    setupWorkflowListener() {
        const that = this;
        const queuePrompt = api.queuePrompt;
        api.queuePrompt = async function (num, prompt) {
            let response;
            try {
                response = await queuePrompt.apply(api, [...arguments]);
            } catch (e) {
                const promptExecution = that.getOrMakePrompt("error");
                promptExecution.error({ exception_type: "Unknown." });
                throw e;
            }
            const promptExecution = that.getOrMakePrompt(response.prompt_id);
            promptExecution.setPrompt(prompt);
            that.promptsMap.set(response.prompt_id, promptExecution);
            return response;
        };

        api.addEventListener("status", (e) => {
            if (!e.detail?.exec_info) return;
            this.lastQueueRemaining = e.detail.exec_info.queue_remaining;
            this.dispatchProgressUpdate();
        });

        api.addEventListener("execution_start", (e) => {
            const prompt = this.getOrMakePrompt(e.detail.prompt_id);
            this.currentExecution = prompt;
            this.workflowProgress.startTime = performance.now();
            this.workflowProgress.totalDuration = null;
            this.workflowProgress.percentage = 0;
            this.workflowProgress.nodePercentage = 0;
            this.workflowProgress.currentNodePercentage = 0;
            this.currentWorkflow.percentage = 0;
            this.workflowProgress.easeOutStartTime = null;
            this.workflowProgress.isInterrupted = false;
            this.workflowProgress.isProgressUnknown = false;
            this.dispatchProgressUpdate();
        });

        api.addEventListener("executing", (e) => {
            if (!this.currentExecution) {
                this.currentExecution = this.getOrMakePrompt("unknown");
            }
            this.currentExecution.executing(e.detail);
            if (e.detail == null && !this.workflowProgress.isInterrupted) {
                if (this.workflowProgress.startTime) {
                    this.workflowProgress.totalDuration = (performance.now() - this.workflowProgress.startTime) / 1000;
                }
                this.workflowProgress.easeOutStartTime = performance.now();
                this.currentExecution = null;
            }
            this.dispatchProgressUpdate();
        });

        api.addEventListener("progress", (e) => {
            if (!this.currentExecution) {
                this.currentExecution = this.getOrMakePrompt(e.detail.prompt_id);
            }
            this.currentExecution.executing(e.detail.node, e.detail.value, e.detail.max);
            this.dispatchProgressUpdate();
        });

        api.addEventListener("execution_cached", (e) => {
            if (!this.currentExecution) {
                this.currentExecution = this.getOrMakePrompt(e.detail.prompt_id);
            }
            for (const cached of e.detail.nodes) {
                if (!this.currentExecution.executedNodeIds.includes(cached)) {
                    this.currentExecution.executedNodeIds.push(cached);
                }
            }
            this.dispatchProgressUpdate();
        });

        api.addEventListener("execution_error", (e) => {
            if (!this.currentExecution) {
                this.currentExecution = this.getOrMakePrompt(e.detail.prompt_id);
            }
            this.currentExecution?.error(e.detail);
            this.dispatchProgressUpdate();
        });

        api.addEventListener("execution_interrupted", (e) => {
            if (this.currentExecution) {
                if (this.workflowProgress.startTime) {
                    this.workflowProgress.totalDuration = (performance.now() - this.workflowProgress.startTime) / 1000;
                }
                this.workflowProgress.easeOutStartTime = performance.now();
                this.workflowProgress.isInterrupted = true;
                this.currentExecution = null;
                this.dispatchProgressUpdate();
            }
        });
    },

    getOrMakePrompt(id) {
        let prompt = this.promptsMap.get(id);
        if (!prompt) {
            prompt = new PromptExecution(id);
            this.promptsMap.set(id, prompt);
        }
        return prompt;
    },

    dispatchProgressUpdate() {
        const prompt = this.currentExecution;
        this.workflowProgress.queueCount = this.lastQueueRemaining;         if (prompt?.currentlyExecuting) {
                        if (!prompt.promptApi || prompt.totalNodes <= 0) {
                this.workflowProgress.isProgressUnknown = true;
                this.workflowProgress.percentage = 0;
                this.workflowProgress.currentNodeLabel = prompt.currentlyExecuting.nodeLabel || "Unknown";
            } else {
                this.workflowProgress.isProgressUnknown = false;
                const executed = prompt.executedNodeIds.length;
                const total = prompt.totalNodes || 1;
                const basePercentage = (executed / total) * 100;
                const current = prompt.currentlyExecuting;
                let nodeContribution = 0;
                this.workflowProgress.currentNodeLabel = current.nodeLabel || "Unknown";
                if (current.step != null && current.maxSteps) {
                    this.workflowProgress.nodePercentage = (current.step / current.maxSteps) * 100;
                    nodeContribution = (1 / total) * (current.step / current.maxSteps) * 100;
                } else {
                    this.workflowProgress.nodePercentage = 0;
                }
                this.workflowProgress.percentage = Math.min(basePercentage + nodeContribution, 100);
            }
        } else if (this.workflowProgress.totalDuration !== null) {
            this.workflowProgress.isProgressUnknown = false;
            if (this.workflowProgress.isInterrupted) {
                this.workflowProgress.currentNode = `${this.workflowProgress.totalDuration.toFixed(1)}s (Interrupted)`;
                this.workflowProgress.currentNodeLabel = "Interrupted";
            } else {
                this.workflowProgress.percentage = 100;
                this.workflowProgress.currentNode = `${this.workflowProgress.totalDuration.toFixed(1)}s`;
                this.workflowProgress.currentNodeLabel = "Completed";
            }
            this.workflowProgress.nodePercentage = 0;
        } else {
            this.workflowProgress.isProgressUnknown = false;             this.workflowProgress.percentage = 0;
            this.workflowProgress.nodePercentage = 0;
            this.workflowProgress.currentNode = "Idle";
            this.workflowProgress.currentNodeLabel = "Idle";
        }
    },

    updateWorkflowProgress() {
        if (!this.workflowProgressEl) return;
    
        const { percentage, currentNode, isProgressUnknown, queueCount } = this.workflowProgress;
        const { styles, colors } = this;
    
        const containerWidth = this.toolbar.clientWidth - 20;
        const barWidth = Math.min(200, Math.max(50, (containerWidth - 15) * 0.18));
        let displayPercentage, barPercentage, displayText;
    
        if (currentNode === "Idle") {
            displayText = "Workflow: Idle";             barPercentage = 0;
        } else {
            displayPercentage = isProgressUnknown ? "??%" : `${Math.min(Math.max(this.currentWorkflow.percentage, 0), 100).toFixed(1)}%`;
            barPercentage = isProgressUnknown ? 0 : Math.min(Math.max(this.currentWorkflow.percentage, 0), 100);
            if (queueCount > 1) {                 displayPercentage += ` (${queueCount})`;
            }
            displayText = `Workflow: ${displayPercentage} - ${currentNode}`;
        }
    
                const dotColor = (this.currentExecution?.currentlyExecuting) ? 'rgba(208, 255, 0, 0.86)' : 'rgba(200, 200, 200, 0.3)';
    
                if (!this.workflowProgressEl.querySelector('.workflow-dot')) {
            this.workflowProgressEl.innerHTML = `
                <span class="workflow-dot" style="${styles.dot(dotColor)}"></span>
                <span class="workflow-bar" style="${styles.bar(barWidth)}">
                    <span style="${styles.fill(colors.workflow, barPercentage)}"></span>
                </span>
                <span style="${styles.text}">${displayText}</span>
            `;
        } else {
                        const dotElement = this.workflowProgressEl.querySelector('.workflow-dot');
            if (dotElement) {
                dotElement.style.background = dotColor;             }
            const barElement = this.workflowProgressEl.querySelector('.workflow-bar');
            if (barElement) {
                barElement.style.width = `${barWidth}px`;                 const barFill = barElement.querySelector('span');
                if (barFill) {
                    barFill.style.width = `${barPercentage}%`;                 }
            }
            const textElement = this.workflowProgressEl.querySelector('span:nth-child(3)');
            if (textElement) {
                textElement.textContent = displayText;             }
        }
    },

    show() {
        this.isVisible = true;
        if (this.toolbar && this.isEnabled) {
            this.toolbar.style.display = 'flex';
            this.refreshCanvas();
            this.startAnimation();
        }
        this.saveVisibility();
    },

    hide() {
        this.isVisible = false;
        if (this.toolbar) {
            this.toolbar.style.display = 'none';
            this.stopAnimation();
        }
        this.saveVisibility();
    },

    updateEnabledState(enabled) {
        this.isEnabled = enabled;
        if (this.menuButton) {
            this.menuButton.style.display = enabled ? '' : 'none';
        }
        if (this.toolbar) {
            this.toolbar.style.display = enabled && this.isVisible ? 'flex' : 'none';
            if (enabled && this.isVisible) {
                this.refreshCanvas();
                this.startAnimation();
            } else {
                this.stopAnimation();
            }
        }
    },

    refreshCanvas() {
        if (this.chartCanvas) {
            const headerHeight = this.toolbar.firstChild.getBoundingClientRect().height + 10;
            const workflowHeight = this.workflowProgressEl.clientHeight;
            const dataHeight = this.dataDisplay.clientHeight;
            this.chartCanvas.width = this.toolbar.clientWidth - 20;
            this.chartCanvas.height = this.toolbar.clientHeight - headerHeight - workflowHeight - dataHeight - 10;
        }
    },

    async fetchResources() {
        try {
            const response = await fetch('/kaytool/resources', { timeout: 5000 });
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            const data = await response.json();
            this.updateTarget(data);
        } catch (error) {
            this.updateTarget({
                cpu_percent: 0,
                cpu_count: this.cpuCores,
                cpu_name: "Unknown",
                ram_total: 0,
                ram_used: 0,
                ram_percent: 0,
                gpu: "Fetch failed"
            });
        }
    },

    updateTarget(data) {
        this.target.cpu = data.cpu_percent || 0;
        this.cpuCores = data.cpu_count || 4;
        this.target.ram = data.ram_percent || 0;
        this.target.ramTotal = data.ram_total || 0;
        this.target.ramUsed = data.ram_used || 0;
        this.target.cpuName = data.cpu_name || "Unknown";
        this.dataHistory.cpu.push(this.target.cpu);
        this.dataHistory.ram.push(this.target.ram);

        if (data.gpu && typeof data.gpu !== 'string' && data.gpu.length > 0) {
            this.target.gpu = data.gpu[0].load || 0;
            this.target.gpuMem = data.gpu[0].memory_percent || 0;
            this.target.gpuMemTotal = data.gpu[0].memory_total || 0;
            this.target.gpuMemUsed = data.gpu[0].memory_used || 0;
            this.target.gpuTemp = data.gpu[0].temperature || 0;
            this.target.gpuName = data.gpu[0].name || "Unknown";
            this.dataHistory.gpu.push(this.target.gpu);
            this.dataHistory.gpuMem.push(this.target.gpuMem);
            this.dataHistory.gpuTemp.push(this.target.gpuTemp);
        } else {
            this.target.gpu = 0;
            this.target.gpuMem = 0;
            this.target.gpuMemTotal = 0;
            this.target.gpuMemUsed = 0;
            this.target.gpuTemp = 0;
            this.target.gpuName = "Unknown";
            this.dataHistory.gpu.push(0);
            this.dataHistory.gpuMem.push(0);
            this.dataHistory.gpuTemp.push(0);
        }

        if (this.dataHistory.cpu.length > this.maxPoints) {
            this.dataHistory.cpu.shift();
            this.dataHistory.ram.shift();
            this.dataHistory.gpu.shift();
            this.dataHistory.gpuMem.shift();
            this.dataHistory.gpuTemp.shift();
        }
    },

    updateDisplay() {
        const { cpu, ram, gpu, gpuMem, gpuTemp, ramUsed, ramTotal, gpuMemUsed, gpuMemTotal } = this.current;
        const { styles, colors } = this;
        this.dataDisplay.innerHTML = [
            this.renderRow('CPU', colors.cpu, cpu, `${cpu.toFixed(1)}% (${this.cpuCores} cores) - ${this.target.cpuName}`),
            this.renderRow('RAM', colors.ram, ram, `${ramUsed.toFixed(1)}/${ramTotal.toFixed(1)}GB (${ram.toFixed(1)}%)`),
            this.target.gpu || this.target.gpuMem
                ? [
                    this.renderRow('GPU', colors.gpu, gpu, `${gpu.toFixed(1)}% - ${this.target.gpuName}`),
                    this.renderRow('VRAM', colors.gpuMem, gpuMem, `${gpuMemUsed.toFixed(1)}/${gpuMemTotal.toFixed(1)}GB (${gpuMem.toFixed(1)}%)`),
                    this.renderRow('TEMP', colors.gpuTemp, gpuTemp, `${gpuTemp.toFixed(1)}°C (GPU)`)
                ].join('')
                : [
                    this.renderRow('GPU', colors.gpu, 0, 'N/A'),
                    this.renderRow('VRAM', colors.gpuMem, 0, 'N/A'),
                    this.renderRow('TEMP', colors.gpuTemp, 0, 'N/A (GPU)')
                ].join('')
        ].join('');
    },

    renderRow(label, color, value, text) {
        const { styles } = this;
        const containerWidth = this.toolbar.clientWidth - 20;
        const minBarWidth = 50;
        const maxBarWidth = 200;
        const fixedSpacing = 3 + 5 + 5;
        const availableWidth = containerWidth - fixedSpacing;
        const barWidth = Math.min(maxBarWidth, Math.max(minBarWidth, availableWidth * 0.18));

        const textAvailableWidth = containerWidth - fixedSpacing - barWidth;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = '10px sans-serif';
        const textWidth = ctx.measureText(`${label}: ${text}`).width;
        let displayText = `${label}: ${text}`;
        if (textWidth > textAvailableWidth) {
            const ellipsisWidth = ctx.measureText('...').width;
            let truncatedText = `${label}: `;
            let remainingWidth = textAvailableWidth - ctx.measureText(truncatedText).width - ellipsisWidth;
            for (let i = 0; i < text.length; i++) {
                const charWidth = ctx.measureText(text[i]).width;
                if (remainingWidth < charWidth) {
                    truncatedText += '...';
                    break;
                }
                truncatedText += text[i];
                remainingWidth -= charWidth;
            }
            displayText = truncatedText;
        }
        return `<div style="${styles.row}">
            <span style="${styles.dot(color)}"></span>
            <span style="${styles.bar(barWidth)}"><span style="${styles.fill(color, value)}"></span></span>
            <span style="${styles.text}">${displayText}</span>
        </div>`;
    },

    animate() {
        if (!this.isVisible || !this.isEnabled || !this.toolbar) return;

        const now = performance.now();

        if (now - this.lastUpdate >= this.fetchInterval) {
            this.fetchResources();
            this.lastUpdate = now;
        }

        for (const key in this.current) {
            if (this.current[key] === 0 && this.target[key] !== 0) {
                this.current[key] = this.target[key];
            } else {
                this.current[key] += (this.target[key] - this.current[key]) * this.smoothFactor;
            }
        }

        if (this.workflowProgress.easeOutStartTime !== null) {
            const elapsed = now - this.workflowProgress.easeOutStartTime;
            const t = Math.min(elapsed / this.easeOutDuration, 1);
            const startPercentage = this.currentWorkflow.percentage;
            const targetPercentage = this.workflowProgress.percentage;
            const startNodePercentage = this.workflowProgress.currentNodePercentage;
            const targetNodePercentage = this.workflowProgress.nodePercentage;
            this.currentWorkflow.percentage = startPercentage + (targetPercentage - startPercentage) * this.easeOutQuad(t);
            this.workflowProgress.currentNodePercentage = startNodePercentage + (targetNodePercentage - startNodePercentage) * this.easeOutQuad(t);
            if (t >= 1) {
                this.workflowProgress.easeOutStartTime = null;
            }
        } else if (!this.workflowProgress.isProgressUnknown && this.workflowProgress.currentNode !== "Idle") {
                        this.currentWorkflow.percentage += (this.workflowProgress.percentage - this.currentWorkflow.percentage) * this.smoothFactor;
            this.workflowProgress.currentNodePercentage += (this.workflowProgress.nodePercentage - this.workflowProgress.currentNodePercentage) * this.smoothFactor;
        }

                if (this.currentExecution?.currentlyExecuting) {
            if (this.workflowProgress.nodePercentage > 0) {
                this.workflowProgress.currentNode = `${this.workflowProgress.currentNodeLabel} (${this.workflowProgress.currentNodePercentage.toFixed(1)}%)`;
            } else {
                this.workflowProgress.currentNode = this.workflowProgress.currentNodeLabel;
            }
        }

        if (now - this.lastCurveUpdate >= this.curveInterval) {
            for (const key in this.displayHistory) {
                this.displayHistory[key].push(this.current[key]);
                if (this.displayHistory[key].length > this.maxPoints) this.displayHistory[key].shift();
            }
            this.lastCurveUpdate = now;
        }

        if (now - this.lastDisplayUpdate >= this.displayInterval) {
            this.updateDisplay();
            this.updateWorkflowProgress();
            this.lastDisplayUpdate = now;
        }

        if (typeof this.drawCurves === 'function') {
            this.drawCurves();
        }
        
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    },

    startAnimation() {
        if (!this.animationFrameId && this.isEnabled && this.isVisible && this.toolbar) {
            this.lastUpdate = performance.now();
            this.lastCurveUpdate = performance.now();
            this.lastDisplayUpdate = performance.now();
            this.animationFrameId = requestAnimationFrame(() => this.animate());
        }
    },

    stopAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    },

    drawCurves() {
        const ctx = this.chartCanvas.getContext('2d');
        const w = this.chartCanvas.width;
        const h = this.chartCanvas.height;
    
        ctx.clearRect(0, 0, w, h);
    
        ctx.strokeStyle = 'rgba(166, 166, 166, 0.5)';
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            const y = h - (i * h / 4);
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
        }
        ctx.stroke();
    
        ctx.strokeStyle = 'rgba(166, 166, 166, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w, 0);
        ctx.stroke();
    
        const step = w / (this.maxPoints - 1);
        const { colors } = this;
    
        ctx.globalCompositeOperation = 'screen';
        ctx.lineWidth = 0.8;
    
        [
            { data: this.displayHistory.cpu, color: colors.cpu },
            { data: this.displayHistory.ram, color: colors.ram },
            { data: this.displayHistory.gpu, color: colors.gpu },
            { data: this.displayHistory.gpuMem, color: colors.gpuMem },
            { data: this.displayHistory.gpuTemp, color: colors.gpuTemp }
        ].forEach(({ data, color }) => {
            ctx.strokeStyle = color;
            ctx.beginPath();
            data.forEach((v, i) => {
                const x = i * step;
                const normalizedValue = Math.min(v, 100) / 100 * 100;
                const y = h - (normalizedValue / 100) * h;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
        });
    
        ctx.globalCompositeOperation = 'source-over';
    
        if (this.edgeFadeEnabled) {
            const gradient = ctx.createLinearGradient(0, 0, w, 0);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(0.1, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.9, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
            ctx.save();
            ctx.globalCompositeOperation = 'destination-in';
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);
            ctx.restore();
        }
    },

    startMonitoring() {
        for (const key in this.displayHistory) {
            this.displayHistory[key] = Array(this.maxPoints).fill(0);
        }
    },

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            if (this.dragState.isDragging) this.onDrag(e);
            if (this.resizeState.isResizing) this.onResizeDrag(e);
        });
        document.addEventListener('mouseup', (e) => {
            if (this.dragState.isDragging) this.endDrag();
            if (this.resizeState.isResizing) this.endResize();
        });
        document.addEventListener('selectstart', (e) => (this.dragState.isDragging || this.resizeState.isResizing) && e.preventDefault());
        window.addEventListener('resize', () => this.onResize());
    },

    bindToolbarEvents() {
        if (this.toolbar) {
            const headerText = this.toolbar.querySelector('span');
            headerText.addEventListener('mousedown', (e) => this.startDrag(e));
            this.resizeHandle.addEventListener('mousedown', (e) => this.startResize(e, 'se'));
        }
    },

    loadPosition() {
        const pos = JSON.parse(localStorage.getItem('KayResourceMonitorPosition')) || {};
        this.position.left = pos.left || 0;
        this.position.top = pos.top || 0;
        this.toolbar.style.left = `${this.position.left}px`;
        this.toolbar.style.top = `${this.position.top}px`;
    },

    loadSize() {
        const size = JSON.parse(localStorage.getItem('KayResourceMonitorSize')) || {};
        this.size.width = Math.max(size.width || 250, this.minWidth);
        this.size.height = Math.max(size.height || 219, this.minHeight);
        this.toolbar.style.width = `${this.size.width}px`;
        this.toolbar.style.height = `${this.size.height}px`;
    },

    savePositionAndSize() {
        localStorage.setItem('KayResourceMonitorPosition', JSON.stringify(this.position));
        localStorage.setItem('KayResourceMonitorSize', JSON.stringify(this.size));
    },

    onResize() {
        if (!this.toolbar) return;
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        this.position.left = Math.max(0, Math.min(this.position.left, winW - this.size.width));
        this.position.top = Math.max(0, Math.min(this.position.top, winH - this.size.height));
        this.toolbar.style.left = `${this.position.left}px`;
        this.toolbar.style.top = `${this.position.top}px`;
        this.chartCanvas.width = this.toolbar.clientWidth - 20;
        const headerHeight = this.toolbar.firstChild.getBoundingClientRect().height + 10;
        const workflowHeight = this.workflowProgressEl.clientHeight;
        const dataHeight = this.dataDisplay.clientHeight;
        this.chartCanvas.height = this.toolbar.clientHeight - headerHeight - workflowHeight - dataHeight - 10;
        this.updateDisplay();
    },

    startDrag(e) {
        e.preventDefault();
        const rect = this.toolbar.getBoundingClientRect();
        this.dragState.isDragging = true;
        this.dragState.offsetX = e.clientX - rect.left;
        this.dragState.offsetY = e.clientY - rect.top;
        this.toolbar.querySelector('span').style.cursor = 'grabbing';
    },

    onDrag(e) {
        if (!this.dragState.isDragging) return;
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        this.position.left = Math.max(0, Math.min(e.clientX - this.dragState.offsetX, winW - this.size.width));
        this.position.top = Math.max(0, Math.min(e.clientY - this.dragState.offsetY, winH - this.size.height));
        this.toolbar.style.left = `${this.position.left}px`;
        this.toolbar.style.top = `${this.position.top}px`;
    },

    endDrag() {
        if (!this.dragState.isDragging) return;
        this.dragState.isDragging = false;
        this.toolbar.querySelector('span').style.cursor = 'grab';
        this.savePositionAndSize();
    },

    startResize(e, direction) {
        e.preventDefault();
        this.resizeState.isResizing = true;
        this.resizeState.startX = e.clientX;
        this.resizeState.startY = e.clientY;
        this.resizeState.startWidth = this.toolbar.clientWidth;
        this.resizeState.startHeight = this.toolbar.clientHeight;
        this.resizeHandle.style.cursor = 'se-resize';
    },

    onResizeDrag(e) {
        if (!this.resizeState.isResizing) return;
        const dx = e.clientX - this.resizeState.startX;
        const dy = e.clientY - this.resizeState.startY;

        this.size.width = Math.max(this.minWidth, this.resizeState.startWidth + dx);
        this.size.height = Math.min(this.maxHeight, Math.max(this.minHeight, this.resizeState.startHeight + dy));
        this.toolbar.style.width = `${this.size.width}px`;
        this.toolbar.style.height = `${this.size.height}px`;
        this.onResize();
    },

    endResize() {
        if (!this.resizeState.isResizing) return;
        this.resizeState.isResizing = false;
        this.resizeHandle.style.cursor = 'se-resize';
        this.savePositionAndSize();
    }
};

app.registerExtension({
    name: "KayTool.ResourceMonitor",
    async setup() {
        await KayResourceMonitor.init();

        const showMenuButton = new (await import("/scripts/ui/components/button.js")).ComfyButton({
            content: "𝙆 Monitor",
            action: () => {
                if (KayResourceMonitor.isVisible) {
                    KayResourceMonitor.hide();
                    showMenuButton.tooltip = "Show Monitor";
                } else {
                    KayResourceMonitor.show();
                    showMenuButton.tooltip = "Hide Monitor";
                }
            },
            tooltip: KayResourceMonitor.isVisible ? "Hide Monitor" : "Show Monitor"
        });

        KayResourceMonitor.menuButton = showMenuButton.element;
        if (app.menu?.settingsGroup) {
            app.menu.settingsGroup.append(showMenuButton);
        }
        KayResourceMonitor.updateEnabledState(KayResourceMonitor.isEnabled);
        window.KayResourceMonitor = KayResourceMonitor;
    }
});