const { ccclass } = cc._decorator;

@ccclass
export default class RollingNotice extends cc.Component {
    RollingNotice: cc.Node = null;
    maskNode: cc.Node = null;

    static URL = "db://assets/resources/prefabs/RollingNotice.prefab";

    onLoad(): void {
        this.RollingNotice = this.node;
        this.maskNode = this.RollingNotice.getChildByName("maskNode");
    }
}
