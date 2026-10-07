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

    onBeginContact(e: cc.PhysicsContact, t: cc.PhysicsCollider, o: cc.PhysicsCollider): void {
        const n = o.body;
        const i = t.body;
        const a = e.getWorldManifold().points;
        const r = this.pointVelPlatform;
        const l = this.pointVelOther;
        const s = this.relativeVel;
        const c = this.relativePoint;
        for (let u = 0; u < a.length; u++) {
            i.getLinearVelocityFromWorldPoint(a[u], r);
            n.getLinearVelocityFromWorldPoint(a[u], l);
            i.getLocalVector(l.subSelf(r), s);
            if (s.y < -32) {
                return;
            }
            if (s.y < 32) {
                i.getLocalPoint(a[u], c);
                const p = t.getAABB().height / 2;
                if (c.y > p - 3.2) {
                    return;
                }
            }
        }
        e.disabled = true;
    }
}
