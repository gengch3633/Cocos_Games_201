const { ccclass, property, executeInEditMode, disallowMultiple, requireComponent, menu } = cc._decorator;

cc.macro.ENABLE_WEBGL_ANTIALIAS = true;

@ccclass
@executeInEditMode(true)
@disallowMultiple(true)
@requireComponent(cc.Mask)
@menu("渲染组件/圆角遮罩Plus")
export class RoundRectPlusMask extends cc.Component {
    @property()
    _lt = 50;

    @property()
    _rt = 50;

    @property()
    _rb = 50;

    @property()
    _lb = 50;

    @property({
        tooltip: "圆角半径:\n0-1之间为最小边长比例值, \n>1为具体像素值",
    })
    get lt(): number {
        return this._lt;
    }

    set lt(value: number) {
        this._lt = value;
        this.updateMask("lt", value);
    }

    @property({
        tooltip: "圆角半径:\n0-1之间为最小边长比例值, \n>1为具体像素值",
    })
    get rt(): number {
        return this._rt;
    }

    set rt(value: number) {
        this._rt = value;
        this.updateMask("rt", value);
    }

    @property({
        tooltip: "圆角半径:\n0-1之间为最小边长比例值, \n>1为具体像素值",
    })
    get rb(): number {
        return this._rb;
    }

    set rb(value: number) {
        this._rb = value;
        this.updateMask("rb", value);
    }

    @property({
        tooltip: "圆角半径:\n0-1之间为最小边长比例值, \n>1为具体像素值",
    })
    get lb(): number {
        return this._lb;
    }

    set lb(value: number) {
        this._lb = value;
        this.updateMask("lb", value);
    }

    mask: cc.Mask = null;

    onLoad(): void {
        this.mask = this.getComponent(cc.Mask);
        this.updateMask("lt", this.lt);
        this.updateMask("rt", this.rt);
        this.updateMask("rb", this.rb);
        this.updateMask("lb", this.lb);
    }

    onDraw(graphics: cc.Graphics): void {
        graphics.clear(false);
        const node = this.node;
        const width = node.width;
        const height = node.height;
        const x = -width * node.anchorX;
        const y = -height * node.anchorY;
        this.roundRect(graphics, x, y, width, height, this.lt || 0, this.rt || 0, this.rb || 0, this.lb || 0);
        const impl = (graphics as any)._impl;
        if (impl?._curPath) {
            impl._curPath.complex = false;
        }
        cc.game.renderType === cc.game.RENDER_TYPE_CANVAS ? graphics.stroke() : graphics.fill();
    }

    roundRect(
        graphics: cc.Graphics,
        x: number,
        y: number,
        width: number,
        height: number,
        lt: number,
        rt: number,
        rb: number,
        lb: number
    ): void {
        const leftTopX = Math.min(lt, 0.5 * Math.abs(width)) * Math.sign(width);
        const leftTopY = Math.min(lt, 0.5 * Math.abs(height)) * Math.sign(height);
        const rightTopX = Math.min(rt, 0.5 * Math.abs(width)) * Math.sign(width);
        const rightTopY = Math.min(rt, 0.5 * Math.abs(height)) * Math.sign(height);
        const rightBottomX = Math.min(rb, 0.5 * Math.abs(width)) * Math.sign(width);
        const rightBottomY = Math.min(rb, 0.5 * Math.abs(height)) * Math.sign(height);
        const leftBottomX = Math.min(lb, 0.5 * Math.abs(width)) * Math.sign(width);
        const leftBottomY = Math.min(lb, 0.5 * Math.abs(height)) * Math.sign(height);
        graphics.moveTo(x, y + leftBottomY);
        graphics.lineTo(x, y + height - leftTopY);
        graphics.bezierCurveTo(x, y + height - 0.44771525069999996 * leftTopY, x + 0.44771525069999996 * leftTopX, y + height, x + leftTopX, y + height);
        graphics.lineTo(x + width - rightTopX, y + height);
        graphics.bezierCurveTo(
            x + width - 0.44771525069999996 * rightTopX,
            y + height,
            x + width,
            y + height - 0.44771525069999996 * rightTopY,
            x + width,
            y + height - rightTopY
        );
        graphics.lineTo(x + width, y + rightBottomY);
        graphics.bezierCurveTo(
            x + width,
            y + 0.44771525069999996 * rightBottomY,
            x + width - 0.44771525069999996 * rightBottomX,
            y,
            x + width - rightBottomX,
            y
        );
        graphics.lineTo(x + leftBottomX, y);
        graphics.bezierCurveTo(
            x + 0.44771525069999996 * leftBottomX,
            y,
            x,
            y + 0.44771525069999996 * leftBottomY,
            x,
            y + leftBottomY
        );
        graphics.close();
    }

    _updateGraphics(this: cc.Mask & { _graphics?: cc.Graphics }): void {
        const graphics = this._graphics;
        if (graphics) {
            (this as any).onDraw(graphics);
        }
    }

    updateMask(corner: string, radius: number): void {
        let r = radius >= 0 ? radius : 0;
        if (r < 1) {
            r = Math.min(this.node.width, this.node.height) * r;
        }
        const mask = this.mask as any;
        mask[corner] = r;
        mask.onDraw = this.onDraw.bind(this.mask);
        mask._updateGraphics = this._updateGraphics.bind(this.mask);
        mask.roundRect = this.roundRect.bind(this.mask);
        mask.type = cc.Mask.Type.RECT;
    }
}
