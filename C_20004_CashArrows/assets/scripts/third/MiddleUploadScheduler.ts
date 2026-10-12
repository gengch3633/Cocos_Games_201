export interface IMiddleUploadDeps {
	isReady(): boolean;
	uploadNow(source: string): void;
	getIntervalSeconds(): number;
}

export default class MiddleUploadScheduler {
	public static LOG_TAG: string = "[MiddleUploadScheduler]";

	public lastUploadTime: number = 0;
	public isClickMode: boolean = false;

	private clickTimer: number | null = null;
	private uploadTimer: number | null = null;
	private deps: IMiddleUploadDeps;

	constructor(deps: IMiddleUploadDeps) {
		this.lastUploadTime = 0;
		this.clickTimer = null;
		this.uploadTimer = null;
		this.isClickMode = false;
		this.deps = deps;
		this.log("init");
		this.initClickListener();
		this.startDefaultUploadTimer();
	}

	public log(msg: string, data?: any): void {
		if (data !== undefined) {
			let n = "";
			try {
				n = JSON.stringify(data);
			} catch (e) {
				n = String(data);
			}
			console.log(MiddleUploadScheduler.LOG_TAG + " " + msg + " " + n);
		} else {
			console.log(MiddleUploadScheduler.LOG_TAG + " " + msg);
		}
	}

	public markUploadTriggered(): void {
		this.lastUploadTime = Date.now();
		this.log("markUploadTriggered", {
			lastUploadTime: this.lastUploadTime
		});
	}

	public refreshTimerByMode(): void {
		this.isClickMode ? this.startClickModeTimer() : this.startDefaultUploadTimer();
	}

	public destroy(): void {
		cc.director.off(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLoaded, this);
		const canvasNode = cc.Canvas.instance && cc.Canvas.instance.node;
		if (canvasNode) {
			canvasNode.off(cc.Node.EventType.TOUCH_START, this.onClick, this);
			canvasNode.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
		}
		if (this.clickTimer !== null) {
			clearInterval(this.clickTimer);
			this.clickTimer = null;
		}
		if (this.uploadTimer !== null) {
			clearInterval(this.uploadTimer);
			this.uploadTimer = null;
		}
	}

	public initClickListener(): void {
		cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLoaded, this);
		this.onSceneLoaded();
	}

	public onSceneLoaded(): void {
		const canvasNode = cc.Canvas.instance && cc.Canvas.instance.node;
		if (canvasNode) {
			canvasNode.off(cc.Node.EventType.TOUCH_START, this.onClick, this);
			canvasNode.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
			canvasNode.on(cc.Node.EventType.TOUCH_START, this.onClick, this);
			canvasNode.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
		}
	}

	public startDefaultUploadTimer(): void {
		if (!this.deps.isReady()) {
			this.log("startDefaultUploadTimer skipped(not ready)");
			return;
		}

		if (this.uploadTimer !== null) {
			clearInterval(this.uploadTimer);
			this.uploadTimer = null;
		}

		const intervalSeconds = this.getSafeIntervalSeconds();
		this.log("startDefaultUploadTimer", {
			intervalSeconds: intervalSeconds
		});

		this.uploadTimer = setInterval(() => {
			if (this.isClickMode) {
				return;
			}
			const elapsedMs = Date.now() - this.lastUploadTime;
			const thresholdMs = 4000 * intervalSeconds;
			if (elapsedMs >= thresholdMs) {
				this.triggerUpload("default-timer");
			} else {
				this.log("default timer tick skipped", {
					elapsedMs: elapsedMs,
					thresholdMs: thresholdMs,
					intervalSeconds: intervalSeconds
				});
			}
		}, 1000 * intervalSeconds);
	}

	public startClickModeTimer(): void {
		if (this.clickTimer !== null) {
			clearInterval(this.clickTimer);
			this.clickTimer = null;
		}

		const intervalSeconds = this.getSafeIntervalSeconds();
		this.log("startClickModeTimer", {
			intervalSeconds: intervalSeconds
		});

		this.clickTimer = setInterval(() => {
			this.triggerUpload("click-timer");
		}, 1000 * intervalSeconds);
	}

	public onClick(_event?: cc.Event.EventTouch): void {
		if (!this.deps.isReady()) {
			this.log("onClick ignored(not ready)");
			return;
		}

		const now = Date.now();
		if (!this.isClickMode) {
			this.isClickMode = true;
			this.log("switch to click mode");
			this.startClickModeTimer();
		}

		const intervalSeconds = this.getSafeIntervalSeconds();
		const elapsedMs = now - this.lastUploadTime;
		const thresholdMs = 1000 * intervalSeconds;

		if (elapsedMs >= thresholdMs) {
			this.triggerUpload("click-immediate");
		} else {
			this.log("click immediate skipped", {
				elapsedMs: elapsedMs,
				thresholdMs: thresholdMs,
				intervalSeconds: intervalSeconds
			});
		}
	}

	public triggerUpload(source: string): void {
		this.lastUploadTime = Date.now();
		this.log("triggerUpload", {
			source: source,
			triggerAt: this.lastUploadTime
		});
		this.deps.uploadNow(source);
	}

	public getSafeIntervalSeconds(): number {
		const intervalSeconds = Number(this.deps.getIntervalSeconds());
		return !isNaN(intervalSeconds) && intervalSeconds > 0 ? intervalSeconds : 60;
	}
}