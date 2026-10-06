import LoadingHttpService from "./LoadingHttpService";
import Handler from "./Handler";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import AdManager from "./AdManager";
import PlayerDataStore from "./PlayerDataStore";
import NetErrorPopupService from "./NetErrorPopupService";

const LOG_TAG = "[ArrowReward]";

interface ClaimOptions {
    showForceVideo?: boolean;
    businessType?: string;
    business_type?: string;
    taskType?: string;
    task_type?: string;
    taskId?: string;
    task_id?: string;
    fallbackOnAdFail?: boolean;
    callback?: (success: boolean, data: unknown) => void;
}

interface RewardPayload {
    cash_balance?: number;
    bubble_balance?: number;
    user_level?: number;
    hint_prop_count?: number;
    guideline_prop_count?: number;
    task_point_num?: number;
    ltv_task_point_num?: number;
    sign_in?: unknown;
    cash_reward?: number;
    reward_amount?: number;
    ad_reward_amount?: number;
    switch_reward?: number;
    double_reward?: number;
    task_reward?: number;
    reward?: number;
}

function getNetErrorPopupService(): typeof NetErrorPopupService {
    return NetErrorPopupService;
}

function normalizeTaskType(taskType?: string): string {
    return taskType && taskType.toLowerCase() === "ltv" ? "ltv" : "";
}

function buildBusinessPayload(options: ClaimOptions): Record<string, string> {
    const businessTypeRaw = options.businessType || options.business_type;
    const payload: Record<string, string> = {
        business_type: businessTypeRaw && businessTypeRaw.toLowerCase() === "task" ? "task" : "arrow",
    };
    const taskType = normalizeTaskType(options.taskType || options.task_type);
    const taskId = String(options.taskId || options.task_id || "");
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

function parseRewardAmount(value: unknown): number | null {
    if (value == null) {
        return null;
    }
    let raw = value;
    if (typeof raw === "string") {
        raw = raw.replace(/,/g, "").trim();
        if (!(raw as string).length) {
            return null;
        }
    }
    const amount = Number(raw);
    return Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : null;
}

function extractRewardAmount(data: RewardPayload, previousBalance: number): { amount: number | null; source: string } {
    const keys = [
        "cash_reward",
        "reward_amount",
        "ad_reward_amount",
        "double_reward",
        "switch_reward",
        "task_reward",
        "reward",
    ];
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const amount = parseRewardAmount(data[key as keyof RewardPayload]);
        if (amount !== null && amount > 0) {
            return { amount, source: key };
        }
    }
    const balance = Number(data.cash_balance);
    if (Number.isFinite(balance) && Number.isFinite(previousBalance)) {
        const delta = Math.floor(balance - previousBalance);
        if (delta >= 0) {
            return { amount: delta, source: "cash_balance_delta" };
        }
    }
    return { amount: null, source: "none" };
}

function normalizeClaimOptions(options: ClaimOptions | boolean, callback?: (success: boolean, data: unknown) => void): Required<ClaimOptions> {
    if (options && typeof options === "object") {
        return {
            showForceVideo: !!options.showForceVideo,
            businessType: options.businessType || options.business_type || "arrow",
            taskType: options.taskType || options.task_type || "",
            taskId: options.taskId || options.task_id || "",
            fallbackOnAdFail: options.fallbackOnAdFail !== false,
            callback: callback || options.callback,
        } as Required<ClaimOptions>;
    }
    return {
        showForceVideo: !!options,
        businessType: "arrow",
        taskType: "",
        taskId: "",
        fallbackOnAdFail: true,
        callback,
    } as Required<ClaimOptions>;
}

