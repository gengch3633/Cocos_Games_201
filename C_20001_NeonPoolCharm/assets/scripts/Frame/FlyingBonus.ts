import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FlyingBonus extends cc.Component {
    static _sceneLoadedRecord: Record<string, boolean> = {};

    @property(cc.Label)
    numLabel: cc.Label = null;

    private _available: boolean = false;
    private _cachedPosition1: cc.Vec3 = cc.v3();
    private _cachedPosition2: cc.Vec3 = cc.v3();

    onLoad(): void {
        cc.director.on("SHOW_FLYING_BONUS", this._startFly, this);
        cc.director.on("HIDE_FLYING_BONUS", this._stopFly, this);
        this.node.opacity = 0;
    }

    onDestroy(): void {
        cc.director.removeAll(this);
    }

    onEnable(): void {
        this._startFly();
    }

    _startFly(): void {
        if (FrameSDK.frameData.gameData.noProfitAd) {
            return;
        }
        const scene = FrameSDK.frameData.gameData.currentScene;
        if (scene !== "home" && scene !== "game") {
            return;
        }
        const passLevel = FrameSDK.frameData.gameData.passLevel;
        if (
            passLevel < FrameData.FRAME_CONF.flyingBonusLevel ||
            (FrameData.saveData.flyingBonusIndex >= passLevel && FlyingBonus._sceneLoadedRecord[scene])
        ) {
            return;
        }
        FlyingBonus._sceneLoadedRecord[scene] = true;
        if (!this._available) {
            FrameSDK.logCommonEvent("c_ad_event", {
                action: "exposure",
                type: "video",
                placement: "fly_sup",
            });
            this._available = true;
            this.numLabel.string = "" + FrameSDK.convertCoinToStr(FrameData.getCoinOutNum("flyingBonus"));
            this.scheduleOnce(() => {
                FrameSDK.logGameEvent("thepool_game_rew", {
                    object_action: "show",
                    object_name: "fly_sup",
                });
                this.node.on(cc.Node.EventType.TOUCH_END, this._onClick, this);
                this._cachedPosition1.x = 0;
                this._cachedPosition1.y = 200;
                this._cachedPosition1.z = 0;
                this.node.parent.convertToNodeSpaceAR(this._cachedPosition1, this._cachedPosition1);
                this._cachedPosition2.x = cc.winSize.width;
                this._cachedPosition2.y = cc.winSize.height - 300;
                this._cachedPosition2.z = 0;
                this.node.parent.convertToNodeSpaceAR(this._cachedPosition2, this._cachedPosition2);
                const startX = this._cachedPosition1.x + this.node.width * this.node.anchorX;
                const startY = this._cachedPosition2.y + this.node.height * this.node.anchorY;
                const endX = this._cachedPosition2.x - this.node.width * (1 - this.node.anchorX);
                const endY = this._cachedPosition1.y - this.node.height * (1 - this.node.anchorY);
                const stepY = (endY - startY) / 5;
                cc.Tween.stopAllByTarget(this.node);
                cc.tween(this.node)
                    .set({ x: startX - this.node.width, y: startY, opacity: 255 })
                    .to(4, { x: { value: endX, easing: "sineInOut" }, y: startY + stepY })
                    .to(4, { x: { value: startX, easing: "sineInOut" }, y: startY + 2 * stepY })
                    .to(4, { x: { value: endX, easing: "sineInOut" }, y: startY + 3 * stepY })
                    .to(4, { x: { value: startX, easing: "sineInOut" }, y: startY + 4 * stepY })
                    .to(4, {
                        x: { value: endX + this.node.width, easing: "sineInOut" },
                        y: endY,
                    })
                    .union()
                    .repeatForever()
                    .start();
            });
        }
    }

    _stopFly(): void {
        this._available = false;
        this.node.opacity = 0;
        cc.Tween.stopAllByTarget(this.node);
    }

    _onClick(): void {
        if (!this._available) {
            return;
        }
        this._available = false;
        this.node.off(cc.Node.EventType.TOUCH_END, this._onClick, this);
        FrameSDK.logCommonEvent("c_ad_event", {
            action: "touch",
            type: "video",
            placement: "fly_sup",
        });
        FrameSDK.logGameEvent("thepool_game_rew", {
            object_action: "click",
            object_name: "fly_sup",
        });
        cc.Tween.stopAllByTarget(this.node);
        this.node.opacity = 0;
        FrameData.saveData.flyingBonusIndex = FrameSDK.frameData.gameData.passLevel;
        const reward = FrameData.getCoinOutNum("flyingBonus");
        FrameSDK.openVideo(
            "fly_sup",
            false,
            (type) => {
                FrameSDK.logGameEvent("thepool_game_ad", {
                    object_action: "show",
                    object_name: "fly_sup",
                    object_notes: type === "video" ? "video" : type === "web" ? "web" : "inter",
                });
            },
            (success) => {
                let charity = 0;
                let flag = 0;
                if (success) {
                    charity = FrameData.getCharityOutNum();
                    flag = 1;
                }
                FrameSDK.addCoin(reward, charity, flag);
            },
            undefined,
            { reward, isMax: false }
        );
    }
}
