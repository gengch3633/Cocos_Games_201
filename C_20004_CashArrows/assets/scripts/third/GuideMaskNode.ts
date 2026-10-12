const { ccclass, property } = cc._decorator;

enum GuideType {
    Single = "single",
    Drop = "drop"
}

interface GuideTargetInfo {
    offset: cc.Vec2;
    sizeOffst: cc.Vec2;
}

interface GuideSingleOptions {
    offset?: cc.Vec2;
    sizeOffst?: cc.Vec2;
    handOffset?: cc.Vec2;
    blockOpacity?: number;
    needMask?: boolean;
}

@ccclass
export default class GuideMaskNode extends cc.Component {

    @property(cc.Node)
    public blockNode: cc.Node = null;

    @property(cc.Node)
    public maskParent: cc.Node = null;

    @property(cc.Node)
    public handNode: cc.Node = null;

    public targetMap: Map<cc.Node, GuideTargetInfo> = new Map<cc.Node, GuideTargetInfo>();
    public handOffset: cc.Vec2 = cc.Vec2.ZERO;
    public handTweenOffSet1: cc.Vec2 = cc.Vec2.ZERO;
    public handTweenOffSet2: cc.Vec2 = cc.Vec2.ZERO;
    public tweenDuration: number = 1;
    public tweenDelay: number = 0.5;

    private _guideType: GuideType = GuideType.Single;
    private tmpPos1: cc.Vec2 = new cc.Vec2();
    private tmpPos2: cc.Vec2 = new cc.Vec2();

