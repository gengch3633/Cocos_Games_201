import GlobalConfig from "./GlobalConfig";

const { ccclass, property } = cc._decorator;

@ccclass("game-table-physics-bound")
export default class GameTablePhysicsBound extends cc.Component {
    @property
    size = cc.size(0, 0);

    @property
    mouseJoint = true;

    @property(cc.Node)
    target: cc.Node = null;

    _addBound(e: cc.Node, t: number, o: number, n: number, i: number): void {
        const a = e.addComponent(cc.PhysicsBoxCollider);
        a.offset.x = t;
        a.offset.y = o;
        a.size.width = n;
        a.size.height = i;
    }

    onLoad(): void {
        const e = cc.director.getPhysicsManager();
        const t = GlobalConfig.debug_physicDraw;
        e.debugDrawFlags = t
            ? cc.PhysicsManager.DrawBits.e_aabbBit |
              cc.PhysicsManager.DrawBits.e_jointBit |
              cc.PhysicsManager.DrawBits.e_shapeBit
            : 0;
    }
}
