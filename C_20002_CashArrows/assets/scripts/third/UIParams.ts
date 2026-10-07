import ClickAudio from "./ClickAudio";
import UIMgr from "./UIMgr";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/Cocos/UIParams")
export class UIParams extends cc.Component {
    static EventType = {
        CHANGE: "UIParams_Event_Change",
        CLICK_MASK: "UIParams_Event_Click_Mask",
    };

    isInit = false;
    _config: any = null;
    maskNode: cc.Node | null = null;
    runingAnim = false;
    _params: any[] | null = null;

    static parse(node: cc.Node | null, index: number, fallback?: any): any {
        const params = node?.getComponent(UIParams);
        const value = params?.parse(index, fallback);
        return value !== undefined ? value : fallback;
    }

    parse(index: number, fallback?: any): any {
        const params = this?.params;
        if (params && params.length > index) {
            return params[index];
        }
        return fallback;
    }

    get params(): any[] | null {
        return this._params;
    }

    set params(value: any[] | null) {
        this._params = value;
        this.node?.emit(UIParams.EventType.CHANGE, value);
    }

    get config(): any {
        return this._config;
    }

    init(config: any, params: any[] | null, siblingIndex: number): void {
        this._config = config;
        this.params = params;
        this.runingAnim = true;
        if (!this.isInit) {
            this.initMask();
            ClickAudio.addClickAudio(this.node);
        }
        this.isInit = true;
        if (this.config.hasMask && this.maskNode) {
            this.maskNode.active = true;
            this.maskNode.setSiblingIndex(siblingIndex - 1);
        }
    }

    initMask(): void {
        const blockInput = this.getComponent(cc.BlockInputEvents) || this.addComponent(cc.BlockInputEvents);
        blockInput.enabled = this.config.blockInputEvents;
        if (this.config.hasMask) {
            const parent =
                this.node.parent ||
                UIMgr.getInstance().getLayerNode(this.config.layerName) ||
                UIMgr.getInstance().getDefaultLayerNode();
            this.maskNode = this.createMaskNode();
            this.maskNode.color = this.config.maskColor;
            this.maskNode.opacity = this.config.maskOpacity;
            this.maskNode.parent = parent;
            if (this.config.maskBlockInputEvents) {
                this.maskNode.addComponent(cc.BlockInputEvents);
            }
            this.maskNode.on(cc.Node.EventType.TOUCH_END, () => {
                this.node?.emit(UIParams.EventType.CLICK_MASK);
                if (this.config.maskClickHide && !this.runingAnim) {
                    UIMgr.getInstance().hide(this.node);
                }
            }, this);
            this.node.on(UIMgr.EventType.HIDE, () => {
                if (this.maskNode) {
                    this.maskNode.active = false;
                }
            }, this);
        }
    }

    createMaskNode(): cc.Node {
        const maskNode = new cc.Node(this.node.name + "_mask");
        maskNode.group = this.node.group;
        maskNode.width = cc.winSize.width;
        maskNode.height = cc.winSize.height;
        const widget = maskNode.addComponent(cc.Widget);
        widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
        widget.top = widget.bottom = widget.left = widget.right = 0;
        widget.target = cc.Canvas.instance.node;
        widget.alignMode = cc.Widget.AlignMode.ALWAYS;
        const texture = new cc.Texture2D();
        texture.initWithData(new Uint8Array([0, 0, 0]), cc.Texture2D.PixelFormat.RGB888, 1, 1);
        const spriteFrame = new cc.SpriteFrame(texture);
        maskNode.addComponent(cc.Sprite).spriteFrame = spriteFrame;
        return maskNode;
    }

    onDestroy(): void {
        this.maskNode?.destroy();
    }
}

export default UIParams;
