import LanguageService from "./LanguageService";
import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";
import ResKeeper from "./ResKeeper";
import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import UIAnimation from "./UIAnimation";
import UIParams from "./UIParams";

export enum DestroyStrategy {
    CleanAll = 0,
    Destroy_KeepSelf_CleanDynamic = 1,
    Destroy_CleanSelfToScene_CleanDynamic = 2,
    DestroyOnly = 3,
    Hide_CleanDynamic = 4,
    HideOnly = 5
}

export interface IWaitOption {
    url: string;
    bundleName: string;
}

export interface IUIConfigOption {
    waitOption: IWaitOption;
    showWait: boolean;
    blockInputEvents: boolean;
    hasMask: boolean;
    maskColor: cc.Color;
    maskOpacity: number;
    maskBlockInputEvents: boolean;
    maskClickHide: boolean;
    backClosable: boolean;
    destroyStrategy: DestroyStrategy;
    animingClose: boolean;
    group: number;
}

interface IResMgrInstance {
    loadRes(url: string, type: any, onProgress: ((finished: number, total: number) => void) | null, bundleName?: string): Promise<any>;
    instantiateByUrl(url: string, onProgress: ((finished: number, total: number) => void) | null, bundleName: string | null, onLoad?: (finished: number, total: number) => void): Promise<cc.Node | null>;
    getKeeper(node: cc.Node): IResKeeperComp | null;
}

interface IResKeeperComp extends cc.Component {
    selfAsset: cc.Asset | null;
    addAsset(asset: cc.Asset): void;
    removeSelfAsset(): void;
    clearAll(): void;
}

interface IUIAnimationComp extends cc.Component {
    isShowAnim: boolean;
    isHideAnim: boolean;
    show(): Promise<any>;
    hide(): Promise<any>;
}

interface IUIParamsComp extends cc.Component {
    config?: UIConfig;
    params?: any[];
    runingAnim: boolean;
    init(config: UIConfig, params: any[] | undefined, order: number): void;
    parse(index: number, defaultValue?: any): any;
}

interface IWaitUI extends cc.Component {
    show(): void;
    hide(): void;
    progress(finished: number, total: number): void;
}

interface INativeBridge {
    showAppLongTapToast?(text: string, duration: number): void;
    exitApp?(): void;
}

interface IAndroidWindow extends Window {
    __ANDROID_BACK__?: () => boolean;
}

const DEFAULT_OPTION: IUIConfigOption = {
    waitOption: {
        url: "prefab/waitingUI",
        bundleName: "cocos-module-common"
    },
    showWait: true,
    blockInputEvents: true,
    hasMask: true,
    maskColor: cc.Color.BLACK,
    maskOpacity: 178.5,
    maskBlockInputEvents: true,
    maskClickHide: true,
    backClosable: true,
    destroyStrategy: DestroyStrategy.DestroyOnly,
    animingClose: false,
    group: -1
};

let currentOption: IUIConfigOption = DEFAULT_OPTION;

function getResMgr(): IResMgrInstance {
    return (ResMgr as any).getInstance() as IResMgrInstance;
}

function readUIParams(node: cc.Node | null | undefined): IUIParamsComp | null {
    if (!node) return null;
    return (node.getComponent(UIParams as any) as IUIParamsComp) || null;
}

function getUIAnimations(node: cc.Node): IUIAnimationComp[] {
    return (node.getComponents(UIAnimation as any) as IUIAnimationComp[]) || [];
}

function findWaitUI(node: cc.Node): IWaitUI | null {
    const components = node.getComponents(cc.Component);
    for (let i = 0; i < components.length; i++) {
        const component = components[i] as unknown as IWaitUI;
        if (component.show && component.hide && component.progress) {
            return component;
        }
    }
    return null;
}

export class UIConfig {
    public url: string;
    public bundle: string | null;
    public layerName?: string;

    public waitOption!: IWaitOption;
    public showWait!: boolean;
    public blockInputEvents!: boolean;
    public hasMask!: boolean;
    public maskColor!: cc.Color;
    public maskOpacity!: number;
    public maskBlockInputEvents!: boolean;
    public maskClickHide!: boolean;
    public backClosable!: boolean;
    public destroyStrategy!: DestroyStrategy;
    public animingClose!: boolean;
    public group!: number;

