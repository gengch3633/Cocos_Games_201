const { ccclass } = cc._decorator;

@ccclass
export default class RollingNotice extends cc.Component {
    RollingNotice = null;
    node = null;
    maskNode = null;

    static URL = "db://assets/resources/prefabs/RollingNotice.prefab";

    onLoad() {
        this.RollingNotice = this.node;
        this.maskNode = this.RollingNotice.getChildByName("maskNode");
    }
}
