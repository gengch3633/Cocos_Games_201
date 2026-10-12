import ArrowRewardService from "./ArrowRewardService";
import AudioMgr from "./AudioMgr";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import CountryAssetService from "./CountryAssetService";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import UIMgr from "./UIMgr";
import UIParams from "./UIParams";
import UserData from "./UserData";

const { ccclass, property } = cc._decorator;

const TAG = "[ArrowSettleRewardView]";
const POPUP_MODE_LEVEL = "level";

const COUNTRY_COLOR_MAP: { [country: string]: string } = {
    ID: "red",
    EG: "red",
    NG: "red",
    US: "green",
    IN: "green",
    PK: "green",
    JP: "yellow",
    AR: "yellow",
    PE: "yellow",
    CO: "yellow",
    ES: "yellow",
    DE: "yellow",
    IT: "yellow",
    PT: "yellow",
    RU: "yellow",
    BR: "blue",
    PH: "blue",
    MX: "blue",
    VN: "blue",
    MY: "blue",
    SA: "blue",
    KE: "blue",
    ZA: "blue"
};

function reportAdShow(popupMode: string, isLevelPassed: boolean, isForce: boolean): void {
    if (popupMode !== POPUP_MODE_LEVEL) return;
    const scene = isLevelPassed
        ? (isForce ? "pass_force" : "pass_active")
        : (isForce ? "big_reward_force" : "big_reward_active");
    try {
        BusinessAnalyticsService.reportData("ad_show", {
            scene: scene,
            level: UserData.getInstance().level
        });
    } catch (err) {
        console.warn("[ArrowSettleRewardView] ad_show report error scene=" + scene, err);
    }
}

@ccclass
export default class ArrowSettleRewardView extends cc.Component {

    @property({
        type: sp.SkeletonData,
        tooltip: "印尼(ID)及兜底使用的 Skeleton：_res/main/Skeleton/red/red.json"
    })
    public skeletonDataRed: sp.SkeletonData = null;

    @property({
        type: sp.SkeletonData,
        tooltip: "美国(US)使用的 Skeleton：_res/main/Skeleton/green/green.json"
    })
    public skeletonDataGreen: sp.SkeletonData = null;

    @property({
        type: sp.SkeletonData,
        tooltip: "JP/AR/PE/CO 使用的 Skeleton：_res/main/Skeleton/yellow/yellow.json"
    })
    public skeletonDataYellow: sp.SkeletonData = null;

    @property({
        type: sp.SkeletonData,
        tooltip: "BR/PH/MX/VN/MY 使用的 Skeleton：_res/main/Skeleton/blue/blue.json"
    })
    public skeletonDataBlue: sp.SkeletonData = null;

    private entryData: any = null;
    private settleData: any = {};
    private popupMode: string = POPUP_MODE_LEVEL;
    private isLevelPassed: boolean = true;
    private winLevel: number = 1;
    private onCloseCb: (() => void) | null = null;
    private onTaskClaimCb: Function | null = null;
    private showForceVideo: boolean = false;
    private isNewReward: boolean = false;
    private taskType: string = "";
    private taskId: string = "";
    private doubleRewardAmount: number = 0;
    private levelSwitchRewardAmount: number = 0;
    private taskShowAmount: number = 0;
    private taskRewardAmount: number = 0;
    private isClaiming: boolean = false;
    private claimGuardTimer: any = null;
    private isReady: boolean = false;
    private _settleCloseEventEmitted: boolean = false;
    private _lastClickTime: number = 0;
    private _levelPassReported: boolean = false;
    private _buttonLockUntil: number = 0;
    private _buttonLockTimer: any = null;

    private nodeContent: cc.Node = null;
    private skeletonComp: sp.Skeleton = null;
    private lblAmount: cc.Label = null;
    private lblClaim: cc.Label = null;
    private lblClaimX2: cc.Label = null;
    private lblNextLevel: cc.Label = null;
    private lblTitle: cc.Label = null;
    private titleSpriteNode: cc.Node = null;
    private btnClaimNode: cc.Node = null;
    private btnClaim: cc.Button = null;
    private btnClaimX2Node: cc.Node = null;
    private btnClaimX2: cc.Button = null;
    private btnNextNode: cc.Node = null;
    private btnNext: cc.Button = null;
    private defaultClaimText: string = "";
    private defaultClaimX2Text: string = "";
    private defaultNextLevelText: string = "";
    private defaultTitleSpriteVisible: boolean = true;

