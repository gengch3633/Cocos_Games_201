import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import GmPageInGame from "./GmPageInGame";
import { UiManager } from "./UiManage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/GmPageInGameCtrl")
export default class GmPageInGameCtrl extends BasePageCtrl {
    ui = null;
    _animType = null;
    _touchControl = null;
    _hasPeneLock = null;
    _hasBlack = null;
    _hasTouchLock = null;

    static prefabUrl = "GmPageInGame";
    static className = "GmPageInGameCtrl";

    onDisable() {}

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

    onUILoad() {
        const e = this;
        this.ui = this.node.addComponent(GmPageInGame);
        UiManager.addButtonListen(this.ui.close_btn, function () {
            e.hide();
        }, this);
        UiManager.addButtonListen(this.ui.level_success, function () {
            EventMgr.trigger(GameEventType.GM_LEVEL_SUCCESS);
            e.hide();
        }, this);
    }

    _init() {}

    clickClose() {
        this.hide();
    }

    start() {}

    addButtonListen() {}

    onEnable() {}
}
