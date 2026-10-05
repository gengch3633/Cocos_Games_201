const { ccclass } = cc._decorator;

@ccclass
export default class RecordReason extends cc.Component {
    RecordReason: cc.Node = null;
    node_rect: cc.Node = null;
    label_tips: cc.Node = null;
    spr_jt: cc.Node = null;

    static URL = "db://assets/resources/prefabs/RecordReason.prefab";

    onLoad(): void {
        this.RecordReason = this.node;
        this.node_rect = this.RecordReason.getChildByName("node_rect");
        this.label_tips = this.RecordReason.getChildByName("label_tips");
        this.spr_jt = this.RecordReason.getChildByName("spr_jt");
    }
}
