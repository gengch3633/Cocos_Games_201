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

    onLoad() {
        this._buttonOriginalPositionY = this.but.position.y;
        cc.director.on("UPDATA_SUPER_REWARD", this.updateUI, this);
        Panel_SuperReward.coinTarget = this.but;
        this.titleLabel.string = FrameSDK.convertCoinToStr(FrameData.FRAME_CONF.SuperRewardConfig.extraRewardDisplay, true);
        this.updateUI();
    }

    onDestroy() {
        cc.director.removeAll(this);
    }

    updateUI() {
        this.node.scale = FrameSDK.frameData.gameData.noProfitAd || !FrameData.FRAME_CONF.superRewardEnabled ? 0 : 1;
        const scene = FrameSDK.frameData.gameData.currentScene;
        const superReward = FrameData.saveData.superReward;
        this.but.setPosition(0, this._buttonOriginalPositionY + ("game" === scene ? 282 : 0));
        this.but.scale = "game" === scene ? 0.8 : 1;
        if (superReward) {
            this.but.opacity = "home" === scene || "game" === scene ? 255 : 0;
            this.point.opacity = Panel_SuperReward.hasTaskOrReward() ? 255 : 0;
        } else {
            this.but.opacity = 0;
            this.point.opacity = 0;
        }
    }

    @CLICKLOCK()
    onBtnEvent() {
        Panel_SuperReward.startSuperReward();
    }
}
