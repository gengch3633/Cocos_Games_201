import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import GameHelpPage from "./GameHelpPage";
import { UiManager } from "./UiManage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/GameHelpPageCtrl")
export default class GameHelpPageCtrl extends BasePageCtrl {

    ui = null;
    _animType = null;
    _touchControl = null;
    _hasPeneLock = null;
    _hasBlack = null;
    _hasTouchLock = null;

    static prefabUrl = "GameHelpPage";
    static className = "GameHelpPageCtrl";

    start() {
    }

    onLoad() {
        this.onUILoad();
        this._animType = AnimType.SCALE;
        this._touchControl = false;
        this._hasPeneLock = true;
        this._hasBlack = false;
        this._hasTouchLock = false;
        super.onLoad();
    }

    _init() {
        UiManager.addButtonListen(this.ui.btn_close, this.clickClose, this);
    }

    clickClose() {
        this.hide();
    }

    onUILoad() {
        this.ui = this.node.addComponent(GameHelpPage);
    }
}
