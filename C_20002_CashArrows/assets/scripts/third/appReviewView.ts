declare function require(id: string): any;

import AppReviewManager from "./AppReviewManager";
import UIMgr from "./UIMgr";

const { ccclass } = cc._decorator;

const n = "[appReviewView]";

function a(t: string) {
    var i = require(t);
    return i && i.default ? i.default : i;
}

function o(e: string, t?: any) {
    try {
        var i = a("../migration-bundle/business-common/report/BusinessAnalyticsService");
        i && i.reportData && i.reportData(e, t || {});
    } catch (t) {
        console.warn(n + " report failed", e, t);
    }
}

@ccclass
export default class appReviewView extends cc.Component {
    _rating = 0;
    _acting = !1;
    _closed = !1;
    _panel: cc.Node = null;
    _stateRating: cc.Node = null;
    _stateThanks: cc.Node = null;
    _btnClose: cc.Node = null;
    _btnOk: cc.Node = null;
    _stars: cc.Node[] = [];
    _starFills: cc.Node[] = [];

    onLoad() {
        this._rating = 0;
        this._acting = !1;
        this._closed = !1;
        this._bindNodes();
        this._bindEvents();
        this._stateThanks && (this._stateThanks.active = !1);
        this._stateRating && (this._stateRating.active = !0);
        this._refreshStars();
        console.log(n + " onLoad bind -> stars=" + this._stars.length + " panel=" + !!this._panel + " stateRating=" + !!this._stateRating + " stateThanks=" + !!this._stateThanks + " btnClose=" + !!this._btnClose + " btnOk=" + !!this._btnOk);
    }

    start() {
        this._playEnterAnim();
    }

    _findDeep(e: cc.Node, t: string) {
        if (!e || !e.isValid) return null;
        if (e.name === t) return e;
        for (var i = e.children || [], n = 0; n < i.length; n++) {
            var a = this._findDeep(i[n], t);
            if (a) return a;
        }
        return null;
    }

    _bindNodes() {
        this._panel = this._findDeep(this.node, "block_panel");
        this._stateRating = this._findDeep(this.node, "state_rating");
        this._stateThanks = this._findDeep(this.node, "state_thanks");
        this._btnClose = this._findDeep(this.node, "btn_close");
        this._btnOk = this._findDeep(this.node, "btn_ok");
        this._stars = [];
        this._starFills = [];
        for (var e = 1; e <= 5; e++) {
            var t = this._findDeep(this.node, "star_" + e);
            if (t) {
                this._stars.push(t);
                this._starFills.push(t.getChildByName("star_fill"));
            }
        }
    }

    _bindEvents() {
        for (var e = this, t = 0; t < this._stars.length; t++)(function (t) {
            e._stars[t].on(cc.Node.EventType.TOUCH_END, function () {
                e._onClickStar(t + 1);
            }, e);
        })(t);
        this._btnClose && this._btnClose.on(cc.Node.EventType.TOUCH_END, this._close, this);
        this._btnOk && this._btnOk.on(cc.Node.EventType.TOUCH_END, this._close, this);
    }

    _onClickStar(e: number) {
        if (this._acting) console.log(n + " _onClickStar ignored(acting) rating=" + e);
        else {
            console.log(n + " _onClickStar rating=" + e);
            this._rating = e;
            this._refreshStars();
            o("app_review_star_click", {
                rating: e
            });
            this._acting = !0;
            this.scheduleOnce(this._applyRating, .32);
        }
    }

    _refreshStars() {
        for (var e = 0; e < this._starFills.length; e++) this._starFills[e] && (this._starFills[e].active = e < this._rating);
    }

    _isTfUser() {
        try {
            var e = a("../migration-bundle/business-common/middle/MiddleHelper");
            if (!e) return !0;
            if ("function" == typeof e.getRegionalState) {
                var t = e.getRegionalState();
                return !(!t || !t.recogTF);
            }
            return !!e.recogTF;
        } catch (e) {
            console.warn(n + " read recog_tf failed", e);
            return !0;
        }
    }

    _applyRating() {
        var e = this._isTfUser();
        if (this._rating >= 4 || !e) {
            console.log(n + " rating=" + this._rating + " recog_tf=" + e + " -> google play");
            o("app_review_jump", {
                rating: this._rating, recog_tf: e ? 1 : 0
            });
            AppReviewManager.getInstance().markJumped();
            this._close();
        } else {
            console.log(n + " low rating=" + this._rating + " recog_tf=" + e + " -> thanks");
            o("app_review_thanks", {
                rating: this._rating, recog_tf: e ? 1 : 0
            });
            this._showThanks();
        }
    }

    _showThanks() {
        this._stateRating && (this._stateRating.active = !1);
        this._stateThanks && (this._stateThanks.active = !0);
        var e = this._findDeep(this.node, "img_heart");
        if (e) {
            e.stopAllActions();
            e.scale = .6;
            cc.tween(e).to(.3, {
                scale: 1
            }, {
                easing: "backOut"
            }).start();
        }
    }

    _close() {
        if (!this._closed) {
            this._closed = !0;
            console.log(n + " _close rating=" + (this._rating || 0) + " rated=" + (this._rating > 0 ? 1 : 0));
            o("app_review_close", {
                rating: this._rating || 0, rated: this._rating > 0 ? 1 : 0
            });
        }
        UIMgr.getInstance().hide(this.node);
    }

    _playEnterAnim() {
        var e = this._panel;
        if (e) {
            e.stopAllActions();
            e.scale = .7;
            e.opacity = 0;
            cc.tween(e).to(.25, {
                scale: 1, opacity: 255
            }, {
                easing: "backOut"
            }).start();
        }
    }
}
