import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Level_Bar extends cc.Component {
    @property(cc.Node)
    maskNode: cc.Node = null;

    @property(cc.Node)
    levelRootNode: cc.Node = null;

    @property(cc.RichText)
    roundRichText: cc.RichText = null;

    @property(cc.Node)
    tipNode: cc.Node = null;

    @property(cc.SpriteFrame)
    completedSpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    highlightSpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    normalSpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    targetSpriteFrame: cc.SpriteFrame = null;

    @property()
    changeWithScene: boolean = true;

    private _period: number = 1;
    private _cacheVec3: cc.Vec3 = cc.v3();

    _updateUI(): void {
        const passLevel = FrameSDK.frameData.gameData.passLevel;
        let minLevel = 1;
        let maxLevel = Number.MAX_SAFE_INTEGER;
        for (const conf of FrameData.FRAME_CONF.CoinConf) {
            if (passLevel < conf.rdm_1) {
                maxLevel = Math.min(maxLevel, conf.rdm_1);
            } else {
                minLevel = Math.max(minLevel, conf.rdm_1);
                if (passLevel < conf.rdm_3) {
                    maxLevel = Math.min(maxLevel, conf.rdm_3);
                } else {
                    minLevel = Math.max(minLevel, conf.rdm_3);
                }
            }
        }
        if (maxLevel === Number.MAX_SAFE_INTEGER) {
            this._period = 1;
            maxLevel = FrameSDK.frameData.gameData.passLevel + 1;
            this.tipNode.opacity = 0;
        } else {
            this.tipNode.opacity = 255;
        }
        const offset = Math.floor(Math.max(0, passLevel - minLevel) / this._period);
        let startLevel = minLevel + this._period * offset;
        let span = maxLevel - startLevel;
        if (span <= 1) {
            startLevel = Math.max(1, startLevel - this._period);
            span = maxLevel - startLevel;
        }
        const children = this.levelRootNode.children;
        const count = children.length;
        for (let i = 0; i < count - 1; i++) {
            const node = children[i];
            const level = startLevel + i;
            node.active = i < span;
            cc.find("levelLabel", node).getComponent(cc.Label).string = "" + level;
            if (level <= passLevel) {
                node.getComponent(cc.Sprite).spriteFrame = this.completedSpriteFrame;
                cc.find("gou", node).active = true;
            } else {
                node.getComponent(cc.Sprite).spriteFrame =
                    level === passLevel + 1 ? this.highlightSpriteFrame : this.normalSpriteFrame;
                cc.find("gou", node).active = false;
            }
        }
        const lastNode = children[count - 1];
        cc.find("levelLabel", lastNode).getComponent(cc.Label).string = "" + maxLevel;
        cc.find("gou", lastNode).active = maxLevel <= passLevel;
        if (this.tipNode.opacity > 0) {
            lastNode.getComponent(cc.Sprite).spriteFrame = this.targetSpriteFrame;
        } else {
            lastNode.getComponent(cc.Sprite).spriteFrame =
                maxLevel <= passLevel
                    ? this.completedSpriteFrame
                    : maxLevel === passLevel + 1
                      ? this.highlightSpriteFrame
                      : this.normalSpriteFrame;
        }
        const highlightIndex = passLevel + 1 === maxLevel ? count - 1 : passLevel + 1 - startLevel;
        const currentRound = FrameSDK.frameData.gameData.currentRound;
        const totalRound = FrameSDK.frameData.gameData.totalRound;
        if (highlightIndex < 0) {
            this.maskNode.width = 0;
        } else if (highlightIndex >= count) {
            this.maskNode.width = this.maskNode.parent.width;
        } else {
            children[highlightIndex].convertToWorldSpaceAR(cc.Vec3.ZERO, this._cacheVec3);
            this.maskNode.convertToNodeSpaceAR(this._cacheVec3, this._cacheVec3);
            this.maskNode.width = this._cacheVec3.x;
        }
        this.roundRichText.string =
            "<outline color= #C16711 width=2>pkey_001</outline>??&value1==<color= #86FF04>" +
            currentRound +
            "</c>&value2==" +
            totalRound;
        this.roundRichText.node.parent.opacity =
            totalRound > 1 && passLevel + 1 <= maxLevel ? 255 : 0;
        this.roundRichText.node.parent.x = children[highlightIndex]?.x ?? 99999;
        if (totalRound > 1 && highlightIndex === count - 1) {
            this.tipNode.opacity = 0;
        }
        if (this.changeWithScene) {
            this.node.active = !FrameSDK.frameData.gameData.noProfitAd;
            const scene = FrameSDK.frameData.gameData.currentScene;
            this.node.scale = scene === "game" ? 0.8 : 0;
        }
    }

    onLoad(): void {
        cc.director.on("UPDATA_LEVEL", this._updateUI, this);
        this._period = Math.max(1, this.levelRootNode.children.length - 2);
        cc.tween(this.roundRichText.node.parent)
            .by(1, { y: 3 }, { easing: "sineInOut" })
            .by(1, { y: -3 }, { easing: "sineInOut" })
            .union()
            .repeatForever()
            .start();
        cc.tween(this.tipNode)
            .to(0.5, { scale: 0.9 }, { easing: "sineInOut" })
            .to(0.5, { scale: 1 }, { easing: "sineInOut" })
            .union()
            .repeatForever()
            .start();
        this._updateUI();
    }
}