function normalizeDoubleOptions(options: ClaimOptions | ((success: boolean, data: unknown) => void), callback?: (success: boolean, data: unknown) => void): Required<ClaimOptions> {
    if (typeof options === "function") {
        return {
            businessType: "arrow",
            taskType: "",
            taskId: "",
            fallbackOnAdFail: true,
            callback: options,
        } as Required<ClaimOptions>;
    }
    const normalized = options || {};
    return {
        businessType: normalized.businessType || normalized.business_type || "arrow",
        taskType: normalized.taskType || normalized.task_type || "",
        taskId: normalized.taskId || normalized.task_id || "",
        fallbackOnAdFail: normalized.fallbackOnAdFail !== false,
        callback: callback || normalized.callback,
    } as Required<ClaimOptions>;
}

function playAd(
    forceVideo: boolean,
    onSuccess: () => void,
    onFail?: (error: unknown) => void,
    failMessage = "激励视频播放失败，请重试",
): void {
    const adManager = AdManager.getInstance();
    if (adManager && typeof adManager.playNormalVideoAd === "function") {
        adManager.playNormalVideoAd(
            { ad_type: "reward_video", force_video: !!forceVideo },
            () => {
                console.log(LOG_TAG + " _playAd: 广告播放完成 force_video=" + !!forceVideo);
                onSuccess();
            },
            (error) => {
                console.warn(LOG_TAG + " _playAd: 广告失败 err=" + JSON.stringify(error));
                onFail?.(error);
            },
            failMessage,
        );
    } else {
        console.warn(LOG_TAG + " _playAd: 无广告SDK，视为广告失败");
        onFail?.({ message: "ad_unavailable" });
    }
}

function applyRewardResult(data: RewardPayload): void {
    if (!data) {
        return;
    }

    let previousBalance = Number(PlayerDataStore.cash_balance);
    if (!Number.isFinite(previousBalance)) {
        previousBalance = NaN;
    }
    const rewardInfo = extractRewardAmount(data, previousBalance);
    const rewardAmount = rewardInfo.amount;

    if (data.cash_balance !== undefined) {
        PlayerDataStore.cash_balance = Number(data.cash_balance);
    }

    try {
        const eventPayload: Record<string, unknown> = {};
        if (data.cash_balance !== undefined) eventPayload.cash_balance = data.cash_balance;
        if (data.bubble_balance !== undefined) eventPayload.bubble_balance = data.bubble_balance;
        if (data.user_level !== undefined) eventPayload.user_level = data.user_level;
        if (data.hint_prop_count !== undefined) eventPayload.hint_prop_count = data.hint_prop_count;
        if (data.guideline_prop_count !== undefined) eventPayload.guideline_prop_count = data.guideline_prop_count;
        if (data.task_point_num !== undefined) eventPayload.task_point_num = data.task_point_num;
        if (data.ltv_task_point_num !== undefined) eventPayload.ltv_task_point_num = data.ltv_task_point_num;
        if (data.sign_in !== undefined) eventPayload.sign_in = data.sign_in;
        if (rewardAmount !== null && rewardAmount > 0) {
            eventPayload.cash_reward = rewardAmount;
        }

        GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.userInfoUpdated, eventPayload);
        if (rewardAmount !== null && rewardAmount > 0) {
            GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.arrowRewardClaimed, {
                reward_amount: rewardAmount,
            });
        }

        console.log(
            LOG_TAG +
                " _applyRewardResult: reward_source=" +
                rewardInfo.source +
                " reward_amount=" +
                rewardAmount +
                " cash_balance=" +
                data.cash_balance +
                " bubble_balance=" +
                data.bubble_balance +
                " raw=" +
                JSON.stringify({
                    cash_reward: data.cash_reward,
                    reward_amount: data.reward_amount,
                    ad_reward_amount: data.ad_reward_amount,
                    switch_reward: data.switch_reward,
                    double_reward: data.double_reward,
                }),
        );
    } catch (error) {
        console.warn(LOG_TAG + " _applyRewardResult: emit失败 " + error);
    }
}

