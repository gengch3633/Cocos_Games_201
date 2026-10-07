import AdManager from "./AdManager";
import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import InterfaceMgr from "./InterfaceMgr";
import LoadingHttpService from "./LoadingHttpService";
import NetErrorPopupService from "./NetErrorPopupService";
import PlayerDataStore from "./PlayerDataStore";

const LOG_TAG = "[ArrowReward]";

function getNetErrorPopupService(): any {
    return NetErrorPopupService;
}

function normalizeTaskType(taskType: any): string {
    return String(taskType || "").toLowerCase() === "ltv" ? "ltv" : "";
}

function buildPayload(options: any): any {
    const payload: any = {
        business_type: String(options?.businessType || "").toLowerCase() === "task" ? "task" : "arrow"
    };
    const taskType = normalizeTaskType(options?.taskType);
    const taskId = String(options?.taskId || options?.task_id || "");
    if (payload.business_type === "task") {
        if (taskType === "ltv") {
            payload.task_type = "ltv";
        }
        if (taskId) {
            payload.task_id = taskId;
        }
    }
    return payload;
}

function parseRewardAmount(value: any): number | null {
    if (value == null) {
        return null;
    }
    let raw = value;
    if (typeof raw === "string") {
        raw = raw.replace(/,/g, "").trim();
        if (!raw.length) {
            return null;
        }
    }
    const amount = Number(raw);
    return isFinite(amount) ? Math.max(0, Math.floor(amount)) : null;
}

function extractReward(data: any, previousBalance: number): { amount: number | null; source: string } {
    const fields = ["cash_reward", "reward_amount", "ad_reward_amount", "double_reward", "switch_reward", "task_reward", "reward"];
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const amount = parseRewardAmount(data[field]);
        if (amount !== null && amount > 0) {
            return {
                amount: amount,
                source: field
            };
        }
    }
    const balance = Number(data.cash_balance);
    if (isFinite(balance) && isFinite(previousBalance)) {
        const delta = Math.floor(balance - previousBalance);
        if (delta >= 0) {
            return {
                amount: delta,
                source: "cash_balance_delta"
            };
        }
    }
    return {
        amount: null,
        source: "none"
    };
}

function normalizeClaimNormalOptions(options: any, callback?: Function): any {
    if (options && typeof options === "object") {
        return {
            showForceVideo: !!options.showForceVideo,
            businessType: options.businessType || options.business_type || "arrow",
            taskType: options.taskType || options.task_type || "",
            taskId: options.taskId || options.task_id || "",
            callback: callback || options.callback
        };
    }
    return {
        showForceVideo: !!options,
        businessType: "arrow",
        taskType: "",
        taskId: "",
        callback: callback
    };
}

function normalizeClaimDoubleOptions(options: any, callback?: Function): any {
    if (typeof options === "function") {
        return {
            businessType: "arrow",
            taskType: "",
            taskId: "",
            fallbackOnAdFail: true,
            callback: options
        };
    }
    options = options || {};
    return {
        businessType: options.businessType || options.business_type || "arrow",
        taskType: options.taskType || options.task_type || "",
        taskId: options.taskId || options.task_id || "",
        fallbackOnAdFail: options.fallbackOnAdFail !== false,
        callback: callback || options.callback
    };
}

function playAd(forceVideo: boolean, onSuccess?: Function, onFail?: Function): void {
    const adManager = AdManager.getInstance();
    if (adManager && typeof adManager.playNormalVideoAd === "function") {
        adManager.playNormalVideoAd({
            ad_type: "reward_video",
            force_video: !!forceVideo
        }, () => {
            console.log(LOG_TAG + "_playAd: 广告播放完成 force_video="+ !!forceVideo); onSuccess && onSuccess(); }, (error: any) => { console.warn(LOG_TAG +"_playAd: 广告失败 err="+ JSON.stringify(error)); onFail && onFail(error); },"激励视频播放失败，请重试");
    } else {
        console.warn(LOG_TAG + " _playAd: 无广告SDK，视为广告失败");
        onFail && onFail({
            message: "ad_unavailable"
        });
    }
}

