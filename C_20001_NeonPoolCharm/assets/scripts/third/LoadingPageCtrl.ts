import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import LoadingPage from "./LoadingPage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/LoadingPageCtrl")
export default class LoadingPageCtrl extends BasePageCtrl {
    ui: LoadingPage = null;

    static prefabUrl = "LoadingPage";
    static className = "LoadingPageCtrl";

    onUILoad(): void {
        this.ui = this.node.addComponent(LoadingPage);
    }

    _init(e: { data?: { callback?: () => void } }): void {
        if (e && e.data) {
            const callback = e.data.callback;
            this.unscheduleAllCallbacks();
            this.scheduleOnce(() => {
                if (callback) {
                    callback();
                    this.hide();
                }
            }, 0.5);
        }
    }

    start(): void {
    }

    addButtonListen(): void {
    }

    clickClose(): void {
        this.hide();
    }

    onLoad(): void {
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
