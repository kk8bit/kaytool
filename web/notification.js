import { marked } from "./lib/marked.esm.js";

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
        bottom: "20px",
        left: "50px",
        width: selectedSize.maxWidth,
        padding: selectedSize.padding,
        backgroundColor: bgColor,
        color: "#333",
        fontFamily: "'Courier New', monospace",
        fontSize: "14px",
        lineHeight: "1.4",
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

    const tail = document.createElement("div");
    Object.assign(tail.style, {
        position: "absolute",
        bottom: "-8px",
        left: "10px",
        width: "0",
        height: "0",
        borderLeft: "6px solid transparent",
        borderRight: "6px solid transparent",
        borderTop: `8px solid ${bgColor}`,
        zIndex: "-1"
    });
    div.appendChild(tail);

    const tailBorder = document.createElement("div");
    Object.assign(tailBorder.style, {
        position: "absolute",
        bottom: "-10px",
        left: "8px",
        width: "0",
        height: "0",
        borderLeft: "8px solid transparent",
        borderRight: "8px solid transparent",
        borderTop: "10px solid #000",
        zIndex: "-2"
    });
    div.appendChild(tailBorder);

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
        scrollbarWidth: "thin",
        scrollbarColor: "#999 #333"
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

    const updateHeights = () => {
        const buttonHeight = buttonContainer ? buttonContainer.offsetHeight : 0;
        const totalExtraHeight = buttonHeight + 36;
        div.style.maxHeight = `calc(${selectedSize.maxHeight} + ${totalExtraHeight}px)`;
        contentDiv.style.maxHeight = `calc(${selectedSize.maxHeight} - ${totalExtraHeight}px)`;
    };

    updateHeights();

    let processedMessage = message;
    if (processedMessage.includes("<iframe")) {
        processedMessage = processedMessage.replace(/<iframe/g, "\n<iframe").replace(/<\/iframe>/g, "</iframe>\n");
    }

    try {
        marked.setOptions({ breaks: false, gfm: true });
        const paragraphs = processedMessage.split(/\n\n+/).filter(p => p.trim());
        let currentParaIndex = 0;

        function processParagraph() {
            if (currentParaIndex >= paragraphs.length) {
                updateHeights();
                return;
            }

            const paraDiv = document.createElement("div");
            paraDiv.style.marginBottom = "16px";
            contentDiv.appendChild(paraDiv);

            const paraText = paragraphs[currentParaIndex];
            const htmlContent = marked.parse(paraText);
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = htmlContent;
            const textContent = tempDiv.textContent;
            let charIndex = 0;

            function typeWriter() {
                if (charIndex < textContent.length) {
                    paraDiv.textContent += textContent.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeWriter, 50);
                } else {
                    paraDiv.innerHTML = htmlContent;
                    applyStyles(paraDiv);
                    currentParaIndex++;
                    setTimeout(processParagraph, 300);
                }
            }

            setTimeout(typeWriter, 300);
        }

        function applyStyles(paraDiv) {
            const blockElements = paraDiv.querySelectorAll("p, h1, h2, h3, h4, h5, h6, ul, ol, li");
            blockElements.forEach(el => {
                Object.assign(el.style, { margin: "0", padding: "0", lineHeight: "1.4" });
            });

            const images = paraDiv.getElementsByTagName("img");
            for (let img of images) {
                Object.assign(img.style, { maxWidth: "100%", height: "auto", display: "block" });
            }

            const videos = paraDiv.getElementsByTagName("video");
            for (let video of videos) {
                Object.assign(video.style, { maxWidth: "100%", height: "auto", display: "block" });
                if (!video.hasAttribute("controls")) video.setAttribute("controls", "");
            }

            const iframes = paraDiv.getElementsByTagName("iframe");
            for (let iframe of iframes) {
                Object.assign(iframe.style, {
                    maxWidth: "100%",
                    width: "100%",
                    height: "auto",
                    aspectRatio: "16 / 9",
                    display: "block",
                    border: "none",
                    margin: "0"
                });
            }
        }

        processParagraph();
    } catch (e) {
        contentDiv.textContent = processedMessage;
        updateHeights();
    }

    setTimeout(() => div.style.opacity = "1", 10);

    if (timeout > 0) {
        setTimeout(() => hideNotification(div), timeout);
    }

    return div;
}

export function hideNotification(element) {
    if (element?.parentNode) {
        element.style.opacity = "0";
        setTimeout(() => element.parentNode?.removeChild(element), 300);
    }
}