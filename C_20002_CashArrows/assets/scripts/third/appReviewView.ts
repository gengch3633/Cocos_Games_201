import AppReviewManager from "./AppReviewManager";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import MiddleHelper from "./MiddleHelper";
import UIMgr from "./UIMgr";

const LOG_TAG = "[appReviewView]";

function reportEvent(event: string, data?: any): void {
    try {
        BusinessAnalyticsService.reportData(event, data || {});
    } catch (err) {
        console.warn(LOG_TAG + " report failed", event, err);
    }
}

const { ccclass } = cc._decorator;

@ccclass
export default class AppReviewView extends cc.Component {
    private _rating = 0;
    private _acting = false;
    private _closed = false;
    private _panel: cc.Node | null = null;
    private _stateRating: cc.Node | null = null;
    private _stateThanks: cc.Node | null = null;
    private _btnClose: cc.Node | null = null;
    private _btnOk: cc.Node | null = null;
    private _stars: cc.Node[] = [];
    private _starFills: (cc.Node | null)[] = [];

    onLoad(): void {
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
        console.log(
            LOG_TAG + " onLoad bind -> stars=" + this._stars.length +
            " panel=" + !!this._panel +
            " stateRating=" + !!this._stateRating +
            " stateThanks=" + !!this._stateThanks +
            " btnClose=" + !!this._btnClose +
            " btnOk=" + !!this._btnOk
        );
    }

    start(): void {
        this._playEnterAnim();
    }

    private _findDeep(node: cc.Node | null, name: string): cc.Node | null {
        if (!node || !node.isValid) {
            return null;
        }
        if (node.name === name) {
            return node;
        }
        const children = node.children || [];
        for (let i = 0; i < children.length; i++) {
            const found = this._findDeep(children[i], name);
            if (found) {
                return found;
            }
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
            const index = i;
            this._stars[index].on(cc.Node.EventType.TOUCH_END, () => {
                this._onClickStar(index + 1);
            }, this);
        }
        this._btnClose?.on(cc.Node.EventType.TOUCH_END, this._close, this);
        this._btnOk?.on(cc.Node.EventType.TOUCH_END, this._close, this);
    }

    private _onClickStar(rating: number): void {
        if (this._acting) {
            console.log(LOG_TAG + " _onClickStar ignored(acting) rating=" + rating);
            return;
        }
        console.log(LOG_TAG + " _onClickStar rating=" + rating);
        this._rating = rating;
        this._refreshStars();
        reportEvent("app_review_star_click", { rating });
        this._acting = true;
        this.scheduleOnce(this._applyRating, 0.32);
    }

    private _refreshStars(): void {
        for (let i = 0; i < this._starFills.length; i++) {
            if (this._starFills[i]) {
                this._starFills[i]!.active = i < this._rating;
            }
        }
    }

    private _isTfUser(): boolean {
        try {
            if (!MiddleHelper) {
                return true;
            }
            if (typeof MiddleHelper.getRegionalState === "function") {
                const state = MiddleHelper.getRegionalState();
                return !!(state && state.recogTF);
            }
            return !!MiddleHelper.recogTF;
        } catch (err) {
            console.warn(LOG_TAG + " read recog_tf failed", err);
            return true;
        }
    }

    private _applyRating(): void {
        const isTf = this._isTfUser();
        if (this._rating >= 4 || !isTf) {
            console.log(LOG_TAG + " rating=" + this._rating + " recog_tf=" + isTf + " -> google play");
            reportEvent("app_review_jump", { rating: this._rating, recog_tf: isTf ? 1 : 0 });
            AppReviewManager.getInstance().markJumped();
            this._close();
        } else {
            console.log(LOG_TAG + " low rating=" + this._rating + " recog_tf=" + isTf + " -> thanks");
            reportEvent("app_review_thanks", { rating: this._rating, recog_tf: isTf ? 1 : 0 });
            this._showThanks();
        }
    }

    private _showThanks(): void {
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
            cc.tween(heart).to(0.3, { scale: 1 }, { easing: "backOut" }).start();
        }
    }

    private _close(): void {
        if (!this._closed) {
            this._closed = true;
            console.log(
                LOG_TAG + " _close rating=" + (this._rating || 0) +
                " rated=" + (this._rating > 0 ? 1 : 0)
            );
            reportEvent("app_review_close", {
                rating: this._rating || 0,
                rated: this._rating > 0 ? 1 : 0,
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
            cc.tween(panel).to(0.25, { scale: 1, opacity: 255 }, { easing: "backOut" }).start();
        }
    }
}
