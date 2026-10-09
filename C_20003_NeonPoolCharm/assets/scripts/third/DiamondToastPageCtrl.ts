import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import DiamondToastPage from "./DiamondToastPage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/DiamondToastPageCtrl")
export default class DiamondToastPageCtrl extends BasePageCtrl {
    ui = null;

    _animType = null;

    _touchControl = null;

    _hasPeneLock = null;

    _hasBlack = null;

    _hasTouchLock = null;

    static prefabUrl = "DiamondToastPage";

    static className = "DiamondToastPageCtrl";

    _init() {}

    onUILoad() {
        this.ui = this.node.addComponent(DiamondToastPage);
    }

    start() {}

    addButtonListen() {}

    onLoad() {
        this.onUILoad();
        this._animType = AnimType.SCALE;
        this._touchControl = false;
        this._hasPeneLock = true;
        this._hasBlack = true;
        this._hasTouchLock = false;
        super.onLoad();
        this.addButtonListen();
    }

    clickClose() {
        this.hide();
    }
}
