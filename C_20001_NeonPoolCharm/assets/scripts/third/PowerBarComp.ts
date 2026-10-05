const { ccclass } = cc._decorator;

@ccclass
export default class PowerBarComp extends cc.Component {
    callback: (percent: number) => void = null;
    callback_update: (percent: number) => void = null;
    valueY = 0;

    onLoad(): void {
        const barsRoot = this.node.getChildByName("node_powerbars");
        const bars = barsRoot.children;
        this.callback = this.callback || null;
        this.callback_update = this.callback_update || null;
        this.valueY = 0;

        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            console.log("TOUCH_START", event);
            const point = (event.touch as any)._point;
            this.valueY = 0;
            const localPos = barsRoot.convertToNodeSpaceAR(point);
            for (let i = 0; i < bars.length; i++) {
                if (bars[i].y > localPos.y) {
                    bars[i].opacity = 0;
                } else {
                    bars[i].opacity = 255;
                    this.valueY = this.valueY + 1;
                }
            }
            this.callback_update?.(this.getPercent());
            this.updateLabel();
        });

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            const point = (event.touch as any)._point;
            this.valueY = 0;
            const localPos = barsRoot.convertToNodeSpaceAR(point);
            console.log("p ", localPos.y);
            for (let i = 0; i < bars.length; i++) {
                if (bars[i].y > localPos.y) {
                    bars[i].opacity = 0;
                } else {
                    bars[i].opacity = 255;
                    this.valueY = this.valueY + 1;
                }
            }
            this.callback_update?.(this.getPercent());
            this.updateLabel();
        });

        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            console.log("TOUCH_END", this.valueY);
            this.hideAllBars();
            this.callback?.(this.getPercent());
            this.clearLabel();
        });

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            console.log("TOUCH_CANCEL", this.valueY);
            this.hideAllBars();
            this.callback?.(this.getPercent());
            this.clearLabel();
        });

        this.hideAllBars();
    }

    hideAllBars(): void {
        const bars = this.node.getChildByName("node_powerbars").children;
        for (let i = 0; i < bars.length; i++) {
            bars[i].opacity = 0;
        }
    }

    getPercent(): number {
        return this.valueY / 11;
    }

    setCallBack(callback: (percent: number) => void): void {
        this.callback = callback;
    }

    setCallBack_update(callback: (percent: number) => void): void {
        this.callback_update = callback;
    }

    updateLabel(): void {
        const labelNode = cc.find("label_value", this.node);
        if (labelNode) {
            labelNode.getComponent(cc.Label).string = String(Math.floor(100 * this.getPercent()));
        }
    }

    clearLabel(): void {
        const labelNode = cc.find("label_value", this.node);
        if (labelNode) {
            labelNode.getComponent(cc.Label).string = "";
        }
    }

    applyByPower(power: string | number): void {
        const labelNode = cc.find("label_value", this.node);
        if (labelNode) {
            labelNode.getComponent(cc.Label).string = String(power);
        }
    }
}
