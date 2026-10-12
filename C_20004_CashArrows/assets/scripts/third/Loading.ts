import AppReviewManager from "./AppReviewManager";
import ClientDataStore from "./ClientDataStore";
import ConfigMgr from "./ConfigMgr";
import CurrencyFormatService from "./CurrencyFormatService";
import "./GEMgr";
import Handler from "./Handler";
import LanguageService from "./LanguageService";
import Launch from "./Launch";
import LoadingHttpService from "./LoadingHttpService";
import * as LoadingProjectAdaptersBridge from "./LoadingProjectAdaptersBridge";
import LoadingUmpDialogService from "./LoadingUmpDialogService";
import PlatformBridge from "./PlatformBridge";
import PlayerDataStore from "./PlayerDataStore";
import SceneMgr from "./SceneMgr";
import { UILayer } from "./UIDefine";
import UIMgr from "./UIMgr";
import UiPageAnalyticsService from "./UiPageAnalyticsService";
import UserData from "./UserData";
import Utils from "./Utils";

const { ccclass, property } = cc._decorator;

interface ProgressStep {
	name: string;
	weight: number;
}

const PROGRESS_STEPS: ProgressStep[] = [
	{ name: "waitGaid", weight: 8 },
	{ name: "middleCountry", weight: 8 },
	{ name: "login", weight: 8 },
	{ name: "systemConfig", weight: 8 },
	{ name: "gameConfig", weight: 8 },
	{ name: "userInfo", weight: 8 },
	{ name: "configLoad", weight: 20 },
	{ name: "archiveInit", weight: 10 },
	{ name: "bundleLoad", weight: 15 },
	{ name: "enterScene", weight: 7 }
];

let TOTAL_PROGRESS_WEIGHT = 0;
for (let i = 0; i < PROGRESS_STEPS.length; i++) {
	TOTAL_PROGRESS_WEIGHT += PROGRESS_STEPS[i].weight;
}

function isArrowLogEnabled(): boolean {
	try {
		if (typeof window !== "undefined" && (window as any).__ARROW_ENABLE_LOG__ === true) {
			return true;
		}
	} catch (e) {
	}
	try {
		if (typeof cc !== "undefined" && cc.sys && cc.sys.localStorage) {
			const flag = cc.sys.localStorage.getItem("arrow_enable_log");
			return flag === "1" || flag === "true";
		}
	} catch (e) {
	}
	return false;
}

(function (): void {
	if (isArrowLogEnabled()) {
		return;
	}
	const noop = function (): void { };
	if (typeof console !== "undefined") {
		(console as any).log = noop;
		(console as any).info = noop;
		(console as any).debug = noop;
		(console as any).warn = noop;
		(console as any).error = noop;
	}
	if (typeof cc !== "undefined") {
		(cc as any).log = noop;
		(cc as any).warn = noop;
		(cc as any).error = noop;
	}
})();

