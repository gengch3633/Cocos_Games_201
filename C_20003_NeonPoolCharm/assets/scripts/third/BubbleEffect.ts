const { ccclass } = cc._decorator;

@ccclass
export default class BubbleEffect extends cc.Component {

    BubbleEffect = null;

    node = null;

    node_plant = null;

    spr_plant = null;

    label_add_num = null;

    static URL = "db://assets/resources/prefabs/BubbleEffect.prefab";

    onLoad() {
        this.BubbleEffect = this.node;
        this.node_plant = this.BubbleEffect.getChildByName("node_plant");
        this.spr_plant = this.node_plant.getChildByName("spr_plant");
        this.label_add_num = this.BubbleEffect.getChildByName("label_add_num");
    }
}
