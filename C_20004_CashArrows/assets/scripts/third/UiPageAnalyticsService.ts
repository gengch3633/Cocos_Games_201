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
    "prefab/cashArrowFailView": "fail_page"
};

interface PageStackItem {
    key: string;
    actPage: string;
    lastResumeTs: number;
    accumulatedMs: number;
}

let initialized = false;
const pageStack: PageStackItem[] = [];

function now(): number {
    return Date.now();
}

function resolveActPage(key: string, ui?: any): string {
    if (key && typeof key === "string") {
        const keys = Object.keys(PAGE_MAP);
        for (let i = 0; i < keys.length; i++) {
            const pageKey = keys[i];
            if (key === pageKey || key.indexOf(pageKey) >= 0) {
                return PAGE_MAP[pageKey];
            }
        }
    }
    return ui && ui.isValid && ui.name ? ui.name : key || "unknown";
}

function report(eventName: string, data: any): void {
    try {
        if (BusinessAnalyticsService && typeof BusinessAnalyticsService.reportData === "function") {
            BusinessAnalyticsService.reportData(eventName, data);
        }
    } catch (err) {
        console.warn(LOG_TAG + " report error", eventName, err);
    }
}

function accumulateTime(item: PageStackItem, timestamp: number): void {
    if (item && !(item.lastResumeTs <= 0)) {
        item.accumulatedMs += Math.max(0, timestamp - item.lastResumeTs);
        item.lastResumeTs = 0;
    }
}

function resumeItem(item: PageStackItem, timestamp: number): void {
    if (item) {
        item.lastResumeTs = timestamp;
    }
}

function findIndex(key: string): number {
    for (let i = pageStack.length - 1; i >= 0; i--) {
        if (pageStack[i].key === key) {
            return i;
        }
    }
    return -1;
}

function enterPage(key: string, actPage: string): void {
    const timestamp = now();
    if (findIndex(key) >= 0) {
        return;
    }
    if (pageStack.length > 0) {
        accumulateTime(pageStack[pageStack.length - 1], timestamp);
    }
    pageStack.push({
        key: key,
        actPage: actPage,
        lastResumeTs: timestamp,
        accumulatedMs: 0
    });
    report("b_entry_game_page", {
        act_page: actPage
    });
}

function leavePage(key: string, actPage?: string): void {
    const timestamp = now();
    const index = findIndex(key);
    if (index < 0) {
        report("b_leave_game_page", {
            act_page: actPage || key || "unknown",
            duration: 0
        });
    } else {
        const item = pageStack[index];
        const isLast = index === pageStack.length - 1;
        if (isLast) {
            accumulateTime(item, timestamp);
        }
        pageStack.splice(index, 1);
        report("b_leave_game_page", {
            act_page: item.actPage,
            duration: item.accumulatedMs
        });
        if (isLast && pageStack.length > 0) {
            resumeItem(pageStack[pageStack.length - 1], timestamp);
        }
    }
}

function onUiShow(key: string, ui: any): void {
    if (key) {
        enterPage(key, resolveActPage(key, ui));
    }
}

function onUiHide(key: string, ui: any): void {
    if (key) {
        leavePage(key, resolveActPage(key, ui));
    }
}

const UiPageAnalyticsService = {
    init: function (): void {
        if (!initialized) {
            if (UIMgr && UIMgr.getInstance) {
                const instance = UIMgr.getInstance();
                const eventType = UIMgr.EventType;
                if (instance && eventType) {
                    initialized = true;
                    instance.on(eventType.SHOW, function (key: string, ui: any) {
                        try {
                            onUiShow(key, ui);
                        } catch (err) {
                            console.warn(LOG_TAG + " onUiShow error", key, err);
                        }
                    });
                    instance.on(eventType.HIDE, function (key: string, ui: any) {
                        try {
                            onUiHide(key, ui);
                        } catch (err) {
                            console.warn(LOG_TAG + " onUiHide error", key, err);
                        }
                    });
                    console.log(LOG_TAG + " inited");
                } else {
                    console.warn(LOG_TAG + " init skipped: UIMgr instance or EventType missing");
                }
            } else {
                console.warn(LOG_TAG + " init skipped: UIMgr unavailable");
            }
        }
    },
    trackEnter: function (key: string): void {
        if (key) {
            enterPage(key, key);
        }
    },
    trackLeave: function (key: string): void {
        if (key) {
            leavePage(key, key);
        }
    },
    _debugSnapshot: function (): any[] {
        return pageStack.map(function (item) {
            return {
                key: item.key,
                actPage: item.actPage,
                isRunning: item.lastResumeTs > 0,
                accumulatedMs: item.accumulatedMs
            };
        });
    }
};

export default UiPageAnalyticsService;