    public static find(path: string): cc.Node {
        if (!path) {
            return null;
        }
        const parts = path.split(/\[(\d+)\]/g);
        let node: cc.Node = null;
        while (parts.length > 0) {
            let part = parts.shift();
            if (!part) {
                continue;
            }
            if (part.indexOf("/") === 0) {
                part = part.substring(1);
            }
            const index = Number.parseInt(part);
            if (isNaN(index)) {
                node = cc.find(part, node);
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

    public static find2(path: string, parent: cc.Node = null): cc.Node {
        if (!path) {
            return null;
        }
        const parts = path.split(/\[(\d+)\]/g);
        let node: cc.Node = parent != null ? parent : cc.Canvas.instance.node;
        while (parts.length > 0) {
            let part = parts.shift();
            if (!part) {
                continue;
            }
            if (part.indexOf("/") === 0) {
                part = part.substring(1);
            }
            const index = Number.parseInt(part);
            if (isNaN(index)) {
                node = cc.find(part, node);
            } else {
                if (!node) {
                    return null;
                }
                const name = node.name;
                node = node.parent.children.filter((child: cc.Node) => child.name === name)[index];
            }
        }
        if (!node) {
            node = cc.find(path, parent);
        }
        return node;
    }

    public get guideType(): GuideType {
        return this._guideType;
    }

    public get handTarget(): cc.Node {
        return this._guideType === GuideType.Single ? this.getTarget(0) : null;
    }

    public findTarget(target: cc.Node | string): cc.Node {
        return target instanceof cc.Node ? target : GuideMaskNode.find(target);
    }

    public showSingle(target: cc.Node | string, offset: cc.Vec2 = cc.Vec2.ZERO, sizeOffst: cc.Vec2 = cc.Vec2.ZERO, handOffset: cc.Vec2 = cc.Vec2.ZERO, blockOpacity: number = 178.5): void {
        cc.Tween.stopAllByTarget(this.handNode);
        this.addTarget(target, offset, sizeOffst);
        this.handOffset = handOffset;
        this.blockNode.opacity = blockOpacity;
        this._guideType = GuideType.Single;
        this.node.active = true;
        this.scheduleOnce(() => {
            this.handSingleTween();
        });
        this.maskParent.active = true;
        this.updateMask();
    }

    public showSingle2(target: cc.Node | string, options?: GuideSingleOptions): void {
        const defaults: Required<GuideSingleOptions> = {
            offset: cc.Vec2.ZERO,
            sizeOffst: cc.Vec2.ZERO,
            handOffset: cc.Vec2.ZERO,
            blockOpacity: 178.5,
            needMask: true
        };
        const opts = Object.assign(defaults, options != null ? options : {});
        this.showSingle(target, opts.offset, opts.sizeOffst, opts.handOffset, opts.blockOpacity);
        this.maskParent.active = opts.needMask;
    }

    public addTarget(target: cc.Node | string, offset: cc.Vec2 = cc.Vec2.ZERO, sizeOffst: cc.Vec2 = cc.Vec2.ZERO): void {
        const node = this.findTarget(target);
        if (node) {
            let info = this.targetMap.get(node);
            if (info) {
                info.offset = offset != null ? offset : cc.Vec2.ZERO;
                info.sizeOffst = sizeOffst != null ? sizeOffst : cc.Vec2.ZERO;
            } else {
                info = {
                    sizeOffst: sizeOffst != null ? sizeOffst : cc.Vec2.ZERO,
                    offset: offset != null ? offset : cc.Vec2.ZERO
                };
                this.targetMap.set(node, info);
            }
        } else {
            console.log(target, "未找到");
        }
    }

    public removeTarget(target: cc.Node | string): void {
        const node = this.findTarget(target);
        if (node) {
            node.targetOff(this);
            this.targetMap.delete(node);
        }
    }

    public clearTarget(): void {
        this.targetMap.clear();
        this.blockNode.parent = this.node;
        this.maskParent.removeAllChildren();
    }

    public update(): void {
        this.updateMask();
    }

    public getTarget(index: number): cc.Node {
        return Array.from(this.targetMap.keys())[index] || null;
    }

    public updateMask(): void {
        if (this.targetMap.size <= 0) {
            return;
        }
        let parentNode: cc.Node = this.maskParent;
        this.targetMap.forEach((info: GuideTargetInfo, target: cc.Node) => {
            if (!target.isValid) {
                return;
            }
            let maskNode = parentNode.children[0];
            if (maskNode === this.blockNode) {
                maskNode = null;
            }
            if (!maskNode) {
                maskNode = this.createMaskNode();
                maskNode.parent = parentNode;
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
            parentNode = maskNode;
        });
        if (this.blockNode.parent !== parentNode) {
            this.blockNode.parent = parentNode;
        }
    }

    public createMaskNode(): cc.Node {
        const mask = new cc.Node("maskNode").addComponent(cc.Mask);
        this.scheduleOnce(() => {
            mask.type = cc.Mask.Type.RECT;
            mask.inverted = true;
        });
        return mask.node;
    }

    public handSingleTween(): void {
        cc.Tween.stopAllByTarget(this.handNode);
        const target = this.handTarget;
        if (target && target.isValid) {
            const worldPos = target.parent.convertToWorldSpaceAR(target.getPosition(this.tmpPos1), this.tmpPos1);
            const localPos = this.handNode.parent.convertToNodeSpaceAR(worldPos, this.tmpPos2);
            localPos.x += this.handOffset.x;
            localPos.y += this.handOffset.y;
            this.handNode.setPosition(localPos);
            cc.tween(this.handNode)
                .by(0.5, { y: 20 } as any)
                .delay(0.25)
                .by(0.5, { y: -20 } as any)
                .call(() => {
                    this.handSingleTween();
                })
                .start();
        }
    }

    public handDropTween(): void {
        const target0 = this.getTarget(0);
        const target1 = this.getTarget(1);
        if (target0 && target0.isValid && target1 && target1.isValid) {
            const worldPos0 = target0.parent.convertToWorldSpaceAR(target0.getPosition());
            const worldPos1 = target1.parent.convertToWorldSpaceAR(target1.getPosition());
            const localPos0 = this.handNode.parent.convertToNodeSpaceAR(worldPos0);
            const localPos1 = this.handNode.parent.convertToNodeSpaceAR(worldPos1);
            localPos0.x += this.handTweenOffSet1.x;
            localPos0.y += this.handTweenOffSet1.y;
            localPos1.x += this.handTweenOffSet2.x;
            localPos1.y += this.handTweenOffSet2.y;
            this.handNode.setPosition(localPos0);
            cc.tween(this.handNode)
                .to(this.tweenDuration, { x: localPos1.x, y: localPos1.y } as any)
                .delay(this.tweenDelay)
                .call(() => {
                    this.handNode.setPosition(localPos0);
                    this.handDropTween();
                })
                .start();
        }
    }

    public hide(): void {
        this.clearTarget();
        cc.Tween.stopAllByTarget(this.handNode);
        this.handTweenOffSet1 = cc.Vec2.ZERO;
        this.handTweenOffSet2 = cc.Vec2.ZERO;
        this.node.active = false;
    }
}