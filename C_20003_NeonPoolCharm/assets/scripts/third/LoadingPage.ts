const { ccclass } = cc._decorator;

@ccclass
export default class LoadingPage extends cc.Component {
    LoadingPage = null;

    node = null;

    spr_loading = null;

    label_text = null;

    static URL = "db://assets/resources/pages/LoadingPage.prefab";

    onLoad() {
        this.LoadingPage = this.node;
        this.spr_loading = this.LoadingPage.getChildByName("spr_loading");
        this.label_text = this.LoadingPage.getChildByName("label_text");
    }
}
