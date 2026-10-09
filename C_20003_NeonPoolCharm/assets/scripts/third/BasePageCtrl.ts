import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import NativeEventType from "./NativeEventType";
import { DISTANCE_BOTTOM, DISTANCE_TOP } from "./PageConfig";
import PageMgr from "./PageMgr";
import SdkHelper from "./SdkHelper";

const { ccclass, property } = cc._decorator;

export const AnimType = cc.Enum({
    NONE: 0,
    SCALE: 1,
    FADE: 2,
    POINTSCALE: 3,
    POINTSCALE2: 4,
    POINTSCALE3: 5
});

@ccclass
export default class BasePageCtrl extends cc.Component {
    @property({
        tooltip: "是否加入队列",
        visible: true
    })
    _inQueue = false;

    @property({
        tooltip: "是否唯一",
        visible: true
    })
    _only = true;

    @property({
        tooltip: "是否复用",
        visible: true
    })
    _reuse = true;

    @property({
        type: cc.Enum(AnimType),
        visible: true,
        tooltip: "动画类型"
    })
    _animType = AnimType.SCALE;

    @property({
        visible: true,
        tooltip: "动画时间"
    })
    _animTime = .1;

    @property({
        visible: true,
        displayName: "蒙版配置"
    })
    _animControl = false;

    @property({
        tooltip: "蒙版初始透明度",
        visible: function () {
            return this._animControl;
        }
    })
    _black_start_opacity = 0;

    @property({
        tooltip: "蒙版结束透明度",
        visible: function () {
            return this._animControl;
        }
    })
    _black_end_opacity = 200;

    @property({
        tooltip: "蒙版动画时间",
        visible: function () {
            return this._animControl;
        }
    })
    _blackTime = .1;

    @property({
        visible: true,
        displayName: "页面遮挡控制"
    })
    _touchControl = false;

    @property({
        tooltip: "阻止页面穿透",
        visible: function () {
            return this._touchControl;
        }
    })
    _hasPeneLock = true;

    @property({
        tooltip: "黑色蒙版",
        visible: function () {
            return this._touchControl;
        }
    })
    _hasBlack = true;

    @property({
        tooltip: "阻止页面内点击",
        visible: function () {
            return this._touchControl;
        }
    })
    _hasTouchLock = true;

    @property({
        tooltip: "页面黑色遮罩Touch监听",
        visible: function () {
            return this._touchControl;
        }
    })
    _hasBlackTouch = true;

    _set_oldContent = new Set();
    _peneLock = null;
    _black = null;
    _touchLock = null;
    _content = null;
    _highestIndex = 0;
    _show_timestemp = 0;
    _report_data = null;
    _start_pos = null;
    notReoprt = false;

    onBlackTouch() {}

    _lockTouch() {
        this._touchLock && (this._touchLock.active = true);
    }

    onUILoad() {}

    hide() {
        const e = this;
        const t = this._animType;
        this._lockTouch();
        const n = this._content;
        cc.Tween.stopAllByTarget(n);
        const i = this._animTime;
        switch (t) {
            case AnimType.NONE:
                this._onHide();
                break;
            case AnimType.SCALE:
                n.scale = 1;
                n.opacity = 255;
                cc.tween(n).to(i, {
                    scale: .7,
                    opacity: 127.5
                }).set({
                    opacity: 0
                }).delay(.03).call(function () {
                    e._onHide();
                }).start();
                break;
            case AnimType.FADE:
                n.opacity = 255;
                cc.tween(n).to(i, {
                    opacity: 0
                }).call(function () {
                    e._onHide();
                }).start();
                break;
            case AnimType.POINTSCALE:
            case AnimType.POINTSCALE2:
            case AnimType.POINTSCALE3:
                n.scale = 1;
                cc.tween(n).to(.2, {
                    scale: .4
                }, {
                    easing: "backin"
                }).to(.2, {
                    scale: 0,
                    y: this._start_pos.y,
                    x: this._start_pos.x
                }, {
                    easing: "backin"
                }).call(function () {
                    e._onHide();
                    n.setPosition(0, 0);
                }).start();
        }
        this._hideBlack();
    }

    _showBlack() {
        const e = this._black;
        if (e) {
            e.opacity = this._black_start_opacity;
            cc.Tween.stopAllByTarget(e);
            cc.tween(e).to(this._blackTime, {
                opacity: this._black_end_opacity
            }).start();
        }
    }

    addBlackTouch() {
        if (this._hasBlackTouch && this._black) {
            this._black.hasEventListener(cc.Node.EventType.TOUCH_END) && this.removeBlackTouch();
            this._black.on(cc.Node.EventType.TOUCH_END, this.onBlackTouch, this);
        }
    }

    _createPeneLock() {
        if (this._hasPeneLock) {
            const e = new cc.Node("peneLock");
            e.addComponent(cc.BlockInputEvents);
            e.setContentSize(cc.winSize);
            this.node.addChild(e);
            this._peneLock = e;
            this._setIndex(e);
        }
    }

    _setBottomNodes(e) {
        const t = cc.winSize.height;
        const o = EngineUtil.isLargeScreen() ? t / 2 - DISTANCE_BOTTOM : t / 2;
        e.y = -o;
    }

