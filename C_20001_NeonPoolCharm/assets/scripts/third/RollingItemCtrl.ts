import RollingItem from "./rollingItem";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/RollingItemCtrl")
export default class RollingItemCtrl extends cc.Component {
    ui: RollingItem = null;

    static prefabUrl = "assets/resources/prefabs/rollingItem";
    static className = "RollingItemCtrl";

    onLoad(): void {
        this.onUILoad();
        this.addButtonListen();
    }

    start(): void {
    }

    onUILoad(): void {
        this.ui = this.node.addComponent(RollingItem);
    }

    addButtonListen(): void {
    }

    initData(): void {
    }
}