    constructor(url: string, bundle: string | null = null) {
        this.url = url;
        this.bundle = bundle;
        Object.assign(this, currentOption);
    }

    public setUrl(url: string, bundle: string | null = null): UIConfig {
        this.url = url;
        this.bundle = bundle;
        return this;
    }

    public setLayerName(layerName: string): UIConfig {
        this.layerName = layerName;
        return this;
    }

    public setBlockInputEvents(blockInputEvents: boolean): UIConfig {
        this.blockInputEvents = blockInputEvents;
        return this;
    }

    public setMaskColor(maskColor: cc.Color): UIConfig {
        this.maskColor = maskColor;
        return this;
    }

    public setMaskOpacity(maskOpacity: number): UIConfig {
        this.maskOpacity = maskOpacity;
        return this;
    }

    public setHasMask(hasMask: boolean): UIConfig {
        this.hasMask = hasMask;
        return this;
    }

    public setMaskBlockInputEvents(maskBlockInputEvents: boolean): UIConfig {
        this.maskBlockInputEvents = maskBlockInputEvents;
        return this;
    }

    public setMaskClickHide(maskClickHide: boolean): UIConfig {
        this.maskClickHide = maskClickHide;
        return this;
    }

    public setBackClosable(backClosable: boolean): UIConfig {
        this.backClosable = backClosable;
        return this;
    }

    public setDestroyStrategy(destroyStrategy: DestroyStrategy): UIConfig {
        this.destroyStrategy = destroyStrategy;
        return this;
    }

    public setAnimingClose(animingClose: boolean): UIConfig {
        this.animingClose = animingClose;
        return this;
    }

    public setGroup(group: number): UIConfig {
        this.group = group;
        return this;
    }

    public getId(): string {
        return (this.bundle ? (this.bundle ?? "") + "#" : "") + this.url;
    }

    public clone(target?: UIConfig): UIConfig {
        const config = target || new UIConfig(this.url, this.bundle);
        Object.assign(config, this);
        return config;
    }
}

export default class UIMgr extends Singleton {
    public static readonly EventType = {
        BEFORE_SHOW: "UIMgr_Event_Before_Show",
        SHOW: "UIMgr_Event_Show",
        ANIMATION_SHOW_COMPLETE: "UIMgr_EVENT_ANIMATION_SHOW_COMPLETE",
        BEFORE_HIDE: "UIMgr_Event_BEFORE_HIDE",
        ANIMATION_HIDE_COMPLETE: "UIMgr_EVENT_ANIMATION_HIDE_COMPLETE",
        HIDE: "UIMgr_Event_Hide",
        CHANGE_PARAMS: "UIParams_Event_Params_Change"
    };

    private _layerMgr: LayerMgr | null = null;
    public map: Map<string, cc.Node> = new Map();
    public loadingMap: Map<string, any[]> = new Map();
    public eventTarget: cc.EventTarget = new cc.EventTarget();
    public waitingUI: IWaitUI | null = null;
    public waitCount: number = 0;
    public deleteMap: Map<string, boolean> = new Map();
    private _androidBackBound: boolean = false;
    private _lastBackPressAt: number = 0;
    private _backExitGapMs: number = 2000;