function patchNativeBlendGuard(): void {
	if (!cc.sys || !cc.sys.isNative || (cc as any).__spineBlendGuardPatched) {
		return;
	}

	const gfx: any = (cc as any).gfx || {};
	const materialProto: any = cc.Material && (cc.Material as any).prototype;
	if (!materialProto || typeof materialProto.setBlend !== "function") {
		return;
	}

	const originalSetBlend = materialProto.setBlend;
	const blendFuncAdd = gfx.BLEND_FUNC_ADD != null ? gfx.BLEND_FUNC_ADD : gfx.BLEND_OP_ADD;
	const srcAlpha = gfx.BLEND_SRC_ALPHA != null ? gfx.BLEND_SRC_ALPHA : cc.macro.SRC_ALPHA;
	const oneMinusSrcAlpha = gfx.BLEND_ONE_MINUS_SRC_ALPHA != null ? gfx.BLEND_ONE_MINUS_SRC_ALPHA : cc.macro.ONE_MINUS_SRC_ALPHA;
	const one = gfx.BLEND_ONE != null ? gfx.BLEND_ONE : cc.macro.ONE;
	const srcColor = gfx.BLEND_SRC_COLOR != null ? gfx.BLEND_SRC_COLOR : cc.macro.SRC_COLOR;
	const oneMinusSrcColor = gfx.BLEND_ONE_MINUS_SRC_COLOR != null ? gfx.BLEND_ONE_MINUS_SRC_COLOR : cc.macro.ONE_MINUS_SRC_COLOR;
	const dstColor = gfx.BLEND_DST_COLOR != null ? gfx.BLEND_DST_COLOR : cc.macro.DST_COLOR;
	const oneMinusDstColor = gfx.BLEND_ONE_MINUS_DST_COLOR != null ? gfx.BLEND_ONE_MINUS_DST_COLOR : cc.macro.ONE_MINUS_DST_COLOR;
	const srcAlphaSaturate = gfx.BLEND_SRC_ALPHA_SATURATE != null ? gfx.BLEND_SRC_ALPHA_SATURATE : cc.macro.SRC_ALPHA_SATURATE;

	const isInvalidBlendFactor = function (value: any): boolean {
		return value == null || value === srcColor || value === oneMinusSrcColor ||
			value === dstColor || value === oneMinusDstColor || value === srcAlphaSaturate;
	};

	materialProto.setBlend = function (
		blend: any,
		p1: any,
		p2: any,
		p3: any,
		p4: any,
		p5: any,
		p6: any,
		p7: any,
		p8: any
	): any {
		if (p1 == null) {
			p1 = blendFuncAdd;
		}
		if (p4 == null) {
			p4 = blendFuncAdd;
		}
		if (p2 == null) {
			p2 = srcAlpha;
		}
		if (p3 == null) {
			p3 = oneMinusSrcAlpha;
		}
		if (isInvalidBlendFactor(p5)) {
			p5 = one;
		}
		if (isInvalidBlendFactor(p6)) {
			p6 = oneMinusSrcAlpha;
		}
		if (p5 == null) {
			p5 = one;
		}
		if (p6 == null) {
			p6 = oneMinusSrcAlpha;
		}
		if (p7 == null) {
			p7 = 4294967295;
		}
		return originalSetBlend.call(this, blend, p1, p2, p3, p4, p5, p6, p7, p8);
	};

	(cc as any).__spineBlendGuardPatched = true;
	console.warn("[BlendGuard] Native blend guard enabled");
}

@ccclass
export default class Loading extends cc.Component {

	@property(sp.Skeleton)
	public sp_logo: sp.Skeleton = null;

	@property(cc.SpriteFrame)
	public sf_logoarr: cc.SpriteFrame[] = [];

	@property(cc.Node)
	public node_noMac: cc.Node = null;

	@property(cc.ProgressBar)
	public progressBar: cc.ProgressBar = null;

	@property(cc.Sprite)
	public img_jindu: cc.Sprite = null;

	@property(cc.Node)
	public umpNode: cc.Node = null;

	@property(cc.Node)
	public umpBtnAgree: cc.Node = null;

	@property(cc.Node)
	public umpBtnClose: cc.Node = null;

	private _isProgressPaused: boolean = false;
	private _pendingProgressRatio: number = 0;
	private _hasPendingProgress: boolean = false;
	private _realProgress: number = 0;
	private _sceneEntering: boolean = false;

	public onLoad(): void {
		patchNativeBlendGuard();
		console.log("[Loading][UMP] onLoad hasUmpNode=" + !!this.umpNode +
			" hasAgreeBtn=" + !!this.umpBtnAgree +
			" hasCloseBtn=" + !!this.umpBtnClose);
		LoadingProjectAdaptersBridge.initProjectLoadingAdapters();
		LanguageService.init();
		this.playLogoSpineOnce();
		this.init();
	}

	private playLogoSpineOnce(): void {
		if (!this.sp_logo || !this.sp_logo.setAnimation) {
			return;
		}
		try {
			const animName = this.sp_logo.defaultAnimation || "animation";
			this.sp_logo.loop = false;
			if (this.sp_logo.clearTracks) {
				this.sp_logo.clearTracks();
			}
			this.sp_logo.setAnimation(0, animName, false);
			if (this.sp_logo.setCompleteListener) {
				this.sp_logo.setCompleteListener(function (): void { });
			}
		} catch (e) {
			console.warn("[Loading] play logo spine failed:", e);
		}
	}

