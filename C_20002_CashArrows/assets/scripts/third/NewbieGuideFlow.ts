import BusinessAnalyticsService from "./BusinessAnalyticsService";
import SystemDataStore from "./SystemDataStore";
import UserData from "./UserData";

const STORAGE_KEY = "arrow_newbie_guide_step_v1";
const REPORTED_KEY = "arrow_newbie_guide_step_reported_v1";
const REPORTED_STEPS: { [key: number]: boolean } = {
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
};
const STEP_ENTRY_LEVEL1 = 1;
const STEP_HOME_BANNER = 7;
const STEP_DONE = 8;

let bootstrapped = false;
let currentStep = STEP_ENTRY_LEVEL1;

function parseStep(value: any, fallback: number): number {
    const parsed = Number(value);
    return isNaN(parsed) ? fallback : Math.floor(parsed);
}

function readStoredStep(): number {
    try {
        return parseStep(cc?.sys?.localStorage?.getItem(STORAGE_KEY), 0);
    } catch (err) {
        return 0;
    }
}

function writeStoredStep(step: number): void {
    if (step > STEP_HOME_BANNER) {
        return;
    }
    try {
        cc?.sys?.localStorage?.setItem(STORAGE_KEY, String(step));
    } catch (err) {
    }
}

function shouldEnableGuide(): boolean {
    try {
        if (SystemDataStore && typeof SystemDataStore.is_new_user === "function" && SystemDataStore.is_new_user()) {
            return true;
        }
    } catch (err) {
    }
    try {
        return Number(UserData.getInstance().level || 1) <= 2;
    } catch (err) {
        return true;
    }
}

function clampStep(step: number): number {
    let value = parseStep(step, STEP_ENTRY_LEVEL1);
    if (value < STEP_ENTRY_LEVEL1) {
        value = STEP_ENTRY_LEVEL1;
    }
    if (value > STEP_DONE) {
        value = STEP_DONE;
    }
    return value;
}

function readReportedSteps(): { [key: string]: number } {
    try {
        const raw = cc?.sys?.localStorage?.getItem(REPORTED_KEY);
        if (!raw) {
            return {};
        }
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch (err) {
        return {};
    }
}

function writeReportedSteps(reported: { [key: string]: number }): void {
    try {
        cc?.sys?.localStorage?.setItem(REPORTED_KEY, JSON.stringify(reported || {}));
    } catch (err) {
    }
}

function reportStepOnce(step: number): void {
    if (REPORTED_STEPS[step]) {
        const reported = readReportedSteps();
        if (!reported[step]) {
            reported[step] = 1;
            writeReportedSteps(reported);
            try {
                if (BusinessAnalyticsService && typeof BusinessAnalyticsService.reportData === "function") {
                    BusinessAnalyticsService.reportData("newbie_guide_step_show", { step: step });
                }
            } catch (err) {
                console.warn("[NewbieGuideFlow] reportStepOnce error step=" + step, err);
            }
        }
    }
}

const NewbieGuideFlow = {
    STEP_ENTRY_LEVEL1: STEP_ENTRY_LEVEL1,
    STEP_SETTLE_LEVEL1: 2,
    STEP_TOP_BALANCE: 3,
    STEP_WITHDRAW_OPTION: 4,
    STEP_WITHDRAW_BUTTON: 5,
    STEP_WITHDRAW_BACK: 6,
    STEP_HOME_BANNER: STEP_HOME_BANNER,
    STEP_DONE: STEP_DONE,

    bootstrap(): number {
        if (bootstrapped) {
            return currentStep;
        }
        bootstrapped = true;
        const stored = readStoredStep();
        if (stored > 0 && stored < STEP_HOME_BANNER) {
            currentStep = clampStep(stored);
            console.log("[NewbieGuide] bootstrap: 恢复进行中步骤 step=" + currentStep);
            return currentStep;
        }
        if (stored >= STEP_HOME_BANNER) {
            const enabled = shouldEnableGuide();
            currentStep = enabled ? STEP_HOME_BANNER : STEP_DONE;
            console.log("[NewbieGuide] bootstrap: stored>=7 shouldEnable=" + enabled + " step=" + currentStep + " storedWas=" + stored);
            return currentStep;
        }
        const enabled = shouldEnableGuide();
        writeStoredStep(currentStep = enabled ? STEP_ENTRY_LEVEL1 : STEP_DONE);
        console.log("[NewbieGuide] bootstrap: 初始化 shouldEnable=" + enabled + " step=" + currentStep + " storedWas=" + stored);
        return currentStep;
    },

    getStep(): number {
        if (!bootstrapped) {
            this.bootstrap();
        }
        return currentStep;
    },

    setStep(step: number): number {
        if (!bootstrapped) {
            this.bootstrap();
        }
        writeStoredStep(currentStep = clampStep(step));
        reportStepOnce(currentStep);
        return currentStep;
    },

    isStep(step: number): boolean {
        return this.getStep() === clampStep(step);
    },

    isDone(): boolean {
        return this.getStep() >= STEP_DONE;
    },

    advanceIfCurrent(step: number): boolean {
        const normalized = clampStep(step);
        if (this.getStep() !== normalized) {
            return false;
        }
        this.setStep(normalized + 1);
        return true;
    },

    complete(): void {
        this.setStep(STEP_DONE);
    },

    resetForDebug(): number {
        bootstrapped = true;
        writeStoredStep(currentStep = STEP_ENTRY_LEVEL1);
        return currentStep;
    },
};

export default NewbieGuideFlow;
