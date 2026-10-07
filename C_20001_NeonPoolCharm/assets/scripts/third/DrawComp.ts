const { ccclass } = cc._decorator;

@ccclass
export default class DrawComp extends cc.Component {
    graphics: cc.Graphics = null;
    size: number = null;
    num: number = null;

    randNumber(): number {
        let value = Math.random();
        if (value < 0.1) {
            value = 0.1;
        }
        return value;
    }

    clear(): void {
        const graphics = this.graphics;
        if (graphics) {
            graphics.clear();
        }
    }

    drawDir(from: cc.Vec2, to: cc.Vec2, color?: string): void {
        color = color || "#00ff00";
        const graphics = this.graphics;
        if (graphics) {
            graphics.clear();
            graphics.strokeColor.fromHEX(color);
            graphics.strokeColor.a = 125;
            graphics.moveTo(from.x, from.y);
            graphics.lineTo(to.x, to.y);
            graphics.stroke();
        }
    }

    drawRect(rect: cc.Rect): void {
        rect.x = 0;
        rect.y = 0;
        const graphics = this.graphics;
        if (graphics) {
            graphics.clear();
            graphics.strokeColor.fromHEX("#00ff00");
            graphics.strokeColor.a = 125;
            graphics.rect(rect.x, rect.y, rect.width, rect.height);
            graphics.stroke();
        }
    }

    drawcircle(center: cc.Vec2, second?: cc.Vec2, color?: string): void {
        color = color || "#00ff00";
        const graphics = this.graphics;
        if (graphics) {
            graphics.strokeColor.fromHEX(color);
            graphics.strokeColor.a = 125;
            graphics.circle(center.x, center.y, 15);
            if (second) {
                graphics.circle(second.x, second.y, 15);
            }
            graphics.stroke();
        }
    }

    start(): void {
    }

    onLoad(): void {
        this.graphics = this.getComponent(cc.Graphics);
        if (this.graphics) {
            this.graphics.lineWidth = 2;
            this.size = 150;
            this.num = 6;
        }
    }

    drawSix(radius: number): void {
        const graphics = this.graphics;
        if (graphics) {
            graphics.strokeColor.fromHEX("#00ff00");
            graphics.strokeColor.a = 0;
            const origin = { x: 0, y: 0 };
            for (let n = 0; n < this.num; n++) {
                const angle = (n / 3) * Math.PI;
                const dist = radius * this.randNumber();
                const x = dist * Math.cos(angle);
                const y = dist * Math.sin(angle);
                if (n === 0) {
                    origin.x = x;
                    origin.y = y;
                    graphics.moveTo(x, y);
                }
                graphics.lineTo(x, y);
            }
            graphics.lineTo(origin.x, origin.y);
            graphics.moveTo(0, 0);
            graphics.fillColor.fromHEX("#00ff00");
            graphics.fillColor.a = 125;
            graphics.fill();
            graphics.stroke();
        }
    }

    drawSixLine(radius: number): void {
        const graphics = this.graphics;
        if (graphics) {
            graphics.strokeColor.fromHEX("#ffffff");
            graphics.strokeColor.a = 0;
            for (let o = 0; o < this.num; o++) {
                const angle = (o / 3) * Math.PI;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                graphics.moveTo(0, 0);
                graphics.lineTo(x, y);
            }
            const step = this.size / 3;
            for (let l = 1; l < 4; l++) {
                graphics.circle(0, 0, l * step);
            }
            graphics.stroke();
        }
    }
}
