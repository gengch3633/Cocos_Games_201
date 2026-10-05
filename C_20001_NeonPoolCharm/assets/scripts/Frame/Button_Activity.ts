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

    private _buttonOriginalPositionY: number = 0;

    onLoad(): void {
        this._buttonOriginalPositionY = this.but.position.y;
        this.addNode.active = false;
        Panel_Activity.coinTarget = this.but;
        cc.director.on("UPDATA_ACTIVITY", this.updateUI, this);
        cc.director.on("UPDATA_ACTIVITY_COIN", this.updateCoin, this);
        this.titleLabel.string = FrameSDK.convertCoinToStr(FrameData.FRAME_CONF.PiggyConfig.num, true);
        this.updateUI();
    }

    updateCoin(amount: number, from: number, to: number): void {
        this.addNode.active = true;
        this.addNode.getComponentInChildren(cc.Label).string = "+" + FrameSDK.convertCoinToStr(amount);
        this.addNode.stopAllActions();
        this.addNode.opacity = 255;
        this.addNode.y = 0;
        cc.Tween.stopAllByTarget(this.addNode);
        cc.tween(this.addNode)
            .to(1, { y: 25 }, {
                onUpdate: (_target: cc.Node, ratio: number) => {
                    this._updateProgress(cc.misc.lerp(from, to, ratio));
                },
            })
            .call(() => {
                this._updateProgress(to);
            })
            .to(0.5, { opacity: 0 })
            .call(() => {
                this.addNode.active = false;
                this.point.opacity = Panel_Activity.isAcitiviyClaimable() ? 255 : 0;
            })
            .start();
    }

    _updateProgress(value: number): void {
        this.progressRichText.string =
            "<outline color= #9C22C5 width=2><color=#86FF04>" +
            FrameSDK.convertCoinToStr(value) +
            "</c>/" +
            FrameSDK.convertCoinToStr(FrameData.FRAME_CONF.PiggyConfig.num) +
            "</outline>";
    }

    onDestroy(): void {
        cc.director.removeAll(this);
    }

    updateUI(): void {
        const scene = FrameSDK.frameData.gameData.currentScene;
        const activity = FrameData.saveData.activity;
        this.but.setPosition(0, this._buttonOriginalPositionY + (scene === "game" ? 107 : 0));
        this.but.scale = scene === "game" ? 0.8 : 1;
        if (activity) {
            this.but.opacity = scene === "home" || scene === "game" ? 255 : 0;
            this.progressRichText.node.parent.active =
                Panel_Activity.isActivityCollectable() || Panel_Activity.isAcitiviyClaimable();
            this._updateProgress(activity.coin);
            this.point.opacity = Panel_Activity.isAcitiviyClaimable() ? 255 : 0;
        } else {
            this.but.opacity = 0;
            this.point.opacity = 0;
        }
    }

    @CLICKLOCK()
    onBtnEvent(): void {
        Panel_Activity.startActivity();
    }
}
