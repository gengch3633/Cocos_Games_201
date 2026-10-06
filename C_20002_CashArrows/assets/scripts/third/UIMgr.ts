import ResKeeper from "./ResKeeper";
import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import UIAnimation from "./UIAnimation";
import { UIParams } from "./UIParams";
import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";
import LanguageService from "./LanguageService";

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

const baseGlobalOption = defaultGlobalOption;
let globalOption = baseGlobalOption;

export class UIConfig {
    url: string;
    bundle: string;
    layerName?: string;
    waitOption: typeof defaultGlobalOption.waitOption;
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

    constructor(e: string, t: string) {
        this.url = e;
        this.bundle = t;
        Object.assign(this, globalOption);
    }

    setUrl(e: string, t: string) {
        this.url = e;
        this.bundle = t;
        return this;
    }

    setLayerName(e: string) {
        this.layerName = e;
        return this;
    }

    setBlockInputEvents(e: boolean) {
        this.blockInputEvents = e;
        return this;
    }

    setMaskColor(e: cc.Color) {
        this.maskColor = e;
        return this;
    }

    setMaskOpacity(e: number) {
        this.maskOpacity = e;
        return this;
    }

    setHasMask(e: boolean) {
        this.hasMask = e;
        return this;
    }

    setMaskBlockInputEvents(e: boolean) {
        this.maskBlockInputEvents = e;
        return this;
    }

    setMaskClickHide(e: boolean) {
        this.maskClickHide = e;
        return this;
    }

    setBackClosable(e: boolean) {
        this.backClosable = e;
        return this;
    }

    setDestroyStrategy(e: DestroyStrategy) {
        this.destroyStrategy = e;
        return this;
    }

    setAnimingClose(e: boolean) {
        this.animingClose = e;
        return this;
    }

    setGroup(e: number) {
        this.group = e;
        return this;
    }

    getId() {
        var e;
        return (this.bundle ? (null !== (e = this.bundle) && void 0 !== e ? e : " ") + " # " : " ") + this.url;
    }

    clone(t?: UIConfig) {
        t || (t = new UIConfig(this.url, this.bundle));
        Object.assign(t, this);
        return t;
    }
}

class LayerMgr {
    uiRoot: cc.Node | null = null;
    layerMap = new Map<string, cc.Node>();
    names: string[] = [];
    defaultLayer: string | null = null;
    globalBlockInputNode: cc.Node | null = null;

    createNode(e: string, t: cc.Node | null = null) {
        var i;
        var n = new cc.Node(e);
        n.parent = t || (null !== (i = this.uiRoot) && void 0 !== i ? i : cc.Canvas.instance.node);
        n.width = cc.winSize.width;
        n.height = cc.winSize.height;
        var a = n.addComponent(cc.Widget);
        a.isAlignTop = a.isAlignBottom = a.isAlignLeft = a.isAlignRight = true;
        a.top = a.bottom = a.left = a.right = 0;
        a.target = cc.Canvas.instance.node;
        a.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
        return n;
    }

    init(e: string[], t: string | null = null) {
        var i = this;
        if (e && !(e.length <= 0)) {
            this.names = e;
            this.defaultLayer = t;
            e.forEach(function(e) {
                var t = i.createNode(" layer_ " + e);
                i.layerMap.set(e, t);
            });
        }
    }

    getDefaultLayerName() {
        var e;
        return null !== (e = this.defaultLayer) && void 0 !== e ? e : this.names[0];
    }

    setDefaultLayerName(e: string) {
        this.defaultLayer = e;
    }

    getDefaultLayerNode() {
        var e, t, i = this.uiRoot;
        i && !i.isValid && (i = null);
        return null !== (t = null !== (e = this.getLayerNode(this.getDefaultLayerName())) && void 0 !== e ? e : i) && void 0 !== t ? t : cc.Canvas.instance.node;
    }

    getTopLayerNode() {
        var e, t, i = this.uiRoot;
        i && !i.isValid && (i = null);
        return null !== (t = null !== (e = this.getLayerNode(this.names[this.names.length - 1])) && void 0 !== e ? e : i) && void 0 !== t ? t : cc.Canvas.instance.node;
    }

    getLayerNode(e: string | null) {
        if (null == e || null == e) return null;
        var t = this.layerMap.get(e);
        if (!t || !t.isValid) {
            if (this.names.length <= 0) return null;
            this.init(this.names, this.defaultLayer);
        }
        return this.layerMap.get(e)!;
    }

    getBlockInputNode() {
        if (!this.globalBlockInputNode || !this.globalBlockInputNode.isValid) {
            var e = this.createNode(" blockInput ", this.getTopLayerNode());
            e.addComponent(cc.BlockInputEvents);
            this.globalBlockInputNode = e;
        }
        this.globalBlockInputNode.zIndex = cc.macro.MAX_ZINDEX;
        return this.globalBlockInputNode;
    }
}

