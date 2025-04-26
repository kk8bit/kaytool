// import { app } from "../../../scripts/app.js";

// let originalLayout = null;

// class LayoutOptimizer {
//     static optimizeWorkflow() {
//         const graph = app.graph;
//         const nodes = graph._nodes;
//         if (!nodes.length) return;

//         // 保存当前布局
//         originalLayout = nodes.map(node => ({
//             id: node.id,
//             pos: [...node.pos]
//         }));

//         // 找到最后一个 KSampler 节点（按 id 排序）
//         const samplers = nodes.filter(node => node.type.toLowerCase().includes("ksampler"));
//         if (!samplers.length) {
//             console.log("No KSampler node found.");
//             return;
//         }
//         const lastSampler = samplers.sort((a, b) => b.id - a.id)[0];

//         // 计算节点层级（从 KSampler 反推和正推）
//         const levelsLeft = new Map(); // 左侧层级（反推）
//         const levelsRight = new Map(); // 右侧层级（正推）
//         const visitedLeft = new Set();
//         const visitedRight = new Set();

//         // 反推（左侧）
//         function computeLevelLeft(node, level = 0) {
//             if (visitedLeft.has(node.id)) return;
//             visitedLeft.add(node.id);
//             levelsLeft.set(node.id, level);

//             if (node.inputs) {
//                 node.inputs.forEach(input => {
//                     if (input.link) {
//                         const link = graph.links[input.link];
//                         if (link) {
//                             const sourceNode = nodes.find(n => n.id === link.origin_id);
//                             if (sourceNode) computeLevelLeft(sourceNode, level + 1);
//                         }
//                     }
//                 });
//             }
//         }

//         // 正推（右侧）
//         function computeLevelRight(node, level = 0) {
//             if (visitedRight.has(node.id)) return;
//             visitedRight.add(node.id);
//             levelsRight.set(node.id, level);

//             if (node.outputs) {
//                 node.outputs.forEach(output => {
//                     if (output.links) {
//                         output.links.forEach(linkId => {
//                             const link = graph.links[linkId];
//                             if (link) {
//                                 const targetNode = nodes.find(n => n.id === link.target_id);
//                                 if (targetNode) computeLevelRight(targetNode, level + 1);
//                             }
//                         });
//                     }
//                 });
//             }
//         }

//         computeLevelLeft(lastSampler);
//         computeLevelRight(lastSampler);

//         // 计算最大层级
//         const maxLevelLeft = Math.max(...levelsLeft.values(), 0);
//         const maxLevelRight = Math.max(...levelsRight.values(), 0);

//         // 未连接的节点设为最外层
//         nodes.forEach(node => {
//             if (!levelsLeft.has(node.id) && !levelsRight.has(node.id)) {
//                 levelsLeft.set(node.id, maxLevelLeft + 1);
//             }
//         });

//         // 按层级分组
//         const levelsMapLeft = new Map();
//         levelsLeft.forEach((level, id) => {
//             if (!levelsMapLeft.has(level)) levelsMapLeft.set(level, []);
//             levelsMapLeft.get(level).push(nodes.find(n => n.id === id));
//         });

//         const levelsMapRight = new Map();
//         levelsRight.forEach((level, id) => {
//             if (!levelsMapRight.has(level)) levelsMapRight.set(level, []);
//             levelsMapRight.get(level).push(nodes.find(n => n.id === id));
//         });

//         // 计算间距（动态基于节点大小）
//         const maxNodeWidth = Math.max(...nodes.map(node => node.size[0] || 200));
//         const maxNodeHeight = Math.max(...nodes.map(node => node.size[1] || 100));
//         const baseRadius = maxNodeWidth + 100; // 扇形基础半径
//         const minAngleGap = 30; // 最小角度间隔（度）

//         // 布局：以 KSampler 为中心
//         const processed = new Set();
//         const centerX = app.canvas.canvas.width / 2;
//         const centerY = app.canvas.canvas.height / 2;

//         // 放置 KSampler
//         lastSampler.pos[0] = centerX;
//         lastSampler.pos[1] = centerY;
//         processed.add(lastSampler.id);

//         // 扇形布局函数
//         function arrangeFan(nodesInLevel, level, direction, parentX, parentY) {
//             if (!nodesInLevel) return;

//             const radius = baseRadius * (Math.abs(level) + 1); // 半径随层级递增
//             const isLeft = direction === "left";
//             const baseX = isLeft ? parentX - radius : parentX + radius;

//             // 过滤未处理的节点
//             const unprocessedNodes = nodesInLevel.filter(n => !processed.has(n.id));
//             if (!unprocessedNodes.length) return;

//             // 如果只有一个节点（无同级），直线排列
//             if (unprocessedNodes.length === 1) {
//                 const node = unprocessedNodes[0];
//                 node.pos[0] = baseX;
//                 node.pos[1] = parentY; // 直线对齐
//                 processed.add(node.id);

//                 // 递归布局下一级
//                 const nextLevel = isLeft ? level + 1 : level + 1;
//                 const nextNodes = (isLeft ? levelsMapLeft : levelsMapRight).get(nextLevel)?.filter(n => !processed.has(n.id));
//                 arrangeFan(nextNodes, nextLevel, direction, node.pos[0], node.pos[1]);
//                 return;
//             }

