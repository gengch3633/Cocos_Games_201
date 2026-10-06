import UIMgr from "./UIMgr";
import { UIParams } from "./UIParams";

const { ccclass, property, menu, executionOrder, requireComponent } = cc._decorator;

@ccclass
@menu(" UI/ Cocos/ Btn/ CloseUIBtn ")
@executionOrder(-1)
@requireComponent(cc.Button)
export default class CloseUIBtn extends cc.Component {
    @property({
        tooltip: " 需要关闭的ui ",
        type: cc.Node
    })
    target: cc.Node = null;

    onLoad() {
        this.node.on(cc.Button.EventType.CLICK, this.clickHandle, this);
    }

    clickHandle() {
        var e, t, i, n, a, s = null !== (i = null !== (t = null === (e = this.target) || void 0 === e ? void 0 : e.getComponent(UIParams)) && void 0 !== t ? t : this.node.getComponent(UIParams)) && void 0 !== i ? i : null === (a = null === (n = this.node) || void 0 === n ? void 0 : n.parent) || void 0 === a ? void 0 : a.getComponent(UIParams);
        s && !s.runingAnim && UIMgr.getInstance().hide(s.node);
    }
}
