export default class Utils {
    static getPoint(e: number, t: number, i: number, n: number) {
        for (var a = [], o = Math.PI / 180 * Math.round(360 / n), r = 0; r < n; r++) {
            var s = t + e * Math.cos(o * r),
                l = i + e * Math.sin(o * r);
            a.push(new cc.Vec2(s, l));
        }
        return a;
    }

    static findChild(e: string, t: cc.Node | null): cc.Node | null {
        if (!t) return null;
        for (var i = 0; i < t.childrenCount; i++) if (t.children[i].name == e) return t.children[i];
        for (i = 0; i < t.childrenCount; i++) {
            var n = this.findChild(e, t.children[i]);
            if (n) return n;
        }
        return null;
    }

    static deepCopy(e: any) {
        try {
            return JSON.parse(JSON.stringify(e));
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    static transAngle(e: number) {
        return (360 + Math.floor(e) % 360) % 360;
    }

    static interectionPoint(e: cc.Vec2, t: cc.Vec2, i: cc.Vec2, n: cc.Vec2, a?: cc.Vec2) {
        var o = (e.x - i.x) * (t.y - i.y) - (e.y - i.y) * (t.x - i.x),
            r = (e.x - n.x) * (t.y - n.y) - (e.y - n.y) * (t.x - n.x);
        if (o * r >= 0) return false;
        var s = (i.x - e.x) * (n.y - e.y) - (i.y - e.y) * (n.x - e.x);
        if (s * (s + o - r) >= 0) return false;
        if (a) {
            var l = s / (r - o),
                c = l * (t.x - e.x),
                u = l * (t.y - e.y);
            a.x = c + e.x;
            a.y = u + e.y;
        }
        return true;
    }

    static vecToAngle(e: cc.Vec2, t?: number) {
        void 0 === t && (t = 0);
        if (!e.equals(cc.Vec2.ZERO)) {
            var i = cc.v2(e).signAngle(cc.v2(1, 0));
            return -cc.misc.radiansToDegrees(i) + t;
        }
    }

    static reflect(e: cc.Vec2, t: cc.Vec2) {
        var i = -2 * cc.Vec2.dot(t, e);
        return new cc.Vec2(i * t.x + e.x, i * t.y + e.y);
    }

    static setParent(e: cc.Node, t: cc.Node) {
        if (e && t && e.isValid && t.isValid && e.parent && e.parent.isValid) {
            var i = e.parent.convertToWorldSpaceAR(e.getPosition());
            e.parent = t;
            e.setPosition(e.parent.convertToNodeSpaceAR(i));
        }
    }

    static getWorldPosition(e: cc.Node, t?: cc.Vec2 | null) {
        void 0 === t && (t = null);
        return e && e.isValid && e.parent && e.parent.isValid ? (t || (t = new cc.Vec2()), e.parent.convertToWorldSpaceAR(e.getPosition(t), t)) : null;
    }

    static getRelativePosition(t: cc.Node, i: cc.Node, n?: cc.Vec2 | null) {
        void 0 === n && (n = null);
        return t && t.isValid && i && i.isValid ? (n || (n = new cc.Vec2()), (n = Utils.getWorldPosition(i, n)) ? n = t.parent && t.parent.isValid ? t.parent.convertToNodeSpaceAR(n, n) : t.convertToNodeSpaceAR(n, n) : null) : null;
    }

    static ratioScale(e: cc.Node | cc.Component, t: number, i: number, n?: number) {
        void 0 === n && (n = 1);
        if (e && e.isValid) {
            var a = e instanceof cc.Node ? e : e.node,
                o = a.width > a.height ? t / a.width : i / a.height;
            o > n && (o = n);
            a.scaleX = o;
            a.scaleY = o;
            console.log("scale:", o);
            return o;
        }
    }

    static getBoundingBoxToWorld(e: cc.Node) {
        if (!e || !e.isValid) return null;
        var t = e.getBoundingBox(),
            i = new cc.Mat4();
        e.parent.getWorldMatrix(i);
        var n = new cc.Rect();
        t.transformMat4(n, i);
        return n;
    }

    static getSpineAnimations(e: cc.Node | sp.Skeleton | sp.SkeletonData) {
        if (!e) return [];
        var t: sp.SkeletonData | null = null;
        if (e instanceof cc.Node) {
            var i = e.getComponent(sp.Skeleton);
            t = null == i ? void 0 : i.skeletonData;
        } else e instanceof sp.Skeleton ? t = e.skeletonData : e instanceof sp.SkeletonData && (t = e);
        if (!t || !t.skeletonJson) return [];
        var n = t.skeletonJson.animations;
        return n ? Object.keys(n) : [];
    }

    static getSpineAnimationDuration(e: cc.Node | sp.Skeleton | sp.SkeletonData, t: string) {
        var i, n, a, o;
        if (!e) return -1;
        var r: sp.SkeletonData | null = null,
            s = -1;
        if (e instanceof cc.Node || e instanceof sp.Skeleton) {
            var l = e.getComponent(sp.Skeleton);
            if (!l || !l.isValid) return -1;
            if (-1 != (s = null !== (n = null === (i = l.findAnimation(t)) || void 0 === i ? void 0 : i.duration) && void 0 !== n ? n : -1)) return s;
            r = l.skeletonData;
        } else e instanceof sp.SkeletonData && (r = e);
        return r && null !== (o = null === (a = new sp.spine.Skeleton(r.getRuntimeData()).data.findAnimation(t)) || void 0 === a ? void 0 : a.duration) && void 0 !== o ? o : -1;
    }

    static setStatsColor(e?: cc.Color, t?: cc.Color) {
        void 0 === e && (e = cc.Color.WHITE);
        void 0 === t && (t = cc.color(0, 0, 0, 150));
        var i = cc.find("PROFILER-NODE");
        if (!i) return cc.warn("未找到统计面板节点！");
        i.children.forEach(function(t) {
            return t.color = e!;
        });
        var n = i.getChildByName("BACKGROUND");
        if (!n) {
            n = new cc.Node("BACKGROUND");
            i.addChild(n, cc.macro.MIN_ZINDEX);
            n.setContentSize(i.getBoundingBoxToWorld());
            n.setPosition(0, 0);
        }
        var a = n.getComponent(cc.Graphics) || n.addComponent(cc.Graphics);
        a.clear();
        a.rect(-5, 12.5, n.width + 10, n.height - 10);
        a.fillColor = t!;
        a.fill();
    }

    static AddIrregularityClick() {
        (cc.Node.prototype as any).polygonHit = function(e: cc.Vec2) {
            var t = this.getComponent(cc.PolygonCollider);
            if (!t) return true;
            var i = e.clone();
            this.convertToNodeSpaceAR(i, i);
            return cc.Intersection.pointInPolygon(i, t.points);
        };
        (cc.Node.prototype as any)._hitTestClose = cc.Node.prototype._hitTest;
        cc.Node.prototype._hitTest = function(e: cc.Vec2, t: cc.Camera) {
            return !!this._hitTestClose(e, t) && (this as any).polygonHit(e);
        };
    }
}
