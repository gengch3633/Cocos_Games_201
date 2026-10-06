// @ts-nocheck

export default class Utils {
    static getPoint(radius, centerX, centerY, sides) {
        const points = [];
        const angleStep = (Math.PI / 180) * Math.round(360 / sides);
        for (let i = 0; i < sides; i++) {
            const x = centerX + radius * Math.cos(angleStep * i);
            const y = centerY + radius * Math.sin(angleStep * i);
            points.push(new cc.Vec2(x, y));
        }
        return points;
    }

    static findChild(name, root) {
        if (!root) {
            return null;
        }
        for (let i = 0; i < root.childrenCount; i++) {
            if (root.children[i].name == name) {
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

    static deepCopy(value) {
        try {
            return JSON.parse(JSON.stringify(value));
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    static transAngle(angle) {
        return (360 + Math.floor(angle) % 360) % 360;
    }

    static interectionPoint(a, b, c, d, out) {
        const cross1 = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
        const cross2 = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);
        if (cross1 * cross2 >= 0) {
            return false;
        }
        const cross3 = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
        if (cross3 * (cross3 + cross1 - cross2) >= 0) {
            return false;
        }
        if (out) {
            const ratio = cross3 / (cross2 - cross1);
            const offsetX = ratio * (b.x - a.x);
            const offsetY = ratio * (b.y - a.y);
            out.x = offsetX + a.x;
            out.y = offsetY + a.y;
        }
        return true;
    }

    static vecToAngle(vector, offset = 0) {
        if (!vector.equals(cc.Vec2.ZERO)) {
            const signed = cc.v2(vector).signAngle(cc.v2(1, 0));
            return -cc.misc.radiansToDegrees(signed) + offset;
        }
    }

    static reflect(vector, normal) {
        const dot = -2 * cc.Vec2.dot(normal, vector);
        return new cc.Vec2(dot * normal.x + vector.x, dot * normal.y + vector.y);
    }

    static setParent(node, parent) {
        if (node && parent && node.isValid && parent.isValid && node.parent && node.parent.isValid) {
            const worldPos = node.parent.convertToWorldSpaceAR(node.getPosition());
            node.parent = parent;
            node.setPosition(node.parent.convertToNodeSpaceAR(worldPos));
        }
    }

    static getWorldPosition(node, out = null) {
        if (node && node.isValid && node.parent && node.parent.isValid) {
            out || (out = new cc.Vec2());
            return node.parent.convertToWorldSpaceAR(node.getPosition(out), out);
        }
        return null;
    }

    static getRelativePosition(target, source, out = null) {
        if (target && target.isValid && source && source.isValid) {
            out || (out = new cc.Vec2());
            out = this.getWorldPosition(source, out);
            return out
                ? target.parent && target.parent.isValid
                    ? target.parent.convertToNodeSpaceAR(out, out)
                    : target.convertToNodeSpaceAR(out, out)
                : null;
        }
        return null;
    }

    static ratioScale(target, designWidth, designHeight, maxScale = 1) {
        if (target && target.isValid) {
            const node = target instanceof cc.Node ? target : target.node;
            let scale = node.width > node.height ? designWidth / node.width : designHeight / node.height;
            if (scale > maxScale) {
                scale = maxScale;
            }
            node.scaleX = scale;
            node.scaleY = scale;
            console.log("scale:", scale);
            return scale;
        }
    }

    static getBoundingBoxToWorld(node) {
        if (!node || !node.isValid) {
            return null;
        }
        const localBox = node.getBoundingBox();
        const worldMatrix = new cc.Mat4();
        node.parent.getWorldMatrix(worldMatrix);
        const worldBox = new cc.Rect();
        localBox.transformMat4(worldBox, worldMatrix);
        return worldBox;
    }

    static getSpineAnimations(target) {
        if (!target) {
            return [];
        }
        let skeletonData = null;
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

    static getSpineAnimationDuration(target, animationName) {
        if (!target) {
            return -1;
        }
        let skeletonData = null;
        let duration = -1;
        if (target instanceof cc.Node || target instanceof sp.Skeleton) {
            const skeleton = target.getComponent(sp.Skeleton);
            if (!skeleton || !skeleton.isValid) {
                return -1;
            }
            duration = skeleton.findAnimation(animationName)?.duration ?? -1;
            if (duration != -1) {
                return duration;
            }
            skeletonData = skeleton.skeletonData;
        } else if (target instanceof sp.SkeletonData) {
            skeletonData = target;
        }
        if (skeletonData) {
            return (
                new sp.spine.Skeleton(skeletonData.getRuntimeData()).data.findAnimation(animationName)?.duration ??
                -1
            );
        }
        return -1;
    }

    static setStatsColor(textColor = cc.Color.WHITE, backgroundColor = cc.color(0, 0, 0, 150)) {
        const profilerNode = cc.find("PROFILER-NODE");
        if (!profilerNode) {
            return cc.warn("未找到统计面板节点！");
        }
        profilerNode.children.forEach((child) => (child.color = textColor));
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

    static AddIrregularityClick() {
        cc.Node.prototype.polygonHit = function (point) {
            const collider = this.getComponent(cc.PolygonCollider);
            if (!collider) {
                return true;
            }
            const localPoint = point.clone();
            this.convertToNodeSpaceAR(localPoint, localPoint);
            return cc.Intersection.pointInPolygon(localPoint, collider.points);
        };
        cc.Node.prototype._hitTestClose = cc.Node.prototype._hitTest;
        cc.Node.prototype._hitTest = function (point, listener) {
            return !!this._hitTestClose(point, listener) && this.polygonHit(point);
        };
    }
}
