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

    onOkClickEvent(e: any, t: any): void {
        if ("0" == t) {
            if (this.leve >= 5) {
                if (FrameSDK.frameData.sdkFuc.openUrl) {
                    FrameSDK.frameData.sdkFuc.openUrl(cc.sys.os === cc.sys.OS_IOS ? FrameData.FRAME_CONF.iosRateUrl : FrameData.FRAME_CONF.androidRateUrl);
                }
                FrameData.saveData.isRating = true;
                FrameSDK.closeEffect(this, this.viewData.closeCB);
            } else {
                const a = this.panel_window.getChildByName("root");
                const o = a.getChildByName("input");
                o.active = true;
                const n = this.panel_window.getChildByName("root2");
                a.getChildByName("label").active = false;
                if (this.EdBox.getComponent(cc.EditBox).string.length > 0) {
                    o.active = false;
                    a.active = false;
                    n.active = true;
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

    onStarClickEvent(e: any, t: any): void {
        this.leve = Number(t) + 1;
        for (let a = 0; a < this.starLayout.childrenCount; a++) {
            this.starLayout.children[a].getChildByName("yes").active = a < this.leve;
        }
    }

    initInput(): void {
        const e = this;
        const t = this.EdBox.getComponent(cc.EditBox);
        t.node.off(cc.Node.EventType.TOUCH_END);
        t.node.off(cc.Node.EventType.MOUSE_UP);
        t.node.on(cc.Node.EventType.TOUCH_MOVE, function (a) {
            const o = e.EdBox;
            if (0 == (t as any).isFocused() && t.textLabel.node.height > o.height) {
                t.textLabel.node.y += a.getDeltaY();
                if (t.textLabel.node.height > o.height) {
                    const n = t.textLabel.node.height - o.height;
                    if (t.textLabel.node.y > o.height / 2 + n) {
                        t.textLabel.node.y = o.height / 2 + n;
                    } else if (t.textLabel.node.y < o.height / 2) {
                        t.textLabel.node.y = o.height / 2;
                    }
                }
            }
        }, this);
    }

}
