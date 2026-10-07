import BusinessAnalyticsService from "./BusinessAnalyticsService";
import UIMgr from "./UIMgr";

const LOG_TAG = "[UiPageAnalyticsService]";

const PAGE_MAP: { [key: string]: string } = {
    "prefab/ui/homeUI": "home_page",
    "prefab/gameView": "game_page",
    "prefab/cashArrowReviveView": "revive_page",
    "prefab/withMoodView_v2": "withdraw_page",
    "prefab/arrowTaskPopup": "task_page",
    "prefab/cashArrowSetView": "withdraw_set_page",
    "prefab/cashArrowSettingView": "withdraw_setting_page",
    "prefab/cashArrowCheckView": "withdraw_check_page",
    "prefab/arrowSettleRewardView": "settle_reward_page",
    "prefab/cashArrowFailView": "fail_page",
};

let initialized = false;
const pageStack: Array<{
    key: string;
    actPage: string;
    lastResumeTs: number;
    accumulatedMs: number;
}> = [];

function nowMs(): number {
    return Date.now();
}

function resolvePageName(key: string, node?: cc.Node | null): string {
    if (key && typeof key === "string") {
        const keys = Object.keys(PAGE_MAP);
        for (let i = 0; i < keys.length; i++) {
            const path = keys[i];
            if (key === path || key.indexOf(path) >= 0) {
                return PAGE_MAP[path];
            }
        }
    }
    if (node && node.isValid && node.name) {
        return node.name;
    }
    return key || "unknown";
}

function report(event: string, data?: any): void {
    try {
        BusinessAnalyticsService.reportData(event, data);
    } catch (error) {
        console.warn(LOG_TAG + " report error", event, error);
    }
}

function pauseEntry(entry: { lastResumeTs: number; accumulatedMs: number }, now: number): void {
    if (entry && entry.lastResumeTs > 0) {
        entry.accumulatedMs += Math.max(0, now - entry.lastResumeTs);
        entry.lastResumeTs = 0;
    }
}

function resumeEntry(entry: { lastResumeTs: number }, now: number): void {
    if (entry) {
        entry.lastResumeTs = now;
    }
}

function findStackIndex(key: string): number {
    for (let i = pageStack.length - 1; i >= 0; i--) {
        if (pageStack[i].key === key) {
            return i;
        }
    }
    return -1;
}

function trackEnterInternal(key: string, actPage: string): void {
    const now = nowMs();
    if (findStackIndex(key) >= 0) {
        return;
    }
    if (pageStack.length > 0) {
        pauseEntry(pageStack[pageStack.length - 1], now);
    }
    pageStack.push({
        key,
        actPage,
        lastResumeTs: now,
        accumulatedMs: 0,
    });
    report("b_entry_game_page", {
        act_page: actPage,
    });
}

function trackLeaveInternal(key: string, actPage?: string): void {
    const now = nowMs();
    const index = findStackIndex(key);
    if (index < 0) {
        report("b_leave_game_page", {
            act_page: actPage || key || "unknown",
            duration: 0,
        });
        return;
    }
    const entry = pageStack[index];
    const isTop = index === pageStack.length - 1;
    if (isTop) {
        pauseEntry(entry, now);
    }
    pageStack.splice(index, 1);
    report("b_leave_game_page", {
        act_page: entry.actPage,
        duration: entry.accumulatedMs,
    });
    if (isTop && pageStack.length > 0) {
        resumeEntry(pageStack[pageStack.length - 1], now);
    }
}

function onUiShow(key: string, node?: cc.Node | null): void {
    if (key) {
        trackEnterInternal(key, resolvePageName(key, node));
    }
}

function onUiHide(key: string, node?: cc.Node | null): void {
    if (key) {
        trackLeaveInternal(key, resolvePageName(key, node));
    }
}

const UiPageAnalyticsService = {
    init(): void {
        if (initialized) {
            return;
        }
        const uiMgr = UIMgr.getInstance();
        const eventType = UIMgr.EventType;
        if (uiMgr && eventType) {
            initialized = true;
            uiMgr.on(eventType.SHOW, (key: string, node: cc.Node) => {
                try {
                    onUiShow(key, node);
                } catch (error) {
                    console.warn(LOG_TAG + " onUiShow error", key, error);
                }
            });
            uiMgr.on(eventType.HIDE, (key: string, node: cc.Node) => {
                try {
                    onUiHide(key, node);
                } catch (error) {
                    console.warn(LOG_TAG + " onUiHide error", key, error);
                }
            });
            console.log(LOG_TAG + " inited");
        } else {
            console.warn(LOG_TAG + " init skipped: UIMgr instance or EventType missing");
        }
    },

    trackEnter(page: string): void {
        if (page) {
            trackEnterInternal(page, page);
        }
    },

    trackLeave(page: string): void {
        if (page) {
            trackLeaveInternal(page, page);
        }
    },

    _debugSnapshot(): Array<{ key: string; actPage: string; isRunning: boolean; accumulatedMs: number }> {
        return pageStack.map((entry) => ({
            key: entry.key,
            actPage: entry.actPage,
            isRunning: entry.lastResumeTs > 0,
            accumulatedMs: entry.accumulatedMs,
        }));
    },
};

export default UiPageAnalyticsService;