	public async ShowNoMac(): Promise<void> {
		let notInMacList = true;
		const macList: any[] = await ConfigMgr.getInstance().getMackList();
		console.log("maclist:", macList);
		macList.forEach(function (item: any): void {
			if (item.macId == UserData.getInstance().userID) {
				notInMacList = false;
			}
		});
		if (notInMacList) {
			this.node_noMac.active = true;
		} else {
			this.init();
		}
	}

	public init(): void {
		let umpService: any = null;

		Utils.AddIrregularityClick();
		cc.macro.ENABLE_MULTI_TOUCH = false;

		const launchOptions: any = {
			gameName: "",
			rewardVideo: [],
			inters: "",
			custom: "",
			ossUrl: "",
			login: false,
			dataSyncToServer: false,
			report: false
		};

		if (cc.sys.isBrowser) {
			const urlParams = this.getURLParams();
			if (urlParams) {
				Object.assign(launchOptions, urlParams);
				console.log("url params:", urlParams);
			}
		}

		UIMgr.getInstance().initLayer(Object.keys(UILayer), UILayer.Bottom);
		AppReviewManager.getInstance().init();
		UiPageAnalyticsService.init();
		UiPageAnalyticsService.trackEnter("launch_page");
		LoadingProjectAdaptersBridge.initSystem();

		const markProgress = (ratio: number): void => {
			this._animateProgressTo(ratio);
		};
		const doneFlags: { [key: string]: boolean } = {};
		const progressReporter = {
			stepDone: function (name: string): void {
				if (doneFlags[name]) {
					return;
				}
				doneFlags[name] = true;
				let done = 0;
				for (let i = 0; i < PROGRESS_STEPS.length; i++) {
					if (doneFlags[PROGRESS_STEPS[i].name]) {
						done += PROGRESS_STEPS[i].weight;
					}
				}
				const ratio = done / TOTAL_PROGRESS_WEIGHT;
				console.log("[Loading][Progress] stepDone: " + name + " -> " + Math.round(100 * ratio) + "%");
				if (markProgress) {
					markProgress(ratio);
				}
			},
			batchDone: function (names: string[]): void {
				for (let i = 0; i < names.length; i++) {
					doneFlags[names[i]] = true;
				}
				let done = 0;
				for (let i = 0; i < PROGRESS_STEPS.length; i++) {
					if (doneFlags[PROGRESS_STEPS[i].name]) {
						done += PROGRESS_STEPS[i].weight;
					}
				}
				const ratio = done / TOTAL_PROGRESS_WEIGHT;
				console.log("[Loading][Progress] batchDone: [" + names.join(",") + "] -> " + Math.round(100 * ratio) + "%");
				if (markProgress) {
					markProgress(ratio);
				}
			}
		};

		try {
			const UmpServiceClass: any = LoadingUmpDialogService;
			console.log("[Loading][UMP] service check hasServiceClass=" + !!UmpServiceClass +
				" hasUmpNode=" + !!this.umpNode +
				" hasAgreeBtn=" + !!this.umpBtnAgree +
				" hasCloseBtn=" + !!this.umpBtnClose +
				" umpNodeName=" + (this.umpNode ? this.umpNode.name : "null") +
				" umpNodeActive=" + (this.umpNode ? this.umpNode.active : "null") +
				" umpNodeActiveInHierarchy=" + (this.umpNode ? this.umpNode.activeInHierarchy : "null"));
			if (UmpServiceClass && this.umpNode && this.umpBtnAgree && this.umpBtnClose) {
				this.umpNode.active = false;
				console.log("[Loading][UMP] service created, set umpNode.active=false");
				umpService = new UmpServiceClass({
					umpNode: this.umpNode,
					umpBtnAgree: this.umpBtnAgree,
					umpBtnClose: this.umpBtnClose,
					onPauseLoading: (): void => {
						console.log("[Loading][UMP] onPauseLoading fillRange=" +
							(this.img_jindu ? this.img_jindu.fillRange : "null") +
							" umpNodeActive=" + (this.umpNode ? this.umpNode.active : "null"));
						this._isProgressPaused = true;
					},
					onResumeLoading: (): void => {
						console.log("[Loading][UMP] onResumeLoading hasPendingProgress=" + this._hasPendingProgress +
							" fillRange=" + (this.img_jindu ? this.img_jindu.fillRange : "null") +
							" umpNodeActive=" + (this.umpNode ? this.umpNode.active : "null"));
						this._isProgressPaused = false;
						if (this._hasPendingProgress) {
							this._hasPendingProgress = false;
							this._realProgress = Math.max(this._realProgress, this._pendingProgressRatio);
						}
					}
				});
			} else if (UmpServiceClass) {
				console.warn("[Loading][UMP] 节点未配置，跳过展示。 hasUmpNode=" + !!this.umpNode +
					" hasAgreeBtn=" + !!this.umpBtnAgree +
					" hasCloseBtn=" + !!this.umpBtnClose);
			}
		} catch (e) {
			console.error("[Loading][UMP] 初始化弹窗服务失败:", e);
		}

		const doLaunch = (): void => {
			console.log("doLaunch", "doLaunch");

			try {
				const country = CurrencyFormatService.getCurrentCountry();
				if (country) {
					LanguageService.setByCountryCode(country);
				}
			} catch (e) {
				console.warn("[Loading] sync country-language before launch failed:", e);
			}

			try {
				const platformBridge: any = PlatformBridge;
				const clientDataStore: any = ClientDataStore;
				const localCountry = clientDataStore && clientDataStore.local_country;
				const nativeBridge = platformBridge && typeof platformBridge.getNativeBridge === "function"
					? platformBridge.getNativeBridge()
					: null;
				if (nativeBridge && typeof nativeBridge.initSMSdk === "function") {
					nativeBridge.initSMSdk(
						"MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKP9X+CjUjA2ijFyOPVAqmXPOuQl39+2KRHZZMydD/TuOEL/SzZqE9A+BT49r41twoDHp/bNc7OjTYjclIkCDp8CAwEAAQ==",
						localCountry
					);
					console.log("[Loading] initSMSdk called country=" + localCountry);
				}
			} catch (e) {
				console.warn("[Loading] initSMSdk failed:", e);
			}

			const arrowLevelId = Number(PlayerDataStore.current_arrow_level_id || 0);
			const levelRequest = arrowLevelId > 0 ? { arrow_level_id: arrowLevelId } : { arrow_level_id: 1 };
			console.log("[ArrowLevel] doLaunch: 请求关卡配置 req=" + JSON.stringify(levelRequest));
			LoadingHttpService.getArrowLevelConfig(
				levelRequest,
				Handler.create(null, function (res: any): void {
					if (res && res.data && res.data.arrow_level) {
						PlayerDataStore.updateArrowLevel(res.data.arrow_level);
						console.log("[ArrowLevel] doLaunch: 关卡配置加载成功 arrow_level=" + JSON.stringify(res.data.arrow_level));
					} else {
						console.warn("[ArrowLevel] doLaunch: 关卡配置返回数据异常 res=" + JSON.stringify(res));
					}
				}),
				Handler.create(null, function (err: any): void {
					console.warn("[ArrowLevel] doLaunch: 关卡配置请求失败，使用本地 level 兜底 err=" + JSON.stringify(err));
				})
			);

			let loadStepIndex = 0;
			const loadSteps = ["configLoad", "archiveInit", "bundleLoad"];
			Launch.getInstance().load(launchOptions, ["lobby"], function (total: number, current: number): void {
				if (loadStepIndex < loadSteps.length) {
					progressReporter.stepDone(loadSteps[loadStepIndex]);
					loadStepIndex++;
				}
				if (current >= total) {
					for (let i = loadStepIndex; i < loadSteps.length; i++) {
						progressReporter.stepDone(loadSteps[i]);
					}
					progressReporter.stepDone("enterScene");
				}
			});
		};

		const runFlow = (): void => {
			LoadingProjectAdaptersBridge.runMiddleCountry(
				function (): void {
					progressReporter.stepDone("middleCountry");
					LoadingProjectAdaptersBridge.runBaseFlow(doLaunch, doLaunch, function (step: string): void {
						progressReporter.stepDone(step);
					});
				},
				null,
				function (): void {
					progressReporter.batchDone(["middleCountry", "systemConfig", "login", "gameConfig", "userInfo"]);
					doLaunch();
				},
				function (callback: (isAgree: boolean) => void): void {
					console.log("[Loading][UMP] onShowUmp called hasServiceInstance=" + !!umpService +
						" hasCallBack=" + !!callback +
						" umpNodeActiveBeforeShow=" + (this.umpNode ? this.umpNode.active : "null") +
						" umpNodeActiveInHierarchyBeforeShow=" + (this.umpNode ? this.umpNode.activeInHierarchy : "null"));
					if (umpService && callback) {
						umpService.show(function (isAgree: boolean): void {
							console.log("[Loading][UMP] onShowUmp callback isAgree=" + isAgree +
								" umpNodeActiveAfterChoice=" + (this.umpNode ? this.umpNode.active : "null") +
								" umpNodeActiveInHierarchyAfterChoice=" + (this.umpNode ? this.umpNode.activeInHierarchy : "null"));
							callback(isAgree);
						});
					} else {
						console.warn("[Loading][UMP] show fallback: service/callback missing, default reject");
						if (callback) {
							callback(false);
						}
					}
				}
			);
		};

		if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
			let gaidResolved = false;
			let gaidTimer: any = null;

			const onGaidResolved = (reason: string): void => {
				if (gaidResolved) {
					return;
				}
				gaidResolved = true;
				if (gaidTimer) {
					clearTimeout(gaidTimer);
					gaidTimer = null;
				}
				console.log("[Loading][GAID] resolved reason=" + reason);
				progressReporter.stepDone("waitGaid");
				runFlow();
			};

			const root: any = (typeof window !== "undefined" ? window : {}) as any;
			const branch: any = root.branch = root.branch || {};
			const prevModuleSerialNailed = branch.moduleSerialNailed;
			branch.moduleSerialNailed = function (): void {
				if (typeof prevModuleSerialNailed === "function") {
					prevModuleSerialNailed.apply(branch, arguments as any);
				}
				onGaidResolved("callback");
			};

			gaidTimer = setTimeout(function (): void {
				console.warn("[Loading][GAID] timeout 20000ms, proceed without GAID");
				onGaidResolved("timeout");
			}, 20000);

			console.log("[Loading][GAID] waiting for moduleSerialNailed (timeout=20000ms)");
		} else {
			console.log("[Loading][GAID] non-Android, skip GAID wait");
			progressReporter.stepDone("waitGaid");
			runFlow();
		}
	}

	private getURLParams(): { [key: string]: string } | null {
		const queryString: string | undefined = (typeof window !== "undefined" ? window as any : {})?.location?.search?.substring(1);
		const pairs: string[] | undefined = queryString ? queryString.split("&") : undefined;
		if (!pairs || pairs.length <= 0) {
			return null;
		}
		const params: { [key: string]: string } = {};
		for (let i = 0; i < pairs.length; i++) {
			const kv = pairs[i].split("=");
			const key = kv[0];
			const value = kv[1];
			if (key && value) {
				params[key] = value;
			}
		}
		return params;
	}

	private _animateProgressTo(ratio: number): void {
		if (this._isProgressPaused) {
			this._pendingProgressRatio = ratio;
			this._hasPendingProgress = true;
		} else {
			this._realProgress = Math.max(this._realProgress, Math.min(ratio, 1));
		}
	}

	public updateProgressBar(total: number, current: number): void {
		this._animateProgressTo(current / total);
	}

	public update(dt: number): void {
		if (this._isProgressPaused || !this.img_jindu) {
			return;
		}

		const target = this._realProgress;
		let current = this.img_jindu.fillRange || 0;

		if (current < target) {
			current += (target - current) * Math.min(4 * dt, 1);
			if (target - current < 0.002) {
				current = target;
			}
		} else {
			const limit = Math.min(target + 0.06, 0.99);
			if (current < limit) {
				current += 0.025 * dt;
				if (current > limit) {
					current = limit;
				}
			}
		}

		this.img_jindu.fillRange = current;
		this.progressBar.getComponentInChildren(cc.Label).string = Math.floor(100 * current) + "%";

		if (target >= 1 && current >= 0.999 && !this._sceneEntering) {
			this._sceneEntering = true;
			cc.assetManager.loadBundle("game", function (err: Error, bundle: cc.AssetManager.Bundle): void {
				if (err) {
					return;
				}
				bundle.loadDir("prefab", function (): void {
					UiPageAnalyticsService.trackLeave("launch_page");
					SceneMgr.getInstance().loadScene("lobby", "lobby");
				});
			});
		}
	}
}