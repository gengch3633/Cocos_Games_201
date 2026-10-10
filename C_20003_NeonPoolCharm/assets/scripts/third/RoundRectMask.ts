const { ccclass, property, executeInEditMode, disallowMultiple, requireComponent, menu } = cc._decorator;

cc.macro.ENABLE_WEBGL_ANTIALIAS = true;

@ccclass()
@executeInEditMode(true)
@disallowMultiple(true)
@requireComponent(cc.Mask)
@menu("渲染组件/圆角遮罩")
export class RoundRectMask extends cc.Component {
    @property()
    _radius = 50;

    mask = null;

    @property({
        tooltip: "圆角半径:\n0-1之间为最小边长比例值, \n>1为具体像素值"
    })
    get radius() {
        return this._radius;
    }
    set radius(e) {
        this._radius = e;
        this.updateMask(e);
    }

    onDraw(e) {
        e.clear(false);
        const t = this.node;
        const o = t.width;
        const n = t.height;
        const i = -o * t.anchorX;
        const a = -n * t.anchorY;
        e.roundRect(i, a, o, n, this.radius || 0);
        cc.game.renderType === cc.game.RENDER_TYPE_CANVAS ? e.stroke() : e.fill();
    }

    onLoad() {
        this.mask = this.getComponent(cc.Mask);
        this.updateMask(this.radius);
    }

    updateMask(e) {
        let t = e >= 0 ? e : 0;
        t < 1 && (t = Math.min(this.node.width, this.node.height) * t);
        this.mask.radius = t;
        this.mask.onDraw = this.onDraw.bind(this.mask);
        this.mask._updateGraphics = this._updateGraphics.bind(this.mask);
        this.mask.type = cc.Mask.Type.RECT;
    }

    _updateGraphics() {
        const e = (this as any)._graphics;
        e && this.onDraw(e);
    }
}
