import NativeEventType from "./NativeEventType";
import EventMgr from "./EventMgr";
import SdkHelper from "./SdkHelper";
import EngineUtil from "./EngineUtil";
import { DISTANCE_BOTTOM, DISTANCE_TOP } from "./PageConfig";
import PageMgr from "./PageMgr";

const { ccclass, property } = cc._decorator;

export const AnimType = cc.Enum({
    NONE: 0,
    SCALE: 1,
    FADE: 2,
    POINTSCALE: 3,
    POINTSCALE2: 4,
    POINTSCALE3: 5,
});

@ccclass
export default class BasePageCtrl extends cc.Component {
    @property({
        tooltip: "是否加入队列",
        visible: true,
    })
    _inQueue: boolean = false;
    @property({
        tooltip: "是否唯一",
        visible: true,
    })
    _only: boolean = true;
    @property({
        tooltip: "是否复用",
        visible: true,
    })
    _reuse: boolean = true;
    @property({
        type: cc.Enum(AnimType),
        visible: true,
        tooltip: "动画类型",
    })
    _animType: number = AnimType.SCALE;
    @property({
        visible: true,
        tooltip: "动画时间",
    })
    _animTime: number = 0.1;
    @property({
        visible: true,
        displayName: "蒙版配置",
    })
    _animControl: boolean = false;
    @property({
        tooltip: "蒙版初始透明度",
        visible: function (this: BasePageCtrl) {
            return this._animControl;
        },
    })
    _black_start_opacity: number = 0;
    @property({
        tooltip: "蒙版结束透明度",
        visible: function (this: BasePageCtrl) {
            return this._animControl;
        },
    })
    _black_end_opacity: number = 200;
    @property({
        tooltip: "蒙版动画时间",
        visible: function (this: BasePageCtrl) {
            return this._animControl;
        },
    })
    _blackTime: number = 0.1;
    @property({
        visible: true,
        displayName: "页面遮挡控制",
    })
    _touchControl: boolean = false;
    @property({
        tooltip: "阻止页面穿透",
        visible: function (this: BasePageCtrl) {
            return this._touchControl;
        },
    })
    _hasPeneLock: boolean = true;
    @property({
        tooltip: "黑色蒙版",
        visible: function (this: BasePageCtrl) {
            return this._touchControl;
        },
    })
    _hasBlack: boolean = true;
    @property({
        tooltip: "阻止页面内点击",
        visible: function (this: BasePageCtrl) {
            return this._touchControl;
        },
    })
    _hasTouchLock: boolean = true;
    @property({
        tooltip: "页面黑色遮罩Touch监听",
        visible: function (this: BasePageCtrl) {
            return this._touchControl;
        },
    })
    _hasBlackTouch: boolean = true;

    _set_oldContent: Set<cc.Node> = new Set();
    _peneLock: cc.Node = null;
    _black: cc.Node = null;
    _touchLock: cc.Node = null;
    _content: cc.Node = null;
    _highestIndex: number = 0;
    _show_timestemp: number = 0;
    _report_data: any = null;
    _start_pos: cc.Vec2 = null;
    notReoprt: boolean = false;

    onBlackTouch(): void {}

    _lockTouch(): void {
        if (this._touchLock) {
            this._touchLock.active = true;
        }
    }

    onUILoad(): void {}

