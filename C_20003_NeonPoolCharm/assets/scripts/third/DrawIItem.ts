const { ccclass } = cc._decorator;

@ccclass
export default class DrawIItem extends cc.Component {
    DrawIItem = null;

    node = null;

    spr_choose = null;

    label_cash = null;

    static URL = "db://assets/resources/prefabs/DrawIItem.prefab";

    onLoad() {
        this.DrawIItem = this.node;
        this.spr_choose = this.DrawIItem.getChildByName("spr_choose");
        this.label_cash = this.DrawIItem.getChildByName("label_cash");
    }
}
