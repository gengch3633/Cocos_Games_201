import MapScene from "./MapScene";

const { ccclass, property } = cc._decorator;

interface DiamondCell {
    pos: cc.Vec2;
    state: number;
    puttingSate: number;
}

@ccclass
export default class DiamondDrawControl extends cc.Component {
    @property()
    rows = 5;

    @property()
    cols = 5;

    diamondArray: DiamondCell[][] = [];
    diamondPosOffset = cc.v2();

    posToDiamondIdx(point: cc.Vec2): cc.Vec2 {
        const col = Math.floor(point.x / 96 + point.y / 48);
        const row = Math.floor(point.y / 48 - point.x / 96);
        return cc.v2(row, col);
    }

    findDiamondIndex(worldPos: cc.Vec2): [DiamondCell | number, number, number] {
        const local = this.node.convertToNodeSpace(worldPos);
        const adjusted = cc.v2(local.x - this.diamondPosOffset.x, local.y - this.diamondPosOffset.y);
        const index = this.posToDiamondIdx(adjusted);
        const row = index.x;
        const col = index.y;
        console.log("row,col", row, col);
        return this.diamondArray[row] && this.diamondArray[row][col] ? [this.diamondArray[row][col], row, col] : [-1, -1, -1];
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

    onLoad(): void {
        let self = this;
        const rows = this.rows;
        const cols = this.cols;
        self.diamondArray = [];
        const total = 48 * (rows + cols);
        self.diamondPosOffset = cc.v2(48 + total / 2, -48);
        for (let row = 1; row <= rows + 1; row++) {
            self.diamondArray[row] = [];
            for (let col = 1; col <= cols + 1; col++) {
                self.diamondArray[row][col] = {
                    pos: cc.v2(),
                    state: 0,
                    puttingSate: 0,
                };
                const pos = self.diamondIdxToPos(row, col);
                let x = pos.x;
                let y = pos.y;
                x = 0 + x + self.diamondPosOffset.x;
                y = 0 + y + self.diamondPosOffset.y;
                self.diamondArray[row][col].pos = cc.v2(x, y);
            }
        }
        this.drawDiamondLine();
        this.node.width = 48 * (rows + cols);
        this.node.height = 24 * (rows + cols);
        self = this;
        this.node.on("mousedown", function (event: cc.Event.EventMouse) {
            const location = event.getLocation();
            const found = self.findDiamondIndex(location);
            console.log("mousedown", found);
            if (typeof found[0] == "object") {
                let x = found[0].pos.x;
                let y = found[0].pos.y;
                x -= self.node.width / 2;
                y -= self.node.height / 2;
                self.node.getParent().getParent().getComponent(MapScene).clickMap(cc.v2(x, y));
            }
        }, this);
    }

    drawDiamondLine(): void {
        const rows = this.rows;
        const cols = this.cols;
        const graphics = this.getComponent(cc.Graphics);
        graphics.clear();
        cc.color(178.5, 0, 0, 76.5);
        graphics.strokeColor.fromHEX("#ff0000");
        for (let row = 1; row <= rows + 1; row++) {
            const start = this.diamondIdxToPos(row, 1);
            let startX = 0 + start.x + this.diamondPosOffset.x;
            let startY = 0 + start.y + this.diamondPosOffset.y;
            const end = this.diamondIdxToPos(row, cols + 1);
            let endX = 0 + end.x + this.diamondPosOffset.x;
            let endY = 0 + end.y + this.diamondPosOffset.y;
            graphics.moveTo(startX, startY);
            graphics.lineTo(endX, endY);
            console.log("graphics", startX, startY, endX, endY);
        }
        for (let col = 1; col <= cols + 1; col++) {
            const start = this.diamondIdxToPos(1, col);
            let startX = 0 + start.x + this.diamondPosOffset.x;
            let startY = 0 + start.y + this.diamondPosOffset.y;
            const end = this.diamondIdxToPos(rows + 1, col);
            let endX = 0 + end.x + this.diamondPosOffset.x;
            let endY = 0 + end.y + this.diamondPosOffset.y;
            graphics.moveTo(startX, startY);
            graphics.lineTo(endX, endY);
        }
        graphics.stroke();
    }
}
