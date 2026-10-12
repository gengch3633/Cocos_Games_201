import NodePool from "./NodePool";
import ResMgr from "./ResMgr";
import UIMgr from "./UIMgr";

export enum Position {
    Center = 0,
    Top = 1,
    Bottom = 2,
    BottomLeft = 3
}

interface TipsOption {
    url: string;
    bundleName: string;
    fontSize: number;
    lineHeight: number;
    pos: Position;
    duration: number;
    maxCount: number;
    margin: cc.Rect;
}

const defaultOption: TipsOption = {
    url: "texture/tip",
    bundleName: "cocos-module-common",
    fontSize: 30,
    lineHeight: 35,
    pos: Position.Center,
    duration: 1,
    maxCount: 5,
    margin: new cc.Rect(0, 0, 0, 0)
};

export default class Tips {
    private static option: TipsOption = defaultOption;
    private static pool: any = null;

    public static setGlobalOption(options: Partial<TipsOption>): void {
        Tips.option = Object.assign(defaultOption, options);
        ResMgr.getInstance().loadRes(Tips.option.url, cc.SpriteFrame, null, Tips.option.bundleName);
    }

    public static show(text: string, options?: { duration?: number; pos?: Position }): void {
        if (!Tips.pool) {
            Tips.pool = new NodePool(Tips.option.maxCount).setCreateAction(() => {
                return Tips.createTipNode();
            });
        }
        const duration = options?.duration ?? Tips.option.duration;
        const pos = options?.pos ?? Tips.option.pos;
        const showTip = () => {
            const node = Tips.pool.get();
            if (node) {
                Tips.fillContent(node, text);
                Tips.showContent(node, duration, pos);
            }
        };
        const lendArr = Tips.pool.getLendArr();
        if (lendArr && lendArr.length >= 1) {
            const moveDuration = duration / 10;
            lendArr.forEach((node: cc.Node) => {
                if (node && node.isValid && cc.isValid(node, true)) {
                    cc.tween(node).by(moveDuration, { y: node.height + 5 }).start();
                }
            });
            setTimeout(() => showTip(), 1000 * moveDuration);
        } else {
            showTip();
        }
    }

    private static createTipNode(): cc.Node {
        const tipNode = new cc.Node("tip");
        const sprite = tipNode.addComponent(cc.Sprite);
        tipNode.active = false;
        sprite.sizeMode = cc.Sprite.SizeMode.RAW;
        sprite.type = cc.Sprite.Type.SLICED;
        ResMgr.getInstance().setSpriteFrame(sprite, Tips.option.url, Tips.option.bundleName).then(() => {
            tipNode.emit("load_complete");
        });
        const labelNode = new cc.Node("lab");
        const label = labelNode.addComponent(cc.Label);
        label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        label.verticalAlign = cc.Label.VerticalAlign.CENTER;
        label.fontSize = Tips.option.fontSize;
        label.lineHeight = Tips.option.lineHeight;
        label.enableBold = true;
        tipNode.addChild(labelNode);
        UIMgr.getInstance().getTopLayerNode().addChild(tipNode);
        return tipNode;
    }

    private static fillContent(node: cc.Node, text: string): void {
        const canvasWidth = cc.Canvas.instance.node.width;
        const label = node.getComponentInChildren(cc.Label);
        if (!label) return;
        label.string = text;
        if (text.length * label.fontSize > 3 * canvasWidth / 5) {
            label.node.width = 3 * canvasWidth / 5;
            label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        } else {
            label.node.width = text.length * label.fontSize;
            label.overflow = cc.Label.Overflow.NONE;
        }
        const lines = 1 + ~~(text.length * label.fontSize / (3 * canvasWidth / 5));
        label.node.height = label.fontSize * lines;

        const sprite = node.getComponent(cc.Sprite);
        if (sprite) {
            const updateSize = () => {
                const originalSize = sprite.spriteFrame?.getOriginalSize();
                if (originalSize) {
                    sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                    sprite.node.width = Math.max(originalSize.width, label.node.width + Tips.option.margin.x + Tips.option.margin.width);
                    sprite.node.height = Math.max(originalSize.height, label.node.height + Tips.option.margin.y + Tips.option.margin.height);
                }
            };
            if (sprite.spriteFrame) {
                updateSize();
            } else {
                sprite.node.once("load_complete", updateSize, this);
            }
        } else {
            console.error("未找到Sprite组件");
        }
    }

    private static showContent(node: cc.Node, duration: number, pos: Position): void {
        cc.Tween.stopAllByTarget(node);
        const canvasWidth = cc.Canvas.instance.node.width;
        const canvasHeight = cc.Canvas.instance.node.height;
        if (pos === Position.Center) {
            node.x = node.y = 0;
        } else if (pos === Position.Top) {
            node.x = 0;
            node.y = canvasHeight / 6 * 2;
        } else if (pos === Position.Bottom) {
            node.x = 0;
            node.y = -canvasHeight / 6 * 2;
        } else if (pos === Position.BottomLeft) {
            node.x = -canvasWidth / 5 * 2;
            node.y = -canvasHeight / 5 * 2;
        }
        node.zIndex = cc.macro.MAX_ZINDEX;
        node.opacity = 127.5;
        node.active = true;
        cc.tween(node)
            .to(duration / 3, { opacity: 255 })
            .delay(duration)
            .by(duration / 3, { y: 100, opacity: -255 })
            .call(() => {
                node.active = false;
                Tips.pool.put(node);
            })
            .start();
    }
}