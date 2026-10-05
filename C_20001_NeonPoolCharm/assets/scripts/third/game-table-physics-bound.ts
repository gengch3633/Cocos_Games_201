import * as GlobalConfig from "./GlobalConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameTablePhysicsBound extends cc.Component {
    @property
    size: cc.Size = cc.size(0, 0);
    @property
    mouseJoint: boolean = true;
    @property(cc.Node)
    target: cc.Node = null;

    _addBound(node: cc.Node, x: number, y: number, width: number, height: number): void {
        const collider = node.addComponent(cc.PhysicsBoxCollider);
        collider.offset.x = x;
        collider.offset.y = y;
        collider.size.width = width;
        collider.size.height = height;
    }

    onLoad(): void {
        const physicsManager = cc.director.getPhysicsManager();
        const debugDraw = GlobalConfig.debug_physicDraw;
        physicsManager.debugDrawFlags = debugDraw
            ? cc.PhysicsManager.DrawBits.e_aabbBit |
              cc.PhysicsManager.DrawBits.e_jointBit |
              cc.PhysicsManager.DrawBits.e_shapeBit
            : 0;
    }
}
