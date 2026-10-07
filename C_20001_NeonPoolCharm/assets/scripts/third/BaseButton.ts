import AudioManager from "./AudioManager";

const { ccclass, property } = cc._decorator;

const BtnType = cc.Enum({
    NONE: 0,
    ShortButton: 1,
    DoubleButton: 2,
    LongButton: 3,
    MixButton: 4,
});

const MixBtnType = cc.Enum({
    NONE: 0,
    ShortButton: 1,
    DoubleButton: 2,
    LongButton: 3,
});

cc.Enum(BtnType);
cc.Enum(MixBtnType);

@ccclass
export default class BaseButton extends cc.Component {
    holdTimeCount = 0;
    isClicked = false;
    clickTimes = 0;
    targetSp: cc.Sprite = null;
    lastTargetSp: cc.Sprite = null;
    normalSp: cc.SpriteFrame = null;
    curClickTime = 0;
    turnDuration = 0.1;
    normalMaterial: cc.Material = null;
    grayMaterial: cc.Material = null;

    @property(cc.Node)
    _targetNode: cc.Node = null;

    @property
    _interactable = true;

    @property(cc.SpriteFrame)
    disabled: cc.SpriteFrame = null;

    @property
    _enableAutoGrayEffect = false;

    @property({ type: cc.Float, tooltip: "缩放比例" })
    scaleRadio = 0.95;

    @property({ type: cc.Integer })
    _clickDelay = 300;

    @property({
        type: cc.Float,
        tooltip: "长按响应的时长(单位：秒)",
        visible() {
            return this.btnType === BtnType.LongButton || (this.btnType === BtnType.MixButton && this.mixButtonTypeList.indexOf(BtnType.LongButton) !== -1);
        },
    })
    holdTime = 0.5;

    @property({ type: BtnType })
    _btnType = BtnType.ShortButton;

    @property({ type: [MixBtnType] })
    _mixButtonTypeList: number[] = [];

    @property({
        type: [cc.Component.EventHandler],
        visible() {
            return this.btnType !== BtnType.MixButton && this.btnType !== BtnType.NONE;
        },
        tooltip: "回调函数组",
    })
    noMixEvents: cc.Component.EventHandler[] = [];

    @property({
        type: [cc.Component.EventHandler],
        visible() {
            return this.btnType === BtnType.MixButton && this.mixButtonTypeList.indexOf(BtnType.ShortButton) !== -1;
        },
        tooltip: "单击回调函数组",
    })
    shortEvents: cc.Component.EventHandler[] = [];

    @property({
        type: [cc.Component.EventHandler],
        visible() {
            return this.btnType === BtnType.MixButton && this.mixButtonTypeList.indexOf(BtnType.DoubleButton) !== -1;
        },
        tooltip: "双击回调函数组",
    })
    doubleEvents: cc.Component.EventHandler[] = [];

    @property({
        type: [cc.Component.EventHandler],
        visible() {
            return this.btnType === BtnType.MixButton && this.mixButtonTypeList.indexOf(BtnType.LongButton) !== -1;
        },
        tooltip: "长按回调函数组",
    })
    longEvents: cc.Component.EventHandler[] = [];

    turnTotalTime: number = null;
    _changeFinished: boolean = null;
    f_ScaleX: number = null;
    f_ScaleY: number = null;
    t_ScaleX: number = null;
    t_ScaleY: number = null;
    o_ScaleX: number = null;
    o_ScaleY: number = null;
    @property({ type: cc.Node })
    get targetNode(): cc.Node {
        return this._targetNode;
    }
    set targetNode(value: cc.Node) {
        this._targetNode = value;
        this.changeTargetSp();
    }

    @property({ type: cc.Boolean, tooltip: "是否可交互" })
    get interactable(): boolean {
        return this._interactable;
    }
    set interactable(value: boolean) {
        this._interactable = value;
        this.changeTargetSp();
    }

    @property({ type: cc.Boolean, tooltip: "当设置为 true 的时候，如果 button 的 interactable 属性为 false，则 button 的 sprite Target 会变为灰度" })
    get enableAutoGrayEffect(): boolean {
        return this._enableAutoGrayEffect;
    }
    set enableAutoGrayEffect(value: boolean) {
        this._enableAutoGrayEffect = value;
        this.changeTargetSp();
    }

