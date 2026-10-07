import { FrameData } from "./FrameData";
import RDM_Level from "./RDM_Level";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BottomTips extends cc.Component {
    @property(cc.Node)
    rootNode: cc.Node = null;

    hasQuest(): boolean {
        for (let i = 0; i < FrameData.FRAME_CONF.CoinConf.length; i++) {
            if (RDM_Level.getData(FrameData.FRAME_CONF.CoinConf[i].rdm_id).status <= 3) {
                return true;
            }
        }
        return false;
    }

    updateCardUI(): void {
        this.node.opacity = this.hasQuest() ? 255 : 0;
    }

    onEnable(): void {
        this.updateCardUI();
        this.rootNode.y = -this.node.height;
        cc.Tween.stopAllByTarget(this.rootNode);
        cc.tween(this.rootNode)
            .delay(1)
            .to(0.2, { y: 0 }, { easing: "sineOut" })
            .start();
    }

    onLoad(): void {
        this.node.opacity = 0;
    }
}
