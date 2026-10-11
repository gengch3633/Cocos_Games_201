import AdManager from "./AdManager";
import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import InterfaceMgr from "./InterfaceMgr";
import LoadingHttpService from "./LoadingHttpService";
import NetErrorPopupService from "./NetErrorPopupService";
import PlayerDataStore from "./PlayerDataStore";

const LOG = "[ArrowReward]";

function getNetErrorPopupService(): any {
    return NetErrorPopupService || null;
}

function normalizeTaskType(taskType: any): string {
    return "ltv" === String(taskType || "").toLowerCase() ? "ltv" : "";
}

function buildBusinessPayload(options: any): any {
    const payload: any = {
        business_type: "task" === String(options && options.businessType || "").toLowerCase() ? "task" : "arrow"
    };
    const taskType = normalizeTaskType(options && options.taskType);
    const taskId = String(options && (options.taskId || "") || "");
    if ("task" === payload.business_type) {
        if ("ltv" === taskType) {
            payload.task_type = "ltv";
        }
        if (taskId) {
            payload.task_id = taskId;
        }
    }
    return payload;
}

function parseAmount(value: any): number | null {
    if (null == value) {
        return null;
    }
    let raw = value;
    if ("string" == typeof raw) {
        raw = raw.replace(/,/g, "").trim();
        if (!raw.length) {
            return null;
        }
    }
    const result = Number(raw);
    return isFinite(result) ? Math.max(0, Math.floor(result)) : null;
}

function extractRewardAmount(data: any, previousBalance: any): { amount: number | null, source: string } {
    const source = data || {};
    const fields = ["cash_reward", "reward_amount", "ad_reward_amount", "double_reward", "switch_reward", "task_reward", "reward"];
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const amount = parseAmount(source[field]);
        if (null !== amount && amount > 0) {
            return {
                amount: amount,
                source: field
            };
        }
    }
    const balance = Number(source.cash_balance);
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

function normalizeClaimNormalOptions(options: any, callback: any): any {
    return options && "object" == typeof options ? {
        showForceVideo: !!options.showForceVideo,
        businessType: options.businessType || options.business_type || "arrow",
        taskType: options.taskType || options.task_type || "",
        taskId: options.taskId || options.task_id || "",
        callback: callback || options.callback
    } : {
        showForceVideo: !!options,
        businessType: "arrow",
        taskType: "",
        taskId: "",
        callback: callback
    };
}

function normalizeClaimDoubleOptions(options: any, callback: any): any {
    return "function" == typeof options ? {
        businessType: "arrow",
        taskType: "",
        taskId: "",
        fallbackOnAdFail: true,
        callback: options
    } : {
        businessType: (options = options || {}).businessType || options.business_type || "arrow",
        taskType: options.taskType || options.task_type || "",
        taskId: options.taskId || options.task_id || "",
        fallbackOnAdFail: false !== options.fallbackOnAdFail,
        callback: callback || options.callback
    };
}

function playAd(forceVideo: any, success: any, fail: any): void {
    if ("function" == typeof forceVideo) {
        fail = success;
        success = forceVideo;
        forceVideo = false;
    }
    const manager = AdManager && AdManager.getInstance ? AdManager.getInstance() : null;
    if (manager && "function" == typeof manager.playNormalVideoAd) {
        manager.playNormalVideoAd({
            ad_type: "reward_video",
            force_video: !!forceVideo
        }, function (): void {
            console.log(LOG + " _playAd: 广告播放完成 force_video=" + !!forceVideo);
            if (success) {
                success();
            }
        }, function (err: any): void {
            console.warn(LOG + " _playAd: 广告失败 err=" + JSON.stringify(err));
            if (fail) {
                fail(err);
            }
        }, "激励视频播放失败，请重试");
    } else {
        console.warn(LOG + " _playAd: 无广告SDK，视为广告失败");
        if (fail) {
            fail({
                message: "ad_unavailable"
            });
        }
    }
}

