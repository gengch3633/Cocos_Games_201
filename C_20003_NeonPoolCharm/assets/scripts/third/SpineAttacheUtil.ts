export default class SpineAttacheUtil {
    static defaultBoneName = "kuang";

    static addPolygonNodeToSkeleton(t, o, n = SpineAttacheUtil.defaultBoneName, i, a) {
        if (!(t && o && n && i)) return null;
        const r = o.attachUtil;
        if (!r) return null;
        const l = r.generateAttachedNodes(n);
        if (!l || 0 == l.length) return null;
        const s = l[0];
        const c = o.findSlot(i);
        if (!c) return null;
        const u = c.attachment.vertices;
        const p = this.generatePolygonCollider(u, a);
        if (!p) return null;
        s.addChild(p.node);
        p.node.x = p.node.y = 0;
        p.node.group = t;
        p.node.name = n;
        return p;
    }

    static destroyAttachedNodes(e, t) {
        if (!e || !t) return null;
        const o = e.attachUtil;
        o && o.destroyAttachedNodes(t);
    }

    static addAllPolygonNodeToSkeleton(t, o, n = SpineAttacheUtil.defaultBoneName, i) {
        if (!t || !o || !n) return null;
        const a = o.attachUtil;
        if (!a) return null;
        const r = a.generateAttachedNodes(n);
        if (!r || 0 == r.length) return null;
        const l = r[0];
        const s = this.getAllSlotNameByBoneName(o, n);
        const c = [];
        for (let u = 0; u < s.length; u++) {
            const p = o.findSlot(s[u]);
            if (p) {
                const d = p.attachment;
                if (d) {
                    const _ = d.vertices;
                    if (_) {
                        const f = this.generatePolygonCollider(_, i);
                        if (f) {
                            l.addChild(f.node);
                            f.node.x = f.node.y = 0;
                            f.node.group = t;
                            f.node.name = n;
                            c.push(f);
                        }
                    }
                }
            }
        }
        return c;
    }

    static generateAllByBonePrefix(e, t, o, n = "kuang") {
        if (!e || !t) return null;
        if (!t.attachUtil) return null;
        let i = [];
        const a = this.getAllBoneNameByDefaultMode(t, n);
        for (let r = 0; r < a.length; r++) {
            const l = a[r];
            const s = this.addAllPolygonNodeToSkeleton(e, t, l, o);
            i = i.concat(s);
        }
        return i;
    }

    static destroyAllAttachedNodes(e) {
        if (!e) return null;
        const t = e.attachUtil;
        t && t.destroyAllAttachedNodes();
    }

    static getAttachedNodes(e, t) {
        if (!e || !t) return null;
        const o = e.attachUtil;
        return o ? o.getAttachedNodes(t) : null;
    }

    static getAllBoneNameByDefaultMode(e, t = "kuang") {
        if (!e) return null;
        if (!e.skeletonData) return null;
        const o = e.skeletonData.skeletonJson.bones;
        const n = [];
        for (let i = 0; i < o.length; i++) {
            const a = o[i];
            -1 != a.name.indexOf(t) && n.push(a.name);
        }
        return n;
    }

    static generateAllByDefaultMode(e, t, o) {
        if (!e || !t) return null;
        if (!t.attachUtil) return null;
        let n = [];
        const i = this.getAllBoneNameByDefaultMode(t);
        for (let a = 0; a < i.length; a++) {
            const r = i[a];
            const l = this.addAllPolygonNodeToSkeleton(e, t, r, o);
            n = n.concat(l);
        }
        return n;
    }

    static getNodeFromBone(t, o = SpineAttacheUtil.defaultBoneName) {
        if (!t || !o) return null;
        const n = t.attachUtil;
        if (!n) return null;
        const i = n.generateAttachedNodes(o);
        return i && 0 != i.length ? i[0] : null;
    }

    static getAllSlotNameByBoneName(t, o = SpineAttacheUtil.defaultBoneName) {
        if (!t || !o) return null;
        if (!t.skeletonData) return null;
        const n = t.skeletonData.skeletonJson.slots;
        const i = [];
        for (let a = 0; a < n.length; a++) {
            const r = n[a];
            r.bone == o && i.push(r.name);
        }
        return i;
    }

    static addNodeToBone(t, o, n = SpineAttacheUtil.defaultBoneName) {
        if (!t || !o || !n) return null;
        const i = o.attachUtil;
        if (!i) return null;
        const a = i.generateAttachedNodes(n);
        if (!a || 0 == a.length) return null;
        a[0].addChild(t);
        return t;
    }

    static generatePolygonCollider(e, t) {
        if (!e || e.length <= 0) return null;
        let o = t;
        (o = o ? cc.instantiate(t) : new cc.Node()).active = true;
        const n = o.addComponent(cc.PolygonCollider);
        n.points = [];
        for (let i = 0; i < e.length; i++) {
            n.points.push(cc.v2(e[i], e[i + 1]));
            i++;
        }
        return n;
    }
}
