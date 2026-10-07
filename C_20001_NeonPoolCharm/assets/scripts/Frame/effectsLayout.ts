import CashFishCredit from "./CashFishCredit";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import Panel_Activity from "./Panel_Activity";

const { ccclass, property } = cc._decorator;

@ccclass
export default class effectsLayout extends cc.Component {
    @property(cc.BlockInputEvents)
    inputBlocker: cc.BlockInputEvents = null;

    @property(cc.Node)
    yellowCoinNode: cc.Node = null;

    @property(cc.Node)
    greenCoinNode: cc.Node = null;

    @property(cc.Node)
    activityNode: cc.Node = null;

    @property(cc.Node)
    animationRootNode: cc.Node = null;

    @property(cc.ParticleSystem)
    particle: cc.ParticleSystem = null;

    @property(cc.SpriteFrame)
    icon_SpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    charity_SpriteFrame: cc.SpriteFrame = null;

    private _yellowReferenceCount: number = 0;
    private _greenReferenceCount: number = 0;
    private _activityReferenceCount: number = 0;

    private static _nodePool = new cc.NodePool();

    onEnable(): void {
        cc.director.on("ADD_COIN", this.piaoCoin, this);
        cc.director.on("ADD_BIT_COIN", this.piaoBitCoin, this);
        this.inputBlocker.enabled = false;
        this.yellowCoinNode.opacity = 0;
        this.greenCoinNode.opacity = 0;
        this.activityNode.opacity = 0;
    }

    onDisable(): void {
        cc.director.removeAll(this);
    }

    playYellow(): void {
        this.yellowCoinNode.opacity = ++this._yellowReferenceCount > 0 ? 255 : 0;
        if (Panel_Activity.isActivityCollectable()) {
            this.activityNode.opacity = ++this._activityReferenceCount > 0 ? 255 : 0;
        }
    }

    stopYellow(): void {
        this._yellowReferenceCount = Math.max(0, this._yellowReferenceCount - 1);
        this.yellowCoinNode.opacity = this._yellowReferenceCount > 0 ? 255 : 0;
        if (this.activityNode.opacity > 0) {
            this._activityReferenceCount = Math.max(0, this._activityReferenceCount - 1);
            this.activityNode.opacity = this._activityReferenceCount > 0 ? 255 : 0;
        }
    }

    playGreen(): void {
        this.greenCoinNode.opacity = ++this._greenReferenceCount > 0 ? 255 : 0;
    }

    stopGreen(): void {
        this._greenReferenceCount = Math.max(0, this._greenReferenceCount - 1);
        this.greenCoinNode.opacity = this._greenReferenceCount > 0 ? 255 : 0;
    }