    @property({ type: cc.Integer, tooltip: "点击间隔(单位：毫秒)，0-没有间隔" })
    get clickDelay(): number {
        return this._clickDelay;
    }
    set clickDelay(value: number) {
        this._clickDelay = value;
    }

    @property({ type: BtnType, tooltip: "按钮类型" })
    get btnType(): number {
        return this._btnType;
    }
    set btnType(value: number) {
        this._btnType = value;
        this.changeDelayTime();
    }

    @property({
        type: [MixBtnType],
        visible() {
            return this.btnType === BtnType.MixButton;
        },
        tooltip: "选择混合类型组合",
    })
    get mixButtonTypeList(): number[] {
        return this._mixButtonTypeList;
    }
    set mixButtonTypeList(value: number[]) {
        if (!this.checkMixHaveType(value)) {
            this._mixButtonTypeList = value;
            this.changeDelayTime();
        }
    }

    changeDelayTime(): void {
        if (this.btnType === BtnType.ShortButton || (this.btnType === BtnType.MixButton && this.mixButtonTypeList.indexOf(BtnType.ShortButton) !== -1)) {
            const isMixShortDouble = this.btnType === BtnType.MixButton && this.mixButtonTypeList.indexOf(BtnType.ShortButton) !== -1 && this.mixButtonTypeList.indexOf(BtnType.DoubleButton) !== -1;
            this.clickDelay = isMixShortDouble ? 100 : 300;
        } else {
            this.clickDelay = 0;
        }
    }

    changeTargetSp(): void {
        if (!this.normalMaterial) {
            this.normalMaterial = cc.Material.getBuiltinMaterial("2d-sprite");
        }
        if (!this.grayMaterial) {
            this.grayMaterial = cc.Material.getBuiltinMaterial("2d-gray-sprite");
        }
        if (this.lastTargetSp) {
            this.lastTargetSp.setMaterial(0, this.normalMaterial);
        }
        if (this.targetNode) {
            const sprite = this.targetNode.getComponent(cc.Sprite);
            this.targetSp = this.lastTargetSp = sprite;
        } else {
            this.targetSp = this.node.getComponent(cc.Sprite);
            this.lastTargetSp = null;
        }
        if (!this.normalSp) {
            this.normalSp = this.targetSp.spriteFrame;
        }
        if (this.disabled) {
            this.targetSp.spriteFrame = this.interactable ? this.normalSp : this.disabled;
        }
        if (!this.interactable && this.enableAutoGrayEffect) {
            this.targetSp.setMaterial(0, this.grayMaterial);
        } else {
            this.targetSp.setMaterial(0, this.normalMaterial);
        }
    }

    onTouchEnd(): void {
        if (this.interactable) {
            this.isClicked = false;
            this._zoomBack();
            this.checkCanExcel(this.node);
            this.holdTimeCount = 0;
        }
    }

    update(dt: number): void {
        const node = this.node;
        if (this.isClicked) {
            this.holdTimeCount++;
        }
        if (!this._changeFinished) {
            this.turnTotalTime += dt;
            let ratio = 1;
            if (this.turnDuration > 0) {
                ratio = this.turnTotalTime / this.turnDuration;
            }
            if (ratio >= 1) {
                ratio = 1;
                this._changeFinished = true;
            }
            node.scaleX = cc.misc.lerp ? cc.misc.lerp(this.f_ScaleX, this.t_ScaleX, ratio) : 1;
            node.scaleY = cc.misc.lerp ? cc.misc.lerp(this.f_ScaleY, this.t_ScaleY, ratio) : 1;
        }
    }

    onLoad(): void {
        this.turnTotalTime = 0;
        this._changeFinished = true;
        this.f_ScaleX = 1;
        this.f_ScaleY = 1;
        this.t_ScaleX = 1;
        this.t_ScaleY = 1;
        this.o_ScaleX = this.node.scaleX;
        this.o_ScaleY = this.node.scaleY;
    }

