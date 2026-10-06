import RenderUtils from "./RenderUtils";

const { ccclass, menu, requireComponent } = cc._decorator;

@ccclass
@menu(" UI/ Cocos/ PixelClick ")
@requireComponent(cc.Sprite)
export default class PixelClick extends cc.Component {
    _sprite: cc.Sprite = null;
    pixelsData: Uint8Array | null = null;

    static EventType = {
        CLICK: " pixelClick "
    };

    get sprite(): cc.Sprite {
        this._sprite || (this._sprite = this.node.getComponent(cc.Sprite));
        return this._sprite;
    }

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Sprite.EventType.SpriteFrameChanged, this.spriteChange, this);
        this.node.on(cc.Sprite.EventType.TrimChanged, this.spriteChange, this);
        this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this.spriteChange, this);
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this.spriteChange, this);
    }

    spriteChange() {
        this.pixelsData = RenderUtils.getPixelsData(this.node);
    }

    onTouchEnd(event: cc.Event.EventTouch) {
        var local = this.node.convertToNodeSpaceAR(event.getLocation());
        this.pixelsData || (this.pixelsData = RenderUtils.getPixelsData(this.node));
        var x = local.x + this.node.anchorX * this.node.width,
            y = -(local.y - this.node.anchorY * this.node.height),
            offset = 4 * this.node.width * Math.floor(y) + 4 * Math.floor(x),
            rgba = this.pixelsData.slice(offset, offset + 4),
            color = cc.color(rgba[0], rgba[1], rgba[2], rgba[3]);
        if (color.a > 0) {
            console.log(" click ");
            this.node.emit(PixelClick.EventType.CLICK, event, color);
        }
    }

    clear() {
        this.pixelsData = null;
    }
}
