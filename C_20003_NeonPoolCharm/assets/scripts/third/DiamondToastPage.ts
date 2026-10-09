const { ccclass } = cc._decorator;

@ccclass
export default class DiamondToastPage extends cc.Component {
    DiamondToastPage = null;

    node = null;

    bg = null;

    diamond = null;

    diamond_num = null;

    cash = null;

    cash_num = null;

    static URL = "db://assets/resources/pages/DiamondToastPage.prefab";

    onLoad() {
        this.DiamondToastPage = this.node;
        this.bg = this.DiamondToastPage.getChildByName("bg");
        this.diamond = this.bg.getChildByName("diamond");
        this.diamond_num = this.diamond.getChildByName("diamond_num");
        this.cash = this.bg.getChildByName("cash");
        this.cash_num = this.cash.getChildByName("cash_num");
    }
}
