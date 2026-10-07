import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import Panel_Task from "./Panel_Task";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Button_Task extends cc.Component {
    @property(cc.Node)
    point: cc.Node = null;

    @property(cc.Node)
    but: cc.Node = null;

    onLoad(): void {
        cc.director.on("UPDATA_LEVEL", this.updateUI, this);
        cc.director.on("UPDATA_TASK", this.updateUI, this);
        Panel_Task.coinTarget = this.but;
        this.updateUI();
    }

    @CLICKLOCK()
    onBtnEvent(): void {
        Panel_Task.startTask();
    }

    onDestroy(): void {
        cc.director.removeAll(this);
    }

    updateUI(): void {
        this.but.active = Boolean(FrameData.saveData.lvAwardinfo) && FrameSDK.frameData.gameData.currentScene === "home";
        this.point.opacity = Panel_Task.isTaskFinish() ? 255 : 0;
    }
}
