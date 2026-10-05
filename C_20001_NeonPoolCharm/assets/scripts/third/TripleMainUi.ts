const { ccclass } = cc._decorator;

@ccclass
export default class TripleMainUi extends cc.Component {
    TripleMainUi: cc.Node = null;

    static URL = "db://assets/resources/prefabs/TripleMainUi.prefab";

    onLoad(): void {
        this.TripleMainUi = this.node;
    }
}
