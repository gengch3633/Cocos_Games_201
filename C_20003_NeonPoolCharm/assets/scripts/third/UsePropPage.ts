const { ccclass } = cc._decorator;

@ccclass
export default class UsePropPage extends cc.Component {
    UsePropPage = null;

    node = null;

    page_bg = null;

    btn_close = null;

    bg_8 = null;

    sp_icon_line = null;

    sp_icon_prop = null;

    richText = null;

    btn_get = null;

    icon_ad2 = null;

    adTipItem = null;

    hongbao_label = null;

    static URL = "db://assets/resources/pages/UsePropPage.prefab";

    onLoad() {
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
