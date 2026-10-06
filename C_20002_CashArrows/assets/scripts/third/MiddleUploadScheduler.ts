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

    constructor(e: MiddleUploadSchedulerDeps) {
        this.deps = e;
        this.log("init");
        this.initClickListener();
        this.startDefaultUploadTimer();
    }

    log(t: string, i?: any) {
        if (void 0 !== i) {
            var n = "";
            try {
                n = JSON.stringify(i);
            } catch (e) {
                n = String(i);
            }
            console.log(MiddleUploadScheduler.LOG_TAG + " " + t + " " + n);
        } else console.log(MiddleUploadScheduler.LOG_TAG + " " + t);
    }

    markUploadTriggered() {
        this.lastUploadTime = Date.now();
        this.log("markUploadTriggered", {
            lastUploadTime: this.lastUploadTime
        });
    }

    refreshTimerByMode() {
        this.isClickMode ? this.startClickModeTimer() : this.startDefaultUploadTimer();
    }

    destroy() {
        cc.director.off(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLoaded, this);
        var e = cc.Canvas.instance && cc.Canvas.instance.node;
        if (e) {
            e.off(cc.Node.EventType.TOUCH_START, this.onClick, this);
            e.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
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

    initClickListener() {
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLoaded, this);
        this.onSceneLoaded();
    }

    onSceneLoaded() {
        var e = cc.Canvas.instance && cc.Canvas.instance.node;
        if (e) {
            e.off(cc.Node.EventType.TOUCH_START, this.onClick, this);
            e.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
            e.on(cc.Node.EventType.TOUCH_START, this.onClick, this);
            e.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
        }
    }

    startDefaultUploadTimer() {
        var e = this;
        if (this.deps.isReady()) {
            if (this.uploadTimer) {
                clearInterval(this.uploadTimer);
                this.uploadTimer = null;
            }
            var t = this.getSafeIntervalSeconds();
            this.log("startDefaultUploadTimer", {
                intervalSeconds: t
            });
            this.uploadTimer = setInterval(function () {
                if (!e.isClickMode) {
                    var i = Date.now() - e.lastUploadTime, n = 4e3 * t;
                    i >= n ? e.triggerUpload("default-timer") : e.log("default timer tick skipped", {
                        elapsedMs: i,
                        thresholdMs: n,
                        intervalSeconds: t
                    });
                }
            }, 1e3 * t);
        } else this.log("startDefaultUploadTimer skipped(not ready)");
    }

    startClickModeTimer() {
        var e = this;
        if (this.clickTimer) {
            clearInterval(this.clickTimer);
            this.clickTimer = null;
        }
        var t = this.getSafeIntervalSeconds();
        this.log("startClickModeTimer", {
            intervalSeconds: t
        });
        this.clickTimer = setInterval(function () {
            e.triggerUpload("click-timer");
        }, 1e3 * t);
    }

    onClick() {
        if (this.deps.isReady()) {
            var e = Date.now();
            if (!this.isClickMode) {
                this.isClickMode = true;
                this.log("switch to click mode");
                this.startClickModeTimer();
            }
            var t = this.getSafeIntervalSeconds(),
                i = e - this.lastUploadTime,
                n = 1e3 * t;
            i >= n ? this.triggerUpload("click-immediate") : this.log("click immediate skipped", {
                elapsedMs: i,
                thresholdMs: n,
                intervalSeconds: t
            });
        } else this.log("onClick ignored(not ready)");
    }

    triggerUpload(e: string) {
        this.lastUploadTime = Date.now();
        this.log("triggerUpload", {
            source: e,
            triggerAt: this.lastUploadTime
        });
        this.deps.uploadNow(e);
    }

    getSafeIntervalSeconds() {
        var e = Number(this.deps.getIntervalSeconds());
        return !isNaN(e) && e > 0 ? e : 60;
    }
}
