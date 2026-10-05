const { ccclass } = cc._decorator;

@ccclass
export default class BuyPropPage extends cc.Component {
    static URL = "db://assets/resources/pages/BuyPropPage.prefab";

    BuyPropPage: cc.Node = null;
    page_bg: cc.Node = null;
    pop_close: cc.Node = null;
    bg04: cc.Node = null;
    bg05: cc.Node = null;
    bg07: cc.Node = null;
    title_bg: cc.Node = null;
    prop_icon: cc.Node = null;
    title_label: cc.Node = null;
    desc_label: cc.Node = null;
    btn_green: cc.Node = null;
    btn_content: cc.Node = null;
    btn_buy_label: cc.Node = null;
    diamond_0: cc.Node = null;
    btn_label: cc.Node = null;

    onLoad(): void {
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
