import AdManager from "./AdManager";
import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import * as InterfaceMgr from "./InterfaceMgr";
import LoadingHttpService from "./LoadingHttpService";
import NetErrorPopupService from "./NetErrorPopupService";
import PlayerDataStore from "./PlayerDataStore";

const LOG_TAG = "[ArrowReward]";

interface ArrowRewardResultData {
    cash_balance?: number;
    bubble_balance?: number;
    user_level?: number;
    hint_prop_count?: number;
    guideline_prop_count?: number;
    task_point_num?: number;
    ltv_task_point_num?: number;
    sign_in?: any;
    cash_reward?: number;
    reward_amount?: number;
    ad_reward_amount?: number;
    double_reward?: number;
    switch_reward?: number;
    task_reward?: number;
    reward?: number;
    [key: string]: any;
}

type RewardCallback = (success: boolean, data?: ArrowRewardResultData | null) => void;
type AdSuccessCallback = () => void;
type AdFailCallback = (err?: any) => void;

interface ArrowRewardRequest {
    business_type: "arrow" | "task";
    task_type?: "ltv";
    task_id?: string;
}

interface ClaimNormalOptions {
    showForceVideo?: boolean;
    businessType?: string;
    business_type?: string;
    taskType?: string;
    task_type?: string;
    taskId?: string;
    task_id?: string;
    callback?: RewardCallback | null;
}

interface NormalizedClaimNormalOptions {
    showForceVideo: boolean;
    businessType: string;
    taskType: string;
    taskId: string;
    callback: RewardCallback | null;
}

interface ClaimDoubleOptions {
    businessType?: string;
    business_type?: string;
    taskType?: string;
    task_type?: string;
    taskId?: string;
    task_id?: string;
    fallbackOnAdFail?: boolean;
    callback?: RewardCallback | null;
}

interface NormalizedClaimDoubleOptions {
    businessType: string;
    taskType: string;
    taskId: string;
    fallbackOnAdFail: boolean;
    callback: RewardCallback | null;
}

interface ArrowRewardServiceContract {
    claimNormal(options?: ClaimNormalOptions | boolean | null, callback?: RewardCallback | null): void;
    claimDouble(options?: ClaimDoubleOptions | RewardCallback | null, callback?: RewardCallback | null): void;
}

function getNetErrorPopupService(): any {
    return NetErrorPopupService;
}

function normalizeTaskType(value: any): "ltv" | "" {
    return String(value || "").toLowerCase() === "ltv" ? "ltv" : "";
}

function buildArrowRewardRequest(options: { businessType?: string; taskType?: string; taskId?: string }): ArrowRewardRequest {
    const businessType = String(options && options.businessType || "").toLowerCase() === "task" ? "task" : "arrow";
    const request: ArrowRewardRequest = {
        business_type: businessType
    };
    const taskType = normalizeTaskType(options && options.taskType);
    const taskId = String(options && (options.taskId || "") || "");
    if (businessType === "task") {
        if (taskType === "ltv") {
            request.task_type = "ltv";
        }
        if (taskId) {
            request.task_id = taskId;
        }
    }
    return request;
}

