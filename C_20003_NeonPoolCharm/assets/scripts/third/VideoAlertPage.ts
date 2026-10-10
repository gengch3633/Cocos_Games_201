const { ccclass } = cc._decorator;

@ccclass
export default class VideoAlertPage extends cc.Component {
    VideoAlertPage = null;

    node = null;

    panel_window = null;

    btnOk = null;

    close1 = null;

    static URL = "db://assets/resources/pages/VideoAlertPage.prefab";

    onLoad() {
        this.VideoAlertPage = this.node;
        this.panel_window = this.VideoAlertPage.getChildByName("panel_window");
        this.btnOk = this.panel_window.getChildByName("btnOk");
        this.close1 = this.panel_window.getChildByName("close1");
    }
}
