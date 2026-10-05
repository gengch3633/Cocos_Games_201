const { ccclass } = cc._decorator;

@ccclass
export default class DiamondToastPage extends cc.Component {
    static URL = "db://assets/resources/pages/DiamondToastPage.prefab";

    DiamondToastPage: cc.Node = null;
    bg: cc.Node = null;
    diamond: cc.Node = null;
    diamond_num: cc.Node = null;
    cash: cc.Node = null;
    cash_num: cc.Node = null;

    onLoad(): void {
        this.DiamondToastPage = this.node;
        this.bg = this.DiamondToastPage.getChildByName("bg");
        this.diamond = this.bg.getChildByName("diamond");
        this.diamond_num = this.diamond.getChildByName("diamond_num");
        this.cash = this.bg.getChildByName("cash");
        this.cash_num = this.cash.getChildByName("cash_num");
    }
}
