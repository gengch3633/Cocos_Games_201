import LoadingHttpService from "./LoadingHttpService";
import Handler from "./Handler";
import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import AdManager from "./AdManager";
import PlayerDataStore from "./PlayerDataStore";
import NetErrorPopupService from "./NetErrorPopupService";

const LOG_TAG = "[ArrowReward] ";

function getNetErrorPopupService() {
    return NetErrorPopupService;
}

function normalizeTaskType(e: any) {
    return " ltv " === String(e || " ").toLowerCase() ? " ltv " : " ";
}

function buildPayload(e: any) {
    var t, i: any = {
        business_type: (t = e && e.businessType, " task " === String(t || " ").toLowerCase() ? " task " : " arrow ")
    }, n = normalizeTaskType(e && e.taskType), a = String(e && (e.taskId || " ") || " ");
    if (" task " === i.business_type) {
        " ltv " === n && (i.task_type = " ltv ");
        a && (i.task_id = a);
    }
    return i;
}

function parseRewardAmount(e: any) {
    if (null == e) return null;
    var t = e;
    if ("string" == typeof t && !(t = t.replace(/,/g, " ").trim()).length) return null;
    var i = Number(t);
    return isFinite(i) ? Math.max(0, Math.floor(i)) : null;
}

function extractReward(e: any, t: any) {
    for (var i = e || {}, n = [ " cash_reward ", " reward_amount ", " ad_reward_amount ", " double_reward ", " switch_reward ", " task_reward ", " reward " ], a = 0; a < n.length; a++) {
        var o = n[a], r = parseRewardAmount(i[o]);
        if (null !== r && r > 0) return {
            amount: r,
            source: o
        };
    }
    var s = Number(i.cash_balance);
    if (isFinite(s) && isFinite(t)) {
        var l = Math.floor(s - t);
        if (l >= 0) return {
            amount: l,
            source: " cash_balance_delta "
        };
    }
    return {
        amount: null,
        source: " none "
    };
}

function normalizeClaimNormalOptions(e: any, t: any) {
    return e && "object" == typeof e ? {
        showForceVideo: !!e.showForceVideo,
        businessType: e.businessType || e.business_type || " arrow ",
        taskType: e.taskType || e.task_type || " ",
        taskId: e.taskId || e.task_id || " ",
        callback: t || e.callback
    } : {
        showForceVideo: !!e,
        businessType: " arrow ",
        taskType: " ",
        taskId: " ",
        callback: t
    };
}

function normalizeClaimDoubleOptions(e: any, t: any) {
    return "function" == typeof e ? {
        businessType: " arrow ",
        taskType: " ",
        taskId: " ",
        fallbackOnAdFail: !0,
        callback: e
    } : {
        businessType: (e = e || {}).businessType || e.business_type || " arrow ",
        taskType: e.taskType || e.task_type || " ",
        taskId: e.taskId || e.task_id || " ",
        fallbackOnAdFail: !1 !== e.fallbackOnAdFail,
        callback: t || e.callback
    };
}

function playAd(e: any, t: any, i: any) {
    if ("function" == typeof e) {
        i = t;
        t = e;
        e = !1;
    }
    var n = AdManager && AdManager.getInstance ? AdManager.getInstance() : null;
    if (n && "function" == typeof n.playNormalVideoAd) n.playNormalVideoAd({
        ad_type: " reward_video ",
        force_video: !!e
    }, function () {
        console.log(LOG_TAG + " _playAd: 广告播放完成 force_video = " + !!e);
        t && t();
    }, function (e: any) {
        console.warn(LOG_TAG + " _playAd: 广告失败 err = " + JSON.stringify(e));
        i && i(e);
    }, " 激励视频播放失败 ， 请重试 "); else {
        console.warn(LOG_TAG + " _playAd: 无广告SDK ， 视为广告失败 ");
        i && i({
            message: " ad_unavailable "
        });
    }
}