function applyRewardResult(data: any): void {
    if (data) {
        let previousBalance = Number(PlayerDataStore.cash_balance);
        if (!isFinite(previousBalance)) {
            previousBalance = NaN;
        }
        const reward = extractRewardAmount(data, previousBalance);
        const rewardAmount = reward.amount;
        if (undefined !== data.cash_balance) {
            PlayerDataStore.cash_balance = Number(data.cash_balance);
        }
        try {
            const updateData: any = {};
            if (undefined !== data.cash_balance) {
                updateData.cash_balance = data.cash_balance;
            }
            if (undefined !== data.bubble_balance) {
                updateData.bubble_balance = data.bubble_balance;
            }
            if (undefined !== data.user_level) {
                updateData.user_level = data.user_level;
            }
            if (undefined !== data.hint_prop_count) {
                updateData.hint_prop_count = data.hint_prop_count;
            }
            if (undefined !== data.guideline_prop_count) {
                updateData.guideline_prop_count = data.guideline_prop_count;
            }
            if (undefined !== data.task_point_num) {
                updateData.task_point_num = data.task_point_num;
            }
            if (undefined !== data.ltv_task_point_num) {
                updateData.ltv_task_point_num = data.ltv_task_point_num;
            }
            if (undefined !== data.sign_in) {
                updateData.sign_in = data.sign_in;
            }
            if (null !== rewardAmount && rewardAmount > 0) {
                updateData.cash_reward = rewardAmount;
            }
            GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.userInfoUpdated, updateData);
            if (null !== rewardAmount && rewardAmount > 0) {
                GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.arrowRewardClaimed, {
                    reward_amount: rewardAmount
                });
            }
            console.log(LOG + " _applyRewardResult: reward_source=" + reward.source + " reward_amount=" + rewardAmount + " cash_balance=" + data.cash_balance + " bubble_balance=" + data.bubble_balance + " raw=" + JSON.stringify({
                cash_reward: data.cash_reward,
                reward_amount: data.reward_amount,
                ad_reward_amount: data.ad_reward_amount,
                switch_reward: data.switch_reward,
                double_reward: data.double_reward
            }));
        } catch (e) {
            console.warn(LOG + " _applyRewardResult: emit失败 " + e);
        }
    }
}

