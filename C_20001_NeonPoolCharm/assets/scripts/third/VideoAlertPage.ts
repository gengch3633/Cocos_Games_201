const { ccclass } = cc._decorator;

@ccclass
export default class VideoAlertPage extends cc.Component {
    VideoAlertPage: cc.Node = null;
    panel_window: cc.Node = null;
    btnOk: cc.Node = null;
    close1: cc.Node = null;

    static URL = "db://assets/resources/pages/VideoAlertPage.prefab";

    onLoad(): void {
        this.VideoAlertPage = this.node;
        this.panel_window = this.VideoAlertPage.getChildByName("panel_window");
        this.btnOk = this.panel_window.getChildByName("btnOk");
        this.close1 = this.panel_window.getChildByName("close1");
    }
}
