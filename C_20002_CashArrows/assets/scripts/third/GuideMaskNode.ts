const { ccclass, property } = cc._decorator;

export enum GuideType {
    Single = "single",
    Drop = "drop"
}

interface TargetInfo {
    offset: cc.Vec2;
    sizeOffst: cc.Vec2;
}

interface ShowSingle2Options {
    offset?: cc.Vec2;
    sizeOffst?: cc.Vec2;
    handOffset?: cc.Vec2;
    blockOpacity?: number;
    needMask?: boolean;
}

@ccclass
export default class GuideMaskNode extends cc.Component {
    @property(cc.Node)
    blockNode: cc.Node = null;

    @property(cc.Node)
    maskParent: cc.Node = null;

    @property(cc.Node)
    handNode: cc.Node = null;

    private _guideType: GuideType = GuideType.Single;
    targetMap: Map<cc.Node, TargetInfo> = new Map();
    tmpPos1: cc.Vec2 = new cc.Vec2();
    tmpPos2: cc.Vec2 = new cc.Vec2();
    handOffset: cc.Vec2 = cc.Vec2.ZERO;
    handTweenOffSet1: cc.Vec2 = cc.Vec2.ZERO;
    handTweenOffSet2: cc.Vec2 = cc.Vec2.ZERO;
    tweenDuration: number = 1;
    tweenDelay: number = 0.5;

    get guideType(): GuideType {
        return this._guideType;
    }

    get handTarget(): cc.Node {
        return this._guideType === GuideType.Single ? this.getTarget(0) : null;
    }

    static find(path: string): cc.Node {
        if (!path) {
            return null;
        }
        const parts = path.split(/\[(\d+)\]/g);
        let node: cc.Node = null;
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

    static find2(path: string, root: cc.Node = null): cc.Node {
        if (!path) {
            return null;
        }
        const parts = path.split(/\[(\d+)\]/g);
        let node: cc.Node = root != null ? root : cc.Canvas.instance.node;
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

    findTarget(target: cc.Node | string): cc.Node {
        return target instanceof cc.Node ? target : GuideMaskNode.find(target as string);
    }

    showSingle(
        target: cc.Node | string,
        offset: cc.Vec2 = cc.Vec2.ZERO,
        sizeOffst: cc.Vec2 = cc.Vec2.ZERO,
        handOffset: cc.Vec2 = cc.Vec2.ZERO,
        blockOpacity: number = 178.5
    ): void {
        cc.Tween.stopAllByTarget(this.handNode);
        this.addTarget(target, offset, sizeOffst);
        this.handOffset = handOffset;
        this.blockNode.opacity = blockOpacity;
        this._guideType = GuideType.Single;
        this.node.active = true;
        this.scheduleOnce(() => this.handSingleTween());
        this.maskParent.active = true;
        this.updateMask();
    }

    showSingle2(target: cc.Node | string, options?: ShowSingle2Options): void {
        const defaults: ShowSingle2Options = {
            offset: cc.Vec2.ZERO,
            sizeOffst: cc.Vec2.ZERO,
            handOffset: cc.Vec2.ZERO,
            blockOpacity: 178.5,
            needMask: true
        };
        const opts = Object.assign(defaults, options ?? {});
        this.showSingle(target, opts.offset, opts.sizeOffst, opts.handOffset, opts.blockOpacity);
        this.maskParent.active = opts.needMask;
    }

    addTarget(target: cc.Node | string, offset: cc.Vec2 = cc.Vec2.ZERO, sizeOffst: cc.Vec2 = cc.Vec2.ZERO): void {
        const node = this.findTarget(target);
        if (node) {
            let info = this.targetMap.get(node);
            if (info) {
                info.offset = offset ?? cc.Vec2.ZERO;
                info.sizeOffst = sizeOffst ?? cc.Vec2.ZERO;
            } else {
                info = {
                    sizeOffst: sizeOffst ?? cc.Vec2.ZERO,
                    offset: offset ?? cc.Vec2.ZERO
                };
                this.targetMap.set(node, info);
            }
        } else {
            console.log(target, "未找到");
        }
    }

    removeTarget(target: cc.Node | string): void {
        const node = this.findTarget(target);
        if (node) {
            node?.targetOff(this);
            this.targetMap.delete(node);
        }
    }

    clearTarget(): void {
        this.targetMap.clear();
        this.blockNode.parent = this.node;
        this.maskParent.removeAllChildren();
    }

    update(): void {
        this.updateMask();
    }

    getTarget(index: number): cc.Node {
        return Array.from(this.targetMap.keys())[index];
    }

    updateMask(): void {
        if (this.targetMap.size <= 0) {
            return;
        }
        let parent = this.maskParent;
        this.targetMap.forEach((info, target) => {
            if (target.isValid) {
                let maskNode = parent.children[0];
                if (maskNode === this.blockNode) {
                    maskNode = null;
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
        if (this.blockNode.parent !== parent) {
            this.blockNode.parent = parent;
        }
    }

    createMaskNode(): cc.Node {
        const maskComp = new cc.Node("maskNode").addComponent(cc.Mask);
        this.scheduleOnce(() => {
            maskComp.type = cc.Mask.Type.RECT;
            maskComp.inverted = true;
        });
        return maskComp.node;
    }

    handSingleTween(): void {
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
        const from = this.getTarget(0);
        const to = this.getTarget(1);
        if (from && from.isValid && to && to.isValid) {
            const fromWorld = from.parent.convertToWorldSpaceAR(from.getPosition());
            const toWorld = to.parent.convertToWorldSpaceAR(to.getPosition());
            const fromLocal = this.handNode.parent.convertToNodeSpaceAR(fromWorld);
            const toLocal = this.handNode.parent.convertToNodeSpaceAR(toWorld);
            fromLocal.x += this.handTweenOffSet1.x;
            fromLocal.y += this.handTweenOffSet1.y;
            toLocal.x += this.handTweenOffSet2.x;
            toLocal.y += this.handTweenOffSet2.y;
            this.handNode.setPosition(fromLocal);
            cc.tween(this.handNode)
                .to(this.tweenDuration, { x: toLocal.x, y: toLocal.y })
                .delay(this.tweenDelay)
                .call(() => {
                    this.handNode.setPosition(fromLocal);
                    this.handDropTween();
                })
                .start();
        }
    }

    hide(): void {
        this.clearTarget();
        cc.Tween.stopAllByTarget(this.handNode);
        this.handTweenOffSet1 = cc.Vec2.ZERO;
        this.handTweenOffSet2 = cc.Vec2.ZERO;
        this.node.active = false;
    }
}
