const { ccclass } = cc._decorator;

@ccclass
export default class CuePage extends cc.Component {
    static URL = "db://assets/resources/pages/CuePage.prefab";

    CuePage: cc.Node = null;
    page_bg: cc.Node = null;
    bg_ditu: cc.Node = null;
    top: cc.Node = null;
    btn_back: cc.Node = null;
    progressBar: cc.Node = null;
    progressLabel: cc.Node = null;
    cue_item_scv: cc.Node = null;
    cue_item_scv_view: cc.Node = null;
    cue_item_content: cc.Node = null;

    onLoad(): void {
        this.CuePage = this.node;
        this.page_bg = this.CuePage.getChildByName("page_bg");
        this.bg_ditu = this.page_bg.getChildByName("bg_ditu");
        this.top = this.page_bg.getChildByName("top");
        this.btn_back = this.top.getChildByName("btn_back");
        this.progressBar = this.top.getChildByName("progressBar");
        this.progressLabel = this.progressBar.getChildByName("progressLabel");
        this.cue_item_scv = this.top.getChildByName("cue_item_scv");
        this.cue_item_scv_view = this.cue_item_scv.getChildByName("cue_item_scv_view");
        this.cue_item_content = this.cue_item_scv_view.getChildByName("cue_item_content");
    }
}
