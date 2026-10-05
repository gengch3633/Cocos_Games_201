const { ccclass } = cc._decorator;

@ccclass
export default class UsePropPage extends cc.Component {
    static URL = "db://assets/resources/pages/UsePropPage.prefab";

    UsePropPage: cc.Node = null;
    page_bg: cc.Node = null;
    btn_close: cc.Node = null;
    bg_8: cc.Node = null;
    sp_icon_line: cc.Node = null;
    sp_icon_prop: cc.Node = null;
    richText: cc.Node = null;
    btn_get: cc.Node = null;
    icon_ad2: cc.Node = null;
    adTipItem: cc.Node = null;
    hongbao_label: cc.Node = null;

    onLoad(): void {
        this.UsePropPage = this.node;
        this.page_bg = this.UsePropPage.getChildByName("page_bg");
        this.btn_close = this.page_bg.getChildByName("btn_close");
        this.bg_8 = this.page_bg.getChildByName("bg_8");
        this.sp_icon_line = this.bg_8.getChildByName("sp_icon_line");
        this.sp_icon_prop = this.bg_8.getChildByName("sp_icon_prop");
        this.richText = this.page_bg.getChildByName("richText");
        this.btn_get = this.page_bg.getChildByName("btn_get");
        this.icon_ad2 = this.btn_get.getChildByName("icon_ad2");
        this.adTipItem = this.page_bg.getChildByName("adTipItem");
        this.hongbao_label = this.adTipItem.getChildByName("layoutNode").getChildByName("hongbao_label");
    }
}