const ArrowRewardService = {
    claimNormal(options: ClaimOptions | boolean, callback?: (success: boolean, data: unknown) => void): void {
        const normalized = normalizeClaimOptions(options, callback);
        const onComplete = typeof normalized.callback === "function" ? normalized.callback : null;
        const payload = buildBusinessPayload(normalized);

        const requestNormalReward = () => {
            console.log(LOG_TAG + " claimNormal: 调用领取接口 ehwqDl/CCDFGN payload=" + JSON.stringify(payload));
            LoadingHttpService.claimArrowReward(
                payload,
                Handler.create(null, (response: { code?: number; data?: RewardPayload }) => {
                    const popup = getNetErrorPopupService();
                    if (popup.shouldPop(response)) {
                        console.warn(LOG_TAG + " claimNormal force-retry code=" + (response && response.code));
                        popup.showAndRetry(requestNormalReward);
                    } else if (response && response.data) {
                        console.log(LOG_TAG + " claimNormal 成功 data=" + JSON.stringify(response.data));
                        applyRewardResult(response.data);
                        onComplete?.(true, response.data);
                    } else {
                        console.warn(LOG_TAG + " claimNormal 返回数据异常 res=" + JSON.stringify(response));
                        onComplete?.(false, null);
                    }
                }),
                Handler.create(null, (error: unknown) => {
                    const popup = getNetErrorPopupService();
                    if (popup.shouldPop(error)) {
                        console.warn(LOG_TAG + " claimNormal 网络异常，弹重试窗 err=" + JSON.stringify(error));
                        popup.showAndRetry(requestNormalReward);
                    } else {
                        console.warn(LOG_TAG + " claimNormal 请求失败 err=" + JSON.stringify(error));
                        onComplete?.(false, null);
                    }
                }),
            );
        };

        const requestAdReward = (forceType: boolean) => {
            const adManager = AdManager.getInstance();
            const cpmData = (adManager && adManager.cpm_data) || {};
            const adPayload: Record<string, unknown> = {
                video_type: payload.business_type === "arrow" ? "big_red" : "task",
                task_id: cpmData.task_id || payload.task_id || "",
                force_type: forceType ? "true" : "false",
                source: cpmData.source || "",
                unitId: cpmData.unitId || "",
                cpm: cpmData.cpm || 0,
                task_type: payload.task_type,
                business_type: payload.business_type,
            };
            if (payload.task_type) {
                adPayload.task_type = payload.task_type;
            }
            console.log(LOG_TAG + " claimNormal: 广告完成，调用广告奖励接口 /vNZlOY/KWcPza params=" + JSON.stringify(adPayload));

            const retry = () => requestAdReward(forceType);
            LoadingHttpService.claimArrowAdReward(
                adPayload,
                Handler.create(null, (response: { code?: number; data?: RewardPayload }) => {
                    const popup = getNetErrorPopupService();
                    if (popup.shouldPop(response)) {
                        console.warn(LOG_TAG + " claimNormal(AdReward) force-retry code=" + (response && response.code));
                        popup.showAndRetry(retry);
                    } else if (response && response.data) {
                        console.log(LOG_TAG + " claimNormal(AdReward) 成功 data=" + JSON.stringify(response.data));
                        applyRewardResult(response.data);
                        onComplete?.(true, response.data);
                    } else {
                        console.warn(LOG_TAG + " claimNormal(AdReward) 返回数据异常 res=" + JSON.stringify(response));
                        onComplete?.(false, null);
                    }
                }),
                Handler.create(null, (error: unknown) => {
                    const popup = getNetErrorPopupService();
                    if (popup.shouldPop(error)) {
                        console.warn(LOG_TAG + " claimNormal(AdReward) 网络异常，弹重试窗 err=" + JSON.stringify(error));
                        popup.showAndRetry(retry);
                    } else {
                        console.warn(LOG_TAG + " claimNormal(AdReward) 请求失败 err=" + JSON.stringify(error));
                        onComplete?.(false, null);
                    }
                }),
            );
        };

        if (normalized.showForceVideo) {
            console.log(LOG_TAG + " claimNormal: showForceVideo=true，先播广告");
            playAd(
                true,
                () => requestAdReward(true),
                () => {
                    console.warn(LOG_TAG + " claimNormal: 广告失败，降级普通领取接口");
                    requestNormalReward();
                },
            );
        } else {
            requestNormalReward();
        }
    },

    claimDouble(options: ClaimOptions | ((success: boolean, data: unknown) => void), callback?: (success: boolean, data: unknown) => void): void {
        const normalized = normalizeDoubleOptions(options, callback);
        const onComplete = typeof normalized.callback === "function" ? normalized.callback : null;
        const payload = buildBusinessPayload(normalized);

        console.log(LOG_TAG + " claimDouble: 开始播放广告");
        playAd(
            false,
            () => {
                const adManager = AdManager.getInstance();
                const cpmData = (adManager && adManager.cpm_data) || {};
                const adPayload: Record<string, unknown> = {
                    video_type: payload.business_type === "arrow" ? "big_red" : "task",
                    task_id: cpmData.task_id || payload.task_id || "",
                    force_type: "false",
                    source: cpmData.source || "",
                    unitId: cpmData.unitId || "",
                    cpm: cpmData.cpm || 0,
                    task_type: payload.task_type,
                    business_type: payload.business_type,
                };
                if (payload.task_type) {
                    adPayload.task_type = payload.task_type;
                }
                console.log(LOG_TAG + " claimDouble: 广告完成，调用翻倍接口 /vNZlOY/KWcPza params=" + JSON.stringify(adPayload));

                const retry = () => {
                    LoadingHttpService.claimArrowAdReward(
                        adPayload,
                        Handler.create(null, (response: { data?: RewardPayload }) => {
                            const popup = getNetErrorPopupService();
                            if (popup.shouldPop(response)) {
                                popup.showAndRetry(retry);
                            } else if (response && response.data) {
                                applyRewardResult(response.data);
                                onComplete?.(true, response.data);
                            } else {
                                onComplete?.(false, null);
                            }
                        }),
                        Handler.create(null, (error: unknown) => {
                            const popup = getNetErrorPopupService();
                            if (popup.shouldPop(error)) {
                                popup.showAndRetry(retry);
                            } else {
                                onComplete?.(false, null);
                            }
                        }),
                    );
                };

                LoadingHttpService.claimArrowAdReward(
                    adPayload,
                    Handler.create(null, (response: { code?: number; data?: RewardPayload }) => {
                        const popup = getNetErrorPopupService();
                        if (popup.shouldPop(response)) {
                            console.warn(LOG_TAG + " claimDouble force-retry code=" + (response && response.code));
                            popup.showAndRetry(retry);
                        } else if (response && response.data) {
                            console.log(LOG_TAG + " claimDouble 成功 data=" + JSON.stringify(response.data));
                            applyRewardResult(response.data);
                            onComplete?.(true, response.data);
                        } else {
                            console.warn(LOG_TAG + " claimDouble 返回数据异常 res=" + JSON.stringify(response));
                            onComplete?.(false, null);
                        }
                    }),
                    Handler.create(null, (error: unknown) => {
                        const popup = getNetErrorPopupService();
                        if (popup.shouldPop(error)) {
                            console.warn(LOG_TAG + " claimDouble 网络异常，弹重试窗 err=" + JSON.stringify(error));
                            popup.showAndRetry(retry);
                        } else {
                            console.warn(LOG_TAG + " claimDouble 请求失败 err=" + JSON.stringify(error));
                            onComplete?.(false, null);
                        }
                    }),
                );
            },
            () => {
                if (normalized.fallbackOnAdFail !== false) {
                    console.warn(LOG_TAG + " claimDouble: 广告失败，降级为普通领取");
                    ArrowRewardService.claimNormal(
                        {
                            showForceVideo: false,
                            businessType: normalized.businessType,
                            taskType: normalized.taskType,
                            taskId: normalized.taskId,
                        },
                        onComplete || undefined,
                    );
                } else {
                    console.warn(LOG_TAG + " claimDouble: 广告失败，不降级发奖");
                    onComplete?.(false, null);
                }
            },
        );
    },
};

export default ArrowRewardService;
