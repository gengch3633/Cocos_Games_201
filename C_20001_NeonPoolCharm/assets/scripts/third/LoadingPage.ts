const { ccclass } = cc._decorator;

@ccclass
export default class LoadingPage extends cc.Component {
    static URL = "db://assets/resources/pages/LoadingPage.prefab";

    get LoadingPage(): cc.Node {
        return this.node;
    }

    get spr_loading(): cc.Node {
        return this.LoadingPage.getChildByName("spr_loading");
    }

    get label_text(): cc.Node {
        return this.LoadingPage.getChildByName("label_text");
    }
}
