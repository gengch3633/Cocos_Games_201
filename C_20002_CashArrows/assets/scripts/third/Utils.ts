declare const sp: any;

export default class Utils {
    static getPoint(radius: number, centerX: number, centerY: number, count: number): cc.Vec2[] {
        const points: cc.Vec2[] = [];
        const step = (Math.PI / 180) * Math.round(360 / count);
        for (let i = 0; i < count; i++) {
            const x = centerX + radius * Math.cos(step * i);
            const y = centerY + radius * Math.sin(step * i);
            points.push(new cc.Vec2(x, y));
        }
        return points;
    }

    static findChild(name: string, root: cc.Node | null): cc.Node | null {
        if (!root) {
            return null;
        }
        for (let i = 0; i < root.childrenCount; i++) {
            if (root.children[i].name === name) {
                return root.children[i];
            }
        }
        for (let i = 0; i < root.childrenCount; i++) {
            const child = this.findChild(name, root.children[i]);
            if (child) {
                return child;
            }
        }
        return null;
    }

    static deepCopy<T>(value: T): T | null {
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
            const offsetX = ratio * (p2.x - p1.x);
            const offsetY = ratio * (p2.y - p1.y);
            out.x = offsetX + p1.x;
            out.y = offsetY + p1.y;
        }
        return true;
    }

    static vecToAngle(vec: cc.Vec2, offset = 0): number | undefined {
        if (!vec.equals(cc.Vec2.ZERO)) {
            const radians = cc.v2(vec).signAngle(cc.v2(1, 0));
            return -cc.misc.radiansToDegrees(radians) + offset;
        }
    }

    static reflect(vec: cc.Vec2, normal: cc.Vec2): cc.Vec2 {
        const dot = -2 * cc.Vec2.dot(normal, vec);
        return new cc.Vec2(dot * normal.x + vec.x, dot * normal.y + vec.y);
    }

    static setParent(node: cc.Node, parent: cc.Node): void {
        if (node && parent && node.isValid && parent.isValid && node.parent && node.parent.isValid) {
            const worldPos = node.parent.convertToWorldSpaceAR(node.getPosition());
            node.parent = parent;
            node.setPosition(node.parent.convertToNodeSpaceAR(worldPos));
        }
    }

    static getWorldPosition(node: cc.Node, out: cc.Vec2 | null = null): cc.Vec2 | null {
        if (node && node.isValid && node.parent && node.parent.isValid) {
            if (!out) {
                out = new cc.Vec2();
            }
            return node.parent.convertToWorldSpaceAR(node.getPosition(out), out);
        }
        return null;
    }

    static getRelativePosition(target: cc.Node, source: cc.Node, out: cc.Vec2 | null = null): cc.Vec2 | null {
        if (target && target.isValid && source && source.isValid) {
            if (!out) {
                out = new cc.Vec2();
            }
            out = this.getWorldPosition(source, out);
            if (!out) {
                return null;
            }
            if (target.parent && target.parent.isValid) {
                return target.parent.convertToNodeSpaceAR(out, out);
            }
            return target.convertToNodeSpaceAR(out, out);
        }
        return null;
    }

    static ratioScale(target: cc.Node | cc.Component, width: number, height: number, maxScale = 1): number | undefined {
        if (target && (target as cc.Node).isValid) {
            const node = target instanceof cc.Node ? target : target.node;
            let scale = node.width > node.height ? width / node.width : height / node.height;
            if (scale > maxScale) {
                scale = maxScale;
            }
            node.scaleX = scale;
            node.scaleY = scale;
            console.log("scale:", scale);
            return scale;
        }
    }

    static getBoundingBoxToWorld(node: cc.Node): cc.Rect | null {
        if (!node || !node.isValid) {
            return null;
        }
        const box = node.getBoundingBox();
        const matrix = new cc.Mat4();
        node.parent.getWorldMatrix(matrix);
        const rect = new cc.Rect();
        box.transformMat4(rect, matrix);
        return rect;
    }

    static getSpineAnimations(target: cc.Node | sp.Skeleton | sp.SkeletonData): string[] {
        if (!target) {
            return [];
        }
        let skeletonData: sp.SkeletonData | null = null;
        if (target instanceof cc.Node) {
            const skeleton = target.getComponent(sp.Skeleton);
            skeletonData = skeleton ? skeleton.skeletonData : null;
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
        let skeletonData: sp.SkeletonData | null = null;
        let duration = -1;
        if (target instanceof cc.Node || target instanceof sp.Skeleton) {
            const skeleton = target.getComponent(sp.Skeleton);
            if (!skeleton || !skeleton.isValid) {
                return -1;
            }
            duration = skeleton.findAnimation(animationName)?.duration ?? -1;
            if (duration !== -1) {
                return duration;
            }
            skeletonData = skeleton.skeletonData;
        } else if (target instanceof sp.SkeletonData) {
            skeletonData = target;
        }
        if (skeletonData) {
            return new sp.spine.Skeleton(skeletonData.getRuntimeData()).data.findAnimation(animationName)?.duration ?? -1;
        }
        return -1;
    }

    static setStatsColor(textColor: cc.Color = cc.Color.WHITE, backgroundColor: cc.Color = cc.color(0, 0, 0, 150)): cc.Node | void {
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
        graphics.fillColor = backgroundColor;
        graphics.fill();
    }

    static AddIrregularityClick(): void {
        cc.Node.prototype.polygonHit = function (point: cc.Vec2) {
            const collider = this.getComponent(cc.PolygonCollider);
            if (!collider) {
                return true;
            }
            const localPoint = point.clone();
            this.convertToNodeSpaceAR(localPoint, localPoint);
            return cc.Intersection.pointInPolygon(localPoint, collider.points);
        };
        cc.Node.prototype._hitTestClose = cc.Node.prototype._hitTest;
        cc.Node.prototype._hitTest = function (point: cc.Vec2, listener: any) {
            return !!this._hitTestClose(point, listener) && this.polygonHit(point);
        };
    }
}