const ArrowRewardService = {
    claimNormal: function (options: any, callback: any): void {
        const config = normalizeClaimNormalOptions(options, callback);
        const cb = "function" == typeof config.callback ? config.callback : null;
        const payload = buildBusinessPayload(config);
        function claim(): void {
            console.log(LOG + " claimNormal: 调用领取接口 ehwqDl/CCDFGN payload=" + JSON.stringify(payload));
            LoadingHttpService.claimArrowReward(payload, Handler.create(null, function (res: any): void {
                const popup = getNetErrorPopupService();
                if (popup && popup.shouldPop(res)) {
                    console.warn(LOG + " claimNormal force-retry code=" + (res && res.code));
                    popup.showAndRetry(claim);
                } else if (res && res.data) {
                    console.log(LOG + " claimNormal 成功 data=" + JSON.stringify(res.data));
                    applyRewardResult(res.data);
                    if (cb) {
                        cb(true, res.data);
                    }
                } else {
                    console.warn(LOG + " claimNormal 返回数据异常 res=" + JSON.stringify(res));
                    if (cb) {
                        cb(false, null);
                    }
                }
            }), Handler.create(null, function (err: any): void {
                const popup = getNetErrorPopupService();
                if (popup && popup.shouldPop(err)) {
                    console.warn(LOG + " claimNormal 网络异常，弹重试窗 err=" + JSON.stringify(err));
                    popup.showAndRetry(claim);
                } else {
                    console.warn(LOG + " claimNormal 请求失败 err=" + JSON.stringify(err));
                    if (cb) {
                        cb(false, null);
                    }
                }
            }));
        }
        function claimByAd(forceVideo: boolean): void {
            const manager = AdManager && AdManager.getInstance ? AdManager.getInstance() : null;
            const cpmData = manager && manager.cpm_data || {};
            const params: any = {
                video_type: "arrow" === payload.business_type ? "big_red" : "task",
                task_id: cpmData.task_id || payload.task_id || "",
                force_type: forceVideo ? "true" : "false",
                source: cpmData.source || "",
                unitId: cpmData.unitId || "",
                cpm: cpmData.cpm || 0,
                task_type: payload.task_type,
                business_type: payload.business_type
            };
            if (payload.task_type) {
                params.task_type = payload.task_type;
            }
            console.log(LOG + " claimNormal: 广告完成，调用广告奖励接口 /vNZlOY/KWcPza params=" + JSON.stringify(params));
            const retry = function (): void {
                claimByAd(forceVideo);
            };
            LoadingHttpService.claimArrowAdReward(params, Handler.create(null, function (res: any): void {
                const popup = getNetErrorPopupService();
                if (popup && popup.shouldPop(res)) {
                    console.warn(LOG + " claimNormal(AdReward) force-retry code=" + (res && res.code));
                    popup.showAndRetry(retry);
                } else if (res && res.data) {
                    console.log(LOG + " claimNormal(AdReward) 成功 data=" + JSON.stringify(res.data));
                    applyRewardResult(res.data);
                    if (cb) {
                        cb(true, res.data);
                    }
                } else {
                    console.warn(LOG + " claimNormal(AdReward) 返回数据异常 res=" + JSON.stringify(res));
                    if (cb) {
                        cb(false, null);
                    }
                }
            }), Handler.create(null, function (err: any): void {
                const popup = getNetErrorPopupService();
                if (popup && popup.shouldPop(err)) {
                    console.warn(LOG + " claimNormal(AdReward) 网络异常，弹重试窗 err=" + JSON.stringify(err));
                    popup.showAndRetry(retry);
                } else {
                    console.warn(LOG + " claimNormal(AdReward) 请求失败 err=" + JSON.stringify(err));
                    if (cb) {
                        cb(false, null);
                    }
                }
            }));
        }
        if (config.showForceVideo) {
            console.log(LOG + " claimNormal: showForceVideo=true，先播广告");
            playAd(true, function (): void {
                claimByAd(true);
            }, function (): void {
                console.warn(LOG + " claimNormal: 广告失败，降级普通领取接口");
                claim();
            });
        } else {
            claim();
        }
    },
    claimDouble: function (options: any, callback: any): void {
        const config = normalizeClaimDoubleOptions(options, callback);
        const cb = "function" == typeof config.callback ? config.callback : null;
        const payload = buildBusinessPayload(config);
        console.log(LOG + " claimDouble: 开始播放广告");
        playAd(false, function (): void {
            const manager = AdManager && AdManager.getInstance ? AdManager.getInstance() : null;
            const cpmData = manager && manager.cpm_data || {};
            const params: any = {
                video_type: "arrow" === payload.business_type ? "big_red" : "task",
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
            console.log(LOG + " claimDouble: 广告完成，调用翻倍接口 /vNZlOY/KWcPza params=" + JSON.stringify(params));
            const retry = function retry(): void {
                LoadingHttpService.claimArrowAdReward(params, Handler.create(null, function (res: any): void {
                    const popup = getNetErrorPopupService();
                    if (popup && popup.shouldPop(res)) {
                        popup.showAndRetry(retry);
                    } else if (res && res.data) {
                        applyRewardResult(res.data);
                        if (cb) {
                            cb(true, res.data);
                        }
                    } else if (cb) {
                        cb(false, null);
                    }
                }), Handler.create(null, function (err: any): void {
                    const popup = getNetErrorPopupService();
                    if (popup && popup.shouldPop(err)) {
                        popup.showAndRetry(retry);
                    } else if (cb) {
                        cb(false, null);
                    }
                }));
            };
            LoadingHttpService.claimArrowAdReward(params, Handler.create(null, function (res: any): void {
                const popup = getNetErrorPopupService();
                if (popup && popup.shouldPop(res)) {
                    console.warn(LOG + " claimDouble force-retry code=" + (res && res.code));
                    popup.showAndRetry(retry);
                } else if (res && res.data) {
                    console.log(LOG + " claimDouble 成功 data=" + JSON.stringify(res.data));
                    applyRewardResult(res.data);
                    if (cb) {
                        cb(true, res.data);
                    }
                } else {
                    console.warn(LOG + " claimDouble 返回数据异常 res=" + JSON.stringify(res));
                    if (cb) {
                        cb(false, null);
                    }
                }
            }), Handler.create(null, function (err: any): void {
                const popup = getNetErrorPopupService();
                if (popup && popup.shouldPop(err)) {
                    console.warn(LOG + " claimDouble 网络异常，弹重试窗 err=" + JSON.stringify(err));
                    popup.showAndRetry(retry);
                } else {
                    console.warn(LOG + " claimDouble 请求失败 err=" + JSON.stringify(err));
                    if (cb) {
                        cb(false, null);
                    }
                }
            }));
        }, function (): void {
            if (false !== config.fallbackOnAdFail) {
                console.warn(LOG + " claimDouble: 广告失败，降级为普通领取");
                ArrowRewardService.claimNormal({
                    showForceVideo: false,
                    businessType: config.businessType,
                    taskType: config.taskType,
                    taskId: config.taskId
                }, cb);
            } else {
                console.warn(LOG + " claimDouble: 广告失败，不降级发奖");
                if (cb) {
                    cb(false, null);
                }
            }
        });
    }
};

export default ArrowRewardService;