function applyRewardResult(e: any) {
    if (e) {
        var t = Number(PlayerDataStore.cash_balance);
        isFinite(t) || (t = NaN);
        var i = extractReward(e, t), n = i.amount;
        void 0 !== e.cash_balance && (PlayerDataStore.cash_balance = Number(e.cash_balance));
        try {
            var a: any = {};
            void 0 !== e.cash_balance && (a.cash_balance = e.cash_balance);
            void 0 !== e.bubble_balance && (a.bubble_balance = e.bubble_balance);
            void 0 !== e.user_level && (a.user_level = e.user_level);
            void 0 !== e.hint_prop_count && (a.hint_prop_count = e.hint_prop_count);
            void 0 !== e.guideline_prop_count && (a.guideline_prop_count = e.guideline_prop_count);
            void 0 !== e.task_point_num && (a.task_point_num = e.task_point_num);
            void 0 !== e.ltv_task_point_num && (a.ltv_task_point_num = e.ltv_task_point_num);
            void 0 !== e.sign_in && (a.sign_in = e.sign_in);
            null !== n && n > 0 && (a.cash_reward = n);
            GlobalEventMgr.getInstance().emit(gameEvent.userInfoUpdated, a);
            null !== n && n > 0 && GlobalEventMgr.getInstance().emit(gameEvent.arrowRewardClaimed, {
                reward_amount: n
            });
            console.log(LOG_TAG + " _applyRewardResult: reward_source = " + i.source + " reward_amount = " + n + " cash_balance = " + e.cash_balance + " bubble_balance = " + e.bubble_balance + " raw = " + JSON.stringify({
                cash_reward: e.cash_reward,
                reward_amount: e.reward_amount,
                ad_reward_amount: e.ad_reward_amount,
                switch_reward: e.switch_reward,
                double_reward: e.double_reward
            }));
        } catch (e) {
            console.warn(LOG_TAG + " _applyRewardResult: emit失败 " + e);
        }
    }
}

