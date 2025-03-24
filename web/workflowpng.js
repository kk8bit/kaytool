import { app } from "../../../scripts/app.js";
import { ComfyWidgets } from "../../../scripts/widgets.js";

let getDrawTextConfig = null;
let fileInput;

class KayWorkflowImage {
    static accept = ".png,image/png";
    extension = "png";

    getBounds() {
        const marginSize = app.ui.settings.getSettingValue("KayTool.WorkflowPNG");
        const bounds = app.graph._nodes.reduce(
            (p, node) => {
                if (node.pos[0] < p[0]) p[0] = node.pos[0];
                if (node.pos[1] < p[1]) p[1] = node.pos[1];
                const nodeBounds = node.getBounding();
                const right = node.pos[0] + nodeBounds[2];
                const bottom = node.pos[1] + nodeBounds[3];
                if (right > p[2]) p[2] = right;
                if (bottom > p[3]) p[3] = bottom;
                return p;
            },
            [99999, 99999, -99999, -99999]
        );
        bounds[0] -= marginSize;
        bounds[1] -= marginSize;
        bounds[2] += marginSize;
        bounds[3] += marginSize;
        return bounds;
    }

    saveState() {
        this.state = {
            scale: app.canvas.ds.scale,
            width: app.canvas.canvas.width,
            height: app.canvas.canvas.height,
            offset: app.canvas.ds.offset,
            transform: app.canvas.canvas.getContext('2d').getTransform(),
        };
    }

    restoreState() {
        app.canvas.ds.scale = this.state.scale;
        app.canvas.canvas.width = this.state.width;
        app.canvas.canvas.height = this.state.height;
        app.canvas.ds.offset = this.state.offset;
        app.canvas.canvas.getContext("2d").setTransform(this.state.transform);
        app.canvas.draw(true, true);  
    }

    updateView(bounds) {
        const scale = window.devicePixelRatio || 1;
        app.canvas.ds.scale = 1;
        app.canvas.canvas.width = (bounds[2] - bounds[0]) * scale;
        app.canvas.canvas.height = (bounds[3] - bounds[1]) * scale;
        app.canvas.ds.offset = [-bounds[0], -bounds[1]];
        app.canvas.canvas.getContext("2d").setTransform(scale, 0, 0, scale, 0, 0);
    }


    getDrawTextConfig(_, widget) {
        return {
            x: parseInt(widget.inputEl.style.left) || 10, 
            y: parseInt(widget.inputEl.style.top) || widget.last_y + 10,
            resetTransform: true, 
        };
    }

    async export(includeWorkflow) {
        this.saveState();
        this.updateView(this.getBounds());
        getDrawTextConfig = this.getDrawTextConfig;
        app.canvas.draw(true, true);
        getDrawTextConfig = null;
        const blob = await this.getBlob(includeWorkflow ? JSON.stringify(app.graph.serialize()) : undefined);
        this.restoreState();
        if (blob) this.download(blob);
    }

