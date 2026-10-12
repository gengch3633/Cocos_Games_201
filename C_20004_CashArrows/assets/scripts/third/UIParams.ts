import ClickAudio from "./ClickAudio";
import UIMgr from "./UIMgr";

const { ccclass, menu } = cc._decorator;

export interface IUIParamsConfig {
    hasMask?: boolean;
    maskColor?: cc.Color;
    maskOpacity?: number;
    maskBlockInputEvents?: boolean;
    maskClickHide?: boolean;
    blockInputEvents?: boolean;
    layerName?: string;
    [key: string]: any;
}

@ccclass
@menu("UI/Cocos/UIParams")
export default class UIParams extends cc.Component {

    public static EventType = {
        CHANGE: "UIParams_Event_Change",
        CLICK_MASK: "UIParams_Event_Click_Mask"
    };

    public static parse(node: cc.Node, key: any, defaultValue?: any): any {
        const component: UIParams = node ? node.getComponent(UIParams) : null;
        const result: any = component ? component.parse(key, defaultValue) : undefined;
        return result !== null && result !== undefined ? result : defaultValue;
    }

    public isInit: boolean = false;
    public maskNode: cc.Node = null;
    public runingAnim: boolean = false;

    private _config: IUIParamsConfig = null;
    private _params: any = undefined;

    public parse(key: any, defaultValue?: any): any {
        const params: any = this.params;
        return params && params.length > key ? params[key] : defaultValue;
    }

    get params(): any {
        return this._params;
    }

    set params(value: any) {
        this._params = value;
        if (this.node) {
            this.node.emit(UIParams.EventType.CHANGE, value);
        }
    }

    get config(): IUIParamsConfig {
        return this._config;
    }

    public init(config: IUIParamsConfig, params: any, siblingIndex: number): void {
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

    private initMask(): void {
        let blockInput: cc.BlockInputEvents = this.getComponent(cc.BlockInputEvents);
        if (!blockInput) {
            blockInput = this.addComponent(cc.BlockInputEvents);
        }
        blockInput.enabled = this.config.blockInputEvents;

        if (!this.config.hasMask) {
            return;
        }

        const parent: cc.Node = this.node.parent
            || UIMgr.getInstance().getLayerNode(this.config.layerName)
            || UIMgr.getInstance().getDefaultLayerNode();

        this.maskNode = this.createMaskNode();
        this.maskNode.color = this.config.maskColor;
        this.maskNode.opacity = this.config.maskOpacity;
        this.maskNode.parent = parent;

        if (this.config.maskBlockInputEvents) {
            this.maskNode.addComponent(cc.BlockInputEvents);
        }

        this.maskNode.on(cc.Node.EventType.TOUCH_END, () => {
            if (this.node) {
                this.node.emit(UIParams.EventType.CLICK_MASK);
            }
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

    private createMaskNode(): cc.Node {
        const maskNode: cc.Node = new cc.Node(this.node.name + "_mask");
        maskNode.group = this.node.group;
        maskNode.width = cc.winSize.width;
        maskNode.height = cc.winSize.height;

        const widget: cc.Widget = maskNode.addComponent(cc.Widget);
        widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
        widget.top = widget.bottom = widget.left = widget.right = 0;
        widget.target = cc.Canvas.instance.node;
        widget.alignMode = cc.Widget.AlignMode.ALWAYS;

        const texture: cc.Texture2D = new cc.Texture2D();
        texture.initWithData(new Uint8Array([0, 0, 0]), cc.Texture2D.PixelFormat.RGB888, 1, 1);

        const spriteFrame: cc.SpriteFrame = new cc.SpriteFrame(texture);
        maskNode.addComponent(cc.Sprite).spriteFrame = spriteFrame;

        return maskNode;
    }

    protected onDestroy(): void {
        if (this.maskNode) {
            this.maskNode.destroy();
        }
    }
}