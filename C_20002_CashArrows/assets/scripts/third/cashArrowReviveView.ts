import AdManager from "./AdManager";
import AudioMgr from "./AudioMgr";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import GEMgr from "./GEMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import { bundleName, gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";
import MultiPlatform from "./MultiPlatform";
import UIMgr from "./UIMgr";
import UserData from "./UserData";

const { ccclass } = cc._decorator;

@ccclass
export default class CashArrowReviveView extends cc.Component {
    bool_cantouch = true;

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

    private i18n(key: string, _params: any, fallback: string): string {
        return LanguageService.t(key, [], fallback);
    }

    private _bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    private _unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    onLanguageChanged(): void {
        this._applyI18nTexts();
    }

    private _findNodeDeep(node: cc.Node | null, name: string): cc.Node | null {
        if (!node) {
            return null;
        }
        if (node.name === name) {
            return node;
        }
        for (let i = 0; i < node.childrenCount; i++) {
            const found = this._findNodeDeep(node.children[i], name);
            if (found) {
                return found;
            }
        }
        return null;
    }

    private _setLabelByName(nodeName: string, i18nKey: string, fallback: string): void {
        const node = this._findNodeDeep(this.node, nodeName);
        if (node) {
            let label = node.getComponent(cc.Label);
            if (!label) {
                const labels = node.getComponentsInChildren(cc.Label);
                label = labels && labels.length > 0 ? labels[0] : null;
            }
            if (label) {
                label.string = this.i18n(i18nKey, null, fallback);
            }
        }
    }

    private _applyI18nTexts(): void {
        this._setLabelByName("txt_continue", "key_revive_title_continue", "Continue?");
        this._setLabelByName("txt_timesup", "key_revive_title_timesup", "No Health!");
        this._setLabelByName("txt_desc", "key_revive_desc", "Don't give up! Revive for free and keep fighting!");
        this._setLabelByName("txt_free_revive", "key_revive_btn_free", "Free Revive");
        this._setLabelByName("txt_try_again", "key_revive_btn_try_again", "Try Again");
    }

    private _bindEvents(): void {
        const bg = this.node.getChildByName("bg");
        if (bg) {
            const btnRetry = bg.getChildByName("btn_retry");
            btnRetry?.on(cc.Node.EventType.TOUCH_END, () => {
                this.OnClickRevive();
            }, this);
            const tryAgain = bg.getChildByName("txt_try_again");
            tryAgain?.on(cc.Node.EventType.TOUCH_END, () => {
                this.OnClickRestart();
            }, this);
            const closeBtn = bg.getChildByName("close_btn");
            closeBtn?.on(cc.Node.EventType.TOUCH_END, () => {
                this.OnClickRestart();
            }, this);
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
                level: UserData.getInstance().level,
            });
        } catch (e) {
        }
        const success = await this.playReviveVideoByAdManager();
        if (success) {
            try {
                BusinessAnalyticsService.reportData("level_revive", {
                    level: UserData.getInstance().level,
                });
            } catch (e) {
            }
            this._claimReviveReward(() => {
                GlobalEventMgr.getInstance().emit(gameEvent.gameAdFuhuo);
                UIMgr.getInstance().hide(this.node);
            });
        }
    }

    playReviveVideoByAdManager(): Promise<boolean> {
        return new Promise((resolve) => {
            const adMgr = AdManager.getInstance();
            if (adMgr && typeof adMgr.playNormalVideoAd === "function") {
                try {
                    adMgr.playNormalVideoAd(
                        { ad_type: "revive", force_video: false },
                        (result: any) => {
                            const ok = !result || result.compensationQualifyMark === undefined || !!result.compensationQualifyMark;
                            resolve(ok);
                        },
                        (err: any) => {
                            cc.warn("[cashArrowReviveView] revive video failed:", err?.message || err);
                            resolve(false);
                        },
                        this.i18n("key_tip_reward_video_play_fail", null, "Rewarded video failed to play, please try again")
                    );
                } catch (err) {
                    console.error("[cashArrowReviveView] playNormalVideoAd failed", err);
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        });
    }

    private _claimReviveReward(callback?: () => void): void {
        try {
            LoadingHttpService.claimArrowAdReward(
                { video_type: "resurrection" },
                Handler.create(null, (result: any) => {
                    console.log("[cashArrowReviveView] claimReviveReward success", result);
                    callback?.();
                }),
                Handler.create(null, (err: any) => {
                    console.error("[cashArrowReviveView] claimReviveReward error", err);
                    callback?.();
                })
            );
        } catch (err) {
            console.error("[cashArrowReviveView] claimReviveReward exception", err);
            callback?.();
        }
    }

    OnClickRestart(): void {
        try {
            GEMgr.trackEvent("lvNode", {
                level: UserData.getInstance().level,
                lose: 1,
            });
        } catch (e) {
        }
        try {
            GlobalEventMgr.getInstance().emit(gameEvent.levelFailReport);
        } catch (e) {
        }
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
