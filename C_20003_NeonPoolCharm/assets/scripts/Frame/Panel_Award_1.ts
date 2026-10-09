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

    onLoad() {
        const self = this;
        this.adBannerButton.on(cc.Node.EventType.TOUCH_END, function () {
            self.click_AD();
        }, this);
        this.commonActionButton.on(cc.Node.EventType.TOUCH_END, function () {
            self.click_Common();
        });
        const delay = FrameSDK.getNoAdDelayTime();
        if (null != delay && delay >= 0) {
            this.commonActionButton.getComponent(AinanEff).dtime += delay;
        }
    }

    onEnable() {
        this.adData = FrameData.getOutputConfig(true);
        this.getYCoin = FrameData.getCoinOutNum("ad");
        const freeCoin = FrameData.getCoinOutNum("free");
        FrameSDK.logCommonEvent("c_ad_event", {
            action: "exposure",
            type: "video",
            placement: "reward_2"
        });
        FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "show",
            object_name: "rew_show",
            object_notes: "reward_2"
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
        this.multiplierDisplay.children.forEach(function (child) {
            cc.Tween.stopAllByTarget(child);
            child.scale = 0;
        });
        const coinText = FrameSDK.convertCoinToStr(this.getYCoin);
        this.baseCoinLabel.string = coinText;
        this.maxCoinLabel.string = FrameSDK.convertCoinToStr(this.getYCoin * this.adData.displayRange[1]);
        this.finalCoinLabel.string = coinText;
        this.finalCoinNode.opacity = 0;
        this.adFrequencyCounter.string = "x" + this.adData.displayRange[0] + "~" + this.adData.displayRange[1];
        this.noAdBadgeIcon.active = this.adData.isFree;
        this.adBadgeIcon.active = !this.adData.isFree;
        this.commonActionButton.active = this.adBadgeIcon.active;
        this.commonActionButton.getComponentInChildren(cc.Label).string = "skey_034 " + FrameSDK.convertCoinToStr(freeCoin);
        this.ribbonSkeleton.enabled = false;
    }

    @CLICKLOCK()
    click_AD() {
        const self = this;
        FrameSDK.frameData.sdkFuc.ppEvent(this.adData.isFree ? "freeClaim" : "claim");
        FrameSDK.logCommonEvent("c_ad_event", {
            action: "touch",
            type: "video",
            placement: "reward_2"
        });
        FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "show",
            object_name: "rew_ad",
            object_notes: "reward_2"
        });
        const play = function (success: boolean) {
            self.multiplierDisplay.active = true;
            cc.Tween.stopAllByTarget(self.multiplierDisplay);
            const matched = {};
            const min = self.adData.displayRange[0];
            self.multiplierDisplay.children.forEach(function (child) {
                const value = Number(child.name);
                child.scale = 0;
                if (!isNaN(value) && value >= min && value <= self.adData.ml) {
                    matched[value] = child;
                    cc.Tween.stopAllByTarget(child);
                }
            });
            const keys = Object.keys(matched).map(function (key) {
                return Number(key);
            }).sort(function (a, b) {
                return a - b;
            });
            let gap = 0.1;
            let duration = 0.2 * (keys.length - 1) + gap;
            if (keys.length <= 0) {
                duration = 0;
            } else if (duration > 2) {
                gap = Math.max(0.1, duration - 0.2 * (keys.length - 1));
                duration = 0.2 * (keys.length - 1) + gap;
            }
            const finalCoin = self.getYCoin * self.adData.ml;
            let charity = 0;
            let charityFlag = 0;
            if (!self.adData.isFree && success) {
                charity = FrameData.getCharityOutNum();
                charityFlag = 1;
            }
            cc.Tween.stopAllByTarget(self.baseCoinNode);
            cc.tween(self.baseCoinNode).to(0.1, {
                x: self.baseCoinNode.x - 200,
                opacity: 0
            }).start();
            cc.Tween.stopAllByTarget(self.maxCoinNode);
            cc.tween(self.maxCoinNode).to(0.1, {
                x: self.maxCoinNode.x + 200,
                opacity: 0
            }).start();
            cc.Tween.stopAllByTarget(self.arrowNode);
            cc.tween(self.arrowNode).to(0.1, {
                opacity: 0
            }).start();
            cc.Tween.stopAllByTarget(self.finalCoinNode);
            cc.tween(self.finalCoinNode).to(0.1, {
                opacity: 255
            }).to(duration + 0.2, {}, {
                onUpdate: function (target, ratio) {
                    self.finalCoinLabel.string = FrameSDK.convertCoinToStr(self.getYCoin + (finalCoin - self.getYCoin) * ratio);
                }
            }).call(function () {
                return self.finalCoinLabel.string = FrameSDK.convertCoinToStr(finalCoin);
            }).start();
            keys.forEach(function (key, index) {
                const node = matched[key];
                node.scale = 0;
                cc.tween(node).delay(0.1 + 0.2 * index).set({
                    scale: 1
                }).to(0.2, {
                    scale: 3
                }).to(0.1, {
                    scale: 1
                }).call(function () {
                    return FrameSDK.playEffect("rate_show");
                }).start();
            });
            cc.tween(self.multiplierDisplay).delay(0.1 + duration + 0.2).call(function () {
                self.ribbonSkeleton.enabled = true;
                self.ribbonSkeleton.setAnimation(0, "caidai", false);
                FrameSDK.playEffect("pool_cashdone");
            }).delay(1).call(function () {
                const closeCB = self.viewData != null ? self.viewData.closeCB : undefined;
                FrameSDK.addCoin(finalCoin, charity, charityFlag, closeCB);
                FrameSDK.frameData.sdkFuc.ppEvent(self.adData.isFree ? "freeCollected" : "collected");
                self.close();
            }).start();
        };
        this.noTouch.node.active = true;
        if (this.adData.isFree) {
            play(false);
        } else {
            FrameSDK.openVideo("reward_2", false, function (adType) {
                FrameSDK.logGameEvent("thepool_game_ad", {
                    object_action: "show",
                    object_name: "reward_2",
                    object_notes: "video" === adType ? "video" : "web" === adType ? "web" : "inter"
                });
            }, function (success) {
                return play(success);
            }, function () {
                return self.noTouch.node.active = false;
            }, {
                reward: this.getYCoin * this.adData.displayRange[1],
                isMax: true
            });
        }
    }

    @CLICKLOCK()
    click_Common() {
        const self = this;
        this.noTouch.node.active = true;
        const freeCoin = FrameData.getCoinOutNum("free");
        FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "show",
            object_name: "rew_free",
            object_notes: "reward_2"
        });
        FrameSDK.frameData.sdkFuc.ppEvent("freeClaim");
        (function (success: boolean) {
            let charity = 0;
            let charityFlag = 0;
            if (success) {
                charity = FrameData.getCharityOutNum();
                charityFlag = 1;
            }
            const closeCB = self.viewData != null ? self.viewData.closeCB : undefined;
            FrameSDK.addCoin(freeCoin, charity, charityFlag, closeCB);
            FrameSDK.frameData.sdkFuc.ppEvent("freeCollected");
            self.close();
        })(false);
    }

    close(callback: any = null) {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, callback);
        }
    }
}
