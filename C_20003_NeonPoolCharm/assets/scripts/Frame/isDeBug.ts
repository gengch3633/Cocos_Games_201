import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass } = cc._decorator;

@ccclass
export default class isDeBug extends cc.Component {

    onLoad() {
        this.node.active = FrameSDK.frameData.isDeBug || FrameData.isTest;
    }
}
