import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_GuideSuperReward extends cc.Component {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    topUserLabel: cc.Label = null;

    viewData: any = null;
    black_sprite: cc.Sprite = null;
    hideTime: number = 0;

    onTouchCloseTips(): void {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            this.black_sprite.node.off(cc.Node.EventType.TOUCH_END, this.onTouchCloseTips, this);
            const offsetX = 0.5 * cc.winSize.width + 0.5 * this.bg.width;
            cc.Tween.stopAllByTarget(this.bg);
            cc.tween(this.bg)
                .to(0.7, { x: -offsetX }, { easing: "backIn" })
                .call(() => {
                    FrameSDK.closeEffect(this, null);
                })
                .start();
        }
    }

    onDisable(): void {
        this.viewData?.closeCB?.();
    }

    onEnable(): void {
        FrameSDK.openEffect(this);
        FrameSDK.logGameEvent("thepool_task", { object_action: "show", object_name: "task_start" });
    }

    onLoad(): void {
        const offsetX = 0.5 * cc.winSize.width + 0.5 * this.bg.width;
        this.bg.x = offsetX;
        this.topUserLabel.string = "skey_124??&value1==" + FrameData.FRAME_CONF.SuperRewardConfig.topNumber;
        FrameSDK.playEffect("rewardshow");
        cc.tween(this.bg)
            .to(0.7, { x: 0 }, { easing: "backOut" })
            .call(() => {
                this.black_sprite.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseTips, this);
            })
            .start();
    }
}
