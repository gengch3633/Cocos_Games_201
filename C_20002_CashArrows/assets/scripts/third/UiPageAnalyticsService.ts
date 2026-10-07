import BusinessAnalyticsService from "./BusinessAnalyticsService";
import UIMgr from "./UIMgr";

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

interface PageSession {
    key: string;
    actPage: string;
    lastResumeTs: number;
    accumulatedMs: number;
}

let inited = false;
const stack: PageSession[] = [];

function now(): number {
    return Date.now();
}

function resolveActPage(key: string, node?: cc.Node): string {
    if (key && typeof key === "string") {
        const keys = Object.keys(PAGE_MAP);
        for (let i = 0; i < keys.length; i++) {
            const path = keys[i];
            if (key === path || key.indexOf(path) >= 0) {
                return PAGE_MAP[path];
            }
        }
    }
    return node && node.isValid && node.name ? node.name : key || " unknown ";
}

function report(event: string, data: any): void {
    try {
        if (BusinessAnalyticsService && typeof BusinessAnalyticsService.reportData === "function") {
            BusinessAnalyticsService.reportData(event, data);
        }
    } catch (error) {
        console.warn(LOG_PREFIX + " report error ", event, error);
    }
}

function pauseSession(session: PageSession, timestamp: number): void {
    if (session && session.lastResumeTs > 0) {
        session.accumulatedMs += Math.max(0, timestamp - session.lastResumeTs);
        session.lastResumeTs = 0;
    }
}

function resumeSession(session: PageSession, timestamp: number): void {
    if (session) {
        session.lastResumeTs = timestamp;
    }
}

function findSessionIndex(key: string): number {
    for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].key === key) {
            return i;
        }
    }
    return -1;
}

function trackEnterInternal(key: string, actPage: string): void {
    const timestamp = now();
    if (findSessionIndex(key) >= 0) {
        return;
    }
    if (stack.length > 0) {
        pauseSession(stack[stack.length - 1], timestamp);
    }
    stack.push({
        key,
        actPage,
        lastResumeTs: timestamp,
        accumulatedMs: 0
    });
    report(" b_entry_game_page ", { act_page: actPage });
}

function trackLeaveInternal(key: string, actPage?: string): void {
    const timestamp = now();
    const index = findSessionIndex(key);
    if (index < 0) {
        report(" b_leave_game_page ", {
            act_page: actPage || key || " unknown ",
            duration: 0
        });
        return;
    }
    const session = stack[index];
    const isTop = index === stack.length - 1;
    if (isTop) {
        pauseSession(session, timestamp);
    }
    stack.splice(index, 1);
    report(" b_leave_game_page ", {
        act_page: session.actPage,
        duration: session.accumulatedMs
    });
    if (isTop && stack.length > 0) {
        resumeSession(stack[stack.length - 1], timestamp);
    }
}

function onUiShow(key: string, node: cc.Node): void {
    if (key) {
        trackEnterInternal(key, resolveActPage(key, node));
    }
}

function onUiHide(key: string, node: cc.Node): void {
    if (key) {
        trackLeaveInternal(key, resolveActPage(key, node));
    }
}

const UiPageAnalyticsService = {
    init(): void {
        if (inited) {
            return;
        }
        const uiMgr = UIMgr.getInstance();
        const eventType = UIMgr.EventType;
        if (uiMgr && eventType) {
            inited = true;
            uiMgr.on(eventType.SHOW, (key: string, node: cc.Node) => {
                try {
                    onUiShow(key, node);
                } catch (error) {
                    console.warn(LOG_PREFIX + " onUiShow error ", key, error);
                }
            });
            uiMgr.on(eventType.HIDE, (key: string, node: cc.Node) => {
                try {
                    onUiHide(key, node);
                } catch (error) {
                    console.warn(LOG_PREFIX + " onUiHide error ", key, error);
                }
            });
            console.log(LOG_PREFIX + " inited ");
        } else {
            console.warn(LOG_PREFIX + " init skipped: UIMgr instance or EventType missing ");
        }
    },

    trackEnter(key: string): void {
        if (key) {
            trackEnterInternal(key, key);
        }
    },

    trackLeave(key: string): void {
        if (key) {
            trackLeaveInternal(key, key);
        }
    },

    _debugSnapshot(): Array<{ key: string; actPage: string; isRunning: boolean; accumulatedMs: number }> {
        return stack.map((session) => ({
            key: session.key,
            actPage: session.actPage,
            isRunning: session.lastResumeTs > 0,
            accumulatedMs: session.accumulatedMs
        }));
    }
};

export default UiPageAnalyticsService;
