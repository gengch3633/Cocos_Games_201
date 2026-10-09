import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import Panel_Activity from "./Panel_Activity";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Button_Activity extends cc.Component {

    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(cc.RichText)
    progressRichText: cc.RichText = null;

    @property(cc.Node)
    point: cc.Node = null;

    @property(cc.Node)
    addNode: cc.Node = null;

    @property(cc.Node)
    but: cc.Node = null;

    _buttonOriginalPositionY: number = 0;

    onLoad() {
        this._buttonOriginalPositionY = this.but.position.y;
        this.addNode.active = false;
        Panel_Activity.coinTarget = this.but;
        cc.director.on("UPDATA_ACTIVITY", this.updateUI, this);
        cc.director.on("UPDATA_ACTIVITY_COIN", this.updateCoin, this);
        this.titleLabel.string = FrameSDK.convertCoinToStr(FrameData.FRAME_CONF.PiggyConfig.num, true);
        this.updateUI();
    }

    updateCoin(change: number, from: number, to: number) {
        const self = this;
        this.addNode.active = true;
        this.addNode.getComponentInChildren(cc.Label).string = "+" + FrameSDK.convertCoinToStr(change);
        this.addNode.stopAllActions();
        this.addNode.opacity = 255;
        this.addNode.y = 0;
        cc.Tween.stopAllByTarget(this.addNode);
        cc.tween(this.addNode).to(1, {
            y: 25
        }, {
            onUpdate: function (target, ratio) {
                self._updateProgress(cc.misc.lerp(from, to, ratio));
            }
        }).call(function () {
            self._updateProgress(to);
        }).to(0.5, {
            opacity: 0
        }).call(function () {
            self.addNode.active = false;
            self.point.opacity = Panel_Activity.isAcitiviyClaimable() ? 255 : 0;
        }).start();
    }

    _updateProgress(value: number) {
        this.progressRichText.string = "<outline color= #9C22C5 width=2><color=#86FF04>" + FrameSDK.convertCoinToStr(value) + "</c>/" + FrameSDK.convertCoinToStr(FrameData.FRAME_CONF.PiggyConfig.num) + "</outline>";
    }

    onDestroy() {
        cc.director.removeAll(this);
    }

    updateUI() {
        const scene = FrameSDK.frameData.gameData.currentScene;
        const activity = FrameData.saveData.activity;
        this.but.setPosition(0, this._buttonOriginalPositionY + ("game" === scene ? 107 : 0));
        this.but.scale = "game" === scene ? 0.8 : 1;
        if (activity) {
            this.but.opacity = "home" === scene || "game" === scene ? 255 : 0;
            this.progressRichText.node.parent.active = Panel_Activity.isActivityCollectable() || Panel_Activity.isAcitiviyClaimable();
            this._updateProgress(activity.coin);
            this.point.opacity = Panel_Activity.isAcitiviyClaimable() ? 255 : 0;
        } else {
            this.but.opacity = 0;
            this.point.opacity = 0;
        }
    }

    @CLICKLOCK()
    onBtnEvent() {
        Panel_Activity.startActivity();
    }
}
