import AinanEff from "./AinanEff";
import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Award_3 extends cc.Component {
    @property(sp.Skeleton)
    titleSkeleton: sp.Skeleton = null;

    @property(sp.Skeleton)
    contentSkeleton: sp.Skeleton = null;

    @property(cc.Node)
    baseCoinNode: cc.Node = null;

    @property(cc.Label)
    baseCoinLabel: cc.Label = null;

    @property(cc.Node)
    arrowNode: cc.Node = null;

    @property(cc.Node)
    maxCoinNode: cc.Node = null;

    @property(cc.Label)
    maxCoinLabel: cc.Label = null;

    @property(cc.Node)
    finalCoinNode: cc.Node = null;

    @property(cc.Label)
    finalCoinLabel: cc.Label = null;

    @property(cc.Node)
    labelRootNode: cc.Node = null;

    @property(cc.Node)
    multiplierDisplay: cc.Node = null;

    @property(cc.Node)
    pointerIndicator: cc.Node = null;

    @property(cc.Node)
    adBannerButton: cc.Node = null;

    @property(cc.Label)
    adFrequencyCounter: cc.Label = null;

    @property(cc.Node)
    commonActionButton: cc.Node = null;

    @property(cc.Node)
    sian: cc.Node = null;

    @property(cc.Node)
    noAdBadgeIcon: cc.Node = null;

    @property(cc.Node)
    adBadgeIcon: cc.Node = null;

    @property(sp.Skeleton)
    ribbonSkeleton: sp.Skeleton = null;

    adData: any = null;
    viewData: any = null;
    getYCoin: number = 0;
    beishe: number = 1;
    speed: number = 300;
    timeArray: any[] = [];
    targetIndex: number = 0;
    hideTime: number = 0;
    noTouch: cc.BlockInputEvents = null;

    onEnable(): void {
        this.adData = FrameData.getOutputConfig(false);
        this.getYCoin = FrameData.getCoinOutNum("draw");
        this.timeArray.push.apply(this.timeArray, FrameData.getCoinOutNum("drawRate"));
        const freeCoin = FrameData.getCoinOutNum("free");
        FrameSDK.logCommonEvent("c_ad_event", {
            action: "exposure",
            type: "video",
            placement: "reward_1"
        });
        FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "show",
            object_name: "rew_show",
            object_notes: "reward_1"
        });
        FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? "freeShow" : "popupShow");
        FrameSDK.openEffect(this);
        FrameSDK.playEffect("rewardshow");
        this.node.opacity = 255;
        this.titleSkeleton.setAnimation(0, "start", false);
        this.titleSkeleton.addAnimation(0, "loop", true);
        this.contentSkeleton.setAnimation(0, "start", false);
        this.contentSkeleton.addAnimation(0, "loop", true);
        this.labelRootNode.children.forEach((e, a) => {
            e.getComponent(cc.Label).string = "x" + (this.timeArray[a] != null ? this.timeArray[a] : 1);
        });
        this.multiplierDisplay.active = false;
        const coinText = FrameSDK.convertCoinToStr(this.getYCoin);
        this.baseCoinLabel.string = coinText;
        this.maxCoinLabel.string = FrameSDK.convertCoinToStr(this.getYCoin * Math.max.apply(Math, this.timeArray));
        this.finalCoinLabel.string = coinText;
        this.finalCoinNode.opacity = 0;
        this.adFrequencyCounter.string = coinText;
        this.noAdBadgeIcon.active = this.adData.isFree;
        this.adBadgeIcon.active = !this.adData.isFree;
        this.commonActionButton.active = this.adBadgeIcon.active;
        this.commonActionButton.getComponentInChildren(cc.Label).string = "skey_034 " + FrameSDK.convertCoinToStr(freeCoin);
        this.ribbonSkeleton.enabled = false;
        this.zhizhenAin();
    }

    onLoad(): void {
        this.adBannerButton.on(cc.Node.EventType.TOUCH_END, () => {
            this.click_AD();
        });
        this.commonActionButton.on(cc.Node.EventType.TOUCH_END, () => {
            this.click_Common();
        });
        const delay = FrameSDK.getNoAdDelayTime();
        if (delay != null && delay >= 0) {
            this.commonActionButton.getComponent(AinanEff).dtime += delay;
        }
    }

    updataBeiShe(): void {
        const coinText = FrameSDK.convertCoinToStr(this.beishe * this.getYCoin);
        this.baseCoinLabel.string = coinText;
        this.adFrequencyCounter.string = coinText;
    }

    @CLICKLOCK()
    click_Common(): void {
        this.noTouch.node.active = true;
        const freeCoin = FrameData.getCoinOutNum("free");
        FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "show",
            object_name: "rew_free",
            object_notes: "reward_1"
        });
        FrameSDK.frameData.sdkFuc.ppEvent("freeClaim");
        ((claimed) => {
            let charity = 0;
            let charityFlag = 0;
            if (claimed) {
                charity = FrameData.getCharityOutNum();
                charityFlag = 1;
            }
            FrameSDK.addCoin(freeCoin, charity, charityFlag, this.viewData != null ? this.viewData.closeCB : undefined);
            FrameSDK.frameData.sdkFuc.ppEvent("freeCollected");
            this.close();
        })(false);
    }

    setUi(): void {
        for (let t = 0; t < this.sian.childrenCount; t++) {
            const child = this.sian.children[t];
            const box = child.getBoundingBox();
            box.y = 0;
            child.active = box.contains(cc.v2(this.pointerIndicator.x, 0));
            if (child.active) {
                this.targetIndex = t;
            }
        }
        this.beishe = this.timeArray[this.targetIndex] != null ? this.timeArray[this.targetIndex] : 1;
        this.updataBeiShe();
    }

    close(e: any = null): void {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, e);
        }
    }

    update(): void {
        this.setUi();
    }

    zhizhenAin(): void {
        this.pointerIndicator.stopAllActions();
        const startX = this.pointerIndicator.x;
        const endX = Math.abs(this.pointerIndicator.x);
        const duration = Math.abs(2 * this.pointerIndicator.x) / this.speed;
        cc.tween(this.pointerIndicator).to(duration, {
            x: endX
        }).to(duration, {
            x: startX
        }).union().repeatForever().start();
    }

    @CLICKLOCK()
    click_AD(): void {
        FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? "freeClaim" : "claim");
        FrameSDK.logCommonEvent("c_ad_event", {
            action: "touch",
            type: "video",
            placement: "reward_1"
        });
        FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "show",
            object_name: "rew_ad",
            object_notes: "reward_1"
        });
        this.pointerIndicator.pauseAllActions();
        this.setUi();
        const rewardCoin = this.getYCoin * this.beishe;
        const grantReward = (success) => {
            FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? "freeCollected" : "collected");
            let charity = 0;
            let charityFlag = 0;
            if (!this.adData.isFree && success) {
                charity = FrameData.getCharityOutNum();
                charityFlag = 1;
            }
            this.multiplierDisplay.active = true;
            this.multiplierDisplay.children.forEach((child) => {
                child.active = child.name == this.beishe.toString();
            });
            this.multiplierDisplay.stopAllActions();
            cc.Tween.stopAllByTarget(this.baseCoinNode);
            cc.tween(this.baseCoinNode).to(0.1, {
                x: this.baseCoinNode.x - 200,
                opacity: 0
            }).start();
            cc.Tween.stopAllByTarget(this.maxCoinNode);
            cc.tween(this.maxCoinNode).to(0.1, {
                x: this.maxCoinNode.x + 200,
                opacity: 0
            }).start();
            cc.Tween.stopAllByTarget(this.arrowNode);
            cc.tween(this.arrowNode).to(0.1, {
                opacity: 0
            }).start();
            cc.Tween.stopAllByTarget(this.finalCoinNode);
            cc.tween(this.finalCoinNode).to(0.1, {
                opacity: 255
            }).to(0.3, {}, {
                onUpdate: (target, ratio) => {
                    this.finalCoinLabel.string = FrameSDK.convertCoinToStr(this.getYCoin + (rewardCoin - this.getYCoin) * ratio);
                }
            }).call(() => {
                this.finalCoinLabel.string = FrameSDK.convertCoinToStr(rewardCoin);
            }).start();
            cc.tween(this.multiplierDisplay).delay(0.1).set({
                scale: 1
            }).to(0.2, {
                scale: 3
            }).to(0.1, {
                scale: 1
            }).call(() => {
                FrameSDK.playEffect("rate_show");
            }).delay(0.2).call(() => {
                this.ribbonSkeleton.enabled = true;
                this.ribbonSkeleton.setAnimation(0, "caidai", false);
                FrameSDK.playEffect("pool_cashdone");
            }).delay(1).call(() => {
                FrameSDK.addCoin(rewardCoin, charity, charityFlag, this.viewData != null ? this.viewData.closeCB : undefined);
                this.close();
            }).start();
        };
        this.noTouch.node.active = true;
        this.adData.isFree ? grantReward(false) : FrameSDK.openVideo("reward_1", false, (e) => {
            FrameSDK.logGameEvent("thepool_game_ad", {
                object_action: "show",
                object_name: "reward_1",
                object_notes: "video" === e ? "video" : "web" === e ? "web" : "inter"
            });
        }, (e) => {
            return grantReward(e);
        }, () => {
            this.pointerIndicator.resumeAllActions();
            this.noTouch.node.active = false;
        }, {
            reward: rewardCoin,
            isMax: false
        });
    }
}