function applyRewardResult(data: any): void {
    if (!data) {
        return;
    }
    const previousBalance = Number(PlayerDataStore.cash_balance);
    const balance = isFinite(previousBalance) ? previousBalance : NaN;
    const reward = extractReward(data, balance);
    const rewardAmount = reward.amount;
    if (data.cash_balance !== undefined) {
        PlayerDataStore.cash_balance = Number(data.cash_balance);
    }
    try {
        const payload: any = {};
        if (data.cash_balance !== undefined) {
            payload.cash_balance = data.cash_balance;
        }
        if (data.bubble_balance !== undefined) {
            payload.bubble_balance = data.bubble_balance;
        }
        if (data.user_level !== undefined) {
            payload.user_level = data.user_level;
        }
        if (data.hint_prop_count !== undefined) {
            payload.hint_prop_count = data.hint_prop_count;
        }
        if (data.guideline_prop_count !== undefined) {
            payload.guideline_prop_count = data.guideline_prop_count;
        }
        if (data.task_point_num !== undefined) {
            payload.task_point_num = data.task_point_num;
        }
        if (data.ltv_task_point_num !== undefined) {
            payload.ltv_task_point_num = data.ltv_task_point_num;
        }
        if (data.sign_in !== undefined) {
            payload.sign_in = data.sign_in;
        }
        if (rewardAmount !== null && rewardAmount > 0) {
            payload.cash_reward = rewardAmount;
        }
        GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.userInfoUpdated, payload);
        if (rewardAmount !== null && rewardAmount > 0) {
            GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.arrowRewardClaimed, {
                reward_amount: rewardAmount
            });
        }
        console.log(LOG_TAG + "_applyRewardResult: reward_source=" + reward.source + " reward_amount=" + rewardAmount + " cash_balance=" + data.cash_balance + " bubble_balance=" + data.bubble_balance + " raw="+ JSON.stringify({ cash_reward: data.cash_reward, reward_amount: data.reward_amount, ad_reward_amount: data.ad_reward_amount, switch_reward: data.switch_reward, double_reward: data.double_reward })); } catch (e) { console.warn(LOG_TAG +" _applyRewardResult: emit失败 "+ e); }
} const ArrowRewardService = { claimNormal(options: any, callback?: Function): void { const normalized = normalizeClaimNormalOptions(options, callback); const onComplete = typeof normalized.callback ==="function"? normalized.callback : null; const payload = buildPayload(normalized); function claimNormalRequest(): void { console.log(LOG_TAG +"claimNormal: 调用领取接口 ehwqDl/CCDFGN payload="+ JSON.stringify(payload)); LoadingHttpService.claimArrowReward(payload, Handler.create(null, (response: any) => { const popup = getNetErrorPopupService(); if (popup && popup.shouldPop(response)) { console.warn(LOG_TAG +"claimNormal force-retry code="+ (response && response.code)); popup.showAndRetry(claimNormalRequest); } else if (response && response.data) { console.log(LOG_TAG +"claimNormal 成功 data="+ JSON.stringify(response.data)); applyRewardResult(response.data); onComplete && onComplete(true, response.data); } else { console.warn(LOG_TAG +"claimNormal 返回数据异常 res="+ JSON.stringify(response)); onComplete && onComplete(false, null); } }), Handler.create(null, (error: any) => { const popup = getNetErrorPopupService(); if (popup && popup.shouldPop(error)) { console.warn(LOG_TAG +"claimNormal 网络异常 ， 弹重试窗 err="+ JSON.stringify(error)); popup.showAndRetry(claimNormalRequest); } else { console.warn(LOG_TAG +"claimNormal 请求失败 err="+ JSON.stringify(error)); onComplete && onComplete(false, null); } })); } function claimAdReward(forceType: boolean): void { const adManager = AdManager.getInstance(); const cpmData = adManager && adManager.cpm_data || {}; const params: any = { video_type: payload.business_type ==="arrow" ? "big_red" : "task",
                task_id: cpmData.task_id || payload.task_id || "",
                force_type: forceType ? "true" : "false",
                source: cpmData.source || "",
                unitId: cpmData.unitId || "",
                cpm: cpmData.cpm || 0,
                task_type: payload.task_type,
                business_type: payload.business_type
            };
            if (payload.task_type) {
                params.task_type = payload.task_type;
            }
            console.log(LOG_TAG + "claimNormal: 广告完成 ， 调用广告奖励接口/ vNZlOY/ KWcPza params="+ JSON.stringify(params)); const retry = () => claimAdReward(forceType); LoadingHttpService.claimArrowAdReward(params, Handler.create(null, (response: any) => { const popup = getNetErrorPopupService(); if (popup && popup.shouldPop(response)) { console.warn(LOG_TAG +"claimNormal(AdReward) force-retry code="+ (response && response.code)); popup.showAndRetry(retry); } else if (response && response.data) { console.log(LOG_TAG +"claimNormal(AdReward) 成功 data="+ JSON.stringify(response.data)); applyRewardResult(response.data); onComplete && onComplete(true, response.data); } else { console.warn(LOG_TAG +"claimNormal(AdReward) 返回数据异常 res="+ JSON.stringify(response)); onComplete && onComplete(false, null); } }), Handler.create(null, (error: any) => { const popup = getNetErrorPopupService(); if (popup && popup.shouldPop(error)) { console.warn(LOG_TAG +"claimNormal(AdReward) 网络异常 ， 弹重试窗 err="+ JSON.stringify(error)); popup.showAndRetry(retry); } else { console.warn(LOG_TAG +"claimNormal(AdReward) 请求失败 err="+ JSON.stringify(error)); onComplete && onComplete(false, null); } })); } if (normalized.showForceVideo) { console.log(LOG_TAG +" claimNormal: showForceVideo=true，先播广告");
            playAd(true, () => claimAdReward(true), () => {
                console.warn(LOG_TAG + " claimNormal: 广告失败，降级普通领取接口");
                claimNormalRequest();
            });
        } else {
            claimNormalRequest();
        }
    },

    claimDouble(options: any, callback?: Function): void {
        const normalized = normalizeClaimDoubleOptions(options, callback);
        const onComplete = typeof normalized.callback === "function"? normalized.callback : null; const payload = buildPayload(normalized); console.log(LOG_TAG +" claimDouble: 开始播放广告");
        playAd(false, () => {
            const adManager = AdManager.getInstance();
            const cpmData = adManager && adManager.cpm_data || {};
            const params: any = {
                video_type: payload.business_type === "arrow" ? "big_red" : "task",
                task_id: cpmData.task_id || payload.task_id || "",
                force_type: "false",
                source: cpmData.source || "",
                unitId: cpmData.unitId || "",
                cpm: cpmData.cpm || 0,
                task_type: payload.task_type,
                business_type: payload.business_type
            };
            if (payload.task_type) {
                params.task_type = payload.task_type;
            }
            console.log(LOG_TAG + "claimDouble: 广告完成 ， 调用翻倍接口/ vNZlOY/ KWcPza params="+ JSON.stringify(params)); const retryClaim = () => { LoadingHttpService.claimArrowAdReward(params, Handler.create(null, (response: any) => { const popup = getNetErrorPopupService(); if (popup && popup.shouldPop(response)) { popup.showAndRetry(retryClaim); } else if (response && response.data) { applyRewardResult(response.data); onComplete && onComplete(true, response.data); } else { onComplete && onComplete(false, null); } }), Handler.create(null, (error: any) => { const popup = getNetErrorPopupService(); popup && popup.shouldPop(error) ? popup.showAndRetry(retryClaim) : onComplete && onComplete(false, null); })); }; LoadingHttpService.claimArrowAdReward(params, Handler.create(null, (response: any) => { const popup = getNetErrorPopupService(); if (popup && popup.shouldPop(response)) { console.warn(LOG_TAG +"claimDouble force-retry code="+ (response && response.code)); popup.showAndRetry(retryClaim); } else if (response && response.data) { console.log(LOG_TAG +"claimDouble 成功 data="+ JSON.stringify(response.data)); applyRewardResult(response.data); onComplete && onComplete(true, response.data); } else { console.warn(LOG_TAG +"claimDouble 返回数据异常 res="+ JSON.stringify(response)); onComplete && onComplete(false, null); } }), Handler.create(null, (error: any) => { const popup = getNetErrorPopupService(); if (popup && popup.shouldPop(error)) { console.warn(LOG_TAG +"claimDouble 网络异常 ， 弹重试窗 err="+ JSON.stringify(error)); popup.showAndRetry(retryClaim); } else { console.warn(LOG_TAG +"claimDouble 请求失败 err="+ JSON.stringify(error)); onComplete && onComplete(false, null); } })); }, () => { if (normalized.fallbackOnAdFail !== false) { console.warn(LOG_TAG +" claimDouble: 广告失败，降级为普通领取");
                ArrowRewardService.claimNormal({
                    showForceVideo: false,
                    businessType: normalized.businessType,
                    taskType: normalized.taskType,
                    taskId: normalized.taskId
                }, onComplete);
            } else {
                console.warn(LOG_TAG + " claimDouble: 广告失败，不降级发奖");
                onComplete && onComplete(false, null);
            }
        });
    }
};

export default ArrowRewardService;
