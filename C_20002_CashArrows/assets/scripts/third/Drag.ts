const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/Cocos/Drag")
export default class Drag extends cc.Component {
    _draggable: any = false;
    dragging: any = false;
    startPoint: any = null;
    sensitivity: any = 0;

    get draggable(): any {
        return this._draggable;
    }

    set draggable(e: any) {
        this._draggable != e && (e ? this.startDrag() : this.removeDragEvent());
        this._draggable = e;
    }

    touchStartHandle(e: any) {
        if (this._draggable) {
            e.stopPropagation();
            e.stopPropagationImmediate();
            this.startPoint = e.getLocation();
        }
    }

    touchMoveHandle(e: any) {
        if (this._draggable) {
            if (!this.dragging) {
                if (!this.startPoint) return;
                var t = e.getLocation();
                if (Math.abs(this.startPoint.x - t.x) < this.sensitivity && Math.abs(this.startPoint.y - t.y) < this.sensitivity) return;
                this.dragging = true;
                this.node.emit(Drag.Event.DRAG_START, e);
            }
            if (this.dragging) {
                e.stopPropagation();
                e.stopPropagationImmediate();
                this.node.x += e.getDeltaX();
                this.node.y += e.getDeltaY();
                this.node.emit(Drag.Event.DRAG_MOVE, e);
            }
        }
    }

    touchEndHandle(e: any) {
        if (this._draggable && this.dragging) {
            e.stopPropagation();
            e.stopPropagationImmediate();
            this.dragging = false;
            this.node.emit(Drag.Event.DRAG_END, e);
        }
    }

    startDrag() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStartHandle, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveHandle, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndHandle, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndHandle, this);
        this._draggable = true;
    }

    stopDrag() {
        this.dragging = false;
    }

    removeDragEvent() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStartHandle, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMoveHandle, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEndHandle, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEndHandle, this);
    }

    static Event = {
        DRAG_START: "drag_start",
        DRAG_MOVE: "drag_move",
        DRAG_END: "drag_end"
    };
}
