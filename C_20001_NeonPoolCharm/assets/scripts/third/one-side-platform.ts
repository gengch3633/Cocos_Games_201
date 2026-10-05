const { ccclass } = cc._decorator;

@ccclass
export default class OneSidePlatform extends cc.Component {
    pointVelPlatform: cc.Vec2 = null;
    pointVelOther: cc.Vec2 = null;
    relativeVel: cc.Vec2 = null;
    relativePoint: cc.Vec2 = null;

    onLoad(): void {
        this.pointVelPlatform = cc.v2();
        this.pointVelOther = cc.v2();
        this.relativeVel = cc.v2();
        this.relativePoint = cc.v2();
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {
        (this as any)._pointsCache;
        const otherBody = otherCollider.body;
        const selfBody = selfCollider.body;
        const points = contact.getWorldManifold().points;
        const pointVelPlatform = this.pointVelPlatform;
        const pointVelOther = this.pointVelOther;
        const relativeVel = this.relativeVel;
        const relativePoint = this.relativePoint;
        for (let i = 0; i < points.length; i++) {
            selfBody.getLinearVelocityFromWorldPoint(points[i], pointVelPlatform);
            otherBody.getLinearVelocityFromWorldPoint(points[i], pointVelOther);
            selfBody.getLocalVector(pointVelOther.subSelf(pointVelPlatform), relativeVel);
            if (relativeVel.y < -32) {
                return;
            }
            if (relativeVel.y < 32) {
                selfBody.getLocalPoint(points[i], relativePoint);
                const halfHeight = selfCollider.getAABB().height / 2;
                if (relativePoint.y > halfHeight - 3.2) {
                    return;
                }
            }
        }
        contact.disabled = true;
    }
}
