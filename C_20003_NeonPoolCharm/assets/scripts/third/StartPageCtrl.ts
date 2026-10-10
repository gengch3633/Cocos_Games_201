import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import StartPage from "./StartPage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/StartPageCtrl")
export default class StartPageCtrl extends BasePageCtrl {
    ui = null;
    _animType = null;
    _touchControl = null;
    _hasPeneLock = null;
    _hasBlack = null;
    _hasTouchLock = null;

    static prefabUrl = "StartPage";
    static className = "StartPageCtrl";

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

    start() {}

    clickClose() {
        this.hide();
    }

    _init() {}

    onUILoad() {
        this.ui = this.node.addComponent(StartPage);
    }

    addButtonListen() {}
}
