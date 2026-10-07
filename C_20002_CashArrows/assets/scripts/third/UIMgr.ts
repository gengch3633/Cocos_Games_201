import LanguageService from "./LanguageService";
import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";
import ResKeeper from "./ResKeeper";
import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import UIAnimation from "./UIAnimation";
import { UIParams } from "./UIParams";

export enum DestroyStrategy {
    CleanAll = 0,
    Destroy_KeepSelf_CleanDynamic = 1,
    Destroy_CleanSelfToScene_CleanDynamic = 2,
    DestroyOnly = 3,
    Hide_CleanDynamic = 4,
    HideOnly = 5
}

const defaultGlobalOption = {
    waitOption: {
        url: " prefab/ waitingUI ",
        bundleName: " cocos- module- common "
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

let globalUiOption = { ...defaultGlobalOption };

export class UIConfig {
    url: string;
    bundle: string;
    layerName?: string;
    showWait: boolean = globalUiOption.showWait;
    blockInputEvents: boolean = globalUiOption.blockInputEvents;
    hasMask: boolean = globalUiOption.hasMask;
    maskColor: cc.Color = globalUiOption.maskColor;
    maskOpacity: number = globalUiOption.maskOpacity;
    maskBlockInputEvents: boolean = globalUiOption.maskBlockInputEvents;
    maskClickHide: boolean = globalUiOption.maskClickHide;
    backClosable: boolean = globalUiOption.backClosable;
    destroyStrategy: DestroyStrategy = globalUiOption.destroyStrategy;
    animingClose: boolean = globalUiOption.animingClose;
    group: number = globalUiOption.group;

    constructor(url: string, bundle?: string) {
        this.url = url;
        this.bundle = bundle;
        Object.assign(this, globalUiOption);
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
        return (this.bundle ? (this.bundle ?? " ") + " # " : " ") + this.url;
    }

    clone(target?: UIConfig): UIConfig {
        if (!target) {
            target = new UIConfig(this.url, this.bundle);
        }
        Object.assign(target, this);
        return target;
    }
}

class LayerMgr {
    uiRoot: cc.Node = null;
    layerMap: Map<string, cc.Node> = new Map();
    names: string[] = [];
    defaultLayer: string = null;
    globalBlockInputNode: cc.Node = null;

    createNode(name: string, parent: cc.Node = null): cc.Node {
        const node = new cc.Node(name);
        node.parent = parent ?? this.uiRoot ?? cc.Canvas.instance.node;
        node.width = cc.winSize.width;
        node.height = cc.winSize.height;
        const widget = node.addComponent(cc.Widget);
        widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
        widget.top = widget.bottom = widget.left = widget.right = 0;
        widget.target = cc.Canvas.instance.node;
        widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
        return node;
    }

    init(names: string[], defaultLayer: string = null): void {
        if (!names || names.length <= 0) {
            return;
        }
        this.names = names;
        this.defaultLayer = defaultLayer;
        names.forEach((name) => {
            const layerNode = this.createNode(" layer_ " + name);
            this.layerMap.set(name, layerNode);
        });
    }

    getDefaultLayerName(): string {
        return this.defaultLayer != null ? this.defaultLayer : this.names[0];
    }

    setDefaultLayerName(name: string): void {
        this.defaultLayer = name;
    }

    getDefaultLayerNode(): cc.Node {
        let root = this.uiRoot;
        if (root && !root.isValid) {
            root = null;
        }
        return this.getLayerNode(this.getDefaultLayerName()) ?? root ?? cc.Canvas.instance.node;
    }

    getTopLayerNode(): cc.Node {
        let root = this.uiRoot;
        if (root && !root.isValid) {
            root = null;
        }
        return this.getLayerNode(this.names[this.names.length - 1]) ?? root ?? cc.Canvas.instance.node;
    }

    getLayerNode(name: string): cc.Node {
        if (name == null) {
            return null;
        }
        let layerNode = this.layerMap.get(name);
        if (!layerNode || !layerNode.isValid) {
            if (this.names.length <= 0) {
                return null;
            }
            this.init(this.names, this.defaultLayer);
        }
        return this.layerMap.get(name);
    }

    getBlockInputNode(): cc.Node {
        if (!this.globalBlockInputNode || !this.globalBlockInputNode.isValid) {
            const node = this.createNode(" blockInput ", this.getTopLayerNode());
            node.addComponent(cc.BlockInputEvents);
            this.globalBlockInputNode = node;
        }
        this.globalBlockInputNode.zIndex = cc.macro.MAX_ZINDEX;
        return this.globalBlockInputNode;
    }
}

interface WaitingUI {
    node: cc.Node;
    isValid: boolean;
    show(): void;
    hide(): void;
    progress(finished: number, total: number): void;
}

function getWaitingUIComponent(node: cc.Node): WaitingUI {
    const components = node.getComponents(cc.Component);
    for (let i = 0; i < components.length; i++) {
        const component = components[i] as any;
        if (component.show && component.hide && component.progress) {
            return component;
        }
    }
    return null;
}

export default class UIMgr extends Singleton {
    static EventType = {
        BEFORE_SHOW: " UIMgr_Event_Before_Show ",
        SHOW: " UIMgr_Event_Show ",
        ANIMATION_SHOW_COMPLETE: " UIMgr_EVENT_ANIMATION_SHOW_COMPLETE ",
        BEFORE_HIDE: " UIMgr_Event_BEFORE_HIDE ",
        ANIMATION_HIDE_COMPLETE: " UIMgr_EVENT_ANIMATION_HIDE_COMPLETE ",
        HIDE: " UIMgr_Event_Hide ",
        CHANGE_PARAMS: " UIParams_Event_Params_Change "
    };

    _layerMgr: LayerMgr = null;
    map: Map<string, cc.Node> = new Map();
    loadingMap: Map<string, any[]> = new Map();
    eventTarget: cc.EventTarget = new cc.EventTarget();
    waitingUI: WaitingUI = null;
    waitCount: number = 0;
    deleteMap: Map<string, boolean> = new Map();
    _androidBackBound: boolean = false;
    _lastBackPressAt: number = 0;
    _backExitGapMs: number = 2000;
    _sceneName: string = null;

    constructor() {
        super();
        this.loadWatingUI();
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this.beforeSceneLaunchHandle, this);
        this.bindAndroidBackBridge();
        this.bindAndroidBackKey();
    }

    get uiRoot(): cc.Node {
        return this.layerMgr.uiRoot;
    }

    set uiRoot(value: cc.Node) {
        this.layerMgr.uiRoot = value;
    }

    get layerMgr(): LayerMgr {
        if (!this._layerMgr) {
            this._layerMgr = new LayerMgr();
        }
        return this._layerMgr;
    }

    initLayer(names: string[], defaultLayer: string = null): void {
        this.layerMgr.init(names, defaultLayer);
    }

    getDefaultLayerNode(): cc.Node {
        return this.layerMgr.getDefaultLayerNode();
    }

    getTopLayerNode(): cc.Node {
        return this.layerMgr.getTopLayerNode();
    }

    getLayerNode(name: string): cc.Node {
        return this.layerMgr.getLayerNode(name);
    }

    loadWatingUI(): void {
        this.waitCount = 0;
        this.uiRoot = null;
        if (this.waitingUI?.node?.isValid) {
            this.waitingUI.node.destroy();
        }
        this.waitingUI = null;
        ResMgr.getInstance().loadRes(
            globalUiOption.waitOption.url,
            cc.Prefab,
            null,
            globalUiOption.waitOption.bundleName
        ).then((prefab) => {
            if (prefab) {
                const node = cc.instantiate(prefab);
                this.waitingUI = getWaitingUIComponent(node);
                if (!this.waitingUI) {
                    console.error(" Waiting UI component not found on node ");
                }
            }
        });
    }

    beforeSceneLaunchHandle(): void {
        this.loadWatingUI();
        this.cleanInvalidUI();
    }

    bindAndroidBackKey(): void {
        if (!this._androidBackBound && cc?.sys?.isNative && cc.systemEvent && cc.sys.os === cc.sys.OS_ANDROID) {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onAndroidKeyDown, this);
            this._androidBackBound = true;
        }
    }

    bindAndroidBackBridge(): void {
        if (cc?.sys?.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            (window as any).__ANDROID_BACK__ = () => this.handleAndroidBack();
        }
    }

    onAndroidKeyDown(event: cc.Event.EventKeyboard): void {
        if (event?.keyCode === cc.macro.KEY.back && this.handleAndroidBack()) {
            event.stopPropagation?.();
            event.preventDefault?.();
        }
    }

    _getNodeBackScore(node: cc.Node): number {
        if (!node?.isValid) {
            return -1;
        }
        const siblingIndex = node.getSiblingIndex ? node.getSiblingIndex() : 0;
        const parentIndex = node.parent?.isValid && node.parent.getSiblingIndex ? node.parent.getSiblingIndex() : 0;
        return 100000 * parentIndex + siblingIndex;
    }

    getTopVisibleUINode(): cc.Node {
        let topNode: cc.Node = null;
        let topScore = -1;
        this.map.forEach((node) => {
            if (node?.isValid && node.active) {
                const uiParams = node.getComponent(UIParams);
                if (uiParams?.config) {
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
        if (!topNode?.isValid) {
            return this.handleRootBackPress();
        }
        const config = topNode.getComponent(UIParams)?.config;
        if (config && config.backClosable === false) {
            this._lastBackPressAt = 0;
            return true;
        }
        this._lastBackPressAt = 0;
        this.hide(topNode);
        return true;
    }

    getExitToastText(): string {
        let text = " 再按一次退出游戏 ";
        try {
            const language = LanguageService.getCurrentLanguage ? String(LanguageService.getCurrentLanguage()) : " ";
            if (language === " id- ID ") {
                text = " Tekan sekali lagi untuk keluar game ";
            }
        } catch (_error) {}
        return text;
    }

    showNativeBackToast(): void {
        try {
            const bridge = NativeSdkBridgeAdapter?.getBridge ? NativeSdkBridgeAdapter.getBridge() : null;
            bridge?.showAppLongTapToast?.(this.getExitToastText(), 0);
        } catch (error) {
            console.warn("[UIMgr] showNativeBackToast failed ", error);
        }
    }

    requestNativeExitApp(): void {
        try {
            const bridge = NativeSdkBridgeAdapter?.getBridge ? NativeSdkBridgeAdapter.getBridge() : null;
            bridge?.exitApp?.();
        } catch (error) {
            console.warn("[UIMgr] requestNativeExitApp failed ", error);
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
        globalUiOption = Object.assign({}, defaultGlobalOption, option);
        if (this.waitingUI?.isValid && this.waitingUI.node) {
            this.waitingUI.node.destroy();
        }
        this.loadWatingUI();
    }

    async show(config: UIConfig, ...args: any[]): Promise<cc.Node> {
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
        const loadPromise = cachedNode?.isValid
            ? Promise.resolve(cachedNode)
            : new Promise<cc.Node>((resolve) => {
                ResMgr.getInstance().instantiateByUrl(config.url, null, config.bundle, (finished, total) => {
                    if (config.showWait && this.waitingUI?.isValid) {
                        this.waitingUI.progress(finished, total);
                    }
                }).then(resolve);
            });
        if (config.group >= 0) {
            this.map.forEach((node, key) => {
                if (node?.isValid && id !== key && node.getComponent(UIParams).config.group === config.group) {
                    this.hide(node);
                }
            });
        }
        const uiNode = await loadPromise;
        console.log(config.getId() + " 打开耗时: " + (Date.now() - startTime) + " ms ");
        if (!uiNode) {
            console.error(" ui打开错误 ", config.url, config.bundle);
            if (config.showWait) {
                this.hideWatingUI();
            }
            return null;
        }
        try {
            const layerName = config.layerName ?? this.layerMgr.getDefaultLayerName();
            const layerNode = this.layerMgr.getLayerNode(layerName) ?? this.layerMgr.getDefaultLayerNode();
            const siblingIndex = layerNode.children.length + (config.hasMask ? 1 : 0);
            const uiParams = uiNode.getComponent(UIParams) ?? uiNode.addComponent(UIParams);
            uiParams.init(config, this.loadingMap.get(id), siblingIndex);
            uiNode.active = true;
            this.map.set(id, uiNode);
            this.loadingMap.delete(id);
            this.eventTarget.emit(UIMgr.EventType.BEFORE_SHOW, id, uiNode);
            const showAnimations = uiNode.getComponents(UIAnimation).filter((anim) => anim.isShowAnim);
            uiParams.runingAnim = showAnimations.length > 0;
            layerNode.insertChild(uiNode, siblingIndex);
            if (config.showWait) {
                this.hideWatingUI();
            }
            if (showAnimations.length > 0) {
                Promise.all(showAnimations.map((anim) => anim.show())).then(() => {
                    if (uiNode?.isValid) {
                        uiParams.runingAnim = false;
                        uiNode.emit(UIMgr.EventType.ANIMATION_SHOW_COMPLETE);
                        this.eventTarget.emit(UIMgr.EventType.ANIMATION_SHOW_COMPLETE, id, uiNode);
                    }
                });
            }
            this.eventTarget.emit(UIMgr.EventType.SHOW, id, uiNode);
            return uiNode;
        } catch (error) {
            console.error(" ui打开错误 ", config?.url, config?.bundle, error);
            return null;
        }
    }

    setUIParams(config: UIConfig, ...args: any[]): void {
        if (this.isShow(config)) {
            const uiParams = this.map.get(config.getId())?.getComponent(UIParams);
            if (uiParams) {
                uiParams.params = args;
                this.eventTarget.emit(UIMgr.EventType.CHANGE_PARAMS, config.getId(), uiParams.node);
            }
        }
    }

    getUIParams(config: UIConfig, index: number, defaultValue?: any): any {
        if (!this.isShow(config)) {
            return null;
        }
        const uiParams = this.map.get(config.getId())?.getComponent(UIParams);
        if (!uiParams) {
            return null;
        }
        return index < 0 ? uiParams.params : uiParams.parse(index, defaultValue);
    }

    isShow(config: UIConfig): boolean {
        const node = this.map.get(config.getId());
        return !!(node && node.isValid && node.active);
    }

    getUINode(config: UIConfig): cc.Node {
        const node = this.map.get(config.getId());
        return node && node.isValid ? node : null;
    }

    cleanInvalidUI(): void {
        this.map.forEach((node, id) => {
            if (!node.isValid) {
                this.map.delete(id);
            }
        });
    }

    hide(target: UIConfig | cc.Node): Promise<void> {
        return new Promise((resolve) => {
            let id: string = null;
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
            if (!node?.isValid) {
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
            const hideAnimations = node.getComponents(UIAnimation).filter((anim) => anim.isHideAnim);
            let hidePromise: Promise<any> = Promise.resolve();
            if (hideAnimations.length > 0) {
                hidePromise = Promise.all(hideAnimations.map((anim) => anim.hide()));
            }
            hidePromise.then(() => {
                uiParams.runingAnim = false;
                node.emit(UIMgr.EventType.ANIMATION_HIDE_COMPLETE);
                this.eventTarget.emit(UIMgr.EventType.ANIMATION_HIDE_COMPLETE, id, node);
                const strategy = uiParams.config.destroyStrategy;
                const keeper = node.getComponent(ResKeeper);
                if (
                    strategy === DestroyStrategy.Destroy_KeepSelf_CleanDynamic ||
                    strategy === DestroyStrategy.Destroy_CleanSelfToScene_CleanDynamic ||
                    strategy === DestroyStrategy.Hide_CleanDynamic
                ) {
                    keeper?.removeSelfAsset();
                    if (strategy === DestroyStrategy.Destroy_CleanSelfToScene_CleanDynamic) {
                        ResMgr.getInstance().getKeeper(cc.Canvas.instance.node)?.addAsset(keeper?.selfAsset);
                        keeper?.selfAsset?.decRef();
                    }
                }
                if (strategy === DestroyStrategy.DestroyOnly || strategy === DestroyStrategy.HideOnly) {
                    keeper?.clearAll();
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
            this.waitingUI.node.getComponent(cc.Widget)?.updateAlignment();
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

    on(event: string, callback: (...args: any[]) => void, target?: any): void {
        this.eventTarget.on(event, callback, target);
    }

    once(event: string, callback: (...args: any[]) => void, target?: any): void {
        this.eventTarget.once(event, callback, target);
    }

    off(event: string, callback: (...args: any[]) => void, target?: any): void {
        this.eventTarget.off(event, callback, target);
    }

    targetOff(target: any): void {
        this.eventTarget.targetOff(target);
    }
}
