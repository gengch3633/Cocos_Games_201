import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import GameHelpPage from "./GameHelpPage";
import { UiManager } from "./UiManage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/GameHelpPageCtrl")
export default class GameHelpPageCtrl extends BasePageCtrl {
    ui: GameHelpPage = null;

    static prefabUrl = "GameHelpPage";
    static className = "GameHelpPageCtrl";

    start(): void {
    }

    onLoad(): void {
        this.onUILoad();
        this._animType = AnimType.SCALE;
        this._touchControl = false;
        this._hasPeneLock = true;
        this._hasBlack = false;
        this._hasTouchLock = false;
        super.onLoad();
    }

    _init(): void {
        UiManager.addButtonListen(this.ui.btn_close, this.clickClose, this);
    }

    clickClose(): void {
        this.hide();
    }

    onUILoad(): void {
        this.ui = this.node.addComponent(GameHelpPage);
    }
}
