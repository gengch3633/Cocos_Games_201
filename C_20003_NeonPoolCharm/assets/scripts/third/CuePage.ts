const { ccclass } = cc._decorator;

@ccclass
export default class CuePage extends cc.Component {
    static URL = "db://assets/resources/pages/CuePage.prefab";

    CuePage = null;
    page_bg = null;
    bg_ditu = null;
    top = null;
    btn_back = null;
    progressBar = null;
    progressLabel = null;
    cue_item_scv = null;
    cue_item_scv_view = null;
    cue_item_content = null;

    constructor() {
        super();
        this.node = null;
    }

    onLoad() {
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
