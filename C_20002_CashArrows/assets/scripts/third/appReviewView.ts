import AppReviewManager from "./AppReviewManager";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import MiddleHelper from "./MiddleHelper";
import UIMgr from "./UIMgr";

const LOG_PREFIX = "[appReviewView]";

function reportReviewEvent(event: string, data?: any): void {
    try {
        BusinessAnalyticsService.reportData(event, data || {});
    } catch (error) {
        console.warn(LOG_PREFIX + " report failed", event, error);
    }
}

const AppReviewView = cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad() {
        this._rating = 0;
        this._acting = false;
        this._closed = false;
        this._bindNodes();
        this._bindEvents();
        if (this._stateThanks) {
            this._stateThanks.active = false;
        }
        if (this._stateRating) {
            this._stateRating.active = true;
        }
        this._refreshStars();
        console.log(LOG_PREFIX + " onLoad bind -> stars="+ this._stars.length +" panel="+ !!this._panel +" stateRating="+ !!this._stateRating +" stateThanks="+ !!this._stateThanks +" btnClose="+ !!this._btnClose +" btnOk="+ !!this._btnOk); }, start() { this._playEnterAnim(); }, _findDeep(node: cc.Node, name: string): cc.Node { if (!node?.isValid) { return null; } if (node.name === name) { return node; } const children = node.children || []; for (let i = 0; i < children.length; i++) { const found = this._findDeep(children[i], name); if (found) { return found; } } return null; }, _bindNodes() { this._panel = this._findDeep(this.node,"block_panel");
        this._stateRating = this._findDeep(this.node, "state_rating");
        this._stateThanks = this._findDeep(this.node, "state_thanks");
        this._btnClose = this._findDeep(this.node, "btn_close");
        this._btnOk = this._findDeep(this.node, "btn_ok");
        this._stars = [];
        this._starFills = [];
        for (let i = 1; i <= 5; i++) {
            const starNode = this._findDeep(this.node, "star_" + i);
            if (starNode) {
                this._stars.push(starNode);
                this._starFills.push(starNode.getChildByName("star_fill"));
            }
        }
    },
    _bindEvents() {
        for (let i = 0; i < this._stars.length; i++) {
            ((index) => {
                this._stars[index].on(cc.Node.EventType.TOUCH_END, () => {
                    this._onClickStar(index + 1);
                }, this);
            })(i);
        }
        this._btnClose?.on(cc.Node.EventType.TOUCH_END, this._close, this);
        this._btnOk?.on(cc.Node.EventType.TOUCH_END, this._close, this);
    },
    _onClickStar(rating: number) {
        if (this._acting) {
            console.log(LOG_PREFIX + " _onClickStar ignored(acting) rating="+ rating); return; } console.log(LOG_PREFIX +" _onClickStar rating=" + rating);
        this._rating = rating;
        this._refreshStars();
        reportReviewEvent("app_review_star_click", { rating });
        this._acting = true;
        this.scheduleOnce(this._applyRating, 0.32);
    },
    _refreshStars() {
        for (let i = 0; i < this._starFills.length; i++) {
            if (this._starFills[i]) {
                this._starFills[i].active = i < this._rating;
            }
        }
    },
    _isTfUser(): boolean {
        try {
            if (!MiddleHelper) {
                return true;
            }
            if (typeof MiddleHelper.getRegionalState === "function") {
                const state = MiddleHelper.getRegionalState();
                return !!(state && state.recogTF);
            }
            return !!MiddleHelper.recogTF;
        } catch (error) {
            console.warn(LOG_PREFIX + " read recog_tf failed", error);
            return true;
        }
    },
    _applyRating() {
        const isTfUser = this._isTfUser();
        if (this._rating >= 4 || !isTfUser) {
            console.log(LOG_PREFIX + " rating=" + this._rating + " recog_tf=" + isTfUser + " -> google play");
            reportReviewEvent("app_review_jump", { rating: this._rating, recog_tf: isTfUser ? 1 : 0 });
            AppReviewManager.getInstance().markJumped();
            this._close();
        } else {
            console.log(LOG_PREFIX + " low rating=" + this._rating + " recog_tf=" + isTfUser + " -> thanks");
            reportReviewEvent("app_review_thanks", { rating: this._rating, recog_tf: isTfUser ? 1 : 0 });
            this._showThanks();
        }
    },
    _showThanks() {
        if (this._stateRating) {
            this._stateRating.active = false;
        }
        if (this._stateThanks) {
            this._stateThanks.active = true;
        }
        const heart = this._findDeep(this.node, "img_heart");
        if (heart) {
            heart.stopAllActions();
            heart.scale = 0.6;
            cc.tween(heart).to(0.3, { scale: 1 }, { easing: "backOut"}).start(); } }, _close() { if (!this._closed) { this._closed = true; console.log(LOG_PREFIX +" _close rating=" + (this._rating || 0) + " rated=" + (this._rating > 0 ? 1 : 0));
            reportReviewEvent("app_review_close", {
                rating: this._rating || 0,
                rated: this._rating > 0 ? 1 : 0
            });
        }
        UIMgr.getInstance().hide(this.node);
    },
    _playEnterAnim() {
        const panel = this._panel;
        if (panel) {
            panel.stopAllActions();
            panel.scale = 0.7;
            panel.opacity = 0;
            cc.tween(panel).to(0.25, { scale: 1, opacity: 255 }, { easing: "backOut" }).start();
        }
    }
});

export default AppReviewView;
