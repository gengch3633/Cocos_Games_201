const { ccclass } = cc._decorator;

@ccclass
export default class MoreGamePage extends cc.Component {
    MoreGamePage = null;
    node = null;
    webViewNode = null;
    top = null;
    close = null;

    static URL = "db://assets/resources/pages/MoreGamePage.prefab";

    onLoad() {
        this.MoreGamePage = this.node;
        this.webViewNode = this.MoreGamePage.getChildByName("webViewNode");
        this.top = this.MoreGamePage.getChildByName("top");
        this.close = this.top.getChildByName("close");
    }
}
