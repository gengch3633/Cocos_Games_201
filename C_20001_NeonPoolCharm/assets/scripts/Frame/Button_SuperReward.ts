import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import Panel_SuperReward from "./Panel_SuperReward";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Button_SuperReward extends cc.Component {
    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(cc.Node)
    point: cc.Node = null;

    @property(cc.Node)
    but: cc.Node = null;

    _buttonOriginalPositionY: number = 0;

    onLoad(): void {
        this._buttonOriginalPositionY = this.but.position.y;
        cc.director.on("UPDATA_SUPER_REWARD", this.updateUI, this);
        Panel_SuperReward.coinTarget = this.but;
        this.titleLabel.string = FrameSDK.convertCoinToStr(FrameData.FRAME_CONF.SuperRewardConfig.extraRewardDisplay, true);
        this.updateUI();
    }

    onDestroy(): void {
        cc.director.removeAll(this);
    }

    updateUI(): void {
        this.node.scale = FrameSDK.frameData.gameData.noProfitAd || !FrameData.FRAME_CONF.superRewardEnabled ? 0 : 1;
        const scene = FrameSDK.frameData.gameData.currentScene;
        const superReward = FrameData.saveData.superReward;
        this.but.setPosition(0, this._buttonOriginalPositionY + (scene === "game" ? 282 : 0));
        this.but.scale = scene === "game" ? 0.8 : 1;
        if (superReward) {
            this.but.opacity = scene === "home" || scene === "game" ? 255 : 0;
            this.point.opacity = Panel_SuperReward.hasTaskOrReward() ? 255 : 0;
        } else {
            this.but.opacity = 0;
            this.point.opacity = 0;
        }
    }

    @CLICKLOCK()
    onBtnEvent(): void {
        Panel_SuperReward.startSuperReward();
    }
}