function parseRewardAmount(value: any): number | null {
    if (value === null || value === undefined) {
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

const REWARD_SOURCES: string[] = [
    "cash_reward",
    "reward_amount",
    "ad_reward_amount",
    "double_reward",
    "switch_reward",
    "task_reward",
    "reward"
];

function extractRewardAmount(data: any, previousCashBalance?: number): { amount: number | null; source: string } {
    const sourceData = data || {};
    for (let i = 0; i < REWARD_SOURCES.length; i++) {
        const source = REWARD_SOURCES[i];
        const amount = parseRewardAmount(sourceData[source]);
        if (amount !== null && amount > 0) {
            return { amount, source };
        }
    }
    const cashBalance = Number(sourceData.cash_balance);
    if (isFinite(cashBalance) && isFinite(previousCashBalance as number)) {
        const delta = Math.floor(cashBalance - (previousCashBalance as number));
        if (delta >= 0) {
            return { amount: delta, source: "cash_balance_delta" };
        }
    }
    return { amount: null, source: "none" };
}

function normalizeClaimNormalOptions(
    options?: ClaimNormalOptions | boolean | null,
    callback?: RewardCallback | null
): NormalizedClaimNormalOptions {
    if (options && typeof options === "object") {
        return {
            showForceVideo: !!options.showForceVideo,
            businessType: options.businessType || options.business_type || "arrow",
            taskType: options.taskType || options.task_type || "",
            taskId: options.taskId || options.task_id || "",
            callback: callback || options.callback || null
        };
    }
    return {
        showForceVideo: !!options,
        businessType: "arrow",
        taskType: "",
        taskId: "",
        callback: callback || null
    };
}

function normalizeClaimDoubleOptions(
    options?: ClaimDoubleOptions | RewardCallback | null,
    callback?: RewardCallback | null
): NormalizedClaimDoubleOptions {
    if (typeof options === "function") {
        return {
            businessType: "arrow",
            taskType: "",
            taskId: "",
            fallbackOnAdFail: true,
            callback: options
        };
    }
    const opts = options || {};
    return {
        businessType: opts.businessType || opts.business_type || "arrow",
        taskType: opts.taskType || opts.task_type || "",
        taskId: opts.taskId || opts.task_id || "",
        fallbackOnAdFail: opts.fallbackOnAdFail !== false,
        callback: callback || opts.callback || null
    };
}

function playRewardVideoAd(
    forceVideo: boolean | AdSuccessCallback,
    success?: AdSuccessCallback | AdFailCallback,
    fail?: AdFailCallback
): void {
    let force = false;
    let onSuccess: AdSuccessCallback | undefined;
    let onFail: AdFailCallback | undefined;

    if (typeof forceVideo === "function") {
        onSuccess = forceVideo;
        onFail = success as AdFailCallback;
    } else {
        force = !!forceVideo;
        onSuccess = success as AdSuccessCallback;
        onFail = fail;
    }

    const adManager: any = AdManager && AdManager.getInstance ? AdManager.getInstance() : null;
    if (adManager && typeof adManager.playNormalVideoAd === "function") {
        adManager.playNormalVideoAd(
            {
                ad_type: "reward_video",
                force_video: force
            },
            function () {
                console.log(LOG_TAG + " _playAd: 广告播放完成 force_video=" + force);
                if (onSuccess) {
                    onSuccess();
                }
            },
            function (err: any) {
                console.warn(LOG_TAG + " _playAd: 广告失败 err=" + JSON.stringify(err));
                if (onFail) {
                    onFail(err);
                }
            },
            "激励视频播放失败，请重试"
        );
    } else {
        console.warn(LOG_TAG + " _playAd: 无广告SDK，视为广告失败");
        if (onFail) {
            onFail({ message: "ad_unavailable" });
        }
    }
}

function applyRewardResult(data: ArrowRewardResultData): void {
    if (!data) {
        return;
    }

    const previousCashBalanceValue = Number(PlayerDataStore.cash_balance);
    const previousCashBalance = isFinite(previousCashBalanceValue) ? previousCashBalanceValue : NaN;
    const reward = extractRewardAmount(data, previousCashBalance);
    const rewardAmount = reward.amount;

    if (data.cash_balance !== undefined) {
        PlayerDataStore.cash_balance = Number(data.cash_balance);
    }

    try {
        const updated: any = {};
        if (data.cash_balance !== undefined) {
            updated.cash_balance = data.cash_balance;
        }
        if (data.bubble_balance !== undefined) {
            updated.bubble_balance = data.bubble_balance;
        }
        if (data.user_level !== undefined) {
            updated.user_level = data.user_level;
        }
        if (data.hint_prop_count !== undefined) {
            updated.hint_prop_count = data.hint_prop_count;
        }
        if (data.guideline_prop_count !== undefined) {
            updated.guideline_prop_count = data.guideline_prop_count;
        }
        if (data.task_point_num !== undefined) {
            updated.task_point_num = data.task_point_num;
        }
        if (data.ltv_task_point_num !== undefined) {
            updated.ltv_task_point_num = data.ltv_task_point_num;
        }
        if (data.sign_in !== undefined) {
            updated.sign_in = data.sign_in;
        }
        if (rewardAmount !== null && rewardAmount > 0) {
            updated.cash_reward = rewardAmount;
        }

        const eventMgr: any = GlobalEventMgr.getInstance();
        eventMgr.emit(InterfaceMgr.gameEvent.userInfoUpdated, updated);

        if (rewardAmount !== null && rewardAmount > 0) {
            eventMgr.emit(InterfaceMgr.gameEvent.arrowRewardClaimed, {
                reward_amount: rewardAmount
            });
        }

        console.log(
            LOG_TAG +
                " _applyRewardResult: reward_source=" +
                reward.source +
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
                    double_reward: data.double_reward
                })
        );
    } catch (e) {
        console.warn(LOG_TAG + " _applyRewardResult: emit失败 " + e);
    }
}

