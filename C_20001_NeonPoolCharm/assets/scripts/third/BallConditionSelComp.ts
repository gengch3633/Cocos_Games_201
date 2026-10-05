const { ccclass } = cc._decorator;

@ccclass
export default class BallConditionSelComp extends cc.Component {
    isSel: boolean = null;
    idx: number = null;

    onLoad(): void {
        this.idx = this.idx || 0;
        this.isSel = this.isSel || false;
        console.log("ball model onLoad", this.isSel);
    }

    open(): void {
        const gouNode = this.node.getChildByName("node_gou");
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            if (gouNode.opacity == 255) {
                gouNode.opacity = 0;
                this.setIsSel(false);
            } else {
                gouNode.opacity = 255;
                this.setIsSel(true);
            }
            console.log("ball model click", this.isSel);
        });
    }

    getIsSel(): boolean {
        return this.isSel;
    }

    setIsSel(selected: boolean): void {
        this.isSel = selected;
    }

    update(): void {}
}
