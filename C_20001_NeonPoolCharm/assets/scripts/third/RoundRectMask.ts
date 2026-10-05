const { ccclass, property, executeInEditMode, disallowMultiple, requireComponent, menu } = cc._decorator;

cc.macro.ENABLE_WEBGL_ANTIALIAS = true;

@ccclass
@executeInEditMode(true)
@disallowMultiple(true)
@requireComponent(cc.Mask)
@menu("渲染组件/圆角遮罩")
export class RoundRectMask extends cc.Component {
    @property()
    _radius = 50;

    @property({
        tooltip: "圆角半径:\n0-1之间为最小边长比例值, \n>1为具体像素值",
    })
    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;
        this.updateMask(value);
    }

    mask: cc.Mask = null;

    onDraw(graphics: cc.Graphics): void {
        graphics.clear(false);
        const node = this.node;
        const width = node.width;
        const height = node.height;
        const x = -width * node.anchorX;
        const y = -height * node.anchorY;
        graphics.roundRect(x, y, width, height, this.radius || 0);
        cc.game.renderType === cc.game.RENDER_TYPE_CANVAS ? graphics.stroke() : graphics.fill();
    }

    onLoad(): void {
        this.mask = this.getComponent(cc.Mask);
        this.updateMask(this.radius);
    }

    updateMask(radius: number): void {
        let r = radius >= 0 ? radius : 0;
        if (r < 1) {
            r = Math.min(this.node.width, this.node.height) * r;
        }
        const mask = this.mask as any;
        mask.radius = r;
        mask.onDraw = this.onDraw.bind(this.mask);
        mask._updateGraphics = this._updateGraphics.bind(this.mask);
        mask.type = cc.Mask.Type.RECT;
    }

    _updateGraphics(this: cc.Mask & { _graphics?: cc.Graphics }): void {
        const graphics = this._graphics;
        graphics && (this as any).onDraw(graphics);
    }
}
