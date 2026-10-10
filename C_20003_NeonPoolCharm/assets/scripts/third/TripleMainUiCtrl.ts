import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import TripleMainUi from "./TripleMainUi";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/TripleMainUiCtrl")
export default class TripleMainUiCtrl extends BasePageCtrl {
    ui = null;

    _animType = null;

    _touchControl = null;

    _hasPeneLock = null;

    _hasBlack = null;

    _hasTouchLock = null;

    _hasBlackTouch = null;

    static prefabUrl = "assets/resources/prefabs/TripleMainUi";

    static className = "TripleMainUiCtrl";

    onLoad() {
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

    clickClose() {
        this.hide();
    }

    loadScene() {}

    addButtonListen() {}

    start() {}

    onUILoad() {
        this.ui = this.node.addComponent(TripleMainUi);
        this.loadScene();
    }
}
