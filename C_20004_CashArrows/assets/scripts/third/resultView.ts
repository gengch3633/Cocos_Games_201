import "./MultiPlatform";
import AudioMgr from "./AudioMgr";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import GEMgr from "./GEMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import Tips from "./Tips";
import UIMgr from "./UIMgr";
import UIParams from "./UIParams";
import UserData from "./UserData";

const { ccclass, property, menu } = cc._decorator;

interface PassRewardData {
    settlementId: string;
    baseReward: number;
    adReward: number;
    forceWatchAd: boolean;
}

interface RewardTextData {
    baseReward?: number;
    adReward?: number;
    forceWatchAd?: boolean;
}

@ccclass
@menu("业务逻辑/resultView")
export default class resultView extends cc.Component {

    @property(sp.Skeleton)
    sp_result: sp.Skeleton = null;

    @property(cc.Node)
    node_nextani: cc.Node = null;

    @property(cc.Label)
    txt_curlevel: cc.Label = null;

    @property(cc.Label)
    txt_nextlevel: cc.Label = null;

    entryData: any = null;
    passRewardData: PassRewardData = null;
    isLoadingPass: boolean = false;
    isClaiming: boolean = false;
    hasClaimed: boolean = false;
    winLevel: number = 1;

    btnMain: cc.Node = null;
    btnOnly: cc.Node = null;
    lblOnly: cc.Label = null;
    lblReward: cc.Label = null;
    lblMain: cc.Label = null;
    lblTitle: cc.Label = null;
    nodeAdIcon: cc.Node = null;
    nodeRewardCard: cc.Node = null;
    nodeMoneyIcon: cc.Node = null;

    start(): void {
        this.entryData = UIParams.parse(this.node, 0, null) || this.entryData || {};
        if (this.entryData.level > 0) {
            this.winLevel = this.entryData.level;
        }
        this.winLevel = this.entryData.level > 0 ? this.entryData.level : UserData.getInstance().level;
        this.showAni();
        this.bindDynamicNodes();
        this.applySuccessStyle();
        this.refreshRewardTexts({
            baseReward: 500,
            adReward: 1000,
            forceWatchAd: false
        });
        GEMgr.trackEvent("lvNode", {
            level: this.winLevel,
            win: 1
        });
        if (!cc.sys.isBrowser) {
            GEMgr.ge.track("userAction", {
                action: "游戏胜利",
                module: "关卡" + this.winLevel,
                isAD: 0
            }, new Date());
        }
        this.loadPassReward();
    }

    setEntryData(entryData: any): void {
        this.entryData = entryData || {};
        if (this.entryData.level > 0) {
            this.winLevel = this.entryData.level;
        }
        this.loadPassReward();
    }

    OnClickNext(): void {
        this.onClickMainClaim();
    }

    OnClickShare(): void {
        this.onClickOnlyClaim();
    }

    async onClickMainClaim(): Promise<void> {
        if (this.isClaiming || this.hasClaimed) {
            return;
        }
        this.isClaiming = true;
        this.refreshButtonsState();
        try {
            const scene = this.passRewardData && this.passRewardData.forceWatchAd ? "pass_force" : "pass_active";
            BusinessAnalyticsService.reportData("ad_show", {
                scene: scene,
                level: this.winLevel
            });
        } catch (e) {
        }
        try {
            const watched = await this.simulateWatchAd();
            if (!watched) {
                Tips.show(this.i18n("key_result_tip_watch_full"));
                return;
            }
            await this.onClaimSuccess();
        } catch (e) {
            Tips.show(this.i18n("key_result_tip_ad_error"));
        } finally {
            this.isClaiming = false;
            this.refreshButtonsState();
        }
    }

    async onClickOnlyClaim(): Promise<void> {
        if (this.isClaiming || this.hasClaimed) {
            return;
        }
        await this.claimOnlyReward();
    }

    async claimOnlyReward(): Promise<void> {
        this.isClaiming = true;
        this.refreshButtonsState();
        try {
            await this.onClaimSuccess();
        } catch (e) {
            Tips.show(this.i18n("key_result_tip_claim_error"));
        } finally {
            this.isClaiming = false;
            this.refreshButtonsState();
        }
    }

