const { ccclass } = cc._decorator;

@ccclass
export default class FuHuoPage extends cc.Component {

    FuHuoPage = null;
    node = null;
    page_bg = null;
    btn_close = null;
    btn_get = null;
    icon_ad2 = null;
    adTipItem = null;
    hongbao_label = null;

    static URL = "db://assets/resources/pages/FuHuoPage.prefab";

    onLoad() {
        this.FuHuoPage = this.node;
        this.page_bg = this.FuHuoPage.getChildByName("page_bg");
        this.btn_close = this.page_bg.getChildByName("btn_close");
        this.btn_get = this.page_bg.getChildByName("btn_get");
        this.icon_ad2 = this.btn_get.getChildByName("icon_ad2");
        this.adTipItem = this.page_bg.getChildByName("adTipItem");
        this.hongbao_label = this.adTipItem.getChildByName("layoutNode").getChildByName("hongbao_label");
    }
}