    piaoCoin(
        yellowCoin: number,
        greenCoin: number,
        charityCount: number,
        callback?: () => void
    ): void {
        if (!CashFishCredit.isUnlocked("yellowCoin")) {
            yellowCoin = 0;
        }
        if (!CashFishCredit.isUnlocked("greenCoin")) {
            greenCoin = 0;
        }
        const hasYellow = yellowCoin !== 0;
        const hasGreen = greenCoin !== 0 && !FrameSDK.frameData.gameData.noProfitAd;

        if (hasYellow || hasGreen) {
            new Promise<boolean>((resolve) => {
                if (yellowCoin <= 100) {
                    resolve(false);
                } else {
                    FrameSDK.openWindow("Panel_CoinTips", {
                        num: yellowCoin,
                        charityNum: greenCoin,
                        closeCB: () => resolve(true),
                    });
                }
            }).then((showTips) => {
                this.inputBlocker.enabled = showTips;
                this.particle.node.active = showTips;
                if (showTips) {
                    FrameSDK.frameData.gameFuc.vibrate(500);
                    this.particle.resetSystem();
                }

                let yellowDone = false;
                let greenDone = false;
                let callbackCalled = false;

                if (hasYellow && yellowCoin > 0) {
                    let startPos = cc.v3(0.5 * cc.winSize.width, 0.5 * cc.winSize.height);
                    let spread = 150;
                    let coinCount = yellowCoin < 10 ? 5 : yellowCoin <= 50 ? 10 : 20;
                    let delay = 0;
                    if (hasGreen && greenCoin > 0) {
                        startPos.x -= 100;
                    }
                    if (showTips) {
                        spread = 200;
                        delay = 1.5;
                        FrameSDK.playEffect("done_coin_arrange");
                    }
                    cc.Tween.stopAllByTarget(this.animationRootNode);
                    cc.tween(this.animationRootNode)
                        .delay(delay)
                        .call(() =>
                            FrameSDK.playEffect(
                                coinCount > 5 ? "coin_arrange_collect" : "coin_less_collect"
                            )
                        )
                        .start();

                    let target = CashFishCredit.getTarget("yellowCoin");
                    target = target.getChildByName("coin") || target;
                    const endPos = target.convertToWorldSpaceAR(cc.v3());
                    this.playYellow();
                    this.playGlodTween(
                        startPos,
                        endPos,
                        false,
                        coinCount,
                        undefined,
                        spread,
                        delay,
                        () => {
                            cc.director.emit("FRESH_CREDIT", {
                                type: "yellowCoin",
                                num: FrameData.saveData.credit.yellowCoin + yellowCoin,
                                change: yellowCoin,
                            });
                            FrameData.saveData.credit.yellowCoin += yellowCoin;
                            this.stopYellow();
                            yellowDone = true;
                            if (greenDone && !callbackCalled) {
                                callbackCalled = true;
                                this.inputBlocker.enabled = false;
                                callback?.();
                            }
                        },
                        true
                    );

                    if (Panel_Activity.isActivityCollectable() && yellowCoin > 0) {
                        const activityPos = Panel_Activity.coinTarget.convertToWorldSpaceAR(cc.v3());
                        this.playGlodTween(
                            startPos,
                            activityPos,
                            false,
                            coinCount,
                            undefined,
                            spread,
                            delay,
                            () => {
                                if (Panel_Activity.isActivityCollectable() && yellowCoin > 0) {
                                    Panel_Activity.addCoin(yellowCoin);
                                }
                            },
                            false
                        );
                    }
                } else {
                    if (yellowCoin < 0) {
                        const newVal = Math.max(0, FrameData.saveData.credit.yellowCoin + yellowCoin);
                        cc.director.emit("FRESH_CREDIT", {
                            type: "yellowCoin",
                            num: newVal,
                            change: yellowCoin,
                        });
                        FrameData.saveData.credit.yellowCoin = newVal;
                    }
                    yellowDone = true;
                }

                if (hasGreen && greenCoin > 0) {
                    let startPos = cc.v3(0.5 * cc.winSize.width, 0.5 * cc.winSize.height);
                    let spread = 150;
                    let coinCount = greenCoin < 10 ? 1 : greenCoin <= 40 ? 3 : 5;
                    let delay = 0;
                    let playSound = true;
                    if (hasGreen && yellowCoin > 0) {
                        startPos.x += 100;
                        playSound = false;
                    }
                    if (showTips) {
                        spread = 200;
                        delay = 1.5;
                    }
                    let target = CashFishCredit.getTarget("greenCoin");
                    target = target.getChildByName("coin") || target;
                    const endPos = target.convertToWorldSpaceAR(cc.v3());
                    if (playSound) {
                        FrameSDK.playEffect(
                            coinCount > 5 ? "coin_arrange_collect" : "coin_less_collect"
                        );
                    }
                    this.playGreen();
                    this.playGlodTween(
                        startPos,
                        endPos,
                        true,
                        coinCount,
                        undefined,
                        spread,
                        delay,
                        () => {
                            cc.director.emit("FRESH_CREDIT", {
                                type: "greenCoin",
                                num: FrameData.saveData.credit.greenCoin + greenCoin,
                                change: greenCoin,
                            });
                            FrameData.saveData.credit.greenCoin += greenCoin;
                            const rate = FrameData.getCoinOutNum("charityRate");
                            for (let i = 0; i < charityCount; i++) {
                                FrameData.saveData.charityDonated += FrameSDK.randomInt(rate[0], rate[1]);
                            }
                            FrameData.saveData.charityDonateTime += Math.max(0, Math.floor(charityCount));
                            this.stopGreen();
                            greenDone = true;
                            if (yellowDone && !callbackCalled) {
                                this.inputBlocker.enabled = false;
                                callbackCalled = true;
                                callback?.();
                            }
                        },
                        true
                    );
                } else {
                    if (greenCoin < 0 && !FrameSDK.frameData.gameData.noProfitAd) {
                        const newVal = Math.max(0, FrameData.saveData.credit.greenCoin + greenCoin);
                        cc.director.emit("FRESH_CREDIT", {
                            type: "greenCoin",
                            num: newVal,
                            change: greenCoin,
                        });
                        FrameData.saveData.credit.greenCoin = newVal;
                    }
                    greenDone = true;
                }

                if (yellowDone && greenDone && !callbackCalled) {
                    this.inputBlocker.enabled = false;
                    callbackCalled = true;
                    callback?.();
                }
            });
        } else {
            callback?.();
        }
    }