    download(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        Object.assign(a, {
            href: url,
            download: "workflow." + this.extension,
            style: "display: none",
        });
        document.body.append(a);
        a.click();
        setTimeout(() => {
            a.remove();
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    static import() {
        if (!fileInput) {
            fileInput = document.createElement("input");
            Object.assign(fileInput, {
                type: "file",
                style: "display: none",
                onchange: () => {
                    app.handleFile(fileInput.files[0]);
                },
            });
            document.body.append(fileInput);
        }
        fileInput.accept = KayWorkflowImage.accept;
        fileInput.click();
    }

    numberToBytes(num) {
        return new Uint8Array([(num >> 24) & 0xff, (num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff]);
    }

    joinArrayBuffer(...buffers) {
        const totalSize = buffers.reduce((size, buffer) => size + buffer.byteLength, 0);
        const result = new Uint8Array(totalSize);
        buffers.reduce((offset, buffer) => {
            result.set(buffer, offset);
            return offset + buffer.byteLength;
        }, 0);
        return result;
    }

    crc32(data) {
        const crcTable =
            KayWorkflowImage.crcTable ||
            (KayWorkflowImage.crcTable = (() => {
                let c;
                const table = [];
                for (let n = 0; n < 256; n++) {
                    c = n;
                    for (let k = 0; k < 8; k++) {
                        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
                    }
                    table[n] = c;
                }
                return table;
            })());
        let crc = 0 ^ -1;
        for (let i = 0; i < data.byteLength; i++) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xff];
        }
        return (crc ^ -1) >>> 0;
    }

    async getBlob(workflow) {
        return new Promise((resolve) => {
            app.canvasEl.toBlob(async (blob) => {
                if (!blob) {
                    console.error("Failed to generate blob from canvas");
                    resolve(null);
                    return;
                }
                if (workflow) {
                    const buffer = await blob.arrayBuffer();
                    const typedArr = new Uint8Array(buffer);
                    const view = new DataView(buffer);
                    const data = new TextEncoder().encode(`tEXtworkflow\0${workflow}`);
                    const chunk = this.joinArrayBuffer(
                        this.numberToBytes(data.byteLength - 4),
                        data,
                        this.numberToBytes(this.crc32(data))
                    );
                    const size = view.getUint32(8) + 20;
                    const result = this.joinArrayBuffer(
                        typedArr.subarray(0, size),
                        chunk,
                        typedArr.subarray(size)
                    );
                    blob = new Blob([result], { type: "image/png" });
                }
                resolve(blob);
            }, "image/png");
        });
    }
}

app.registerExtension({
    name: "KayTool.WorkflowPNG",
    init() {

        function wrapText(context, text, x, y, maxWidth, lineHeight) {
            const words = text.split(" ");
            let line = "";
            let currentY = y;

            for (let i = 0; i < words.length; i++) {
                let test = words[i];
                let metrics = context.measureText(test);
                while (metrics.width > maxWidth) {
                    test = test.substring(0, test.length - 1);
                    metrics = context.measureText(test);
                }
                if (words[i] !== test) {
                    words.splice(i + 1, 0, words[i].substr(test.length));
                    words[i] = test;
                }

                const testLine = line + words[i] + " ";
                metrics = context.measureText(testLine);

                if (metrics.width > maxWidth && i > 0) {
                    context.fillText(line, x, currentY);
                    line = words[i] + " ";
                    currentY += lineHeight;
                } else {
                    line = testLine;
                }
            }
            context.fillText(line, x, currentY);
            return currentY + lineHeight; 
        }

        const stringWidget = ComfyWidgets.STRING;
        ComfyWidgets.STRING = function (node, inputName, inputData, appInstance) {
            const widget = stringWidget.call(this, node, inputName, inputData, appInstance);
            if (widget.widget && widget.widget.type === "customtext") {
                const originalDraw = widget.widget.draw;
                widget.widget.draw = function (ctx) {
                    originalDraw.apply(this, arguments);
                    if (this.inputEl.hidden) return;
                    if (getDrawTextConfig) {
                        const config = getDrawTextConfig(ctx, this);
                        const transform = ctx.getTransform();
                        ctx.save();
                        if (config.resetTransform) {
                            ctx.resetTransform();
                        }
                        const style = document.defaultView.getComputedStyle(this.inputEl, null);
                        const x = config.x;
                        const y = config.y;
                        const width = parseInt(this.inputEl.style.width) || 100;
                        const height = parseInt(this.inputEl.style.height) || 20;
                        ctx.fillStyle = style.getPropertyValue("background-color") || "#000000";
                        ctx.fillRect(x, y, width, height);
                        ctx.fillStyle = style.getPropertyValue("color") || "#FFFFFF";
                        ctx.font = style.getPropertyValue("font") || "12px sans-serif";
                        const lineHeight = transform.d * 12;
                        const lines = this.inputEl.value.split("\n");
                        let currentY = y;
                        for (const line of lines) {
                            currentY = wrapText(ctx, line, x + 4, currentY + lineHeight, width - 8, lineHeight);
                        }
                        const textHeight = currentY - y + lineHeight;
                        if (textHeight > height) {
                            ctx.fillStyle = style.getPropertyValue("background-color") || "#000000";
                            ctx.fillRect(x, y, width, textHeight);
                        }
                        ctx.restore();
                    }
                };
            }
            return widget;
        };
    },
    setup() {
        const orig = LGraphCanvas.prototype.getCanvasMenuOptions;
        LGraphCanvas.prototype.getCanvasMenuOptions = function () {
            const options = orig.apply(this, arguments) || [];
            const showWorkflowPNG = app.ui.settings.getSettingValue("KayTool.ShowWorkflowPNG");
            if (showWorkflowPNG) {
                const newOptions = [...options];
                let kaytoolMenu = newOptions.find(opt => opt && opt.content === "KayTool");
                if (!kaytoolMenu) {
                    kaytoolMenu = {
                        content: "KayTool",
                        submenu: {
                            options: []
                        }
                    };
                    newOptions.push(null, kaytoolMenu);
                }
                kaytoolMenu.submenu.options = kaytoolMenu.submenu.options || [];
                kaytoolMenu.submenu.options.push({
                    content: "workflow PNG",
                    submenu: {
                        options: [
                            {
                                content: "Import",
                                callback: () => {
                                    KayWorkflowImage.import();
                                },
                            },
                            {
                                content: "Export PNG",
                                callback: () => {
                                    new KayWorkflowImage().export(true);
                                },
                            },
                            {
                                content: "Export PNG (no workflow)",
                                callback: () => {
                                    new KayWorkflowImage().export();
                                },
                            },
                        ],
                    },
                });
                return newOptions;
            }
            return options;
        };
    },
});