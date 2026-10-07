import AudioMgr from "./AudioMgr";
import LanguageService from "./LanguageService";

const FlyRewardAnimMgr = {
    _iconPool: [] as cc.Node[],
    _labelPool: [] as cc.Node[],

    _getIconNode(): cc.Node {
        if (this._iconPool.length > 0) {
            return this._iconPool.pop()!;
        }
        const node = new cc.Node("flyIcon");
        node.addComponent(cc.Sprite);
        node.setContentSize(40, 40);
        return node;
    },

    _putIconNode(node: cc.Node): void {
        cc.Tween.stopAllByTarget(node);
        node.removeFromParent(false);
        node.opacity = 255;
        node.scale = 1;
        node.setPosition(0, 0);
        this._iconPool.push(node);
    },

    _getLabelNode(): cc.Node {
        if (this._labelPool.length > 0) {
            return this._labelPool.pop()!;
        }
        const node = new cc.Node("flyLabel");
        const label = node.addComponent(cc.Label);
        label.fontSize = 22;
        label.lineHeight = 26;
        label.enableBold = true;
        label.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        node.color = cc.color(230, 26, 76);
        return node;
    },

    _putLabelNode(node: cc.Node): void {
        cc.Tween.stopAllByTarget(node);
        node.removeFromParent(false);
        node.opacity = 255;
        node.setPosition(0, 0);
        this._labelPool.push(node);
    },

    playFlyAnim(options: any): void {
        const iconFrame = options.iconFrame;
        const startPos = options.startPos || cc.v2(0, 0);
        const endPos = options.endPos;
        const parentNode = options.parentNode;
        const count = options.count || 5;
        const startScale = options.startScale !== undefined ? options.startScale : 0.15;
        const endScale = options.endScale !== undefined ? options.endScale : 0.5;
        const launchInterval = options.launchInterval !== undefined ? Math.max(0, options.launchInterval) : 0.06;
        const targetIconNode = options.targetIconNode || null;
        const rewardText = options.rewardText || "";
        const onAllArrived = options.onAllArrived;
        const sfx = options.sfx || "";
        const sfxBundle = options.sfxBundle || "game";

        if (parentNode && parentNode.isValid && iconFrame && endPos) {
            if (sfx) {
                AudioMgr.getInstance().playEffect(sfx, sfxBundle);
            }
            let arrived = 0;
            const midScale = (startScale + endScale) / 2;
            for (let index = 0; index < count; index++) {
                const iconNode = this._getIconNode();
                const sprite = iconNode.getComponent(cc.Sprite);
                if (sprite) {
                    sprite.spriteFrame = iconFrame;
                }
                const angle = 360 * Math.random();
                const radius = 60 * Math.random() + 20;
                const offsetX = radius * Math.cos(angle * Math.PI / 180);
                const offsetY = radius * Math.sin(angle * Math.PI / 180);
                iconNode.setPosition(startPos.x + offsetX, startPos.y + offsetY);
                iconNode.scale = startScale;
                iconNode.opacity = 255;
                iconNode.zIndex = 999;
                parentNode.addChild(iconNode);
                const startX = iconNode.x;
                const startY = iconNode.y;
                const control = cc.v2(0.25 * (startX + endPos.x) - 60, 0.5 * (startY + endPos.y) + 80);
                cc.tween(iconNode)
                    .to(0.15, { scale: midScale }, { easing: "backOut" })
                    .delay(index * launchInterval)
                    .parallel(
                        cc.tween().bezierTo(0.45, control, control, endPos),
                        cc.tween().to(0.45, { scale: endScale })
                    )
                    .call(() => {
                        this._putIconNode(iconNode);
                        if (++arrived >= count) {
                            if (targetIconNode) {
                                this.playIconPop(targetIconNode);
                            }
                            if (rewardText) {
                                this.playFloatText(rewardText, endPos, parentNode);
                            }
                            onAllArrived?.();
                        }
                    })
                    .start();
            }
        } else {
            onAllArrived?.();
        }
    },

    playIconPop(node: cc.Node): void {
        if (node && node.isValid) {
            cc.Tween.stopAllByTarget(node);
            node.scale = 1;
            cc.tween(node)
                .to(0.1, { scale: 1.3 }, { easing: "sineOut" })
                .to(0.15, { scale: 1 }, { easing: "bounceOut" })
                .start();
        }
    },

    playFloatText(text: string, position: cc.Vec2, parent: cc.Node): void {
        if (parent && parent.isValid) {
            const node = this._getLabelNode();
            const label = node.getComponent(cc.Label);
            if (label) {
                label.string = text;
            }
            node.setPosition(position.x + 50, position.y + 5);
            node.opacity = 255;
            node.zIndex = 1000;
            parent.addChild(node);
            cc.tween(node)
                .delay(0.1)
                .parallel(
                    cc.tween().to(0.8, { y: node.y + 60 }, { easing: "sineOut" }),
                    cc.tween().delay(0.3).to(0.5, { opacity: 0 })
                )
                .call(() => {
                    this._putLabelNode(node);
                })
                .start();
        }
    },

    getWorldPos(node: cc.Node): cc.Vec2 | null {
        return node && node.isValid && node.parent
            ? node.parent.convertToWorldSpaceAR(node.position)
            : null;
    },

    formatRewardText(amount: number): string {
        return "+" + LanguageService.formatCurrency(amount);
    },
};

export default FlyRewardAnimMgr;
