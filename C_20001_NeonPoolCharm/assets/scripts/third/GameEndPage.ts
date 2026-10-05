const { ccclass } = cc._decorator;

@ccclass
export default class GameEndPage extends cc.Component {
    GameEndPage: cc.Node = null;
    failed: cc.Node = null;
    defeat: cc.Node = null;
    success: cc.Node = null;
    victory: cc.Node = null;

    static URL = "db://assets/resources/pages/GameEndPage.prefab";

    onLoad(): void {
        this.GameEndPage = this.node;
        this.failed = this.GameEndPage.getChildByName("failed");
        this.defeat = this.failed.getChildByName("defeat");
        this.success = this.GameEndPage.getChildByName("success");
        this.victory = this.success.getChildByName("victory");
    }
}
