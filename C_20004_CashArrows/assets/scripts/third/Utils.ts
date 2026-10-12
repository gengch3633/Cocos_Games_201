declare global {
    namespace cc {
        interface Node {
            polygonHit(point: cc.Vec2): boolean;
            _hitTestClose(point: cc.Vec2, listener: any): boolean;
        }
    }
}

export default class Utils {

    public static getPoint(radius: number, centerX: number, centerY: number, count: number): cc.Vec2[] {
        const points: cc.Vec2[] = [];
        const angleUnit = Math.PI / 180 * Math.round(360 / count);
        for (let i = 0; i < count; i++) {
            const x = centerX + radius * Math.cos(angleUnit * i);
            const y = centerY + radius * Math.sin(angleUnit * i);
            points.push(new cc.Vec2(x, y));
        }
        return points;
    }

    public static findChild(name: string, parent: cc.Node): cc.Node {
        if (!parent) return null;
        for (let i = 0; i < parent.childrenCount; i++) {
            if (parent.children[i].name === name) return parent.children[i];
        }
        for (let i = 0; i < parent.childrenCount; i++) {
            const child = Utils.findChild(name, parent.children[i]);
            if (child) return child;
        }
        return null;
    }

    public static deepCopy<T>(target: T): T {
        try {
            return JSON.parse(JSON.stringify(target));
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    public static transAngle(angle: number): number {
        return (360 + Math.floor(angle) % 360) % 360;
    }

    public static interectionPoint(a1: cc.Vec2, a2: cc.Vec2, b1: cc.Vec2, b2: cc.Vec2, out: cc.Vec2 = null): boolean {
        const d1 = (a1.x - b1.x) * (a2.y - b1.y) - (a1.y - b1.y) * (a2.x - b1.x);
        const d2 = (a1.x - b2.x) * (a2.y - b2.y) - (a1.y - b2.y) * (a2.x - b2.x);
        if (d1 * d2 >= 0) return false;

        const d3 = (b1.x - a1.x) * (b2.y - a1.y) - (b1.y - a1.y) * (b2.x - a1.x);
        if (d3 * (d3 + d1 - d2) >= 0) return false;

        if (out) {
            const ratio = d3 / (d2 - d1);
            const offsetX = ratio * (a2.x - a1.x);
            const offsetY = ratio * (a2.y - a1.y);
            out.x = offsetX + a1.x;
            out.y = offsetY + a1.y;
        }
        return true;
    }

    public static vecToAngle(vec: cc.Vec2, offset: number = 0): number {
        if (!vec.equals(cc.Vec2.ZERO)) {
            const radian = cc.v2(vec).signAngle(cc.v2(1, 0));
            return -cc.misc.radiansToDegrees(radian) + offset;
        }
        return undefined;
    }

    public static reflect(vec: cc.Vec2, normal: cc.Vec2): cc.Vec2 {
        const projection = -2 * cc.Vec2.dot(normal, vec);
        return new cc.Vec2(projection * normal.x + vec.x, projection * normal.y + vec.y);
    }

    public static setParent(node: cc.Node, parent: cc.Node): void {
        if (node && parent && node.isValid && parent.isValid && node.parent && node.parent.isValid) {
            const worldPosition = node.parent.convertToWorldSpaceAR(node.getPosition());
            node.parent = parent;
            node.setPosition(node.parent.convertToNodeSpaceAR(worldPosition));
        }
    }

    public static getWorldPosition(node: cc.Node, out: cc.Vec2 = null): cc.Vec2 {
        if (!node || !node.isValid || !node.parent || !node.parent.isValid) return null;
        if (!out) out = new cc.Vec2();
        return node.parent.convertToWorldSpaceAR(node.getPosition(out), out);
    }

    public static getRelativePosition(node: cc.Node, target: cc.Node, out: cc.Vec2 = null): cc.Vec2 {
        if (!node || !node.isValid || !target || !target.isValid) return null;
        if (!out) out = new cc.Vec2();
        out = Utils.getWorldPosition(target, out);
        if (!out) return null;
        out = node.parent && node.parent.isValid
            ? node.parent.convertToNodeSpaceAR(out, out)
            : node.convertToNodeSpaceAR(out, out);
        return out;
    }

    public static ratioScale(target: cc.Node | cc.Component, maxWidth: number, maxHeight: number, maxScale: number = 1): number {
        if (target && target.isValid) {
            const node: cc.Node = target instanceof cc.Node ? target : target.node;
            let scale = node.width > node.height ? maxWidth / node.width : maxHeight / node.height;
            if (scale > maxScale) scale = maxScale;
            node.scaleX = scale;
            node.scaleY = scale;
            console.log("scale:", scale);
            return scale;
        }
        return undefined;
    }

    public static getBoundingBoxToWorld(node: cc.Node): cc.Rect {
        if (!node || !node.isValid) return null;
        const boundingBox = node.getBoundingBox();
        const worldMatrix = new cc.Mat4();
        node.parent.getWorldMatrix(worldMatrix);
        const worldRect = new cc.Rect();
        boundingBox.transformMat4(worldRect, worldMatrix);
        return worldRect;
    }

    public static getSpineAnimations(spine: cc.Node | sp.Skeleton | sp.SkeletonData): string[] {
        if (!spine) return [];
        let skeletonData: sp.SkeletonData = null;
        if (spine instanceof cc.Node) {
            const skeleton = spine.getComponent(sp.Skeleton);
            skeletonData = skeleton ? skeleton.skeletonData : null;
        } else if (spine instanceof sp.Skeleton) {
            skeletonData = spine.skeletonData;
        } else if (spine instanceof sp.SkeletonData) {
            skeletonData = spine;
        }
        if (!skeletonData || !skeletonData.skeletonJson) return [];
        const animations = skeletonData.skeletonJson.animations;
        return animations ? Object.keys(animations) : [];
    }

    public static getSpineAnimationDuration(spine: cc.Node | sp.Skeleton | sp.SkeletonData, animName: string): number {
        if (!spine) return -1;

        let skeletonData: sp.SkeletonData = null;

        if (spine instanceof cc.Node || spine instanceof sp.Skeleton) {
            const skeleton: sp.Skeleton = spine instanceof cc.Node ? spine.getComponent(sp.Skeleton) : spine;
            if (!skeleton || !skeleton.isValid) return -1;
            const animation = skeleton.findAnimation(animName);
            const duration = animation ? animation.duration : -1;
            if (duration !== -1) return duration;
            skeletonData = skeleton.skeletonData;
        } else if (spine instanceof sp.SkeletonData) {
            skeletonData = spine;
        }

        if (!skeletonData) return -1;

        const runtimeData = skeletonData.getRuntimeData();
        const runtimeSkeletonData = new sp.spine.Skeleton(runtimeData).data;
        const runtimeAnimation = runtimeSkeletonData ? runtimeSkeletonData.findAnimation(animName) : null;
        const runtimeDuration = runtimeAnimation ? runtimeAnimation.duration : undefined;
        return runtimeDuration !== undefined && runtimeDuration !== null ? runtimeDuration : -1;
    }

    public static setStatsColor(color: cc.Color = cc.Color.WHITE, backgroundColor: cc.Color = cc.color(0, 0, 0, 150)): void {
        const profilerNode = cc.find("PROFILER-NODE");
        if (!profilerNode) {
            cc.warn("未找到统计面板节点！");
            return;
        }

        profilerNode.children.forEach((child: cc.Node) => {
            child.color = color;
        });

        let background = profilerNode.getChildByName("BACKGROUND");
        if (!background) {
            background = new cc.Node("BACKGROUND");
            profilerNode.addChild(background, cc.macro.MIN_ZINDEX);
            const box = profilerNode.getBoundingBoxToWorld();
            background.setContentSize(box.width, box.height);
            background.setPosition(0, 0);
        }

        const graphics: cc.Graphics = background.getComponent(cc.Graphics) || background.addComponent(cc.Graphics);
        graphics.clear();
        graphics.rect(-5, 12.5, background.width + 10, background.height - 10);
        graphics.fillColor = backgroundColor;
        graphics.fill();
    }

    public static AddIrregularityClick(): void {
        const nodeProto: any = cc.Node.prototype;

        nodeProto.polygonHit = function (this: cc.Node, point: cc.Vec2): boolean {
            const collider: cc.PolygonCollider = this.getComponent(cc.PolygonCollider);
            if (!collider) return true;
            const localPoint: cc.Vec2 = point.clone();
            this.convertToNodeSpaceAR(localPoint, localPoint);
            return cc.Intersection.pointInPolygon(localPoint, collider.points);
        };

        nodeProto._hitTestClose = nodeProto._hitTest;

        nodeProto._hitTest = function (this: cc.Node, point: cc.Vec2, listener: any): boolean {
            return !!this._hitTestClose(point, listener) && this.polygonHit(point);
        };
    }
}