const { ccclass, property } = cc._decorator;

@ccclass
export default class PhysicsBound extends cc.Component {
    @property()
    size = cc.size(0, 0);

    @property()
    mouseJoint = true;

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
        physicsManager.enabled = true;
        physicsManager.debugDrawFlags = 0;
        const targetNode = this.target || this.node;
        const width = this.size.width || targetNode.width;
        const height = this.size.height || targetNode.height;
        console.log("pnode", width, height);
        const boundNode = new cc.Node();
        boundNode.addComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        if (this.mouseJoint) {
            boundNode.addComponent(cc.MouseJoint).mouseRegion = targetNode;
        }
        this._addBound(boundNode, 0, height / 2, width, 20);
        this._addBound(boundNode, 0, -height / 2, width, 20);
        this._addBound(boundNode, -width / 2, 0, 20, height);
        this._addBound(boundNode, width / 2, 0, 20, height);
        boundNode.parent = targetNode;
    }
}
