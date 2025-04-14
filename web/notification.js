// import { marked } from "./lib/marked.esm.js";

// export function showNotification({ 
//     message, 
//     bgColor = "#fff3cd", 
//     timeout = 0, 
//     onYes = null, 
//     onNo = null, 
//     size = "small"
// }) {
//     const sizes = {
//         small: { maxWidth: "250px", maxHeight: "150px", padding: "12px 16px" },
//         medium: { maxWidth: "400px", maxHeight: "300px", padding: "12px 16px" },
//         large: { maxWidth: "600px", maxHeight: "450px", padding: "12px 16px" }
//     };
//     const selectedSize = sizes[size] || sizes.small;

//     const div = document.createElement("div");
//     Object.assign(div.style, {
//         position: "fixed",
//         // Position will be set dynamically below
//         width: selectedSize.maxWidth,
//         padding: selectedSize.padding,
//         backgroundColor: bgColor,
//         color: "#333",
//         fontFamily: "'Courier New', monospace",
//         fontSize: "14px",
//         wordWrap: "break-word",
//         zIndex: "10000",
//         border: "2px solid #000",
//         borderRadius: "12px",
//         boxShadow: "4px 4px 0 #999",
//         opacity: "0",
//         transition: "opacity 0.3s ease-in-out",
//         display: "flex",
//         flexDirection: "column",
//         gap: "8px",
//         boxSizing: "border-box"
//     });
//     document.body.appendChild(div);

//     // Tail for visual connection to GuLuLu
//     const tail = document.createElement("div");
//     Object.assign(tail.style, {
//         position: "absolute",
//         width: "0",
//         height: "0",
//         borderLeft: "6px solid transparent",
//         borderRight: "6px solid transparent",
//         zIndex: "-1"
//     });
//     div.appendChild(tail);

//     const tailBorder = document.createElement("div");
//     Object.assign(tailBorder.style, {
//         position: "absolute",
//         width: "0",
//         height: "0",
//         borderLeft: "8px solid transparent",
//         borderRight: "8px solid transparent",
//         zIndex: "-2"
//     });
//     div.appendChild(tailBorder);

//     const closeButton = document.createElement("div");
//     closeButton.textContent = "X";
//     Object.assign(closeButton.style, {
//         position: "absolute",
//         top: "12px",
//         left: "12px",
//         width: "12px",
//         height: "12px",
//         backgroundColor: "#dc3545",
//         border: "2px solid #000",
//         borderRadius: "50%",
//         fontSize: "10px",
//         lineHeight: "10px",
//         textAlign: "center",
//         cursor: "pointer",
//         boxShadow: "2px 2px 0 #999"
//     });
//     closeButton.addEventListener("click", () => hideNotification(div));
//     closeButton.addEventListener("mousedown", () => {
//         closeButton.style.transform = "translate(1px, 1px)";
//         closeButton.style.boxShadow = "0 0 0 #999";
//     });
//     document.addEventListener("mouseup", () => {
//         closeButton.style.transform = "translate(0, 0)";
//         closeButton.style.boxShadow = "2px 2px 0 #999";
//     });
//     div.appendChild(closeButton);

//     const contentDiv = document.createElement("div");
//     Object.assign(contentDiv.style, {
//         marginTop: "20px",
//         overflowY: "auto",
//         overflowX: "hidden",
//         padding: "0 4px 0 0",
//         boxSizing: "border-box",
//         wordBreak: "break-word",
//         fontFamily: "'Courier New', monospace",
//         whiteSpace: "pre-wrap"
//     });
//     contentDiv.style.cssText += `
//         ::-webkit-scrollbar { width: 8px; }
//         ::-webkit-scrollbar-track { background: #333; border-left: 2px solid #000; }
//         ::-webkit-scrollbar-thumb { background: #999; border: 2px solid #000; }
//     `;
//     div.appendChild(contentDiv);

//     let buttonContainer = null;
//     if (onYes || onNo) {
//         buttonContainer = document.createElement("div");
//         Object.assign(buttonContainer.style, {
//             display: "flex",
//             gap: "8px",
//             justifyContent: "flex-end",
//             marginTop: "4px",
//             paddingBottom: "4px"
//         });
//         div.appendChild(buttonContainer);

