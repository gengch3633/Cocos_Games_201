import BasePageCtrl from "./BasePageCtrl";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/BlockPageCtrl")
export default class BlockPageCtrl extends BasePageCtrl {

    @property(cc.Node)
    animationNode = null;

    @property(cc.Label)
    label = null;

    static prefabUrl = "BlockPage";

    static className = "BlockPageCtrl";

    _init(e) {
        this.label.string = "area" === e.type ? "pkey_040" : "pkey_039";
    }

    onEnable() {
        this._black.opacity = 192;
        const e = .5 * cc.winSize.width + .5 * this.animationNode.width;
        this.animationNode.x = e;
        cc.tween(this.animationNode).to(.7, {
            x: 0
        }, {
            easing: "backOut"
        }).start();
    }
}
