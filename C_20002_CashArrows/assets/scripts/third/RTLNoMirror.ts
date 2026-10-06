const { ccclass, property } = cc._decorator;

@ccclass
export default class RTLNoMirror extends cc.Component {
    @property({
        default: "", tooltip: "可选：标注为什么这个节点不需要镜像（背景 / 对称 / 已手动适配 等）"
    })
    note: string = "";
}