    constructor() {
        super();
        this.loadWatingUI();
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this.beforeSceneLaunchHandle, this);
        this.bindAndroidBackBridge();
        this.bindAndroidBackKey();
    }

    public get uiRoot(): cc.Node | null {
        return this.layerMgr.uiRoot;
    }

    public set uiRoot(value: cc.Node | null) {
        this.layerMgr.uiRoot = value;
    }

    public get layerMgr(): LayerMgr {
        if (!this._layerMgr) {
            this._layerMgr = new LayerMgr();
        }
        return this._layerMgr;
    }

    public initLayer(layerNames: string[], defaultLayer: string | null = null): void {
        this.layerMgr.init(layerNames, defaultLayer);
    }

    public getDefaultLayerNode(): cc.Node {
        return this.layerMgr.getDefaultLayerNode();
    }

    public getTopLayerNode(): cc.Node {
        return this.layerMgr.getTopLayerNode();
    }

    public getLayerNode(layerName: string): cc.Node | null {
        return this.layerMgr.getLayerNode(layerName);
    }

    public loadWatingUI(): void {
        this.waitCount = 0;
        this.uiRoot = null;
        if (this.waitingUI && this.waitingUI.node && this.waitingUI.node.isValid) {
            this.waitingUI.node.destroy();
        }
        this.waitingUI = null;
        getResMgr().loadRes(currentOption.waitOption.url, cc.Prefab, null, currentOption.waitOption.bundleName).then((prefab) => {
            if (!prefab) return;
            const node = cc.instantiate(prefab);
            this.waitingUI = findWaitUI(node);
            if (!this.waitingUI) {
                console.error("Waiting UI component not found on node");
            }
        });
    }

    public beforeSceneLaunchHandle(): void {
        this.loadWatingUI();
        this.cleanInvalidUI();
    }

    private bindAndroidBackKey(): void {
        if (!this._androidBackBound && cc && cc.sys && cc.systemEvent && cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onAndroidKeyDown, this);
            this._androidBackBound = true;
        }
    }

    private bindAndroidBackBridge(): void {
        if (cc && cc.sys && cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            (window as IAndroidWindow).__ANDROID_BACK__ = () => this.handleAndroidBack();
        }
    }

    private onAndroidKeyDown(event: cc.Event.EventKeyboard): void {
        if (event && event.keyCode === cc.macro.KEY.back && this.handleAndroidBack()) {
            if (event.stopPropagation) event.stopPropagation();
            if (event.preventDefault) event.preventDefault();
        }
    }

    private _getNodeBackScore(node: cc.Node): number {
        if (!node || !node.isValid) return -1;
        const siblingIndex = node.getSiblingIndex ? node.getSiblingIndex() : 0;
        const parent = node.parent;
        const parentIndex = parent && parent.isValid && parent.getSiblingIndex ? parent.getSiblingIndex() : 0;
        return 100000 * parentIndex + siblingIndex;
    }

    public getTopVisibleUINode(): cc.Node | null {
        let topNode: cc.Node | null = null;
        let topScore = -1;
        this.map.forEach((node: cc.Node) => {
            if (node && node.isValid && node.active) {
                const params = readUIParams(node);
                if (params && params.config) {
                    const score = this._getNodeBackScore(node);
                    if (score >= topScore) {
                        topScore = score;
                        topNode = node;
                    }
                }
            }
        });
        return topNode;
    }

    public handleAndroidBack(): boolean {
        this.cleanInvalidUI();
        const topNode = this.getTopVisibleUINode();
        if (!topNode || !topNode.isValid) {
            return this.handleRootBackPress();
        }
        const params = readUIParams(topNode);
        const config = params && params.config;
        if (config && config.backClosable === false) {
            this._lastBackPressAt = 0;
            return true;
        }
        this._lastBackPressAt = 0;
        this.hide(topNode);
        return true;
    }

    private getExitToastText(): string {
        let text = "再按一次退出游戏";
        try {
            const service = LanguageService as unknown as { getCurrentLanguage?(): string };
            const language = service && service.getCurrentLanguage ? String(service.getCurrentLanguage()) : "";
            if (language === "id-ID") {
                text = "Tekan sekali lagi untuk keluar game";
            }
        } catch (e) {
        }
        return text;
    }

    private showNativeBackToast(): void {
        try {
            const adapter = NativeSdkBridgeAdapter as unknown as { getBridge?(): INativeBridge | null };
            const bridge = adapter && adapter.getBridge ? adapter.getBridge() : null;
            if (bridge && bridge.showAppLongTapToast) {
                bridge.showAppLongTapToast(this.getExitToastText(), 0);
            }
        } catch (e) {
            console.warn("[UIMgr] showNativeBackToast failed", e);
        }
    }

    private requestNativeExitApp(): void {
        try {
            const adapter = NativeSdkBridgeAdapter as unknown as { getBridge?(): INativeBridge | null };
            const bridge = adapter && adapter.getBridge ? adapter.getBridge() : null;
            if (bridge && bridge.exitApp) {
                bridge.exitApp();
            }
        } catch (e) {
            console.warn("[UIMgr] requestNativeExitApp failed", e);
        }
    }

    private handleRootBackPress(): boolean {
        const now = Date.now();
        if (now - this._lastBackPressAt <= this._backExitGapMs) {
            this._lastBackPressAt = 0;
            this.requestNativeExitApp();
            return true;
        }
        this._lastBackPressAt = now;
        this.showNativeBackToast();
        return true;
    }

    public setGlobalOption(option: Partial<IUIConfigOption>): void {
        currentOption = Object.assign(DEFAULT_OPTION, option);
        if (this.waitingUI && this.waitingUI.isValid && this.waitingUI.node) {
            this.waitingUI.node.destroy();
        }
        this.loadWatingUI();
    }

    public async show(config: UIConfig, ...params: any[]): Promise<cc.Node | null> {
        const id = config ? config.getId() : null;
        if (!id) return null;

        if (this.loadingMap.has(id)) {
            this.loadingMap.set(id, params);
            return null;
        }

        const startTime = Date.now();
        this.loadingMap.set(id, params);
        const cachedNode = this.map.get(id);
        if (config.showWait) {
            this.showWatingUI();
        }

        const loadingPromise: Promise<cc.Node | null> = (cachedNode && cachedNode.isValid)
            ? Promise.resolve(cachedNode)
            : new Promise<cc.Node | null>((resolve) => {
                getResMgr().instantiateByUrl(config.url, null, config.bundle, (finished, total) => {
                    if (config.showWait && this.waitingUI && this.waitingUI.isValid) {
                        this.waitingUI.progress(finished, total);
                    }
                }).then((node) => resolve(node));
            });

        if (config.group >= 0) {
            this.map.forEach((node: cc.Node, key: string) => {
                if (node && node.isValid && id !== key) {
                    const otherParams = readUIParams(node);
                    if (otherParams && otherParams.config && otherParams.config.group === config.group) {
                        this.hide(node);
                    }
                }
            });
        }

        const node = await loadingPromise;
        console.log(config.getId() + " 打开耗时: " + (Date.now() - startTime) + "ms");

        if (!node) {
            console.error("ui打开错误 ", config.url, config.bundle);
            if (config.showWait) {
                this.hideWatingUI();
            }
            return null;
        }

        try {
            const layerName = config.layerName ?? this.layerMgr.getDefaultLayerName();
            const layerNode = this.layerMgr.getLayerNode(layerName) ?? this.layerMgr.getDefaultLayerNode();
            const childIndex = layerNode.children.length + (config.hasMask ? 1 : 0);

            let paramsComp = readUIParams(node);
            if (!paramsComp) {
                paramsComp = node.addComponent(UIParams as any) as IUIParamsComp;
            }
            const uiParams = paramsComp;
            uiParams.init(config, this.loadingMap.get(id), childIndex);

            node.active = true;
            this.map.set(id, node);
            this.loadingMap.delete(id);
            this.eventTarget.emit(UIMgr.EventType.BEFORE_SHOW, id, node);

            const animations = getUIAnimations(node).filter((animation) => animation.isShowAnim);
            uiParams.runingAnim = animations.length > 0;
            layerNode.insertChild(node, childIndex);
            if (config.showWait) {
                this.hideWatingUI();
            }

            if (animations.length > 0) {
                Promise.all(animations.map((animation) => animation.show())).then(() => {
                    if (node && node.isValid) {
                        uiParams.runingAnim = false;
                        node.emit(UIMgr.EventType.ANIMATION_SHOW_COMPLETE);
                        this.eventTarget.emit(UIMgr.EventType.ANIMATION_SHOW_COMPLETE, id, node);
                    }
                });
            }

            this.eventTarget.emit(UIMgr.EventType.SHOW, id, node);
            return node;
        } catch (err) {
            console.error("ui打开错误 ", config ? config.url : undefined, config ? config.bundle : undefined, err);
            return null;
        }
    }

    public setUIParams(config: UIConfig, ...params: any[]): void {
        if (!this.isShow(config)) return;
        const uiParams = readUIParams(this.map.get(config.getId()));
        if (uiParams) {
            uiParams.params = params;
            this.eventTarget.emit(UIMgr.EventType.CHANGE_PARAMS, config.getId(), uiParams.node);
        }
    }

    public getUIParams(config: UIConfig, index: number, defaultValue?: any): any {
        if (!this.isShow(config)) return null;
        const uiParams = readUIParams(this.map.get(config.getId()));
        if (!uiParams) return null;
        return index < 0 ? uiParams.params : uiParams.parse(index, defaultValue);
    }

    public isShow(config: UIConfig): boolean {
        const node = this.map.get(config.getId());
        return !!(node && node.isValid && node.active);
    }

    public getUINode(config: UIConfig): cc.Node | null {
        const node = this.map.get(config.getId());
        return node && node.isValid ? node : null;
    }

    public cleanInvalidUI(): void {
        this.map.forEach((node: cc.Node, key: string) => {
            if (!node.isValid) {
                this.map.delete(key);
            }
        });
    }

    public async hide(target: UIConfig | cc.Node): Promise<void> {
        let id: string | null = null;
        if (target instanceof cc.Node) {
            const nodeParams = readUIParams(target);
            id = nodeParams && nodeParams.config ? nodeParams.config.getId() : null;
        } else if (target) {
            id = target.getId();
        }

        if (!id || !this.map.has(id)) return;

        const node = this.map.get(id);
        if (!node || !node.isValid) {
            this.map.delete(id);
            return;
        }

        if (this.deleteMap.get(id)) return;

        const params = readUIParams(node);
        if (params && params.runingAnim && (!params.config || !params.config.animingClose)) {
            return;
        }

        this.deleteMap.set(id, true);
        this.eventTarget.emit(UIMgr.EventType.BEFORE_HIDE, id, node);
        if (params) {
            params.runingAnim = true;
        }

        let closePromise: Promise<any> = Promise.resolve();
        const animations = getUIAnimations(node).filter((animation) => animation.isHideAnim);
        if (animations.length > 0) {
            closePromise = Promise.all(animations.map((animation) => animation.hide()));
        }
        await closePromise;

        if (params) {
            params.runingAnim = false;
        }
        node.emit(UIMgr.EventType.ANIMATION_HIDE_COMPLETE);
        this.eventTarget.emit(UIMgr.EventType.ANIMATION_HIDE_COMPLETE, id, node);

        const strategy = params && params.config ? params.config.destroyStrategy : DestroyStrategy.DestroyOnly;
        const keeper = node.getComponent(ResKeeper as any) as IResKeeperComp | null;

        if (strategy === DestroyStrategy.Destroy_KeepSelf_CleanDynamic ||
            strategy === DestroyStrategy.Destroy_CleanSelfToScene_CleanDynamic ||
            strategy === DestroyStrategy.Hide_CleanDynamic) {
            if (keeper) {
                keeper.removeSelfAsset();
            }
            if (strategy === DestroyStrategy.Destroy_CleanSelfToScene_CleanDynamic) {
                const canvasKeeper = getResMgr().getKeeper(cc.Canvas.instance.node);
                const selfAsset = keeper ? keeper.selfAsset : null;
                if (canvasKeeper && selfAsset) {
                    canvasKeeper.addAsset(selfAsset);
                }
                if (selfAsset) {
                    selfAsset.decRef();
                }
            }
        }

        if (strategy === DestroyStrategy.DestroyOnly || strategy === DestroyStrategy.HideOnly) {
            if (keeper) {
                keeper.clearAll();
            }
        }

        if (strategy === DestroyStrategy.CleanAll ||
            strategy === DestroyStrategy.Destroy_KeepSelf_CleanDynamic ||
            strategy === DestroyStrategy.Destroy_CleanSelfToScene_CleanDynamic ||
            strategy === DestroyStrategy.DestroyOnly) {
            node.emit(UIMgr.EventType.HIDE);
            node.destroy();
            this.map.delete(id);
        } else {
            node.active = false;
            node.emit(UIMgr.EventType.HIDE);
        }

        this.deleteMap.delete(id);
        this.eventTarget.emit(UIMgr.EventType.HIDE, id, node);
    }

    public showWatingUI(): void {
        if (!this.waitingUI || !this.waitingUI.isValid) return;
        this.waitCount++;
        const widget = this.waitingUI.node.getComponent(cc.Widget);
        if (widget) {
            widget.updateAlignment();
        }
        this.waitingUI.node.parent = this.getTopLayerNode();
        this.waitingUI.node.zIndex = cc.macro.MAX_ZINDEX;
        this.waitingUI.show();
    }

    public hideWatingUI(): void {
        if (!this.waitingUI || !this.waitingUI.isValid) return;
        this.waitCount = Math.max(0, this.waitCount - 1);
        if (this.waitCount <= 0) {
            this.waitingUI.hide();
        }
    }

    public setBlockInputEvents(block: boolean): void {
        this.layerMgr.getBlockInputNode().active = block;
    }

    public on(type: string, callback: (...args: any[]) => void, target?: any): void {
        this.eventTarget.on(type, callback, target);
    }

    public once(type: string, callback: (...args: any[]) => void, target?: any): void {
        this.eventTarget.once(type, callback, target);
    }

    public off(type: string, callback?: (...args: any[]) => void, target?: any): void {
        this.eventTarget.off(type, callback, target);
    }

    public targetOff(target: any): void {
        this.eventTarget.targetOff(target);
    }
}