function findWaitingUIComponent(e: cc.Node): any {
    for (var t = e.getComponents(cc.Component), i = 0; i < t.length; i++) {
        var n = t[i] as any;
        if (n.show && n.hide && n.progress) return n;
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

    _layerMgr: LayerMgr | null = null;
    map = new Map<string, cc.Node>();
    loadingMap = new Map<string, any[]>();
    eventTarget = new cc.EventTarget();
    waitingUI: any = null;
    waitCount = 0;
    deleteMap = new Map<string, boolean>();
    _androidBackBound = false;
    _lastBackPressAt = 0;
    _backExitGapMs = 2e3;

    constructor() {
        super();
        this.loadWatingUI();
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this.beforeSceneLaunchHandle, this);
        this.bindAndroidBackBridge();
        this.bindAndroidBackKey();
    }

    get uiRoot() {
        return this.layerMgr.uiRoot;
    }

    set uiRoot(e: cc.Node | null) {
        this.layerMgr.uiRoot = e;
    }

    get layerMgr() {
        this._layerMgr || (this._layerMgr = new LayerMgr());
        return this._layerMgr;
    }

    initLayer(e: string[], t: string | null = null) {
        this.layerMgr.init(e, t);
    }

    getDefaultLayerNode() {
        return this.layerMgr.getDefaultLayerNode();
    }

    getTopLayerNode() {
        return this.layerMgr.getTopLayerNode();
    }

    getLayerNode(e: string) {
        return this.layerMgr.getLayerNode(e);
    }

    loadWatingUI() {
        var e = this;
        this.waitCount = 0;
        this.uiRoot = null;
        this.waitingUI && this.waitingUI.node && this.waitingUI.node.isValid && this.waitingUI.node.destroy();
        this.waitingUI = null;
        ResMgr.getInstance().loadRes(globalOption.waitOption.url, cc.Prefab, null, globalOption.waitOption.bundleName).then(function(t) {
            if (t) {
                var i = cc.instantiate(t);
                e.waitingUI = findWaitingUIComponent(i);
                e.waitingUI || console.error(" Waiting UI component not found on node ");
            }
        });
    }

    beforeSceneLaunchHandle() {
        this.loadWatingUI();
        this.cleanInvalidUI();
    }

    bindAndroidBackKey() {
        if (!this._androidBackBound && cc && cc.sys && cc.systemEvent && cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onAndroidKeyDown, this);
            this._androidBackBound = true;
        }
    }

    bindAndroidBackBridge() {
        if (cc && cc.sys && cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            var e = this;
            (window as any).__ANDROID_BACK__ = function() {
                return e.handleAndroidBack();
            };
        }
    }

    onAndroidKeyDown(e: cc.Event.EventKeyboard) {
        if (e && e.keyCode === cc.macro.KEY.back && this.handleAndroidBack()) {
            e.stopPropagation && e.stopPropagation();
            e.preventDefault && e.preventDefault();
        }
    }

    _getNodeBackScore(e: cc.Node) {
        if (!e || !e.isValid) return -1;
        var t = e.getSiblingIndex ? e.getSiblingIndex() : 0;
        return 1e5 * (e.parent && e.parent.isValid && e.parent.getSiblingIndex ? e.parent.getSiblingIndex() : 0) + t;
    }

    getTopVisibleUINode() {
        var e: cc.Node | null = null, t = -1;
        this.map.forEach(function(i) {
            if (i && i.isValid && i.active) {
                var n = i.getComponent(UIParams);
                if (n && n.config) {
                    var a = this._getNodeBackScore(i);
                    if (a >= t) {
                        t = a;
                        e = i;
                    }
                }
            }
        }, this);
        return e;
    }

    handleAndroidBack() {
        this.cleanInvalidUI();
        var e = this.getTopVisibleUINode();
        if (!e || !e.isValid) return this.handleRootBackPress();
        var t = e.getComponent(UIParams), i = t && t.config;
        if (i && false === i.backClosable) {
            this._lastBackPressAt = 0;
            return true;
        }
        this._lastBackPressAt = 0;
        this.hide(e);
        return true;
    }

    getExitToastText() {
        var e = " 再按一次退出游戏 ";
        try {
            var t = LanguageService;
            " id- ID " === (t && t.getCurrentLanguage ? String(t.getCurrentLanguage()) : " ") && (e = " Tekan sekali lagi untuk keluar game ");
        } catch (e) { }
        return e;
    }

    showNativeBackToast() {
        try {
            var e = NativeSdkBridgeAdapter, t = e && e.getBridge ? e.getBridge() : null;
            t && t.showAppLongTapToast && t.showAppLongTapToast(this.getExitToastText(), 0);
        } catch (e) {
            console.warn("[UIMgr] showNativeBackToast failed ", e);
        }
    }

    requestNativeExitApp() {
        try {
            var e = NativeSdkBridgeAdapter, t = e && e.getBridge ? e.getBridge() : null;
            t && t.exitApp && t.exitApp();
        } catch (e) {
            console.warn("[UIMgr] requestNativeExitApp failed ", e);
        }
    }

    handleRootBackPress() {
        var e = Date.now();
        if (e - this._lastBackPressAt <= this._backExitGapMs) {
            this._lastBackPressAt = 0;
            this.requestNativeExitApp();
            return true;
        }
        this._lastBackPressAt = e;
        this.showNativeBackToast();
        return true;
    }

    setGlobalOption(e: Partial<typeof defaultGlobalOption>) {
        globalOption = Object.assign(baseGlobalOption, e);
        this.waitingUI && this.waitingUI.isValid && this.waitingUI.node && this.waitingUI.node.destroy();
        this.loadWatingUI();
    }

    async show(e: UIConfig, ...s: any[]) {
        var i, n, a;
        var o = null == e ? void 0 : e.getId();
        if (!o) return null;
        if (this.loadingMap.has(o)) {
            this.loadingMap.set(o, s);
            return null;
        }
        var c = Date.now();
        this.loadingMap.set(o, s);
        var p = this.map.get(o);
        e.showWait && this.showWatingUI();
        var h = (null == p ? void 0 : p.isValid) ? Promise.resolve(p) : new Promise<cc.Node>((t) => {
            var b = this;
            ResMgr.getInstance().instantiateByUrl(e.url, null, e.bundle, function(t, i) {
                e.showWait && b.waitingUI && b.waitingUI.isValid && b.waitingUI.progress(t, i);
            }).then(function(e) {
                return t(e);
            });
        });
        e.group >= 0 && this.map.forEach(function(t, i) {
            (null == t ? void 0 : t.isValid) && o != i && t.getComponent(UIParams)!.config.group == e.group && this.hide(t);
        }, this);
        var _ = await h;
        console.log(e.getId() + " 打开耗时: " + (Date.now() - c) + " ms ");
        if (!_) {
            console.error(" ui打开错误 ", e.url, e.bundle);
            e.showWait && this.hideWatingUI();
            return null;
        }
        try {
            var f = null !== (i = e.layerName) && void 0 !== i ? i : this.layerMgr.getDefaultLayerName();
            var g = null !== (n = this.layerMgr.getLayerNode(f)) && void 0 !== n ? n : this.layerMgr.getDefaultLayerNode();
            var m = g.children.length + (e.hasMask ? 1 : 0);
            var y = null !== (a = _.getComponent(UIParams)) && void 0 !== a ? a : _.addComponent(UIParams);
            y.init(e, this.loadingMap.get(o), m);
            _.active = true;
            this.map.set(o, _);
            this.loadingMap.delete(o);
            this.eventTarget.emit(UIMgr.EventType.BEFORE_SHOW, o, _);
            var v = _.getComponents(UIAnimation).filter(function(e) {
                return e.isShowAnim;
            });
            y.runingAnim = v.length > 0;
            g.insertChild(_, m);
            e.showWait && this.hideWatingUI();
            (null == v ? void 0 : v.length) > 0 && Promise.all(v.map(function(e) {
                return e.show();
            })).then(() => {
                if (null == _ ? void 0 : _.isValid) {
                    y.runingAnim = false;
                    null == _ || _.emit(UIMgr.EventType.ANIMATION_SHOW_COMPLETE);
                    this.eventTarget.emit(UIMgr.EventType.ANIMATION_SHOW_COMPLETE, o, _);
                }
            });
            this.eventTarget.emit(UIMgr.EventType.SHOW, o, _);
            return _;
        } catch (t) {
            console.error(" ui打开错误 ", null == e ? void 0 : e.url, null == e ? void 0 : e.bundle, t);
            return null;
        }
    }

    setUIParams(e: UIConfig, ...n: any[]) {
        if (this.isShow(e)) {
            var o = this.map.get(e.getId())?.getComponent(UIParams);
            if (o) {
                o.params = n;
                this.eventTarget.emit(UIMgr.EventType.CHANGE_PARAMS, e.getId(), o.node);
            }
        }
    }

    getUIParams(e: UIConfig, t: number, i?: any) {
        void 0 === i && (i = void 0);
        if (!this.isShow(e)) return null;
        var a = this.map.get(e.getId())?.getComponent(UIParams);
        return a ? t < 0 ? a.params : a.parse(t, i) : null;
    }

    isShow(e: UIConfig) {
        var t = e.getId(), i = this.map.get(t);
        return !!(i && i.isValid && i.active);
    }

    getUINode(e: UIConfig) {
        var t = e.getId(), i = this.map.get(t);
        return i && i.isValid ? i : null;
    }

    cleanInvalidUI() {
        this.map.forEach((t, i) => {
            t.isValid || this.map.delete(i);
        });
    }

    hide(e: cc.Node | UIConfig) {
        var i = this;
        return new Promise<void>((a) => {
            var o, r, c;
            if ((c = e instanceof cc.Node ? null === (r = null === (o = e.getComponent(UIParams)) || void 0 === o ? void 0 : o.config) || void 0 === r ? void 0 : r.getId() : null == e ? void 0 : e.getId()) && i.map.has(c)) {
                var h = i.map.get(c)!;
                if (!h || !h.isValid) {
                    i.map.delete(c);
                    return void a();
                }
                if (i.deleteMap.get(c)) a(); else {
                    var p = h.getComponent(UIParams)!;
                    if (null == p || !p.runingAnim || p.config.animingClose) {
                        i.deleteMap.set(c, true);
                        i.eventTarget.emit(UIMgr.EventType.BEFORE_HIDE, c, h);
                        p.runingAnim = true;
                        var _ = Promise.resolve(), f = h.getComponents(UIAnimation).filter(function(e) {
                            return e.isHideAnim;
                        });
                        (null == f ? void 0 : f.length) > 0 && (_ = Promise.all(f.map(function(e) {
                            return e.hide();
                        })));
                        _.then(function() {
                            p.runingAnim = false;
                            h.emit(UIMgr.EventType.ANIMATION_HIDE_COMPLETE);
                            i.eventTarget.emit(UIMgr.EventType.ANIMATION_HIDE_COMPLETE, c, h);
                            var r = p.config.destroyStrategy, u = h.getComponent(ResKeeper);
                            if (r == DestroyStrategy.Destroy_KeepSelf_CleanDynamic || r == DestroyStrategy.Destroy_CleanSelfToScene_CleanDynamic || r == DestroyStrategy.Hide_CleanDynamic) {
                                null == u || u.removeSelfAsset();
                                if (r == DestroyStrategy.Destroy_CleanSelfToScene_CleanDynamic) {
                                    var e;
                                    null === (e = ResMgr.getInstance().getKeeper(cc.Canvas.instance.node)) || void 0 === e || e.addAsset(null == u ? void 0 : u.selfAsset);
                                    var o;
                                    null === (o = null == u ? void 0 : u.selfAsset) || void 0 === o || o.decRef();
                                }
                            }
                            r != DestroyStrategy.DestroyOnly && r != DestroyStrategy.HideOnly || null == u || u.clearAll();
                            if (r == DestroyStrategy.CleanAll || r == DestroyStrategy.Destroy_KeepSelf_CleanDynamic || r == DestroyStrategy.Destroy_CleanSelfToScene_CleanDynamic || r == DestroyStrategy.DestroyOnly) {
                                h.emit(UIMgr.EventType.HIDE);
                                h.destroy();
                                i.map.delete(c);
                            } else {
                                h.active = false;
                                h.emit(UIMgr.EventType.HIDE);
                            }
                            i.deleteMap.delete(c);
                            a();
                            i.eventTarget.emit(UIMgr.EventType.HIDE, c, h);
                        });
                    } else a();
                }
            } else a();
        });
    }

    showWatingUI() {
        var e, t, i, n;
        if (this.waitingUI && this.waitingUI.isValid) {
            this.waitCount++;
            null === (i = null === (t = null === (e = this.waitingUI) || void 0 === e ? void 0 : e.node) || void 0 === t ? void 0 : t.getComponent(cc.Widget)) || void 0 === i || i.updateAlignment();
            this.waitingUI.node.parent = this.getTopLayerNode();
            this.waitingUI.node.zIndex = cc.macro.MAX_ZINDEX;
            null === (n = this.waitingUI) || void 0 === n || n.show();
        }
    }

    hideWatingUI() {
        if (this.waitingUI && this.waitingUI.isValid) {
            this.waitCount = Math.max(0, this.waitCount - 1);
            this.waitCount <= 0 && this.waitingUI.hide();
        }
    }

    setBlockInputEvents(e: boolean) {
        this.layerMgr.getBlockInputNode().active = e;
    }

    on(e: string, t: (...args: any[]) => void, i?: any) {
        this.eventTarget.on(e, t, i);
    }

    once(e: string, t: (...args: any[]) => void, i?: any) {
        this.eventTarget.once(e, t, i);
    }

    off(e: string, t: (...args: any[]) => void, i?: any) {
        this.eventTarget.off(e, t, i);
    }

    targetOff(e: any) {
        this.eventTarget.targetOff(e);
    }
}
