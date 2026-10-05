import BubbleEffect from "./BubbleEffect";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/BubbleEffectCtrl")
export default class BubbleEffectCtrl extends cc.Component {
    static prefabUrl = "assets/resources/prefabs/BubbleEffect";
    static className = "BubbleEffectCtrl";

    ui: BubbleEffect = null;

    initData(data?: { soil_plant_id?: unknown }): void {
        if (data) {
            data.soil_plant_id;
        }
    }

    addButtonListen(): void {}

    onUILoad(): void {
        this.ui = this.node.addComponent(BubbleEffect);
    }

    start(): void {}

    onLoad(): void {
        this.onUILoad();
        this.addButtonListen();
    }
}
