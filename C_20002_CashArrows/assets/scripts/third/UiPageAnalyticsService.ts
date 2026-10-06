import UIMgr from "./UIMgr";
import BusinessAnalyticsService from "./BusinessAnalyticsService";

const LOG_PREFIX = "[UiPageAnalyticsService] ";
const PAGE_MAP: Record<string, string> = {
    " prefab/ ui/ homeUI ": " home_page ",
    " prefab/ gameView ": " game_page ",
    " prefab/ cashArrowReviveView ": " revive_page ",
    " prefab/ withMoodView_v2 ": " withdraw_page ",
    " prefab/ arrowTaskPopup ": " task_page ",
    " prefab/ cashArrowSetView ": " withdraw_set_page ",
    " prefab/ cashArrowSettingView ": " withdraw_setting_page ",
    " prefab/ cashArrowCheckView ": " withdraw_check_page ",
    " prefab/ arrowSettleRewardView ": " settle_reward_page ",
    " prefab/ cashArrowFailView ": " fail_page "
};
let inited = false;
const stack: any[] = [];

function now() {
    return Date.now();
}

function resolvePageName(e: string, t: cc.Node | null) {
    if (e && " string " == typeof e) for (var i = Object.keys(PAGE_MAP), n = 0; n < i.length; n++) {
        var a = i[n];
        if (e === a || e.indexOf(a) >= 0) return PAGE_MAP[a];
    }
    return t && t.isValid && t.name ? t.name : e || " unknown ";
}

function report(e: string, t: any) {
    try {
        var i = BusinessAnalyticsService;
        i && " function " == typeof i.reportData && i.reportData(e, t);
    } catch (t) {
        console.warn(LOG_PREFIX + " report error ", e, t);
    }
}

function pauseAccumulation(e: any, t: number) {
    if (e && !(e.lastResumeTs <= 0)) {
        e.accumulatedMs += Math.max(0, t - e.lastResumeTs);
        e.lastResumeTs = 0;
    }
}

function resumeAccumulation(e: any, t: number) {
    e && (e.lastResumeTs = t);
}

function findStackIndex(e: string) {
    for (var t = stack.length - 1; t >= 0; t--) if (stack[t].key === e) return t;
    return -1;
}

function trackEnterInternal(e: string, t: string) {
    var i = now();
    if (!(findStackIndex(e) >= 0)) {
        stack.length > 0 && pauseAccumulation(stack[stack.length - 1], i);
        stack.push({
            key: e,
            actPage: t,
            lastResumeTs: i,
            accumulatedMs: 0
        });
        report(" b_entry_game_page ", {
            act_page: t
        });
    }
}

function trackLeaveInternal(e: string, t: string) {
    var i = now(), n = findStackIndex(e);
    if (n < 0) report(" b_leave_game_page ", {
        act_page: t || e || " unknown ",
        duration: 0
    }); else {
        var a = stack[n], o = n === stack.length - 1;
        o && pauseAccumulation(a, i);
        stack.splice(n, 1);
        report(" b_leave_game_page ", {
            act_page: a.actPage,
            duration: a.accumulatedMs
        });
        o && stack.length > 0 && resumeAccumulation(stack[stack.length - 1], i);
    }
}

function onUiShow(e: string, t: cc.Node) {
    e && trackEnterInternal(e, resolvePageName(e, t));
}

function onUiHide(e: string, t: cc.Node) {
    e && trackLeaveInternal(e, resolvePageName(e, t));
}

const UiPageAnalyticsService = {
    init: function() {
        if (!inited) {
            var e = UIMgr;
            if (e && e.getInstance) {
                var t = e.getInstance(), i = e.EventType;
                if (t && i) {
                    inited = true;
                    t.on(i.SHOW, function(e: string, t: cc.Node) {
                        try {
                            onUiShow(e, t);
                        } catch (t) {
                            console.warn(LOG_PREFIX + " onUiShow error ", e, t);
                        }
                    });
                    t.on(i.HIDE, function(e: string, t: cc.Node) {
                        try {
                            onUiHide(e, t);
                        } catch (t) {
                            console.warn(LOG_PREFIX + " onUiHide error ", e, t);
                        }
                    });
                    console.log(LOG_PREFIX + " inited ");
                } else console.warn(LOG_PREFIX + " init skipped: UIMgr instance or EventType missing ");
            } else console.warn(LOG_PREFIX + " init skipped: UIMgr unavailable ");
        }
    },
    trackEnter: function(e: string) {
        e && trackEnterInternal(e, e);
    },
    trackLeave: function(e: string) {
        e && trackLeaveInternal(e, e);
    },
    _debugSnapshot: function() {
        return stack.map(function(e) {
            return {
                key: e.key,
                actPage: e.actPage,
                isRunning: e.lastResumeTs > 0,
                accumulatedMs: e.accumulatedMs
            };
        });
    }
};

export default UiPageAnalyticsService;
