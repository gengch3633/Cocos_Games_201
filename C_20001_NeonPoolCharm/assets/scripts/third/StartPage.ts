const { ccclass } = cc._decorator;

@ccclass
export default class StartPage extends cc.Component {
    static URL = "db://assets/resources/pages/StartPage.prefab";

    StartPage: cc.Node = null;

    onLoad(): void {
        this.StartPage = this.node;
    }
}
