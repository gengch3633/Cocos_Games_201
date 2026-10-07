import ArrowRewardService from "./ArrowRewardService";
import AudioMgr from "./AudioMgr";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import CountryAssetService from "./CountryAssetService";
import GlobalEventMgr from "./GlobalEventMgr";
import { bundleName, gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import { UIParams } from "./UIParams";
import UIMgr from "./UIMgr";
import UserData from "./UserData";

const LOG_TAG = "[ArrowSettleRewardView]";
const POPUP_MODE_LEVEL = "level";

const COUNTRY_SKELETON_MAP: { [country: string]: string } = {
    ID: "red", EG: "red", NG: "red", US: "green", IN: "green", PK: "green",
    JP: "yellow", AR: "yellow", PE: "yellow", CO: "yellow", ES: "yellow",
    DE: "yellow", IT: "yellow", PT: "yellow", RU: "yellow", BR: "blue",
    PH: "blue", MX: "blue", VN: "blue", MY: "blue", SA: "blue", KE: "blue", ZA: "blue",
};

function reportAdShow(popupMode: string, isLevelPassed: boolean, isForce: boolean): void {
    if (popupMode !== POPUP_MODE_LEVEL) {
        return;
    }
    const scene = isLevelPassed
        ? (isForce ? "pass_force" : "pass_active")
        : (isForce ? "big_reward_force" : "big_reward_active");
    try {
        BusinessAnalyticsService.reportData("ad_show", {
            scene,
            level: UserData.getInstance().level,
        });
    } catch (err) {
        console.warn(LOG_TAG + " ad_show report error scene=" + scene, err);
    }
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class ArrowSettleRewardView extends cc.Component {
    @property({ type: sp.SkeletonData, tooltip: "印尼(ID)及兜底使用的 Skeleton：_res/main/Skeleton/red/red.json" })
    skeletonDataRed: sp.SkeletonData = null!;

    @property({ type: sp.SkeletonData, tooltip: "美国(US)使用的 Skeleton：_res/main/Skeleton/green/green.json" })
    skeletonDataGreen: sp.SkeletonData = null!;

    @property({ type: sp.SkeletonData, tooltip: "JP/AR/PE/CO 使用的 Skeleton：_res/main/Skeleton/yellow/yellow.json" })
    skeletonDataYellow: sp.SkeletonData = null!;

    @property({ type: sp.SkeletonData, tooltip: "BR/PH/MX/VN/MY 使用的 Skeleton：_res/main/Skeleton/blue/blue.json" })
    skeletonDataBlue: sp.SkeletonData = null!;

    entryData: any = null;
    settleData: any = {};
    popupMode = POPUP_MODE_LEVEL;
    isLevelPassed = true;
    winLevel = 1;
    onCloseCb: (() => void) | null = null;
    onTaskClaimCb: ((ctx: any, done?: (ok?: boolean) => void) => any) | null = null;
    showForceVideo = false;
    isNewReward = false;
    taskType = "";
    taskId = "";
    doubleRewardAmount = 0;
    levelSwitchRewardAmount = 0;
    taskShowAmount = 0;
    taskRewardAmount = 0;
    isClaiming = false;
    claimGuardTimer: any = null;
    isReady = false;

    private _settleCloseEventEmitted = false;
    private _lastClickTime = 0;
    private _levelPassReported = false;
    private _buttonLockUntil = 0;
    private _buttonLockTimer: any = null;

    private nodeContent: cc.Node | null = null;
    private skeletonComp: sp.Skeleton | null = null;
    private lblAmount: cc.Label | null = null;
    private lblClaim: cc.Label | null = null;
    private lblClaimX2: cc.Label | null = null;
    private lblNextLevel: cc.Label | null = null;
    private lblTitle: cc.Label | null = null;
    private titleSpriteNode: cc.Node | null = null;
    private btnClaimNode: cc.Node | null = null;
    private btnClaim: cc.Button | null = null;
    private btnClaimX2Node: cc.Node | null = null;
    private btnClaimX2: cc.Button | null = null;
    private btnNextNode: cc.Node | null = null;
    private btnNext: cc.Button | null = null;
    private defaultClaimText = "领取奖励";
    private defaultClaimX2Text = "CLAIMx2";
    private defaultNextLevelText = "Next Level";
    private defaultTitleSpriteVisible = true;

    onLoad(): void {
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
        GlobalEventMgr.getInstance().emit(gameEvent.settleRewardOpen);
    }

    start(): void {
        const parsed = UIParams.parse(this.node, 0, null) || {};
        if (!this.entryData || Object.keys(this.entryData).length === 0) {
            this.entryData = parsed;
        }
        this.applyEntryData();
        this.applySkeletonByCountry();
        this.playEnterAnim();
        this.isReady = true;
    }

    onDestroy(): void {
        this.clearClaimGuardTimer();
        this.clearButtonLockTimer();
        this.unbindEvents();
        this.emitSettleRewardCloseOnce();
    }

    setEntryData(data: any): void {
        this.entryData = data || {};
        if (this.isReady) {
            this.applyEntryData();
        }
    }

    bindNodes(): void {
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

    bindEvents(): void {
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
        console.log(LOG_TAG + " bindEvents done claimBtn=" + !!this.btnClaimX2Node + " nextBtn=" + !!this.btnNextNode);
    }

    unbindEvents(): void {
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

    applyEntryData(): void {
        const data = this.entryData || {};
        this.settleData = data.settleData || {};
        this.popupMode = data.popupMode === "task" ? "task" : POPUP_MODE_LEVEL;
        this.isLevelPassed = this.popupMode !== "task" && data.isLevelPassed !== false;
        this.winLevel = data.winLevel > 0 ? data.winLevel : UserData.getInstance().level;
        this.onCloseCb = typeof data.onClose === "function" ? data.onClose : null;
        this.onTaskClaimCb = typeof data.onTaskClaim === "function" ? data.onTaskClaim : null;
        this.showForceVideo = data.showForceVideo !== undefined
            ? !!data.showForceVideo
            : !!(this.settleData && this.settleData.show_force_video);

        let isNew = data.isNew;
        if (isNew === undefined) {
            isNew = data.is_new;
        }
        if (isNew === undefined && this.settleData) {
            isNew = this.settleData.is_new;
        }
        const normalized = typeof isNew === "string" ? isNew.trim().toLowerCase() : isNew;
        this.isNewReward = this.popupMode === POPUP_MODE_LEVEL && (
            isNew === true || normalized === "true" || normalized === "1" || Number(isNew || 0) === 1
        );

        const rawTaskType = data.taskType || data.task_type || (this.settleData && this.settleData.task_type);
        this.taskType = String(rawTaskType || "").toLowerCase() === "ltv" ? "ltv" : "";
        this.taskId = String(data.taskId || data.task_id || (this.settleData && this.settleData.task_id) || "");

        this.levelSwitchRewardAmount = this.safeNum(
            data.switchReward,
            this.safeNum(data.switch_reward, this.safeNum(this.settleData && this.settleData.switch_reward, 0))
        );
        this.doubleRewardAmount = this.safeNum(
            data.doubleReward,
            this.safeNum(data.double_reward, this.safeNum(this.settleData && this.settleData.double_reward, this.levelSwitchRewardAmount))
        );
        if (this.popupMode === POPUP_MODE_LEVEL && this.doubleRewardAmount <= 0 && this.levelSwitchRewardAmount > 0) {
            this.doubleRewardAmount = this.levelSwitchRewardAmount;
        }
        this.taskShowAmount = this.safeNum(data.showAmount, this.safeNum(this.settleData && this.settleData.switch_reward, 0));
        this.taskRewardAmount = this.safeNum(
            data.taskReward,
            this.safeNum(this.settleData && this.settleData.task_reward, this.taskShowAmount)
        );

        this.updateAmountLabel();
        this.refreshStaticTexts();
        this.refreshButtonVisibility();
        this.refreshButtonsEnabled();

        if (!this._levelPassReported && this.popupMode === POPUP_MODE_LEVEL && this.isLevelPassed) {
            this._levelPassReported = true;
            try {
                BusinessAnalyticsService.reportData("lvNode", { level: this.winLevel, win: 1 });
            } catch (e) {
            }
        }
        console.log(
            LOG_TAG + " applyEntryData mode=" + this.popupMode +
            " isLevelPassed=" + this.isLevelPassed +
            " isNewReward=" + this.isNewReward +
            " showForceVideo=" + this.showForceVideo +
            " taskType=" + this.taskType +
            " taskId=" + this.taskId
        );
    }

    updateAmountLabel(): void {
        if (this.lblAmount) {
            const amount = this.popupMode === "task" ? this.taskShowAmount : this.doubleRewardAmount;
            this.lblAmount.string = "+" + this.formatMoney(amount);
        }
    }

    refreshStaticTexts(): void {
        const isTask = this.popupMode === "task";
        if (this.titleSpriteNode) {
            this.titleSpriteNode.active = false;
        }
        if (this.lblTitle) {
            const titleConfig = this.getTitleI18nConfig();
            this.lblTitle.node.active = true;
            this.lblTitle.string = this.i18n(titleConfig.key, [], titleConfig.fallback);
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

    getTitleI18nConfig(): { key: string; fallback: string } {
        if (this.popupMode === "task") {
            return { key: "key_task_reward_popup_title", fallback: "Task Reward" };
        }
        return this.isLevelPassed
            ? { key: "key_arrow_settle_title_success", fallback: "Success" }
            : { key: "key_arrow_settle_title_congrats", fallback: "Congratulations" };
    }

    isClickThrottled(): boolean {
        const now = Date.now();
        if (now - this._lastClickTime < 500) {
            return true;
        }
        this._lastClickTime = now;
        return false;
    }

    isButtonLocked(): boolean {
        return this._buttonLockUntil > 0 && Date.now() < this._buttonLockUntil;
    }

    lockButtonsFor(ms: number): void {
        const duration = Math.max(0, Number(ms) || 0);
        this._buttonLockUntil = Date.now() + duration;
        this.clearButtonLockTimer();
        this._buttonLockTimer = setTimeout(() => {
            this._buttonLockTimer = null;
            this._buttonLockUntil = 0;
        }, duration);
    }

    clearButtonLockTimer(): void {
        if (this._buttonLockTimer) {
            clearTimeout(this._buttonLockTimer);
            this._buttonLockTimer = null;
        }
    }

    onClickClaim(): void {
        if (this.isButtonLocked() || this.isClickThrottled()) {
            return;
        }
        this.lockButtonsFor(500);
        const reportForce = !!this.showForceVideo;
        if (this.beginClaim("claim", !reportForce)) {
            const ctx = { showForceVideo: this.showForceVideo, businessType: "arrow" };
            console.log(LOG_TAG + " 点击 Claim mode=" + this.popupMode + " isNewReward=" + this.isNewReward + " showForceVideo=" + this.showForceVideo);
            console.log(LOG_TAG + " [过关接口][请求] claimNormal(Claim) ctx=" + JSON.stringify(ctx));
            if (reportForce) {
                reportAdShow(this.popupMode, this.isLevelPassed, true);
            }
            ArrowRewardService.claimNormal(ctx, (success, res) => {
                this.endClaim();
                console.log(LOG_TAG + " [过关接口][返回] claimNormal(Claim) success=" + !!success + " req=" + JSON.stringify(ctx) + " res=" + JSON.stringify(res || {}));
                if (success) {
                    this.emitRewardClaimed(res, this.levelSwitchRewardAmount);
                    this.finishAndClose();
                } else {
                    console.warn(LOG_TAG + " Claim 失败，跳过奖励继续流程并关闭弹窗");
                    this.finishAndClose();
                }
            });
        }
    }

    onClickClaimX2(): void {
        if (this.isButtonLocked() || this.isClickThrottled()) {
            return;
        }
        this.lockButtonsFor(500);
        if (!this.beginClaim("claim_x2", false)) {
            return;
        }
        if (this.popupMode === "task") {
            try {
                BusinessAnalyticsService.reportData("ad_show", { scene: "task", level: UserData.getInstance().level });
            } catch (e) {
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
        console.log(LOG_TAG + " 点击 CLAIMx2 mode=" + this.popupMode);
        console.log(LOG_TAG + " [过关接口][请求] claimDouble(CLAIMx2) ctx=" + JSON.stringify(ctx));
        reportAdShow(this.popupMode, this.isLevelPassed, false);
        ArrowRewardService.claimDouble(ctx, (success, res) => {
            this.endClaim();
            console.log(LOG_TAG + " [过关接口][返回] claimDouble(CLAIMx2) success=" + !!success + " req=" + JSON.stringify(ctx) + " res=" + JSON.stringify(res || {}));
            if (success) {
                this.emitRewardClaimed(res, this.doubleRewardAmount);
                this.finishAndClose();
            } else {
                console.warn(LOG_TAG + " CLAIMx2 失败，不关闭弹窗");
            }
        });
    }

    onClickNextLevel(): void {
        if (this.isButtonLocked() || this.isClickThrottled()) {
            return;
        }
        this.lockButtonsFor(500);
        const skipGuard = !!(this.popupMode === "task" && this.onTaskClaimCb) || !this.showForceVideo;
        if (!this.beginClaim("next_level", skipGuard)) {
            return;
        }
        if (this.popupMode === "task" && this.onTaskClaimCb) {
            this.handleTaskClaim(false);
            return;
        }
        const ctx: any = this.popupMode === "task"
            ? { showForceVideo: this.showForceVideo, businessType: "task", taskType: this.taskType, taskId: this.taskId }
            : { showForceVideo: this.showForceVideo, businessType: "arrow" };
        console.log(LOG_TAG + " 点击 Next Level mode=" + this.popupMode + " showForceVideo=" + this.showForceVideo);
        console.log(LOG_TAG + " [过关接口][请求] claimNormal(NextLevel) ctx=" + JSON.stringify(ctx));
        if (!skipGuard) {
            reportAdShow(this.popupMode, this.isLevelPassed, true);
        }
        ArrowRewardService.claimNormal(ctx, (success, res) => {
            this.endClaim();
            console.log(LOG_TAG + " [过关接口][返回] claimNormal(NextLevel) success=" + !!success + " req=" + JSON.stringify(ctx) + " res=" + JSON.stringify(res || {}));
            if (success) {
                this.emitRewardClaimed(res, this.levelSwitchRewardAmount);
                this.finishAndClose();
            } else {
                console.warn(LOG_TAG + " Next Level 失败，跳过奖励继续流程并关闭弹窗");
                this.finishAndClose();
            }
        });
    }

    handleTaskClaim(isDouble: boolean): void {
        const ctx = {
            isDouble: !!isDouble,
            businessType: "task",
            taskType: this.taskType,
            taskId: this.taskId,
            claimAmount: isDouble ? this.taskShowAmount : this.taskRewardAmount,
        };
        let finished = false;
        const done = (ok?: boolean) => {
            if (finished) {
                return;
            }
            finished = true;
            this.endClaim();
            if (ok !== false) {
                this.finishAndClose();
            } else {
                console.warn(LOG_TAG + " handleTaskClaim 失败，不关闭弹窗");
            }
        };
        try {
            if (this.onTaskClaimCb!.length >= 2) {
                this.onTaskClaimCb!(ctx, done);
                return;
            }
            const result = this.onTaskClaimCb!(ctx);
            if (result && typeof (result as Promise<any>).then === "function") {
                (result as Promise<any>).then((value) => done(value !== false)).catch(() => done(false));
                return;
            }
            done(result !== false);
        } catch (err) {
            console.warn(LOG_TAG + " handleTaskClaim 异常", err);
            done(false);
        }
    }

    beginClaim(from: string, useGuard: boolean): boolean {
        if (this.isClaiming) {
            return false;
        }
        this.isClaiming = true;
        this.refreshButtonsEnabled();
        if (useGuard !== false) {
            this.setClaimGuardTimer(from);
        } else {
            this.clearClaimGuardTimer();
        }
        return true;
    }

    endClaim(): void {
        this.isClaiming = false;
        this.clearClaimGuardTimer();
        this.refreshButtonsEnabled();
    }

    setClaimGuardTimer(from: string): void {
        this.clearClaimGuardTimer();
        this.claimGuardTimer = setTimeout(() => {
            this.claimGuardTimer = null;
            if (this.isValid && this.isClaiming) {
                console.warn(LOG_TAG + " 领取超时自动解锁 from=" + from);
                this.endClaim();
            }
        }, 15000);
    }

    clearClaimGuardTimer(): void {
        if (this.claimGuardTimer) {
            clearTimeout(this.claimGuardTimer);
            this.claimGuardTimer = null;
        }
    }

    refreshButtonsEnabled(): void {
        const enabled = !this.isClaiming;
        if (this.btnClaim) {
            this.btnClaim.interactable = enabled;
        }
        if (this.btnClaimX2) {
            this.btnClaimX2.interactable = enabled;
        }
        if (this.btnNext) {
            this.btnNext.interactable = enabled;
        }
    }

    refreshButtonVisibility(): void {
        const showClaim = this.popupMode === POPUP_MODE_LEVEL && this.isNewReward;
        if (this.btnClaimNode) {
            this.btnClaimNode.active = showClaim;
        }
        if (this.btnClaimX2Node) {
            this.btnClaimX2Node.active = !showClaim;
        }
        if (this.btnNextNode) {
            this.btnNextNode.active = !showClaim;
        }
    }

    emitRewardClaimed(resData: any, fallbackAmount: number): void {
        if (this.popupMode !== POPUP_MODE_LEVEL) {
            return;
        }
        let amount = this.resolveClaimRewardAmount(resData, fallbackAmount);
        if (amount === null || amount <= 0) {
            let settleAmount = this.safeNum(this.settleData && this.settleData.switch_reward, 0);
            if (settleAmount <= 0) {
                settleAmount = this.safeNum(this.settleData && this.settleData.double_reward, 0);
            }
            if (settleAmount > 0) {
                console.log(LOG_TAG + " emitRewardClaimed: 使用 settleData 兜底 switch_reward=" + settleAmount);
                amount = settleAmount;
            }
        }
        if (amount === null || amount <= 0) {
            console.warn(LOG_TAG + " emitRewardClaimed: rewardAmount 无效 resData=" + JSON.stringify(resData || {}) + " fallbackAmount=" + fallbackAmount);
        } else {
            console.log(LOG_TAG + " emitRewardClaimed: reward_amount=" + amount + " fallback=" + fallbackAmount);
            GlobalEventMgr.getInstance().emit(gameEvent.arrowRewardClaimed, { reward_amount: amount });
        }
    }

    resolveClaimRewardAmount(resData: any, fallbackAmount: number): number | null {
        const data = resData || {};
        const keys = [
            "cash_reward", "reward_amount", "ad_reward_amount", "reward",
            "claim_reward", "task_reward", "switch_reward", "double_reward",
        ];
        for (let i = 0; i < keys.length; i++) {
            const parsed = this.parseRewardValue(data[keys[i]]);
            if (parsed !== null && parsed > 0) {
                return parsed;
            }
        }
        const fallback = this.parseRewardValue(fallbackAmount);
        return fallback !== null && fallback > 0 ? fallback : null;
    }

    parseRewardValue(value: any): number | null {
        if (value == null) {
            return null;
        }
        let str = value;
        if (typeof str === "string") {
            str = str.replace(/,/g, "").trim();
            if (!str.length) {
                return null;
            }
        }
        const num = Number(str);
        return isFinite(num) ? Math.max(0, Math.floor(num)) : null;
    }

    applySkeletonByCountry(): void {
        if (this.skeletonComp && this.skeletonComp.isValid) {
            const country = CountryAssetService.getCurrentCountry ? CountryAssetService.getCurrentCountry() : "";
            const skeletonKey = COUNTRY_SKELETON_MAP[country] || "red";
            const skeletonMap: { [key: string]: sp.SkeletonData | null } = {
                red: this.skeletonDataRed,
                green: this.skeletonDataGreen,
                yellow: this.skeletonDataYellow,
                blue: this.skeletonDataBlue,
            };
            const skeletonData = skeletonMap[skeletonKey] || this.skeletonDataRed;
            if (skeletonData) {
                this.skeletonComp.skeletonData = skeletonData;
                this.skeletonComp.setAnimation(0, "1", true);
                console.log(LOG_TAG + " applySkeletonByCountry country=" + country + " skeleton=" + skeletonKey);
            } else {
                console.warn(LOG_TAG + " applySkeletonByCountry: skeletonData[" + skeletonKey + "] 未赋值，请在预制体编辑器中绑定");
            }
        }
    }

    playEnterAnim(): void {
        if (this.nodeContent) {
            this.nodeContent.stopAllActions();
            this.nodeContent.opacity = 0;
            this.nodeContent.y = 90;
            if (this.isLevelPassed) {
                AudioMgr.getInstance().playEffect("audio/level_complete", bundleName.ui);
            } else {
                AudioMgr.getInstance().playEffect("audio/coin_collect", bundleName.game);
            }
            cc.tween(this.nodeContent).to(0.3, { y: 0, opacity: 255 }, { easing: "backOut" }).start();
        }
    }

    finishAndClose(): void {
        const nextLevel = this.winLevel + 1;
        console.log(LOG_TAG + " finishAndClose mode=" + this.popupMode + " isLevelPassed=" + this.isLevelPassed);
        cc.tween(this.node).to(0.2, { opacity: 0 }).call(() => {
            if (this.popupMode === POPUP_MODE_LEVEL && this.isLevelPassed) {
                UserData.getInstance().level = nextLevel;
                GlobalEventMgr.getInstance().emit(gameEvent.gameNext);
            } else if (typeof this.onCloseCb === "function") {
                try {
                    this.onCloseCb!();
                } catch (e) {
                }
            }
            this.emitSettleRewardCloseOnce();
            UIMgr.getInstance().hide(this.node);
        }).start();
    }

    emitSettleRewardCloseOnce(): void {
        if (!this._settleCloseEventEmitted) {
            this._settleCloseEventEmitted = true;
            GlobalEventMgr.getInstance().emit(gameEvent.settleRewardClose);
        }
    }

    findLabelByName(name: string): cc.Label | null {
        const node = this.findChildByNameDeep(this.node, name);
        return node ? node.getComponent(cc.Label) : null;
    }

    findChildByNameDeep(node: cc.Node | null, name: string): cc.Node | null {
        if (!node || !name) {
            return null;
        }
        if (node.name === name) {
            return node;
        }
        for (let i = 0; i < node.childrenCount; i++) {
            const found = this.findChildByNameDeep(node.children[i], name);
            if (found) {
                return found;
            }
        }
        return null;
    }

    safeNum(value: any, fallback: number): number {
        let raw = value;
        if (typeof raw === "string") {
            raw = raw.replace(/,/g, "").trim();
        }
        const num = Number(raw);
        return isNaN(num) ? fallback : Math.max(0, Math.floor(num));
    }

    formatMoney(value: number): string {
        return LanguageService.formatCurrency(Math.max(0, Math.floor(value || 0)));
    }

    i18n(key: string, params: any[], fallback: string): string {
        return LanguageService.t(key, params || [], fallback);
    }
}