//         if (onYes) {
//             const yesButton = document.createElement("button");
//             yesButton.textContent = "Yes";
//             Object.assign(yesButton.style, {
//                 padding: "4px 8px",
//                 backgroundColor: "#28a745",
//                 border: "2px solid #000",
//                 borderRadius: "8px",
//                 fontFamily: "'Courier New', monospace",
//                 fontSize: "12px",
//                 fontWeight: "bold",
//                 color: "#fff",
//                 cursor: "pointer",
//                 boxShadow: "2px 2px 0 #999"
//             });
//             yesButton.addEventListener("mousedown", () => {
//                 yesButton.style.transform = "translate(1px, 1px)";
//                 yesButton.style.boxShadow = "0 0 0 #999";
//             });
//             document.addEventListener("mouseup", () => {
//                 yesButton.style.transform = "translate(0, 0)";
//                 yesButton.style.boxShadow = "2px 2px 0 #999";
//             });
//             yesButton.addEventListener("click", () => {
//                 hideNotification(div);
//                 onYes();
//             });
//             buttonContainer.appendChild(yesButton);
//         }

//         if (onNo) {
//             const noButton = document.createElement("button");
//             noButton.textContent = "No";
//             Object.assign(noButton.style, {
//                 padding: "4px 8px",
//                 backgroundColor: "#dc3545",
//                 border: "2px solid #000",
//                 borderRadius: "8px",
//                 fontFamily: "'Courier New', monospace",
//                 fontSize: "12px",
//                 fontWeight: "bold",
//                 color: "#fff",
//                 cursor: "pointer",
//                 boxShadow: "2px 2px 0 #999"
//             });
//             noButton.addEventListener("mousedown", () => {
//                 noButton.style.transform = "translate(1px, 1px)";
//                 noButton.style.boxShadow = "0 0 0 #999";
//             });
//             document.addEventListener("mouseup", () => {
//                 noButton.style.transform = "translate(0, 0)";
//                 noButton.style.boxShadow = "2px 2px 0 #999";
//             });
//             noButton.addEventListener("click", () => {
//                 hideNotification(div);
//                 onNo();
//             });
//             buttonContainer.appendChild(noButton);
//         }
//     }

//     // Function to update notification position based on GuLuLu
//     const updatePosition = () => {
//         if (!window.KayGuLuLuManager || !window.KayGuLuLuManager.container) {
//             console.warn("KayGuLuLuManager not found, using fallback position");
//             div.style.left = "50px";
//             div.style.bottom = "20px";
//             return;
//         }

//         const gululu = window.KayGuLuLuManager;
//         const containerRect = gululu.container.getBoundingClientRect();
//         const windowRect = { width: window.innerWidth, height: window.innerHeight };
//         const notificationRect = div.getBoundingClientRect();
//         const bounds = gululu.effectiveBounds || { left: 0, top: 0, width: containerRect.width, height: containerRect.height };

//         // Determine side placement
//         const gululuCenterX = containerRect.left + containerRect.width / 2;
//         const isLeftSide = gululuCenterX < windowRect.width / 2;
//         const horizontalOffset = 10; // Distance from GuLuLu

//         // Determine vertical placement
//         const gululuCenterY = containerRect.top + containerRect.height / 2;
//         const isTopHalf = gululuCenterY < windowRect.height / 2;
//         const verticalOffset = 10; // Distance from GuLuLu

//         let left, top;

//         // Horizontal position
//         if (isLeftSide) {
//             // Notification to the right of GuLuLu
//             left = containerRect.left + bounds.left + bounds.width + horizontalOffset;
//             tail.style.left = "10px";
//             tail.style.right = "auto";
//             tailBorder.style.left = "8px";
//             tailBorder.style.right = "auto";
//         } else {
//             // Notification to the left of GuLuLu
//             left = containerRect.left + bounds.left - notificationRect.width - horizontalOffset;
//             tail.style.right = "10px";
//             tail.style.left = "auto";
//             tailBorder.style.right = "8px";
//             tailBorder.style.left = "auto";
//         }

