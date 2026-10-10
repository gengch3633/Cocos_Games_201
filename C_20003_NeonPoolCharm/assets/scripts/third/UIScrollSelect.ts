const { ccclass, property } = cc._decorator;

export const EventType = cc.Enum({
    SCROLL_START: 0,
    SCROLL_ING: 1,
    SCROLL_END: 2
});

@ccclass
export default class UIScrollSelect extends cc.Component {
    static EventType;

    @property(cc.Node)
    content = null;

    @property({
        tooltip: "是否无限翻页"
    })
    circlePage = true;

    @property({
        type: cc.Button,
        tooltip: "左边按钮",
        visible: function () {
            return !this.circlePage;
        }
    })
    leftBtn = null;

    @property({
        type: cc.Button,
        tooltip: "右边按钮",
        visible: function () {
            return !this.circlePage;
        }
    })
    rightBtn = null;

    @property({
        type: cc.Integer,
        tooltip: "单个控件之间的距离"
    })
    deltaX = 100;

    @property({
        type: cc.Float,
        tooltip: "中心点的缩放比例"
    })
    centerScale = 1;

    @property({
        type: cc.Float,
        tooltip: "边缘点的缩放比例"
    })
    minScale = 1;

    @property({
        type: cc.Float,
        tooltip: "滚动时的速度"
    })
    scrollSpeed = 300;

    @property({
        type: cc.Component.EventHandler,
        tooltip: "选择后的回调"
    })
    selectEvents = [];

    childs = [];

    isTouching = false;

    hasTouchMove = false;

    isTestX = false;

    _touchId = null;

    currentIndex = 0;

    _toMoveX = 1;

    dx = 0;

    moveAim = 0;

    startTouchX = 0;

    _checkChildX(e, t) {
        this.circlePage && (t > this.childs.length / 2 * this.deltaX ? t -= this.childs.length * this.deltaX : t < -this.childs.length / 2 * this.deltaX && (t += this.childs.length * this.deltaX));
        e.position = cc.v3(t, e.position.y, e.position.z);
        const o = (1 - Math.min(Math.abs(t), this.deltaX) / this.deltaX) * (this.centerScale - this.minScale) + this.minScale;
        e.scale = o;
    }

    _onTouch(e) {
        cc.game.emit("touchUIScrollSelect", false);
        if (null == this._touchId || e.touch == this._touchId) if (e.type != cc.Node.EventType.TOUCH_START) {
            this.hasTouchMove = true;
            const t = e.getLocation().x - this.dx;
            this._move(t);
            this.dx = e.getLocation().x;
            const n = {
                target: this,
                type: EventType.SCROLL_ING,
                dx: this.dx
            };
            cc.Component.EventHandler.emitEvents(this.selectEvents, n);
        } else {
            this.isTouching = true;
            this.hasTouchMove = false;
            this.isTestX = false;
            this._touchId = e.touch;
            this.dx = e.getStartLocation().x;
            this.startTouchX = this.dx;
            const i = {
                target: this,
                type: EventType.SCROLL_START,
                index: this.currentIndex
            };
            cc.Component.EventHandler.emitEvents(this.selectEvents, i);
        }
    }

    _move(e) {
        if (0 !== e) {
            if (!this.circlePage) {
                const t = this._isMoveEdge();
                if (e < 0 && t.right) {
                    console.log("最右边 无法动" + this.currentIndex);
                    this.currentIndex != this.childs.length - 1 && this.scrollTo(this.childs.length - 1, false);
                    return;
                }
                if (e > 0 && t.left) {
                    console.log("最左边 无法动" + this.currentIndex);
                    0 != this.currentIndex && this.scrollTo(0, false);
                    return;
                }
            }
            for (let o = 0; o < this.childs.length; o++) this._checkChildX(this.childs[o], this.childs[o].position.x + e);
        }
    }

    init() {
        this.childs = [];
        for (let e = 0; e < this.content.children.length; e++) {
            this.childs[e] = this.content.children[e];
            this.childs[e].position = cc.v3(this.deltaX * (e - 1), this.childs[e].position.y, 0);
        }
        this.isTouching = false;
        this.hasTouchMove = false;
        this.isTestX = false;
        this._touchId = null;
        this.scrollTo(0, false);
    }

    scrollTo(e, t) {
        if (undefined === t) {
            t = true;
        }
        if (e < 0 && e >= this.childs.length) return console.error(this.node.name + "->移动超出边界面");
        this.currentIndex = e;
        this.moveAim = e;
        if (t) {
            this.isTestX = true;
            cc.Component.EventHandler.emitEvents(this.selectEvents, {
                target: this,
                type: EventType.SCROLL_START,
                index: this.currentIndex
            });
        } else {
            for (let n = 0; n < this.childs.length; n++) this._checkChildX(this.childs[n], (n - e) * this.deltaX);
            const i = {
                target: this,
                type: EventType.SCROLL_END,
                index: this.currentIndex
            };
            cc.Component.EventHandler.emitEvents(this.selectEvents, i);
        }
    }