    _reportExit() {
        const e = new Date().getTime();
        SdkHelper.reportData("b_leave_game_page", {
            act_page: this.node.name,
            duration: e - this._show_timestemp
        });
        this._show_timestemp = 0;
    }

    _saveContent() {
        const e = this;
        this.node.children.forEach(function (t) {
            return e._set_oldContent.add(t);
        });
    }

    _show() {
        const e = this;
        const t = this._animType;
        this._lockTouch();
        const n = this._content;
        cc.Tween.stopAllByTarget(n);
        const i = this._animTime;
        switch (t) {
            case AnimType.NONE:
                this._onShow();
                break;
            case AnimType.SCALE:
                n.scale = .7;
                n.opacity = 127.5;
                cc.tween(n).to(i, {
                    scale: 1,
                    opacity: 255
                }).call(function () {
                    e._onShow();
                }).start();
                break;
            case AnimType.FADE:
                n.opacity = 0;
                cc.tween(n).to(i, {
                    opacity: 255
                }).call(function () {
                    e._onShow();
                }).start();
                break;
            case AnimType.POINTSCALE:
                this._onShow();
                break;
            case AnimType.POINTSCALE2:
                n.scale = 0;
                cc.tween(n).to(i, {
                    scale: 1
                }, {
                    easing: "backOut"
                }).call(function () {
                    e._onShow();
                }).start();
                break;
            case AnimType.POINTSCALE3:
                this._content.scale = 0;
                this._black.opacity = this._black_start_opacity;
        }
        t != AnimType.POINTSCALE3 ? this._showBlack() : cc.Tween.stopAllByTarget(this._black);
    }

    _onHide() {
        this._unLockTouch();
        this.node.active = false;
    }

    _setIndex(e) {
        if (e) {
            e.zIndex = this._highestIndex;
            this._highestIndex++;
        }
    }

    onLoad() {
        this._saveContent();
        this._createPeneLock();
        this._createBlack();
        this._createContent();
        this._createTouchLock();
        EventMgr.listen(NativeEventType.APP_PAUSE, this._onAppPause, this);
        EventMgr.listen(NativeEventType.APP_RESTART, this._onAppRestart, this);
    }

    _onAppPause() {
        this.node.active && this._reportExit();
    }

    _init(...e) {
    }

    onEnable() {
        this._reportEntry();
        this._show();
    }

    _reportEntry() {
        if (!this.notReoprt) {
            this._show_timestemp = new Date().getTime();
            const e = {
                act_page: this.node.name
            };
            this._report_data && Object.assign(e, this._report_data);
            SdkHelper.reportData("b_entry_game_page", e);
        }
    }

    startPOINTSCALE3() {
        const e = this._content;
        e.scale = 0;
        e.setPosition(this._start_pos);
        cc.tween(e).parallel(cc.tween(e).to(.4, {
            scale: 1
        }, {
            easing: "backOut"
        }), cc.tween(e).to(.2, {
            y: 0,
            x: 0
        })).call(this._onShow.bind(this)).start();
        this._showBlack();
    }

    _addReportData(e) {
        this._report_data || (this._report_data = {});
        Object.assign(this._report_data, e);
    }

    _onShow() {
        this._unLockTouch();
        this.addBlackTouch();
    }

    onDisable() {
        this._reportExit();
        PageMgr.hidePage(this.node.name);
    }

    _createBlack() {
        if (this._hasBlack) {
            const e = new cc.Node("black");
            const t = e.addComponent(cc.Sprite);
            cc.resources.load("pages/res/back", cc.SpriteFrame, function (o, n) {
                if (o) console.error("class:basePage", o); else {
                    t.spriteFrame = n;
                    e.setContentSize(cc.winSize);
                }
            });
            this.node.addChild(e);
            e.color = EngineUtil.getColor("000000");
            this._black = e;
            this._setIndex(e);
        }
    }

    _setTopNodes(e) {
        const t = cc.winSize.height;
        e.y = EngineUtil.isLargeScreen() ? t / 2 - DISTANCE_TOP : t / 2;
    }

    removeBlackTouch() {
        this._black && this._black.off(cc.Node.EventType.TOUCH_END, this.onBlackTouch, this);
    }

    _unLockTouch() {
        this._touchLock && (this._touchLock.active = false);
    }

    _createTouchLock() {
        if (this._hasTouchLock) {
            const e = new cc.Node("closeTouch");
            e.addComponent(cc.BlockInputEvents);
            e.setContentSize(cc.winSize);
            this.node.addChild(e);
            this._touchLock = e;
            this._setIndex(e);
        }
    }

    _hideBlack() {
        const e = this._black;
        if (e) {
            e.opacity = this._black_end_opacity;
            cc.Tween.stopAllByTarget(e);
            cc.tween(e).to(this._blackTime, {
                opacity: this._black_start_opacity
            }).start();
        }
    }

    _onAppRestart() {
        this.node.active && this._reportEntry();
    }

    _createContent() {
        const e = this;
        const t = new cc.Node("content");
        t.setContentSize(cc.winSize);
        this.node.addChild(t);
        this._set_oldContent.forEach(function (o) {
            o.parent = t;
            "top" == o.name && e._setTopNodes(o);
            "bottom" == o.name && e._setBottomNodes(o);
        });
        this._content = t;
        this._setIndex(t);
    }
}