export class LayerMgr {
    public uiRoot: cc.Node | null = null;
    public layerMap: Map<string, cc.Node> = new Map();
    public names: string[] = [];
    public defaultLayer: string | null = null;
    public globalBlockInputNode: cc.Node | null = null;

    public createNode(name: string, parent: cc.Node | null = null): cc.Node {
        const node = new cc.Node(name);
        node.parent = parent || (this.uiRoot ?? cc.Canvas.instance.node);
        node.width = cc.winSize.width;
        node.height = cc.winSize.height;
        const widget = node.addComponent(cc.Widget);
        widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
        widget.top = widget.bottom = widget.left = widget.right = 0;
        widget.target = cc.Canvas.instance.node;
        widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
        return node;
    }

    public init(layerNames: string[], defaultLayer: string | null = null): void {
        if (!layerNames || layerNames.length <= 0) return;
        this.names = layerNames;
        this.defaultLayer = defaultLayer;
        layerNames.forEach((name) => {
            const node = this.createNode("layer_" + name);
            this.layerMap.set(name, node);
        });
    }

    public getDefaultLayerName(): string {
        return this.defaultLayer ?? this.names[0];
    }

    public setDefaultLayerName(layerName: string): void {
        this.defaultLayer = layerName;
    }

    public getDefaultLayerNode(): cc.Node {
        let root = this.uiRoot;
        if (root && !root.isValid) {
            root = null;
        }
        const layerNode = this.getLayerNode(this.getDefaultLayerName());
        return layerNode ?? root ?? cc.Canvas.instance.node;
    }

    public getTopLayerNode(): cc.Node {
        let root = this.uiRoot;
        if (root && !root.isValid) {
            root = null;
        }
        const layerNode = this.getLayerNode(this.names[this.names.length - 1]);
        return layerNode ?? root ?? cc.Canvas.instance.node;
    }

    public getLayerNode(layerName: string): cc.Node | null {
        if (layerName == null) return null;
        const node = this.layerMap.get(layerName);
        if (!node || !node.isValid) {
            if (this.names.length <= 0) return null;
            this.init(this.names, this.defaultLayer);
        }
        return this.layerMap.get(layerName) ?? null;
    }

    public getBlockInputNode(): cc.Node {
        if (!this.globalBlockInputNode || !this.globalBlockInputNode.isValid) {
            const node = this.createNode("blockInput", this.getTopLayerNode());
            node.addComponent(cc.BlockInputEvents);
            this.globalBlockInputNode = node;
        }
        this.globalBlockInputNode.zIndex = cc.macro.MAX_ZINDEX;
        return this.globalBlockInputNode;
    }
}