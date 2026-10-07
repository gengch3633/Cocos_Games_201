const { ccclass } = cc._decorator;

@ccclass
export default class MainUI extends cc.Component {
    static URL = "db://assets/resources/pages/MainUI.prefab";

    MainUI: cc.Node = null;
    bg: cc.Node = null;
    top_area: cc.Node = null;
    btn_setting: cc.Node = null;
    holeSprite: cc.Node = null;
    tableSprite: cc.Node = null;
    bottom_area: cc.Node = null;
    idLabel: cc.Node = null;
    versionLabel: cc.Node = null;
    btn_star: cc.Node = null;
    cue_label: cc.Node = null;
    star_redpoint: cc.Node = null;
    btn_paly: cc.Node = null;
    ptb_size_container: cc.Node = null;
    guideTips: cc.Node = null;
    bg_qipao_ptb2: cc.Node = null;
    withdrawRichText: cc.Node = null;
    layoutNode: cc.Node = null;
    btn_play_label: cc.Node = null;
    roundRichText: cc.Node = null;
    turnProgressBar: cc.Node = null;
    progressLabel: cc.Node = null;
    light: cc.Node = null;

    onLoad(): void {
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
