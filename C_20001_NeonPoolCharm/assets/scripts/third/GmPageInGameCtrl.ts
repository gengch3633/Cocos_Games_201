import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import GmPageInGame from "./GmPageInGame";
import { UiManager } from "./UiManage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/GmPageInGameCtrl")
export default class GmPageInGameCtrl extends BasePageCtrl {
    ui: GmPageInGame = null;
    _animType = null;
    _touchControl = null;
    _hasPeneLock = null;
    _hasBlack = null;
    _hasTouchLock = null;

    static prefabUrl = "GmPageInGame";
    static className = "GmPageInGameCtrl";

    onDisable(): void {}

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

    onUILoad(): void {
        this.ui = this.node.addComponent(GmPageInGame);
        UiManager.addButtonListen(this.ui.close_btn, () => {
            this.hide();
        }, this);
        UiManager.addButtonListen(this.ui.level_success, () => {
            EventMgr.trigger(GameEventType.GM_LEVEL_SUCCESS);
            this.hide();
        }, this);
    }

    _init(): void {}

    clickClose(): void {
        this.hide();
    }

    start(): void {}

    addButtonListen(): void {}

    onEnable(): void {}
}
