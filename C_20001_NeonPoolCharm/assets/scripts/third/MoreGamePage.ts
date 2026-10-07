const { ccclass } = cc._decorator;

@ccclass
export default class MoreGamePage extends cc.Component {
    MoreGamePage: cc.Node = null;
    webViewNode: cc.Node = null;
    top: cc.Node = null;
    close: cc.Node = null;

    static URL = "db://assets/resources/pages/MoreGamePage.prefab";

    onLoad(): void {
        this.MoreGamePage = this.node;
        this.webViewNode = this.MoreGamePage.getChildByName("webViewNode");
        this.top = this.MoreGamePage.getChildByName("top");
        this.close = this.top.getChildByName("close");
    }
}
