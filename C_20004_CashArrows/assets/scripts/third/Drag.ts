const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("UI/Cocos/Drag")
export default class Drag extends cc.Component {
    public static Event = {
        DRAG_START: "drag_start",
        DRAG_MOVE: "drag_move",
        DRAG_END: "drag_end"
    };

    private _draggable: boolean = false;
    public dragging: boolean = false;
    public startPoint: cc.Vec2 = null;
    public sensitivity: number = 0;

    @property
    public get draggable(): boolean {
        return this._draggable;
    }

    public set draggable(value: boolean) {
        if (this._draggable != value) {
            if (value) {
                this.startDrag();
            } else {
                this.removeDragEvent();
            }
        }
        this._draggable = value;
    }

    private touchStartHandle(event: cc.Event.EventTouch): void {
        if (this._draggable) {
            event.stopPropagation();
            event.stopPropagationImmediate();
            this.startPoint = event.getLocation();
        }
    }

    private touchMoveHandle(event: cc.Event.EventTouch): void {
        if (!this._draggable) {
            return;
        }
        if (!this.dragging) {
            if (!this.startPoint) {
                return;
            }
            const location = event.getLocation();
            if (Math.abs(this.startPoint.x - location.x) < this.sensitivity && Math.abs(this.startPoint.y - location.y) < this.sensitivity) {
                return;
            }
            this.dragging = true;
            this.node.emit(Drag.Event.DRAG_START, event);
        }
        if (this.dragging) {
            event.stopPropagation();
            event.stopPropagationImmediate();
            this.node.x += event.getDeltaX();
            this.node.y += event.getDeltaY();
            this.node.emit(Drag.Event.DRAG_MOVE, event);
        }
    }

    private touchEndHandle(event: cc.Event.EventTouch): void {
        if (this._draggable && this.dragging) {
            event.stopPropagation();
            event.stopPropagationImmediate();
            this.dragging = false;
            this.node.emit(Drag.Event.DRAG_END, event);
        }
    }

    public startDrag(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStartHandle, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveHandle, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndHandle, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndHandle, this);
        this._draggable = true;
    }

    public stopDrag(): void {
        this.dragging = false;
    }

    public removeDragEvent(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStartHandle, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMoveHandle, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEndHandle, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEndHandle, this);
    }
}