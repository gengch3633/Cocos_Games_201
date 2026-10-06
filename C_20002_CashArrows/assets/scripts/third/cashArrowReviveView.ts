import AudioMgr from "./AudioMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import MultiPlatform from "./MultiPlatform";
import AdManager from "./AdManager";
import UIMgr from "./UIMgr";
import GEMgr from "./GEMgr";
import { bundleName, gameEvent } from "./InterfaceMgr";
import UserData from "./UserData";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";
import Handler from "./Handler";

const { ccclass } = cc._decorator;

@ccclass
export default class cashArrowReviveView extends cc.Component {
    bool_cantouch = !0;

    onLoad() {
        this._bindEvents();
        this.showAni();
        AudioMgr.getInstance().playEffect(" audio/ revive_popup ", bundleName.ui);
        this.showInterstitialAd();
        this._applyI18nTexts();
        this._bindLanguageEvent();
    }

    onDestroy() {
        this._unbindLanguageEvent();
    }

    i18n(e: string, t?: any, i?: string) {
        return LanguageService.t(e, t || [], i);
    }

    _bindLanguageEvent() {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    _unbindLanguageEvent() {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    onLanguageChanged() {
        this._applyI18nTexts();
    }

    _findNodeDeep(e: cc.Node, t: string) {
        if (!e) return null;
        if (e.name === t) return e;
        for (var i = 0; i < e.childrenCount; i++) {
            var n = this._findNodeDeep(e.children[i], t);
            if (n) return n;
        }
        return null;
    }

    _setLabelByName(e: string, t: string, i: string) {
        var n = this._findNodeDeep(this.node, e);
        if (n) {
            var a = n.getComponent(cc.Label);
            if (!a) {
                var o = n.getComponentsInChildren(cc.Label);
                a = o && o.length > 0 ? o[0] : null;
            }
            a && (a.string = this.i18n(t, null, i));
        }
    }

    _applyI18nTexts() {
        this._setLabelByName(" txt_continue ", " key_revive_title_continue ", " Continue? ");
        this._setLabelByName(" txt_timesup ", " key_revive_title_timesup ", " No Health ! ");
        this._setLabelByName(" txt_desc ", " key_revive_desc ", " Don 't give up! Revive for free and keep fighting!");
        this._setLabelByName("txt_free_revive", "key_revive_btn_free", "Free Revive");
        this._setLabelByName("txt_try_again", "key_revive_btn_try_again", "Try Again");
    }

    _bindEvents() {
        var e = this, t = this.node.getChildByName("bg");
        if (t) {
            var i = t.getChildByName("btn_retry");
            i && i.on(cc.Node.EventType.TOUCH_END, function () {
                e.OnClickRevive();
            }, e);
            var n = t.getChildByName("txt_try_again");
            n && n.on(cc.Node.EventType.TOUCH_END, function () {
                e.OnClickRestart();
            }, e);
            var a = t.getChildByName("close_btn");
            a && a.on(cc.Node.EventType.TOUCH_END, function () {
                e.OnClickRestart();
            }, e);
        }
    }

    async showInterstitialAd() {
        this.bool_cantouch = !1;
        await MultiPlatform.getInstance().showInterstitialAd();
        this.scheduleOnce(() => {
            this.bool_cantouch = !0;
        }, 1);
    }

    async OnClickRevive() {
        if (!this.bool_cantouch) return;
        try {
            BusinessAnalyticsService.reportData("ad_show", {
                scene: "revive",
                level: UserData.getInstance().level
            });
        } catch (e) { }
        if (await this.playReviveVideoByAdManager()) {
            try {
                BusinessAnalyticsService.reportData("level_revive", {
                    level: UserData.getInstance().level
                });
            } catch (e) { }
            this._claimReviveReward(() => {
                GlobalEventMgr.getInstance().emit(gameEvent.gameAdFuhuo);
                UIMgr.getInstance().hide(this.node);
            });
        }
    }

    playReviveVideoByAdManager() {
        var e = this;
        return new Promise<boolean>(function (t) {
            var i = AdManager && AdManager.getInstance ? AdManager.getInstance() : null;
            if (i && "function" == typeof i.playNormalVideoAd) try {
                i.playNormalVideoAd({
                    ad_type: "revive",
                    force_video: !1
                }, function (e) {
                    var i = !e || void 0 === e.compensationQualifyMark || !!e.compensationQualifyMark;
                    t(i);
                }, function (e) {
                    cc.warn("[cashArrowReviveView] revive video failed:", e && e.message || e);
                    t(!1);
                }, e.i18n("key_tip_reward_video_play_fail", null, "Rewarded video failed to play, please try again"));
            } catch (e) {
                console.error("[cashArrowReviveView] playNormalVideoAd failed", e);
                t(!1);
            } else t(!1);
        });
    }

    _claimReviveReward(t: () => void) {
        try {
            LoadingHttpService.claimArrowAdReward({
                video_type: "resurrection"
            }, Handler.create(null, function (e) {
                console.log("[cashArrowReviveView] claimReviveReward success", e);
                t && t();
            }), Handler.create(null, function (e) {
                console.error("[cashArrowReviveView] claimReviveReward error", e);
                t && t();
            }));
        } catch (e) {
            console.error("[cashArrowReviveView] claimReviveReward exception", e);
            t && t();
        }
    }

    OnClickRestart() {
        try {
            GEMgr.trackEvent("lvNode", {
                level: UserData.getInstance().level,
                lose: 1
            });
        } catch (e) { }
        try {
            GlobalEventMgr.getInstance().emit(gameEvent.levelFailReport);
        } catch (e) { }
        GlobalEventMgr.getInstance().emit(gameEvent.gameRestart);
        UIMgr.getInstance().hide(this.node);
    }

    showAni() {
        var e = this.node.getChildByName("bg");
        if (e) {
            e.y += 2e3;
            e.opacity = 0;
            cc.tween(e).by(.3, {
                y: -2100
            }).by(.3, {
                y: 100
            }, {
                easing: " backOut "
            }).union().start();
            cc.tween(e).delay(.15).to(.2, {
                opacity: 255
            }).start();
        }
    }
}
