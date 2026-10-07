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

    mask: cc.Mask = null;

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

    updateMask(radiusValue: number): void {
        let radius = radiusValue >= 0 ? radiusValue : 0;
        if (radius < 1) {
            radius = Math.min(this.node.width, this.node.height) * radius;
        }
        (this.mask as any).radius = radius;
        this.mask.onDraw = this.onDraw.bind(this.mask);
        (this.mask as any)._updateGraphics = this._updateGraphics.bind(this.mask);
        this.mask.type = cc.Mask.Type.RECT;
    }

    _updateGraphics(): void {
        const graphics = (this as any)._graphics;
        graphics && this.onDraw(graphics);
    }
}
