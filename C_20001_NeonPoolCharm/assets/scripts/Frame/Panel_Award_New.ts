import Frame from "./Frame";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Award_New extends cc.Component {
    @property(cc.Node)
    panel_window: cc.Node = null;

    @property(cc.Node)
    focus: cc.Node = null;

    @property(cc.Node)
    newcommer: cc.Node = null;

    @property(sp.Skeleton)
    superprize: sp.Skeleton = null;

    @property(cc.Node)
    boxNode: cc.Node = null;

    @property(cc.SpriteFrame)
    front: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    queen: cc.SpriteFrame = null;

    @property(cc.Node)
    dialog: cc.Node = null;

    @property(cc.Label)
    dialogLabel: cc.Label = null;

    viewData: any = null;
    awardList: number[] = [];
    isTouch: boolean = false;
    hideTime: number = 0;

    boxAin(type: number, index: number, delay: number = 1, callback?: () => void): void {
        const box = this.boxNode.children[index];
        if (type == 1) {
            const originalPos = cc.v3(box.position);
            cc.tween(box)
                .delay(delay)
                .to(0.2, { scaleX: 0 })
                .call(() => {
                    cc.find("pai", box).getComponent(cc.Sprite).spriteFrame = this.front;
                    cc.find("layout", box).active = false;
                    cc.find("bubble", box).active = false;
                    cc.find("robux3", box).active = false;
                })
                .to(0.2, { scaleX: 1 })
                .to(0.5, { position: cc.v3() })
                .delay(0.1)
                .to(0.5, { position: originalPos })
                .call(() => {
                    this.isTouch = true;
                    cc.find("click", box).active = true;
                    callback?.();
                })
                .start();
        } else {
            if (index === 0) {
                FrameSDK.playEffect("newbiereward_show");
            }
            cc.tween(box)
                .delay(delay)
                .to(0.2, { scaleX: 0 })
                .call(() => {
                    cc.find("pai", box).getComponent(cc.Sprite).spriteFrame = this.queen;
                    cc.find("layout", box).active = true;
                    cc.find("robux3", box).active = true;
                })
                .to(0.2, { scaleX: 1 })
                .call(() => {
                    if (index === 0) {
                        const bubble = cc.find("bubble", box);
                        bubble.scale = 0.2;
                        bubble.active = true;
                        cc.Tween.stopAllByTarget(bubble);
                        cc.tween(bubble)
                            .to(0.2, { scale: 1 }, { easing: "backOut" })
                            .call(() => {
                                cc.tween(bubble)
                                    .to(0.5, { scale: 1.2 }, { easing: "sineInOut" })
                                    .to(0.5, { scale: 1 }, { easing: "sineInOut" })
                                    .union()
                                    .repeatForever()
                                    .start();
                            })
                            .start();
                    }
                    cc.find("light", box).active = index == 0;
                    cc.find("kamian", box).active = index !== 0;
                    callback?.();
                })
                .start();
        }
    }

    onEnable(): void {
        FrameSDK.openEffect(this, { opacity: 233 });
        FrameSDK.playEffect("newbiepage_show");
        FrameSDK.logGameEvent("thepool_game_new", { object_action: "show", object_name: "new_2" }, true);
        FrameSDK.frameData.sdkFuc.earlierStageEvent("guide_button", "guide_start");
        this.focus.opacity = 0;
        this.superprize.node.active = false;
        this.awardList.length = 0;
        const fixed = FrameData.getCoinOutNum("newFixed");
        if (fixed && Array.isArray(fixed) && fixed.length >= 3) {
            this.awardList.push(...fixed);
        } else {
            const randomRange = FrameData.getCoinOutNum("newFixed");
            this.awardList.push(
                FrameData.getCoinOutNum("new"),
                FrameSDK.randomInt(randomRange),
                FrameSDK.randomInt(randomRange)
            );
        }
        this.boxNode.children.forEach((child, index) => {
            child.on(cc.Node.EventType.TOUCH_END, this.openBox.bind(this, index), this);
            cc.find("light", child).active = false;
            cc.find("layout/label", child).getComponent(cc.Label).string = FrameSDK.convertCoinToStr(this.awardList[index]);
            cc.find("bubble", child).active = false;
            cc.find("bubble/label", child).getComponent(cc.Label).string = FrameSDK.convertCoinToStr(
                this.awardList[index],
                true
            );
            cc.find("click", child).active = false;
            cc.find("kamian", child).active = false;
            this.boxAin(
                1,
                index,
                1.4,
                index === 0
                    ? () => {
                          this.dialog.active = true;
                          this.dialogLabel.string = "skey_095";
                          this.dialogLabel.node.scale = 0.8;
                          cc.Tween.stopAllByTarget(this.dialogLabel.node);
                          cc.tween(this.dialogLabel.node)
                              .to(0.3, { scale: 1 }, { easing: "backOut" })
                              .start();
                      }
                    : undefined
            );
        });
        this.dialog.active = false;
        this.dialogLabel.string = "";
        cc.Tween.stopAllByTarget(this.dialogLabel.node);
    }

    onTouchCloseTips(): void {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, null);
        }
    }

    onDisable(): void {
        this.viewData?.closeCB?.();
    }

    openBox(index: number): void {
        if (this.isTouch) {
            this.isTouch = false;
            const firstBox = this.boxNode.children[0];
            const selectedBox = this.boxNode.children[index];
            const firstPos = firstBox.position;
            firstBox.position = selectedBox.position;
            selectedBox.position = firstPos;
            FrameSDK.logGameEvent("thepool_game_new", { object_action: "show", object_name: "new_3" }, true);
            this.boxNode.children.forEach((child) => {
                cc.find("click", child).active = false;
            });
            this.boxAin(0, 0, 0, () => {
                let delay = 1;
                for (let i = 1; i < this.boxNode.childrenCount; i++) {
                    delay += 0.2;
                    this.boxAin(0, i, delay);
                    if (i == this.boxNode.childrenCount - 1) {
                        cc.Tween.stopAllByTarget(this.dialogLabel.node);
                        cc.tween(this.dialogLabel.node)
                            .delay(delay + 0.6)
                            .call(() => {
                                FrameSDK.playEffect("newbiepage_show");
                                this.dialogLabel.string = "skey_096";
                                this.dialogLabel.node.scale = 0.8;
                            })
                            .to(0.3, { scale: 1 }, { easing: "backOut" })
                            .start();
                        this.scheduleOnce(this.playSuperPrize, delay + 1);
                    }
                }
            });
        }
    }

    playSuperPrize(): void {
        FrameSDK.frameData.sdkFuc.earlierStageEvent("guide_reward", "guide_button");
        this.superprize.node.active = true;
        this.superprize.setAnimation(0, "start", false);
        this.superprize.addAnimation(0, "loop", true);
        cc.tween(this.superprize)
            .delay(3)
            .call(() => {
                FrameSDK.logGameEvent("thepool_game_new", { object_action: "show", object_name: "new_4" }, true);
                FrameSDK.addCoin(this.awardList[0], 0, 0, () => {
                    Frame.ins.setGuideShow(true);
                });
                this.onTouchCloseTips();
            })
            .start();
        const firstBox = this.boxNode.children[0];
        firstBox.parent = this.focus.parent;
        cc.tween(this.focus).to(0.5, { opacity: 255 }).start();
        cc.tween(firstBox).to(1, { position: cc.v3(), scale: 1.5 }).start();
        cc.tween(this.newcommer).to(0.3, { scale: 0 }, { easing: "sineIn" }).start();
    }
}