    checkCanExcel(node: cc.Node): void {
        const now = Date.now();
        if (now - this.curClickTime > this.clickDelay) {
            this.curClickTime = now;
            this.clickTimes++;
            AudioManager.getInstance().playMusic("btntouch");
            if (this.btnType === BtnType.LongButton || (this.btnType === BtnType.MixButton && this.mixButtonTypeList.indexOf(BtnType.LongButton) !== -1)) {
                if (this.holdTimeCount >= 60 * this.holdTime) {
                    this.excelClickEvent(node, BtnType.LongButton);
                }
            }
            if (this.btnType === BtnType.DoubleButton || (this.btnType === BtnType.MixButton && this.mixButtonTypeList.indexOf(BtnType.DoubleButton) !== -1)) {
                let timeoutId = setTimeout(() => {
                    clearTimeout(timeoutId);
                    this.clickTimes = 0;
                }, this.clickDelay === 0 ? 400 : 2.8 * this.clickDelay);
                if (this.clickTimes === 2) {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    this.excelClickEvent(node, BtnType.DoubleButton);
                }
            }
            const isMixShortDouble = this.btnType === BtnType.MixButton && this.mixButtonTypeList.indexOf(BtnType.ShortButton) !== -1 && this.mixButtonTypeList.indexOf(BtnType.DoubleButton) !== -1;
            if (this.btnType === BtnType.ShortButton || (this.btnType === BtnType.MixButton && this.mixButtonTypeList.indexOf(BtnType.ShortButton) !== -1)) {
                if (isMixShortDouble) {
                    const delay = 1.8 * this.clickDelay;
                    const timeoutId = setTimeout(() => {
                        clearTimeout(timeoutId);
                        if (this.clickTimes === 1) {
                            this.excelClickEvent(node, BtnType.ShortButton);
                        }
                    }, delay);
                } else if (this.clickTimes === 1) {
                    this.excelClickEvent(node, BtnType.ShortButton);
                }
            }
        }
    }

    onTouchCancel(): void {
        this._zoomBack();
        this.isClicked = false;
        this.holdTimeCount = 0;
        this.clickTimes = 0;
    }

    _zoomBack(): void {
        this.f_ScaleX = this.node.scaleX;
        this.f_ScaleY = this.node.scaleY;
        this.t_ScaleX = this.o_ScaleX;
        this.t_ScaleY = this.o_ScaleY;
        this.turnTotalTime = 0;
        this._changeFinished = false;
    }

    _zoomUp(): void {
        this.f_ScaleX = this.o_ScaleX;
        this.f_ScaleY = this.o_ScaleY;
        this.t_ScaleX = this.o_ScaleX * this.scaleRadio;
        this.t_ScaleY = this.o_ScaleY * this.scaleRadio;
        this.turnTotalTime = 0;
        this._changeFinished = false;
    }

    checkMixHaveType(list: number[]): boolean {
        const seen: Record<number, boolean> = {};
        for (let i = 0; i < list.length; i++) {
            if (seen[list[i]]) {
                list[i] = BtnType.NONE;
                return true;
            }
            seen[list[i]] = true;
        }
        return false;
    }

    onTouchStart(): void {
        if (this.interactable) {
            this.isClicked = true;
            this.holdTimeCount = 0;
            this._zoomUp();
        }
    }

    onDisable(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    excelClickEvent(event: cc.Event, type: number): void {
        if (type === BtnType.NONE) {
            return;
        }
        this.clickTimes = 0;
        const invokeHandlers = (handlers: cc.Component.EventHandler[]) => {
            handlers.forEach((handler) => {
                if (handler && handler.handler && handler.target) {
                    const comp = handler.target.getComponent(handler["_componentName"]);
                    if (comp && comp[handler.handler]) {
                        comp[handler.handler](event, handler.customEventData);
                    }
                }
            });
        };
        if (this.btnType !== BtnType.MixButton) {
            invokeHandlers(this.noMixEvents);
        } else {
            if (type === BtnType.ShortButton) {
                invokeHandlers(this.shortEvents);
            }
            if (type === BtnType.DoubleButton) {
                invokeHandlers(this.doubleEvents);
            }
            if (type === BtnType.LongButton) {
                invokeHandlers(this.longEvents);
            }
        }
    }

    onEnable(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
}
