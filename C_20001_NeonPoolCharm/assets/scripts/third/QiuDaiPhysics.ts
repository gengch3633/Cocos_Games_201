const { ccclass, menu } = cc._decorator;

@ccclass
@menu("physics/QiuDaiPhysics")
export default class QiuDaiPhysics extends cc.Component {
    onBeginContact(_contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {
        const otherNode = otherCollider.body.node;
        selfCollider.body.node;
        otherNode.parent;
    }
}
