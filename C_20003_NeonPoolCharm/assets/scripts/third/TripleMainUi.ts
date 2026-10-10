const { ccclass } = cc._decorator;

@ccclass
export default class TripleMainUi extends cc.Component {
    TripleMainUi = null;

    node = null;

    static URL = "db://assets/resources/prefabs/TripleMainUi.prefab";

    onLoad() {
        this.TripleMainUi = this.node;
    }
}
