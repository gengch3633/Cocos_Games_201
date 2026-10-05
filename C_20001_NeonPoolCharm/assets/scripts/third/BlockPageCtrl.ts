import BasePageCtrl from "./BasePageCtrl";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/BlockPageCtrl")
export default class BlockPageCtrl extends BasePageCtrl {
    static prefabUrl = "BlockPage";
    static className = "BlockPageCtrl";

    @property(cc.Node)
    animationNode: cc.Node = null;

    @property(cc.Label)
    label: cc.Label = null;

    _init(data: { type?: string }): void {
        this.label.string = data.type === "area" ? "pkey_040" : "pkey_039";
    }

    onEnable(): void {
        this._black.opacity = 192;
        const startX = 0.5 * cc.winSize.width + 0.5 * this.animationNode.width;
        this.animationNode.x = startX;
        cc.tween(this.animationNode)
            .to(0.7, { x: 0 }, { easing: "backOut" })
            .start();
    }
}
