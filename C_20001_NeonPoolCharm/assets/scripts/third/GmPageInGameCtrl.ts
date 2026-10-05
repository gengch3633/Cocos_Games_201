import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import { UiManager } from "./UiManage";
import GmPageInGame from "./GmPageInGame";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/GmPageInGameCtrl")
export default class GmPageInGameCtrl extends BasePageCtrl {
    static prefabUrl = "GmPageInGame";
    static className = "GmPageInGameCtrl";

    ui: GmPageInGame = null;

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