const ArrowRewardService: ArrowRewardServiceContract = {
    claimNormal(options?: ClaimNormalOptions | boolean | null, callback?: RewardCallback | null): void {
        const normalized = normalizeClaimNormalOptions(options, callback);
        const done = typeof normalized.callback === "function" ? normalized.callback : null;
        const request = buildArrowRewardRequest(normalized);

        function retryClaimNormal(): void {
            console.log(LOG_TAG + " claimNormal: 调用领取接口 ehwqDl/CCDFGN payload=" + JSON.stringify(request));
            LoadingHttpService.claimArrowReward(
                request,
                Handler.create(null, function (res: any) {
                    const netErrorPopupService = getNetErrorPopupService();
                    if (netErrorPopupService && netErrorPopupService.shouldPop(res)) {
                        console.warn(LOG_TAG + " claimNormal force-retry code=" + (res && res.code));
                        netErrorPopupService.showAndRetry(retryClaimNormal);
                    } else if (res && res.data) {
                        console.log(LOG_TAG + " claimNormal 成功 data=" + JSON.stringify(res.data));
                        applyRewardResult(res.data);
                        if (done) {
                            done(true, res.data);
                        }
                    } else {
                        console.warn(LOG_TAG + " claimNormal 返回数据异常 res=" + JSON.stringify(res));
                        if (done) {
                            done(false, null);
                        }
                    }
                }),
                Handler.create(null, function (err: any) {
                    const netErrorPopupService = getNetErrorPopupService();
                    if (netErrorPopupService && netErrorPopupService.shouldPop(err)) {
                        console.warn(LOG_TAG + " claimNormal 网络异常，弹重试窗 err=" + JSON.stringify(err));
                        netErrorPopupService.showAndRetry(retryClaimNormal);
                    } else {
                        console.warn(LOG_TAG + " claimNormal 请求失败 err=" + JSON.stringify(err));
                        if (done) {
                            done(false, null);
                        }
                    }
                })
            );
        }

        function claimAdReward(forceType: boolean): void {
            const adManager: any = AdManager && AdManager.getInstance ? AdManager.getInstance() : null;
            const cpmData: any = adManager && adManager.cpm_data || {};
            const params: any = {
                video_type: request.business_type === "arrow" ? "big_red" : "task",
                task_id: cpmData.task_id || request.task_id || "",
                force_type: forceType ? "true" : "false",
                source: cpmData.source || "",
                unitId: cpmData.unitId || "",
                cpm: cpmData.cpm || 0,
                task_type: request.task_type,
                business_type: request.business_type
            };
            if (request.task_type) {
                params.task_type = request.task_type;
            }
            console.log(LOG_TAG + " claimNormal: 广告完成，调用广告奖励接口 /vNZlOY/KWcPza params=" + JSON.stringify(params));

            function retryClaimAdReward(): void {
                claimAdReward(forceType);
            }

            LoadingHttpService.claimArrowAdReward(
                params,
                Handler.create(null, function (res: any) {
                    const netErrorPopupService = getNetErrorPopupService();
                    if (netErrorPopupService && netErrorPopupService.shouldPop(res)) {
                        console.warn(LOG_TAG + " claimNormal(AdReward) force-retry code=" + (res && res.code));
                        netErrorPopupService.showAndRetry(retryClaimAdReward);
                    } else if (res && res.data) {
                        console.log(LOG_TAG + " claimNormal(AdReward) 成功 data=" + JSON.stringify(res.data));
                        applyRewardResult(res.data);
                        if (done) {
                            done(true, res.data);
                        }
                    } else {
                        console.warn(LOG_TAG + " claimNormal(AdReward) 返回数据异常 res=" + JSON.stringify(res));
                        if (done) {
                            done(false, null);
                        }
                    }
                }),
                Handler.create(null, function (err: any) {
                    const netErrorPopupService = getNetErrorPopupService();
                    if (netErrorPopupService && netErrorPopupService.shouldPop(err)) {
                        console.warn(LOG_TAG + " claimNormal(AdReward) 网络异常，弹重试窗 err=" + JSON.stringify(err));
                        netErrorPopupService.showAndRetry(retryClaimAdReward);
                    } else {
                        console.warn(LOG_TAG + " claimNormal(AdReward) 请求失败 err=" + JSON.stringify(err));
                        if (done) {
                            done(false, null);
                        }
                    }
                })
            );
        }

        if (normalized.showForceVideo) {
            console.log(LOG_TAG + " claimNormal: showForceVideo=true，先播广告");
            playRewardVideoAd(
                true,
                function () {
                    claimAdReward(true);
                },
                function () {
                    console.warn(LOG_TAG + " claimNormal: 广告失败，降级普通领取接口");
                    retryClaimNormal();
                }
            );
        } else {
            retryClaimNormal();
        }
    },

    claimDouble(options?: ClaimDoubleOptions | RewardCallback | null, callback?: RewardCallback | null): void {
        const normalized = normalizeClaimDoubleOptions(options, callback);
        const done = typeof normalized.callback === "function" ? normalized.callback : null;
        const request = buildArrowRewardRequest(normalized);

        console.log(LOG_TAG + " claimDouble: 开始播放广告");
        playRewardVideoAd(
            false,
            function () {
                const adManager: any = AdManager && AdManager.getInstance ? AdManager.getInstance() : null;
                const cpmData: any = adManager && adManager.cpm_data || {};
                const params: any = {
                    video_type: request.business_type === "arrow" ? "big_red" : "task",
                    task_id: cpmData.task_id || request.task_id || "",
                    force_type: "false",
                    source: cpmData.source || "",
                    unitId: cpmData.unitId || "",
                    cpm: cpmData.cpm || 0,
                    task_type: request.task_type,
                    business_type: request.business_type
                };
                if (request.task_type) {
                    params.task_type = request.task_type;
                }
                console.log(LOG_TAG + " claimDouble: 广告完成，调用翻倍接口 /vNZlOY/KWcPza params=" + JSON.stringify(params));

                function retryClaimDouble(): void {
                    LoadingHttpService.claimArrowAdReward(
                        params,
                        Handler.create(null, function (res: any) {
                            const netErrorPopupService = getNetErrorPopupService();
                            if (netErrorPopupService && netErrorPopupService.shouldPop(res)) {
                                netErrorPopupService.showAndRetry(retryClaimDouble);
                            } else if (res && res.data) {
                                applyRewardResult(res.data);
                                if (done) {
                                    done(true, res.data);
                                }
                            } else {
                                if (done) {
                                    done(false, null);
                                }
                            }
                        }),
                        Handler.create(null, function (err: any) {
                            const netErrorPopupService = getNetErrorPopupService();
                            if (netErrorPopupService && netErrorPopupService.shouldPop(err)) {
                                netErrorPopupService.showAndRetry(retryClaimDouble);
                            } else {
                                if (done) {
                                    done(false, null);
                                }
                            }
                        })
                    );
                }

                LoadingHttpService.claimArrowAdReward(
                    params,
                    Handler.create(null, function (res: any) {
                        const netErrorPopupService = getNetErrorPopupService();
                        if (netErrorPopupService && netErrorPopupService.shouldPop(res)) {
                            console.warn(LOG_TAG + " claimDouble force-retry code=" + (res && res.code));
                            netErrorPopupService.showAndRetry(retryClaimDouble);
                        } else if (res && res.data) {
                            console.log(LOG_TAG + " claimDouble 成功 data=" + JSON.stringify(res.data));
                            applyRewardResult(res.data);
                            if (done) {
                                done(true, res.data);
                            }
                        } else {
                            console.warn(LOG_TAG + " claimDouble 返回数据异常 res=" + JSON.stringify(res));
                            if (done) {
                                done(false, null);
                            }
                        }
                    }),
                    Handler.create(null, function (err: any) {
                        const netErrorPopupService = getNetErrorPopupService();
                        if (netErrorPopupService && netErrorPopupService.shouldPop(err)) {
                            console.warn(LOG_TAG + " claimDouble 网络异常，弹重试窗 err=" + JSON.stringify(err));
                            netErrorPopupService.showAndRetry(retryClaimDouble);
                        } else {
                            console.warn(LOG_TAG + " claimDouble 请求失败 err=" + JSON.stringify(err));
                            if (done) {
                                done(false, null);
                            }
                        }
                    })
                );
            },
            function () {
                if (normalized.fallbackOnAdFail !== false) {
                    console.warn(LOG_TAG + " claimDouble: 广告失败，降级为普通领取");
                    ArrowRewardService.claimNormal(
                        {
                            showForceVideo: false,
                            businessType: normalized.businessType,
                            taskType: normalized.taskType,
                            taskId: normalized.taskId
                        },
                        done
                    );
                } else {
                    console.warn(LOG_TAG + " claimDouble: 广告失败，不降级发奖");
                    if (done) {
                        done(false, null);
                    }
                }
            }
        );
    }
};

export default ArrowRewardService;