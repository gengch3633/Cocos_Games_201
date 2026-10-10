import GlobalConfig from "./GlobalConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class game_table_physics_bound extends cc.Component {
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
        const t = GlobalConfig.debug_physicDraw;
        e.debugDrawFlags = t ? cc.PhysicsManager.DrawBits.e_aabbBit | cc.PhysicsManager.DrawBits.e_jointBit | cc.PhysicsManager.DrawBits.e_shapeBit : 0;
    }
}
