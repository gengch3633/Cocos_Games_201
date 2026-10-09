const { ccclass } = cc._decorator;

@ccclass
export default class BuyPropPage extends cc.Component {

    BuyPropPage = null;

    node = null;

    page_bg = null;

    pop_close = null;

    bg04 = null;

    bg05 = null;

    bg07 = null;

    title_bg = null;

    prop_icon = null;

    title_label = null;

    desc_label = null;

    btn_green = null;

    btn_content = null;

    btn_buy_label = null;

    diamond_0 = null;

    btn_label = null;

    static URL = "db://assets/resources/pages/BuyPropPage.prefab";

    onLoad() {
        this.BuyPropPage = this.node;
        this.page_bg = this.BuyPropPage.getChildByName("page_bg");
        this.pop_close = this.page_bg.getChildByName("pop_close");
        this.bg04 = this.page_bg.getChildByName("bg04");
        this.bg05 = this.bg04.getChildByName("bg05");
        this.bg07 = this.bg04.getChildByName("bg07");
        this.title_bg = this.page_bg.getChildByName("title_bg");
        this.prop_icon = this.page_bg.getChildByName("prop_icon");
        this.title_label = this.page_bg.getChildByName("title_label");
        this.desc_label = this.page_bg.getChildByName("desc_label");
        this.btn_green = this.page_bg.getChildByName("btn_green");
        this.btn_content = this.btn_green.getChildByName("btn_content");
        this.btn_buy_label = this.btn_content.getChildByName("btn_buy_label");
        this.diamond_0 = this.btn_content.getChildByName("diamond_0");
        this.btn_label = this.btn_content.getChildByName("btn_label");
    }
}
