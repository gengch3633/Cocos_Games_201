export const EventType = cc.Enum({
    SCROLL_START: 0,
    SCROLL_ING: 1,
    SCROLL_END: 2,
});

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIScrollSelect extends cc.Component {
    static EventType = EventType;

    @property(cc.Node)
    content: cc.Node = null;

    @property({ tooltip: "是否无限翻页" })
    circlePage = true;

    @property({
        type: cc.Button,
        tooltip: "左边按钮",
        visible() {
            return !this.circlePage;
        },
    })
    leftBtn: cc.Button = null;

    @property({
        type: cc.Button,
        tooltip: "右边按钮",
        visible() {
            return !this.circlePage;
        },
    })
    rightBtn: cc.Button = null;

    @property({ type: cc.Integer, tooltip: "单个控件之间的距离" })
    deltaX = 100;

    @property({ type: cc.Float, tooltip: "中心点的缩放比例" })
    centerScale = 1;

    @property({ type: cc.Float, tooltip: "边缘点的缩放比例" })
    minScale = 1;

    @property({ type: cc.Float, tooltip: "滚动时的速度" })
    scrollSpeed = 300;

    @property({ type: cc.Component.EventHandler, tooltip: "选择后的回调" })
    selectEvents: cc.Component.EventHandler[] = [];

    childs: cc.Node[] = [];
    isTouching = false;
    hasTouchMove = false;
    isTestX = false;
    _touchId: cc.Touch = null;
    currentIndex = 0;
    _toMoveX = 1;
    dx = 0;
    moveAim = 0;
    startTouchX = 0;

    _checkChildX(node: cc.Node, x: number): void {
        if (this.circlePage) {
            if (x > (this.childs.length / 2) * this.deltaX) {
                x -= this.childs.length * this.deltaX;
            } else if (x < (-this.childs.length / 2) * this.deltaX) {
                x += this.childs.length * this.deltaX;
            }
        }
        node.position = cc.v3(x, node.position.y, node.position.z);
        const scale =
            (1 - Math.min(Math.abs(x), this.deltaX) / this.deltaX) * (this.centerScale - this.minScale) + this.minScale;
        node.scale = scale;
    }

    _onTouch(event: cc.Event.EventTouch): void {
        cc.game.emit("touchUIScrollSelect", false);
        if (this._touchId == null || event.touch == this._touchId) {
            if (event.type != cc.Node.EventType.TOUCH_START) {
                this.hasTouchMove = true;
                const x = event.getLocation().x - this.dx;
                this._move(x);
                this.dx = event.getLocation().x;
                cc.Component.EventHandler.emitEvents(this.selectEvents, {
                    target: this,
                    type: EventType.SCROLL_ING,
                    dx: this.dx,
                });
            } else {
                this.isTouching = true;
                this.hasTouchMove = false;
                this.isTestX = false;
                this._touchId = event.touch;
                this.dx = event.getStartLocation().x;
                this.startTouchX = this.dx;
                cc.Component.EventHandler.emitEvents(this.selectEvents, {
                    target: this,
                    type: EventType.SCROLL_START,
                    index: this.currentIndex,
                });
            }
        }
    }

    _move(delta: number): void {
        if (delta !== 0) {
            if (!this.circlePage) {
                const edge = this._isMoveEdge();
                if (delta < 0 && edge.right) {
                    console.log("最右边 无法动" + this.currentIndex);
                    if (this.currentIndex != this.childs.length - 1) {
                        this.scrollTo(this.childs.length - 1, false);
                    }
                    return;
                }
                if (delta > 0 && edge.left) {
                    console.log("最左边 无法动" + this.currentIndex);
                    if (this.currentIndex != 0) {
                        this.scrollTo(0, false);
                    }
                    return;
                }
            }
            for (let i = 0; i < this.childs.length; i++) {
                this._checkChildX(this.childs[i], this.childs[i].position.x + delta);
            }
        }
    }

    init(): void {
        this.childs = [];
        for (let i = 0; i < this.content.children.length; i++) {
            this.childs[i] = this.content.children[i];
            this.childs[i].position = cc.v3(this.deltaX * (i - 1), this.childs[i].position.y, 0);
        }
        this.isTouching = false;
        this.hasTouchMove = false;
        this.isTestX = false;
        this._touchId = null;
        this.scrollTo(0, false);
    }

    scrollTo(index: number, anim: boolean = true): void {
        if (index < 0 && index >= this.childs.length) {
            return console.error(this.node.name + "->移动超出边界面");
        }
        this.currentIndex = index;
        this.moveAim = index;
        if (anim) {
            this.isTestX = true;
            cc.Component.EventHandler.emitEvents(this.selectEvents, {
                target: this,
                type: EventType.SCROLL_START,
                index: this.currentIndex,
            });
        } else {
            for (let i = 0; i < this.childs.length; i++) {
                this._checkChildX(this.childs[i], (i - index) * this.deltaX);
            }
            cc.Component.EventHandler.emitEvents(this.selectEvents, {
                target: this,
                type: EventType.SCROLL_END,
                index: this.currentIndex,
            });
        }
    }

    _onTouchEnd(event: cc.Event.EventTouch): void {
        cc.game.emit("touchUIScrollSelect", true);
        if (this._touchId == null || event.touch == this._touchId) {
            this.isTouching = false;
            if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
                this._touchId = null;
            }
            const location = event.getLocation();
            const localPos = this.node.convertToNodeSpaceAR(location);
            const moveDistance = Math.abs(this.startTouchX - location.x);
            if (!this.hasTouchMove || moveDistance < 2) {
                const pageOffset = Math.ceil((localPos.x - this.deltaX / 2) / this.deltaX);
                if (pageOffset === 0) {
                    cc.Component.EventHandler.emitEvents(this.selectEvents, {
                        target: this,
                        type: EventType.SCROLL_END,
                        index: this.currentIndex,
                    });
                } else {
                    const targetIndex = (this.currentIndex + pageOffset + this.childs.length) % this.childs.length;
                    if (targetIndex > this.currentIndex && pageOffset < 0) {
                        console.log("最左边 无法动");
                        return;
                    }
                    if (targetIndex < this.currentIndex && pageOffset > 0) {
                        console.log("最右边 无法动");
                        return;
                    }
                    this.moveAim = targetIndex;
                    this._toMoveX = pageOffset > 0 ? -1 : 1;
                    this.isTestX = true;
                }
            } else {
                if (!this.circlePage) {
                    const edge = this._isMoveEdge();
                    if (edge.right) {
                        console.log("最右边 无法动");
                        return;
                    }
                    if (edge.left) {
                        console.log("最左边 无法动");
                        return;
                    }
                }
                let minDistance = this.deltaX;
                let nearestIndex = 0;
                for (let i = 0; i < this.childs.length; i++) {
                    if (Math.abs(this.childs[i].position.x) <= minDistance) {
                        minDistance = Math.abs(this.childs[i].position.x);
                        nearestIndex = i;
                    }
                }
                this.moveAim = nearestIndex;
                this._toMoveX = this.childs[nearestIndex].position.x >= 0 ? -1 : 1;
                this.isTestX = true;
            }
        }
    }

    scrollToRight(): void {
        this._toMoveX = -1;
        this.scrollTo((this.currentIndex + 1 + this.childs.length) % this.childs.length);
        this._setPageBtnsStatus();
    }

    scrollToLeft(): void {
        this._toMoveX = 1;
        this.scrollTo((this.currentIndex - 1 + this.childs.length) % this.childs.length);
        this._setPageBtnsStatus();
    }

    _setPageBtnsStatus(): void {
        const isRightEdge = this.currentIndex >= this.childs.length - 1;
        if (!this.circlePage && isRightEdge) {
            console.log("已经到了最右边", this.currentIndex);
            if (this.rightBtn) {
                this.rightBtn.interactable = false;
            }
        } else if (this.rightBtn) {
            this.rightBtn.interactable = true;
        }
        const isLeftEdge = this.currentIndex <= 0;
        if (!this.circlePage && isLeftEdge) {
            console.log("已经到了最左边", this.currentIndex);
            if (this.leftBtn) {
                this.leftBtn.interactable = false;
            }
        } else if (this.leftBtn) {
            this.leftBtn.interactable = true;
        }
    }

    start(): void {
        this.content.on(cc.Node.EventType.TOUCH_START, this._onTouch, this);
        this.content.on(cc.Node.EventType.TOUCH_MOVE, this._onTouch, this);
        this.content.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.content.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
    }

    update(dt: number): void {
        if (!this.isTouching && this.isTestX) {
            const delta = this._toMoveX * dt * this.scrollSpeed;
            const prevX = this.childs[this.moveAim].position.x;
            for (let i = 0; i < this.childs.length; i++) {
                this._checkChildX(this.childs[i], this.childs[i].position.x + delta);
            }
            const firstX = this.childs[0].position.x;
            const roundOffset = Math.round(firstX / this.deltaX);
            const snapDelta = this.deltaX * roundOffset;
            const currentX = this.childs[this.moveAim].position.x;
            if (prevX * currentX < 0 && Math.abs(currentX) < this.deltaX) {
                this.isTestX = false;
                for (let i = 0; i < this.childs.length; i++) {
                    if (Math.abs(this.childs[i].position.x) <= Math.abs(delta)) {
                        this.currentIndex = i;
                        break;
                    }
                }
                for (let i = 0; i < this.childs.length; i++) {
                    this._checkChildX(this.childs[i], this.childs[i].position.x + snapDelta - firstX);
                }
                cc.Component.EventHandler.emitEvents(this.selectEvents, {
                    target: this,
                    type: EventType.SCROLL_END,
                    index: this.currentIndex,
                });
            }
        }
    }

    _isMoveEdge(): { left: boolean; right: boolean } {
        return {
            left: this.childs[0].position.x >= 0,
            right: this.childs[this.childs.length - 1].position.x <= 0,
        };
    }
}
