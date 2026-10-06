import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RTLMirror extends cc.Component {
    @property({
        default: -1,
        tooltip: " RTL 时 scaleX 取该值的相对乘积 ； 通常- 1 即可 （ 水平镜像 ） "
    })
    flipScaleX: number = -1;

    _origSign = 1;
    _cached = false;

    onLoad() {
        this._origSign = this.node.scaleX < 0 ? -1 : 1;
        this._cached = true;
        this.bindLanguageEvent();
        this._apply();
    }

    onDestroy() {
        this.unbindLanguageEvent();
    }

    bindLanguageEvent() {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this._apply, this);
    }

    unbindLanguageEvent() {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this._apply, this);
    }

    _apply() {
        if (this.node && this.node.isValid && this._cached) {
            var absScale = Math.abs(this.node.scaleX),
                sign = this.flipScaleX < 0 ? -1 : 1;
            (LanguageService as any).isRTL() ? this.node.scaleX = absScale * this._origSign * sign : this.node.scaleX = absScale * this._origSign;
        }
    }
}
