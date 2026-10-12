import BusinessAnalyticsService from "./BusinessAnalyticsService";
import SystemDataStore from "./SystemDataStore";
import UserData from "./UserData";

const STEP_STORAGE_KEY = "arrow_newbie_guide_step_v1";
const REPORTED_STORAGE_KEY = "arrow_newbie_guide_step_reported_v1";

const REPORTED_STEPS: Record<number, boolean> = {
    3: true,
    4: true,
    5: true,
    6: true,
    7: true
};

const MIN_STEP = 1;
const HOME_BANNER_STEP = 7;
const DONE_STEP = 8;

let bootstrapped = false;
let currentStep = MIN_STEP;

function toStep(value: any, fallback: number): number {
    const parsed = Number(value);
    return isNaN(parsed) ? fallback : Math.floor(parsed);
}

function readStoredStep(): number {
    try {
        return toStep(cc && cc.sys && cc.sys.localStorage ? cc.sys.localStorage.getItem(STEP_STORAGE_KEY) : "", 0);
    } catch (err) {
        return 0;
    }
}

function writeStoredStep(step: number): void {
    if (step > HOME_BANNER_STEP) {
        return;
    }
    try {
        if (cc && cc.sys && cc.sys.localStorage) {
            cc.sys.localStorage.setItem(STEP_STORAGE_KEY, String(step));
        }
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

function clampStep(step: number | string): number {
    let value = toStep(step, MIN_STEP);
    if (value < MIN_STEP) {
        value = MIN_STEP;
    }
    if (value > DONE_STEP) {
        value = DONE_STEP;
    }
    return value;
}

function readReportedMap(): Record<string, number> {
    try {
        const raw = cc && cc.sys && cc.sys.localStorage ? cc.sys.localStorage.getItem(REPORTED_STORAGE_KEY) : "";
        if (!raw) {
            return {};
        }
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch (err) {
        return {};
    }
}

function writeReportedMap(map: Record<string, number>): void {
    try {
        if (cc && cc.sys && cc.sys.localStorage) {
            cc.sys.localStorage.setItem(REPORTED_STORAGE_KEY, JSON.stringify(map || {}));
        }
    } catch (err) {
    }
}

function reportStepOnce(step: number): void {
    if (!REPORTED_STEPS[step]) {
        return;
    }
    const reported = readReportedMap();
    if (reported[step]) {
        return;
    }
    reported[step] = 1;
    writeReportedMap(reported);
    try {
        if (BusinessAnalyticsService && typeof BusinessAnalyticsService.reportData === "function") {
            BusinessAnalyticsService.reportData("newbie_guide_step_show", { step: step });
        }
    } catch (err) {
        console.warn("[NewbieGuideFlow] reportStepOnce error step=" + step, err);
    }
}

class NewbieGuideFlow {
    public STEP_ENTRY_LEVEL1: number = MIN_STEP;
    public STEP_SETTLE_LEVEL1: number = 2;
    public STEP_TOP_BALANCE: number = 3;
    public STEP_WITHDRAW_OPTION: number = 4;
    public STEP_WITHDRAW_BUTTON: number = 5;
    public STEP_WITHDRAW_BACK: number = 6;
    public STEP_HOME_BANNER: number = HOME_BANNER_STEP;
    public STEP_DONE: number = DONE_STEP;

    public bootstrap(): number {
        if (bootstrapped) {
            return currentStep;
        }
        bootstrapped = true;
        const stored = readStoredStep();
        if (stored > 0 && stored < HOME_BANNER_STEP) {
            currentStep = clampStep(stored);
            console.log("[NewbieGuide] bootstrap: 恢复进行中步骤 step=" + currentStep);
            return currentStep;
        }
        if (stored >= HOME_BANNER_STEP) {
            const enabled = shouldEnableGuide();
            currentStep = enabled ? HOME_BANNER_STEP : DONE_STEP;
            console.log("[NewbieGuide] bootstrap: stored>=7 shouldEnable=" + enabled + " step=" + currentStep + " storedWas=" + stored);
            return currentStep;
        }
        const enabled = shouldEnableGuide();
        currentStep = enabled ? MIN_STEP : DONE_STEP;
        writeStoredStep(currentStep);
        console.log("[NewbieGuide] bootstrap: 初始化 shouldEnable=" + enabled + " step=" + currentStep + " storedWas=" + stored);
        return currentStep;
    }

    public getStep(): number {
        if (!bootstrapped) {
            this.bootstrap();
        }
        return currentStep;
    }

    public setStep(step: number | string): number {
        if (!bootstrapped) {
            this.bootstrap();
        }
        currentStep = clampStep(step);
        writeStoredStep(currentStep);
        reportStepOnce(currentStep);
        return currentStep;
    }

    public isStep(step: number | string): boolean {
        return this.getStep() === clampStep(step);
    }

    public isDone(): boolean {
        return this.getStep() >= DONE_STEP;
    }

    public advanceIfCurrent(step: number | string): boolean {
        const target = clampStep(step);
        if (this.getStep() !== target) {
            return false;
        }
        this.setStep(target + 1);
        return true;
    }

    public complete(): void {
        this.setStep(DONE_STEP);
    }

    public resetForDebug(): number {
        bootstrapped = true;
        currentStep = MIN_STEP;
        writeStoredStep(currentStep);
        return currentStep;
    }
}

const newbieGuideFlow = new NewbieGuideFlow();

export default newbieGuideFlow;