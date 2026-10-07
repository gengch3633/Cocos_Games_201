import Frame from "./Frame";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CashFishCredit extends cc.Component {
    static _targets: cc.Node[] = [];

    @property(cc.Label)
    creditNum: cc.Label = null;

    @property(cc.Node)
    addNode: cc.Node = null;

    @property(cc.Label)
    addNum: cc.Label = null;

    @property
    typs: string = "yellowCoin";

    @property
    prefix: string = "";

    data: { num: number } = { num: 0 };

    updatecredit(e: { type: string; change: number; num: number }): void {
        if (e.type == this.typs && cc.isValid(this.addNode)) {
            const convertFn = this.typs === "yellowCoin" ? FrameSDK.convertCoinToStr : FrameSDK.convertCharityToStr;
            cc.Tween.stopAllByTarget(this.data);
            if (e.change > 0) {
                this.addNode.active = true;
                this.addNode.scale = 0;
                this.addNum.string = "+" + convertFn.call(FrameSDK, e.change);
                cc.tween(this.addNode).to(0.1, { scale: 1 }).start();
            }
            cc.tween(this.data)
                .to(0.5, { num: e.num }, {
                    progress: (start, end, _current, ratio) => {
                        const val = start + (end - start) * ratio;
                        if (cc.isValid(this.node)) {
                            this.updatecreditString(val);
                        }
                        return val;
                    }
                })
                .call(() => {
                    if (cc.isValid(this.node)) {
                        this.data.num = e.num;
                        this.addNode.active = false;
                        this.updatecreditString(this.data.num);
                    }
                })
                .start();
        }
    }

    static getTarget(type: string): cc.Node {
        if (this._targets.length == 1) {
            return this._targets[0];
        }
        for (let i = this._targets.length - 1; i >= 0; i--) {
            if (this._targets[i].getComponent(CashFishCredit).typs == type) {
                const rect = this._targets[i].getBoundingBoxToWorld();
                if (cc.rect(0, 0, cc.winSize.width, cc.winSize.height).containsRect(rect)) {
                    return this._targets[i];
                }
            }
        }
        return this._targets[this._targets.length - 1] || this._targets[this._targets.length - 1];
    }

    openRedeem(): void {
        if (this.typs == "yellowCoin") {
            FrameSDK.openPanel_Yellow();
            if (FrameData.saveData.guideInedx == 0) {
                FrameData.saveData.guideInedx++;
                Frame.ins.setGuideShow(false);
            }
        } else {
            FrameSDK.openPanel_Charity();
            if (FrameData.saveData.charityGuideIndex == 0) {
                FrameData.saveData.charityGuideIndex++;
                Frame.ins.setGuide2Show(false);
            }
        }
    }

    onDestroy(): void {
        cc.director.removeAll(this);
        CashFishCredit._targets.splice(CashFishCredit._targets.indexOf(this.node), 1);
    }

    onLoad(): void {
        cc.director.on("UNLOCK_CHARITY", this._onUnlockCharity, this);
        if (this.creditNum == null) {
            this.creditNum = this.getComponent(cc.Label) || this.getComponentInChildren(cc.Label);
        }
        if (this.addNode) {
            this.addNode.active = false;
        }
        this.data.num = FrameData.saveData.credit[this.typs];
        this.updatecreditString();
        FrameSDK.addCreditListen(this.updatecredit, this);
        CashFishCredit._targets.push(this.node);
        this.updateUI();
    }

    getcreditString(num: number): string {
        const str = this.typs === "yellowCoin" ? FrameSDK.convertCoinToStr(num) : FrameSDK.convertCharityToStr(num);
        return this.prefix + str;
    }

    static isUnlocked(type: string): boolean {
        if (type === "yellowCoin") {
            return true;
        }
        if (type === "greenCoin") {
            return !FrameSDK.frameData.gameData.noProfitAd
                && FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.charityLevel
                && FrameData.saveData.charityGuideIndex > 0;
        }
        return undefined;
    }

    updateUI(): void {
        const scene = FrameSDK.frameData.gameData.currentScene;
        this.node.active = (scene === "home" || scene === "game") && CashFishCredit.isUnlocked(this.typs);
    }

    _onUnlockCharity(): void {
        if (this.typs !== "greenCoin" || FrameSDK.frameData.gameData.noProfitAd) {
            return;
        }
        this.node.active = true;
    }

    updatecreditString(num?: number): void {
        num = num == null ? this.data.num : num;
        this.creditNum.string = this.getcreditString(num);
    }
}
