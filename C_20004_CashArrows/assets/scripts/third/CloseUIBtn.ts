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

    private clickHandle(): void {
        const params: UIParams =
            this.target?.getComponent(UIParams) ??
            this.node.getComponent(UIParams) ??
            this.node?.parent?.getComponent(UIParams) ??
            null;
        if (params && !params.runingAnim) {
            UIMgr.getInstance().hide(params.node);
        }
    }
}