const ArrowRewardService = {
    claimNormal: function (e: any, t: any) {
        var i = normalizeClaimNormalOptions(e, t), o = "function" == typeof i.callback ? i.callback : null, r = buildPayload(i);
        function l() {
            console.log(LOG_TAG + " claimNormal: 调用领取接口 ehwqDl/ CCDFGN payload = " + JSON.stringify(r));
            LoadingHttpService.claimArrowReward(r, Handler.create(null, function (e: any) {
                var t = getNetErrorPopupService();
                if (t && t.shouldPop(e)) {
                    console.warn(LOG_TAG + " claimNormal force- retry code = " + (e && e.code));
                    t.showAndRetry(l);
                } else if (e && e.data) {
                    console.log(LOG_TAG + " claimNormal 成功 data = " + JSON.stringify(e.data));
                    applyRewardResult(e.data);
                    o && o(!0, e.data);
                } else {
                    console.warn(LOG_TAG + " claimNormal 返回数据异常 res = " + JSON.stringify(e));
                    o && o(!1, null);
                }
            }), Handler.create(null, function (e: any) {
                var t = getNetErrorPopupService();
                if (t && t.shouldPop(e)) {
                    console.warn(LOG_TAG + " claimNormal 网络异常 ， 弹重试窗 err = " + JSON.stringify(e));
                    t.showAndRetry(l);
                } else {
                    console.warn(LOG_TAG + " claimNormal 请求失败 err = " + JSON.stringify(e));
                    o && o(!1, null);
                }
            }));
        }
        function c(e: any) {
            var t = AdManager && AdManager.getInstance ? AdManager.getInstance() : null, i = t && t.cpm_data || {}, l = {
                video_type: " arrow " === r.business_type ? " big_red " : " task ",
                task_id: i.task_id || r.task_id || " ",
                force_type: e ? " true " : " false ",
                source: i.source || " ",
                unitId: i.unitId || " ",
                cpm: i.cpm || 0,
                task_type: r.task_type,
                business_type: r.business_type
            };
            r.task_type && (l.task_type = r.task_type);
            console.log(LOG_TAG + " claimNormal: 广告完成 ， 调用广告奖励接口/ vNZlOY/ KWcPza params = " + JSON.stringify(l));
            var h = function () {
                c(e);
            };
            LoadingHttpService.claimArrowAdReward(l, Handler.create(null, function (e: any) {
                var t = getNetErrorPopupService();
                if (t && t.shouldPop(e)) {
                    console.warn(LOG_TAG + " claimNormal(AdReward) force- retry code = " + (e && e.code));
                    t.showAndRetry(h);
                } else if (e && e.data) {
                    console.log(LOG_TAG + " claimNormal(AdReward) 成功 data = " + JSON.stringify(e.data));
                    applyRewardResult(e.data);
                    o && o(!0, e.data);
                } else {
                    console.warn(LOG_TAG + " claimNormal(AdReward) 返回数据异常 res = " + JSON.stringify(e));
                    o && o(!1, null);
                }
            }), Handler.create(null, function (e: any) {
                var t = getNetErrorPopupService();
                if (t && t.shouldPop(e)) {
                    console.warn(LOG_TAG + " claimNormal(AdReward) 网络异常 ， 弹重试窗 err = " + JSON.stringify(e));
                    t.showAndRetry(h);
                } else {
                    console.warn(LOG_TAG + " claimNormal(AdReward) 请求失败 err = " + JSON.stringify(e));
                    o && o(!1, null);
                }
            }));
        }
        if (i.showForceVideo) {
            console.log(LOG_TAG + " claimNormal: showForceVideo = true ， 先播广告 ");
            playAd(!0, function () {
                c(!0);
            }, function () {
                console.warn(LOG_TAG + " claimNormal: 广告失败 ， 降级普通领取接口 ");
                l();
            });
        } else l();
    },
    claimDouble: function (e: any, t: any) {
        var i = normalizeClaimDoubleOptions(e, t), o = "function" == typeof i.callback ? i.callback : null, r = buildPayload(i);
        console.log(LOG_TAG + " claimDouble: 开始播放广告 ");
        playAd(!1, function () {
            var e = AdManager && AdManager.getInstance ? AdManager.getInstance() : null, t = e && e.cpm_data || {}, i = {
                video_type: " arrow " === r.business_type ? " big_red " : " task ",
                task_id: t.task_id || r.task_id || " ",
                force_type: " false ",
                source: t.source || " ",
                unitId: t.unitId || " ",
                cpm: t.cpm || 0,
                task_type: r.task_type,
                business_type: r.business_type
            };
            r.task_type && (i.task_type = r.task_type);
            console.log(LOG_TAG + " claimDouble: 广告完成 ， 调用翻倍接口/ vNZlOY/ KWcPza params = " + JSON.stringify(i));
            var l = function claimDoubleRetry() {
                LoadingHttpService.claimArrowAdReward(i, Handler.create(null, function (t: any) {
                    var n = getNetErrorPopupService();
                    if (n && n.shouldPop(t)) n.showAndRetry(claimDoubleRetry); else if (t && t.data) {
                        applyRewardResult(t.data);
                        o && o(!0, t.data);
                    } else o && o(!1, null);
                }), Handler.create(null, function (t: any) {
                    var n = getNetErrorPopupService();
                    n && n.shouldPop(t) ? n.showAndRetry(claimDoubleRetry) : o && o(!1, null);
                }));
            };
            LoadingHttpService.claimArrowAdReward(i, Handler.create(null, function (e: any) {
                var t = getNetErrorPopupService();
                if (t && t.shouldPop(e)) {
                    console.warn(LOG_TAG + " claimDouble force- retry code = " + (e && e.code));
                    t.showAndRetry(l);
                } else if (e && e.data) {
                    console.log(LOG_TAG + " claimDouble 成功 data = " + JSON.stringify(e.data));
                    applyRewardResult(e.data);
                    o && o(!0, e.data);
                } else {
                    console.warn(LOG_TAG + " claimDouble 返回数据异常 res = " + JSON.stringify(e));
                    o && o(!1, null);
                }
            }), Handler.create(null, function (e: any) {
                var t = getNetErrorPopupService();
                if (t && t.shouldPop(e)) {
                    console.warn(LOG_TAG + " claimDouble 网络异常 ， 弹重试窗 err = " + JSON.stringify(e));
                    t.showAndRetry(l);
                } else {
                    console.warn(LOG_TAG + " claimDouble 请求失败 err = " + JSON.stringify(e));
                    o && o(!1, null);
                }
            }));
        }, function () {
            if (!1 !== i.fallbackOnAdFail) {
                console.warn(LOG_TAG + " claimDouble: 广告失败 ， 降级为普通领取 ");
                ArrowRewardService.claimNormal({
                    showForceVideo: !1,
                    businessType: i.businessType,
                    taskType: i.taskType,
                    taskId: i.taskId
                }, o);
            } else {
                console.warn(LOG_TAG + " claimDouble: 广告失败 ， 不降级发奖 ");
                o && o(!1, null);
            }
        });
    }
};

export default ArrowRewardService;
