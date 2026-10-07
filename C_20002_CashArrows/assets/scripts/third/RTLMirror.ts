import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RTLMirror extends cc.Component {
    @property({
        tooltip: " RTL 时 scaleX 取该值的相对乘积 ； 通常- 1 即可 （ 水平镜像 ） "
    })
    flipScaleX: number = -1;

    _origSign: number = 1;
    _cached: boolean = true;

    onLoad(): void {
        this._origSign = this.node.scaleX < 0 ? -1 : 1;
        this._cached = true;
        this.bindLanguageEvent();
        this.applyMirror();
    }

    onDestroy(): void {
        this.unbindLanguageEvent();
    }

    bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this.applyMirror, this);
    }

    unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this.applyMirror, this);
    }

    applyMirror(): void {
        if (this.node && this.node.isValid && this._cached) {
            const absScale = Math.abs(this.node.scaleX);
            const flipSign = this.flipScaleX < 0 ? -1 : 1;
            const isRTL = typeof (LanguageService as any).isRTL === "function" ? (LanguageService as any).isRTL() : false;
            this.node.scaleX = isRTL ? absScale * this._origSign * flipSign : absScale * this._origSign;
        }
    }
}
