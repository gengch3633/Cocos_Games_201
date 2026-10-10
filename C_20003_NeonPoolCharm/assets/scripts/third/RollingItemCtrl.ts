import rollingItem from "./rollingItem";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/RollingItemCtrl")
export default class RollingItemCtrl extends cc.Component {
    ui = null;

    static prefabUrl = "assets/resources/prefabs/rollingItem";
    static className = "RollingItemCtrl";

    onLoad() {
        this.onUILoad();
        this.addButtonListen();
    }

    start() {}

    onUILoad() {
        this.ui = this.node.addComponent(rollingItem);
    }

    addButtonListen() {}

    initData() {}
}
