import UIMgr, { UIConfig } from "./UIMgr";
import ClickAudio from "./ClickAudio";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu(" UI/ Cocos/ UIParams ")
export class UIParams extends cc.Component {
    static EventType = {
        CHANGE: " UIParams_Event_Change ",
        CLICK_MASK: " UIParams_Event_Click_Mask "
    };

    isInit: boolean = false;
    _config: UIConfig | null = null;
    maskNode: cc.Node | null = null;
    runingAnim: boolean = false;
    _params: any;

    static parse(e: cc.Node, t: number, n?: any) {
        var a;
        void 0 === n && (n = void 0);
        var o = null == e ? void 0 : e.getComponent(UIParams);
        return null !== (a = null == o ? void 0 : o.parse(t, n)) && void 0 !== a ? a : n;
    }

    parse(e: number, t?: any) {
        void 0 === t && (t = void 0);
        var i = null == this ? void 0 : this.params;
        return i && (null == i ? void 0 : i.length) > e ? i[e] : t;
    }

    get params() {
        return this._params;
    }

    set params(e: any) {
        var t;
        this._params = e;
        null === (t = this.node) || void 0 === t || t.emit(UIParams.EventType.CHANGE, e);
    }

    get config() {
        return this._config!;
    }

    init(e: UIConfig, t: any, i: number) {
        this._config = e;
        this.params = t;
        this.runingAnim = true;
        if (!this.isInit) {
            this.initMask();
            ClickAudio.addClickAudio(this.node);
        }
        this.isInit = true;
        if (this.config.hasMask && this.maskNode) {
            this.maskNode.active = true;
            this.maskNode.setSiblingIndex(i - 1);
        }
    }

    initMask() {
        var e, t, n, a = this;
        (null !== (e = this.getComponent(cc.BlockInputEvents)) && void 0 !== e ? e : this.addComponent(cc.BlockInputEvents)).enabled = this.config.blockInputEvents;
        if (this.config.hasMask) {
            var r = null !== (n = null !== (t = this.node.parent) && void 0 !== t ? t : UIMgr.getInstance().getLayerNode(this.config.layerName)) && void 0 !== n ? n : UIMgr.getInstance().getDefaultLayerNode();
            this.maskNode = this.createMaskNode();
            this.maskNode.color = this.config.maskColor;
            this.maskNode.opacity = this.config.maskOpacity;
            this.maskNode.parent = r;
            this.config.maskBlockInputEvents && this.maskNode.addComponent(cc.BlockInputEvents);
            this.maskNode.on(cc.Node.EventType.TOUCH_END, function() {
                var e;
                null === (e = a.node) || void 0 === e || e.emit(UIParams.EventType.CLICK_MASK);
                a.config.maskClickHide && !a.runingAnim && UIMgr.getInstance().hide(a.node);
            }, this);
            this.node.on(UIMgr.EventType.HIDE, function() {
                a.maskNode && (a.maskNode.active = false);
            }, this);
        }
    }

    createMaskNode() {
        var e = new cc.Node(this.node.name + " _mask ");
        e.group = this.node.group;
        e.width = cc.winSize.width;
        e.height = cc.winSize.height;
        var t = e.addComponent(cc.Widget);
        t.isAlignTop = t.isAlignBottom = t.isAlignLeft = t.isAlignRight = true;
        t.top = t.bottom = t.left = t.right = 0;
        t.target = cc.Canvas.instance.node;
        t.alignMode = cc.Widget.AlignMode.ALWAYS;
        var i = new cc.Texture2D();
        i.initWithData(new Uint8Array([0, 0, 0]), cc.Texture2D.PixelFormat.RGB888, 1, 1);
        var n = new cc.SpriteFrame(i);
        e.addComponent(cc.Sprite).spriteFrame = n;
        return e;
    }

    onDestroy() {
        var e;
        null === (e = this.maskNode) || void 0 === e || e.destroy();
    }
}
