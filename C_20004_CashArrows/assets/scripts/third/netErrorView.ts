import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import MiddleHelper from "./MiddleHelper";
import NetErrorPopupService from "./NetErrorPopupService";
import UIMgr from "./UIMgr";

const { ccclass, property } = cc._decorator;

const TAG: string = "[netErrorView]";

@ccclass
export default class netErrorView extends cc.Component {

    private _retryFn: Function | null = null;
    private _btnClose: cc.Node | null = null;
    private _btnRetry: cc.Node | null = null;
    private _lblTitle: cc.Node | null = null;
    private _lblDesc: cc.Node | null = null;
    private _lblContinue: cc.Node | null = null;
    private _lblRetryText: cc.Node | null = null;
    private _onCloseBound: (() => void) | null = null;
    private _onRetryBound: (() => void) | null = null;

    onLoad(): void {
        const service: any = NetErrorPopupService;
        if (service && typeof service.consumePendingRetry === "function") {
            this._retryFn = service.consumePendingRetry();
        }

        this._cacheNodes();
        this._bindButtons();
        this._refreshTexts();
        this._bindLanguageEvent();
    }

    onDestroy(): void {
        this._unbindButtons();
        this._unbindLanguageEvent();

        const service: any = NetErrorPopupService;
        if (service && typeof service.notifyClosed === "function") {
            service.notifyClosed();
        }
    }

    private _cacheNodes(): void {
        const bg: cc.Node = this.node.getChildByName("bg");
        if (bg) {
            this._btnClose = bg.getChildByName("close_btn") || null;
            this._btnRetry = bg.getChildByName("btn_retry") || null;
            this._lblTitle = bg.getChildByName("txt_timesup") || null;
            this._lblDesc = bg.getChildByName("txt_desc") || null;
            this._lblContinue = bg.getChildByName("txt_continue") || null;
            if (this._btnRetry) {
                this._lblRetryText = this._btnRetry.getChildByName("txt_free_revive") || null;
            }
        } else {
            cc.warn(TAG, "bg 节点缺失");
        }
    }

    private _bindButtons(): void {
        if (this._btnClose) {
            this._onCloseBound = (): void => {
                this.OnClickClose();
            };
            this._btnClose.on(cc.Node.EventType.TOUCH_END, this._onCloseBound, this);
        } else {
            cc.warn(TAG, "close_btn 节点缺失");
        }

        if (this._btnRetry) {
            this._onRetryBound = (): void => {
                this.OnClickFuhuo();
            };
            this._btnRetry.on(cc.Node.EventType.TOUCH_END, this._onRetryBound, this);
        } else {
            cc.warn(TAG, "btn_retry 节点缺失");
        }
    }

    private _unbindButtons(): void {
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

    private _bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.languageChanged, this._refreshTexts, this);
    }

    private _unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.languageChanged, this._refreshTexts, this);
    }

    private _hasServerAttribution(): boolean {
        try {
            const helper: any = MiddleHelper;
            if (!helper || typeof helper.getRegionalState !== "function") {
                return false;
            }
            const state = helper.getRegionalState();
            return !!(state && state.hasServerCountry);
        } catch (err) {
            cc.warn(TAG, "_hasServerAttribution error", err);
            return false;
        }
    }

    private _t(key: string, fallback: string): string {
        try {
            const lang: any = LanguageService;
            if (lang) {
                let result: string | null = null;
                if (!this._hasServerAttribution() && typeof lang.tWithLanguage === "function") {
                    result = lang.tWithLanguage("en-US", key, [], fallback);
                } else if (typeof lang.t === "function") {
                    result = lang.t(key, [], fallback);
                }
                return result || fallback || key;
            }
        } catch (err) {
            cc.warn(TAG, "_t error key=" + key, err);
        }
        return fallback || key;
    }

    private _setLabelText(node: cc.Node | null, text: string): void {
        if (node && node.isValid) {
            const label: cc.Label = node.getComponent(cc.Label);
            if (label) {
                label.string = text;
            }
        }
    }

    private _refreshTexts(): void {
        this._setLabelText(this._lblContinue, this._t("key_net_error_continue", "Continue?"));
        this._setLabelText(this._lblTitle, this._t("key_net_error_title", "Network connection failed!"));
        this._setLabelText(this._lblDesc, this._t("key_net_error_message", "Please check your cellular or Wi-Fi connection and retry"));
        this._setLabelText(this._lblRetryText, this._t("key_net_error_retry", "Try Again"));
    }

    public OnClickClose(): void {
        this._retryFn = null;
        try {
            UIMgr.getInstance().hide(this.node);
        } catch (err) {
            cc.warn(TAG, "OnClickClose hide 失败", err);
        }
    }

    public OnClickFuhuo(): void {
        const retry = this._retryFn;
        this._retryFn = null;

        try {
            UIMgr.getInstance().hide(this.node);
        } catch (err) {
            cc.warn(TAG, "OnClickFuhuo hide 失败", err);
        }

        if (typeof retry === "function") {
            try {
                retry();
            } catch (err) {
                cc.warn(TAG, "retryFn 执行异常", err);
            }
        } else {
            cc.warn(TAG, "点击重试但无 retryFn 绑定，no-op");
        }
    }
}