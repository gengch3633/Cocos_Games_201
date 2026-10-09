const { ccclass, property } = cc._decorator;

@ccclass
export default class RDM_Toast extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    text: string = "";

    start() {
        let e = this;
        cc.tween(this.node).delay(.01).by(.8, {
            y: 150
        }).delay(.7).call(function () {
            e.node.destroy();
        }).start();
    }

    onLoad() {
        this.label.string = this.text;
    }
}
