const { ccclass } = cc._decorator;

@ccclass
export default class DrawIItem extends cc.Component {
    DrawIItem: cc.Node = null;
    spr_choose: cc.Node = null;
    label_cash: cc.Node = null;

    static URL = "db://assets/resources/prefabs/DrawIItem.prefab";

    onLoad(): void {
        this.DrawIItem = this.node;
        this.spr_choose = this.DrawIItem.getChildByName("spr_choose");
        this.label_cash = this.DrawIItem.getChildByName("label_cash");
    }
}