    protected onLoad(): void {
        this.entryData = null;
        this.settleData = {};
        this.popupMode = POPUP_MODE_LEVEL;
        this.isLevelPassed = true;
        this.winLevel = 1;
        this.onCloseCb = null;
        this.onTaskClaimCb = null;
        this.showForceVideo = false;
        this.isNewReward = false;
        this.taskType = "";
        this.taskId = "";
        this.doubleRewardAmount = 0;
        this.levelSwitchRewardAmount = 0;
        this.taskShowAmount = 0;
        this.taskRewardAmount = 0;
        this.isClaiming = false;
        this.claimGuardTimer = null;
        this.isReady = false;
        this._settleCloseEventEmitted = false;
        this._lastClickTime = 0;
        this._levelPassReported = false;
        this._buttonLockUntil = 0;
        this._buttonLockTimer = null;

        this.bindNodes();
        this.bindEvents();
        GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.settleRewardOpen);
    }

    protected start(): void {
        const params = UIParams.parse(this.node, 0, null) || {};
        if (!this.entryData || Object.keys(this.entryData).length === 0) {
            this.entryData = params;
        }
        this.applyEntryData();
        this.applySkeletonByCountry();
        this.playEnterAnim();
        this.isReady = true;
    }

    protected onDestroy(): void {
        this.clearClaimGuardTimer();
        this.clearButtonLockTimer();
        this.unbindEvents();
        this.emitSettleRewardCloseOnce();
    }

    public setEntryData(data: any): void {
        this.entryData = data || {};
        if (this.isReady) {
            this.applyEntryData();
        }
    }

    private bindNodes(): void {
        this.nodeContent = this.findChildByNameDeep(this.node, "content");
        const animNode = this.findChildByNameDeep(this.node, "animation");
        this.skeletonComp = animNode ? animNode.getComponent(sp.Skeleton) : null;
        this.lblAmount = this.findLabelByName("txt_amount");
        this.lblClaim = this.findLabelByName("lbl_claim");
        this.lblClaimX2 = this.findLabelByName("lbl_claimx2");
        this.lblNextLevel = this.findLabelByName("lbl_next_level");
        this.lblTitle = this.findLabelByName("title");
        this.titleSpriteNode = this.findChildByNameDeep(this.node, "title_successful");
        this.btnClaimNode = this.findChildByNameDeep(this.node, "btn_claim");
        this.btnClaim = this.btnClaimNode ? this.btnClaimNode.getComponent(cc.Button) : null;
        this.btnClaimX2Node = this.findChildByNameDeep(this.node, "btn_claimx2");
        this.btnClaimX2 = this.btnClaimX2Node ? this.btnClaimX2Node.getComponent(cc.Button) : null;
        this.btnNextNode = this.findChildByNameDeep(this.node, "btn_next_level");
        this.btnNext = this.btnNextNode ? this.btnNextNode.getComponent(cc.Button) : null;
        this.defaultClaimText = this.lblClaim ? this.lblClaim.string : "领取奖励";
        this.defaultClaimX2Text = this.lblClaimX2 ? this.lblClaimX2.string : "CLAIMx2";
        this.defaultNextLevelText = this.lblNextLevel ? this.lblNextLevel.string : "Next Level";
        this.defaultTitleSpriteVisible = !this.titleSpriteNode || this.titleSpriteNode.active;
    }

    private bindEvents(): void {
        if (this.btnClaimNode) {
            this.btnClaimNode.on(cc.Node.EventType.TOUCH_END, this.onClickClaim, this);
            this.btnClaimNode.on("click", this.onClickClaim, this);
        }
        if (this.btnClaimX2Node) {
            this.btnClaimX2Node.on(cc.Node.EventType.TOUCH_END, this.onClickClaimX2, this);
            this.btnClaimX2Node.on("click", this.onClickClaimX2, this);
        }
        if (this.btnNextNode) {
            this.btnNextNode.on(cc.Node.EventType.TOUCH_END, this.onClickNextLevel, this);
            this.btnNextNode.on("click", this.onClickNextLevel, this);
        }
        console.log(TAG + " bindEvents done claimBtn=" + !!this.btnClaimX2Node + " nextBtn=" + !!this.btnNextNode);
    }

    private unbindEvents(): void {
        if (this.btnClaimNode) {
            this.btnClaimNode.off(cc.Node.EventType.TOUCH_END, this.onClickClaim, this);
            this.btnClaimNode.off("click", this.onClickClaim, this);
        }
        if (this.btnClaimX2Node) {
            this.btnClaimX2Node.off(cc.Node.EventType.TOUCH_END, this.onClickClaimX2, this);
            this.btnClaimX2Node.off("click", this.onClickClaimX2, this);
        }
        if (this.btnNextNode) {
            this.btnNextNode.off(cc.Node.EventType.TOUCH_END, this.onClickNextLevel, this);
            this.btnNextNode.off("click", this.onClickNextLevel, this);
        }
    }

    private applyEntryData(): void {
        const entry = this.entryData || {};
        this.settleData = entry.settleData || {};
        this.popupMode = entry.popupMode === "task" ? "task" : POPUP_MODE_LEVEL;
        this.isLevelPassed = this.popupMode !== "task" && entry.isLevelPassed !== false;
        this.winLevel = entry.winLevel > 0 ? entry.winLevel : UserData.getInstance().level;
        this.onCloseCb = typeof entry.onClose === "function" ? entry.onClose : null;
        this.onTaskClaimCb = typeof entry.onTaskClaim === "function" ? entry.onTaskClaim : null;
        this.showForceVideo = entry.showForceVideo !== void 0
            ? !!entry.showForceVideo
            : !!(this.settleData && this.settleData.show_force_video);

        let rawNew: any = entry.isNew;
        if (rawNew === void 0) {
            rawNew = entry.is_new;
        }
        if (rawNew === void 0 && this.settleData) {
            rawNew = this.settleData.is_new;
        }
        const normalizedNew = typeof rawNew === "string" ? rawNew.trim().toLowerCase() : rawNew;
        this.isNewReward = this.popupMode === POPUP_MODE_LEVEL
            && (rawNew === true || normalizedNew === "true" || normalizedNew === "1" || 1 === Number(rawNew || 0));

        const rawTaskType = entry.taskType || entry.task_type || (this.settleData && this.settleData.task_type);
        this.taskType = String(rawTaskType || "").toLowerCase() === "ltv" ? "ltv" : "";
        this.taskId = String(entry.taskId || entry.task_id || (this.settleData && this.settleData.task_id) || "");
        this.levelSwitchRewardAmount = this.safeNum(
            entry.switchReward,
            this.safeNum(entry.switch_reward, this.safeNum(this.settleData && this.settleData.switch_reward, 0))
        );
        this.doubleRewardAmount = this.safeNum(
            entry.doubleReward,
            this.safeNum(entry.double_reward, this.safeNum(this.settleData && this.settleData.double_reward, this.levelSwitchRewardAmount))
        );
        if (this.popupMode === POPUP_MODE_LEVEL && this.doubleRewardAmount <= 0 && this.levelSwitchRewardAmount > 0) {
            this.doubleRewardAmount = this.levelSwitchRewardAmount;
        }
        this.taskShowAmount = this.safeNum(entry.showAmount, this.safeNum(this.settleData && this.settleData.switch_reward, 0));
        this.taskRewardAmount = this.safeNum(entry.taskReward, this.safeNum(this.settleData && this.settleData.task_reward, this.taskShowAmount));

        this.updateAmountLabel();
        this.refreshStaticTexts();
        this.refreshButtonVisibility();
        this.refreshButtonsEnabled();

        if (!this._levelPassReported && this.popupMode === POPUP_MODE_LEVEL && this.isLevelPassed) {
            this._levelPassReported = true;
            try {
                BusinessAnalyticsService.reportData("lvNode", {
                    level: this.winLevel,
                    win: 1
                });
            } catch (err) {
            }
        }

        console.log(TAG + " applyEntryData mode=" + this.popupMode
            + " isLevelPassed=" + this.isLevelPassed
            + " isNewReward=" + this.isNewReward
            + " showForceVideo=" + this.showForceVideo
            + " taskType=" + this.taskType
            + " taskId=" + this.taskId);
    }

    private updateAmountLabel(): void {
        if (!this.lblAmount) return;
        const amount = this.popupMode === "task" ? this.taskShowAmount : this.doubleRewardAmount;
        this.lblAmount.string = "+" + this.formatMoney(amount);
    }

    private refreshStaticTexts(): void {
        const isTask = this.popupMode === "task";

        if (this.titleSpriteNode) {
            this.titleSpriteNode.active = false;
        }
        if (this.lblTitle) {
            const cfg = this.getTitleI18nConfig();
            this.lblTitle.node.active = true;
            this.lblTitle.string = this.i18n(cfg.key, [], cfg.fallback);
        }
        if (this.lblClaim) {
            this.lblClaim.string = this.i18n("key_arrow_reward_claim", [], this.defaultClaimText || "Claim reward");
        }
        if (this.lblClaimX2) {
            this.lblClaimX2.string = this.i18n("key_task_reward_claim_x2", [], this.defaultClaimX2Text || "Watch Ad to Claim");
        }
        if (this.lblNextLevel) {
            this.lblNextLevel.string = isTask
                ? this.i18n("key_task_reward_only_claim", [this.formatMoney(this.taskRewardAmount)], "Claim only " + this.formatMoney(this.taskRewardAmount))
                : this.i18n("key_result_only_claim", [this.formatMoney(this.levelSwitchRewardAmount)], "Claim only " + this.formatMoney(this.levelSwitchRewardAmount));
        }
    }

    private getTitleI18nConfig(): { key: string; fallback: string } {
        if (this.popupMode === "task") {
            return { key: "key_task_reward_popup_title", fallback: "Task Reward" };
        }
        return this.isLevelPassed
            ? { key: "key_arrow_settle_title_success", fallback: "Success" }
            : { key: "key_arrow_settle_title_congrats", fallback: "Congratulations" };
    }

    private isClickThrottled(): boolean {
        const now = Date.now();
        if (now - this._lastClickTime < 500) {
            return true;
        }
        this._lastClickTime = now;
        return false;
    }

    private isButtonLocked(): boolean {
        return this._buttonLockUntil > 0 && Date.now() < this._buttonLockUntil;
    }

    private lockButtonsFor(ms: number): void {
        const delay = Math.max(0, Number(ms) || 0);
        this._buttonLockUntil = Date.now() + delay;
        this.clearButtonLockTimer();
        this._buttonLockTimer = setTimeout(() => {
            this._buttonLockTimer = null;
            this._buttonLockUntil = 0;
        }, delay);
    }

    private clearButtonLockTimer(): void {
        if (this._buttonLockTimer) {
            clearTimeout(this._buttonLockTimer);
            this._buttonLockTimer = null;
        }
    }

    private onClickClaim(): void {
        if (this.isButtonLocked() || this.isClickThrottled()) return;
        this.lockButtonsFor(500);

        const showForce = !!this.showForceVideo;
        if (!this.beginClaim("claim", !showForce)) return;

        const ctx: any = {
            showForceVideo: this.showForceVideo,
            businessType: "arrow"
        };
        console.log(TAG + " 点击 Claim mode=" + this.popupMode + " isNewReward=" + this.isNewReward + " showForceVideo=" + this.showForceVideo);
        console.log(TAG + " [过关接口][请求] claimNormal(Claim) ctx=" + JSON.stringify(ctx));
        if (showForce) {
            reportAdShow(this.popupMode, this.isLevelPassed, true);
        }

        ArrowRewardService.claimNormal(ctx, (success: boolean, resData: any) => {
            this.endClaim();
            console.log(TAG + " [过关接口][返回] claimNormal(Claim) success=" + !!success
                + " req=" + JSON.stringify(ctx) + " res=" + JSON.stringify(resData || {}));
            if (success) {
                this.emitRewardClaimed(resData, this.levelSwitchRewardAmount);
                this.finishAndClose();
            } else {
                console.warn(TAG + " Claim 失败，跳过奖励继续流程并关闭弹窗");
                this.finishAndClose();
            }
        });
    }

    private onClickClaimX2(): void {
        if (this.isButtonLocked() || this.isClickThrottled()) return;
        this.lockButtonsFor(500);
        if (!this.beginClaim("claim_x2", false)) return;

        if (this.popupMode === "task") {
            try {
                BusinessAnalyticsService.reportData("ad_show", {
                    scene: "task",
                    level: UserData.getInstance().level
                });
            } catch (err) {
            }
            if (this.onTaskClaimCb) {
                this.handleTaskClaim(true);
                return;
            }
        }

        const ctx: any = this.popupMode === "task"
            ? { businessType: "task", taskType: this.taskType, taskId: this.taskId }
            : { businessType: "arrow" };
        if (this.popupMode === POPUP_MODE_LEVEL) {
            ctx.fallbackOnAdFail = false;
        }

        console.log(TAG + " 点击 CLAIMx2 mode=" + this.popupMode);
        console.log(TAG + " [过关接口][请求] claimDouble(CLAIMx2) ctx=" + JSON.stringify(ctx));
        reportAdShow(this.popupMode, this.isLevelPassed, false);

        ArrowRewardService.claimDouble(ctx, (success: boolean, resData: any) => {
            this.endClaim();
            console.log(TAG + " [过关接口][返回] claimDouble(CLAIMx2) success=" + !!success
                + " req=" + JSON.stringify(ctx) + " res=" + JSON.stringify(resData || {}));
            if (success) {
                this.emitRewardClaimed(resData, this.doubleRewardAmount);
                this.finishAndClose();
            } else {
                console.warn(TAG + " CLAIMx2 失败，不关闭弹窗");
            }
        });
    }

    private onClickNextLevel(): void {
        if (this.isButtonLocked() || this.isClickThrottled()) return;
        this.lockButtonsFor(500);

        const showForce = !((this.popupMode === "task" && this.onTaskClaimCb) || !this.showForceVideo);
        if (!this.beginClaim("next_level", !showForce)) return;

        if (this.popupMode === "task" && this.onTaskClaimCb) {
            this.handleTaskClaim(false);
            return;
        }

        const ctx: any = this.popupMode === "task"
            ? {
                showForceVideo: this.showForceVideo,
                businessType: "task",
                taskType: this.taskType,
                taskId: this.taskId
            }
            : {
                showForceVideo: this.showForceVideo,
                businessType: "arrow"
            };

        console.log(TAG + " 点击 Next Level mode=" + this.popupMode + " showForceVideo=" + this.showForceVideo);
        console.log(TAG + " [过关接口][请求] claimNormal(NextLevel) ctx=" + JSON.stringify(ctx));
        if (showForce) {
            reportAdShow(this.popupMode, this.isLevelPassed, true);
        }

        ArrowRewardService.claimNormal(ctx, (success: boolean, resData: any) => {
            this.endClaim();
            console.log(TAG + " [过关接口][返回] claimNormal(NextLevel) success=" + !!success
                + " req=" + JSON.stringify(ctx) + " res=" + JSON.stringify(resData || {}));
            if (success) {
                this.emitRewardClaimed(resData, this.levelSwitchRewardAmount);
                this.finishAndClose();
            } else {
                console.warn(TAG + " Next Level 失败，跳过奖励继续流程并关闭弹窗");
                this.finishAndClose();
            }
        });
    }

    private handleTaskClaim(isDouble: boolean): void {
        const params = {
            isDouble: !!isDouble,
            businessType: "task",
            taskType: this.taskType,
            taskId: this.taskId,
            claimAmount: isDouble ? this.taskShowAmount : this.taskRewardAmount
        };

        let done = false;
        const finish = (success: any): void => {
            if (done) return;
            done = true;
            this.endClaim();
            if (success !== false) {
                this.finishAndClose();
            } else {
                console.warn(TAG + " handleTaskClaim 失败，不关闭弹窗");
            }
        };

        try {
            if (this.onTaskClaimCb.length >= 2) {
                this.onTaskClaimCb(params, finish);
                return;
            }
            const result = this.onTaskClaimCb(params);
            if (result && typeof result.then === "function") {
                result.then((ok: any) => {
                    finish(ok !== false);
                }).catch(() => {
                    finish(false);
                });
                return;
            }
            finish(result !== false);
        } catch (err) {
            console.warn(TAG + " handleTaskClaim 异常", err);
            finish(false);
        }
    }

    private beginClaim(from: string, useGuard: boolean): boolean {
        if (this.isClaiming) return false;
        this.isClaiming = true;
        this.refreshButtonsEnabled();
        if (useGuard !== false) {
            this.setClaimGuardTimer(from);
        } else {
            this.clearClaimGuardTimer();
        }
        return true;
    }

    private endClaim(): void {
        this.isClaiming = false;
        this.clearClaimGuardTimer();
        this.refreshButtonsEnabled();
    }

    private setClaimGuardTimer(from: string): void {
        this.clearClaimGuardTimer();
        this.claimGuardTimer = setTimeout(() => {
            this.claimGuardTimer = null;
            if (this.isValid && this.isClaiming) {
                console.warn(TAG + " 领取超时自动解锁 from=" + from);
                this.endClaim();
            }
        }, 15000);
    }

    private clearClaimGuardTimer(): void {
        if (this.claimGuardTimer) {
            clearTimeout(this.claimGuardTimer);
            this.claimGuardTimer = null;
        }
    }

    private refreshButtonsEnabled(): void {
        const enabled = !this.isClaiming;
        if (this.btnClaim) this.btnClaim.interactable = enabled;
        if (this.btnClaimX2) this.btnClaimX2.interactable = enabled;
        if (this.btnNext) this.btnNext.interactable = enabled;
    }

    private refreshButtonVisibility(): void {
        const showClaim = this.popupMode === POPUP_MODE_LEVEL && this.isNewReward;
        if (this.btnClaimNode) this.btnClaimNode.active = showClaim;
        if (this.btnClaimX2Node) this.btnClaimX2Node.active = !showClaim;
        if (this.btnNextNode) this.btnNextNode.active = !showClaim;
    }

    private emitRewardClaimed(resData: any, fallbackAmount: number): void {
        if (this.popupMode !== POPUP_MODE_LEVEL) return;

        let rewardAmount = this.resolveClaimRewardAmount(resData, fallbackAmount);
        if (rewardAmount === null || rewardAmount <= 0) {
            let settleFallback = this.safeNum(this.settleData && this.settleData.switch_reward, 0);
            if (settleFallback <= 0) {
                settleFallback = this.safeNum(this.settleData && this.settleData.double_reward, 0);
            }
            if (settleFallback > 0) {
                console.log(TAG + " emitRewardClaimed: 使用 settleData 兜底 switch_reward=" + settleFallback);
                rewardAmount = settleFallback;
            }
        }

        if (rewardAmount === null || rewardAmount <= 0) {
            console.warn(TAG + " emitRewardClaimed: rewardAmount 无效 resData=" + JSON.stringify(resData || {})
                + " fallbackAmount=" + fallbackAmount);
        } else {
            console.log(TAG + " emitRewardClaimed: reward_amount=" + rewardAmount + " fallback=" + fallbackAmount);
            GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.arrowRewardClaimed, {
                reward_amount: rewardAmount
            });
        }
    }

    private resolveClaimRewardAmount(resData: any, fallbackAmount: any): number | null {
        const data = resData || {};
        const keys = [
            "cash_reward",
            "reward_amount",
            "ad_reward_amount",
            "reward",
            "claim_reward",
            "task_reward",
            "switch_reward",
            "double_reward"
        ];
        for (let i = 0; i < keys.length; i++) {
            const value = this.parseRewardValue(data[keys[i]]);
            if (value !== null && value > 0) return value;
        }
        const fallbackValue = this.parseRewardValue(fallbackAmount);
        return fallbackValue !== null && fallbackValue > 0 ? fallbackValue : null;
    }

    private parseRewardValue(raw: any): number | null {
        if (raw === null || raw === undefined) return null;
        let value = raw;
        if (typeof value === "string") {
            value = value.replace(/,/g, "").trim();
            if (!value.length) return null;
        }
        const num = Number(value);
        return isFinite(num) ? Math.max(0, Math.floor(num)) : null;
    }

    private applySkeletonByCountry(): void {
        if (!this.skeletonComp || !this.skeletonComp.isValid) return;

        const country = CountryAssetService.getCurrentCountry ? CountryAssetService.getCurrentCountry() : "";
        const colorKey = COUNTRY_COLOR_MAP[country] || "red";
        const dataMap: { [key: string]: sp.SkeletonData } = {
            red: this.skeletonDataRed,
            green: this.skeletonDataGreen,
            yellow: this.skeletonDataYellow,
            blue: this.skeletonDataBlue
        };
        const skeletonData = dataMap[colorKey] || this.skeletonDataRed;

        if (skeletonData) {
            this.skeletonComp.skeletonData = skeletonData;
            this.skeletonComp.setAnimation(0, "1", true);
            console.log(TAG + " applySkeletonByCountry country=" + country + " skeleton=" + colorKey);
        } else {
            console.warn(TAG + " applySkeletonByCountry: skeletonData[" + colorKey + "] 未赋值，请在预制体编辑器中绑定");
        }
    }

    private playEnterAnim(): void {
        if (!this.nodeContent) return;

        this.nodeContent.stopAllActions();
        this.nodeContent.opacity = 0;
        this.nodeContent.y = 90;

        if (this.isLevelPassed) {
            AudioMgr.getInstance().playEffect("audio/level_complete", InterfaceMgr.bundleName.ui);
        } else {
            AudioMgr.getInstance().playEffect("audio/coin_collect", InterfaceMgr.bundleName.game);
        }

        cc.tween(this.nodeContent)
            .to(0.3, { y: 0, opacity: 255 }, { easing: "backOut" })
            .start();
    }

    private finishAndClose(): void {
        const nextLevel = this.winLevel + 1;
        console.log(TAG + " finishAndClose mode=" + this.popupMode + " isLevelPassed=" + this.isLevelPassed);

        cc.tween(this.node)
            .to(0.2, { opacity: 0 })
            .call(() => {
                if (this.popupMode === POPUP_MODE_LEVEL && this.isLevelPassed) {
                    UserData.getInstance().level = nextLevel;
                    GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.gameNext);
                } else if (typeof this.onCloseCb === "function") {
                    try {
                        this.onCloseCb();
                    } catch (err) {
                    }
                }
                this.emitSettleRewardCloseOnce();
                UIMgr.getInstance().hide(this.node);
            })
            .start();
    }

    private emitSettleRewardCloseOnce(): void {
        if (this._settleCloseEventEmitted) return;
        this._settleCloseEventEmitted = true;
        GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.settleRewardClose);
    }

    private findLabelByName(name: string): cc.Label {
        const target = this.findChildByNameDeep(this.node, name);
        return (target && target.getComponent(cc.Label)) || null;
    }

    private findChildByNameDeep(root: cc.Node, name: string): cc.Node {
        if (!root || !name) return null;
        if (root.name === name) return root;
        for (let i = 0; i < root.childrenCount; i++) {
            const found = this.findChildByNameDeep(root.children[i], name);
            if (found) return found;
        }
        return null;
    }

    private safeNum(raw: any, defaultValue: number): number {
        let value = raw;
        if (typeof value === "string") {
            value = value.replace(/,/g, "").trim();
        }
        const num = Number(value);
        return isNaN(num) ? defaultValue : Math.max(0, Math.floor(num));
    }

    private formatMoney(amount: number): string {
        return LanguageService.formatCurrency(Math.max(0, Math.floor(amount || 0)));
    }

    private i18n(key: string, params: any[], fallback: string): string {
        return LanguageService.t(key, params || [], fallback);
    }
}