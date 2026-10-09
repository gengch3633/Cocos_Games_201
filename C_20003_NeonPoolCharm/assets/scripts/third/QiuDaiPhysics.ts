const { ccclass, menu } = cc._decorator;

@ccclass
@menu("physics/QiuDaiPhysics")
export default class QiuDaiPhysics extends cc.Component {
    onBeginContact(e, t, o) {
        const n = o.body.node;
        t.body.node;
        n.parent;
    }
}
