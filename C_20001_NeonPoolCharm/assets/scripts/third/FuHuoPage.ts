const { ccclass } = cc._decorator;

@ccclass
export default class FuHuoPage extends cc.Component {
    static URL = "db://assets/resources/pages/FuHuoPage.prefab";

    FuHuoPage: cc.Node = null;
    page_bg: cc.Node = null;
    btn_close: cc.Node = null;
    btn_get: cc.Node = null;
    icon_ad2: cc.Node = null;
    adTipItem: cc.Node = null;
    hongbao_label: cc.Node = null;

    onLoad(): void {
        this.FuHuoPage = this.node;
        this.page_bg = this.FuHuoPage.getChildByName("page_bg");
        this.btn_close = this.page_bg.getChildByName("btn_close");
        this.btn_get = this.page_bg.getChildByName("btn_get");
        this.icon_ad2 = this.btn_get.getChildByName("icon_ad2");
        this.adTipItem = this.page_bg.getChildByName("adTipItem");
        this.hongbao_label = this.adTipItem.getChildByName("layoutNode").getChildByName("hongbao_label");
    }
}
