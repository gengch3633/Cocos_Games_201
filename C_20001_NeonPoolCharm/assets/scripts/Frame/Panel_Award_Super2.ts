import AinanEff from "./AinanEff";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Award_Super2 extends cc.Component {
    @property(cc.Node)
    externalRootNode: cc.Node = null;

    @property(sp.Skeleton)
    titleSkeleton2: sp.Skeleton = null;

    @property(cc.Node)
    extraBonusNode: cc.Node = null;

    @property(cc.Label)
    bonusLabel2: cc.Label = null;

    @property(cc.Node)
    adActionButton2: cc.Node = null;

    @property(cc.Node)
    noAdIcon: cc.Node = null;

    @property(cc.Node)
    adIcon2: cc.Node = null;

    @property(cc.Node)
    commonActionButton2: cc.Node = null;

    @property(cc.Node)
    guide: cc.Node = null;

    @property(cc.Node)
    hand: cc.Node = null;

    viewData: any = null;
    isTouch: boolean = true;
    _dialogOriginalY: number = 0;
    hideTime: number = 0;

    onBtnEvent(): void {
        if (this.isTouch) {
            this.isTouch = false;
            const isFree = !this.adIcon2.active;
            FrameSDK.frameData.sdkFuc.ppEvent(isFree ? "freeClaim" : "claim");
            FrameSDK.logCommonEvent("c_ad_event", {
                action: "touch",
                type: "video",
                placement: "reward_sup",
            });
            FrameSDK.logGameEvent("thepool_game_rew", {
                object_action: "show",
                object_name: "sup_ad",
            });
            const claimReward = (hasCharity: boolean) => {
                let charityNum = 0;
                let charityFlag = 0;
                if (!isFree && hasCharity) {
                    charityNum = FrameData.getCharityOutNum();
                    charityFlag = 1;
                }
                FrameSDK.frameData.sdkFuc.ppEvent(isFree ? "freeCollected" : "collected");
                FrameSDK.addCoin(this.viewData.bonus, charityNum, charityFlag, this.viewData.closeCB);
                cc.director.emit("SUPER_AWARD", "claim", this.viewData.param);
                this.onTouchCloseTips();
            };
            if (isFree) {
                claimReward(false);
            } else {
                FrameSDK.openVideo("reward_sup", false, (adType) => {
                    FrameSDK.logGameEvent("thepool_game_ad", {
                        object_action: "show",
                        object_name: "reward_sup",
                        object_notes: adType === "video" ? "video" : adType === "web" ? "web" : "inter",
                    });
                }, (hasCharity) => claimReward(hasCharity), () => {
                    this.isTouch = true;
                }, {
                    reward: this.viewData.bonus,
                    isMax: false,
                });
            }
        }
    }

    onTouchCloseTips(): void {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, null);
        }
    }

    onEnable(): void {
        FrameSDK.openEffect(this, { opacity: 240 });
        FrameSDK.playEffect("rewardshow");
        FrameSDK.frameData.sdkFuc.ppEvent("popupShow");
        FrameSDK.logCommonEvent("c_ad_event", {
            action: "exposure",
            type: "video",
            placement: "reward_sup",
        });
        FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "show",
            object_name: "sup_show",
        });
        this.externalRootNode.removeAllChildren();
        if (this.viewData.externalNode) {
            this.externalRootNode.addChild(this.viewData.externalNode);
        }
        this.titleSkeleton2.setAnimation(0, "start", false);
        this.titleSkeleton2.addAnimation(0, "loop", true);
        const bonusStr = FrameSDK.convertCoinToStr(this.viewData.bonus);
        const freeBonusStr = FrameSDK.convertCoinToStr(this.viewData.freeBonus);
        const showAd = !FrameSDK.frameData.gameData.noProfitAd;
        this.bonusLabel2.string = "" + bonusStr;
        this.noAdIcon.active = !showAd;
        this.adIcon2.active = showAd;
        this.commonActionButton2.active = showAd;
        this.commonActionButton2.getComponentInChildren(cc.Label).string = "skey_034 " + freeBonusStr;
        this.extraBonusNode.scale = 0;
        this.extraBonusNode.y = this._dialogOriginalY;
        cc.Tween.stopAllByTarget(this.extraBonusNode);
        cc.tween(this.extraBonusNode)
            .delay(1)
            .set({ scale: 0.2 })
            .to(0.4, { scale: 1 }, { easing: "backOut" })
            .call(() => {
                cc.tween(this.extraBonusNode)
                    .by(1, { y: 5 }, { easing: "sineInOut" })
                    .by(1.5, { y: -5 }, { easing: "sineInOut" })
                    .union()
                    .repeatForever()
                    .start();
            })
            .start();
        if (FrameData.saveData.freeSuperAward) {
            FrameData.saveData.freeSuperAward = false;
            this.noAdIcon.active = true;
            this.adIcon2.active = false;
            this.commonActionButton2.active = false;
            this.guide.active = true;
            this.hand.active = true;
        } else {
            this.guide.active = false;
            this.hand.active = false;
        }
    }

    onLoad(): void {
        this.adActionButton2.on(cc.Node.EventType.TOUCH_END, this.onBtnEvent, this);
        this.commonActionButton2.on(cc.Node.EventType.TOUCH_END, this.click_Common, this);
        this._dialogOriginalY = this.extraBonusNode.y;
        const noAdDelay = FrameSDK.getNoAdDelayTime();
        if (noAdDelay != null && noAdDelay >= 0) {
            this.commonActionButton2.getComponent(AinanEff).dtime += noAdDelay;
        }
    }

    click_Common(): void {
        if (this.isTouch) {
            this.isTouch = false;
            FrameSDK.logGameEvent("thepool_game_rew", {
                object_action: "show",
                object_name: "sup_free",
            });
            FrameSDK.frameData.sdkFuc.ppEvent("freeClaim");
            ((hasCharity: boolean) => {
                let charityNum = 0;
                let charityFlag = 0;
                if (hasCharity) {
                    charityNum = FrameData.getCharityOutNum();
                    charityFlag = 1;
                }
                FrameSDK.addCoin(this.viewData.freeBonus, charityNum, charityFlag, this.viewData.closeCB);
                FrameSDK.frameData.sdkFuc.ppEvent("freeCollected");
                this.onTouchCloseTips();
            })(false);
        }
    }
}
