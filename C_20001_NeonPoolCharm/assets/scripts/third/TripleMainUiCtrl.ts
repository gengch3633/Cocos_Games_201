import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import TripleMainUi from "./TripleMainUi";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/TripleMainUiCtrl")
export default class TripleMainUiCtrl extends BasePageCtrl {
    static prefabUrl = "assets/resources/prefabs/TripleMainUi";
    static className = "TripleMainUiCtrl";

    ui: TripleMainUi = null;

    onLoad(): void {
        this.onUILoad();
        this._animType = AnimType.SCALE;
        this._touchControl = false;
        this._hasPeneLock = true;
        this._hasBlack = true;
        this._hasTouchLock = false;
        this._hasBlackTouch = true;
        super.onLoad();
        this.addButtonListen();
    }

    clickClose(): void {
        this.hide();
    }

    loadScene(): void {}

    addButtonListen(): void {}

    start(): void {}

    onUILoad(): void {
        this.ui = this.node.addComponent(TripleMainUi);
        this.loadScene();
    }
}
