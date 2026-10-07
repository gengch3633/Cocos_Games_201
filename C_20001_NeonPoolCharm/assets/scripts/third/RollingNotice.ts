const { ccclass } = cc._decorator;

@ccclass
export default class RollingNotice extends cc.Component {
    static URL = "db://assets/resources/prefabs/RollingNotice.prefab";

    RollingNotice: cc.Node = null;
    maskNode: cc.Node = null;

    onLoad(): void {
        this.RollingNotice = this.node;
        this.maskNode = this.RollingNotice.getChildByName("maskNode");
    }
}
