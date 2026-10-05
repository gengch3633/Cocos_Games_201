import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_GuideTips extends cc.Component {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(cc.Node)
    charityLogo: cc.Node = null;

    @property(cc.RichText)
    tipsRichText: cc.RichText = null;

    viewData: any = null;

    onEnable(): void {
        FrameSDK.openEffect(this);
    }

    onLoad(): void {
        const offsetX = 0.5 * cc.winSize.width + 0.5 * this.bg.width;
        this.bg.x = offsetX;
        this.charityLogo.active = this.viewData.type === "charity";
        switch (this.viewData.type) {
            case "charity":
                this.titleLabel.string = "skey_105";
                this.tipsRichText.string = "skey_106";
                break;
            default:
                this.titleLabel.string = "";
                this.tipsRichText.string = "";
        }
        FrameSDK.playEffect("rewardshow");
        cc.tween(this.bg)
            .to(0.7, { x: 0 }, { easing: "backOut" })
            .delay(1)
            .to(0.7, { x: -offsetX }, { easing: "backIn" })
            .call(() => {
                FrameSDK.closeEffect(this, null);
            })
            .start();
    }

    onDisable(): void {
        this.viewData?.closeCB?.();
    }
}
