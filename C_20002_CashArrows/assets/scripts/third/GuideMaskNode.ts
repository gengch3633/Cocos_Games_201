const { ccclass, property } = cc._decorator;

enum GuideType {
    Single = "single",
    Drop = "drop",
}

interface TargetInfo {
    offset: cc.Vec2;
    sizeOffst: cc.Vec2;
}

@ccclass
export default class GuideMaskNode extends cc.Component {
    @property(cc.Node)
    blockNode: cc.Node | null = null;

    @property(cc.Node)
    maskParent: cc.Node | null = null;

    @property(cc.Node)
    handNode: cc.Node | null = null;

    _guideType = GuideType.Single;
    targetMap = new Map<cc.Node, TargetInfo>();
    tmpPos1 = new cc.Vec2();
    tmpPos2 = new cc.Vec2();
    handOffset = cc.Vec2.ZERO;
    handTweenOffSet1 = cc.Vec2.ZERO;
    handTweenOffSet2 = cc.Vec2.ZERO;
    tweenDuration = 1;
    tweenDelay = 0.5;

    static find(path: string): cc.Node | null {
        if (!path) {
            return null;
        }
        const parts = path.split(/\[(\d+)\]/g);
        let node: cc.Node | null = null;
        while (parts.length > 0) {
            let segment = parts.shift();
            if (!segment) {
                continue;
            }
            if (segment.indexOf("/") === 0) {
                segment = segment.substring(1);
            }
            const index = Number.parseInt(segment);
            if (isNaN(index)) {
                node = cc.find(segment, node);
            } else {
                if (!node) {
                    return null;
                }
                node = node.parent.children[index];
            }
        }
        if (!node) {
            node = cc.find(path);
        }
        return node;
    }

    static find2(path: string, root: cc.Node | null = null): cc.Node | null {
        if (!path) {
            return null;
        }
        const parts = path.split(/\[(\d+)\]/g);
        let node: cc.Node | null = root != null ? root : cc.Canvas.instance.node;
        while (parts.length > 0) {
            let segment = parts.shift();
            if (!segment) {
                continue;
            }
            if (segment.indexOf("/") === 0) {
                segment = segment.substring(1);
            }
            const index = Number.parseInt(segment);
            if (isNaN(index)) {
                node = cc.find(segment, node);
            } else {
                if (!node) {
                    return null;
                }
                const name = node.name;
                node = node.parent.children.filter((child) => child.name === name)[index];
            }
        }
        if (!node) {
            node = cc.find(path, root);
        }
        return node;
    }

    get guideType(): GuideType {
        return this._guideType;
    }

    findTarget(target: cc.Node | string): cc.Node | null {
        return target instanceof cc.Node ? target : GuideMaskNode.find(target);
    }

    showSingle(
        target: cc.Node | string,
        offset: cc.Vec2 = cc.Vec2.ZERO,
        sizeOffset: cc.Vec2 = cc.Vec2.ZERO,
        handOffset: cc.Vec2 = cc.Vec2.ZERO,
        blockOpacity: number = 178.5
    ): void {
        if (this.handNode) {
            cc.Tween.stopAllByTarget(this.handNode);
        }
        this.addTarget(target, offset, sizeOffset);
        this.handOffset = handOffset;
        if (this.blockNode) {
            this.blockNode.opacity = blockOpacity;
        }
        this._guideType = GuideType.Single;
        this.node.active = true;
        this.scheduleOnce(() => this.handSingleTween());
        if (this.maskParent) {
            this.maskParent.active = true;
        }
        this.updateMask();
    }

    showSingle2(target: cc.Node | string, options?: Partial<{
        offset: cc.Vec2;
        sizeOffst: cc.Vec2;
        handOffset: cc.Vec2;
        blockOpacity: number;
        needMask: boolean;
    }>): void {
        const defaults = {
            offset: cc.Vec2.ZERO,
            sizeOffst: cc.Vec2.ZERO,
            handOffset: cc.Vec2.ZERO,
            blockOpacity: 178.5,
            needMask: true,
        };
        const merged = Object.assign(defaults, options ?? {});
        this.showSingle(target, merged.offset, merged.sizeOffst, merged.handOffset, merged.blockOpacity);
        if (this.maskParent) {
            this.maskParent.active = merged.needMask;
        }
    }

    get handTarget(): cc.Node | null {
        return this._guideType === GuideType.Single ? this.getTarget(0) : null;
    }

