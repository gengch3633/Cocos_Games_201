import { UIParams } from "./UIParams";
import UIMgr from "./UIMgr";

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
    target: cc.Node = null;

    onLoad(): void {
        this.node.on(cc.Button.EventType.CLICK, this.clickHandle, this);
    }

    clickHandle(): void {
        const uiParams = this.target?.getComponent(UIParams)
            ?? this.node.getComponent(UIParams)
            ?? this.node?.parent?.getComponent(UIParams);
        if (uiParams && !uiParams.runingAnim) {
            UIMgr.getInstance().hide(uiParams.node);
        }
    }
}
