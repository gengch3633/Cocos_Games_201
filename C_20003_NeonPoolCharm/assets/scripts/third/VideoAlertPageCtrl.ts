import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import { UiManager } from "./UiManage";
import VideoAlertPage from "./VideoAlertPage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/VideoAlertPageCtrl")
export default class VideoAlertPageCtrl extends BasePageCtrl {
    ui = null;
    _animType = null;
    _touchControl = null;
    _hasPeneLock = null;
    _hasBlack = null;
    _hasTouchLock = null;
    _exitCB = null;

    static prefabUrl = "VideoAlertPage";
    static className = "VideoAlertPageCtrl";

    _init(data) {
        this._exitCB = data ? data.exitCB : null;
    }

    clickClose() {
        this._exitCB(false);
        this.hide();
    }

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

    clickOk() {
        this._exitCB(true);
        this.hide();
    }

    start() {}

    addButtonListen() {
        UiManager.addButtonListen(this.ui.close1, this.clickClose, this);
        UiManager.addButtonListen(this.ui.btnOk, this.clickOk, this);
    }

    onDisable() {
        super.onDisable();
        this._exitCB = null;
    }

    onUILoad() {
        this.ui = this.node.addComponent(VideoAlertPage);
    }
}
