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

    _updateUI(): void {
        const passLevel = FrameSDK.frameData.gameData.passLevel;
        let periodStart = 1;
        let periodEnd = Number.MAX_SAFE_INTEGER;
        const coinConf = FrameData.FRAME_CONF.CoinConf;
        for (let i = 0; i < coinConf.length; i++) {
            const conf = coinConf[i];
            if (passLevel < conf.rdm_1) {
                periodEnd = Math.min(periodEnd, conf.rdm_1);
            } else {
                periodStart = Math.max(periodStart, conf.rdm_1);
                if (passLevel < conf.rdm_3) {
                    periodEnd = Math.min(periodEnd, conf.rdm_3);
                } else {
                    periodStart = Math.max(periodStart, conf.rdm_3);
                }
            }
        }
        if (periodEnd === Number.MAX_SAFE_INTEGER) {
            this._period = 1;
            periodEnd = FrameSDK.frameData.gameData.passLevel + 1;
            this.tipNode.opacity = 0;
        } else {
            this.tipNode.opacity = 255;
        }
        const offset = Math.floor(Math.max(0, passLevel - periodStart) / this._period);
        let startLevel = periodStart + this._period * offset;
        let visibleCount = periodEnd - startLevel;
        if (visibleCount <= 1) {
            visibleCount = periodEnd - (startLevel = Math.max(1, startLevel - this._period));
        }
        const children = this.levelRootNode.children;
        const childCount = children.length;
        for (let i = 0; i < childCount - 1; i++) {
            const child = children[i];
            const level = startLevel + i;
            child.active = i < visibleCount;
            cc.find("levelLabel", child).getComponent(cc.Label).string = "" + level;
            if (level <= passLevel) {
                child.getComponent(cc.Sprite).spriteFrame = this.completedSpriteFrame;
                cc.find("gou", child).active = true;
            } else {
                child.getComponent(cc.Sprite).spriteFrame = level === passLevel + 1 ? this.highlightSpriteFrame : this.normalSpriteFrame;
                cc.find("gou", child).active = false;
            }
        }
        const lastChild = children[childCount - 1];
        cc.find("levelLabel", lastChild).getComponent(cc.Label).string = "" + periodEnd;
        cc.find("gou", lastChild).active = periodEnd <= passLevel;
        if (this.tipNode.opacity > 0) {
            lastChild.getComponent(cc.Sprite).spriteFrame = this.targetSpriteFrame;
        } else {
            lastChild.getComponent(cc.Sprite).spriteFrame = periodEnd <= passLevel
                ? this.completedSpriteFrame
                : periodEnd === passLevel + 1
                    ? this.highlightSpriteFrame
                    : this.normalSpriteFrame;
        }
        const progressIndex = passLevel + 1 === periodEnd ? childCount - 1 : passLevel + 1 - startLevel;
        const currentRound = FrameSDK.frameData.gameData.currentRound;
        const totalRound = FrameSDK.frameData.gameData.totalRound;
        if (progressIndex < 0) {
            this.maskNode.width = 0;
        } else if (progressIndex >= childCount) {
            this.maskNode.width = this.maskNode.parent.width;
        } else {
            children[progressIndex].convertToWorldSpaceAR(cc.Vec3.ZERO, this._cacheVec3);
            this.maskNode.convertToNodeSpaceAR(this._cacheVec3, this._cacheVec3);
            this.maskNode.width = this._cacheVec3.x;
        }
        this.roundRichText.string = "<outline color= #C16711 width=2>pkey_001</outline>??&value1==<color= #86FF04>" + currentRound + "</c>&value2==" + totalRound;
        this.roundRichText.node.parent.opacity = totalRound > 1 && passLevel + 1 <= periodEnd ? 255 : 0;
        this.roundRichText.node.parent.x = children[progressIndex]?.x ?? 99999;
        if (totalRound > 1 && progressIndex === childCount - 1) {
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
