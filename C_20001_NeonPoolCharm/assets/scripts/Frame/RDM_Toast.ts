const { ccclass, property } = cc._decorator;

@ccclass
export default class RDM_Toast extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;

    text: string = "";

    onLoad(): void {
        this.label.string = this.text;
    }

    start(): void {
        cc.tween(this.node)
            .delay(0.01)
            .by(0.8, { y: 150 })
            .delay(0.7)
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}
