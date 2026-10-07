import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_RedeemTips extends cc.Component {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    levelLabel: cc.Label = null;

    @property(cc.RichText)
    tips1: cc.RichText = null;

    @property(cc.RichText)
    rtx_tips1: cc.RichText = null;

    viewData: any = null;

    onLoad(): void {
        const offsetX = 0.5 * cc.winSize.width + 0.5 * this.bg.width;
        this.bg.x = offsetX;
        this.levelLabel.string = "" + this.viewData.level;
        const rdm1 = FrameSDK.getFirstRedeemRequirement().rdm_1;
        this.tips1.string = "skey_078??&value1==<color= #FDFF48>" + Math.max(0, rdm1 - FrameSDK.frameData.gameData.passLevel) + "</c>";
        this.rtx_tips1.string = "skey_079??&value1==<color= #8AFF77>" + FrameSDK.convertCoinToStr(this.viewData.currentBonus, true) + "</c>";
        FrameSDK.playEffect("rewardshow");
        cc.tween(this.bg).to(0.7, {
            x: 0
        }, {
            easing: "backOut"
        }).delay(1).to(0.7, {
            x: -offsetX
        }, {
            easing: "backIn"
        }).call(() => {
            FrameSDK.closeEffect(this, null);
        }).start();
    }

    onEnable(): void {
        FrameSDK.openEffect(this);
    }

    onDisable(): void {
        this.viewData?.closeCB?.();
    }
}