    hide(): void {
        const self = this;
        const animType = this._animType;
        this._lockTouch();
        const content = this._content;
        cc.Tween.stopAllByTarget(content);
        const animTime = this._animTime;
        switch (animType) {
            case AnimType.NONE:
                this._onHide();
                break;
            case AnimType.SCALE:
                content.scale = 1;
                content.opacity = 255;
                cc.tween(content)
                    .to(animTime, {
                        scale: 0.7,
                        opacity: 127.5,
                    })
                    .set({
                        opacity: 0,
                    })
                    .delay(0.03)
                    .call(function () {
                        self._onHide();
                    })
                    .start();
                break;
            case AnimType.FADE:
                content.opacity = 255;
                cc.tween(content)
                    .to(animTime, {
                        opacity: 0,
                    })
                    .call(function () {
                        self._onHide();
                    })
                    .start();
                break;
            case AnimType.POINTSCALE:
            case AnimType.POINTSCALE2:
            case AnimType.POINTSCALE3:
                content.scale = 1;
                cc.tween(content)
                    .to(0.2, { scale: 0.4 }, { easing: "backin" })
                    .to(
                        0.2,
                        {
                            scale: 0,
                            y: this._start_pos.y,
                            x: this._start_pos.x,
                        },
                        { easing: "backin" }
                    )
                    .call(function () {
                        self._onHide();
                        content.setPosition(0, 0);
                    })
                    .start();
                break;
        }
        this._hideBlack();
    }

    _showBlack(): void {
        const black = this._black;
        if (black) {
            black.opacity = this._black_start_opacity;
            cc.Tween.stopAllByTarget(black);
            cc.tween(black)
                .to(this._blackTime, {
                    opacity: this._black_end_opacity,
                })
                .start();
        }
    }

    addBlackTouch(): void {
        if (this._hasBlackTouch && this._black) {
            if (this._black.hasEventListener(cc.Node.EventType.TOUCH_END)) {
                this.removeBlackTouch();
            }
            this._black.on(cc.Node.EventType.TOUCH_END, this.onBlackTouch, this);
        }
    }

    _createPeneLock(): void {
        if (this._hasPeneLock) {
            const node = new cc.Node("peneLock");
            node.addComponent(cc.BlockInputEvents);
            node.setContentSize(cc.winSize);
            this.node.addChild(node);
            this._peneLock = node;
            this._setIndex(node);
        }
    }

    _setBottomNodes(node: cc.Node): void {
        const height = cc.winSize.height;
        const offset = EngineUtil.isLargeScreen() ? height / 2 - DISTANCE_BOTTOM : height / 2;
        node.y = -offset;
    }

    _reportExit(): void {
        const now = new Date().getTime();
        SdkHelper.reportData("b_leave_game_page", {
            act_page: this.node.name,
            duration: now - this._show_timestemp,
        });
        this._show_timestemp = 0;
    }

    _saveContent(): void {
        const self = this;
        this.node.children.forEach(function (child) {
            return self._set_oldContent.add(child);
        });
    }

    _show(): void {
        const self = this;
        const animType = this._animType;
        this._lockTouch();
        const content = this._content;
        cc.Tween.stopAllByTarget(content);
        const animTime = this._animTime;
        switch (animType) {
            case AnimType.NONE:
                this._onShow();
                break;
            case AnimType.SCALE:
                content.scale = 0.7;
                content.opacity = 127.5;
                cc.tween(content)
                    .to(animTime, {
                        scale: 1,
                        opacity: 255,
                    })
                    .call(function () {
                        self._onShow();
                    })
                    .start();
                break;
            case AnimType.FADE:
                content.opacity = 0;
                cc.tween(content)
                    .to(animTime, {
                        opacity: 255,
                    })
                    .call(function () {
                        self._onShow();
                    })
                    .start();
                break;
            case AnimType.POINTSCALE:
                this._onShow();
                break;
            case AnimType.POINTSCALE2:
                content.scale = 0;
                cc.tween(content)
                    .to(animTime, { scale: 1 }, { easing: "backOut" })
                    .call(function () {
                        self._onShow();
                    })
                    .start();
                break;
            case AnimType.POINTSCALE3:
                this._content.scale = 0;
                this._black.opacity = this._black_start_opacity;
                break;
        }
        if (animType != AnimType.POINTSCALE3) {
            this._showBlack();
        } else {
            cc.Tween.stopAllByTarget(this._black);
        }
    }

    _onHide(): void {
        this._unLockTouch();
        this.node.active = false;
    }

