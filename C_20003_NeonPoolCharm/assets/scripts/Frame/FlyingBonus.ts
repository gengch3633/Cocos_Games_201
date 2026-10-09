import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FlyingBonus extends cc.Component {

    @property(cc.Label)
    numLabel: cc.Label = null;

    _available: boolean = false;
    _cachedPosition1: cc.Vec3 = cc.v3();
    _cachedPosition2: cc.Vec3 = cc.v3();

    static _sceneLoadedRecord: any = {};

    onLoad() {
        cc.director.on("SHOW_FLYING_BONUS", this._startFly, this);
        cc.director.on("HIDE_FLYING_BONUS", this._stopFly, this);
        this.node.opacity = 0;
    }

    onDestroy() {
        cc.director.removeAll(this);
    }

    onEnable() {
        this._startFly();
    }

    _startFly() {
        const self = this;
        if (!FrameSDK.frameData.gameData.noProfitAd) {
            const scene = FrameSDK.frameData.gameData.currentScene;
            if ("home" === scene || "game" === scene) {
                const passLevel = FrameSDK.frameData.gameData.passLevel;
                if (!(passLevel < FrameData.FRAME_CONF.flyingBonusLevel || FrameData.saveData.flyingBonusIndex >= passLevel && FlyingBonus._sceneLoadedRecord[scene])) {
                    FlyingBonus._sceneLoadedRecord[scene] = true;
                    if (!this._available) {
                        FrameSDK.logCommonEvent("c_ad_event", {
                            action: "exposure",
                            type: "video",
                            placement: "fly_sup"
                        });
                        this._available = true;
                        this.numLabel.string = "" + FrameSDK.convertCoinToStr(FrameData.getCoinOutNum("flyingBonus"));
                        this.scheduleOnce(function () {
                            FrameSDK.logGameEvent("thepool_game_rew", {
                                object_action: "show",
                                object_name: "fly_sup"
                            });
                            self.node.on(cc.Node.EventType.TOUCH_END, self._onClick, self);
                            self._cachedPosition1.x = 0;
                            self._cachedPosition1.y = 200;
                            self._cachedPosition1.z = 0;
                            self.node.parent.convertToNodeSpaceAR(self._cachedPosition1, self._cachedPosition1);
                            self._cachedPosition2.x = cc.winSize.width;
                            self._cachedPosition2.y = cc.winSize.height - 300;
                            self._cachedPosition2.z = 0;
                            self.node.parent.convertToNodeSpaceAR(self._cachedPosition2, self._cachedPosition2);
                            const left = self._cachedPosition1.x + self.node.width * self.node.anchorX;
                            const top = self._cachedPosition2.y + self.node.height * self.node.anchorY;
                            const right = self._cachedPosition2.x - self.node.width * (1 - self.node.anchorX);
                            const bottom = self._cachedPosition1.y - self.node.height * (1 - self.node.anchorY);
                            const step = (bottom - top) / 5;
                            cc.Tween.stopAllByTarget(self.node);
                            cc.tween(self.node).set({
                                x: left - self.node.width,
                                y: top,
                                opacity: 255
                            }).to(4, {
                                x: {
                                    value: right,
                                    easing: "sineInOut"
                                },
                                y: top + step
                            }).to(4, {
                                x: {
                                    value: left,
                                    easing: "sineInOut"
                                },
                                y: top + 2 * step
                            }).to(4, {
                                x: {
                                    value: right,
                                    easing: "sineInOut"
                                },
                                y: top + 3 * step
                            }).to(4, {
                                x: {
                                    value: left,
                                    easing: "sineInOut"
                                },
                                y: top + 4 * step
                            }).to(4, {
                                x: {
                                    value: right + self.node.width,
                                    easing: "sineInOut"
                                },
                                y: bottom
                            }).union().repeatForever().start();
                        });
                    }
                }
            }
        }
    }

    _stopFly() {
        this._available = false;
        this.node.opacity = 0;
        cc.Tween.stopAllByTarget(this.node);
    }

    _onClick() {
        if (this._available) {
            this._available = false;
            this.node.off(cc.Node.EventType.TOUCH_END, this._onClick, this);
            FrameSDK.logCommonEvent("c_ad_event", {
                action: "touch",
                type: "video",
                placement: "fly_sup"
            });
            FrameSDK.logGameEvent("thepool_game_rew", {
                object_action: "click",
                object_name: "fly_sup"
            });
            cc.Tween.stopAllByTarget(this.node);
            this.node.opacity = 0;
            FrameData.saveData.flyingBonusIndex = FrameSDK.frameData.gameData.passLevel;
            const reward = FrameData.getCoinOutNum("flyingBonus");
            FrameSDK.openVideo("fly_sup", false, function (adType) {
                FrameSDK.logGameEvent("thepool_game_ad", {
                    object_action: "show",
                    object_name: "fly_sup",
                    object_notes: "video" === adType ? "video" : "web" === adType ? "web" : "inter"
                });
            }, function (success) {
                let charity = 0;
                let charityFlag = 0;
                if (success) {
                    charity = FrameData.getCharityOutNum();
                    charityFlag = 1;
                }
                FrameSDK.addCoin(reward, charity, charityFlag);
            }, undefined, {
                reward: reward,
                isMax: false
            });
        }
    }
}
