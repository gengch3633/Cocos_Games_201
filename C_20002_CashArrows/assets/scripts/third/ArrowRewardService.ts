import AdManager from "./AdManager";
import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import { gameEvent } from "./InterfaceMgr";
import LoadingHttpService from "./LoadingHttpService";
import NetErrorPopupService from "./NetErrorPopupService";
import PlayerDataStore from "./PlayerDataStore";

const LOG_PREFIX = "[ArrowReward]";

type RewardCallback = (success: boolean, data: any) => void;

interface ClaimPayload {
    business_type: string;
    task_type?: string;
    task_id?: string;
}

interface ClaimNormalOptions {
    showForceVideo: boolean;
    businessType: string;
    taskType: string;
    taskId: string;
    callback: RewardCallback | null;
}

interface ClaimDoubleOptions {
    businessType: string;
    taskType: string;
    taskId: string;
    fallbackOnAdFail: boolean;
    callback: RewardCallback | null;
}

function normalizeTaskType(taskType: any): string {
    return String(taskType || "").toLowerCase() === "ltv" ? "ltv" : "";
}

function buildClaimPayload(options: {
    businessType?: string;
    business_type?: string;
    taskType?: string;
    task_type?: string;
    taskId?: string;
    task_id?: string;
}): ClaimPayload {
    const businessTypeRaw = options && options.businessType;
    const payload: ClaimPayload = {
        business_type:
            String(businessTypeRaw || "").toLowerCase() === "task" ? "task" : "arrow",
    };
    const taskType = normalizeTaskType(options && options.taskType);
    const taskId = String((options && (options.taskId || "")) || "");
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

function extractReward(data: any, cashBalance: number): { amount: number | null; source: string } {
    const record = data || {};
    const fields = [
        "cash_reward",
        "reward_amount",
        "ad_reward_amount",
        "double_reward",
        "switch_reward",
        "task_reward",
        "reward",
    ];
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const amount = parseRewardAmount(record[field]);
        if (amount !== null && amount > 0) {
            return { amount, source: field };
        }
    }
    const balance = Number(record.cash_balance);
    if (isFinite(balance) && isFinite(cashBalance)) {
        const delta = Math.floor(balance - cashBalance);
        if (delta >= 0) {
            return { amount: delta, source: "cash_balance_delta" };
        }
    }
    return { amount: null, source: "none" };
}

function normalizeClaimNormalOptions(
    options: any,
    callback?: RewardCallback
): ClaimNormalOptions {
    if (options && typeof options === "object") {
        return {
            showForceVideo: !!options.showForceVideo,
            businessType: options.businessType || options.business_type || "arrow",
            taskType: options.taskType || options.task_type || "",
            taskId: options.taskId || options.task_id || "",
            callback: callback || options.callback,
        };
    }
    return {
        showForceVideo: !!options,
        businessType: "arrow",
        taskType: "",
        taskId: "",
        callback: callback,
    };
}

function normalizeClaimDoubleOptions(
    options: any,
    callback?: RewardCallback
): ClaimDoubleOptions {
    if (typeof options === "function") {
        return {
            businessType: "arrow",
            taskType: "",
            taskId: "",
            fallbackOnAdFail: true,
            callback: options,
        };
    }
    const opts = options || {};
    return {
        businessType: opts.businessType || opts.business_type || "arrow",
        taskType: opts.taskType || opts.task_type || "",
        taskId: opts.taskId || opts.task_id || "",
        fallbackOnAdFail: opts.fallbackOnAdFail !== false,
        callback: callback || opts.callback,
    };
}

function playAd(
    forceVideo: boolean | Function,
    onSuccess?: Function,
    onFail?: Function
): void {
    let force = forceVideo;
    let success = onSuccess;
    let fail = onFail;
    if (typeof forceVideo === "function") {
        fail = onSuccess as Function;
        success = forceVideo;
        force = false;
    }
    const adManager = AdManager.getInstance();
    if (adManager && typeof adManager.playNormalVideoAd === "function") {
        adManager.playNormalVideoAd(
            { ad_type: "reward_video", force_video: !!force },
            function () {
                console.log(LOG_PREFIX + " _playAd: 广告播放完成 force_video=" + !!force);
                success && success();
            },
            function (err: any) {
                console.warn(LOG_PREFIX + " _playAd: 广告失败 err=" + JSON.stringify(err));
                fail && fail(err);
            },
            "激励视频播放失败，请重试"
        );
    } else {
        console.warn(LOG_PREFIX + " _playAd: 无广告SDK，视为广告失败");
        fail &&
            fail({
                message: "ad_unavailable",
            });
    }
}

