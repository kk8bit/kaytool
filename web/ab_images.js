import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";


// Inspired by：https://github.com/rgthree/rgthree-comfy
function imageDataToUrl(data) {
    return api.apiURL(`/view?filename=${encodeURIComponent(data.filename)}&type=${data.type}&subfolder=${data.subfolder}${app.getPreviewFormatParam()}${app.getRandParam()}`);
}

app.registerExtension({
    name: "kaytool.ABImages",
    async beforeRegisterNodeDef(nodeType, nodeData) {
        if (nodeData.name !== "AB_Images") return;

        const ABImagesNode = {
            title: "AB Images",
            type: "AB_Images",
            imgs: [],
            isPointerOver: false,
            pointerPos: [0, 0],

            onNodeCreated() {
                this.size = [256, 256];
                this.serialize_widgets = true;
            },

            onResize(newSize) {
                const minWidth = 128;
                const minHeight = 128;

                newSize[0] = Math.max(newSize[0], minWidth);
                newSize[1] = Math.max(newSize[1], minHeight);

                return newSize;
            },

            onExecuted(data) {
                this.imgs = [];
                const aImages = data.a || [];
                const bImages = data.b || [];

                if (aImages.length > 0) {
                    const imgA = new Image();
                    imgA.src = imageDataToUrl(aImages[0]);
                    imgA.onload = () => {
                        this.setDirtyCanvas(true, false);
                    };
                    this.imgs[0] = imgA;
                }
                if (bImages.length > 0) {
                    const imgB = new Image();
                    imgB.src = imageDataToUrl(bImages[0]);
                    imgB.onload = () => {
                        this.setDirtyCanvas(true, false);
                    };
                    this.imgs[1] = imgB;
                }

                this.setDirtyCanvas(true, true);
            },

            onMouseMove(event, pos) {
                this.isPointerOver = true;
                this.pointerPos = pos;
                this.setDirtyCanvas(true, false);
            },

            onMouseLeave(event, pos) {
                this.isPointerOver = false;
                this.setDirtyCanvas(true, false);
            },

            onMouseEnter(event, pos) {
                this.isPointerOver = true;
                this.setDirtyCanvas(true, false);
            },

            onDrawForeground(ctx) {
                if (!this.imgs[0]) return;

                const inputHeight = this.inputs ? this.inputs.length * 23 : 23;
                const y = inputHeight;
                const maxWidth = this.size[0];
                const maxHeight = this.size[1] - y;

                ctx.save();
                ctx.beginPath();
                ctx.rect(0, y, maxWidth, maxHeight);
                ctx.clip();

                const imgA = this.imgs[0];
                const imgB = this.imgs[1];

                if (imgA.naturalWidth && imgA.naturalHeight) {
                    this.drawImage(ctx, imgA, y, maxWidth, maxHeight);
                }

                if (this.isPointerOver && imgB && imgB.naturalWidth && imgB.naturalHeight) {
                    this.drawImage(ctx, imgB, y, maxWidth, maxHeight, this.pointerPos[0]);
                }

                ctx.restore();
            },

            drawImage(ctx, img, y, maxWidth, maxHeight, cropX) {
                const imageAspect = img.naturalWidth / img.naturalHeight;
                const widgetAspect = maxWidth / maxHeight;
                let targetWidth, targetHeight;
                let offsetX = 0;

                if (imageAspect > widgetAspect) {
                    targetWidth = maxWidth;
                    targetHeight = maxWidth / imageAspect;
                } else {
                    targetHeight = maxHeight;
                    targetWidth = maxHeight * imageAspect;
                    offsetX = (maxWidth - targetWidth) / 2;
                }

                const destX = offsetX;
                const destY = y + (maxHeight - targetHeight) / 2;
                const destWidth = cropX != null ? cropX - offsetX : targetWidth;
                const destHeight = targetHeight;

                if (cropX != null) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(destX, destY, destWidth, destHeight);
                    ctx.clip();
                }

                ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, destX, destY, targetWidth, targetHeight);

                if (cropX != null && cropX >= destX && cropX <= destX + targetWidth) {
                    ctx.beginPath();
                    ctx.moveTo(cropX, destY);
                    ctx.lineTo(cropX, destY + destHeight);
                    ctx.globalCompositeOperation = "difference";
                    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
                    ctx.stroke();
                }

                if (cropX != null) ctx.restore();
            },

            onDrawBackground(ctx) {
            },

            getExtraMenuOptions(canvas, options) {
                const menuOptions = [];
                menuOptions.push({
                    content: "Copy Image",
                    callback: () => {
                        const img = this.imgs[this.isPointerOver && this.imgs[1] ? 1 : 0];
                        if (img) {
                            const canvas = document.createElement("canvas");
                            canvas.width = img.naturalWidth;
                            canvas.height = img.naturalHeight;
                            const ctx = canvas.getContext("2d");
                            ctx.drawImage(img, 0, 0);
                            canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]));
                        }
                    }
                });
                menuOptions.push({
                    content: "Open Image",
                    callback: () => {
                        const img = this.imgs[this.isPointerOver && this.imgs[1] ? 1 : 0];
                        if (img) window.open(img.src, "_blank");
                    }
                });
                menuOptions.push({
                    content: "Save Image",
                    callback: () => {
                        const img = this.imgs[this.isPointerOver && this.imgs[1] ? 1 : 0];
                        if (img) {
                            const link = document.createElement("a");
                            link.href = img.src;
                            link.download = "image.png";
                            link.click();
                        }
                    }
                });
                options.unshift(...menuOptions, null);
            }
        };

        Object.assign(nodeType.prototype, ABImagesNode);
    },
});