    async simulateWatchAd(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            UIMgr.getInstance().showWatingUI();
            setTimeout(() => {
                UIMgr.getInstance().hideWatingUI();
                Tips.show(this.i18n("key_result_tip_ad_done"));
                resolve(true);
            }, 900);
        });
    }

    async loadPassReward(): Promise<void> {
        if (this.isLoadingPass || this.hasClaimed) {
            return;
        }
        this.isLoadingPass = true;
        this.refreshButtonsState();
        try {
            const data = await this.requestPassReward();
            this.passRewardData = this.normalizePassRewardData(data);
            this.refreshRewardTexts(this.passRewardData);
        } catch (e) {
            this.passRewardData = this.normalizePassRewardData(null);
            this.refreshRewardTexts(this.passRewardData);
            Tips.show(this.i18n("key_result_tip_reward_load_fail"));
        } finally {
            this.isLoadingPass = false;
            this.refreshButtonsState();
        }
    }

    async requestPassReward(): Promise<any> {
        const entryData = this.entryData || {};
        const params = {
            level: this.winLevel
        };
        if (typeof entryData.requestPassReward !== "function") {
            return {
                reward_amount: this.safeNum(entryData.mockRewardAmount, 500),
                ad_reward_amount: this.safeNum(entryData.mockAdRewardAmount, 1000),
                force_watch_ad: !!entryData.mockForceWatchAd,
                settlement_id: entryData.mockSettlementId || ""
            };
        }
        return await entryData.requestPassReward(params);
    }

    async requestWatchAdReward(): Promise<boolean> {
        const entryData = this.entryData || {};
        const passData = this.passRewardData || ({} as PassRewardData);
        const params = {
            level: this.winLevel,
            settlement_id: passData.settlementId || "",
            reward_amount: passData.adReward || 0
        };
        if (typeof entryData.requestWatchAdReward !== "function") {
            return true;
        }
        const result = await entryData.requestWatchAdReward(params);
        return !!result || result === undefined;
    }

    async requestClaimReward(): Promise<boolean> {
        const entryData = this.entryData || {};
        const passData = this.passRewardData || ({} as PassRewardData);
        const params = {
            level: this.winLevel,
            settlement_id: passData.settlementId || "",
            reward_amount: passData.baseReward || 0
        };
        if (typeof entryData.requestClaimReward !== "function") {
            return true;
        }
        const result = await entryData.requestClaimReward(params);
        return !!result || result === undefined;
    }

    async onClaimSuccess(): Promise<void> {
        if (this.hasClaimed) {
            return;
        }
        this.hasClaimed = true;
        UserData.getInstance().level = this.winLevel + 1;
        this.ShowNextAni();
    }

    normalizePassRewardData(data: any): PassRewardData {
        const source = this.unwrapData(data);
        const baseReward = this.safeNum(this.pickField(source, [ "reward_amount", "reward", "base_reward", "amount" ]), 500);
        const adReward = this.safeNum(this.pickField(source, [ "ad_reward_amount", "ad_reward", "video_reward", "double_reward" ]), 2 * baseReward);
        const forceWatchAd = !!this.pickField(source, [ "force_watch_ad", "force_ad", "must_watch_ad" ]);
        return {
            settlementId: this.pickField(source, [ "settlement_id", "pass_id", "reward_id" ]) || "",
            baseReward: baseReward,
            adReward: Math.max(baseReward, adReward),
            forceWatchAd: forceWatchAd
        };
    }

    unwrapData(data: any): any {
        let current = data;
        let depth = 0;
        while (current && typeof current === "object" && depth < 4 && current.data !== undefined) {
            current = current.data;
            depth++;
        }
        return current || {};
    }

    pickField(source: any, keys: string[]): any {
        if (source) {
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (source[key] !== undefined) {
                    return source[key];
                }
            }
        }
    }

    safeNum(value: any, fallback: number): number {
        const num = Number(value);
        return isNaN(num) ? fallback : Math.max(0, Math.floor(num));
    }

    bindDynamicNodes(): void {
        const bg = this.node.getChildByName("bg");
        if (!bg) {
            return;
        }
        this.btnMain = bg.getChildByName("btn_nextlevel");
        this.btnOnly = bg.getChildByName("btn_share");
        this.nodeRewardCard = bg.getChildByName("reward_card");
        const titleNode = bg.getChildByName("title");
        this.lblTitle = titleNode ? titleNode.getComponent(cc.Label) : null;
        if (this.lblTitle) {
            this.lblTitle.string = this.i18n("key_result_title_congrats");
        }
        if (!this.nodeRewardCard) {
            this.nodeRewardCard = new cc.Node("reward_card");
            this.nodeRewardCard.parent = bg;
            this.nodeRewardCard.setPosition(0, 45);
            this.nodeRewardCard.setContentSize(260, 290);
            this.nodeRewardCard.addComponent(cc.Sprite);
        }
        this.nodeMoneyIcon = this.nodeRewardCard.getChildByName("money_icon");
        if (!this.nodeMoneyIcon) {
            this.nodeMoneyIcon = new cc.Node("money_icon");
            this.nodeMoneyIcon.parent = this.nodeRewardCard;
            this.nodeMoneyIcon.setPosition(0, 40);
            this.nodeMoneyIcon.addComponent(cc.Sprite);
        }
        let rewardNode = this.nodeRewardCard.getChildByName("reward_amount");
        if (rewardNode) {
            this.lblReward = rewardNode.getComponent(cc.Label) || rewardNode.addComponent(cc.Label);
        } else {
            rewardNode = new cc.Node("reward_amount");
            rewardNode.parent = this.nodeRewardCard;
            rewardNode.setPosition(0, -78);
            this.lblReward = rewardNode.addComponent(cc.Label);
            this.lblReward.fontSize = 52;
            this.lblReward.lineHeight = 58;
            this.lblReward.enableBold = true;
        }
        if (this.btnMain) {
            let mainLabelNode = this.btnMain.getChildByName("lbl_main");
            if (!mainLabelNode) {
                mainLabelNode = new cc.Node("lbl_main");
                mainLabelNode.parent = this.btnMain;
                mainLabelNode.setPosition(50, 0);
            }
            this.lblMain = mainLabelNode.getComponent(cc.Label) || mainLabelNode.addComponent(cc.Label);
            this.lblMain.string = this.i18n("key_result_main_claim");
            this.lblMain.fontSize = 36;
            this.lblMain.lineHeight = 40;
            this.lblMain.enableBold = true;
            this.lblMain.node.color = new cc.Color(172, 65, 58);
            this.nodeAdIcon = this.btnMain.getChildByName("ad_icon");
            if (!this.nodeAdIcon) {
                this.nodeAdIcon = new cc.Node("ad_icon");
                this.nodeAdIcon.parent = this.btnMain;
                this.nodeAdIcon.setPosition(-150, 0);
                this.nodeAdIcon.addComponent(cc.Sprite);
            }
        }
        if (this.btnOnly) {
            const btnSprite = this.btnOnly.getComponent(cc.Sprite);
            if (btnSprite) {
                btnSprite.enabled = false;
            }
            let onlyLabelNode = this.btnOnly.getChildByName("lbl_only_claim");
            if (!onlyLabelNode) {
                onlyLabelNode = new cc.Node("lbl_only_claim");
                onlyLabelNode.parent = this.btnOnly;
            }
            onlyLabelNode.setPosition(0, 0);
            this.lblOnly = onlyLabelNode.getComponent(cc.Label) || onlyLabelNode.addComponent(cc.Label);
            this.lblOnly.fontSize = 28;
            this.lblOnly.lineHeight = 32;
            this.lblOnly.string = "";
            this.lblOnly.node.color = new cc.Color(238, 226, 205);
        }
    }

    applySuccessStyle(): void {
        const bg = this.node.getChildByName("bg");
        if (!bg) {
            return;
        }
        const bgSprite = bg.getComponent(cc.Sprite);
        if (bgSprite) {
            cc.assetManager.getBundle(InterfaceMgr.bundleName.ui, (err, bundle) => {
                if (!err && bundle) {
                    bundle.load("texture/success/success_bg", cc.SpriteFrame, (loadErr, frame) => {
                        if (!loadErr && frame && bgSprite.isValid) {
                            bgSprite.spriteFrame = frame as cc.SpriteFrame;
                        }
                    });
                }
            });
        }
        const nextLevelNode = bg.getChildByName("nextlevel");
        if (nextLevelNode) {
            nextLevelNode.active = false;
        }
        if (this.btnMain) {
            const btnSprite = this.btnMain.getComponent(cc.Sprite);
            if (btnSprite) {
                cc.assetManager.getBundle(InterfaceMgr.bundleName.ui, (err, bundle) => {
                    if (!err && bundle) {
                        bundle.load("texture/success/dialog_get_btn", cc.SpriteFrame, (loadErr, frame) => {
                            if (!loadErr && frame && btnSprite.isValid) {
                                btnSprite.spriteFrame = frame as cc.SpriteFrame;
                            }
                        });
                    }
                });
            }
            if (this.nodeAdIcon) {
                cc.assetManager.getBundle(InterfaceMgr.bundleName.ui, (err, bundle) => {
                    if (!err && bundle) {
                        bundle.load("texture/success/dialog_ad_icon", cc.SpriteFrame, (loadErr, frame) => {
                            if (!loadErr && frame && this.nodeAdIcon && this.nodeAdIcon.isValid) {
                                const adSprite = this.nodeAdIcon.getComponent(cc.Sprite);
                                if (adSprite) {
                                    adSprite.spriteFrame = frame as cc.SpriteFrame;
                                }
                            }
                        });
                    }
                });
            }
        }
        if (this.nodeRewardCard) {
            const cardSprite = this.nodeRewardCard.getComponent(cc.Sprite);
            if (cardSprite) {
                cc.assetManager.getBundle(InterfaceMgr.bundleName.ui, (err, bundle) => {
                    if (!err && bundle) {
                        bundle.load("texture/success/dialog_money_bg", cc.SpriteFrame, (loadErr, frame) => {
                            if (!loadErr && frame && cardSprite.isValid) {
                                cardSprite.spriteFrame = frame as cc.SpriteFrame;
                            }
                        });
                    }
                });
            }
        }
    }

    refreshRewardTexts(data: RewardTextData): void {
        if (this.lblReward) {
            this.lblReward.string = this.i18n("key_result_reward_prefix", [ this.getCurrencyText("RP", data.adReward || 0) ]);
            this.lblReward.node.color = new cc.Color(241, 221, 141);
        }
        if (this.lblOnly) {
            let text = this.i18n("key_result_only_claim", [ this.getCurrencyText("RP", data.baseReward || 0) ]);
            if (data.forceWatchAd) {
                text += this.i18n("key_result_watch_ad_suffix");
            }
            this.lblOnly.string = text;
        }
    }

    refreshButtonsState(): void {
        const interactable = !this.isLoadingPass && !this.isClaiming && !this.hasClaimed;
        if (this.btnMain) {
            const mainButton = this.btnMain.getComponent(cc.Button);
            if (mainButton) {
                mainButton.interactable = interactable;
            }
        }
        if (this.btnOnly) {
            const onlyButton = this.btnOnly.getComponent(cc.Button);
            if (onlyButton) {
                onlyButton.interactable = interactable;
            }
        }
    }

    formatMoney(value: number): string {
        return Math.max(0, Math.floor(value || 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    getCurrencyText(currencyType: string, amount?: number): string {
        const value: any = amount !== undefined ? amount : currencyType;
        return LanguageService.formatCurrency(value);
    }

    i18n(key: string, values?: any[], defaultValue?: string): string {
        return LanguageService.t(key, values, defaultValue);
    }

    showAni(): void {
        const bg = this.node.getChildByName("bg");
        if (!bg) {
            return;
        }
        bg.y += 2000;
        bg.opacity = 0;
        cc.tween(bg)
            .by(0.3, { y: -2100 })
            .by(0.3, { y: 100 }, { easing: "backOut" })
            .union()
            .delay(0.1)
            .call(() => {
                AudioMgr.getInstance().playEffect("audio/level_complete", InterfaceMgr.bundleName.ui);
                const lizi = bg.getChildByName("lizi");
                const lizi2 = bg.getChildByName("lizi2");
                if (lizi) {
                    lizi.active = true;
                }
                if (lizi2) {
                    lizi2.active = true;
                }
                if (this.sp_result && this.sp_result.node) {
                    this.sp_result.node.active = true;
                    this.sp_result.setAnimation(0, "win", false);
                    this.sp_result.addAnimation(0, "winidle", true);
                }
            })
            .start();
        cc.tween(bg)
            .delay(0.15)
            .to(0.2, { opacity: 255 })
            .start();
    }

    ShowNextAni(): void {
        if (this.node_nextani && this.txt_curlevel && this.txt_nextlevel) {
            this.node_nextani.active = true;
            this.txt_curlevel.string = this.winLevel + "";
            this.txt_nextlevel.string = this.winLevel + 1 + "";
            cc.tween(this.txt_curlevel.node)
                .by(0.5, { opacity: -255, y: -60 })
                .start();
            cc.tween(this.txt_nextlevel.node)
                .by(0.5, { opacity: 255, y: -60 })
                .delay(1)
                .call(() => {
                    GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.gameNext);
                    UIMgr.getInstance().hide(this.node);
                })
                .start();
        } else {
            GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.gameNext);
            UIMgr.getInstance().hide(this.node);
        }
    }
}