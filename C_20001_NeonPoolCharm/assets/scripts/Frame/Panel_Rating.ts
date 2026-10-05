import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Rating extends cc.Component {
    @property(cc.Node)
    panel_window: cc.Node = null;

    @property(cc.Node)
    btn_close: cc.Node = null;

    @property(cc.Node)
    label_tips1: cc.Node = null;

    @property(cc.Node)
    starLayout: cc.Node = null;

    @property(cc.Node)
    EdBox: cc.Node = null;

    viewData: any = null;
    leve: number = 5;

    onOkClickEvent(_event: cc.Event, customData: string): void {
        if (customData == "0") {
            if (this.leve >= 5) {
                if (FrameSDK.frameData.sdkFuc.openUrl) {
                    FrameSDK.frameData.sdkFuc.openUrl(
                        cc.sys.os === cc.sys.OS_IOS
                            ? FrameData.FRAME_CONF.iosRateUrl
                            : FrameData.FRAME_CONF.androidRateUrl
                    );
                }
                FrameData.saveData.isRating = true;
                FrameSDK.closeEffect(this, this.viewData.closeCB);
            } else {
                const root = this.panel_window.getChildByName("root");
                const input = root.getChildByName("input");
                input.active = true;
                const root2 = this.panel_window.getChildByName("root2");
                root.getChildByName("label").active = false;
                if (this.EdBox.getComponent(cc.EditBox).string.length > 0) {
                    input.active = false;
                    root.active = false;
                    root2.active = true;
                    FrameData.saveData.isRating = true;
                } else {
                    FrameSDK.showToast("ukey_067");
                }
            }
        } else {
            FrameSDK.closeEffect(this, this.viewData.closeCB);
        }
    }

    onLoad(): void {
        FrameSDK.openEffect(this);
        this.panel_window.getChildByName("root").active = true;
        this.panel_window.getChildByName("root2").active = false;
        this.initInput();
        FrameData.saveData.openRatingInedx++;
    }

    onStarClickEvent(_event: cc.Event, customData: string): void {
        this.leve = Number(customData) + 1;
        for (let i = 0; i < this.starLayout.childrenCount; i++) {
            this.starLayout.children[i].getChildByName("yes").active = i < this.leve;
        }
    }

    initInput(): void {
        const editBox = this.EdBox.getComponent(cc.EditBox);
        editBox.node.off(cc.Node.EventType.TOUCH_END);
        editBox.node.off(cc.Node.EventType.MOUSE_UP);
        editBox.node.on(
            cc.Node.EventType.TOUCH_MOVE,
            (event: cc.Event.EventTouch) => {
                const container = this.EdBox;
                if (editBox.isFocused() == false && editBox.textLabel.node.height > container.height) {
                    editBox.textLabel.node.y += event.getDeltaY();
                    if (editBox.textLabel.node.height > container.height) {
                        const overflow = editBox.textLabel.node.height - container.height;
                        if (editBox.textLabel.node.y > container.height / 2 + overflow) {
                            editBox.textLabel.node.y = container.height / 2 + overflow;
                        } else if (editBox.textLabel.node.y < container.height / 2) {
                            editBox.textLabel.node.y = container.height / 2;
                        }
                    }
                }
            },
            this
        );
    }
}
