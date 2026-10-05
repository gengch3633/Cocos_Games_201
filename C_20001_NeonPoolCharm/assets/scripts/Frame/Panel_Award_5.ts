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

    @property([cc.Label])
    boxBonusLabels: cc.Label[] = [];

    @property(cc.Node)
    homeButtonNode: cc.Node = null;

    @property(cc.Node)
    continueButtonNode: cc.Node = null;

    viewData: any = null;
    isTouch: boolean = true;
    numRanking: { [key: number]: number } = {};
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
            this.viewData.closeCB?.("continue");
        }
    }

    onLoad(): void {
        if (
            FrameData.saveData.award5 == null ||
            Object.keys(FrameData.saveData.award5.open).length >= FrameData.saveData.award5.numList.length
        ) {
            const numList: number[] = [];
            const fixed = FrameData.getCoinOutNum("boxFixed");
            if (fixed && Array.isArray(fixed) && fixed.length >= 3) {
                numList.push(...fixed);
                numList.sort(() => Math.random() - 0.5);
            } else {
                const randomRange = FrameData.getCoinOutNum("boxRandom");
                for (let i = 0; i < 3; i++) {
                    numList[i] = FrameSDK.randomInt(randomRange);
                }
            }
            FrameData.saveData.award5 = {
                numList,
                reward: FrameData.getCoinOutNum("superAd"),
                open: {},
            };
        }
    }

    openBox(index: number): void {
        if (!FrameData.saveData.award5.open[index] && this.isTouch) {
            this.isTouch = false;
            FrameSDK.frameData.sdkFuc.ppEvent("freeClaim");
            FrameData.saveData.award5.open[index] = 1;
            if (Object.keys(FrameData.saveData.award5.open).length >= FrameData.saveData.award5.numList.length) {
                cc.director.emit("SUPER_AWARD", "show");
            }
            const bonus = FrameData.saveData.award5.numList[index];
            const boxNode = this.boxNode.children[index];
            const skeleton = boxNode.getComponent(sp.Skeleton);
            skeleton.setAnimation(0, "step" + this.numRanking[bonus] + "_4", false);
            skeleton.addAnimation(0, "step" + this.numRanking[bonus] + "_5", true);
            FrameSDK.playEffect("pool_zhuanpan");
            cc.Tween.stopAllByTarget(boxNode);
            cc.tween(boxNode)
                .delay(0.7)
                .call(() => FrameSDK.playEffect("done_coin_arrange"))
                .delay(1.2)
                .call(() => {
                    this.boxBonusLabels[index].node.parent.active = true;
                    this.boxBonusLabels[index].string = "" + FrameSDK.convertCoinToStr(bonus);
                    this.viewData.unlockCountUpdateFunc?.(Object.keys(FrameData.saveData.award5.open).length);
                    FrameSDK.logGameEvent("thepool_game_new", { object_action: "show", object_name: "new_16" }, true);
                    FrameSDK.frameData.sdkFuc.ppEvent("freeCollected");
                    if (Object.keys(FrameData.saveData.award5.open).length >= FrameData.saveData.award5.numList.length) {
                        const panelName = this.viewData.superExternalNode ? "Panel_Award_Super2" : "Panel_Award_Super1";
                        const viewData = {
                            bonus: FrameData.saveData.award5.reward,
                            freeBonus: FrameData.getCoinOutNum("superFree"),
                            externalNode: this.viewData.superExternalNode,
                            param: this.viewData.param,
                            closeCB: () => this._showButtons(),
                        };
                        FrameData.saveData.award5 = null;
                        FrameSDK.addCoin(bonus, 0, 0, () => {
                            FrameSDK.openWindow(panelName, viewData);
                        });
                    } else {
                        FrameSDK.addCoin(bonus, 0, 0, () => this._showButtons());
                    }
                })
                .start();
        }
    }

    _showButtons(): void {
        FrameSDK.openRating(() => {
            if (FrameSDK.hasPopUp()) {
                this.onTouchCloseTips();
                this.viewData.closeCB?.("home");
            } else {
                cc.Tween.stopAllByTarget(this.homeButtonNode);
                cc.tween(this.homeButtonNode)
                    .delay(0)
                    .set({ scale: 0.2 })
                    .to(0.4, { scale: 1 }, { easing: "backOut" })
                    .start();
                cc.Tween.stopAllByTarget(this.continueButtonNode);
                cc.tween(this.continueButtonNode)
                    .delay(0.1)
                    .set({ scale: 0.2 })
                    .to(0.4, { scale: 1 }, { easing: "backOut" })
                    .call(() => {
                        this.isTouch = true;
                    })
                    .start();
            }
        });
    }

    @CLICKLOCK()
    click_Common(): void {}

    onEnable(): void {
        FrameSDK.openEffect(this);
        FrameSDK.playEffect("rewardshow");
        FrameSDK.logGameEvent("thepool_game_new", { object_action: "show", object_name: "new_15" }, true);
        const award5 = FrameData.saveData.award5;
        const reward = award5.reward;
        JSON.parse(JSON.stringify(award5.numList))
            .sort((a: number, b: number) => a - b)
            .forEach((value: number, index: number) => {
                this.numRanking[value] = index + 1;
            });
        FrameSDK.frameData.sdkFuc.ppEvent("freeShow");
        this.tipsRichText.string =
            'skey_063??&value1==<img src="dollar3" offset=-6/> <size=46><color = #FDE829>' +
            FrameSDK.convertCoinToStr(reward) +
            "</c></size>";
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
        const unopenedIndices: number[] = [];
        this.boxNode.children.forEach((child, index) => {
            cc.Tween.stopAllByTarget(child);
            const opened = award5.open[index];
            const bonus = award5.numList[index];
            if (opened) {
                child.getComponent(sp.Skeleton).setAnimation(0, "step" + this.numRanking[bonus] + "_5", true);
                this.boxBonusLabels[index].node.parent.active = true;
                this.boxBonusLabels[index].string = "" + FrameSDK.convertCoinToStr(bonus);
            } else {
                unopenedIndices.push(index);
                child.getComponent(sp.Skeleton).setAnimation(0, "step3", true);
                this.boxBonusLabels[index].node.parent.active = false;
                this.boxBonusLabels[index].string = "";
            }
        });
        this.viewData.unlockCountUpdateFunc?.(Object.keys(FrameData.saveData.award5.open).length);
        this.homeButtonNode.scale = 0;
        this.continueButtonNode.scale = 0;
        cc.Tween.stopAllByTarget(this.homeButtonNode);
        cc.Tween.stopAllByTarget(this.continueButtonNode);
        this.scheduleOnce(() => {
            if (unopenedIndices.length <= 0) {
                this._showButtons();
            } else {
                const randomIndex = unopenedIndices[Math.floor(Math.random() * unopenedIndices.length)];
                this.openBox(randomIndex);
            }
        }, 0.5);
    }

    @CLICKLOCK()
    click_home(): void {
        if (this.isTouch) {
            this.isTouch = false;
            this.onTouchCloseTips();
            this.viewData.closeCB?.("home");
        }
    }
}
