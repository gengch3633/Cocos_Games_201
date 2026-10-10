const { ccclass } = cc._decorator;

@ccclass
export default class TouchNode extends cc.Component {
    TouchNode = null;

    node = null;

    static URL = "db://assets/resources/prefabs/TouchNode.prefab";

    onLoad() {
        this.TouchNode = this.node;
    }
}
