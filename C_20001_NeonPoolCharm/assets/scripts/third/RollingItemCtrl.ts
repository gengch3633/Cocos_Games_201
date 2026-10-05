import rollingItem from "./rollingItem";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/RollingItemCtrl")
export default class RollingItemCtrl extends cc.Component {
    static prefabUrl = "assets/resources/prefabs/rollingItem";
    static className = "RollingItemCtrl";

    ui: rollingItem = null;

    onLoad(): void {
        this.onUILoad();
        this.addButtonListen();
    }

    start(): void {}

    onUILoad(): void {
        this.ui = this.node.addComponent(rollingItem);
    }

    addButtonListen(): void {}

    initData(): void {}
}
