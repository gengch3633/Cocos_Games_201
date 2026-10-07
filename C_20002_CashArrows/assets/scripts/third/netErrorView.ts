import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr, { gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import MiddleHelper from "./MiddleHelper";
import NetErrorPopupService from "./NetErrorPopupService";
import UIMgr from "./UIMgr";

const { ccclass } = cc._decorator;
const LOG_PREFIX = "[netErrorView] ";

@ccclass
export default class netErrorView extends cc.Component {
    _retryFn: (() => void) | null = null;
    _btnClose: cc.Node = null;
    _btnRetry: cc.Node = null;
    _lblTitle: cc.Node = null;
    _lblDesc: cc.Node = null;
    _lblContinue: cc.Node = null;
    _lblRetryText: cc.Node = null;
    _onCloseBound: () => void = null;
    _onRetryBound: () => void = null;

    onLoad(): void {
        if (NetErrorPopupService && typeof NetErrorPopupService.consumePendingRetry === "function") {
            this._retryFn = NetErrorPopupService.consumePendingRetry();
        }
        this._cacheNodes();
        this._bindButtons();
        this._refreshTexts();
        this._bindLanguageEvent();
    }

    onDestroy(): void {
        this._unbindButtons();
        this._unbindLanguageEvent();
        if (NetErrorPopupService && typeof NetErrorPopupService.notifyClosed === "function") {
            NetErrorPopupService.notifyClosed();
        }
    }

    _cacheNodes(): void {
        const bg = this.node.getChildByName(" bg ");
        if (bg) {
            this._btnClose = bg.getChildByName(" close_btn ") || null;
            this._btnRetry = bg.getChildByName(" btn_retry ") || null;
            this._lblTitle = bg.getChildByName(" txt_timesup ") || null;
            this._lblDesc = bg.getChildByName(" txt_desc ") || null;
            this._lblContinue = bg.getChildByName(" txt_continue ") || null;
            if (this._btnRetry) {
                this._lblRetryText = this._btnRetry.getChildByName(" txt_free_revive ") || null;
            }
        } else {
            cc.warn(LOG_PREFIX, " bg 节点缺失 ");
        }
    }

    _bindButtons(): void {
        if (this._btnClose) {
            this._onCloseBound = () => {
                this.OnClickClose();
            };
            this._btnClose.on(cc.Node.EventType.TOUCH_END, this._onCloseBound, this);
        } else {
            cc.warn(LOG_PREFIX, " close_btn 节点缺失 ");
        }
        if (this._btnRetry) {
            this._onRetryBound = () => {
                this.OnClickFuhuo();
            };
            this._btnRetry.on(cc.Node.EventType.TOUCH_END, this._onRetryBound, this);
        } else {
            cc.warn(LOG_PREFIX, " btn_retry 节点缺失 ");
        }
    }

    _unbindButtons(): void {
        if (this._btnClose && this._btnClose.isValid && this._onCloseBound) {
            this._btnClose.off(cc.Node.EventType.TOUCH_END, this._onCloseBound, this);
        }
        if (this._btnRetry && this._btnRetry.isValid && this._onRetryBound) {
            this._btnRetry.off(cc.Node.EventType.TOUCH_END, this._onRetryBound, this);
        }
        this._btnClose = null;
        this._btnRetry = null;
        this._onCloseBound = null;
        this._onRetryBound = null;
    }

    _bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this._refreshTexts, this);
    }

    _unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this._refreshTexts, this);
    }

    _hasServerAttribution(): boolean {
        try {
            if (!MiddleHelper || typeof MiddleHelper.getRegionalState !== "function") {
                return false;
            }
            const state = MiddleHelper.getRegionalState();
            return !!(state && state.hasServerCountry);
        } catch (err) {
            cc.warn(LOG_PREFIX, " _hasServerAttribution error ", err);
            return false;
        }
    }

    _t(key: string, fallback?: string): string {
        try {
            if (LanguageService) {
                let text: string;
                if (!this._hasServerAttribution() && typeof LanguageService.tWithLanguage === "function") {
                    text = LanguageService.tWithLanguage("en-US", key, [], fallback);
                } else if (typeof LanguageService.t === "function") {
                    text = LanguageService.t(key, [], fallback);
                }
                return text || fallback || key;
            }
        } catch (err) {
            cc.warn(LOG_PREFIX, " _t error key = " + key, err);
        }
        return fallback || key;
    }

    _setLabelText(node: cc.Node, text: string): void {
        if (node && node.isValid) {
            const label = node.getComponent(cc.Label);
            if (label) {
                label.string = text;
            }
        }
    }

    _refreshTexts(): void {
        this._setLabelText(this._lblContinue, this._t(" key_net_error_continue ", " Continue? "));
        this._setLabelText(this._lblTitle, this._t(" key_net_error_title ", " Network connection failed ! "));
        this._setLabelText(this._lblDesc, this._t(" key_net_error_message ", "Please check your cellular or Wi-Fi connection and retry"));
        this._setLabelText(this._lblRetryText, this._t(" key_net_error_retry ", " Try Again "));
    }

    OnClickClose(): void {
        this._retryFn = null;
        try {
            UIMgr.getInstance().hide(this.node);
        } catch (err) {
            cc.warn(LOG_PREFIX, " OnClickClose hide 失败 ", err);
        }
    }

    OnClickFuhuo(): void {
        const retryFn = this._retryFn;
        this._retryFn = null;
        try {
            UIMgr.getInstance().hide(this.node);
        } catch (err) {
            cc.warn(LOG_PREFIX, " OnClickFuhuo hide 失败 ", err);
        }
        if (typeof retryFn === "function") {
            try {
                retryFn();
            } catch (err) {
                cc.warn(LOG_PREFIX, " retryFn 执行异常 ", err);
            }
        } else {
            cc.warn(LOG_PREFIX, "点击重试但无 retryFn 绑定 ， no-op");
        }
    }
}
