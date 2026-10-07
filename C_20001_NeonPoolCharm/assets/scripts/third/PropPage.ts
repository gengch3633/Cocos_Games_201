const { ccclass } = cc._decorator;

@ccclass
export default class PropPage extends cc.Component {
    static URL = "db://assets/resources/pages/PropPage.prefab";

    PropPage: cc.Node = null;
    page_bg: cc.Node = null;
    prop_remove: cc.Node = null;
    prop_redo: cc.Node = null;
    prop_refresh: cc.Node = null;
    des: cc.Node = null;
    btn_blue: cc.Node = null;
    Dapatkan: cc.Node = null;
    prop_diamond: cc.Node = null;
    bracket: cc.Node = null;
    diamond_num: cc.Node = null;
    btn_green: cc.Node = null;
    prop_video: cc.Node = null;
    prop_close: cc.Node = null;

    onLoad(): void {
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
