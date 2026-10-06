import NodePool from "./NodePool";
import ResMgr from "./ResMgr";
import UIMgr from "./UIMgr";

export enum Position {
    Center = 0,
    Top = 1,
    Bottom = 2,
    BottomLeft = 3
}

const defaultOption = {
    url: " texture/ tip ",
    bundleName: " cocos- module- common ",
    fontSize: 30,
    lineHeight: 35,
    pos: Position.Center,
    duration: 1,
    maxCount: 5,
    margin: new cc.Rect(0, 0, 0, 0)
};

export default class Tips {
    static option = defaultOption;
    static pool: NodePool = null;

    static setGlobalOption(option: any) {
        option = Object.assign(defaultOption, option);
        Tips.option = option;
        ResMgr.getInstance().loadRes(option.url, cc.SpriteFrame, null, option.bundleName);
    }

    static show(text: string, options?: any) {
        var duration, pos;
        Tips.pool || (Tips.pool = new NodePool(Tips.option.maxCount).setCreateAction(function () {
            return Tips.createTipNode();
        }));
        var showDuration = null !== (duration = null == options ? void 0 : options.duration) && void 0 !== duration ? duration : Tips.option.duration,
            showPos = null !== (pos = null == options ? void 0 : options.pos) && void 0 !== pos ? pos : Tips.option.pos,
            showOne = function () {
                var node = Tips.pool.get();
                if (node) {
                    Tips.fillContent(node, text);
                    Tips.showContent(node, showDuration, showPos);
                }
            },
            lendArr = Tips.pool.getLendArr();
        if ((null == lendArr ? void 0 : lendArr.length) >= 1) {
            var step = showDuration / 10;
            lendArr.forEach(function (node) {
                node && node.isValid && cc.isValid(node, true) && cc.tween(node).by(step, {
                    y: node.height + 5
                }).start();
            });
            setTimeout(function () {
                return showOne();
            }, 1e3 * step);
        } else {
            showOne();
        }
    }

    static createTipNode() {
        var sprite = new cc.Node(" tip ").addComponent(cc.Sprite);
        sprite.node.active = false;
        sprite.sizeMode = cc.Sprite.SizeMode.RAW;
        sprite.type = cc.Sprite.Type.SLICED;
        ResMgr.getInstance().setSpriteFrame(sprite, Tips.option.url, Tips.option.bundleName).then(function () {
            var node;
            return null === (node = null == sprite ? void 0 : sprite.node) || void 0 === node ? void 0 : node.emit(" load_complete ");
        });
        var label = new cc.Node(" lab ").addComponent(cc.Label);
        label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        label.verticalAlign = cc.Label.VerticalAlign.CENTER;
        label.fontSize = Tips.option.fontSize;
        label.lineHeight = Tips.option.lineHeight;
        label.enableBold = true;
        sprite.node.addChild(label.node);
        UIMgr.getInstance().getTopLayerNode().addChild(sprite.node);
        return sprite.node;
    }

    static fillContent(node: cc.Node, text: string) {
        var spriteNode, canvasWidth = cc.Canvas.instance.node.width,
            label = node.getComponentInChildren(cc.Label);
        label.string = text;
        if (text.length * label.fontSize > 3 * canvasWidth / 5) {
            label.node.width = 3 * canvasWidth / 5;
            label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        } else {
            label.node.width = text.length * label.fontSize;
            label.overflow = cc.Label.Overflow.NONE;
        }
        var lineCount = 1 + ~~(text.length * label.fontSize / (3 * canvasWidth / 5));
        label.node.height = label.fontSize * lineCount;
        var sprite = node.getComponent(cc.Sprite);
        if (sprite) {
            var resize = function () {
                var size, original = null === (size = null == sprite ? void 0 : sprite.spriteFrame) || void 0 === size ? void 0 : size.getOriginalSize();
                if (original) {
                    sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                    sprite.node.width = Math.max(original.width, label.node.width + Tips.option.margin.x + Tips.option.margin.width);
                    sprite.node.height = Math.max(original.height, label.node.height + Tips.option.margin.y + Tips.option.margin.height);
                }
            };
            sprite.spriteFrame ? resize() : null === (spriteNode = null == sprite ? void 0 : sprite.node) || void 0 === spriteNode || spriteNode.once(" load_complete ", resize, this);
        } else {
            console.error(" 未找到Sprite组件 ");
        }
    }

    static showContent(node: cc.Node, duration: number, pos: Position) {
        cc.Tween.stopAllByTarget(node);
        var canvasWidth = cc.Canvas.instance.node.width,
            canvasHeight = cc.Canvas.instance.node.height;
        if (pos == Position.Center) {
            node.x = node.y = 0;
        } else if (pos == Position.Top) {
            node.x = 0;
            node.y = canvasHeight / 6 * 2;
        } else if (pos == Position.Bottom) {
            node.x = 0;
            node.y = -canvasHeight / 6 * 2;
        } else if (pos == Position.BottomLeft) {
            node.x = -canvasWidth / 5 * 2;
            node.y = -canvasHeight / 5 * 2;
        }
        node.zIndex = cc.macro.MAX_ZINDEX;
        node.opacity = 127.5;
        node.active = true;
        cc.tween(node).to(duration / 3, {
            opacity: 255
        }).delay(duration).by(duration / 3, {
            y: 100,
            opacity: -255
        }).call(function () {
            node.active = false;
            Tips.pool.put(node);
        }).start();
    }
}
