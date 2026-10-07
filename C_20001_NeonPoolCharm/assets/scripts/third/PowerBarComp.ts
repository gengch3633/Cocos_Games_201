const { ccclass } = cc._decorator;

@ccclass
export default class PowerBarComp extends cc.Component {
    callback: (percent: number) => void = null;
    callback_update: (percent: number) => void = null;
    valueY: number = null;

    onLoad(): void {
        const t = this.node.getChildByName("node_powerbars");
        const o = t.children;
        this.callback = this.callback || null;
        this.callback_update = this.callback_update || null;
        this.valueY = 0;
        this.node.on(cc.Node.EventType.TOUCH_START, (n: cc.Event.EventTouch) => {
            console.log("TOUCH_START", n);
            let i = (n.touch as any)._point;
            this.valueY = 0;
            i = (n.touch as any)._point;
            (n.touch as any)._prevPoint;
            const a = t.convertToNodeSpaceAR(i);
            for (let r = 0; r < o.length; r++) {
                if (o[r].y > a.y) {
                    o[r].opacity = 0;
                } else {
                    o[r].opacity = 255;
                    this.valueY = this.valueY + 1;
                }
            }
            this.callback_update && this.callback_update(this.getPercent());
            this.updateLabel();
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (n: cc.Event.EventTouch) => {
            const i = (n.touch as any)._point;
            const a = (n.touch as any)._prevPoint;
            i.y;
            a.y;
            this.valueY = 0;
            const r = t.convertToNodeSpaceAR(i);
            console.log("p ", r.y);
            for (let l = 0; l < o.length; l++) {
                if (o[l].y > r.y) {
                    o[l].opacity = 0;
                } else {
                    o[l].opacity = 255;
                    this.valueY = this.valueY + 1;
                }
            }
            this.callback_update && this.callback_update(this.getPercent());
            this.updateLabel();
        });
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            console.log("TOUCH_END", this.valueY);
            this.hideAllBars();
            this.callback && this.callback(this.getPercent());
            this.clearLabel();
        });
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            console.log("TOUCH_CANCEL", this.valueY);
            this.hideAllBars();
            this.callback && this.callback(this.getPercent());
            this.clearLabel();
        });
        this.hideAllBars();
    }

    hideAllBars(): void {
        const e = this.node.getChildByName("node_powerbars").children;
        for (let t = 0; t < e.length; t++) {
            e[t].opacity = 0;
        }
    }

    getPercent(): number {
        return this.valueY / 11;
    }

    setCallBack(e: (percent: number) => void): void {
        this.callback = e;
    }

    setCallBack_update(e: (percent: number) => void): void {
        this.callback_update = e;
    }

    updateLabel(): void {
        const e = cc.find("label_value", this.node);
        e && (e.getComponent(cc.Label).string = String(Math.floor(100 * this.getPercent())));
    }

    clearLabel(): void {
        const e = cc.find("label_value", this.node);
        e && (e.getComponent(cc.Label).string = "");
    }

    applyByPower(e: number | string): void {
        const t = cc.find("label_value", this.node);
        t && (t.getComponent(cc.Label).string = String(e));
    }
}
