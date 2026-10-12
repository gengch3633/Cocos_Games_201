import AdManager from "./AdManager";
import AudioMgr from "./AudioMgr";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import GEMgr from "./GEMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import InterfaceMgr from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";
import MultiPlatform from "./MultiPlatform";
import UIMgr from "./UIMgr";
import UserData from "./UserData";

const { ccclass } = cc._decorator;

@ccclass
export default class cashArrowReviveView extends cc.Component {

    public bool_cantouch: boolean = true;

    protected onLoad(): void {
        this._bindEvents();
        this.showAni();
        AudioMgr.getInstance().playEffect("audio/revive_popup", InterfaceMgr.bundleName.ui);
        this.showInterstitialAd();
        this._applyI18nTexts();
        this._bindLanguageEvent();
    }

    protected onDestroy(): void {
        this._unbindLanguageEvent();
    }

    public i18n(key: string, params?: any[] | null, fallback?: string): string {
        return LanguageService.t(key, params || [], fallback);
    }

    private _bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    private _unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    private onLanguageChanged(): void {
        this._applyI18nTexts();
    }

    private _findNodeDeep(node: cc.Node | null, name: string): cc.Node | null {
        if (!node) return null;
        if (node.name === name) return node;
        for (let i = 0; i < node.childrenCount; i++) {
            const found = this._findNodeDeep(node.children[i], name);
            if (found) return found;
        }
        return null;
    }

    private _setLabelByName(nodeName: string, key: string, fallback: string): void {
        const node = this._findNodeDeep(this.node, nodeName);
        if (!node) return;
        let label = node.getComponent(cc.Label);
        if (!label) {
            const labels = node.getComponentsInChildren(cc.Label);
            label = labels && labels.length > 0 ? labels[0] : null;
        }
        if (label) {
            label.string = this.i18n(key, null, fallback);
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
        if (!bg) return;

        const btnRetry = bg.getChildByName("btn_retry");
        if (btnRetry) {
            btnRetry.on(cc.Node.EventType.TOUCH_END, this.OnClickRevive, this);
        }

        const txtTryAgain = bg.getChildByName("txt_try_again");
        if (txtTryAgain) {
            txtTryAgain.on(cc.Node.EventType.TOUCH_END, this.OnClickRestart, this);
        }

        const closeBtn = bg.getChildByName("close_btn");
        if (closeBtn) {
            closeBtn.on(cc.Node.EventType.TOUCH_END, this.OnClickRestart, this);
        }
    }

    public async showInterstitialAd(): Promise<void> {
        this.bool_cantouch = false;
        await MultiPlatform.getInstance().showInterstitialAd();
        this.scheduleOnce(() => {
            this.bool_cantouch = true;
        }, 1);
    }

    public async OnClickRevive(): Promise<void> {
        if (!this.bool_cantouch) return;

        try {
            BusinessAnalyticsService.reportData("ad_show", {
                scene: "revive",
                level: UserData.getInstance().level
            });
        } catch (e) {}

        const revived: boolean = await this.playReviveVideoByAdManager();
        if (revived) {
            try {
                BusinessAnalyticsService.reportData("level_revive", {
                    level: UserData.getInstance().level
                });
            } catch (e) {}

            this._claimReviveReward(() => {
                GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.gameAdFuhuo);
                UIMgr.getInstance().hide(this.node);
            });
        }
    }

    private playReviveVideoByAdManager(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            const adManager = AdManager && AdManager.getInstance ? AdManager.getInstance() : null;
            if (!adManager || typeof adManager.playNormalVideoAd !== "function") {
                resolve(false);
                return;
            }

            try {
                adManager.playNormalVideoAd({
                    ad_type: "revive",
                    force_video: false
                }, (result: any) => {
                    const success = !result || result.compensationQualifyMark === undefined || !!result.compensationQualifyMark;
                    resolve(success);
                }, (err: any) => {
                    cc.warn("[cashArrowReviveView] revive video failed:", err && err.message || err);
                    resolve(false);
                }, this.i18n("key_tip_reward_video_play_fail", null, "Rewarded video failed to play, please try again"));
            } catch (e) {
                console.error("[cashArrowReviveView] playNormalVideoAd failed", e);
                resolve(false);
            }
        });
    }

    private _claimReviveReward(callback?: (() => void) | null): void {
        try {
            LoadingHttpService.claimArrowAdReward({
                video_type: "resurrection"
            }, Handler.create(null, (res: any) => {
                console.log("[cashArrowReviveView] claimReviveReward success", res);
                if (callback) callback();
            }), Handler.create(null, (err: any) => {
                console.error("[cashArrowReviveView] claimReviveReward error", err);
                if (callback) callback();
            }));
        } catch (e) {
            console.error("[cashArrowReviveView] claimReviveReward exception", e);
            if (callback) callback();
        }
    }

    public OnClickRestart(): void {
        try {
            GEMgr.trackEvent("lvNode", {
                level: UserData.getInstance().level,
                lose: 1
            });
        } catch (e) {}

        try {
            GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.levelFailReport);
        } catch (e) {}

        GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.gameRestart);
        UIMgr.getInstance().hide(this.node);
    }

    private showAni(): void {
        const bg = this.node.getChildByName("bg");
        if (!bg) return;

        bg.y += 2000;
        bg.opacity = 0;

        cc.tween(bg)
            .by(0.3, { y: -2100 } as any)
            .by(0.3, { y: 100 } as any, { easing: "backOut" })
            .union()
            .start();

        cc.tween(bg)
            .delay(0.15)
            .to(0.2, { opacity: 255 } as any)
            .start();
    }
}