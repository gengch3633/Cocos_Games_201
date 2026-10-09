import Frame from "./Frame";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CashFishCredit extends cc.Component {

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

    data = {
        num: 0
    };

    static _targets: cc.Node[] = [];

    updatecredit(e: any) {
        const self = this;
        if (e.type == this.typs && cc.isValid(this.addNode)) {
            const format = "yellowCoin" === e.type ? FrameSDK.convertCoinToStr : FrameSDK.convertCharityToStr;
            cc.Tween.stopAllByTarget(this.data);
            if (e.change > 0) {
                this.addNode.active = true;
                this.addNode.scale = 0;
                this.addNum.string = "+" + format.call(FrameSDK, e.change);
                cc.tween(this.addNode).to(0.1, {
                    scale: 1
                }).start();
            }
            cc.tween(this.data).to(0.5, {
                num: e.num
            }, {
                progress: function (start, end, current, ratio) {
                    const value = start + (end - start) * ratio;
                    if (cc.isValid(self.node)) {
                        self.updatecreditString(value);
                    }
                    return value;
                }
            }).call(function () {
                if (cc.isValid(self.node)) {
                    self.data.num = e.num;
                    self.addNode.active = false;
                    self.updatecreditString(self.data.num);
                }
            }).start();
        }
    }

    static getTarget(type: string) {
        if (1 == this._targets.length) {
            return this._targets[0];
        }
        for (let i = this._targets.length - 1; i >= 0; i--) {
            if (this._targets[i].getComponent(CashFishCredit).typs == type) {
                const box = this._targets[i].getBoundingBoxToWorld();
                if (cc.rect(0, 0, cc.winSize.width, cc.winSize.height).containsRect(box)) {
                    return this._targets[i];
                }
            }
        }
        return this._targets[this._targets.length - 1] || this._targets[this._targets.length - 1];
    }

    openRedeem() {
        if ("yellowCoin" == this.typs) {
            FrameSDK.openPanel_Yellow();
            if (0 == FrameData.saveData.guideInedx) {
                FrameData.saveData.guideInedx++;
                Frame.ins.setGuideShow(false);
            }
        } else {
            FrameSDK.openPanel_Charity();
            if (0 == FrameData.saveData.charityGuideIndex) {
                FrameData.saveData.charityGuideIndex++;
                Frame.ins.setGuide2Show(false);
            }
        }
    }

    onDestroy() {
        cc.director.removeAll(this);
        CashFishCredit._targets.splice(CashFishCredit._targets.indexOf(this.node), 1);
    }

    onLoad() {
        cc.director.on("UNLOCK_CHARITY", this._onUnlockCharity, this);
        if (null == this.creditNum) {
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

    getcreditString(value: number) {
        const text = "yellowCoin" === this.typs ? FrameSDK.convertCoinToStr(value) : FrameSDK.convertCharityToStr(value);
        return this.prefix + text;
    }

    static isUnlocked(type: string) {
        return "yellowCoin" === type || ("greenCoin" === type ? !FrameSDK.frameData.gameData.noProfitAd && FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.charityLevel && FrameData.saveData.charityGuideIndex > 0 : undefined);
    }

    updateUI() {
        const scene = FrameSDK.frameData.gameData.currentScene;
        this.node.active = ("home" === scene || "game" === scene) && CashFishCredit.isUnlocked(this.typs);
    }

    _onUnlockCharity() {
        if ("greenCoin" !== this.typs || FrameSDK.frameData.gameData.noProfitAd) {
            return;
        }
        this.node.active = true;
    }

    updatecreditString(value?: number) {
        value = null == value ? this.data.num : value;
        this.creditNum.string = this.getcreditString(value);
    }
}