function applyRewardResult(data: any): void {
    if (!data) {
        return;
    }
    let previousBalance = Number(PlayerDataStore.cash_balance);
    if (!isFinite(previousBalance)) {
        previousBalance = NaN;
    }
    const rewardInfo = extractReward(data, previousBalance);
    const rewardAmount = rewardInfo.amount;
    if (data.cash_balance !== undefined) {
        PlayerDataStore.cash_balance = Number(data.cash_balance);
    }
    try {
        const eventPayload: any = {};
        if (data.cash_balance !== undefined) {
            eventPayload.cash_balance = data.cash_balance;
        }
        if (data.bubble_balance !== undefined) {
            eventPayload.bubble_balance = data.bubble_balance;
        }
        if (data.user_level !== undefined) {
            eventPayload.user_level = data.user_level;
        }
        if (data.hint_prop_count !== undefined) {
            eventPayload.hint_prop_count = data.hint_prop_count;
        }
        if (data.guideline_prop_count !== undefined) {
            eventPayload.guideline_prop_count = data.guideline_prop_count;
        }
        if (data.task_point_num !== undefined) {
            eventPayload.task_point_num = data.task_point_num;
        }
        if (data.ltv_task_point_num !== undefined) {
            eventPayload.ltv_task_point_num = data.ltv_task_point_num;
        }
        if (data.sign_in !== undefined) {
            eventPayload.sign_in = data.sign_in;
        }
        if (rewardAmount !== null && rewardAmount > 0) {
            eventPayload.cash_reward = rewardAmount;
        }
        GlobalEventMgr.getInstance().emit(gameEvent.userInfoUpdated, eventPayload);
        if (rewardAmount !== null && rewardAmount > 0) {
            GlobalEventMgr.getInstance().emit(gameEvent.arrowRewardClaimed, {
                reward_amount: rewardAmount,
            });
        }
        console.log(
            LOG_PREFIX +
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
                })
        );
    } catch (err) {
        console.warn(LOG_PREFIX + " _applyRewardResult: emit失败 " + err);
    }
}

function buildAdRewardParams(
    claimPayload: ClaimPayload,
    forceType: boolean,
    cpmData: any
): any {
    const params: any = {
        video_type: claimPayload.business_type === "arrow" ? "big_red" : "task",
        task_id: cpmData.task_id || claimPayload.task_id || "",
        force_type: forceType ? "true" : "false",
        source: cpmData.source || "",
        unitId: cpmData.unitId || "",
        cpm: cpmData.cpm || 0,
        task_type: claimPayload.task_type,
        business_type: claimPayload.business_type,
    };
    if (claimPayload.task_type) {
        params.task_type = claimPayload.task_type;
    }
    return params;
}

