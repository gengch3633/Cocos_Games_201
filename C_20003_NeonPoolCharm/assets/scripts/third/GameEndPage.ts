const { ccclass } = cc._decorator;

@ccclass
export default class GameEndPage extends cc.Component {

    GameEndPage = null;
    node = null;
    failed = null;
    defeat = null;
    success = null;
    victory = null;

    static URL = "db://assets/resources/pages/GameEndPage.prefab";

    onLoad() {
        this.GameEndPage = this.node;
        this.failed = this.GameEndPage.getChildByName("failed");
        this.defeat = this.failed.getChildByName("defeat");
        this.success = this.GameEndPage.getChildByName("success");
        this.victory = this.success.getChildByName("victory");
    }
}
