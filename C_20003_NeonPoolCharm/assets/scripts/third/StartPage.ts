const { ccclass } = cc._decorator;

@ccclass
export default class StartPage extends cc.Component {
    StartPage = null;
    node = null;

    static URL = "db://assets/resources/pages/StartPage.prefab";

    onLoad() {
        this.StartPage = this.node;
    }
}
