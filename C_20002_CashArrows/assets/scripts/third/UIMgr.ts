import LanguageService from "./LanguageService";
import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";
import ResKeeper from "./ResKeeper";
import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import UIAnimation from "./UIAnimation";
import { UIParams } from "./UIParams";

declare global {
    interface Window {
        __ANDROID_BACK__?: () => boolean;
    }
}

export enum DestroyStrategy {
    CleanAll = 0,
    Destroy_KeepSelf_CleanDynamic = 1,
    Destroy_CleanSelfToScene_CleanDynamic = 2,
    DestroyOnly = 3,
    Hide_CleanDynamic = 4,
    HideOnly = 5,
}

const defaultGlobalOption = {
    waitOption: {
        url: "prefab/waitingUI",
        bundleName: "cocos-module-common",
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
    group: -1,
};

let globalOption = { ...defaultGlobalOption };

export class UIConfig {
    url: string;
    bundle?: string;
    layerName?: string;
    showWait = globalOption.showWait;
    blockInputEvents = globalOption.blockInputEvents;
    hasMask = globalOption.hasMask;
    maskColor = globalOption.maskColor;
    maskOpacity = globalOption.maskOpacity;
    maskBlockInputEvents = globalOption.maskBlockInputEvents;
    maskClickHide = globalOption.maskClickHide;
    backClosable = globalOption.backClosable;
    destroyStrategy = globalOption.destroyStrategy;
    animingClose = globalOption.animingClose;
    group = globalOption.group;

    constructor(url: string, bundle?: string) {
        this.url = url;
        this.bundle = bundle;
        Object.assign(this, globalOption);
    }

    setUrl(url: string, bundle?: string): this {
        this.url = url;
        this.bundle = bundle;
        return this;
    }

    setLayerName(layerName: string): this {
        this.layerName = layerName;
        return this;
    }

    setBlockInputEvents(value: boolean): this {
        this.blockInputEvents = value;
        return this;
    }

    setMaskColor(color: cc.Color): this {
        this.maskColor = color;
        return this;
    }

    setMaskOpacity(opacity: number): this {
        this.maskOpacity = opacity;
        return this;
    }

    setHasMask(value: boolean): this {
        this.hasMask = value;
        return this;
    }

    setMaskBlockInputEvents(value: boolean): this {
        this.maskBlockInputEvents = value;
        return this;
    }

    setMaskClickHide(value: boolean): this {
        this.maskClickHide = value;
        return this;
    }

    setBackClosable(value: boolean): this {
        this.backClosable = value;
        return this;
    }

    setDestroyStrategy(strategy: DestroyStrategy): this {
        this.destroyStrategy = strategy;
        return this;
    }

    setAnimingClose(value: boolean): this {
        this.animingClose = value;
        return this;
    }

    setGroup(group: number): this {
        this.group = group;
        return this;
    }

    getId(): string {
        return (this.bundle ? (this.bundle ?? "") + "#" : "") + this.url;
    }

    clone(target?: UIConfig): UIConfig {
        if (!target) {
            target = new UIConfig(this.url, this.bundle);
        }
        Object.assign(target, this);
        return target;
    }
}

interface WaitingUIComponent extends cc.Component {
    show(): void;
    hide(): void;
    progress(finished: number, total: number): void;
}

class LayerMgr {
    uiRoot: cc.Node | null = null;
    layerMap = new Map<string, cc.Node>();
    names: string[] = [];
    defaultLayer: string | null = null;
    globalBlockInputNode: cc.Node | null = null;

    createNode(name: string, parent: cc.Node | null = null): cc.Node {
        const node = new cc.Node(name);
        node.parent = parent || this.uiRoot || cc.Canvas.instance.node;
        node.width = cc.winSize.width;
        node.height = cc.winSize.height;
        const widget = node.addComponent(cc.Widget);
        widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
        widget.top = widget.bottom = widget.left = widget.right = 0;
        widget.target = cc.Canvas.instance.node;
        widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
        return node;
    }

    init(names: string[], defaultLayer: string | null = null): void {
        if (!names || names.length <= 0) {
            return;
        }
        this.names = names;
        this.defaultLayer = defaultLayer;
        names.forEach((name) => {
            const layerNode = this.createNode("layer_" + name);
            this.layerMap.set(name, layerNode);
        });
    }

    getDefaultLayerName(): string {
        return this.defaultLayer ?? this.names[0];
    }

    setDefaultLayerName(name: string): void {
        this.defaultLayer = name;
    }

    getDefaultLayerNode(): cc.Node {
        let uiRoot = this.uiRoot;
        if (uiRoot && !uiRoot.isValid) {
            uiRoot = null;
        }
        return this.getLayerNode(this.getDefaultLayerName()) ?? uiRoot ?? cc.Canvas.instance.node;
    }

    getTopLayerNode(): cc.Node {
        let uiRoot = this.uiRoot;
        if (uiRoot && !uiRoot.isValid) {
            uiRoot = null;
        }
        return this.getLayerNode(this.names[this.names.length - 1]) ?? uiRoot ?? cc.Canvas.instance.node;
    }

    getLayerNode(name: string | null | undefined): cc.Node | null {
        if (name == null) {
            return null;
        }
        const layerNode = this.layerMap.get(name);
        if (!layerNode || !layerNode.isValid) {
            if (this.names.length <= 0) {
                return null;
            }
            this.init(this.names, this.defaultLayer);
        }
        return this.layerMap.get(name) || null;
    }

    getBlockInputNode(): cc.Node {
        if (!this.globalBlockInputNode || !this.globalBlockInputNode.isValid) {
            const node = this.createNode("blockInput", this.getTopLayerNode());
            node.addComponent(cc.BlockInputEvents);
            this.globalBlockInputNode = node;
        }
        this.globalBlockInputNode.zIndex = cc.macro.MAX_ZINDEX;
        return this.globalBlockInputNode;
    }
}

function findWaitingUIComponent(node: cc.Node): WaitingUIComponent | null {
    const components = node.getComponents(cc.Component);
    for (let i = 0; i < components.length; i++) {
        const component = components[i] as WaitingUIComponent;
        if (component.show && component.hide && component.progress) {
            return component;
        }
    }
    return null;
}

export default class UIMgr extends Singleton {
    static EventType = {
        BEFORE_SHOW: "UIMgr_Event_Before_Show",
        SHOW: "UIMgr_Event_Show",
        ANIMATION_SHOW_COMPLETE: "UIMgr_EVENT_ANIMATION_SHOW_COMPLETE",
        BEFORE_HIDE: "UIMgr_Event_BEFORE_HIDE",
        ANIMATION_HIDE_COMPLETE: "UIMgr_EVENT_ANIMATION_HIDE_COMPLETE",
        HIDE: "UIMgr_Event_Hide",
        CHANGE_PARAMS: "UIParams_Event_Params_Change",
    };

    _layerMgr: LayerMgr | null = null;
    map = new Map<string, cc.Node>();
    loadingMap = new Map<string, any[]>();
    eventTarget = new cc.EventTarget();
    waitingUI: WaitingUIComponent | null = null;
    waitCount = 0;
    deleteMap = new Map<string, boolean>();
    _androidBackBound = false;
    _lastBackPressAt = 0;
    _backExitGapMs = 2000;

    constructor() {
        super();
        this.loadWatingUI();
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this.beforeSceneLaunchHandle, this);
        this.bindAndroidBackBridge();
        this.bindAndroidBackKey();
    }

    get uiRoot(): cc.Node | null {
        return this.layerMgr.uiRoot;
    }

    set uiRoot(value: cc.Node | null) {
        this.layerMgr.uiRoot = value;
    }

    get layerMgr(): LayerMgr {
        if (!this._layerMgr) {
            this._layerMgr = new LayerMgr();
        }
        return this._layerMgr;
    }

    initLayer(names: string[], defaultLayer: string | null = null): void {
        this.layerMgr.init(names, defaultLayer);
    }

    getDefaultLayerNode(): cc.Node {
        return this.layerMgr.getDefaultLayerNode();
    }

    getTopLayerNode(): cc.Node {
        return this.layerMgr.getTopLayerNode();
    }

    getLayerNode(name: string): cc.Node | null {
        return this.layerMgr.getLayerNode(name);
    }

    loadWatingUI(): void {
        this.waitCount = 0;
        this.uiRoot = null;
        if (this.waitingUI?.node?.isValid) {
            this.waitingUI.node.destroy();
        }
        this.waitingUI = null;
        ResMgr.getInstance()
            .loadRes(defaultGlobalOption.waitOption.url, cc.Prefab, null, defaultGlobalOption.waitOption.bundleName)
            ?.then((prefab: cc.Prefab) => {
                if (prefab) {
                    const node = cc.instantiate(prefab);
                    this.waitingUI = findWaitingUIComponent(node);
                    if (!this.waitingUI) {
                        console.error("Waiting UI component not found on node");
                    }
                }
            });
    }

    beforeSceneLaunchHandle(): void {
        this.loadWatingUI();
        this.cleanInvalidUI();
    }

    bindAndroidBackKey(): void {
        if (
            !this._androidBackBound &&
            cc &&
            cc.sys &&
            cc.systemEvent &&
            cc.sys.isNative &&
            cc.sys.os === cc.sys.OS_ANDROID
        ) {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onAndroidKeyDown, this);
            this._androidBackBound = true;
        }
    }

    bindAndroidBackBridge(): void {
        if (cc && cc.sys && cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            window.__ANDROID_BACK__ = () => this.handleAndroidBack();
        }
    }

    onAndroidKeyDown(event: cc.Event.EventKeyboard): void {
        if (event && event.keyCode === cc.macro.KEY.back && this.handleAndroidBack()) {
            event.stopPropagation?.();
            event.preventDefault?.();
        }
    }

    _getNodeBackScore(node: cc.Node): number {
        if (!node || !node.isValid) {
            return -1;
        }
        const siblingIndex = node.getSiblingIndex ? node.getSiblingIndex() : 0;
        const parentIndex =
            node.parent && node.parent.isValid && node.parent.getSiblingIndex
                ? node.parent.getSiblingIndex()
                : 0;
        return 100000 * parentIndex + siblingIndex;
    }

    getTopVisibleUINode(): cc.Node | null {
        let topNode: cc.Node | null = null;
        let topScore = -1;
        this.map.forEach((node) => {
            if (node && node.isValid && node.active) {
                const params = node.getComponent(UIParams);
                if (params && params.config) {
                    const score = this._getNodeBackScore(node);
                    if (score >= topScore) {
                        topScore = score;
                        topNode = node;
                    }
                }
            }
        }, this);
        return topNode;
    }

    handleAndroidBack(): boolean {
        this.cleanInvalidUI();
        const topNode = this.getTopVisibleUINode();
        if (!topNode || !topNode.isValid) {
            return this.handleRootBackPress();
        }
        const params = topNode.getComponent(UIParams);
        const config = params && params.config;
        if (config && config.backClosable === false) {
            this._lastBackPressAt = 0;
            return true;
        }
        this._lastBackPressAt = 0;
        this.hide(topNode);
        return true;
    }

    getExitToastText(): string {
        let text = "再按一次退出游戏";
        try {
            if (LanguageService.getCurrentLanguage?.() === "id-ID") {
                text = "Tekan sekali lagi untuk keluar game";
            }
        } catch (_error) {
        }
        return text;
    }

    showNativeBackToast(): void {
        try {
            const bridge = NativeSdkBridgeAdapter.getBridge?.();
            if (bridge?.showAppLongTapToast) {
                bridge.showAppLongTapToast(this.getExitToastText(), 0);
            }
        } catch (error) {
            console.warn("[UIMgr] showNativeBackToast failed", error);
        }
    }

    requestNativeExitApp(): void {
        try {
            const bridge = NativeSdkBridgeAdapter.getBridge?.();
            if (bridge?.exitApp) {
                bridge.exitApp();
            }
        } catch (error) {
            console.warn("[UIMgr] requestNativeExitApp failed", error);
        }
    }

    handleRootBackPress(): boolean {
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

    setGlobalOption(option: Partial<typeof defaultGlobalOption>): void {
        globalOption = Object.assign({}, defaultGlobalOption, option);
        if (this.waitingUI?.isValid && this.waitingUI.node?.isValid) {
            this.waitingUI.node.destroy();
        }
        this.loadWatingUI();
    }

    async show(config: UIConfig, ...args: any[]): Promise<cc.Node | null> {
        const id = config?.getId();
        if (!id) {
            return null;
        }
        if (this.loadingMap.has(id)) {
            this.loadingMap.set(id, args);
            return null;
        }
        const startTime = Date.now();
        this.loadingMap.set(id, args);
        const cachedNode = this.map.get(id);
        if (config.showWait) {
            this.showWatingUI();
        }
        const nodePromise =
            cachedNode?.isValid
                ? Promise.resolve(cachedNode)
                : new Promise<cc.Node | null>((resolve) => {
                    ResMgr.getInstance()
                        .instantiateByUrl(config.url, null, config.bundle, (finished, total) => {
                            if (config.showWait && this.waitingUI?.isValid) {
                                this.waitingUI?.progress?.(finished, total);
                            }
                        })
                        .then((node) => resolve(node));
                });
        if (config.group >= 0) {
            this.map.forEach((node, mapId) => {
                if (node?.isValid && id !== mapId) {
                    const params = node.getComponent(UIParams);
                    if (params?.config?.group === config.group) {
                        this.hide(node);
                    }
                }
            });
        }
        const node = await nodePromise;
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
            const insertIndex = layerNode.children.length + (config.hasMask ? 1 : 0);
            const uiParams = node.getComponent(UIParams) ?? node.addComponent(UIParams);
            uiParams.init(config, this.loadingMap.get(id), insertIndex);
            node.active = true;
            this.map.set(id, node);
            this.loadingMap.delete(id);
            this.eventTarget.emit(UIMgr.EventType.BEFORE_SHOW, id, node);
            const showAnimations = node.getComponents(UIAnimation).filter((animation) => animation.isShowAnim);
            uiParams.runingAnim = showAnimations.length > 0;
            layerNode.insertChild(node, insertIndex);
            if (config.showWait) {
                this.hideWatingUI();
            }
            if (showAnimations.length > 0) {
                Promise.all(showAnimations.map((animation) => animation.show())).then(() => {
                    if (node?.isValid) {
                        uiParams.runingAnim = false;
                        node.emit(UIMgr.EventType.ANIMATION_SHOW_COMPLETE);
                        this.eventTarget.emit(UIMgr.EventType.ANIMATION_SHOW_COMPLETE, id, node);
                    }
                });
            }
            this.eventTarget.emit(UIMgr.EventType.SHOW, id, node);
            return node;
        } catch (error) {
            console.error("ui打开错误 ", config?.url, config?.bundle, error);
            return null;
        }
    }

    setUIParams(config: UIConfig, ...args: any[]): void {
        if (this.isShow(config)) {
            const node = this.map.get(config.getId());
            const uiParams = node?.getComponent(UIParams);
            if (uiParams) {
                uiParams.params = args;
                this.eventTarget.emit(UIMgr.EventType.CHANGE_PARAMS, config.getId(), uiParams.node);
            }
        }
    }

    getUIParams(config: UIConfig, index: number, fallback?: any): any {
        if (!this.isShow(config)) {
            return null;
        }
        const node = this.map.get(config.getId());
        const uiParams = node?.getComponent(UIParams);
        if (!uiParams) {
            return null;
        }
        if (index < 0) {
            return uiParams.params;
        }
        return uiParams.parse(index, fallback);
    }

    isShow(config: UIConfig): boolean {
        const id = config.getId();
        const node = this.map.get(id);
        return !!(node && node.isValid && node.active);
    }

    getUINode(config: UIConfig): cc.Node | null {
        const id = config.getId();
        const node = this.map.get(id);
        return node && node.isValid ? node : null;
    }

    cleanInvalidUI(): void {
        this.map.forEach((node, id) => {
            if (!node.isValid) {
                this.map.delete(id);
            }
        });
    }

    hide(target: cc.Node | UIConfig): Promise<void> {
        return new Promise((resolve) => {
            let id: string | undefined;
            if (target instanceof cc.Node) {
                id = target.getComponent(UIParams)?.config?.getId();
            } else {
                id = target?.getId();
            }
            if (!id || !this.map.has(id)) {
                resolve();
                return;
            }
            const node = this.map.get(id);
            if (!node || !node.isValid) {
                this.map.delete(id);
                resolve();
                return;
            }
            if (this.deleteMap.get(id)) {
                resolve();
                return;
            }
            const uiParams = node.getComponent(UIParams);
            if (uiParams?.runingAnim && !uiParams.config.animingClose) {
                resolve();
                return;
            }
            this.deleteMap.set(id, true);
            this.eventTarget.emit(UIMgr.EventType.BEFORE_HIDE, id, node);
            uiParams.runingAnim = true;
            let animationPromise: Promise<any> = Promise.resolve();
            const hideAnimations = node.getComponents(UIAnimation).filter((animation) => animation.isHideAnim);
            if (hideAnimations.length > 0) {
                animationPromise = Promise.all(hideAnimations.map((animation) => animation.hide()));
            }
            animationPromise.then(() => {
                uiParams.runingAnim = false;
                node.emit(UIMgr.EventType.ANIMATION_HIDE_COMPLETE);
                this.eventTarget.emit(UIMgr.EventType.ANIMATION_HIDE_COMPLETE, id, node);
                const strategy = uiParams.config.destroyStrategy;
                const resKeeper = node.getComponent(ResKeeper);
                if (
                    strategy === DestroyStrategy.Destroy_KeepSelf_CleanDynamic ||
                    strategy === DestroyStrategy.Destroy_CleanSelfToScene_CleanDynamic ||
                    strategy === DestroyStrategy.Hide_CleanDynamic
                ) {
                    resKeeper?.removeSelfAsset();
                    if (strategy === DestroyStrategy.Destroy_CleanSelfToScene_CleanDynamic) {
                        ResMgr.getInstance().getKeeper(cc.Canvas.instance.node)?.addAsset(resKeeper?.selfAsset);
                        resKeeper?.selfAsset?.decRef();
                    }
                }
                if (
                    strategy === DestroyStrategy.DestroyOnly ||
                    strategy === DestroyStrategy.HideOnly
                ) {
                    resKeeper?.clearAll();
                }
                if (
                    strategy === DestroyStrategy.CleanAll ||
                    strategy === DestroyStrategy.Destroy_KeepSelf_CleanDynamic ||
                    strategy === DestroyStrategy.Destroy_CleanSelfToScene_CleanDynamic ||
                    strategy === DestroyStrategy.DestroyOnly
                ) {
                    node.emit(UIMgr.EventType.HIDE);
                    node.destroy();
                    this.map.delete(id);
                } else {
                    node.active = false;
                    node.emit(UIMgr.EventType.HIDE);
                }
                this.deleteMap.delete(id);
                resolve();
                this.eventTarget.emit(UIMgr.EventType.HIDE, id, node);
            });
        });
    }

    showWatingUI(): void {
        if (this.waitingUI?.isValid) {
            this.waitCount++;
            this.waitingUI.node?.getComponent(cc.Widget)?.updateAlignment();
            this.waitingUI.node.parent = this.getTopLayerNode();
            this.waitingUI.node.zIndex = cc.macro.MAX_ZINDEX;
            this.waitingUI.show();
        }
    }

    hideWatingUI(): void {
        if (this.waitingUI?.isValid) {
            this.waitCount = Math.max(0, this.waitCount - 1);
            if (this.waitCount <= 0) {
                this.waitingUI.hide();
            }
        }
    }

    setBlockInputEvents(value: boolean): void {
        this.layerMgr.getBlockInputNode().active = value;
    }

    on(event: string, callback: Function, target?: any): void {
        this.eventTarget.on(event, callback, target);
    }

    once(event: string, callback: Function, target?: any): void {
        this.eventTarget.once(event, callback, target);
    }

    off(event: string, callback?: Function, target?: any): void {
        this.eventTarget.off(event, callback, target);
    }

    targetOff(target: any): void {
        this.eventTarget.targetOff(target);
    }
}
