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
        // lineHeight: "1.4",
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
        whiteSpace: "pre-wrap" // 保留换行和空格
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

    // 打字机效果：基于 Markdown 原始文本，仅双换行触发解析
    try {
        marked.setOptions({ breaks: true, gfm: true });

        if (!message || typeof message !== "string" || message.trim() === "") {
            contentDiv.textContent = "No message to display";
            updateHeights();
            return div;
        }

        // 分割 Markdown 原始文本为字符数组
        const chars = message.split('');
        let charIndex = 0;
        let currentMarkdown = ''; // 当前累积的 Markdown 文本
        let renderedHtml = ''; // 已渲染的 HTML

        function typeWriter() {
            if (charIndex >= chars.length) {
                // 所有字符打完，解析剩余的 Markdown
                if (currentMarkdown.trim()) {
                    renderedHtml += marked.parse(currentMarkdown);
                }
                contentDiv.innerHTML = renderedHtml;
                updateHeights();
                return;
            }

            // 逐字符追加到 currentMarkdown
            currentMarkdown += chars[charIndex];
            const isNewline = chars[charIndex] === '\n';
            const isDoubleNewline = isNewline && charIndex > 0 && chars[charIndex - 1] === '\n';

            if (isDoubleNewline) {
                // 遇到双换行，解析当前累积的 Markdown
                if (currentMarkdown.trim()) {
                    renderedHtml += marked.parse(currentMarkdown);
                    currentMarkdown = ''; // 重置当前 Markdown
                }
                contentDiv.innerHTML = renderedHtml;
            } else {
                // 显示已渲染的 HTML + 当前未解析的 Markdown
                contentDiv.innerHTML = renderedHtml + `<div>${currentMarkdown}</div>`;
            }

            charIndex++;
            setTimeout(typeWriter, 50); // 字符间间隔 100ms
        }

        setTimeout(typeWriter, 300);
    } catch (e) {
        console.error("Error in typewriter effect:", e);
        contentDiv.textContent = message || "Error displaying message";
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