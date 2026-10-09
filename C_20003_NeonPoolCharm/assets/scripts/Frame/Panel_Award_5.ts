import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Award_5 extends cc.Component {
    @property(cc.Node)
    panel_window: cc.Node = null;

    @property(cc.RichText)
    tipsRichText: cc.RichText = null;

    @property(cc.Layout)
    layout: cc.Layout = null;

    @property(cc.Node)
    externalRootNode: cc.Node = null;

    @property(cc.Node)
    boxNode: cc.Node = null;

    @property(cc.Label)
    boxBonusLabels: cc.Label[] = [];

    @property(cc.Node)
    homeButtonNode: cc.Node = null;

    @property(cc.Node)
    continueButtonNode: cc.Node = null;

    viewData: any = null;
    isTouch: boolean = true;
    numRanking: any = {};
    hideTime: number = 0;

    onTouchCloseTips(): void {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, null);
        }
    }

    @CLICKLOCK()
    click_continue(): void {
        if (this.isTouch) {
            this.isTouch = false;
            this.onTouchCloseTips();
            const viewData = this.viewData;
            const closeCB = viewData.closeCB;
            if (closeCB != null) {
                closeCB.call(viewData, "continue");
            }
        }
    }

    onLoad(): void {
        if (FrameData.saveData.award5 == null || Object.keys(FrameData.saveData.award5.open).length >= FrameData.saveData.award5.numList.length) {
            const numList = [];
            const boxFixed = FrameData.getCoinOutNum("boxFixed");
            if (boxFixed && Array.isArray(boxFixed) && boxFixed.length >= 3) {
                numList.push.apply(numList, boxFixed);
                numList.sort(() => {
                    return Math.random() - 0.5;
                });
            } else {
                const boxRandom = FrameData.getCoinOutNum("boxRandom");
                for (let o = 0; o < 3; o++) {
                    numList[o] = FrameSDK.randomInt(boxRandom);
                }
            }
            FrameData.saveData.award5 = {
                numList: numList,
                reward: FrameData.getCoinOutNum("superAd"),
                open: {}
            };
        }
    }

    openBox(e): void {
        if (!FrameData.saveData.award5.open[e] && this.isTouch) {
            this.isTouch = false;
            FrameSDK.frameData.sdkFuc.ppEvent("freeClaim");
            FrameData.saveData.award5.open[e] = 1;
            if (Object.keys(FrameData.saveData.award5.open).length >= FrameData.saveData.award5.numList.length) {
                cc.director.emit("SUPER_AWARD", "show");
            }
            const bonus = FrameData.saveData.award5.numList[e];
            const box = this.boxNode.children[e];
            const skeleton = box.getComponent(sp.Skeleton);
            skeleton.setAnimation(0, "step" + this.numRanking[bonus] + "_4", false);
            skeleton.addAnimation(0, "step" + this.numRanking[bonus] + "_5", true);
            FrameSDK.playEffect("pool_zhuanpan");
            cc.Tween.stopAllByTarget(box);
            cc.tween(box).delay(0.7).call(() => {
                return FrameSDK.playEffect("done_coin_arrange");
            }).delay(1.2).call(() => {
                this.boxBonusLabels[e].node.parent.active = true;
                this.boxBonusLabels[e].string = "" + FrameSDK.convertCoinToStr(bonus);
                const viewData = this.viewData;
                const unlockCountUpdateFunc = viewData.unlockCountUpdateFunc;
                if (unlockCountUpdateFunc != null) {
                    unlockCountUpdateFunc.call(viewData, Object.keys(FrameData.saveData.award5.open).length);
                }
                FrameSDK.logGameEvent("thepool_game_new", {
                    object_action: "show",
                    object_name: "new_16"
                }, true);
                FrameSDK.frameData.sdkFuc.ppEvent("freeCollected");
                if (Object.keys(FrameData.saveData.award5.open).length >= FrameData.saveData.award5.numList.length) {
                    const windowName = this.viewData.superExternalNode ? "Panel_Award_Super2" : "Panel_Award_Super1";
                    const windowData = {
                        bonus: FrameData.saveData.award5.reward,
                        freeBonus: FrameData.getCoinOutNum("superFree"),
                        externalNode: this.viewData.superExternalNode,
                        param: this.viewData.param,
                        closeCB: () => {
                            return this._showButtons();
                        }
                    };
                    FrameData.saveData.award5 = null;
                    FrameSDK.addCoin(bonus, 0, 0, () => {
                        FrameSDK.openWindow(windowName, windowData);
                    });
                } else {
                    FrameSDK.addCoin(bonus, 0, 0, () => {
                        return this._showButtons();
                    });
                }
            }).start();
        }
    }

    _showButtons(): void {
        FrameSDK.openRating(() => {
            if (FrameSDK.hasPopUp()) {
                this.onTouchCloseTips();
                const viewData = this.viewData;
                const closeCB = viewData.closeCB;
                if (closeCB != null) {
                    closeCB.call(viewData, "home");
                }
            } else {
                cc.Tween.stopAllByTarget(this.homeButtonNode);
                cc.tween(this.homeButtonNode).delay(0).set({
                    scale: 0.2
                }).to(0.4, {
                    scale: 1
                }, {
                    easing: "backOut"
                }).start();
                cc.Tween.stopAllByTarget(this.continueButtonNode);
                cc.tween(this.continueButtonNode).delay(0.1).set({
                    scale: 0.2
                }).to(0.4, {
                    scale: 1
                }, {
                    easing: "backOut"
                }).call(() => {
                    this.isTouch = true;
                }).start();
            }
        });
    }

    @CLICKLOCK()
    click_Common(): void {}

    onEnable(): void {
        FrameSDK.openEffect(this);
        FrameSDK.playEffect("rewardshow");
        FrameSDK.logGameEvent("thepool_game_new", {
            object_action: "show",
            object_name: "new_15"
        }, true);
        const award5 = FrameData.saveData.award5;
        const reward = award5.reward;
        JSON.parse(JSON.stringify(award5.numList)).sort((e, t) => {
            return e - t;
        }).forEach((e, t) => {
            this.numRanking[e] = t + 1;
        });
        FrameSDK.frameData.sdkFuc.ppEvent("freeShow");
        this.tipsRichText.string = 'skey_063??&value1==<img src="dollar3" offset=-6/> <size=46><color = #FDE829>' + FrameSDK.convertCoinToStr(reward) + "</c></size>";
        this.externalRootNode.removeAllChildren();
        if (this.viewData.externalNode) {
            this.externalRootNode.addChild(this.viewData.externalNode);
            this.externalRootNode.active = true;
            this.layout.paddingTop = 40;
            this.layout.spacingY = 40;
        } else {
            this.externalRootNode.active = false;
            this.layout.paddingTop = 120;
            this.layout.spacingY = 120;
        }
        const closedIndexes = [];
        this.boxNode.children.forEach((child, t) => {
            cc.Tween.stopAllByTarget(child);
            const opened = award5.open[t];
            const bonus = award5.numList[t];
            if (opened) {
                child.getComponent(sp.Skeleton).setAnimation(0, "step" + this.numRanking[bonus] + "_5", true);
                this.boxBonusLabels[t].node.parent.active = true;
                this.boxBonusLabels[t].string = "" + FrameSDK.convertCoinToStr(bonus);
            } else {
                closedIndexes.push(t);
                child.getComponent(sp.Skeleton).setAnimation(0, "step3", true);
                this.boxBonusLabels[t].node.parent.active = false;
                this.boxBonusLabels[t].string = "";
            }
        });
        const viewData = this.viewData;
        const unlockCountUpdateFunc = viewData.unlockCountUpdateFunc;
        if (unlockCountUpdateFunc != null) {
            unlockCountUpdateFunc.call(viewData, Object.keys(FrameData.saveData.award5.open).length);
        }
        this.homeButtonNode.scale = 0;
        this.continueButtonNode.scale = 0;
        cc.Tween.stopAllByTarget(this.homeButtonNode);
        cc.Tween.stopAllByTarget(this.continueButtonNode);
        this.scheduleOnce(() => {
            if (closedIndexes.length <= 0) {
                this._showButtons();
            } else {
                const index = closedIndexes[Math.floor(Math.random() * closedIndexes.length)];
                this.openBox(index);
            }
        }, 0.5);
    }

    @CLICKLOCK()
    click_home(): void {
        if (this.isTouch) {
            this.isTouch = false;
            this.onTouchCloseTips();
            const viewData = this.viewData;
            const closeCB = viewData.closeCB;
            if (closeCB != null) {
                closeCB.call(viewData, "home");
            }
        }
    }
}
