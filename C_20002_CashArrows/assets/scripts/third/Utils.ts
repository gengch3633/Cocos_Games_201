export default class Utils {
    static getPoint(radius: number, centerX: number, centerY: number, count: number): cc.Vec2[] {
        const points: cc.Vec2[] = [];
        const angleStep = Math.PI / 180 * Math.round(360 / count);
        for (let i = 0; i < count; i++) {
            const x = centerX + radius * Math.cos(angleStep * i);
            const y = centerY + radius * Math.sin(angleStep * i);
            points.push(new cc.Vec2(x, y));
        }
        return points;
    }

    static findChild(name: string, parent: cc.Node): cc.Node {
        if (!parent) {
            return null;
        }
        for (let i = 0; i < parent.childrenCount; i++) {
            if (parent.children[i].name === name) {
                return parent.children[i];
            }
        }
        for (let i = 0; i < parent.childrenCount; i++) {
            const child = this.findChild(name, parent.children[i]);
            if (child) {
                return child;
            }
        }
        return null;
    }

    static deepCopy<T>(value: T): T {
        try {
            return JSON.parse(JSON.stringify(value));
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    static transAngle(angle: number): number {
        return (360 + Math.floor(angle) % 360) % 360;
    }

    static interectionPoint(
        p1: cc.Vec2,
        p2: cc.Vec2,
        p3: cc.Vec2,
        p4: cc.Vec2,
        out?: cc.Vec2
    ): boolean {
        const d1 = (p1.x - p3.x) * (p2.y - p3.y) - (p1.y - p3.y) * (p2.x - p3.x);
        const d2 = (p1.x - p4.x) * (p2.y - p4.y) - (p1.y - p4.y) * (p2.x - p4.x);
        if (d1 * d2 >= 0) {
            return false;
        }
        const d3 = (p3.x - p1.x) * (p4.y - p1.y) - (p3.y - p1.y) * (p4.x - p1.x);
        if (d3 * (d3 + d1 - d2) >= 0) {
            return false;
        }
        if (out) {
            const ratio = d3 / (d2 - d1);
            const dx = ratio * (p2.x - p1.x);
            const dy = ratio * (p2.y - p1.y);
            out.x = dx + p1.x;
            out.y = dy + p1.y;
        }
        return true;
    }

    static vecToAngle(vec: cc.Vec2, offset: number = 0): number {
        if (!vec.equals(cc.Vec2.ZERO)) {
            const rad = cc.v2(vec).signAngle(cc.v2(1, 0));
            return -cc.misc.radiansToDegrees(rad) + offset;
        }
        return undefined;
    }

    static reflect(vec: cc.Vec2, normal: cc.Vec2): cc.Vec2 {
        const factor = -2 * cc.Vec2.dot(normal, vec);
        return new cc.Vec2(factor * normal.x + vec.x, factor * normal.y + vec.y);
    }

    static setParent(node: cc.Node, parent: cc.Node): void {
        if (node && parent && node.isValid && parent.isValid && node.parent && node.parent.isValid) {
            const worldPos = node.parent.convertToWorldSpaceAR(node.getPosition());
            node.parent = parent;
            node.setPosition(node.parent.convertToNodeSpaceAR(worldPos));
        }
    }

    static getWorldPosition(node: cc.Node, out?: cc.Vec2): cc.Vec2 {
        if (node && node.isValid && node.parent && node.parent.isValid) {
            if (!out) {
                out = new cc.Vec2();
            }
            return node.parent.convertToWorldSpaceAR(node.getPosition(out), out);
        }
        return null;
    }

    static getRelativePosition(target: cc.Node, reference: cc.Node, out?: cc.Vec2): cc.Vec2 {
        if (target && target.isValid && reference && reference.isValid) {
            if (!out) {
                out = new cc.Vec2();
            }
            out = Utils.getWorldPosition(reference, out);
            if (!out) {
                return null;
            }
            return target.parent && target.parent.isValid
                ? target.parent.convertToNodeSpaceAR(out, out)
                : target.convertToNodeSpaceAR(out, out);
        }
        return null;
    }

    static ratioScale(target: cc.Node | cc.Component, width: number, height: number, maxScale: number = 1): number {
        if (target && (target as cc.Node).isValid) {
            const node = target instanceof cc.Node ? target : target.node;
            const scale = node.width > node.height ? width / node.width : height / node.height;
            const finalScale = scale > maxScale ? maxScale : scale;
            node.scaleX = finalScale;
            node.scaleY = finalScale;
            console.log("scale:", finalScale);
            return finalScale;
        }
        return undefined;
    }

    static getBoundingBoxToWorld(node: cc.Node): cc.Rect {
        if (!node || !node.isValid) {
            return null;
        }
        const box = node.getBoundingBox();
        const matrix = new cc.Mat4();
        node.parent.getWorldMatrix(matrix);
        const result = new cc.Rect();
        box.transformMat4(result, matrix);
        return result;
    }

    static getSpineAnimations(target: cc.Node | sp.Skeleton | sp.SkeletonData): string[] {
        if (!target) {
            return [];
        }
        let skeletonData: sp.SkeletonData = null;
        if (target instanceof cc.Node) {
            const skeleton = target.getComponent(sp.Skeleton);
            skeletonData = skeleton?.skeletonData;
        } else if (target instanceof sp.Skeleton) {
            skeletonData = target.skeletonData;
        } else if (target instanceof sp.SkeletonData) {
            skeletonData = target;
        }
        if (!skeletonData || !skeletonData.skeletonJson) {
            return [];
        }
        const animations = skeletonData.skeletonJson.animations;
        return animations ? Object.keys(animations) : [];
    }

    static getSpineAnimationDuration(
        target: cc.Node | sp.Skeleton | sp.SkeletonData,
        animationName: string
    ): number {
        if (!target) {
            return -1;
        }
        let skeletonData: sp.SkeletonData = null;
        if (target instanceof cc.Node || target instanceof sp.Skeleton) {
            const skeleton = target instanceof sp.Skeleton ? target : target.getComponent(sp.Skeleton);
            if (!skeleton || !skeleton.isValid) {
                return -1;
            }
            const duration = skeleton.findAnimation(animationName)?.duration;
            if (duration != null && duration !== -1) {
                return duration;
            }
            skeletonData = skeleton.skeletonData;
        } else if (target instanceof sp.SkeletonData) {
            skeletonData = target;
        }
        if (skeletonData) {
            const animation = new sp.spine.Skeleton(skeletonData.getRuntimeData()).data.findAnimation(animationName);
            return animation?.duration ?? -1;
        }
        return -1;
    }

    static setStatsColor(textColor: cc.Color = cc.Color.WHITE, bgColor: cc.Color = cc.color(0, 0, 0, 150)): void {
        const profilerNode = cc.find("PROFILER-NODE");
        if (!profilerNode) {
            return cc.warn("未找到统计面板节点！");
        }
        profilerNode.children.forEach((child) => {
            child.color = textColor;
        });
        let background = profilerNode.getChildByName("BACKGROUND");
        if (!background) {
            background = new cc.Node("BACKGROUND");
            profilerNode.addChild(background, cc.macro.MIN_ZINDEX);
            background.setContentSize(profilerNode.getBoundingBoxToWorld());
            background.setPosition(0, 0);
        }
        const graphics = background.getComponent(cc.Graphics) || background.addComponent(cc.Graphics);
        graphics.clear();
        graphics.rect(-5, 12.5, background.width + 10, background.height - 10);
        graphics.fillColor = bgColor;
        graphics.fill();
    }

    static AddIrregularityClick(): void {
        cc.Node.prototype.polygonHit = function (point: cc.Vec2): boolean {
            const collider = this.getComponent(cc.PolygonCollider);
            if (!collider) {
                return true;
            }
            const localPoint = point.clone();
            this.convertToNodeSpaceAR(localPoint, localPoint);
            return cc.Intersection.pointInPolygon(localPoint, collider.points);
        };
        cc.Node.prototype._hitTestClose = cc.Node.prototype._hitTest;
        cc.Node.prototype._hitTest = function (point: cc.Vec2, listener: any): boolean {
            return !!this._hitTestClose(point, listener) && this.polygonHit(point);
        };
    }
}
