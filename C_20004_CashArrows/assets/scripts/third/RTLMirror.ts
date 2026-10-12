import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import LanguageService from "./LanguageService";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RTLMirror extends cc.Component {

    @property({
        type: cc.Integer,
        tooltip: "RTL 时 scaleX 取该值的相对乘积；通常 -1 即可（水平镜像）"
    })
    public flipScaleX: number = -1;

    private _origSign: number = 1;
    private _cached: boolean = false;

    public onLoad(): void {
        this._origSign = this.node.scaleX < 0 ? -1 : 1;
        this._cached = true;
        this.bindLanguageEvent();
        this._apply();
    }

    public onDestroy(): void {
        this.unbindLanguageEvent();
    }

    public bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.languageChanged, this._apply, this);
    }

    public unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.languageChanged, this._apply, this);
    }

    private _apply(): void {
        if (this.node && this.node.isValid && this._cached) {
            const currentScaleX = Math.abs(this.node.scaleX);
            const flipSign = this.flipScaleX < 0 ? -1 : 1;
            if (LanguageService.isRTL()) {
                this.node.scaleX = currentScaleX * this._origSign * flipSign;
            } else {
                this.node.scaleX = currentScaleX * this._origSign;
            }
        }
    }
}