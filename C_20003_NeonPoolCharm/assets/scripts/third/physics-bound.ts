const { ccclass, property } = cc._decorator;

@ccclass
export default class PhysicsBound extends cc.Component {
    @property
    size = cc.size(0, 0);

    @property
    mouseJoint = true;

    @property(cc.Node)
    target = null;

    _addBound(e, t, o, n, i) {
        const a = e.addComponent(cc.PhysicsBoxCollider);
        a.offset.x = t;
        a.offset.y = o;
        a.size.width = n;
        a.size.height = i;
    }

    onLoad() {
        const e = cc.director.getPhysicsManager();
        e.enabled = true;
        e.debugDrawFlags = 0;
        const t = this.target || this.node;
        const o = this.size.width || t.width;
        const n = this.size.height || t.height;
        console.log("pnode", o, n);
        const i = new cc.Node();
        i.addComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        this.mouseJoint && (i.addComponent(cc.MouseJoint).mouseRegion = t);
        this._addBound(i, 0, n / 2, o, 20);
        this._addBound(i, 0, -n / 2, o, 20);
        this._addBound(i, -o / 2, 0, 20, n);
        this._addBound(i, o / 2, 0, 20, n);
        i.parent = t;
    }
}
