import RenderUtils from "./RenderUtils";

const { ccclass, menu, requireComponent } = cc._decorator;

@ccclass
@menu("UI/Cocos/PixelClick")
@requireComponent(cc.Sprite)
export default class PixelClick extends cc.Component {
    public static EventType = {
        CLICK: "pixelClick"
    };

    private _sprite: cc.Sprite = null;
    public pixelsData: Uint8ClampedArray = null;

    public get sprite(): cc.Sprite {
        if (!this._sprite) {
            this._sprite = this.node.getComponent(cc.Sprite);
        }
        return this._sprite;
    }

    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Sprite.EventType.SpriteFrameChanged, this.spriteChange, this);
        this.node.on(cc.Sprite.EventType.TrimChanged, this.spriteChange, this);
        this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this.spriteChange, this);
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this.spriteChange, this);
    }

    private spriteChange(): void {
        this.pixelsData = RenderUtils.getPixelsData(this.node);
    }

    private onTouchEnd(event: cc.Event.EventTouch): void {
        const touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        if (!this.pixelsData) {
            this.pixelsData = RenderUtils.getPixelsData(this.node);
        }
        const pixelX = touchPos.x + this.node.anchorX * this.node.width;
        const pixelY = -(touchPos.y - this.node.anchorY * this.node.height);
        const dataIndex = 4 * this.node.width * Math.floor(pixelY) + 4 * Math.floor(pixelX);
        const pixelData = this.pixelsData.slice(dataIndex, dataIndex + 4);
        const color = cc.color(pixelData[0], pixelData[1], pixelData[2], pixelData[3]);
        if (color.a > 0) {
            console.log("click");
            this.node.emit(PixelClick.EventType.CLICK, event, color);
        }
    }

    public clear(): void {
        this.pixelsData = null;
    }
}