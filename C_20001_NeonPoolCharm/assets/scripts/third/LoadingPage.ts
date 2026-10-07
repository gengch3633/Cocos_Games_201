const { ccclass } = cc._decorator;

@ccclass
export default class LoadingPage extends cc.Component {
    static URL = "db://assets/resources/pages/LoadingPage.prefab";

    LoadingPage: cc.Node = null;
    spr_loading: cc.Node = null;
    label_text: cc.Node = null;

    onLoad(): void {
        this.LoadingPage = this.node;
        this.spr_loading = this.LoadingPage.getChildByName("spr_loading");
        this.label_text = this.LoadingPage.getChildByName("label_text");
    }
}
