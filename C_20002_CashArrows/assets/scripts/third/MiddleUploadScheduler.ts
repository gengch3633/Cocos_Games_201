interface MiddleUploadSchedulerDeps {
    isReady: () => boolean;
    getIntervalSeconds: () => number;
    uploadNow: (source: string) => void;
}

export default class MiddleUploadScheduler {
    static LOG_TAG = "[MiddleUploadScheduler]";

    lastUploadTime = 0;
    clickTimer: any = null;
    uploadTimer: any = null;
    isClickMode = false;
    deps: MiddleUploadSchedulerDeps;

    constructor(deps: MiddleUploadSchedulerDeps) {
        this.deps = deps;
        this.log("init");
        this.initClickListener();
        this.startDefaultUploadTimer();
    }

    log(message: string, detail?: any): void {
        if (detail !== undefined) {
            let serialized = "";
            try {
                serialized = JSON.stringify(detail);
            } catch (e) {
                serialized = String(detail);
            }
            console.log(MiddleUploadScheduler.LOG_TAG + " " + message + " " + serialized);
        } else {
            console.log(MiddleUploadScheduler.LOG_TAG + " " + message);
        }
    }

    markUploadTriggered(): void {
        this.lastUploadTime = Date.now();
        this.log("markUploadTriggered", {
            lastUploadTime: this.lastUploadTime,
        });
    }

    refreshTimerByMode(): void {
        if (this.isClickMode) {
            this.startClickModeTimer();
        } else {
            this.startDefaultUploadTimer();
        }
    }

    destroy(): void {
        cc.director.off(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLoaded, this);
        const canvasNode = cc.Canvas.instance && cc.Canvas.instance.node;
        if (canvasNode) {
            canvasNode.off(cc.Node.EventType.TOUCH_START, this.onClick, this);
            canvasNode.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
        }
        if (this.clickTimer) {
            clearInterval(this.clickTimer);
            this.clickTimer = null;
        }
        if (this.uploadTimer) {
            clearInterval(this.uploadTimer);
            this.uploadTimer = null;
        }
    }

    initClickListener(): void {
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLoaded, this);
        this.onSceneLoaded();
    }

    onSceneLoaded = (): void => {
        const canvasNode = cc.Canvas.instance && cc.Canvas.instance.node;
        if (canvasNode) {
            canvasNode.off(cc.Node.EventType.TOUCH_START, this.onClick, this);
            canvasNode.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
            canvasNode.on(cc.Node.EventType.TOUCH_START, this.onClick, this);
            canvasNode.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
        }
    };

    startDefaultUploadTimer(): void {
        if (this.deps.isReady()) {
            if (this.uploadTimer) {
                clearInterval(this.uploadTimer);
                this.uploadTimer = null;
            }
            const intervalSeconds = this.getSafeIntervalSeconds();
            this.log("startDefaultUploadTimer", {
                intervalSeconds,
            });
            this.uploadTimer = setInterval(() => {
                if (!this.isClickMode) {
                    const elapsed = Date.now() - this.lastUploadTime;
                    const threshold = 4000 * intervalSeconds;
                    if (elapsed >= threshold) {
                        this.triggerUpload("default-timer");
                    } else {
                        this.log("default timer tick skipped", {
                            elapsedMs: elapsed,
                            thresholdMs: threshold,
                            intervalSeconds,
                        });
                    }
                }
            }, 1000 * intervalSeconds);
        } else {
            this.log("startDefaultUploadTimer skipped(not ready)");
        }
    }

    startClickModeTimer(): void {
        if (this.clickTimer) {
            clearInterval(this.clickTimer);
            this.clickTimer = null;
        }
        const intervalSeconds = this.getSafeIntervalSeconds();
        this.log("startClickModeTimer", {
            intervalSeconds,
        });
        this.clickTimer = setInterval(() => {
            this.triggerUpload("click-timer");
        }, 1000 * intervalSeconds);
    }

    onClick = (): void => {
        if (this.deps.isReady()) {
            const now = Date.now();
            if (!this.isClickMode) {
                this.isClickMode = true;
                this.log("switch to click mode");
                this.startClickModeTimer();
            }
            const intervalSeconds = this.getSafeIntervalSeconds();
            const elapsed = now - this.lastUploadTime;
            const threshold = 1000 * intervalSeconds;
            if (elapsed >= threshold) {
                this.triggerUpload("click-immediate");
            } else {
                this.log("click immediate skipped", {
                    elapsedMs: elapsed,
                    thresholdMs: threshold,
                    intervalSeconds,
                });
            }
        } else {
            this.log("onClick ignored(not ready)");
        }
    };

    triggerUpload(source: string): void {
        this.lastUploadTime = Date.now();
        this.log("triggerUpload", {
            source,
            triggerAt: this.lastUploadTime,
        });
        this.deps.uploadNow(source);
    }

    getSafeIntervalSeconds(): number {
        const value = Number(this.deps.getIntervalSeconds());
        return !isNaN(value) && value > 0 ? value : 60;
    }
}
