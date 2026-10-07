import AinanEff from "./AinanEff";
import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Award_1 extends cc.Component {
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
    multiplierDisplay: cc.Node = null;

    @property(cc.Node)
    adBannerButton: cc.Node = null;

    @property(cc.Label)
    adFrequencyCounter: cc.Label = null;

    @property(cc.Node)
    noAdBadgeIcon: cc.Node = null;

    @property(cc.Node)
    adBadgeIcon: cc.Node = null;

    @property(cc.Node)
    commonActionButton: cc.Node = null;

    @property(sp.Skeleton)
    ribbonSkeleton: sp.Skeleton = null;

    getYCoin: number = 0;
    viewData: any = null;
    adData: any = null;
    hideTime: number = 0;
    noTouch: cc.BlockInputEvents = null;

    onLoad(): void {
        this.adBannerButton.on(cc.Node.EventType.TOUCH_END, () => {
            this.click_AD();
        }, this);
        this.commonActionButton.on(cc.Node.EventType.TOUCH_END, () => {
            this.click_Common();
        }, this);
        const noAdDelay = FrameSDK.getNoAdDelayTime();
        if (noAdDelay != null && noAdDelay >= 0) {
            this.commonActionButton.getComponent(AinanEff).dtime += noAdDelay;
        }
    }

    onEnable(): void {
        this.adData = FrameData.getOutputConfig(true);
        this.getYCoin = FrameData.getCoinOutNum("ad");
        const freeCoin = FrameData.getCoinOutNum("free");
        FrameSDK.logCommonEvent("c_ad_event", {
            action: "exposure",
            type: "video",
            placement: "reward_2",
        });
        FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "show",
            object_name: "rew_show",
            object_notes: "reward_2",
        });
        FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? "freeShow" : "popupShow");
        FrameSDK.openEffect(this);
        FrameSDK.playEffect("rewardshow");
        this.node.opacity = 255;
        this.titleSkeleton.setAnimation(0, "start", false);
        this.titleSkeleton.addAnimation(0, "loop", true);
        this.contentSkeleton.setAnimation(0, "start", false);
        this.contentSkeleton.addAnimation(0, "loop", true);
        this.multiplierDisplay.active = false;
        this.multiplierDisplay.children.forEach((child) => {
            cc.Tween.stopAllByTarget(child);
            child.scale = 0;
        });
        const coinStr = FrameSDK.convertCoinToStr(this.getYCoin);
        this.baseCoinLabel.string = coinStr;
        this.maxCoinLabel.string = FrameSDK.convertCoinToStr(this.getYCoin * this.adData.displayRange[1]);
        this.finalCoinLabel.string = coinStr;
        this.finalCoinNode.opacity = 0;
        this.adFrequencyCounter.string = "x" + this.adData.displayRange[0] + "~" + this.adData.displayRange[1];
        this.noAdBadgeIcon.active = this.adData.isFree;
        this.adBadgeIcon.active = !this.adData.isFree;
        this.commonActionButton.active = this.adBadgeIcon.active;
        this.commonActionButton.getComponentInChildren(cc.Label).string = "skey_034 " + FrameSDK.convertCoinToStr(freeCoin);
        this.ribbonSkeleton.enabled = false;
    }

    @CLICKLOCK()
    click_AD(): void {
        FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? "freeClaim" : "claim");
        FrameSDK.logCommonEvent("c_ad_event", {
            action: "touch",
            type: "video",
            placement: "reward_2",
        });
        FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "show",
            object_name: "rew_ad",
            object_notes: "reward_2",
        });
        const playReward = (hasCharity: boolean) => {
            this.multiplierDisplay.active = true;
            cc.Tween.stopAllByTarget(this.multiplierDisplay);
            const multiplierNodes: { [key: number]: cc.Node } = {};
            const minDisplay = this.adData.displayRange[0];
            this.multiplierDisplay.children.forEach((child) => {
                const multiplier = Number(child.name);
                child.scale = 0;
                if (!isNaN(multiplier) && multiplier >= minDisplay && multiplier <= this.adData.ml) {
                    multiplierNodes[multiplier] = child;
                    cc.Tween.stopAllByTarget(child);
                }
            });
            const multipliers = Object.keys(multiplierNodes).map(Number).sort((a, b) => a - b);
            let firstDelay = 0.1;
            let totalDuration = 0.2 * (multipliers.length - 1) + firstDelay;
            if (multipliers.length <= 0) {
                totalDuration = 0;
            } else if (totalDuration > 2) {
                firstDelay = Math.max(0.1, totalDuration - 0.2 * (multipliers.length - 1));
                totalDuration = 0.2 * (multipliers.length - 1) + firstDelay;
            }
            const finalCoin = this.getYCoin * this.adData.ml;
            let charityNum = 0;
            let charityFlag = 0;
            if (!this.adData.isFree && hasCharity) {
                charityNum = FrameData.getCharityOutNum();
                charityFlag = 1;
            }
            cc.Tween.stopAllByTarget(this.baseCoinNode);
            cc.tween(this.baseCoinNode).to(0.1, {
                x: this.baseCoinNode.x - 200,
                opacity: 0,
            }).start();
            cc.Tween.stopAllByTarget(this.maxCoinNode);
            cc.tween(this.maxCoinNode).to(0.1, {
                x: this.maxCoinNode.x + 200,
                opacity: 0,
            }).start();
            cc.Tween.stopAllByTarget(this.arrowNode);
            cc.tween(this.arrowNode).to(0.1, { opacity: 0 }).start();
            cc.Tween.stopAllByTarget(this.finalCoinNode);
            cc.tween(this.finalCoinNode)
                .to(0.1, { opacity: 255 })
                .to(totalDuration + 0.2, {}, {
                    onUpdate: (_target, ratio) => {
                        this.finalCoinLabel.string = FrameSDK.convertCoinToStr(this.getYCoin + (finalCoin - this.getYCoin) * ratio);
                    },
                })
                .call(() => {
                    this.finalCoinLabel.string = FrameSDK.convertCoinToStr(finalCoin);
                })
                .start();
            multipliers.forEach((multiplier, index) => {
                const node = multiplierNodes[multiplier];
                node.scale = 0;
                cc.tween(node)
                    .delay(0.1 + 0.2 * index)
                    .set({ scale: 1 })
                    .to(0.2, { scale: 3 })
                    .to(0.1, { scale: 1 })
                    .call(() => FrameSDK.playEffect("rate_show"))
                    .start();
            });
            cc.tween(this.multiplierDisplay)
                .delay(0.1 + totalDuration + 0.2)
                .call(() => {
                    this.ribbonSkeleton.enabled = true;
                    this.ribbonSkeleton.setAnimation(0, "caidai", false);
                    FrameSDK.playEffect("pool_cashdone");
                })
                .delay(1)
                .call(() => {
                    FrameSDK.addCoin(finalCoin, charityNum, charityFlag, this.viewData?.closeCB);
                    FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? "freeCollected" : "collected");
                    this.close();
                })
                .start();
        };
        this.noTouch.node.active = true;
        if (this.adData.isFree) {
            playReward(false);
        } else {
            FrameSDK.openVideo("reward_2", false, (adType) => {
                FrameSDK.logGameEvent("thepool_game_ad", {
                    object_action: "show",
                    object_name: "reward_2",
                    object_notes: adType === "video" ? "video" : adType === "web" ? "web" : "inter",
                });
            }, (hasCharity) => playReward(hasCharity), () => {
                this.noTouch.node.active = false;
            }, {
                reward: this.getYCoin * this.adData.displayRange[1],
                isMax: true,
            });
        }
    }

    @CLICKLOCK()
    click_Common(): void {
        this.noTouch.node.active = true;
        const freeCoin = FrameData.getCoinOutNum("free");
        FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "show",
            object_name: "rew_free",
            object_notes: "reward_2",
        });
        FrameSDK.frameData.sdkFuc.ppEvent("freeClaim");
        ((hasCharity: boolean) => {
            let charityNum = 0;
            let charityFlag = 0;
            if (hasCharity) {
                charityNum = FrameData.getCharityOutNum();
                charityFlag = 1;
            }
            FrameSDK.addCoin(freeCoin, charityNum, charityFlag, this.viewData?.closeCB);
            FrameSDK.frameData.sdkFuc.ppEvent("freeCollected");
            this.close();
        })(false);
    }

    close(callback: () => void = null): void {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, callback);
        }
    }
}
