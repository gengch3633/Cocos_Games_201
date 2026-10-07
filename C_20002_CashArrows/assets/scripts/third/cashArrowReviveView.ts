import AdManager from "./AdManager";
import AudioMgr from "./AudioMgr";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import InterfaceMgr, { bundleName, gameEvent } from "./InterfaceMgr";
import LoadingHttpService from "./LoadingHttpService";
import MultiPlatform from "./MultiPlatform";
import UIMgr from "./UIMgr";
import UserData from "./UserData";
import GEMgr from "./GEMgr";
import LanguageService from "./LanguageService";

const { ccclass } = cc._decorator;

@ccclass
export default class cashArrowReviveView extends cc.Component {
    bool_cantouch: boolean = true;

    onLoad(): void {
        this._bindEvents();
        this.showAni();
        AudioMgr.getInstance().playEffect("audio/revive_popup", bundleName.ui);
        this.showInterstitialAd();
        this._applyI18nTexts();
        this._bindLanguageEvent();
    }

    onDestroy(): void {
        this._unbindLanguageEvent();
    }

    i18n(key: string, params?: any[], fallback?: string): string {
        return LanguageService.t(key, params || [], fallback);
    }

    _bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    _unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    onLanguageChanged(): void {
        this._applyI18nTexts();
    }

    _findNodeDeep(root: cc.Node, name: string): cc.Node {
        if (!root) {
            return null;
        }
        if (root.name === name) {
            return root;
        }
        for (let i = 0; i < root.childrenCount; i++) {
            const found = this._findNodeDeep(root.children[i], name);
            if (found) {
                return found;
            }
        }
        return null;
    }

    _setLabelByName(nodeName: string, key: string, fallback: string): void {
        const node = this._findNodeDeep(this.node, nodeName);
        if (node) {
            let label = node.getComponent(cc.Label);
            if (!label) {
                const labels = node.getComponentsInChildren(cc.Label);
                label = labels?.length > 0 ? labels[0] : null;
            }
            if (label) {
                label.string = this.i18n(key, null, fallback);
            }
        }
    }

    _applyI18nTexts(): void {
        this._setLabelByName("txt_continue", "key_revive_title_continue", "Continue?");
        this._setLabelByName("txt_timesup", "key_revive_title_timesup", "No Health!");
        this._setLabelByName("txt_desc", "key_revive_desc", "Don't give up! Revive for free and keep fighting!");
        this._setLabelByName("txt_free_revive", "key_revive_btn_free", "Free Revive");
        this._setLabelByName("txt_try_again", "key_revive_btn_try_again", "Try Again");
    }

    _bindEvents(): void {
        const bg = this.node.getChildByName("bg");
        if (bg) {
            bg.getChildByName("btn_retry")?.on(cc.Node.EventType.TOUCH_END, () => this.OnClickRevive(), this);
            bg.getChildByName("txt_try_again")?.on(cc.Node.EventType.TOUCH_END, () => this.OnClickRestart(), this);
            bg.getChildByName("close_btn")?.on(cc.Node.EventType.TOUCH_END, () => this.OnClickRestart(), this);
        }
    }

    async showInterstitialAd(): Promise<void> {
        this.bool_cantouch = false;
        await MultiPlatform.getInstance().showInterstitialAd();
        this.scheduleOnce(() => {
            this.bool_cantouch = true;
        }, 1);
    }

    async OnClickRevive(): Promise<void> {
        if (!this.bool_cantouch) {
            return;
        }
        try {
            BusinessAnalyticsService.reportData("ad_show", {
                scene: "revive",
                level: UserData.getInstance().level
            });
        } catch (_error) {}
        if (await this.playReviveVideoByAdManager()) {
            try {
                BusinessAnalyticsService.reportData("level_revive", {
                    level: UserData.getInstance().level
                });
            } catch (_error) {}
            this._claimReviveReward(() => {
                GlobalEventMgr.getInstance().emit(gameEvent.gameAdFuhuo);
                UIMgr.getInstance().hide(this.node);
            });
        }
    }

    playReviveVideoByAdManager(): Promise<boolean> {
        return new Promise((resolve) => {
            const adManager = AdManager?.getInstance?.();
            if (adManager && typeof adManager.playNormalVideoAd === "function") {
                try {
                    adManager.playNormalVideoAd({
                        ad_type: "revive",
                        force_video: false
                    }, (result: any) => {
                        const success = !result || result.compensationQualifyMark === undefined || !!result.compensationQualifyMark;
                        resolve(success);
                    }, (error: any) => {
                        cc.warn("[cashArrowReviveView] revive video failed:", error?.message || error);
                        resolve(false);
                    }, this.i18n("key_tip_reward_video_play_fail", null, "Rewarded video failed to play, please try again"));
                } catch (error) {
                    console.error("[cashArrowReviveView] playNormalVideoAd failed", error);
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        });
    }

    _claimReviveReward(callback: () => void): void {
        try {
            LoadingHttpService.claimArrowAdReward(
                { video_type: "resurrection" },
                Handler.create(null, (response: any) => {
                    console.log("[cashArrowReviveView] claimReviveReward success", response);
                    callback && callback();
                }),
                Handler.create(null, (error: any) => {
                    console.error("[cashArrowReviveView] claimReviveReward error", error);
                    callback && callback();
                })
            );
        } catch (error) {
            console.error("[cashArrowReviveView] claimReviveReward exception", error);
            callback && callback();
        }
    }

    OnClickRestart(): void {
        try {
            GEMgr.trackEvent("lvNode", {
                level: UserData.getInstance().level,
                lose: 1
            });
        } catch (_error) {}
        try {
            GlobalEventMgr.getInstance().emit(gameEvent.levelFailReport);
        } catch (_error) {}
        GlobalEventMgr.getInstance().emit(gameEvent.gameRestart);
        UIMgr.getInstance().hide(this.node);
    }

    showAni(): void {
        const bg = this.node.getChildByName("bg");
        if (bg) {
            bg.y += 2000;
            bg.opacity = 0;
            cc.tween(bg)
                .by(0.3, { y: -2100 })
                .by(0.3, { y: 100 }, { easing: "backOut" })
                .union()
                .start();
            cc.tween(bg).delay(0.15).to(0.2, { opacity: 255 }).start();
        }
    }
}
