import AppReviewManager from "./AppReviewManager";
import BusinessAnalyticsService from "../migration-bundle/business-common/report/BusinessAnalyticsService";
import MiddleHelper from "../migration-bundle/business-common/middle/MiddleHelper";
import UIMgr from "./UIMgr";

const { ccclass } = cc._decorator;

const LOG_TAG = "[appReviewView]";

function report(eventName: string, payload?: any): void {
    try {
        const service: any = BusinessAnalyticsService;
        if (service && service.reportData) {
            service.reportData(eventName, payload || {});
        }
    } catch (err) {
        console.warn(LOG_TAG + " report failed", eventName, err);
    }
}

@ccclass
export default class appReviewView extends cc.Component {
    private _panel: cc.Node = null;
    private _stateRating: cc.Node = null;
    private _stateThanks: cc.Node = null;
    private _btnClose: cc.Node = null;
    private _btnOk: cc.Node = null;
    private _stars: cc.Node[] = [];
    private _starFills: cc.Node[] = [];
    private _rating: number = 0;
    private _acting: boolean = false;
    private _closed: boolean = false;

    public onLoad(): void {
        this._rating = 0;
        this._acting = false;
        this._closed = false;
        this._bindNodes();
        this._bindEvents();
        if (this._stateThanks) this._stateThanks.active = false;
        if (this._stateRating) this._stateRating.active = true;
        this._refreshStars();
        console.log(LOG_TAG + " onLoad bind -> stars=" + this._stars.length + " panel=" + !!this._panel + " stateRating=" + !!this._stateRating + " stateThanks=" + !!this._stateThanks + " btnClose=" + !!this._btnClose + " btnOk=" + !!this._btnOk);
    }

    public start(): void {
        this._playEnterAnim();
    }

    private _findDeep(node: cc.Node, name: string): cc.Node {
        if (!node || !node.isValid) return null;
        if (node.name === name) return node;
        const children = node.children || [];
        for (let i = 0; i < children.length; i++) {
            const found = this._findDeep(children[i], name);
            if (found) return found;
        }
        return null;
    }

    private _bindNodes(): void {
        this._panel = this._findDeep(this.node, "block_panel");
        this._stateRating = this._findDeep(this.node, "state_rating");
        this._stateThanks = this._findDeep(this.node, "state_thanks");
        this._btnClose = this._findDeep(this.node, "btn_close");
        this._btnOk = this._findDeep(this.node, "btn_ok");
        this._stars = [];
        this._starFills = [];
        for (let i = 1; i <= 5; i++) {
            const star = this._findDeep(this.node, "star_" + i);
            if (star) {
                this._stars.push(star);
                this._starFills.push(star.getChildByName("star_fill"));
            }
        }
    }

    private _bindEvents(): void {
        for (let i = 0; i < this._stars.length; i++) {
            this._stars[i].on(cc.Node.EventType.TOUCH_END, () => {
                this._onClickStar(i + 1);
            }, this);
        }
        if (this._btnClose) this._btnClose.on(cc.Node.EventType.TOUCH_END, this._close, this);
        if (this._btnOk) this._btnOk.on(cc.Node.EventType.TOUCH_END, this._close, this);
    }

    private _onClickStar(rating: number): void {
        if (this._acting) {
            console.log(LOG_TAG + " _onClickStar ignored(acting) rating=" + rating);
            return;
        }
        console.log(LOG_TAG + " _onClickStar rating=" + rating);
        this._rating = rating;
        this._refreshStars();
        report("app_review_star_click", {
            rating: rating
        });
        this._acting = true;
        this.scheduleOnce(this._applyRating, 0.32);
    }

    private _refreshStars(): void {
        for (let i = 0; i < this._starFills.length; i++) {
            if (this._starFills[i]) this._starFills[i].active = i < this._rating;
        }
    }

    private _isTfUser(): boolean {
        try {
            const helper: any = MiddleHelper;
            if (!helper) return true;
            if (typeof helper.getRegionalState === "function") {
                const state = helper.getRegionalState();
                return !!(state && state.recogTF);
            }
            return !!helper.recogTF;
        } catch (err) {
            console.warn(LOG_TAG + " read recog_tf failed", err);
            return true;
        }
    }

    private _applyRating(): void {
        const isTfUser = this._isTfUser();
        if (this._rating >= 4 || !isTfUser) {
            console.log(LOG_TAG + " rating=" + this._rating + " recog_tf=" + isTfUser + " -> google play");
            report("app_review_jump", {
                rating: this._rating,
                recog_tf: isTfUser ? 1 : 0
            });
            AppReviewManager.getInstance().markJumped();
            this._close();
        } else {
            console.log(LOG_TAG + " low rating=" + this._rating + " recog_tf=" + isTfUser + " -> thanks");
            report("app_review_thanks", {
                rating: this._rating,
                recog_tf: isTfUser ? 1 : 0
            });
            this._showThanks();
        }
    }

    private _showThanks(): void {
        if (this._stateRating) this._stateRating.active = false;
        if (this._stateThanks) this._stateThanks.active = true;
        const heart = this._findDeep(this.node, "img_heart");
        if (heart) {
            heart.stopAllActions();
            heart.scale = 0.6;
            cc.tween(heart).to(0.3, {
                scale: 1
            }, {
                easing: "backOut"
            }).start();
        }
    }

    private _close(): void {
        if (!this._closed) {
            this._closed = true;
            console.log(LOG_TAG + " _close rating=" + (this._rating || 0) + " rated=" + (this._rating > 0 ? 1 : 0));
            report("app_review_close", {
                rating: this._rating || 0,
                rated: this._rating > 0 ? 1 : 0
            });
        }
        UIMgr.getInstance().hide(this.node);
    }

    private _playEnterAnim(): void {
        const panel = this._panel;
        if (panel) {
            panel.stopAllActions();
            panel.scale = 0.7;
            panel.opacity = 0;
            cc.tween(panel).to(0.25, {
                scale: 1,
                opacity: 255
            }, {
                easing: "backOut"
            }).start();
        }
    }
}