import AudioManager from "./AudioManager";

const ButtonType = cc.Enum({
    NONE: 0,
    ShortButton: 1,
    DoubleButton: 2,
    LongButton: 3,
    MixButton: 4
});
const MixButtonType = cc.Enum({
    NONE: 0,
    ShortButton: 1,
    DoubleButton: 2,
    LongButton: 3
});
cc.Enum(ButtonType);
cc.Enum(MixButtonType);

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseButton extends cc.Component {
    @property(cc.Node)
    _targetNode: cc.Node = null;

    @property
    _interactable = true;

    @property(cc.SpriteFrame)
    disabled: cc.SpriteFrame = null;

    @property
    _enableAutoGrayEffect = false;

    @property({
        type: cc.Float,
        tooltip: "缩放比例"
    })
    scaleRadio = .95;

    @property({
        type: cc.Integer
    })
    _clickDelay = 300;

    @property({
        type: cc.Float,
        tooltip: "长按响应的时长(单位：秒)",
        visible: function () {
            return this.btnType === ButtonType.LongButton || this.btnType === ButtonType.MixButton && -1 !== this.mixButtonTypeList.indexOf(ButtonType.LongButton);
        }
    })
    holdTime = .5;

    @property({
        type: ButtonType
    })
    _btnType = ButtonType.ShortButton;

    @property({
        type: [MixButtonType]
    })
    _mixButtonTypeList = [];

    @property({
        type: [cc.Component.EventHandler],
        visible: function () {
            return this.btnType !== ButtonType.MixButton && this.btnType !== ButtonType.NONE;
        },
        tooltip: "回调函数组"
    })
    noMixEvents = [];

    @property({
        type: [cc.Component.EventHandler],
        visible: function () {
            return this.btnType === ButtonType.MixButton && -1 !== this.mixButtonTypeList.indexOf(ButtonType.ShortButton);
        },
        tooltip: "单击回调函数组"
    })
    shortEvents = [];

    @property({
        type: [cc.Component.EventHandler],
        visible: function () {
            return this.btnType === ButtonType.MixButton && -1 !== this.mixButtonTypeList.indexOf(ButtonType.DoubleButton);
        },
        tooltip: "双击回调函数组"
    })
    doubleEvents = [];

    @property({
        type: [cc.Component.EventHandler],
        visible: function () {
            return this.btnType === ButtonType.MixButton && -1 !== this.mixButtonTypeList.indexOf(ButtonType.LongButton);
        },
        tooltip: "长按回调函数组"
    })
    longEvents = [];

    holdTimeCount = 0;
    isClicked = false;
    clickTimes = 0;
    targetSp = null;
    lastTargetSp = null;
    normalSp = null;
    curClickTime = 0;
    turnDuration = .1;
    normalMaterial = null;
    grayMaterial = null;
    turnTotalTime = null;
    _changeFinished = null;
    f_ScaleX = null;
    f_ScaleY = null;
    t_ScaleX = null;
    t_ScaleY = null;
    o_ScaleX = null;
    o_ScaleY = null;

    @property({
        type: cc.Node
    })
    get targetNode() {
        return this._targetNode;
    }
    set targetNode(e) {
        this._targetNode = e;
        this.changeTargetSp();
    }

    @property({
        type: cc.Boolean,
        tooltip: "是否可交互"
    })
    get interactable() {
        return this._interactable;
    }
    set interactable(e) {
        this._interactable = e;
        this.changeTargetSp();
    }

    @property({
        type: cc.Boolean,
        tooltip: "当设置为 true 的时候，如果 button 的 interactable 属性为 false，则 button 的 sprite Target 会变为灰度"
    })
    get enableAutoGrayEffect() {
        return this._enableAutoGrayEffect;
    }
    set enableAutoGrayEffect(e) {
        this._enableAutoGrayEffect = e;
        this.changeTargetSp();
    }

    @property({
        type: cc.Integer,
        tooltip: "点击间隔(单位：毫秒)，0-没有间隔"
    })
    get clickDelay() {
        return this._clickDelay;
    }
    set clickDelay(e) {
        this._clickDelay = e;
    }

    @property({
        type: ButtonType,
        tooltip: "按钮类型"
    })
    get btnType() {
        return this._btnType;
    }
    set btnType(e) {
        this._btnType = e;
        this.changeDelayTime();
    }

    @property({
        type: [MixButtonType],
        visible: function () {
            return this.btnType === ButtonType.MixButton;
        },
        tooltip: "选择混合类型组合"
    })
    get mixButtonTypeList() {
        return this._mixButtonTypeList;
    }
    set mixButtonTypeList(e) {
        if (!this.checkMixHaveType(e)) {
            this._mixButtonTypeList = e;
            this.changeDelayTime();
        }
    }

    changeDelayTime() {
        if (this.btnType === ButtonType.ShortButton || this.btnType === ButtonType.MixButton && -1 !== this.mixButtonTypeList.indexOf(ButtonType.ShortButton)) {
            const e = this.btnType === ButtonType.MixButton && -1 !== this.mixButtonTypeList.indexOf(ButtonType.ShortButton) && -1 !== this.mixButtonTypeList.indexOf(ButtonType.DoubleButton);
            this.clickDelay = e ? 100 : 300;
        } else this.clickDelay = 0;
    }

    changeTargetSp() {
        this.normalMaterial || (this.normalMaterial = cc.Material.getBuiltinMaterial("2d-sprite"));
        this.grayMaterial || (this.grayMaterial = cc.Material.getBuiltinMaterial("2d-gray-sprite"));
        this.lastTargetSp && this.lastTargetSp.setMaterial(0, this.normalMaterial);
        if (this.targetNode) {
            const e = this.targetNode.getComponent(cc.Sprite);
            this.targetSp = this.lastTargetSp = e;
        } else {
            this.targetSp = this.node.getComponent(cc.Sprite);
            this.lastTargetSp = null;
        }
        this.normalSp || (this.normalSp = this.targetSp.spriteFrame);
        this.disabled && (this.interactable ? this.targetSp.spriteFrame = this.normalSp : this.targetSp.spriteFrame = this.disabled);
        !this.interactable && this.enableAutoGrayEffect ? this.targetSp.setMaterial(0, this.grayMaterial) : this.targetSp.setMaterial(0, this.normalMaterial);
    }

    onTouchEnd() {
        if (this.interactable) {
            this.isClicked = false;
            this._zoomBack();
            this.checkCanExcel && this.checkCanExcel(this.node);
            this.holdTimeCount = 0;
        }
    }

    update(e) {
        const t = this.node;
        this.isClicked && this.holdTimeCount++;
        if (!this._changeFinished) {
            this.turnTotalTime += e;
            let o = 1;
            this.turnDuration > 0 && (o = this.turnTotalTime / this.turnDuration);
            if (o >= 1) {
                o = 1;
                this._changeFinished = true;
            }
            t.scaleX = cc.misc.lerp ? cc.misc.lerp(this.f_ScaleX, this.t_ScaleX, o) : 1;
            t.scaleY = cc.misc.lerp ? cc.misc.lerp(this.f_ScaleY, this.t_ScaleY, o) : 1;
        }
    }

    onLoad() {
        this.turnTotalTime = 0;
        this._changeFinished = true;
        this.f_ScaleX = 1;
        this.f_ScaleY = 1;
        this.t_ScaleX = 1;
        this.t_ScaleY = 1;
        this.o_ScaleX = this.node.scaleX;
        this.o_ScaleY = this.node.scaleY;
    }

    checkCanExcel(e) {
        const t = this;
        const o = Date.now();
        if (o - this.curClickTime > this.clickDelay) {
            this.curClickTime = o;
            this.clickTimes++;
            AudioManager.getInstance().playMusic("btntouch");
            (this.btnType === ButtonType.LongButton || this.btnType === ButtonType.MixButton && -1 !== this.mixButtonTypeList.indexOf(ButtonType.LongButton)) && this.holdTimeCount >= 60 * this.holdTime && this.excelClickEvent(e, ButtonType.LongButton);
            if (this.btnType === ButtonType.DoubleButton || this.btnType === ButtonType.MixButton && -1 !== this.mixButtonTypeList.indexOf(ButtonType.DoubleButton)) {
                const n = setTimeout(function () {
                    clearTimeout(n);
                    t.clickTimes = 0;
                }, 0 === this.clickDelay ? 400 : 2.8 * this.clickDelay);
                if (2 === this.clickTimes) {
                    n && clearTimeout(n);
                    this.excelClickEvent(e, ButtonType.DoubleButton);
                }
            }
            const i = this.btnType === ButtonType.MixButton && -1 !== this.mixButtonTypeList.indexOf(ButtonType.ShortButton) && -1 !== this.mixButtonTypeList.indexOf(ButtonType.DoubleButton);
            if (this.btnType === ButtonType.ShortButton || this.btnType === ButtonType.MixButton && -1 !== this.mixButtonTypeList.indexOf(ButtonType.ShortButton)) {
                if (i) {
                    const a = 1.8 * this.clickDelay;
                    const l = setTimeout(function () {
                        clearTimeout(l);
                        1 === t.clickTimes && t.excelClickEvent(e, ButtonType.ShortButton);
                    }, a);
                } else 1 === this.clickTimes && this.excelClickEvent(e, ButtonType.ShortButton);
            }
        }
    }

    onTouchCancel() {
        this._zoomBack();
        this.isClicked = false;
        this.holdTimeCount = 0;
        this.clickTimes = 0;
    }

    _zoomBack() {
        this.f_ScaleX = this.node.scaleX;
        this.f_ScaleY = this.node.scaleY;
        this.t_ScaleX = this.o_ScaleX;
        this.t_ScaleY = this.o_ScaleY;
        this.turnTotalTime = 0;
        this._changeFinished = false;
    }

    _zoomUp() {
        this.f_ScaleX = this.o_ScaleX;
        this.f_ScaleY = this.o_ScaleY;
        this.t_ScaleX = this.o_ScaleX * this.scaleRadio;
        this.t_ScaleY = this.o_ScaleY * this.scaleRadio;
        this.turnTotalTime = 0;
        this._changeFinished = false;
    }

    checkMixHaveType(e) {
        const t = {};
        for (let o = 0; o < e.length; o++) {
            if (t[e[o]]) {
                e[o] = ButtonType.NONE;
                return true;
            }
            t[e[o]] = true;
        }
        return false;
    }

    onTouchStart() {
        if (this.interactable) {
            this.isClicked = true;
            this.holdTimeCount = 0;
            this._zoomUp();
        }
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    excelClickEvent(e, t) {
        if (t !== ButtonType.NONE) {
            this.clickTimes = 0;
            if (this.btnType !== ButtonType.MixButton) this.noMixEvents.forEach(function (t) {
                if (t && t.handler && t.target) {
                    const o = t.target.getComponent(t._componentName);
                    o && o[t.handler] && o[t.handler](e, t.customEventData);
                }
            }); else {
                t === ButtonType.ShortButton && this.shortEvents.forEach(function (t) {
                    if (t && t.handler && t.target) {
                        const o = t.target.getComponent(t._componentName);
                        o && o[t.handler] && o[t.handler](e, t.customEventData);
                    }
                });
                t === ButtonType.DoubleButton && this.doubleEvents.forEach(function (t) {
                    if (t && t.handler && t.target) {
                        const o = t.target.getComponent(t._componentName);
                        o && o[t.handler] && o[t.handler](e, t.customEventData);
                    }
                });
                t === ButtonType.LongButton && this.longEvents.forEach(function (t) {
                    if (t && t.handler && t.target) {
                        const o = t.target.getComponent(t._componentName);
                        o && o[t.handler] && o[t.handler](e, t.customEventData);
                    }
                });
            }
        }
    }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
}
