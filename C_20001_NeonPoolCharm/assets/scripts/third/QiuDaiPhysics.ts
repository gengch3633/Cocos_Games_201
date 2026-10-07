const { ccclass, menu } = cc._decorator;

@ccclass
@menu("physics/QiuDaiPhysics")
export default class QiuDaiPhysics extends cc.Component {
    onBeginContact(e: cc.PhysicsContact, t: cc.PhysicsCollider, o: cc.PhysicsCollider): void {
        const n = o.body.node;
        t.body.node;
        n.parent;
    }
}