    addTarget(target: cc.Node | string, offset: cc.Vec2 = cc.Vec2.ZERO, sizeOffset: cc.Vec2 = cc.Vec2.ZERO): void {
        const node = this.findTarget(target);
        if (node) {
            const existing = this.targetMap.get(node);
            if (existing) {
                existing.offset = offset ?? cc.Vec2.ZERO;
                existing.sizeOffst = sizeOffset ?? cc.Vec2.ZERO;
            } else {
                this.targetMap.set(node, {
                    sizeOffst: sizeOffset ?? cc.Vec2.ZERO,
                    offset: offset ?? cc.Vec2.ZERO,
                });
            }
        } else {
            console.log(target, "未找到");
        }
    }

    removeTarget(target: cc.Node | string): void {
        const node = this.findTarget(target);
        if (node) {
            node.targetOff(this);
            this.targetMap.delete(node);
        }
    }

    clearTarget(): void {
        this.targetMap.clear();
        if (this.blockNode) {
            this.blockNode.parent = this.node;
        }
        this.maskParent?.removeAllChildren();
    }

    update(): void {
        this.updateMask();
    }

    getTarget(index: number): cc.Node | null {
        return Array.from(this.targetMap.keys())[index] || null;
    }

    updateMask(): void {
        if (this.targetMap.size <= 0 || !this.maskParent) {
            return;
        }
        let parent = this.maskParent;
        this.targetMap.forEach((info, target) => {
            if (target.isValid) {
                let maskNode = parent.children[0];
                if (maskNode === this.blockNode) {
                    maskNode = null as any;
                }
                if (!maskNode) {
                    maskNode = this.createMaskNode();
                    maskNode.parent = parent;
                }
                const worldPos = target.parent.convertToWorldSpaceAR(target.getPosition(this.tmpPos1), this.tmpPos1);
                const localPos = maskNode.parent.convertToNodeSpaceAR(worldPos, this.tmpPos2);
                localPos.x += info.offset.x;
                localPos.y += info.offset.y;
                maskNode.anchorX = target.anchorX;
                maskNode.anchorY = target.anchorY;
                maskNode.setPosition(localPos);
                maskNode.width = target.width + info.sizeOffst.x;
                maskNode.height = target.height + info.sizeOffst.y;
                parent = maskNode;
            }
        });
        if (this.blockNode && this.blockNode.parent !== parent) {
            this.blockNode.parent = parent;
        }
    }

    createMaskNode(): cc.Node {
        const mask = new cc.Node("maskNode").addComponent(cc.Mask);
        this.scheduleOnce(() => {
            mask.type = cc.Mask.Type.RECT;
            mask.inverted = true;
        });
        return mask.node;
    }

    handSingleTween(): void {
        if (!this.handNode) {
            return;
        }
        cc.Tween.stopAllByTarget(this.handNode);
        const target = this.handTarget;
        if (target && target.isValid) {
            const worldPos = target.parent.convertToWorldSpaceAR(target.getPosition(this.tmpPos1), this.tmpPos1);
            const localPos = this.handNode.parent.convertToNodeSpaceAR(worldPos, this.tmpPos2);
            localPos.x += this.handOffset.x;
            localPos.y += this.handOffset.y;
            this.handNode.setPosition(localPos);
            cc.tween(this.handNode)
                .by(0.5, { y: 20 })
                .delay(0.25)
                .by(0.5, { y: -20 })
                .call(() => this.handSingleTween())
                .start();
        }
    }

    handDropTween(): void {
        if (!this.handNode) {
            return;
        }
        const startTarget = this.getTarget(0);
        const endTarget = this.getTarget(1);
        if (startTarget && startTarget.isValid && endTarget && endTarget.isValid) {
            const startWorld = startTarget.parent.convertToWorldSpaceAR(startTarget.getPosition());
            const endWorld = endTarget.parent.convertToWorldSpaceAR(endTarget.getPosition());
            const startLocal = this.handNode.parent.convertToNodeSpaceAR(startWorld);
            const endLocal = this.handNode.parent.convertToNodeSpaceAR(endWorld);
            startLocal.x += this.handTweenOffSet1.x;
            startLocal.y += this.handTweenOffSet1.y;
            endLocal.x += this.handTweenOffSet2.x;
            endLocal.y += this.handTweenOffSet2.y;
            this.handNode.setPosition(startLocal);
            cc.tween(this.handNode)
                .to(this.tweenDuration, { x: endLocal.x, y: endLocal.y })
                .delay(this.tweenDelay)
                .call(() => {
                    this.handNode!.setPosition(startLocal);
                    this.handDropTween();
                })
                .start();
        }
    }

    hide(): void {
        this.clearTarget();
        if (this.handNode) {
            cc.Tween.stopAllByTarget(this.handNode);
        }
        this.handTweenOffSet1 = cc.Vec2.ZERO;
        this.handTweenOffSet2 = cc.Vec2.ZERO;
        this.node.active = false;
    }
}
