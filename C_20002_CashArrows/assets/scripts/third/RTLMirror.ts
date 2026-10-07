import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RTLMirror extends cc.Component {
    @property({
        tooltip: "RTL 时 scaleX 取该值的相对乘积；通常 -1 即可（水平镜像）",
    })
    flipScaleX = -1;

    _origSign = 1;
    _cached = false;

    onLoad(): void {
        this._origSign = this.node.scaleX < 0 ? -1 : 1;
        this._cached = true;
        this.bindLanguageEvent();
        this._apply();
    }

    onDestroy(): void {
        this.unbindLanguageEvent();
    }

    bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this._apply, this);
    }

    unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this._apply, this);
    }

    _apply(): void {
        if (this.node && this.node.isValid && this._cached) {
            const absScale = Math.abs(this.node.scaleX);
            const flipSign = this.flipScaleX < 0 ? -1 : 1;
            if (LanguageService.isRTL()) {
                this.node.scaleX = absScale * this._origSign * flipSign;
            } else {
                this.node.scaleX = absScale * this._origSign;
            }
        }
    }
}
