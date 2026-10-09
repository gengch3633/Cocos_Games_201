const { ccclass, property } = cc._decorator;

@ccclass
export default class DiamondDrawControl extends cc.Component {
    @property
    rows = 5;

    @property
    cols = 5;

    diamondArray;

    diamondPosOffset;

    posToDiamondIdx(e) {
        const t = Math.floor(e.x / 96 + e.y / 48);
        const o = Math.floor(e.y / 48 - e.x / 96);
        return cc.v2(o, t);
    }

    findDiamondIndex(e) {
        const t = this.node.convertToNodeSpace(e);
        const o = t.x;
        const n = t.y;
        const i = (e = cc.v2(o - this.diamondPosOffset.x, n - this.diamondPosOffset.y), this.posToDiamondIdx(e));
        const a = i.x;
        const r = i.y;
        console.log("row,col", a, r);
        return this.diamondArray[a] && this.diamondArray[a][r] ? [this.diamondArray[a][r], a, r] : [-1, -1, -1];
    }

    diamondIdxToPos(e, t) {
        const o = 48 * (t - e);
        const n = 24 * (e + t);
        return cc.v2(o, n);
    }

    drawLines() {
        const e = this.getComponent(cc.Graphics);
        e.strokeColor.fromHEX("#ff0000");
        e.moveTo(0, 0);
        e.lineTo(100, 100);
        e.stroke();
    }

    onLoad() {
        let e = this;
        const t = this.rows;
        const o = this.cols;
        e.diamondArray = [];
        const n = 48 * (t + o);
        e.diamondPosOffset = cc.v2(48 + n / 2, -48);
        for (let i = 1; i <= t + 1; i++) {
            e.diamondArray[i] = [];
            for (let a = 1; a <= o + 1; a++) {
                e.diamondArray[i][a] = {};
                const r = e.diamondIdxToPos(i, a);
                let l = r.x;
                let s = r.y;
                l = 0 + l + e.diamondPosOffset.x;
                s = 0 + s + e.diamondPosOffset.y;
                e.diamondArray[i][a].pos = cc.v2(l, s);
                e.diamondArray[i][a].state = 0;
                e.diamondArray[i][a].puttingSate = 0;
            }
        }
        this.drawDiamondLine();
        this.node.width = 48 * (t + o);
        this.node.height = 24 * (t + o);
        e = this;
        this.node.on("mousedown", function (t) {
            const o = t.getLocation();
            const n = this.findDiamondIndex(o);
            console.log("mousedown", n);
            let i;
            let a;
            if ("object" == typeof n[0]) {
                i = n[0].pos.x;
                a = n[0].pos.y;
                i -= this.node.width / 2;
                a -= this.node.height / 2;
            }
            e.node.getParent().getParent().getComponent("MapScene").clickMap(cc.v2(i, a));
        }, this);
    }

    drawDiamondLine() {
        const e = this.rows;
        const t = this.cols;
        const o = this.getComponent(cc.Graphics);
        o.clear();
        cc.Color(178.5, 0, 0, 76.5);
        o.strokeColor.fromHEX("#ff0000");
        this.diamondArray;
        let c;
        let u;
        for (let n = 1; n <= e + 1; n++) {
            c = this.diamondIdxToPos(n, 1);
            let i = c.x;
            let a = c.y;
            i = 0 + i + this.diamondPosOffset.x;
            a = 0 + a + this.diamondPosOffset.y;
            u = this.diamondIdxToPos(n, t + 1);
            let r = u.x;
            let l = u.y;
            r = 0 + r + this.diamondPosOffset.x;
            l = 0 + l + this.diamondPosOffset.y;
            o.moveTo(i, a);
            o.lineTo(r, l);
            console.log("graphics", i, a, r, l);
        }
        for (let s = 1; s <= t + 1; s++) {
            c = this.diamondIdxToPos(1, s);
            let i = c.x;
            let a = c.y;
            i = 0 + i + this.diamondPosOffset.x;
            a = 0 + a + this.diamondPosOffset.y;
            u = this.diamondIdxToPos(e + 1, s);
            let r = u.x;
            let l = u.y;
            r = 0 + r + this.diamondPosOffset.x;
            l = 0 + l + this.diamondPosOffset.y;
            o.moveTo(i, a);
            o.lineTo(r, l);
        }
        o.stroke();
    }
}
