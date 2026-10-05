const { ccclass } = cc._decorator;

@ccclass
export default class DrawComp extends cc.Component {
    graphics: cc.Graphics = null;
    size = 150;
    num = 6;

    randNumber(): number {
        let value = Math.random();
        if (value < 0.1) {
            value = 0.1;
        }
        return value;
    }

    clear(): void {
        const graphics = this.graphics;
        graphics && graphics.clear();
    }

    drawDir(from: cc.Vec2, to: cc.Vec2, color = "#00ff00"): void {
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

    drawRect(rect: cc.Size & { x?: number; y?: number }): void {
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

    drawcircle(center: cc.Vec2, second?: cc.Vec2, color = "#00ff00"): void {
        const graphics = this.graphics;
        if (graphics) {
            graphics.strokeColor.fromHEX(color);
            graphics.strokeColor.a = 125;
            graphics.circle(center.x, center.y, 15);
            second && graphics.circle(second.x, second.y, 15);
            graphics.stroke();
        }
    }

    start(): void {}

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
            const start = { x: 0, y: 0 };
            for (let i = 0; i < this.num; i++) {
                const angle = (i / 3) * Math.PI;
                const length = radius * this.randNumber();
                const x = length * Math.cos(angle);
                const y = length * Math.sin(angle);
                if (i === 0) {
                    start.x = x;
                    start.y = y;
                    graphics.moveTo(x, y);
                }
                graphics.lineTo(x, y);
            }
            graphics.lineTo(start.x, start.y);
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
            for (let i = 0; i < this.num; i++) {
                const angle = (i / 3) * Math.PI;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                graphics.moveTo(0, 0);
                graphics.lineTo(x, y);
            }
            const step = this.size / 3;
            for (let i = 1; i < 4; i++) {
                graphics.circle(0, 0, i * step);
            }
            graphics.stroke();
        }
    }
}
