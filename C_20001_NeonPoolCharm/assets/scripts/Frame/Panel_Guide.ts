import Frame from "./Frame";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Guide extends cc.Component {
    @property
    type: number = 0;

    updataUi(): void {}

    onLoad(): void {
        this.node.active = FrameData.saveData.guideInedx == this.type;
        if (this.node.active) {
            if (this.type == 0) {
                // no-op
            } else {
                this.scheduleOnce(this.updataUi.bind(this));
            }
            this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch, this);
        }
    }

    onTouch(): void {
        FrameData.saveData.guideInedx++;
        if (this.type == 0) {
            this.node.active = false;
            Frame.ins.setGuideShow(false);
            FrameSDK.openPanel_Yellow();
        } else {
            this.updataUi();
        }
    }
}
