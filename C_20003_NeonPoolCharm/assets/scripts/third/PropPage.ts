const { ccclass } = cc._decorator;

@ccclass
export default class PropPage extends cc.Component {
    PropPage = null;

    node = null;

    page_bg = null;

    prop_remove = null;

    prop_redo = null;

    prop_refresh = null;

    des = null;

    btn_blue = null;

    Dapatkan = null;

    prop_diamond = null;

    bracket = null;

    diamond_num = null;

    btn_green = null;

    prop_video = null;

    prop_close = null;

    static URL = "db://assets/resources/pages/PropPage.prefab";

    onLoad() {
        this.PropPage = this.node;
        this.page_bg = this.PropPage.getChildByName("page_bg");
        this.prop_remove = this.page_bg.getChildByName("prop_remove");
        this.prop_redo = this.page_bg.getChildByName("prop_redo");
        this.prop_refresh = this.page_bg.getChildByName("prop_refresh");
        this.des = this.page_bg.getChildByName("des");
        this.btn_blue = this.page_bg.getChildByName("btn_blue");
        this.Dapatkan = this.btn_blue.getChildByName("Dapatkan");
        this.prop_diamond = this.btn_blue.getChildByName("prop_diamond");
        this.bracket = this.btn_blue.getChildByName("bracket");
        this.diamond_num = this.btn_blue.getChildByName("diamond_num");
        this.btn_green = this.page_bg.getChildByName("btn_green");
        this.prop_video = this.btn_green.getChildByName("prop_video");
        this.prop_close = this.PropPage.getChildByName("prop_close");
    }
}
