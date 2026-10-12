import UIMgr from "./UIMgr";
import { UIParams } from "./UIParams";

const { ccclass, property, menu, executionOrder, requireComponent } = cc._decorator;

@ccclass
@menu("UI/Cocos/Btn/CloseUIBtn")
@executionOrder(-1)
@requireComponent(cc.Button)
export default class CloseUIBtn extends cc.Component {

    @property({
        tooltip: "需要关闭的ui",
        type: cc.Node
    })
    public target: cc.Node = null;

    protected onLoad(): void {
        this.node.on(cc.Button.EventType.CLICK, this.clickHandle, this);
    }

    public clickHandle(): void {
        let uiParams: UIParams = this.target ? this.target.getComponent(UIParams) : null;
        if (!uiParams) {
            uiParams = this.node.getComponent(UIParams);
        }
        if (!uiParams && this.node && this.node.parent) {
            uiParams = this.node.parent.getComponent(UIParams);
        }
        if (uiParams && !uiParams.runingAnim) {
            UIMgr.getInstance().hide(uiParams.node);
        }
    }
}