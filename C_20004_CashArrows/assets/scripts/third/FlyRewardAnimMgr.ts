import AudioMgr from "./AudioMgr";
import LanguageService from "./LanguageService";

interface IFlyAnimParams {
    iconFrame: cc.SpriteFrame;
    startPos?: cc.Vec2;
    endPos: cc.Vec2;
    parentNode: cc.Node;
    count?: number;
    startScale?: number;
    endScale?: number;
    launchInterval?: number;
    targetIconNode?: cc.Node;
    rewardText?: string;
    onAllArrived?: () => void;
    sfx?: string;
    sfxBundle?: string;
}

export default class FlyRewardAnimMgr {
    private static _iconPool: cc.Node[] = [];
    private static _labelPool: cc.Node[] = [];

    private static _getIconNode(): cc.Node {
        if (this._iconPool.length > 0) {
            return this._iconPool.pop()!;
        }
        const node = new cc.Node("flyIcon");
        node.addComponent(cc.Sprite);
        node.setContentSize(40, 40);
        return node;
    }

    private static _putIconNode(node: cc.Node): void {
        cc.Tween.stopAllByTarget(node);
        node.removeFromParent(false);
        node.opacity = 255;
        node.scale = 1;
        node.setPosition(0, 0);
        this._iconPool.push(node);
    }

    private static _getLabelNode(): cc.Node {
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
    }

    private static _putLabelNode(node: cc.Node): void {
        cc.Tween.stopAllByTarget(node);
        node.removeFromParent(false);
        node.opacity = 255;
        node.setPosition(0, 0);
        this._labelPool.push(node);
    }

    public static playFlyAnim(params: IFlyAnimParams): void {
        const iconFrame = params.iconFrame;
        const startPos = params.startPos || cc.v2(0, 0);
        const endPos = params.endPos;
        const parentNode = params.parentNode;
        const count = params.count || 5;
        const startScale = params.startScale !== undefined ? params.startScale : 0.15;
        const endScale = params.endScale !== undefined ? params.endScale : 0.5;
        const launchInterval = params.launchInterval !== undefined ? Math.max(0, params.launchInterval) : 0.06;
        const targetIconNode = params.targetIconNode || null;
        const rewardText = params.rewardText || "";
        const onAllArrived = params.onAllArrived;
        const sfx = params.sfx || "";
        const sfxBundle = params.sfxBundle || "game";

        if (!(parentNode && parentNode.isValid && iconFrame && endPos)) {
            if (onAllArrived) onAllArrived();
            return;
        }

        if (sfx) {
            AudioMgr.getInstance().playEffect(sfx, sfxBundle);
        }

        let arrivedCount = 0;
        const midScale = (startScale + endScale) / 2;

        for (let loopIndex = 0; loopIndex < count; loopIndex++) {
            const iconNode = this._getIconNode();
            const sprite = iconNode.getComponent(cc.Sprite);
            if (sprite) {
                sprite.spriteFrame = iconFrame;
            }

            const angle = 360 * Math.random();
            const distance = 60 * Math.random() + 20;
            const offsetX = distance * Math.cos(angle * Math.PI / 180);
            const offsetY = distance * Math.sin(angle * Math.PI / 180);

            iconNode.setPosition(startPos.x + offsetX, startPos.y + offsetY);
            iconNode.scale = startScale;
            iconNode.opacity = 255;
            iconNode.zIndex = 999;
            parentNode.addChild(iconNode);

            const originX = iconNode.x;
            const originY = iconNode.y;
            const ctrl = cc.v2(0.25 * (originX + endPos.x) - 60, 0.5 * (originY + endPos.y) + 80);

            cc.tween(iconNode)
                .to(0.15, { scale: midScale }, { easing: "backOut" })
                .delay(loopIndex * launchInterval)
                .parallel(
                    cc.tween().bezierTo(0.45, ctrl, ctrl, endPos),
                    cc.tween().to(0.45, { scale: endScale })
                )
                .call(() => {
                    this._putIconNode(iconNode);
                    arrivedCount++;
                    if (arrivedCount >= count) {
                        if (targetIconNode) this.playIconPop(targetIconNode);
                        if (rewardText) this.playFloatText(rewardText, endPos, parentNode);
                        if (onAllArrived) onAllArrived();
                    }
                })
                .start();
        }
    }

    public static playIconPop(target: cc.Node): void {
        if (target && target.isValid) {
            cc.Tween.stopAllByTarget(target);
            target.scale = 1;
            cc.tween(target)
                .to(0.1, { scale: 1.3 }, { easing: "sineOut" })
                .to(0.15, { scale: 1 }, { easing: "bounceOut" })
                .start();
        }
    }

    public static playFloatText(text: string, endPos: cc.Vec2, parentNode: cc.Node): void {
        if (!(parentNode && parentNode.isValid)) {
            return;
        }

        const labelNode = this._getLabelNode();
        const label = labelNode.getComponent(cc.Label);
        if (label) {
            label.string = text;
        }
        labelNode.setPosition(endPos.x + 50, endPos.y + 5);
        labelNode.opacity = 255;
        labelNode.zIndex = 1000;
        parentNode.addChild(labelNode);

        cc.tween(labelNode)
            .delay(0.1)
            .parallel(
                cc.tween().to(0.8, { y: labelNode.y + 60 }, { easing: "sineOut" }),
                cc.tween().delay(0.3).to(0.5, { opacity: 0 })
            )
            .call(() => {
                this._putLabelNode(labelNode);
            })
            .start();
    }

    public static getWorldPos(node: cc.Node): cc.Vec2 | null {
        if (node && node.isValid && node.parent) {
            return node.parent.convertToWorldSpaceAR(cc.v2(node.position.x, node.position.y));
        }
        return null;
    }

    public static formatRewardText(value: number): string {
        return "+" + LanguageService.formatCurrency(value);
    }
}