const ArrowRewardService = {
    claimNormal(options: any, callback?: RewardCallback): void {
        const normalized = normalizeClaimNormalOptions(options, callback);
        const rewardCallback =
            typeof normalized.callback === "function" ? normalized.callback : null;
        const claimPayload = buildClaimPayload(normalized);

        const claimNormalReward = () => {
            console.log(
                LOG_PREFIX +
                    " claimNormal: 调用领取接口 ehwqDl/CCDFGN payload=" +
                    JSON.stringify(claimPayload)
            );
            LoadingHttpService.claimArrowReward(
                claimPayload,
                Handler.create(null, function (res: any) {
                    if (NetErrorPopupService.shouldPop(res)) {
                        console.warn(
                            LOG_PREFIX + " claimNormal force-retry code=" + (res && res.code)
                        );
                        NetErrorPopupService.showAndRetry(claimNormalReward);
                    } else if (res && res.data) {
                        console.log(
                            LOG_PREFIX + " claimNormal 成功 data=" + JSON.stringify(res.data)
                        );
                        applyRewardResult(res.data);
                        rewardCallback && rewardCallback(true, res.data);
                    } else {
                        console.warn(
                            LOG_PREFIX + " claimNormal 返回数据异常 res=" + JSON.stringify(res)
                        );
                        rewardCallback && rewardCallback(false, null);
                    }
                }),
                Handler.create(null, function (err: any) {
                    if (NetErrorPopupService.shouldPop(err)) {
                        console.warn(
                            LOG_PREFIX +
                                " claimNormal 网络异常，弹重试窗 err=" +
                                JSON.stringify(err)
                        );
                        NetErrorPopupService.showAndRetry(claimNormalReward);
                    } else {
                        console.warn(
                            LOG_PREFIX + " claimNormal 请求失败 err=" + JSON.stringify(err)
                        );
                        rewardCallback && rewardCallback(false, null);
                    }
                })
            );
        };

        const claimAdReward = (forceType: boolean) => {
            const adManager = AdManager.getInstance();
            const cpmData = (adManager && adManager.cpm_data) || {};
            const adParams = buildAdRewardParams(claimPayload, forceType, cpmData);
            console.log(
                LOG_PREFIX +
                    " claimNormal: 广告完成，调用广告奖励接口 /vNZlOY/KWcPza params=" +
                    JSON.stringify(adParams)
            );
            const retryClaimAdReward = () => {
                claimAdReward(forceType);
            };
            LoadingHttpService.claimArrowAdReward(
                adParams,
                Handler.create(null, function (res: any) {
                    if (NetErrorPopupService.shouldPop(res)) {
                        console.warn(
                            LOG_PREFIX +
                                " claimNormal(AdReward) force-retry code=" +
                                (res && res.code)
                        );
                        NetErrorPopupService.showAndRetry(retryClaimAdReward);
                    } else if (res && res.data) {
                        console.log(
                            LOG_PREFIX +
                                " claimNormal(AdReward) 成功 data=" +
                                JSON.stringify(res.data)
                        );
                        applyRewardResult(res.data);
                        rewardCallback && rewardCallback(true, res.data);
                    } else {
                        console.warn(
                            LOG_PREFIX +
                                " claimNormal(AdReward) 返回数据异常 res=" +
                                JSON.stringify(res)
                        );
                        rewardCallback && rewardCallback(false, null);
                    }
                }),
                Handler.create(null, function (err: any) {
                    if (NetErrorPopupService.shouldPop(err)) {
                        console.warn(
                            LOG_PREFIX +
                                " claimNormal(AdReward) 网络异常，弹重试窗 err=" +
                                JSON.stringify(err)
                        );
                        NetErrorPopupService.showAndRetry(retryClaimAdReward);
                    } else {
                        console.warn(
                            LOG_PREFIX +
                                " claimNormal(AdReward) 请求失败 err=" +
                                JSON.stringify(err)
                        );
                        rewardCallback && rewardCallback(false, null);
                    }
                })
            );
        };

        if (normalized.showForceVideo) {
            console.log(LOG_PREFIX + " claimNormal: showForceVideo=true，先播广告");
            playAd(
                true,
                function () {
                    claimAdReward(true);
                },
                function () {
                    console.warn(LOG_PREFIX + " claimNormal: 广告失败，降级普通领取接口");
                    claimNormalReward();
                }
            );
        } else {
            claimNormalReward();
        }
    },

    claimDouble(options: any, callback?: RewardCallback): void {
        const normalized = normalizeClaimDoubleOptions(options, callback);
        const rewardCallback =
            typeof normalized.callback === "function" ? normalized.callback : null;
        const claimPayload = buildClaimPayload(normalized);
        console.log(LOG_PREFIX + " claimDouble: 开始播放广告");
        playAd(
            false,
            function () {
                const adManager = AdManager.getInstance();
                const cpmData = (adManager && adManager.cpm_data) || {};
                const adParams = buildAdRewardParams(claimPayload, false, cpmData);
                console.log(
                    LOG_PREFIX +
                        " claimDouble: 广告完成，调用翻倍接口 /vNZlOY/KWcPza params=" +
                        JSON.stringify(adParams)
                );
                const retryClaimDouble = function retryClaimDouble() {
                    LoadingHttpService.claimArrowAdReward(
                        adParams,
                        Handler.create(null, function (res: any) {
                            if (NetErrorPopupService.shouldPop(res)) {
                                NetErrorPopupService.showAndRetry(retryClaimDouble);
                            } else if (res && res.data) {
                                applyRewardResult(res.data);
                                rewardCallback && rewardCallback(true, res.data);
                            } else {
                                rewardCallback && rewardCallback(false, null);
                            }
                        }),
                        Handler.create(null, function (err: any) {
                            if (NetErrorPopupService.shouldPop(err)) {
                                NetErrorPopupService.showAndRetry(retryClaimDouble);
                            } else {
                                rewardCallback && rewardCallback(false, null);
                            }
                        })
                    );
                };
                LoadingHttpService.claimArrowAdReward(
                    adParams,
                    Handler.create(null, function (res: any) {
                        if (NetErrorPopupService.shouldPop(res)) {
                            console.warn(
                                LOG_PREFIX +
                                    " claimDouble force-retry code=" +
                                    (res && res.code)
                            );
                            NetErrorPopupService.showAndRetry(retryClaimDouble);
                        } else if (res && res.data) {
                            console.log(
                                LOG_PREFIX + " claimDouble 成功 data=" + JSON.stringify(res.data)
                            );
                            applyRewardResult(res.data);
                            rewardCallback && rewardCallback(true, res.data);
                        } else {
                            console.warn(
                                LOG_PREFIX +
                                    " claimDouble 返回数据异常 res=" +
                                    JSON.stringify(res)
                            );
                            rewardCallback && rewardCallback(false, null);
                        }
                    }),
                    Handler.create(null, function (err: any) {
                        if (NetErrorPopupService.shouldPop(err)) {
                            console.warn(
                                LOG_PREFIX +
                                    " claimDouble 网络异常，弹重试窗 err=" +
                                    JSON.stringify(err)
                            );
                            NetErrorPopupService.showAndRetry(retryClaimDouble);
                        } else {
                            console.warn(
                                LOG_PREFIX + " claimDouble 请求失败 err=" + JSON.stringify(err)
                            );
                            rewardCallback && rewardCallback(false, null);
                        }
                    })
                );
            },
            function () {
                if (normalized.fallbackOnAdFail !== false) {
                    console.warn(LOG_PREFIX + " claimDouble: 广告失败，降级为普通领取");
                    ArrowRewardService.claimNormal(
                        {
                            showForceVideo: false,
                            businessType: normalized.businessType,
                            taskType: normalized.taskType,
                            taskId: normalized.taskId,
                        },
                        rewardCallback
                    );
                } else {
                    console.warn(LOG_PREFIX + " claimDouble: 广告失败，不降级发奖");
                    rewardCallback && rewardCallback(false, null);
                }
            }
        );
    },
};

export default ArrowRewardService;
