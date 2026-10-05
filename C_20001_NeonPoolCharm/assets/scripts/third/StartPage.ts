const { ccclass } = cc._decorator;

@ccclass
export default class StartPage extends cc.Component {
    static URL = "db://assets/resources/pages/StartPage.prefab";

    get StartPage(): cc.Node {
        return this.node;
    }
}
