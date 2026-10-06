// @ts-nocheck


var i = cc.Class({
extends: cc.Component,
properties: {
note: {
default: "",
tooltip: "可选：标注为什么这个节点不需要镜像（背景 / 对称 / 已手动适配 等）"
}
}
});
export default i;
