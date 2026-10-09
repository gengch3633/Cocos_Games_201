import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import LoadingPage from "./LoadingPage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/LoadingPageCtrl")
export default class LoadingPageCtrl extends BasePageCtrl {
    ui = null;

    _animType = null;

    _animTime = null;

    _touchControl = null;

    _hasPeneLock = null;

    _hasBlack = null;

    _hasTouchLock = null;

    _hasBlackTouch = null;

    static prefabUrl = "LoadingPage";

    static className = "LoadingPageCtrl";

    onUILoad() {
        this.ui = this.node.addComponent(LoadingPage);
    }

    _init(e) {
        const t = this;
        if (e && e.data) {
            const o = e.data.callback;
            this.unscheduleAllCallbacks();
            this.scheduleOnce(function () {
                if (o) {
                    o();
                    t.hide();
                }
            }, .5);
        }
    }

    start() {}

    addButtonListen() {}

    clickClose() {
        this.hide();
    }

    onLoad() {
        this.onUILoad();
        this._animType = AnimType.FADE;
        this._animTime = 1.5;
        this._touchControl = false;
        this._hasPeneLock = true;
        this._hasBlack = true;
        this._hasTouchLock = false;
        this._hasBlackTouch = false;
        super.onLoad();
        this.addButtonListen();
    }
}
