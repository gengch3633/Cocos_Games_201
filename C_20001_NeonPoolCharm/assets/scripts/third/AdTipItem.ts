import GameHelper from "./GameHelper";

const { ccclass } = cc._decorator;

@ccclass
export default class AdTipItem extends cc.Component {
    private _originalPositionY = 0;

    onLoad(): void {
        this._originalPositionY = this.node.y;
        this.node.opacity = GameHelper.pocketed ? 255 : 0;
    }

    start(): void {
        this.node.y = this._originalPositionY;
        cc.Tween.stopAllByTarget(this.node);
        cc.tween(this.node)
            .by(1, { y: 5 }, { easing: "sineInOut" })
            .by(1.5, { y: -5 }, { easing: "sineInOut" })
            .union()
            .repeatForever()
            .start();
    }
}
