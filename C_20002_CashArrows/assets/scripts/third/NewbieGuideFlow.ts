import UserData from "./UserData";
import BusinessAnalyticsService from "./BusinessAnalyticsService";

declare function require(id: string): any;

const STORAGE_KEY = " arrow_newbie_guide_step_v1 ";
const REPORTED_KEY = " arrow_newbie_guide_step_reported_v1 ";
const REPORT_STEPS: any = {
    3: true,
    4: true,
    5: true,
    6: true,
    7: true
};

const STEP_ENTRY_LEVEL1 = 1;
const STEP_SETTLE_LEVEL1 = 2;
const STEP_TOP_BALANCE = 3;
const STEP_WITHDRAW_OPTION = 4;
const STEP_WITHDRAW_BUTTON = 5;
const STEP_WITHDRAW_BACK = 6;
const STEP_HOME_BANNER = 7;
const STEP_DONE = 8;

let bootstrapped = false;
let currentStep = STEP_ENTRY_LEVEL1;

function parseStep(value: any, fallback: number) {
    var num = Number(value);
    return isNaN(num) ? fallback : Math.floor(num);
}

function readStoredStep() {
    try {
        return parseStep(cc && cc.sys && cc.sys.localStorage ? cc.sys.localStorage.getItem(STORAGE_KEY) : " ", 0);
    } catch (e) {
        return 0;
    }
}

function writeStoredStep(step: number) {
    if (!(step > STEP_HOME_BANNER)) {
        try {
            cc && cc.sys && cc.sys.localStorage && cc.sys.localStorage.setItem(STORAGE_KEY, String(step));
        } catch (e) { }
    }
}

function shouldEnableGuide() {
    try {
        var systemDataModule = require("./SystemDataStore"),
            systemDataStore = systemDataModule && (systemDataModule.default || systemDataModule);
        if (systemDataStore && "function" == typeof systemDataStore.is_new_user && systemDataStore.is_new_user()) {
            return true;
        }
    } catch (e) { }
    try {
        return Number(UserData.getInstance().level || 1) <= 2;
    } catch (e) {
        return true;
    }
}

function clampStep(step: any) {
    var value = parseStep(step, STEP_ENTRY_LEVEL1);
    value < STEP_ENTRY_LEVEL1 && (value = STEP_ENTRY_LEVEL1);
    value > STEP_DONE && (value = STEP_DONE);
    return value;
}

function readReportedSteps() {
    try {
        var raw = cc && cc.sys && cc.sys.localStorage ? cc.sys.localStorage.getItem(REPORTED_KEY) : " ";
        if (!raw) {
            return {};
        }
        var parsed = JSON.parse(raw);
        return parsed && "object" == typeof parsed ? parsed : {};
    } catch (e) {
        return {};
    }
}

function writeReportedSteps(data: any) {
    try {
        cc && cc.sys && cc.sys.localStorage && cc.sys.localStorage.setItem(REPORTED_KEY, JSON.stringify(data || {}));
    } catch (e) { }
}

function reportStepOnce(step: number) {
    if (REPORT_STEPS[step]) {
        var reported = readReportedSteps();
        if (!reported[step]) {
            reported[step] = 1;
            writeReportedSteps(reported);
            try {
                BusinessAnalyticsService && "function" == typeof BusinessAnalyticsService.reportData && BusinessAnalyticsService.reportData(" newbie_guide_step_show ", {
                    step: step
                });
            } catch (err) {
                console.warn("[NewbieGuideFlow] reportStepOnce error step = " + step, err);
            }
        }
    }
}

const NewbieGuideFlow = {
    STEP_ENTRY_LEVEL1: STEP_ENTRY_LEVEL1,
    STEP_SETTLE_LEVEL1: STEP_SETTLE_LEVEL1,
    STEP_TOP_BALANCE: STEP_TOP_BALANCE,
    STEP_WITHDRAW_OPTION: STEP_WITHDRAW_OPTION,
    STEP_WITHDRAW_BUTTON: STEP_WITHDRAW_BUTTON,
    STEP_WITHDRAW_BACK: STEP_WITHDRAW_BACK,
    STEP_HOME_BANNER: STEP_HOME_BANNER,
    STEP_DONE: STEP_DONE,
    bootstrap: function () {
        if (bootstrapped) {
            return currentStep;
        }
        bootstrapped = true;
        var stored = readStoredStep();
        if (stored > 0 && stored < STEP_HOME_BANNER) {
            currentStep = clampStep(stored);
            console.log("[NewbieGuide] bootstrap: 恢复进行中步骤 step = " + currentStep);
            return currentStep;
        }
        if (stored >= STEP_HOME_BANNER) {
            var enable = shouldEnableGuide();
            currentStep = enable ? STEP_HOME_BANNER : STEP_DONE;
            console.log("[NewbieGuide] bootstrap: stored >= 7 shouldEnable = " + enable + " step = " + currentStep + " storedWas = " + stored);
            return currentStep;
        }
        enable = shouldEnableGuide();
        writeStoredStep(currentStep = enable ? STEP_ENTRY_LEVEL1 : STEP_DONE);
        console.log("[NewbieGuide] bootstrap: 初始化 shouldEnable = " + enable + " step = " + currentStep + " storedWas = " + stored);
        return currentStep;
    },
    getStep: function () {
        bootstrapped || this.bootstrap();
        return currentStep;
    },
    setStep: function (step: number) {
        bootstrapped || this.bootstrap();
        writeStoredStep(currentStep = clampStep(step));
        reportStepOnce(currentStep);
        return currentStep;
    },
    isStep: function (step: number) {
        return this.getStep() === clampStep(step);
    },
    isDone: function () {
        return this.getStep() >= STEP_DONE;
    },
    advanceIfCurrent: function (step: number) {
        var target = clampStep(step);
        if (this.getStep() !== target) {
            return false;
        }
        this.setStep(target + 1);
        return true;
    },
    complete: function () {
        this.setStep(STEP_DONE);
    },
    resetForDebug: function () {
        bootstrapped = true;
        writeStoredStep(currentStep = STEP_ENTRY_LEVEL1);
        return currentStep;
    }
};

export default NewbieGuideFlow;
