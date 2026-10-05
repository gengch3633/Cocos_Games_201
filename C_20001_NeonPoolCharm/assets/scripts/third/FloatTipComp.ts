const { ccclass } = cc._decorator;

@ccclass
export default class FloatTipComp extends cc.Component {
    show(tip: string): void {
        cc.find("label_tip", this.node).getComponent(cc.Label).string = tip;
        this.node.getComponent(cc.Animation).play("float_alpha");
    }

    onLoad(): void {
        this.node.opacity = 0;
    }
}