    piaoBitCoin(
        yellowCoin: number,
        greenCoin: number,
        charityCount: number,
        origin?: cc.Vec2,
        callback?: () => void
    ): void {
        let yellowDone = false;
        let greenDone = false;
        let callbackCalled = false;

        const tryFinish = () => {
            if (yellowDone && greenDone && !callbackCalled) {
                callbackCalled = true;
                callback?.();
            }
        };

        if (yellowCoin > 0) {
            let target = CashFishCredit.getTarget("yellowCoin");
            target = target.getChildByName("coin") || target;
            const endPos = target.convertToWorldSpaceAR(cc.Vec2.ZERO);
            const startPos = cc.v2(
                origin?.x ?? 0.5 * cc.winSize.width,
                origin?.y ?? 0.5 * cc.winSize.height
            );
            let coinCount = yellowCoin > 5 ? 5 : yellowCoin;
            if (greenCoin > 0) {
                startPos.x -= 100;
            }
            this.playYellow();
            this.startFlyProcess(false, startPos, endPos, undefined, () => {
                cc.director.emit("FRESH_CREDIT", {
                    type: "yellowCoin",
                    num: FrameData.saveData.credit.yellowCoin + yellowCoin,
                    change: yellowCoin,
                });
                FrameData.saveData.credit.yellowCoin += yellowCoin;
                this.stopYellow();
                yellowDone = true;
                tryFinish();
            }, coinCount);

            if (Panel_Activity.isActivityCollectable()) {
                const activityPos = Panel_Activity.coinTarget.convertToWorldSpaceAR(cc.Vec2.ZERO);
                this.startFlyProcess(false, startPos, activityPos, undefined, () => {
                    if (Panel_Activity.isActivityCollectable()) {
                        Panel_Activity.addCoin(yellowCoin);
                    }
                }, coinCount);
            }
        } else {
            yellowDone = true;
        }

        if (greenCoin > 0) {
            let target = CashFishCredit.getTarget("greenCoin");
            target = target.getChildByName("coin") || target;
            const endPos = target.convertToWorldSpaceAR(cc.Vec2.ZERO);
            const startPos = cc.v2(
                origin?.x ?? 0.5 * cc.winSize.width,
                origin?.y ?? 0.5 * cc.winSize.height
            );
            let coinCount = greenCoin > 5 ? 5 : greenCoin;
            if (yellowCoin > 0) {
                startPos.x += 100;
            }
            this.playGreen();
            this.startFlyProcess(true, startPos, endPos, undefined, () => {
                cc.director.emit("FRESH_CREDIT", {
                    type: "greenCoin",
                    num: FrameData.saveData.credit.greenCoin + greenCoin,
                    change: greenCoin,
                });
                FrameData.saveData.credit.greenCoin += greenCoin;
                const rate = FrameData.getCoinOutNum("charityRate");
                for (let i = 0; i < charityCount; i++) {
                    FrameData.saveData.charityDonated += FrameSDK.randomInt(rate[0], rate[1]);
                }
                FrameData.saveData.charityDonateTime += Math.max(0, Math.floor(charityCount));
                this.stopGreen();
                greenDone = true;
                tryFinish();
            }, coinCount);
        } else {
            greenDone = true;
        }

        tryFinish();
        if (!callbackCalled) {
            FrameSDK.playEffect("pool_ui_butie");
        }
    }

    playGlodTween(
        startWorld: cc.Vec3,
        endWorld: cc.Vec3,
        isCharity: boolean,
        count: number = 15,
        spreadX: number = 150,
        spreadY: number = 150,
        delay: number = 0,
        onComplete?: () => void,
        playSound: boolean = true
    ): void {
        const start = this.animationRootNode.convertToNodeSpaceAR(startWorld);
        const end = this.animationRootNode.convertToNodeSpaceAR(endWorld);
        const spriteFrame = isCharity ? this.charity_SpriteFrame : this.icon_SpriteFrame;
        const playCollect = playSound ? () => FrameSDK.playEffect("cash_collect") : () => {};
        let finished = 0;

        for (let i = 0; i < count; i++) {
            let node = effectsLayout._nodePool.get() ?? new cc.Node();
            (node.getComponent(cc.Sprite) ?? node.addComponent(cc.Sprite)).spriteFrame = spriteFrame;
            node.scale = 1;
            node.opacity = 0;
            node.setPosition(start);
            this.animationRootNode.addChild(node);
            const mid = cc.v3(
                start.x + FrameSDK.randomIntNum(-spreadX, spreadX),
                start.y + FrameSDK.randomIntNum(-spreadY, spreadY)
            );
            cc.tween(node)
                .delay(delay)
                .set({ opacity: 255 })
                .to(0.08 + 0.015 * i, { position: mid })
                .delay(0.2 + 0.01 * i)
                .to(0.47, { position: end })
                .call(() => playCollect())
                .parallel(
                    cc.tween().to(0.2, { scale: 1.5 }),
                    cc.tween().to(0.2, { opacity: 0 })
                )
                .call(() => {
                    effectsLayout._nodePool.put(node);
                    if (++finished === count) {
                        onComplete?.();
                    }
                })
                .start();
        }
    }

