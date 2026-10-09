import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_WelcomeBack extends cc.Component {

    @property(cc.Node)
    animationNode: cc.Node = null;

    @property(cc.RichText)
    richText: cc.RichText = null;

    viewData: any = null;

    onEnable(): void {
        FrameSDK.openEffect(this);
        FrameSDK.playEffect("rewardshow");
    }

    onLoad(): void {
        const e = this;
        const t = 0.5 * cc.winSize.width + 0.5 * this.animationNode.width;
        this.animationNode.x = t;
        cc.tween(this.animationNode).to(0.7, {
            x: 0
        }, {
            easing: "backOut"
        }).delay(2).to(0.7, {
            x: -t
        }, {
            easing: "backIn"
        }).call(function () {
            FrameSDK.closeEffect(e, null);
        }).start();
        this.richText.string = "skey_122??&value1==<size=36><color= #FDFF48>30</c></size>";
    }

    onDisable(): void {
        const e = this.viewData;
        const closeCB = e.closeCB;
        if (closeCB) {
            closeCB.call(e);
        }
    }

}
