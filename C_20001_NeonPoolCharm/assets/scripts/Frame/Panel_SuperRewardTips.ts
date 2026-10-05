import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_SuperRewardTips extends cc.Component {
    @property(cc.Node)
    panel_window: cc.Node = null;

    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(cc.Node)
    errorNode: cc.Node = null;

    @property(cc.Label)
    bonusLabel: cc.Label = null;

    @property(cc.Label)
    tipLabel: cc.Label = null;

    @property(cc.Node)
    quitButtonNode: cc.Node = null;

    @property(cc.Node)
    keepButtonNode: cc.Node = null;

    @property(cc.Node)
    collectButtonNode: cc.Node = null;

    @property(cc.Node)
    returnButtonNode: cc.Node = null;

    viewData: any = null;

    onQuitButtonClick(): void {
        FrameSDK.closeEffect(this, () => this.viewData.callback?.(false));
    }

    onCollectButtonClick(): void {
        FrameSDK.closeEffect(this, () => this.viewData.callback?.(true));
    }

    onEnable(): void {
        FrameSDK.openEffect(this);
        switch (this.viewData.type) {
            case "quit":
                this.titleLabel.string = "skey_140";
                this.errorNode.active = false;
                this.bonusLabel.node.parent.active = true;
                this.bonusLabel.string = FrameSDK.convertCoinToStr(this.viewData.bonus, true);
                this.tipLabel.string = "skey_141";
                this.quitButtonNode.active = true;
                this.keepButtonNode.active = true;
                this.collectButtonNode.active = false;
                this.returnButtonNode.active = false;
                break;
            case "complete":
                this.titleLabel.string = "skey_144";
                this.errorNode.active = false;
                this.bonusLabel.node.parent.active = true;
                this.bonusLabel.string = FrameSDK.convertCoinToStr(this.viewData.bonus, true);
                this.tipLabel.string = "skey_145";
                this.quitButtonNode.active = false;
                this.keepButtonNode.active = false;
                this.collectButtonNode.active = true;
                this.returnButtonNode.active = false;
                break;
            case "error":
                this.titleLabel.string = "skey_150";
                this.errorNode.active = true;
                this.bonusLabel.node.parent.active = false;
                this.bonusLabel.string = FrameSDK.convertCoinToStr(this.viewData.bonus, true);
                this.tipLabel.string = "skey_151";
                this.quitButtonNode.active = false;
                this.keepButtonNode.active = false;
                this.collectButtonNode.active = false;
                this.returnButtonNode.active = true;
        }
    }

    onReturnButtonClick(): void {
        FrameSDK.closeEffect(this, () => this.viewData.callback?.(true));
    }

    onKeepButtonClick(): void {
        FrameSDK.closeEffect(this, () => this.viewData.callback?.(true));
    }
}
