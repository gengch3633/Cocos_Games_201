const { ccclass, property, executeInEditMode, disallowMultiple, requireComponent, menu } = cc._decorator;

cc.macro.ENABLE_WEBGL_ANTIALIAS = true;

@ccclass()
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

    mask = null;

    @property({
        tooltip: "圆角半径:\n0-1之间为最小边长比例值, \n>1为具体像素值"
    })
    get lt() {
        return this._lt;
    }
    set lt(e) {
        this._lt = e;
        this.updateMask("lt", e);
    }

    @property({
        tooltip: "圆角半径:\n0-1之间为最小边长比例值, \n>1为具体像素值"
    })
    get rt() {
        return this._rt;
    }
    set rt(e) {
        this._rt = e;
        this.updateMask("rt", e);
    }

    @property({
        tooltip: "圆角半径:\n0-1之间为最小边长比例值, \n>1为具体像素值"
    })
    get rb() {
        return this._rb;
    }
    set rb(e) {
        this._rb = e;
        this.updateMask("rb", e);
    }

    @property({
        tooltip: "圆角半径:\n0-1之间为最小边长比例值, \n>1为具体像素值"
    })
    get lb() {
        return this._lb;
    }
    set lb(e) {
        this._lb = e;
        this.updateMask("lb", e);
    }

    onLoad() {
        this.mask = this.getComponent(cc.Mask);
        this.updateMask("lt", this.lt);
        this.updateMask("rt", this.rt);
        this.updateMask("rb", this.rb);
        this.updateMask("lb", this.lb);
    }

    onDraw(e) {
        e.clear(false);
        const n = this.node;
        const i = n.width;
        const a = n.height;
        const r = -i * n.anchorX;
        const l = -a * n.anchorY;
        this.roundRect(e, r, l, i, a, this.lt || 0, this.rt || 0, this.rb || 0, this.lb || 0);
        const t = e._impl;
        let o;
        if (t === null || t === undefined) {
            o = undefined;
        } else {
            o = t._curPath;
        }
        if (o !== null && o !== undefined) {
            o.complex = false;
        }
        cc.game.renderType === cc.game.RENDER_TYPE_CANVAS ? e.stroke() : e.fill();
    }

    roundRect(e, t, o, n, i, a, r, l, s) {
        const c = Math.min(a, .5 * Math.abs(n)) * Math.sign(n);
        const u = Math.min(a, .5 * Math.abs(i)) * Math.sign(i);
        const p = Math.min(r, .5 * Math.abs(n)) * Math.sign(n);
        const d = Math.min(r, .5 * Math.abs(i)) * Math.sign(i);
        const _ = Math.min(l, .5 * Math.abs(n)) * Math.sign(n);
        const f = Math.min(l, .5 * Math.abs(i)) * Math.sign(i);
        const h = Math.min(s, .5 * Math.abs(n)) * Math.sign(n);
        const g = Math.min(s, .5 * Math.abs(i)) * Math.sign(i);
        e.moveTo(t, o + g);
        e.lineTo(t, o + i - u);
        e.bezierCurveTo(t, o + i - .44771525069999996 * u, t + .44771525069999996 * c, o + i, t + c, o + i);
        e.lineTo(t + n - p, o + i);
        e.bezierCurveTo(t + n - .44771525069999996 * p, o + i, t + n, o + i - .44771525069999996 * d, t + n, o + i - d);
        e.lineTo(t + n, o + f);
        e.bezierCurveTo(t + n, o + .44771525069999996 * f, t + n - .44771525069999996 * _, o, t + n - _, o);
        e.lineTo(t + h, o);
        e.bezierCurveTo(t + .44771525069999996 * h, o, t, o + .44771525069999996 * g, t, o + g);
        e.close();
    }

    _updateGraphics() {
        const e = (this as any)._graphics;
        e && this.onDraw(e);
    }

    updateMask(e, t) {
        let o = t >= 0 ? t : 0;
        o < 1 && (o = Math.min(this.node.width, this.node.height) * o);
        this.mask[e] = o;
        this.mask.onDraw = this.onDraw.bind(this.mask);
        this.mask._updateGraphics = this._updateGraphics.bind(this.mask);
        this.mask.roundRect = this.roundRect.bind(this.mask);
        this.mask.type = cc.Mask.Type.RECT;
    }
}
