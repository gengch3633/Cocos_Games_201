export default class NodeUtil {
    static getRelativePosition(e, t) {
        const o = (e.getParent() || e).convertToWorldSpaceAR(e.getPosition());
        return t.convertToNodeSpaceAR(o);
    }

    static isPosOnNodeRect(e, t) {
        return t.getBoundingBoxToWorld().contains(e);
    }

    static areNodesOverlap(e, t, o) {
        if (undefined === o) {
            o = false;
        }
        const n = e.getBoundingBoxToWorld(),
            i = t.getBoundingBoxToWorld();
        return o ? n.containsRect(i) : n.intersects(i);
    }

    static getNodeSelfBoundingBoxToWorld(e) {
        e.parent._updateWorldMatrix();
        const t = e.getContentSize(),
            o = t.width,
            n = t.height,
            i = e.getAnchorPoint(),
            a = cc.rect(-i.x * o, -i.y * n, o, n);
        e._calculWorldMatrix();
        a.transformMat4(a, e._worldMatrix);
        return a;
    }
}
