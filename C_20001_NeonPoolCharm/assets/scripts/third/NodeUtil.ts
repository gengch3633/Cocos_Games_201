export default class NodeUtil {
    static getRelativePosition(node: cc.Node, target: cc.Node): cc.Vec2 {
        const worldPos = (node.getParent() || node).convertToWorldSpaceAR(node.getPosition());
        return target.convertToNodeSpaceAR(worldPos);
    }

    static isPosOnNodeRect(pos: cc.Vec2, node: cc.Node): boolean {
        return node.getBoundingBoxToWorld().contains(pos);
    }

    static areNodesOverlap(nodeA: cc.Node, nodeB: cc.Node, contains: boolean = false): boolean {
        const boxA = nodeA.getBoundingBoxToWorld();
        const boxB = nodeB.getBoundingBoxToWorld();
        return contains ? boxA.containsRect(boxB) : boxA.intersects(boxB);
    }

    static getNodeSelfBoundingBoxToWorld(node: cc.Node): cc.Rect {
        node.parent._updateWorldMatrix();
        const size = node.getContentSize();
        const width = size.width;
        const height = size.height;
        const anchor = node.getAnchorPoint();
        const rect = cc.rect(-anchor.x * width, -anchor.y * height, width, height);
        node._calculWorldMatrix();
        rect.transformMat4(rect, node._worldMatrix);
        return rect;
    }
}
