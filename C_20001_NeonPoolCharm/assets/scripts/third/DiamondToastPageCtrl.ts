import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import DiamondToastPage from "./DiamondToastPage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/DiamondToastPageCtrl")
export default class DiamondToastPageCtrl extends BasePageCtrl {
    ui: DiamondToastPage = null;

    static prefabUrl = "DiamondToastPage";
    static className = "DiamondToastPageCtrl";

    _init(): void {
    }

    onUILoad(): void {
        this.ui = this.node.addComponent(DiamondToastPage);
    }

    start(): void {
    }

    addButtonListen(): void {
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

    clickClose(): void {
        this.hide();
    }
}