    startFlyProcess(
        isCharity: boolean,
        startWorld: cc.Vec2,
        endWorld: cc.Vec2,
        onEach?: (index: number) => void,
        onComplete?: () => void,
        count: number = 5
    ): void {
        const spriteFrame = isCharity ? this.charity_SpriteFrame : this.icon_SpriteFrame;
        const start = this.animationRootNode.convertToNodeSpaceAR(startWorld);
        const end = this.animationRootNode.convertToNodeSpaceAR(endWorld);
        let interval = 0.15;
        if (count > 1 && 0.2 + 1.4 + interval * (count - 1) > 2) {
            interval = Math.max(0.01, (1.8 - 1.4) / (count - 1));
        }

        for (let i = 0; i < count; i++) {
            let node = effectsLayout._nodePool.get() ?? new cc.Node();
            node.scale = 1;
            node.opacity = 0;
            node.setPosition(start.x, start.y, 0);
            this.animationRootNode.addChild(node);
            (node.getComponent(cc.Sprite) ?? node.addComponent(cc.Sprite)).spriteFrame = spriteFrame;
            const offsetX = i % 2 === 0 ? FrameSDK.randomIntNum(10, 60) : -FrameSDK.randomIntNum(10, 60);
            const offsetY = FrameSDK.randomIntNum(-80, -20);
            let curve = FrameSDK.randomIntNum(80, 150);
            if (i % 3 === 1) {
                curve = -curve;
            } else if (i % 3 === 2) {
                curve = FrameSDK.randomIntNum(-80, 80);
            }
            const cp1 = cc.v2(start.x + curve, start.y - Math.abs(curve));
            const cp2 = cc.v2(end.x - curve, end.y - Math.abs(curve));
            const index = i;
            cc.tween(node)
                .delay(interval * i)
                .set({ opacity: 255 })
                .to(0.2, { x: start.x + offsetX, y: start.y + offsetY }, { easing: "sineInOut" })
                .bezierTo(1.4, cp1, cp2, end)
                .call(() => {
                    FrameSDK.playEffect("cash_collect");
                    onEach?.(index);
                    if (index === count - 1) {
                        onComplete?.();
                    }
                    effectsLayout._nodePool.put(node);
                })
                .start();
        }
    }

    createIconAndFlyBezier(
        index: number,
        node: cc.Node,
        startPos: cc.Vec2,
        endPos: cc.Vec2,
        onComplete?: (index: number) => void,
        duration: number = 1
    ): void {
        startPos = new cc.Vec2(
            startPos.x - node.getParent().width / 2,
            startPos.y - node.getParent().height / 2
        );
        endPos = new cc.Vec2(
            endPos.x - node.getParent().width / 2,
            endPos.y - node.getParent().height / 2
        );
        node.setPosition(startPos);
        node.zIndex = 1000;
        const offsetX = index % 2 === 0 ? FrameSDK.randomIntNum(10, 60) : -FrameSDK.randomIntNum(10, 60);
        const offsetY = FrameSDK.randomIntNum(-80, -20);
        cc.tween(node)
            .to(0.3 * duration, { position: cc.v3(startPos.x + offsetX, startPos.y + offsetY) }, { easing: "quadOut" })
            .call(() => {
                this.createBezier(index, node, startPos, endPos, onComplete, duration);
            })
            .start();
    }

    createBezier(
        index: number,
        node: cc.Node,
        startPos: cc.Vec2,
        endPos: cc.Vec2,
        onComplete?: (index: number) => void,
        duration: number = 1
    ): void {
        const scale = node.scale;
        let curve = FrameSDK.randomIntNum(80, 150);
        if (index % 3 === 1) {
            curve = -curve;
        } else if (index % 3 === 2) {
            curve = FrameSDK.randomIntNum(-80, 80);
        }
        const points = [
            cc.v2(startPos.x + curve, startPos.y - Math.abs(curve)),
            cc.v2(endPos.x - curve, endPos.y - Math.abs(curve)),
            endPos,
        ];
        cc.tween(node)
            .repeatForever(
                cc.tween().to(0.3, { scaleX: -1 * scale }).to(0.3, { scaleX: 1 * scale })
            );
        cc.tween(node)
            .delay(0.1 * index * duration)
            .call(() => {})
            .parallel(
                cc.tween().to(0.1 * duration, { opacity: 255 }),
                cc.tween().then(cc.bezierTo(1.5 * duration, points))
            )
            .call(() => {
                onComplete?.(index);
                node.destroy();
            })
            .start();
    }
}
