const { ccclass } = cc._decorator;

@ccclass
export default class VideoAlertPage extends cc.Component {
    static URL = "db://assets/resources/pages/VideoAlertPage.prefab";

    VideoAlertPage: cc.Node = null;
    panel_window: cc.Node = null;
    btnOk: cc.Node = null;
    close1: cc.Node = null;

    onLoad(): void {
        this.VideoAlertPage = this.node;
        this.panel_window = this.VideoAlertPage.getChildByName("panel_window");
        this.btnOk = this.panel_window.getChildByName("btnOk");
        this.close1 = this.panel_window.getChildByName("close1");
    }
}
