const { ccclass } = cc._decorator;

@ccclass
export default class DrawComp extends cc.Component {
    graphics = null;

    size;

    num;

    randNumber() {
        let e = Math.random();
        e < .1 && (e = .1);
        return e;
    }

    clear() {
        const e = this.graphics;
        e && e.clear();
    }

    drawDir(e, t, o) {
        o = o || "#00ff00";
        const n = this.graphics;
        if (n) {
            n.clear();
            n.strokeColor.fromHEX(o);
            n.strokeColor.a = 125;
            n.moveTo(e.x, e.y);
            n.lineTo(t.x, t.y);
            n.stroke();
        }
    }

    drawRect(e) {
        e.x = 0;
        e.y = 0;
        const t = this.graphics;
        if (t) {
            t.clear();
            t.strokeColor.fromHEX("#00ff00");
            t.strokeColor.a = 125;
            t.rect(e.x, e.y, e.width, e.height);
            t.stroke();
        }
    }

    drawcircle(e, t, o) {
        o = o || "#00ff00";
        const n = this.graphics;
        if (n) {
            n.strokeColor.fromHEX(o);
            n.strokeColor.a = 125;
            n.circle(e.x, e.y, 15);
            t && n.circle(t.x, t.y, 15);
            n.stroke();
        }
    }

    start() {}

    onLoad() {
        this.graphics = this.getComponent(cc.Graphics);
        if (this.graphics) {
            this.graphics.lineWidth = 2;
            this.size = 150;
            this.num = 6;
        }
    }

    drawSix(e) {
        const t = this.graphics;
        if (t) {
            t.strokeColor.fromHEX("#00ff00");
            t.strokeColor.a = 0;
            const o = {
                x: 0,
                y: 0
            };
            for (let n = 0; n < this.num; n++) {
                const i = n / 3 * Math.PI;
                const a = e * this.randNumber();
                const r = a * Math.cos(i);
                const l = a * Math.sin(i);
                if (0 === n) {
                    o.x = r;
                    o.y = l;
                    t.moveTo(r, l);
                }
                t.lineTo(r, l);
            }
            t.lineTo(o.x, o.y);
            t.moveTo(0, 0);
            t.fillColor.fromHEX("#00ff00");
            t.fillColor.a = 125;
            t.fill();
            t.stroke();
        }
    }

    drawSixLine(e) {
        const t = this.graphics;
        if (t) {
            t.strokeColor.fromHEX("#ffffff");
            t.strokeColor.a = 0;
            for (let o = 0; o < this.num; o++) {
                const n = o / 3 * Math.PI;
                const i = e * Math.cos(n);
                const a = e * Math.sin(n);
                t.moveTo(0, 0);
                t.lineTo(i, a);
            }
            for (let r = this.size / 3, l = 1; l < 4; l++) t.circle(0, 0, l * r);
            t.stroke();
        }
    }
}
