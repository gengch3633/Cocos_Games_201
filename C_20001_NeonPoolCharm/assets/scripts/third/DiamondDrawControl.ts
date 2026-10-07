const { ccclass, property } = cc._decorator;

interface DiamondCell {
    pos?: cc.Vec2;
    state?: number;
    puttingSate?: number;
}

@ccclass
export default class DiamondDrawControl extends cc.Component {
    @property
    rows = 5;

    @property
    cols = 5;

    diamondArray: DiamondCell[][] = null;
    diamondPosOffset: cc.Vec2 = null;

    posToDiamondIdx(pos: cc.Vec2): cc.Vec2 {
        const t = Math.floor(pos.x / 96 + pos.y / 48);
        const o = Math.floor(pos.y / 48 - pos.x / 96);
        return cc.v2(o, t);
    }

    findDiamondIndex(worldPos: cc.Vec2): [DiamondCell | number, number, number] {
        const localPos = this.node.convertToNodeSpace(worldPos);
        const offsetPos = cc.v2(
            localPos.x - this.diamondPosOffset.x,
            localPos.y - this.diamondPosOffset.y
        );
        const idx = this.posToDiamondIdx(offsetPos);
        const row = idx.x;
        const col = idx.y;
        console.log("row,col", row, col);
        if (this.diamondArray[row] && this.diamondArray[row][col]) {
            return [this.diamondArray[row][col], row, col];
        }
        return [-1, -1, -1];
    }

    diamondIdxToPos(row: number, col: number): cc.Vec2 {
        const x = 48 * (col - row);
        const y = 24 * (row + col);
        return cc.v2(x, y);
    }

    drawLines(): void {
        const graphics = this.getComponent(cc.Graphics);
        graphics.strokeColor.fromHEX("#ff0000");
        graphics.moveTo(0, 0);
        graphics.lineTo(100, 100);
        graphics.stroke();
    }

    onMouseDown(event: cc.Event.EventMouse): void {
        const location = event.getLocation();
        const result = this.findDiamondIndex(location);
        console.log("mousedown", result);
        let i: number;
        let a: number;
        if (typeof result[0] === "object") {
            i = result[0].pos.x;
            a = result[0].pos.y;
            i -= this.node.width / 2;
            a -= this.node.height / 2;
        }
        this.node
            .getParent()
            .getParent()
            .getComponent("MapScene")
            .clickMap(cc.v2(i, a));
    }

    onLoad(): void {
        const rowCount = this.rows;
        const colCount = this.cols;
        this.diamondArray = [];
        const n = 48 * (rowCount + colCount);
        this.diamondPosOffset = cc.v2(48 + n / 2, -48);
        for (let i = 1; i <= rowCount + 1; i++) {
            this.diamondArray[i] = [];
            for (let a = 1; a <= colCount + 1; a++) {
                this.diamondArray[i][a] = {};
                const pos = this.diamondIdxToPos(i, a);
                let x = 0 + pos.x + this.diamondPosOffset.x;
                let y = 0 + pos.y + this.diamondPosOffset.y;
                this.diamondArray[i][a].pos = cc.v2(x, y);
                this.diamondArray[i][a].state = 0;
                this.diamondArray[i][a].puttingSate = 0;
            }
        }
        this.drawDiamondLine();
        this.node.width = 48 * (rowCount + colCount);
        this.node.height = 24 * (rowCount + colCount);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    drawDiamondLine(): void {
        const rowCount = this.rows;
        const colCount = this.cols;
        const graphics = this.getComponent(cc.Graphics);
        graphics.clear();
        cc.Color(178.5, 0, 0, 76.5);
        graphics.strokeColor.fromHEX("#ff0000");
        for (let n = 1; n <= rowCount + 1; n++) {
            const start = this.diamondIdxToPos(n, 1);
            let i = 0 + start.x + this.diamondPosOffset.x;
            let a = 0 + start.y + this.diamondPosOffset.y;
            const end = this.diamondIdxToPos(n, colCount + 1);
            let r = 0 + end.x + this.diamondPosOffset.x;
            let l = 0 + end.y + this.diamondPosOffset.y;
            graphics.moveTo(i, a);
            graphics.lineTo(r, l);
            console.log("graphics", i, a, r, l);
        }
        for (let s = 1; s <= colCount + 1; s++) {
            const start = this.diamondIdxToPos(1, s);
            let i = 0 + start.x + this.diamondPosOffset.x;
            let a = 0 + start.y + this.diamondPosOffset.y;
            const end = this.diamondIdxToPos(rowCount + 1, s);
            let r = 0 + end.x + this.diamondPosOffset.x;
            let l = 0 + end.y + this.diamondPosOffset.y;
            graphics.moveTo(i, a);
            graphics.lineTo(r, l);
        }
        graphics.stroke();
    }
}
