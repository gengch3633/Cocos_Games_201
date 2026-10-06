import UIMgr from "./UIMgr";
import NetErrorPopupService from "./NetErrorPopupService";
import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";

declare function require(id: string): any;

const { ccclass } = cc._decorator;

const p = "[netErrorView] ";
var u: any = null;
try {
    var d = require("./MiddleHelper.js");
    u = d && d.default ? d.default : d;
} catch (e) {
    u = null;
}

@ccclass
export default class netErrorView extends cc.Component {
    _retryFn: (() => void) | null = null;
    _btnClose: cc.Node = null;
    _btnRetry: cc.Node = null;
    _lblTitle: cc.Node = null;
    _lblDesc: cc.Node = null;
    _lblContinue: cc.Node = null;
    _lblRetryText: cc.Node = null;
    _onCloseBound: (() => void) | null = null;
    _onRetryBound: (() => void) | null = null;

    onLoad() {
        var e = NetErrorPopupService;
        e && " function " == typeof e.consumePendingRetry && (this._retryFn = e.consumePendingRetry());
        this._cacheNodes();
        this._bindButtons();
        this._refreshTexts();
        this._bindLanguageEvent();
    }

    onDestroy() {
        this._unbindButtons();
        this._unbindLanguageEvent();
        var e = NetErrorPopupService;
        e && " function " == typeof e.notifyClosed && e.notifyClosed();
    }

    _cacheNodes() {
        var e = this.node.getChildByName(" bg ");
        if (e) {
            this._btnClose = e.getChildByName(" close_btn ") || null;
            this._btnRetry = e.getChildByName(" btn_retry ") || null;
            this._lblTitle = e.getChildByName(" txt_timesup ") || null;
            this._lblDesc = e.getChildByName(" txt_desc ") || null;
            this._lblContinue = e.getChildByName(" txt_continue ") || null;
            this._btnRetry && (this._lblRetryText = this._btnRetry.getChildByName(" txt_free_revive ") || null);
        } else cc.warn(p, " bg 节点缺失 ");
    }

    _bindButtons() {
        var e = this;
        if (this._btnClose) {
            this._onCloseBound = function () {
                e.OnClickClose();
            };
            this._btnClose.on(cc.Node.EventType.TOUCH_END, this._onCloseBound, this);
        } else cc.warn(p, " close_btn 节点缺失 ");
        if (this._btnRetry) {
            this._onRetryBound = function () {
                e.OnClickFuhuo();
            };
            this._btnRetry.on(cc.Node.EventType.TOUCH_END, this._onRetryBound, this);
        } else cc.warn(p, " btn_retry 节点缺失 ");
    }

    _unbindButtons() {
        this._btnClose && this._btnClose.isValid && this._onCloseBound && this._btnClose.off(cc.Node.EventType.TOUCH_END, this._onCloseBound, this);
        this._btnRetry && this._btnRetry.isValid && this._onRetryBound && this._btnRetry.off(cc.Node.EventType.TOUCH_END, this._onRetryBound, this);
        this._btnClose = null;
        this._btnRetry = null;
        this._onCloseBound = null;
        this._onRetryBound = null;
    }

    _bindLanguageEvent() {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this._refreshTexts, this);
    }

    _unbindLanguageEvent() {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this._refreshTexts, this);
    }

    _hasServerAttribution() {
        try {
            if (!u || " function " != typeof u.getRegionalState) return !1;
            var e = u.getRegionalState();
            return !(!e || !e.hasServerCountry);
        } catch (e) {
            cc.warn(p, " _hasServerAttribution error ", e);
            return !1;
        }
    }

    _t(e: string, t: string) {
        try {
            var i = LanguageService;
            if (i) {
                var n: string;
                this._hasServerAttribution() || " function " != typeof i.tWithLanguage ? " function " == typeof i.t && (n = i.t(e, [], t)) : n = i.tWithLanguage(" en- US ", e, [], t);
                return n || t || e;
            }
        } catch (t) {
            cc.warn(p, " _t error key = " + e, t);
        }
        return t || e;
    }

    _setLabelText(e: cc.Node, t: string) {
        if (e && e.isValid) {
            var i = e.getComponent(cc.Label);
            i && (i.string = t);
        }
    }

    _refreshTexts() {
        this._setLabelText(this._lblContinue, this._t(" key_net_error_continue ", " Continue? "));
        this._setLabelText(this._lblTitle, this._t(" key_net_error_title ", " Network connection failed ! "));
        this._setLabelText(this._lblDesc, this._t(" key_net_error_message ", " Please check your cellular or Wi- Fi connection and retry "));
        this._setLabelText(this._lblRetryText, this._t(" key_net_error_retry ", " Try Again "));
    }

    OnClickClose() {
        this._retryFn = null;
        try {
            UIMgr.getInstance().hide(this.node);
        } catch (e) {
            cc.warn(p, " OnClickClose hide 失败 ", e);
        }
    }

    OnClickFuhuo() {
        var e = this._retryFn;
        this._retryFn = null;
        try {
            UIMgr.getInstance().hide(this.node);
        } catch (e) {
            cc.warn(p, " OnClickFuhuo hide 失败 ", e);
        }
        if (" function " == typeof e) try {
            e();
        } catch (e) {
            cc.warn(p, " retryFn 执行异常 ", e);
        } else cc.warn(p, " 点击重试但无 retryFn 绑定 ， no- op ");
    }
}
