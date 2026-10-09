import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_CoinTips extends cc.Component {

    @property(cc.Node)
    animationNode: cc.Node = null;

    @property(cc.Label)
    labelCoin: cc.Label = null;

    @property(cc.Label)
    labelCoinBubble: cc.Label = null;

    @property(cc.Label)
    labelCoin2: cc.Label = null;

    @property(cc.RichText)
    levelRequirement: cc.RichText = null;

    viewData: any = null;

    black_sprite: cc.Sprite = null;

    hideTime: number = 0;

    onDisable(): void {
        const e = this.viewData;
        const closeCB = e.closeCB;
        if (closeCB) {
            closeCB.call(e);
        }
    }

    onTouchCloseTips(): void {
        const e = this;
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            this.black_sprite.node.off(cc.Node.EventType.TOUCH_END, this.onTouchCloseTips, this);
            const t = 0.5 * cc.winSize.width + 0.5 * this.animationNode.width;
            cc.Tween.stopAllByTarget(this.animationNode);
            cc.tween(this.animationNode).to(0.7, {
                x: -t
            }, {
                easing: "backIn"
            }).call(function () {
                FrameSDK.closeEffect(e, null);
            }).start();
        }
    }

    onEnable(): void {
        if (FrameSDK.frameData.gameData.noProfitAd) {
            this.viewData.charityNum = 0;
        }
        FrameSDK.openEffect(this);
        FrameSDK.playEffect("rewardshow");
        this.labelCoin.node.parent.active = this.viewData.num > 0;
        this.labelCoin.string = FrameSDK.convertCoinToStr(this.viewData.num);
        this.labelCoinBubble.string = FrameSDK.convertCoinToStr(this.viewData.num, true);
        this.labelCoin2.string = "" + FrameSDK.convertCharityToStr(this.viewData.charityNum);
        this.labelCoin2.node.parent.active = this.viewData.charityNum > 0;
        const e = FrameSDK.getFirstRedeemRequirement().rdm_1;
        if (FrameSDK.frameData.gameData.passLevel < e) {
            const t = FrameData.FRAME_CONF.RedeemRateConfig[0];
            this.levelRequirement.string = 'skey_097??&value1==<img src="dollar4" offset=-3/> <color= #8AFF77>' + FrameSDK.convertCoinToStr(t) + "</c>&value2==<color= #8AFF77>" + FrameSDK.convertCoinToStr(t, true) + "</c>&value3==<color= #FDFF48>" + e + "</c>";
        } else {
            this.levelRequirement.string = "";
        }
    }

    onLoad(): void {
        const e = this;
        const t = 0.5 * cc.winSize.width + 0.5 * this.animationNode.width;
        this.animationNode.x = t;
        cc.tween(this.animationNode).to(0.7, {
            x: 0
        }, {
            easing: "backOut"
        }).call(function () {
            e.black_sprite.node.on(cc.Node.EventType.TOUCH_END, e.onTouchCloseTips, e);
        }).start();
    }

}
