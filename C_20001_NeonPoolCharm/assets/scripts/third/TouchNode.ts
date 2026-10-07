const { ccclass } = cc._decorator;

@ccclass
export default class TouchNode extends cc.Component {
    static URL = "db://assets/resources/prefabs/TouchNode.prefab";

    TouchNode: cc.Node = null;

    onLoad(): void {
        this.TouchNode = this.node;
    }
}
