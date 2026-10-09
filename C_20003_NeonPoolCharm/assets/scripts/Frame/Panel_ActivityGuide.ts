import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_ActivityGuide extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    bankLogo: cc.Node = null;

    @property(cc.Node)
    levelLogo: cc.Node = null;

    @property(cc.RichText)
    rtx_tips1: cc.RichText = null;

    @property(cc.Node)
    tips2: cc.Node = null;

    @property(cc.RichText)
    rtx_tips2: cc.RichText = null;

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    @property(cc.Label)
    progressLabel: cc.Label = null;

    viewData: any = null;

    onEnable() {
        FrameSDK.openEffect(this);
    }

    onLoad() {
        const self = this;
        const offset = 0.5 * cc.winSize.width + 0.5 * this.bg.width;
        this.bg.x = offset;
        this.bankLogo.active = "bank" === this.viewData.logoType;
        this.levelLogo.active = "levelReward" === this.viewData.logoType;
        this.rtx_tips1.node.active = 1 == this.viewData.type;
        this.rtx_tips1.string = this.viewData.text;
        this.tips2.active = 2 == this.viewData.type;
        if (2 == this.viewData.type) {
            this.rtx_tips2.string = this.viewData.text;
            this.progressBar.progress = this.viewData.total <= 0 ? 0 : this.viewData.now / this.viewData.total;
            this.progressLabel.string = this.viewData.now + "/" + this.viewData.total;
        }
        FrameSDK.playEffect("rewardshow");
        cc.tween(this.bg).to(0.7, {
            x: 0
        }, {
            easing: "backOut"
        }).delay(this.viewData.dtime || 1).to(0.7, {
            x: -offset
        }, {
            easing: "backIn"
        }).call(function () {
            FrameSDK.closeEffect(self, null);
        }).start();
    }

    onDisable() {
        if (this.viewData.closeCB != null) {
            this.viewData.closeCB.call(this.viewData);
        }
    }
}
