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
    awardList: any[] = [];
    isTouch: boolean = false;
    hideTime: number = 0;

    boxAin(e, t, a: number = 1, o?): void {
        const card = this.boxNode.children[t];
        if (1 == e) {
            const origin = cc.v3(card.position);
            cc.tween(card).delay(a).to(0.2, {
                scaleX: 0
            }).call(() => {
                cc.find("pai", card).getComponent(cc.Sprite).spriteFrame = this.front;
                cc.find("layout", card).active = false;
                cc.find("bubble", card).active = false;
                cc.find("robux3", card).active = false;
            }).to(0.2, {
                scaleX: 1
            }).to(0.5, {
                position: cc.v3()
            }).delay(0.1).to(0.5, {
                position: origin
            }).call(() => {
                this.isTouch = true;
                cc.find("click", card).active = true;
                if (o) {
                    o();
                }
            }).start();
        } else {
            if (0 === t) {
                FrameSDK.playEffect("newbiereward_show");
            }
            cc.tween(card).delay(a).to(0.2, {
                scaleX: 0
            }).call(() => {
                cc.find("pai", card).getComponent(cc.Sprite).spriteFrame = this.queen;
                cc.find("layout", card).active = true;
                cc.find("robux3", card).active = true;
            }).to(0.2, {
                scaleX: 1
            }).call(() => {
                if (0 === t) {
                    const bubble = cc.find("bubble", card);
                    bubble.scale = 0.2;
                    bubble.active = true;
                    cc.Tween.stopAllByTarget(bubble);
                    cc.tween(bubble).to(0.2, {
                        scale: 1
                    }, {
                        easing: "backOut"
                    }).call(() => {
                        cc.tween(bubble).to(0.5, {
                            scale: 1.2
                        }, {
                            easing: "sineInOut"
                        }).to(0.5, {
                            scale: 1
                        }, {
                            easing: "sineInOut"
                        }).union().repeatForever().start();
                    }).start();
                }
                cc.find("light", card).active = 0 == t;
                cc.find("kamian", card).active = 0 !== t;
                if (o) {
                    o();
                }
            }).start();
        }
    }

    onEnable(): void {
        FrameSDK.openEffect(this, {
            opacity: 233
        });
        FrameSDK.playEffect("newbiepage_show");
        FrameSDK.logGameEvent("thepool_game_new", {
            object_action: "show",
            object_name: "new_2"
        }, true);
        FrameSDK.frameData.sdkFuc.earlierStageEvent("guide_button", "guide_start");
        this.focus.opacity = 0;
        this.superprize.node.active = false;
        this.awardList.length = 0;
        const newFixed = FrameData.getCoinOutNum("newFixed");
        if (newFixed && Array.isArray(newFixed) && newFixed.length >= 3) {
            this.awardList.push.apply(this.awardList, newFixed);
        } else {
            const randomSource = FrameData.getCoinOutNum("newFixed");
            this.awardList.push(FrameData.getCoinOutNum("new"), FrameSDK.randomInt(randomSource), FrameSDK.randomInt(randomSource));
        }
        this.boxNode.children.forEach((card, index) => {
            card.on(cc.Node.EventType.TOUCH_END, this.openBox.bind(this, index), this);
            cc.find("light", card).active = false;
            cc.find("layout/label", card).getComponent(cc.Label).string = FrameSDK.convertCoinToStr(this.awardList[index]);
            cc.find("bubble", card).active = false;
            cc.find("bubble/label", card).getComponent(cc.Label).string = FrameSDK.convertCoinToStr(this.awardList[index], true);
            cc.find("click", card).active = false;
            cc.find("kamian", card).active = false;
            this.boxAin(1, index, 1.4, 0 === index ? () => {
                this.dialog.active = true;
                this.dialogLabel.string = "skey_095";
                this.dialogLabel.node.scale = 0.8;
                cc.Tween.stopAllByTarget(this.dialogLabel.node);
                cc.tween(this.dialogLabel.node).to(0.3, {
                    scale: 1
                }, {
                    easing: "backOut"
                }).start();
            } : undefined);
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
        const viewData = this.viewData;
        const closeCB = viewData.closeCB;
        if (closeCB != null) {
            closeCB.call(viewData);
        }
    }

    openBox(e): void {
        if (this.isTouch) {
            this.isTouch = false;
            const first = this.boxNode.children[0];
            const picked = this.boxNode.children[e];
            const firstPos = first.position;
            first.position = picked.position;
            picked.position = firstPos;
            FrameSDK.logGameEvent("thepool_game_new", {
                object_action: "show",
                object_name: "new_3"
            }, true);
            this.boxNode.children.forEach((card) => {
                cc.find("click", card).active = false;
            });
            this.boxAin(0, 0, 0, () => {
                for (let delay = 1, index = 1; index < this.boxNode.childrenCount; index++) {
                    delay += 0.2;
                    this.boxAin(0, index, delay);
                    if (index == this.boxNode.childrenCount - 1) {
                        cc.Tween.stopAllByTarget(this.dialogLabel.node);
                        cc.tween(this.dialogLabel.node).delay(delay + 0.6).call(() => {
                            FrameSDK.playEffect("newbiepage_show");
                            this.dialogLabel.string = "skey_096";
                            this.dialogLabel.node.scale = 0.8;
                        }).to(0.3, {
                            scale: 1
                        }, {
                            easing: "backOut"
                        }).start();
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
        cc.tween(this.superprize).delay(3).call(() => {
            FrameSDK.logGameEvent("thepool_game_new", {
                object_action: "show",
                object_name: "new_4"
            }, true);
            FrameSDK.addCoin(this.awardList[0], 0, 0, () => {
                Frame.ins.setGuideShow(true);
            });
            this.onTouchCloseTips();
        }).start();
        const first = this.boxNode.children[0];
        first.parent = this.focus.parent;
        cc.tween(this.focus).to(0.5, {
            opacity: 255
        }).start();
        cc.tween(first).to(1, {
            position: cc.v3(),
            scale: 1.5
        }).start();
        cc.tween(this.newcommer).to(0.3, {
            scale: 0
        }, {
            easing: "sineIn"
        }).start();
    }
}