//             // 多个节点，扇形排列
//             const totalAngle = Math.min(180, (unprocessedNodes.length - 1) * minAngleGap); // 总角度不超过 180 度
//             const startAngle = -totalAngle / 2;
//             const angleStep = totalAngle / (unprocessedNodes.length - 1 || 1);

//             unprocessedNodes.forEach((node, index) => {
//                 processed.add(node.id);

//                 const angle = startAngle + index * angleStep;
//                 const rad = (angle * Math.PI) / 180;
//                 node.pos[0] = baseX + (isLeft ? -radius * Math.cos(rad) : radius * Math.cos(rad));
//                 node.pos[1] = parentY + radius * Math.sin(rad);

//                 // 避免重叠：调整 y 坐标
//                 const nodesAtX = nodes.filter(n => Math.abs(n.pos[0] - node.pos[0]) < maxNodeWidth && n.id !== node.id);
//                 nodesAtX.sort((a, b) => a.pos[1] - b.pos[1]);
//                 nodesAtX.forEach((otherNode, idx) => {
//                     if (otherNode.id < node.id) {
//                         const otherHeight = otherNode.size[1] || maxNodeHeight;
//                         const nodeHeight = node.size[1] || maxNodeHeight;
//                         const minGap = (otherHeight + nodeHeight) / 2 + 50;
//                         if (Math.abs(node.pos[1] - otherNode.pos[1]) < minGap) {
//                             if (node.pos[1] > otherNode.pos[1]) {
//                                 node.pos[1] = otherNode.pos[1] + minGap;
//                             } else {
//                                 node.pos[1] = otherNode.pos[1] - minGap;
//                             }
//                         }
//                     }
//                 });

//                 // 递归布局下一级
//                 const nextLevel = isLeft ? level + 1 : level + 1;
//                 const nextNodes = (isLeft ? levelsMapLeft : levelsMapRight).get(nextLevel)?.filter(n => !processed.has(n.id));
//                 arrangeFan(nextNodes, nextLevel, direction, node.pos[0], node.pos[1]);
//             });
//         }

//         // 布局左侧（传入节点）
//         for (let level = 1; level <= maxLevelLeft; level++) {
//             const nodesInLevel = levelsMapLeft.get(level)?.filter(n => !processed.has(n.id));
//             arrangeFan(nodesInLevel, level, "left", lastSampler.pos[0], lastSampler.pos[1]);
//         }

//         // 布局右侧（输出节点）
//         for (let level = 1; level <= maxLevelRight; level++) {
//             const nodesInLevel = levelsMapRight.get(level)?.filter(n => !processed.has(n.id));
//             arrangeFan(nodesInLevel, level, "right", lastSampler.pos[0], lastSampler.pos[1]);
//         }

//         // 处理未布局的节点
//         nodes.forEach(node => {
//             if (!processed.has(node.id)) {
//                 const level = levelsLeft.get(node.id) || 0;
//                 node.pos[0] = centerX + (level * baseRadius);
//                 node.pos[1] = centerY + (nodes.indexOf(node) * (maxNodeHeight + 50));
//                 processed.add(node.id);
//             }
//         });

//         app.canvas.setDirty(true, true);
//     }

//     static restoreWorkflow() {
//         if (!originalLayout) {
//             console.log("No previous layout to restore.");
//             return;
//         }
//         const graph = app.graph;
//         originalLayout.forEach(saved => {
//             const node = graph._nodes.find(n => n.id === saved.id);
//             if (node) {
//                 node.pos[0] = saved.pos[0];
//                 node.pos[1] = saved.pos[1];
//             }
//         });
//         app.canvas.setDirty(true, true);
//         originalLayout = null;
//     }
// }

// app.registerExtension({
//     name: "KayTool.LayoutOptimizer",
//     setup() {
//         const orig = LGraphCanvas.prototype.getCanvasMenuOptions;
//         LGraphCanvas.prototype.getCanvasMenuOptions = function () {
//             const options = orig.apply(this, arguments) || [];
//             const showWorkflowPNG = app.ui.settings.getSettingValue("KayTool.ShowWorkflowPNG");
//             if (showWorkflowPNG) {
//                 const newOptions = [...options];
//                 let KayToolMenu = newOptions.find(opt => opt && opt.content === "KayTool");
//                 if (!KayToolMenu) {
//                     KayToolMenu = {
//                         content: "KayTool",
//                         submenu: { options: [] }
//                     };
//                     newOptions.push(null, KayToolMenu);
//                 }
//                 KayToolMenu.submenu.options = KayToolMenu.submenu.options || [];

//                 KayToolMenu.submenu.options.push({
//                     content: "Layout Tools",
//                     submenu: {
//                         options: [
//                             {
//                                 content: "优化工作流",
//                                 callback: () => {
//                                     LayoutOptimizer.optimizeWorkflow();
//                                 },
//                             },
//                             {
//                                 content: "恢复",
//                                 callback: () => {
//                                     LayoutOptimizer.restoreWorkflow();
//                                 },
//                             },
//                         ],
//                     },
//                 });

//                 return newOptions;
//             }
//             return options;
//         };
//     },
// });