    _setIndex(node: cc.Node): void {
        if (node) {
            node.zIndex = this._highestIndex;
            this._highestIndex++;
        }
    }

    onLoad(): void {
        this._saveContent();
        this._createPeneLock();
        this._createBlack();
        this._createContent();
        this._createTouchLock();
        EventMgr.listen(NativeEventType.APP_PAUSE, this._onAppPause, this);
        EventMgr.listen(NativeEventType.APP_RESTART, this._onAppRestart, this);
    }

    _onAppPause(): void {
        if (this.node.active) {
            this._reportExit();
        }
    }

    _init(...args: any[]): void {}

    onEnable(): void {
        this._reportEntry();
        this._show();
    }

    _reportEntry(): void {
        if (!this.notReoprt) {
            this._show_timestemp = new Date().getTime();
            const data: any = {
                act_page: this.node.name,
            };
            if (this._report_data) {
                Object.assign(data, this._report_data);
            }
            SdkHelper.reportData("b_entry_game_page", data);
        }
    }

    startPOINTSCALE3(): void {
        const content = this._content;
        content.scale = 0;
        content.setPosition(this._start_pos);
        cc.tween(content)
            .parallel(
                cc.tween(content).to(0.4, { scale: 1 }, { easing: "backOut" }),
                cc.tween(content).to(0.2, { y: 0, x: 0 })
            )
            .call(this._onShow.bind(this))
            .start();
        this._showBlack();
    }

    _addReportData(data: any): void {
        if (!this._report_data) {
            this._report_data = {};
        }
        Object.assign(this._report_data, data);
    }

    _onShow(): void {
        this._unLockTouch();
        this.addBlackTouch();
    }

    onDisable(): void {
        this._reportExit();
        PageMgr.hidePage(this.node.name);
    }

    _createBlack(): void {
        if (this._hasBlack) {
            const node = new cc.Node("black");
            const sprite = node.addComponent(cc.Sprite);
            cc.resources.load("pages/res/back", cc.SpriteFrame, function (err, frame) {
                if (err) {
                    console.error("class:basePage", err);
                } else {
                    sprite.spriteFrame = frame;
                    node.setContentSize(cc.winSize);
                }
            });
            this.node.addChild(node);
            node.color = EngineUtil.getColor("000000");
            this._black = node;
            this._setIndex(node);
        }
    }

    _setTopNodes(node: cc.Node): void {
        const height = cc.winSize.height;
        node.y = EngineUtil.isLargeScreen() ? height / 2 - DISTANCE_TOP : height / 2;
    }

    removeBlackTouch(): void {
        if (this._black) {
            this._black.off(cc.Node.EventType.TOUCH_END, this.onBlackTouch, this);
        }
    }

    _unLockTouch(): void {
        if (this._touchLock) {
            this._touchLock.active = false;
        }
    }

    _createTouchLock(): void {
        if (this._hasTouchLock) {
            const node = new cc.Node("closeTouch");
            node.addComponent(cc.BlockInputEvents);
            node.setContentSize(cc.winSize);
            this.node.addChild(node);
            this._touchLock = node;
            this._setIndex(node);
        }
    }

    _hideBlack(): void {
        const black = this._black;
        if (black) {
            black.opacity = this._black_end_opacity;
            cc.Tween.stopAllByTarget(black);
            cc.tween(black)
                .to(this._blackTime, {
                    opacity: this._black_start_opacity,
                })
                .start();
        }
    }

    _onAppRestart(): void {
        if (this.node.active) {
            this._reportEntry();
        }
    }

    _createContent(): void {
        const self = this;
        const content = new cc.Node("content");
        content.setContentSize(cc.winSize);
        this.node.addChild(content);
        this._set_oldContent.forEach(function (child) {
            child.parent = content;
            if (child.name == "top") {
                self._setTopNodes(child);
            }
            if (child.name == "bottom") {
                self._setBottomNodes(child);
            }
        });
        this._content = content;
        this._setIndex(content);
    }
}
