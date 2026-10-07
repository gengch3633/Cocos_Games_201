import AudioMgr from "./AudioMgr";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import GEMgr from "./GEMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr, { bundleName, gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import Tips from "./Tips";
import UIMgr from "./UIMgr";
import UserData from "./UserData";
import { UIParams } from "./UIParams";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu(" 业务逻辑/ resultView ")
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
    passRewardData: any = null;
    isLoadingPass = false;
    isClaiming = false;
    hasClaimed = false;
    winLevel = 1;
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
        GEMgr.trackEvent(" lvNode ", {
            level: this.winLevel,
            win: 1
        });
        if (!cc.sys.isBrowser) {
            GEMgr.ge.track(" userAction ", {
                action: " 游戏胜利 ",
                module: " 关卡 " + this.winLevel,
                isAD: 0
            }, new Date());
        }
        this.loadPassReward();
    }

    setEntryData(data: any): void {
        this.entryData = data || {};
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
            const scene = this.passRewardData && this.passRewardData.forceWatchAd ? " pass_force " : " pass_active ";
            BusinessAnalyticsService.reportData(" ad_show ", {
                scene,
                level: this.winLevel
            });
        } catch (_err) {}
        try {
            if (!(await this.simulateWatchAd())) {
                Tips.show(this.i18n(" key_result_tip_watch_full "));
                return;
            }
            await this.onClaimSuccess();
        } catch (_err) {
            Tips.show(this.i18n(" key_result_tip_ad_error "));
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
        } catch (_err) {
            Tips.show(this.i18n(" key_result_tip_claim_error "));
        } finally {
            this.isClaiming = false;
            this.refreshButtonsState();
        }
    }

    async simulateWatchAd(): Promise<boolean> {
        return new Promise((resolve) => {
            UIMgr.getInstance().showWatingUI();
            setTimeout(() => {
                UIMgr.getInstance().hideWatingUI();
                Tips.show(this.i18n(" key_result_tip_ad_done "));
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
            const response = await this.requestPassReward();
            this.passRewardData = this.normalizePassRewardData(response);
            await this.refreshRewardTexts(this.passRewardData);
        } catch (_err) {
            this.passRewardData = this.normalizePassRewardData(null);
            await this.refreshRewardTexts(this.passRewardData);
            Tips.show(this.i18n(" key_result_tip_reward_load_fail "));
        } finally {
            this.isLoadingPass = false;
            this.refreshButtonsState();
        }
    }

    async requestPassReward(): Promise<any> {
        const entry = this.entryData || {};
        const payload = { level: this.winLevel };
        if (typeof entry.requestPassReward === "function") {
            return entry.requestPassReward(payload);
        }
        return {
            reward_amount: this.safeNum(entry.mockRewardAmount, 500),
            ad_reward_amount: this.safeNum(entry.mockAdRewardAmount, 1000),
            force_watch_ad: !!entry.mockForceWatchAd,
            settlement_id: entry.mockSettlementId || " "
        };
    }

    async requestWatchAdReward(): Promise<boolean> {
        const entry = this.entryData || {};
        const reward = this.passRewardData || {};
        const payload = {
            level: this.winLevel,
            settlement_id: reward.settlementId || " ",
            reward_amount: reward.adReward || 0
        };
        if (typeof entry.requestWatchAdReward === "function") {
            const result = await entry.requestWatchAdReward(payload);
            return !!result || void 0 === result;
        }
        return true;
    }

    async requestClaimReward(): Promise<boolean> {
        const entry = this.entryData || {};
        const reward = this.passRewardData || {};
        const payload = {
            level: this.winLevel,
            settlement_id: reward.settlementId || " ",
            reward_amount: reward.baseReward || 0
        };
        if (typeof entry.requestClaimReward === "function") {
            const result = await entry.requestClaimReward(payload);
            return !!result || void 0 === result;
        }
        return true;
    }

    async onClaimSuccess(): Promise<void> {
        if (this.hasClaimed) {
            return;
        }
        this.hasClaimed = true;
        UserData.getInstance().level = this.winLevel + 1;
        this.ShowNextAni();
    }

    normalizePassRewardData(data: any): any {
        const raw = this.unwrapData(data);
        const baseReward = this.safeNum(this.pickField(raw, [" reward_amount ", " reward ", " base_reward ", " amount "]), 500);
        const adReward = this.safeNum(this.pickField(raw, [" ad_reward_amount ", " ad_reward ", " video_reward ", " double_reward "]), 2 * baseReward);
        const forceWatchAd = !!this.pickField(raw, [" force_watch_ad ", " force_ad ", " must_watch_ad "]);
        return {
            settlementId: this.pickField(raw, [" settlement_id ", " pass_id ", " reward_id "]) || " ",
            baseReward,
            adReward: Math.max(baseReward, adReward),
            forceWatchAd
        };
    }

    unwrapData(data: any): any {
        let current = data;
        for (let depth = 0; current && typeof current === "object" && depth < 4 && void 0 !== current.data; depth++) {
            current = current.data;
        }
        return current || {};
    }

    pickField(data: any, keys: string[]): any {
        if (data) {
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (void 0 !== data[key]) {
                    return data[key];
                }
            }
        }
    }

    safeNum(value: any, fallback: number): number {
        const num = Number(value);
        return isNaN(num) ? fallback : Math.max(0, Math.floor(num));
    }

    bindDynamicNodes(): void {
        const bg = this.node.getChildByName(" bg ");
        if (!bg) {
            return;
        }
        this.btnMain = bg.getChildByName(" btn_nextlevel ");
        this.btnOnly = bg.getChildByName(" btn_share ");
        this.nodeRewardCard = bg.getChildByName(" reward_card ");
        const title = bg.getChildByName(" title ");
        this.lblTitle = title ? title.getComponent(cc.Label) : null;
        if (this.lblTitle) {
            this.lblTitle.string = this.i18n(" key_result_title_congrats ");
        }
        if (!this.nodeRewardCard) {
            this.nodeRewardCard = new cc.Node(" reward_card ");
            this.nodeRewardCard.parent = bg;
            this.nodeRewardCard.setPosition(0, 45);
            this.nodeRewardCard.setContentSize(260, 290);
            this.nodeRewardCard.addComponent(cc.Sprite);
        }
        this.nodeMoneyIcon = this.nodeRewardCard.getChildByName(" money_icon ");
        if (!this.nodeMoneyIcon) {
            this.nodeMoneyIcon = new cc.Node(" money_icon ");
            this.nodeMoneyIcon.parent = this.nodeRewardCard;
            this.nodeMoneyIcon.setPosition(0, 40);
            this.nodeMoneyIcon.addComponent(cc.Sprite);
        }
        let rewardAmount = this.nodeRewardCard.getChildByName(" reward_amount ");
        if (rewardAmount) {
            this.lblReward = rewardAmount.getComponent(cc.Label) || rewardAmount.addComponent(cc.Label);
        } else {
            rewardAmount = new cc.Node(" reward_amount ");
            rewardAmount.parent = this.nodeRewardCard;
            rewardAmount.setPosition(0, -78);
            this.lblReward = rewardAmount.addComponent(cc.Label);
            this.lblReward.fontSize = 52;
            this.lblReward.lineHeight = 58;
            this.lblReward.enableBold = true;
        }
        if (this.btnMain) {
            let mainLabel = this.btnMain.getChildByName(" lbl_main ");
            if (!mainLabel) {
                mainLabel = new cc.Node(" lbl_main ");
                mainLabel.parent = this.btnMain;
                mainLabel.setPosition(50, 0);
            }
            this.lblMain = mainLabel.getComponent(cc.Label) || mainLabel.addComponent(cc.Label);
            this.lblMain.string = this.i18n(" key_result_main_claim ");
            this.lblMain.fontSize = 36;
            this.lblMain.lineHeight = 40;
            this.lblMain.enableBold = true;
            this.lblMain.node.color = new cc.Color(172, 65, 58);
            this.nodeAdIcon = this.btnMain.getChildByName(" ad_icon ");
            if (!this.nodeAdIcon) {
                this.nodeAdIcon = new cc.Node(" ad_icon ");
                this.nodeAdIcon.parent = this.btnMain;
                this.nodeAdIcon.setPosition(-150, 0);
                this.nodeAdIcon.addComponent(cc.Sprite);
            }
        }
        if (this.btnOnly) {
            const sprite = this.btnOnly.getComponent(cc.Sprite);
            if (sprite) {
                sprite.enabled = false;
            }
            let onlyLabel = this.btnOnly.getChildByName(" lbl_only_claim ");
            if (!onlyLabel) {
                onlyLabel = new cc.Node(" lbl_only_claim ");
                onlyLabel.parent = this.btnOnly;
            }
            onlyLabel.setPosition(0, 0);
            this.lblOnly = onlyLabel.getComponent(cc.Label) || onlyLabel.addComponent(cc.Label);
            this.lblOnly.fontSize = 28;
            this.lblOnly.lineHeight = 32;
            this.lblOnly.string = " ";
            this.lblOnly.node.color = new cc.Color(238, 226, 205);
        }
    }

    applySuccessStyle(): void {
        const bg = this.node.getChildByName(" bg ");
        if (!bg) {
            return;
        }
        const bgSprite = bg.getComponent(cc.Sprite);
        if (bgSprite) {
            cc.assetManager.getBundle(bundleName.ui, (_err, bundle) => {
                if (bundle) {
                    bundle.load(" texture/ success/ success_bg ", cc.SpriteFrame, (err, frame) => {
                        if (!err && frame && bgSprite && bgSprite.isValid) {
                            bgSprite.spriteFrame = frame;
                        }
                    });
                }
            });
        }
        const nextLevel = bg.getChildByName(" nextlevel ");
        if (nextLevel) {
            nextLevel.active = false;
        }
        if (this.btnMain) {
            const btnSprite = this.btnMain.getComponent(cc.Sprite);
            if (btnSprite) {
                cc.assetManager.getBundle(bundleName.ui, (_err, bundle) => {
                    if (bundle) {
                        bundle.load(" texture/ success/ dialog_get_btn ", cc.SpriteFrame, (err, frame) => {
                            if (!err && frame && btnSprite && btnSprite.isValid) {
                                btnSprite.spriteFrame = frame;
                            }
                        });
                    }
                });
            }
            if (this.nodeAdIcon) {
                cc.assetManager.getBundle(bundleName.ui, (_err, bundle) => {
                    if (bundle) {
                        bundle.load(" texture/ success/ dialog_ad_icon ", cc.SpriteFrame, (err, frame) => {
                            if (!err && frame && this.nodeAdIcon && this.nodeAdIcon.isValid) {
                                this.nodeAdIcon.getComponent(cc.Sprite).spriteFrame = frame;
                            }
                        });
                    }
                });
            }
        }
        if (this.nodeRewardCard) {
            const cardSprite = this.nodeRewardCard.getComponent(cc.Sprite);
            if (cardSprite) {
                cc.assetManager.getBundle(bundleName.ui, (_err, bundle) => {
                    if (bundle) {
                        bundle.load(" texture/ success/ dialog_money_bg ", cc.SpriteFrame, (err, frame) => {
                            if (!err && frame && cardSprite && cardSprite.isValid) {
                                cardSprite.spriteFrame = frame;
                            }
                        });
                    }
                });
            }
        }
    }

    async refreshRewardTexts(data: any): Promise<void> {
        if (this.lblReward) {
            this.lblReward.string = this.i18n(" key_result_reward_prefix ", [this.getCurrencyText(" RP ", data.adReward || 0)]);
            this.lblReward.node.color = new cc.Color(241, 221, 141);
        }
        if (this.lblOnly) {
            let text = this.i18n(" key_result_only_claim ", [this.getCurrencyText(" RP ", data.baseReward || 0)]);
            if (data.forceWatchAd) {
                text += this.i18n(" key_result_watch_ad_suffix ");
            }
            this.lblOnly.string = text;
        }
    }

    refreshButtonsState(): void {
        const enabled = !this.isLoadingPass && !this.isClaiming && !this.hasClaimed;
        if (this.btnMain) {
            const button = this.btnMain.getComponent(cc.Button);
            if (button) {
                button.interactable = enabled;
            }
        }
        if (this.btnOnly) {
            const button = this.btnOnly.getComponent(cc.Button);
            if (button) {
                button.interactable = enabled;
            }
        }
    }

    formatMoney(value: number): string {
        return Math.max(0, Math.floor(value || 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    getCurrencyText(_symbol: string, amount?: number): string {
        const value = void 0 !== amount ? amount : _symbol;
        return LanguageService.formatCurrency(value);
    }

    i18n(key: string, params?: any[], fallback?: string): string {
        return LanguageService.t(key, params, fallback);
    }

    showAni(): void {
        const bg = this.node.getChildByName(" bg ");
        if (!bg) {
            return;
        }
        bg.y += 2000;
        bg.opacity = 0;
        cc.tween(bg).by(0.3, { y: -2100 }).by(0.3, { y: 100 }, { easing: " backOut " }).union().delay(0.1).call(() => {
            AudioMgr.getInstance().playEffect(" audio/ level_complete ", bundleName.ui);
            const lizi = bg.getChildByName(" lizi ");
            const lizi2 = bg.getChildByName(" lizi2 ");
            if (lizi) {
                lizi.active = true;
            }
            if (lizi2) {
                lizi2.active = true;
            }
            if (this.sp_result && this.sp_result.node) {
                this.sp_result.node.active = true;
                this.sp_result.setAnimation(0, " win ", false);
                this.sp_result.addAnimation(0, " winidle ", true);
            }
        }).start();
        cc.tween(bg).delay(0.15).to(0.2, { opacity: 255 }).start();
    }

    ShowNextAni(): void {
        if (this.node_nextani && this.txt_curlevel && this.txt_nextlevel) {
            this.node_nextani.active = true;
            this.txt_curlevel.string = this.winLevel + " ";
            this.txt_nextlevel.string = this.winLevel + 1 + " ";
            cc.tween(this.txt_curlevel.node).by(0.5, { opacity: -255, y: -60 }).start();
            cc.tween(this.txt_nextlevel.node).by(0.5, { opacity: 255, y: -60 }).delay(1).call(() => {
                GlobalEventMgr.getInstance().emit(gameEvent.gameNext);
                UIMgr.getInstance().hide(this.node);
            }).start();
        } else {
            GlobalEventMgr.getInstance().emit(gameEvent.gameNext);
            UIMgr.getInstance().hide(this.node);
        }
    }
}
