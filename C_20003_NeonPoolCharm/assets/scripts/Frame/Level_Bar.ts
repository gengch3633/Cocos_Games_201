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

    @property
    changeWithScene: boolean = true;

    _period: number = 1;
    _cacheVec3: cc.Vec3 = cc.v3();

    _updateUI() {
        const passLevel = FrameSDK.frameData.gameData.passLevel;
        let startLevel = 1;
        let nextLevel = Number.MAX_SAFE_INTEGER;
        const coinConf = FrameData.FRAME_CONF.CoinConf;
        for (let i = 0; i < coinConf.length; i++) {
            const conf = coinConf[i];
            if (passLevel < conf.rdm_1) {
                nextLevel = Math.min(nextLevel, conf.rdm_1);
            } else {
                startLevel = Math.max(startLevel, conf.rdm_1);
                if (passLevel < conf.rdm_3) {
                    nextLevel = Math.min(nextLevel, conf.rdm_3);
                } else {
                    startLevel = Math.max(startLevel, conf.rdm_3);
                }
            }
        }
        if (nextLevel === Number.MAX_SAFE_INTEGER) {
            this._period = 1;
            nextLevel = FrameSDK.frameData.gameData.passLevel + 1;
            this.tipNode.opacity = 0;
        } else {
            this.tipNode.opacity = 255;
        }
        const page = Math.floor(Math.max(0, passLevel - startLevel) / this._period);
        let pageStart = startLevel + this._period * page;
        let span = nextLevel - pageStart;
        if (span <= 1) {
            pageStart = Math.max(1, pageStart - this._period);
            span = nextLevel - pageStart;
        }
        const children = this.levelRootNode.children;
        const count = children.length;
        for (let f = 0; f < count - 1; f++) {
            const item = children[f];
            const level = pageStart + f;
            item.active = f < span;
            cc.find("levelLabel", item).getComponent(cc.Label).string = "" + level;
            if (level <= passLevel) {
                item.getComponent(cc.Sprite).spriteFrame = this.completedSpriteFrame;
                cc.find("gou", item).active = true;
            } else {
                item.getComponent(cc.Sprite).spriteFrame = level === passLevel + 1 ? this.highlightSpriteFrame : this.normalSpriteFrame;
                cc.find("gou", item).active = false;
            }
        }
        const last = children[count - 1];
        cc.find("levelLabel", last).getComponent(cc.Label).string = "" + nextLevel;
        cc.find("gou", last).active = nextLevel <= passLevel;
        if (this.tipNode.opacity > 0) {
            last.getComponent(cc.Sprite).spriteFrame = this.targetSpriteFrame;
        } else {
            last.getComponent(cc.Sprite).spriteFrame = nextLevel <= passLevel ? this.completedSpriteFrame : nextLevel === passLevel + 1 ? this.highlightSpriteFrame : this.normalSpriteFrame;
        }
        const index = passLevel + 1 === nextLevel ? count - 1 : passLevel + 1 - pageStart;
        const currentRound = FrameSDK.frameData.gameData.currentRound;
        const totalRound = FrameSDK.frameData.gameData.totalRound;
        if (index < 0) {
            this.maskNode.width = 0;
        } else if (index >= count) {
            this.maskNode.width = this.maskNode.parent.width;
        } else {
            children[index].convertToWorldSpaceAR(cc.Vec3.ZERO, this._cacheVec3);
            this.maskNode.convertToNodeSpaceAR(this._cacheVec3, this._cacheVec3);
            this.maskNode.width = this._cacheVec3.x;
        }
        this.roundRichText.string = "<outline color= #C16711 width=2>pkey_001</outline>??&value1==<color= #86FF04>" + currentRound + "</c>&value2==" + totalRound;
        this.roundRichText.node.parent.opacity = totalRound > 1 && passLevel + 1 <= nextLevel ? 255 : 0;
        const currentItem = children[index];
        const itemX = currentItem != null ? currentItem.x : undefined;
        this.roundRichText.node.parent.x = itemX != null ? itemX : 99999;
        if (totalRound > 1 && index === count - 1) {
            this.tipNode.opacity = 0;
        }
        if (this.changeWithScene) {
            this.node.active = !FrameSDK.frameData.gameData.noProfitAd;
            const scene = FrameSDK.frameData.gameData.currentScene;
            this.node.scale = "game" === scene ? 0.8 : 0;
        }
    }

    onLoad() {
        cc.director.on("UPDATA_LEVEL", this._updateUI, this);
        this._period = Math.max(1, this.levelRootNode.children.length - 2);
        cc.tween(this.roundRichText.node.parent).by(1, {
            y: 3
        }, {
            easing: "sineInOut"
        }).by(1, {
            y: -3
        }, {
            easing: "sineInOut"
        }).union().repeatForever().start();
        cc.tween(this.tipNode).to(0.5, {
            scale: 0.9
        }, {
            easing: "sineInOut"
        }).to(0.5, {
            scale: 1
        }, {
            easing: "sineInOut"
        }).union().repeatForever().start();
        this._updateUI();
    }
}
