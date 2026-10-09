const { ccclass } = cc._decorator;

@ccclass
export default class MainUI extends cc.Component {
    MainUI = null;
    bg = null;
    top_area = null;
    btn_setting = null;
    holeSprite = null;
    tableSprite = null;
    bottom_area = null;
    idLabel = null;
    versionLabel = null;
    btn_star = null;
    cue_label = null;
    star_redpoint = null;
    btn_paly = null;
    ptb_size_container = null;
    guideTips = null;
    bg_qipao_ptb2 = null;
    withdrawRichText = null;
    layoutNode = null;
    btn_play_label = null;
    roundRichText = null;
    turnProgressBar = null;
    progressLabel = null;
    light = null;

    static URL = "db://assets/resources/pages/MainUI.prefab";

    onLoad() {
        this.MainUI = this.node;
        this.bg = this.MainUI.getChildByName("bg");
        this.top_area = this.MainUI.getChildByName("top_area");
        this.btn_setting = this.top_area.getChildByName("btn_setting");
        this.holeSprite = this.MainUI.getChildByName("holeSprite");
        this.tableSprite = this.MainUI.getChildByName("tableSprite");
        this.bottom_area = this.MainUI.getChildByName("bottom_area");
        this.idLabel = this.bottom_area.getChildByName("idLabel");
        this.versionLabel = this.bottom_area.getChildByName("versionLabel");
        this.btn_star = this.bottom_area.getChildByName("btn_star");
        this.cue_label = this.btn_star.getChildByName("cue_label");
        this.star_redpoint = this.btn_star.getChildByName("star_redpoint");
        this.btn_paly = this.bottom_area.getChildByName("btn_paly");
        this.ptb_size_container = this.btn_paly.getChildByName("ptb_size_container");
        this.guideTips = this.ptb_size_container.getChildByName("guideTips");
        this.bg_qipao_ptb2 = this.ptb_size_container.getChildByName("bg_qipao_ptb2");
        this.withdrawRichText = this.bg_qipao_ptb2.getChildByName("withdrawRichText");
        this.layoutNode = this.btn_paly.getChildByName("layoutNode");
        this.btn_play_label = this.layoutNode.getChildByName("btn_play_label");
        this.roundRichText = this.layoutNode.getChildByName("roundRichText");
        this.turnProgressBar = this.layoutNode.getChildByName("progressNode").getChildByName("turnProgressBar");
        this.progressLabel = this.turnProgressBar.getChildByName("progressLabel");
        this.light = this.btn_paly.getChildByName("light");
    }
}
