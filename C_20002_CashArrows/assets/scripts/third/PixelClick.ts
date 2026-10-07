import RenderUtils from "./RenderUtils";

const { ccclass, menu, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Sprite)
@menu("UI/Cocos/PixelClick")
export default class PixelClick extends cc.Component {
    static EventType = {
        CLICK: "pixelClick",
    };

    _sprite: cc.Sprite | null = null;
    pixelsData: Uint8Array | number[] | null = null;

    get sprite(): cc.Sprite | null {
        if (!this._sprite) {
            this._sprite = this.node.getComponent(cc.Sprite);
        }
        return this._sprite;
    }

    onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Sprite.EventType.SpriteFrameChanged, this.spriteChange, this);
        this.node.on(cc.Sprite.EventType.TrimChanged, this.spriteChange, this);
        this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this.spriteChange, this);
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this.spriteChange, this);
    }

    spriteChange(): void {
        this.pixelsData = RenderUtils.getPixelsData(this.node);
    }

    onTouchEnd(event: cc.Event.EventTouch): void {
        const localPos = this.node.convertToNodeSpaceAR(event.getLocation());
        if (!this.pixelsData) {
            this.pixelsData = RenderUtils.getPixelsData(this.node);
        }
        const x = localPos.x + this.node.anchorX * this.node.width;
        const y = -(localPos.y - this.node.anchorY * this.node.height);
        const offset = 4 * this.node.width * Math.floor(y) + 4 * Math.floor(x);
        const slice = this.pixelsData.slice(offset, offset + 4);
        const color = cc.color(slice[0], slice[1], slice[2], slice[3]);
        if (color.a > 0) {
            console.log("click");
            this.node.emit(PixelClick.EventType.CLICK, event, color);
        }
    }

    clear(): void {
        this.pixelsData = null;
    }
}
