const { ccclass } = cc._decorator;

@ccclass
export default class TouchNode extends cc.Component {
    TouchNode: cc.Node = null;

    static URL = "db://assets/resources/prefabs/TouchNode.prefab";

    onLoad(): void {
        this.TouchNode = this.node;
    }
}
