import BubbleEffect from "./BubbleEffect";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/BubbleEffectCtrl")
export default class BubbleEffectCtrl extends cc.Component {

    ui = null;

    static prefabUrl = "assets/resources/prefabs/BubbleEffect";

    static className = "BubbleEffectCtrl";

    initData(e) {
        e && e.soil_plant_id;
    }

    addButtonListen() {
    }

    onUILoad() {
        this.ui = this.node.addComponent(BubbleEffect);
    }

    start() {
    }

    onLoad() {
        this.onUILoad();
        this.addButtonListen();
    }
}
