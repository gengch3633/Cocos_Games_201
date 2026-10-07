import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import VideoAlertPage from "./VideoAlertPage";
import { UiManager } from "./UiManage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/VideoAlertPageCtrl")
export default class VideoAlertPageCtrl extends BasePageCtrl {
    ui: VideoAlertPage = null;
    _exitCB: (result: boolean) => void = null;

    static prefabUrl = "VideoAlertPage";
    static className = "VideoAlertPageCtrl";

    _init(e?: { exitCB?: (result: boolean) => void }): void {
        this._exitCB = e ? e.exitCB : null;
    }

    clickClose(): void {
        this._exitCB(false);
        this.hide();
    }

    onLoad(): void {
        this.onUILoad();
        this._animType = AnimType.SCALE;
        this._touchControl = false;
        this._hasPeneLock = true;
        this._hasBlack = true;
        this._hasTouchLock = false;
        super.onLoad();
        this.addButtonListen();
    }

    clickOk(): void {
        this._exitCB(true);
        this.hide();
    }

    start(): void {
    }

    addButtonListen(): void {
        UiManager.addButtonListen(this.ui.close1, this.clickClose, this);
        UiManager.addButtonListen(this.ui.btnOk, this.clickOk, this);
    }

    onDisable(): void {
        super.onDisable();
        this._exitCB = null;
    }

    onUILoad(): void {
        this.ui = this.node.addComponent(VideoAlertPage);
    }
}
