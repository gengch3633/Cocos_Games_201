const { ccclass } = cc._decorator;

@ccclass
export default class RecordReason extends cc.Component {
    RecordReason = null;
    node = null;
    node_rect = null;
    label_tips = null;
    spr_jt = null;

    static URL = "db://assets/resources/prefabs/RecordReason.prefab";

    onLoad() {
        this.RecordReason = this.node;
        this.node_rect = this.RecordReason.getChildByName("node_rect");
        this.label_tips = this.RecordReason.getChildByName("label_tips");
        this.spr_jt = this.RecordReason.getChildByName("spr_jt");
    }
}