    _onTouchEnd(e) {
        cc.game.emit("touchUIScrollSelect", true);
        if (null == this._touchId || e.touch == this._touchId) {
            this.isTouching = false;
            e.type != cc.Node.EventType.TOUCH_END && e.type != cc.Node.EventType.TOUCH_CANCEL || (this._touchId = null);
            const t = e.getLocation();
            const n = this.node.convertToNodeSpaceAR(t);
            const i = Math.abs(this.startTouchX - t.x);
            if (!this.hasTouchMove || i < 2) {
                const a = Math.ceil((n.x - this.deltaX / 2) / this.deltaX);
                if (0 === a) {
                    const r = {
                        target: this,
                        type: EventType.SCROLL_END,
                        index: this.currentIndex
                    };
                    cc.Component.EventHandler.emitEvents(this.selectEvents, r);
                } else {
                    const l = (this.currentIndex + a + this.childs.length) % this.childs.length;
                    if (l > this.currentIndex && a < 0) {
                        console.log("最左边 无法动");
                        return;
                    }
                    if (l < this.currentIndex && a > 0) {
                        console.log("最右边 无法动");
                        return;
                    }
                    this.moveAim = l;
                    this._toMoveX = a > 0 ? -1 : 1;
                    this.isTestX = true;
                }
            } else {
                if (!this.circlePage) {
                    const s = this._isMoveEdge();
                    if (s.right) {
                        console.log("最右边 无法动");
                        return;
                    }
                    if (s.left) {
                        console.log("最左边 无法动");
                        return;
                    }
                }
                let c = this.deltaX;
                let u = 0;
                for (let p = 0; p < this.childs.length; p++) if (Math.abs(this.childs[p].position.x) <= c) {
                    c = Math.abs(this.childs[p].position.x);
                    u = p;
                }
                this.moveAim = u;
                this._toMoveX = this.childs[u].position.x >= 0 ? -1 : 1;
                this.isTestX = true;
            }
        }
    }

    scrollToRight() {
        this._toMoveX = -1;
        this.scrollTo((this.currentIndex + 1 + this.childs.length) % this.childs.length);
        this._setPageBtnsStatus();
    }

    scrollToLeft() {
        this._toMoveX = 1;
        this.scrollTo((this.currentIndex - 1 + this.childs.length) % this.childs.length);
        this._setPageBtnsStatus();
    }

    _setPageBtnsStatus() {
        const e = this.currentIndex >= this.childs.length - 1;
        if (!this.circlePage && e) {
            console.log("已经到了最右边", this.currentIndex);
            this.rightBtn && (this.rightBtn.interactable = false);
        } else this.rightBtn && (this.rightBtn.interactable = true);
        const t = this.currentIndex <= 0;
        if (!this.circlePage && t) {
            console.log("已经到了最左边", this.currentIndex);
            this.leftBtn && (this.leftBtn.interactable = false);
        } else this.leftBtn && (this.leftBtn.interactable = true);
    }

    start() {
        this.content.on(cc.Node.EventType.TOUCH_START, this._onTouch, this);
        this.content.on(cc.Node.EventType.TOUCH_MOVE, this._onTouch, this);
        this.content.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.content.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
    }

    update(e) {
        if (!this.isTouching && this.isTestX) {
            const t = this._toMoveX * e * this.scrollSpeed;
            const n = this.childs[this.moveAim].position.x;
            let i;
            for (i = 0; i < this.childs.length; i++) this._checkChildX(this.childs[i], this.childs[i].position.x + t);
            const a = this.childs[0].position.x;
            const r = Math.round(a / this.deltaX);
            const l = this.deltaX * r;
            const s = this.childs[this.moveAim].position.x;
            if (n * s < 0 && Math.abs(s) < this.deltaX) {
                this.isTestX = false;
                for (i = 0; i < this.childs.length; i++) if (Math.abs(this.childs[i].position.x) <= Math.abs(t)) {
                    this.currentIndex = i;
                    break;
                }
                for (i = 0; i < this.childs.length; i++) this._checkChildX(this.childs[i], this.childs[i].position.x + l - a);
                const c = {
                    target: this,
                    type: EventType.SCROLL_END,
                    index: this.currentIndex
                };
                cc.Component.EventHandler.emitEvents(this.selectEvents, c);
            }
        }
    }

    _isMoveEdge() {
        return {
            left: this.childs[0].position.x >= 0,
            right: this.childs[this.childs.length - 1].position.x <= 0
        };
    }
}

UIScrollSelect.EventType = EventType;
