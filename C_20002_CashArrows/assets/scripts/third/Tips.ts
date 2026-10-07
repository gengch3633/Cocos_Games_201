import NodePool from "./NodePool";
import ResMgr from "./ResMgr";
import UIMgr from "./UIMgr";

export enum Position {
    Center = 0,
    Top = 1,
    Bottom = 2,
    BottomLeft = 3,
}

const defaultOption = {
    url: "texture/tip",
    bundleName: "cocos-module-common",
    fontSize: 30,
    lineHeight: 35,
    pos: Position.Center,
    duration: 1,
    maxCount: 5,
    margin: new cc.Rect(0, 0, 0, 0),
};

interface TipShowOption {
    duration?: number;
    pos?: Position;
}

export default class Tips {
    static option = defaultOption;
    static pool: NodePool | null = null;

    static setGlobalOption(option: Partial<typeof defaultOption>): void {
        Tips.option = Object.assign({}, defaultOption, option);
        ResMgr.getInstance().loadRes(Tips.option.url, cc.SpriteFrame, null, Tips.option.bundleName);
    }

    static show(content: string, option?: TipShowOption): void {
        if (!Tips.pool) {
            Tips.pool = new NodePool(Tips.option.maxCount).setCreateAction(() => {
                return Tips.createTipNode();
            });
        }
        const duration = option?.duration ?? Tips.option.duration;
        const pos = option?.pos ?? Tips.option.pos;
        const showTip = () => {
            const node = Tips.pool!.get();
            if (node) {
                Tips.fillContent(node, content);
                Tips.showContent(node, duration, pos);
            }
        };
        const lendArr = Tips.pool.getLendArr();
        if (lendArr?.length >= 1) {
            const offsetDuration = duration / 10;
            lendArr.forEach((node) => {
                if (node && node.isValid && cc.isValid(node, true)) {
                    cc.tween(node).by(offsetDuration, {
                        y: node.height + 5,
                    }).start();
                }
            });
            setTimeout(() => showTip(), 1000 * offsetDuration);
        } else {
            showTip();
        }
    }

    static createTipNode(): cc.Node {
        const sprite = new cc.Node("tip").addComponent(cc.Sprite);
        sprite.node.active = false;
        sprite.sizeMode = cc.Sprite.SizeMode.RAW;
        sprite.type = cc.Sprite.Type.SLICED;
        ResMgr.getInstance().setSpriteFrame(sprite, Tips.option.url, Tips.option.bundleName).then(() => {
            sprite?.node?.emit("load_complete");
        });
        const label = new cc.Node("lab").addComponent(cc.Label);
        label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        label.verticalAlign = cc.Label.VerticalAlign.CENTER;
        label.fontSize = Tips.option.fontSize;
        label.lineHeight = Tips.option.lineHeight;
        label.enableBold = true;
        sprite.node.addChild(label.node);
        UIMgr.getInstance().getTopLayerNode().addChild(sprite.node);
        return sprite.node;
    }

    static fillContent(node: cc.Node, content: string): void {
        const canvasWidth = cc.Canvas.instance.node.width;
        const label = node.getComponentInChildren(cc.Label)!;
        label.string = content;
        if (content.length * label.fontSize > (3 * canvasWidth) / 5) {
            label.node.width = (3 * canvasWidth) / 5;
            label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        } else {
            label.node.width = content.length * label.fontSize;
            label.overflow = cc.Label.Overflow.NONE;
        }
        const lineCount = 1 + ~~(content.length * label.fontSize / ((3 * canvasWidth) / 5));
        label.node.height = label.fontSize * lineCount;
        const sprite = node.getComponent(cc.Sprite);
        if (sprite) {
            const resizeSprite = () => {
                const originalSize = sprite?.spriteFrame?.getOriginalSize();
                if (originalSize) {
                    sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                    sprite.node.width = Math.max(originalSize.width, label.node.width + Tips.option.margin.x + Tips.option.margin.width);
                    sprite.node.height = Math.max(originalSize.height, label.node.height + Tips.option.margin.y + Tips.option.margin.height);
                }
            };
            if (sprite.spriteFrame) {
                resizeSprite();
            } else {
                sprite.node.once("load_complete", resizeSprite, this);
            }
        } else {
            console.error("未找到Sprite组件");
        }
    }

    static showContent(node: cc.Node, duration: number, pos: Position): void {
        cc.Tween.stopAllByTarget(node);
        const canvasWidth = cc.Canvas.instance.node.width;
        const canvasHeight = cc.Canvas.instance.node.height;
        if (pos === Position.Center) {
            node.x = 0;
            node.y = 0;
        } else if (pos === Position.Top) {
            node.x = 0;
            node.y = (canvasHeight / 6) * 2;
        } else if (pos === Position.Bottom) {
            node.x = 0;
            node.y = (-canvasHeight / 6) * 2;
        } else if (pos === Position.BottomLeft) {
            node.x = (-canvasWidth / 5) * 2;
            node.y = (-canvasHeight / 5) * 2;
        }
        node.zIndex = cc.macro.MAX_ZINDEX;
        node.opacity = 127.5;
        node.active = true;
        cc.tween(node).to(duration / 3, {
            opacity: 255,
        }).delay(duration).by(duration / 3, {
            y: 100,
            opacity: -255,
        }).call(() => {
            node.active = false;
            Tips.pool!.put(node);
        }).start();
    }
}
