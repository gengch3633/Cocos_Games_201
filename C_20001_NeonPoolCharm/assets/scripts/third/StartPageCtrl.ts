import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import StartPage from "./StartPage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/StartPageCtrl")
export default class StartPageCtrl extends BasePageCtrl {
    ui: StartPage = null;

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

    start(): void {}

    clickClose(): void {
        this.hide();
    }

    _init(): void {}

    onUILoad(): void {
        this.ui = this.node.addComponent(StartPage);
    }

    addButtonListen(): void {}

    static prefabUrl = "StartPage";
    static className = "StartPageCtrl";
}