//         // Vertical position
//         if (isTopHalf) {
//             // Notification below GuLuLu
//             top = containerRect.top + bounds.top + bounds.height + verticalOffset;
//             tail.style.top = "auto";
//             tail.style.bottom = "-8px";
//             tail.style.borderTop = `8px solid ${bgColor}`;
//             tail.style.borderBottom = "none";
//             tailBorder.style.top = "auto";
//             tailBorder.style.bottom = "-10px";
//             tailBorder.style.borderTop = "10px solid #000";
//             tailBorder.style.borderBottom = "none";
//         } else {
//             // Notification above GuLuLu
//             top = containerRect.top + bounds.top - notificationRect.height - verticalOffset;
//             tail.style.bottom = "auto";
//             tail.style.top = "-8px";
//             tail.style.borderBottom = `8px solid ${bgColor}`;
//             tail.style.borderTop = "none";
//             tailBorder.style.bottom = "auto";
//             tailBorder.style.top = "-10px";
//             tailBorder.style.borderBottom = "10px solid #000";
//             tailBorder.style.borderTop = "none";
//         }

//         // Clamp to screen boundaries
//         left = Math.max(0, Math.min(left, windowRect.width - notificationRect.width));
//         top = Math.max(0, Math.min(top, windowRect.height - notificationRect.height));

//         div.style.left = `${left}px`;
//         div.style.top = `${top}px`;
//     };

//     // Update heights and allow vertical adjustments for typewriter effect
//     const updateHeights = () => {
//         const buttonHeight = buttonContainer ? buttonContainer.offsetHeight : 0;
//         const totalExtraHeight = buttonHeight + 36;
//         div.style.maxHeight = `calc(${selectedSize.maxHeight} + ${totalExtraHeight}px)`;
//         contentDiv.style.maxHeight = `calc(${selectedSize.maxHeight} - ${totalExtraHeight}px)`;
//         updatePosition(); // Recompute position after height changes
//     };
//     updateHeights();

//     // Update position when GuLuLu moves
//     const onGuLuLuMove = () => updatePosition();
//     document.addEventListener('mousemove', onGuLuLuMove);
//     document.addEventListener('mouseup', onGuLuLuMove);
//     window.addEventListener('resize', updatePosition);

//     // Clean up event listeners when notification is removed
//     const cleanup = () => {
//         document.removeEventListener('mousemove', onGuLuLuMove);
//         document.removeEventListener('mouseup', onGuLuLuMove);
//         window.removeEventListener('resize', updatePosition);
//     };

//     // Typewriter effect
//     try {
//         marked.setOptions({ breaks: true, gfm: true });

//         if (!message || typeof message !== "string" || message.trim() === "") {
//             contentDiv.textContent = "No message to display";
//             updateHeights();
//             return div;
//         }

//         const chars = message.split('');
//         let charIndex = 0;
//         let currentMarkdown = '';
//         let renderedHtml = '';

//         function typeWriter() {
//             if (charIndex >= chars.length) {
//                 if (currentMarkdown.trim()) {
//                     renderedHtml += marked.parse(currentMarkdown);
//                 }
//                 contentDiv.innerHTML = renderedHtml;
//                 updateHeights();
//                 return;
//             }

//             currentMarkdown += chars[charIndex];
//             const isNewline = chars[charIndex] === '\n';
//             const isDoubleNewline = isNewline && charIndex > 0 && chars[charIndex - 1] === '\n';

//             if (isDoubleNewline) {
//                 if (currentMarkdown.trim()) {
//                     renderedHtml += marked.parse(currentMarkdown);
//                     currentMarkdown = '';
//                 }
//                 contentDiv.innerHTML = renderedHtml;
//             } else {
//                 contentDiv.innerHTML = renderedHtml + `<div>${currentMarkdown}</div>`;
//             }

//             charIndex++;
//             setTimeout(typeWriter, 50);
//         }

//         setTimeout(typeWriter, 300);
//     } catch (e) {
//         console.error("Error in typewriter effect:", e);
//         contentDiv.textContent = message || "Error displaying message";
//         updateHeights();
//     }

//     setTimeout(() => div.style.opacity = "1", 10);
//     if (timeout > 0) {
//         setTimeout(() => {
//             cleanup();
//             hideNotification(div);
//         }, timeout);
//     }

//     // Override hideNotification to include cleanup
//     const originalHide = hideNotification.bind(null, div);
//     div.hide = () => {
//         cleanup();
//         originalHide();
//     };

//     return div;
// }

// export function hideNotification(element) {
//     if (element?.parentNode) {
//         element.style.opacity = "0";
//         setTimeout(() => element.parentNode?.removeChild(element), 300);
//     }
// }