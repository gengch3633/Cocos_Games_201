import CashFishCredit from "./CashFishCredit";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import Panel_Activity from "./Panel_Activity";

const { ccclass, property } = cc._decorator;

@ccclass
export default class effectsLayout extends cc.Component {
    static _nodePool: cc.NodePool = new cc.NodePool();

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

    playGreen(): void {
        this.greenCoinNode.opacity = ++this._greenReferenceCount > 0 ? 255 : 0;
    }

    piaoCoin(coin: number, charity: number, charityTimes: number, callback?: () => void): void {
        if (!CashFishCredit.isUnlocked("yellowCoin")) {
            coin = 0;
        }
        if (!CashFishCredit.isUnlocked("greenCoin")) {
            charity = 0;
        }
        const hasCoin = coin !== 0;
        const hasCharity = charity !== 0 && !FrameSDK.frameData.gameData.noProfitAd;
        if (!hasCoin && !hasCharity) {
            callback?.();
            return;
        }
        new Promise<boolean>((resolve) => {
            if (coin <= 100) {
                resolve(false);
            } else {
                FrameSDK.openWindow("Panel_CoinTips", {
                    num: coin,
                    charityNum: charity,
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
            let coinDone = false;
            let charityDone = false;
            let callbackDone = false;
            const tryCallback = () => {
                if (coinDone && charityDone && !callbackDone) {
                    callbackDone = true;
                    this.inputBlocker.enabled = false;
                    callback?.();
                }
            };
            if (hasCoin && coin > 0) {
                let startPos = cc.v3(0.5 * cc.winSize.width, 0.5 * cc.winSize.height);
                let scatter = undefined;
                const count = coin < 10 ? 5 : coin <= 50 ? 10 : 20;
                let delay = 0;
                if (hasCharity && charity > 0) {
                    startPos.x -= 100;
                }
                if (showTips) {
                    scatter = 200;
                    delay = 1.5;
                    FrameSDK.playEffect("done_coin_arrange");
                }
                cc.Tween.stopAllByTarget(this.animationRootNode);
                cc.tween(this.animationRootNode)
                    .delay(delay)
                    .call(() =>
                        FrameSDK.playEffect(count > 5 ? "coin_arrange_collect" : "coin_less_collect")
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
                    count,
                    undefined,
                    scatter,
                    delay,
                    () => {
                        cc.director.emit("FRESH_CREDIT", {
                            type: "yellowCoin",
                            num: FrameData.saveData.credit.yellowCoin + coin,
                            change: coin,
                        });
                        FrameData.saveData.credit.yellowCoin += coin;
                        this.stopYellow();
                        coinDone = true;
                        tryCallback();
                    },
                    true
                );
                if (Panel_Activity.isActivityCollectable() && coin > 0) {
                    const activityPos = Panel_Activity.coinTarget.convertToWorldSpaceAR(cc.v3());
                    this.playGlodTween(
                        startPos,
                        activityPos,
                        false,
                        count,
                        undefined,
                        scatter,
                        delay,
                        () => {
                            if (Panel_Activity.isActivityCollectable() && coin > 0) {
                                Panel_Activity.addCoin(coin);
                            }
                        },
                        false
                    );
                }
            } else {
                if (coin < 0) {
                    const newVal = Math.max(0, FrameData.saveData.credit.yellowCoin + coin);
                    cc.director.emit("FRESH_CREDIT", {
                        type: "yellowCoin",
                        num: newVal,
                        change: coin,
                    });
                    FrameData.saveData.credit.yellowCoin = newVal;
                }
                coinDone = true;
            }
            if (hasCharity && charity > 0) {
                let startPos = cc.v3(0.5 * cc.winSize.width, 0.5 * cc.winSize.height);
                let scatter = undefined;
                let target = CashFishCredit.getTarget("greenCoin");
                target = target.getChildByName("coin") || target;
                const count = charity < 10 ? 1 : charity <= 40 ? 3 : 5;
                let delay = 0;
                let playSound = true;
                if (hasCharity && coin > 0) {
                    startPos.x += 100;
                    playSound = false;
                }
                if (showTips) {
                    scatter = 200;
                    delay = 1.5;
                }
                const endPos = target.convertToWorldSpaceAR(cc.v3());
                if (playSound) {
                    FrameSDK.playEffect(count > 5 ? "coin_arrange_collect" : "coin_less_collect");
                }
                this.playGreen();
                this.playGlodTween(
                    startPos,
                    endPos,
                    true,
                    count,
                    undefined,
                    scatter,
                    delay,
                    () => {
                        cc.director.emit("FRESH_CREDIT", {
                            type: "greenCoin",
                            num: FrameData.saveData.credit.greenCoin + charity,
                            change: charity,
                        });
                        FrameData.saveData.credit.greenCoin += charity;
                        const rate = FrameData.getCoinOutNum("charityRate");
                        for (let i = 0; i < charityTimes; i++) {
                            FrameData.saveData.charityDonated += FrameSDK.randomInt(rate[0], rate[1]);
                        }
                        FrameData.saveData.charityDonateTime += Math.max(0, Math.floor(charityTimes));
                        this.stopGreen();
                        charityDone = true;
                        tryCallback();
                    },
                    true
                );
            } else {
                if (charity < 0 && !FrameSDK.frameData.gameData.noProfitAd) {
                    const newVal = Math.max(0, FrameData.saveData.credit.greenCoin + charity);
                    cc.director.emit("FRESH_CREDIT", {
                        type: "greenCoin",
                        num: newVal,
                        change: charity,
                    });
                    FrameData.saveData.credit.greenCoin = newVal;
                }
                charityDone = true;
            }
            if (coinDone && charityDone && !callbackDone) {
                this.inputBlocker.enabled = false;
                callbackDone = true;
                callback?.();
            }
        });
    }

    createIconAndFlyBezier(
        index: number,
        node: cc.Node,
        from: cc.Vec2,
        to: cc.Vec2,
        callback?: (index: number) => void,
        speed: number = 1
    ): void {
        from = new cc.Vec2(from.x - node.getParent().width / 2, from.y - node.getParent().height / 2);
        to = new cc.Vec2(to.x - node.getParent().width / 2, to.y - node.getParent().height / 2);
        node.setPosition(from);
        node.zIndex = 1000;
        const offsetX =
            index % 2 == 0 ? FrameSDK.randomIntNum(10, 60) : -FrameSDK.randomIntNum(10, 60);
        const offsetY = FrameSDK.randomIntNum(-80, -20);
        cc.tween(node)
            .to(0.3 * speed, { position: cc.v3(from.x + offsetX, from.y + offsetY) }, { easing: "quadOut" })
            .call(() => {
                this.createBezier(index, node, from, to, callback, speed);
            })
            .start();
    }

    startFlyProcess(
        isCharity: boolean,
        from: cc.Vec2 | cc.Vec3,
        to: cc.Vec2 | cc.Vec3,
        perCoinCallback?: (index: number) => void,
        completeCallback?: () => void,
        count: number = 5
    ): void {
        const spriteFrame = isCharity ? this.charity_SpriteFrame : this.icon_SpriteFrame;
        const start = this.animationRootNode.convertToNodeSpaceAR(from);
        const end = this.animationRootNode.convertToNodeSpaceAR(to);
        let stagger = 0.15;
        if (count > 1 && 0.2 + 1.4 + stagger * (count - 1) > 2) {
            stagger = Math.max(0.01, (1.8 - 1.4) / (count - 1));
        }
        for (let i = 0; i < count; i++) {
            const node = effectsLayout._nodePool.get() ?? new cc.Node();
            node.scale = 1;
            node.opacity = 0;
            node.setPosition(start.x, start.y, 0);
            this.animationRootNode.addChild(node);
            (node.getComponent(cc.Sprite) ?? node.addComponent(cc.Sprite)).spriteFrame = spriteFrame;
            const offsetX = i % 2 == 0 ? FrameSDK.randomIntNum(10, 60) : -FrameSDK.randomIntNum(10, 60);
            const offsetY = FrameSDK.randomIntNum(-80, -20);
            let curve = FrameSDK.randomIntNum(80, 150);
            if (i % 3 == 1) {
                curve = -curve;
            } else if (i % 3 == 2) {
                curve = FrameSDK.randomIntNum(-80, 80);
            }
            const cp1 = cc.v2(start.x + curve, start.y - Math.abs(curve));
            const cp2 = cc.v2(end.x - curve, end.y - Math.abs(curve));
            const coinIndex = i;
            cc.tween(node)
                .delay(stagger * i)
                .set({ opacity: 255 })
                .to(0.2, { x: start.x + offsetX, y: start.y + offsetY }, { easing: "sineInOut" })
                .bezierTo(1.4, cp1, cp2, end)
                .call(() => {
                    FrameSDK.playEffect("cash_collect");
                    perCoinCallback?.(coinIndex);
                    if (coinIndex === count - 1) {
                        completeCallback?.();
                    }
                    effectsLayout._nodePool.put(node);
                })
                .start();
        }
    }

    playGlodTween(
        from: cc.Vec2 | cc.Vec3,
        to: cc.Vec2 | cc.Vec3,
        isCharity: boolean,
        count: number = 15,
        scatterX: number = 150,
        scatterY: number = 150,
        delay: number = 0,
        completeCallback?: () => void,
        playSound: boolean = true
    ): void {
        from = this.animationRootNode.convertToNodeSpaceAR(from);
        to = this.animationRootNode.convertToNodeSpaceAR(to);
        const spriteFrame = isCharity ? this.charity_SpriteFrame : this.icon_SpriteFrame;
        const onCollect = playSound ? () => FrameSDK.playEffect("cash_collect") : () => {};
        let finished = 0;
        for (let i = 0; i < count; i++) {
            const node = effectsLayout._nodePool.get() ?? new cc.Node();
            (node.getComponent(cc.Sprite) ?? node.addComponent(cc.Sprite)).spriteFrame = spriteFrame;
            node.scale = 1;
            node.opacity = 0;
            node.setPosition(from);
            this.animationRootNode.addChild(node);
            const scatterPos = cc.v3(
                from.x + FrameSDK.randomIntNum(-scatterX, scatterX),
                from.y + FrameSDK.randomIntNum(-scatterY, scatterY)
            );
            cc.tween(node)
                .delay(delay)
                .set({ opacity: 255 })
                .to(0.08 + 0.015 * i, { position: scatterPos })
                .delay(0.2 + 0.01 * i)
                .to(0.47, { position: to })
                .call(() => onCollect())
                .parallel(cc.tween().to(0.2, { scale: 1.5 }), cc.tween().to(0.2, { opacity: 0 }))
                .call(() => {
                    effectsLayout._nodePool.put(node);
                    if (++finished === count) {
                        completeCallback?.();
                    }
                })
                .start();
        }
    }

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

    createBezier(
        index: number,
        node: cc.Node,
        from: cc.Vec2,
        to: cc.Vec2,
        callback?: (index: number) => void,
        speed: number = 1
    ): void {
        const baseScale = node.scale;
        let curve = FrameSDK.randomIntNum(80, 150);
        if (index % 3 == 1) {
            curve = -curve;
        } else if (index % 3 == 2) {
            curve = FrameSDK.randomIntNum(-80, 80);
        }
        const points = [
            cc.v2(from.x + curve, from.y - Math.abs(curve)),
            cc.v2(to.x - curve, to.y - Math.abs(curve)),
            to,
        ];
        cc.tween(node)
            .repeatForever(cc.tween().to(0.3, { scaleX: -1 * baseScale }).to(0.3, { scaleX: 1 * baseScale }));
        cc.tween(node)
            .delay(0.1 * index * speed)
            .call(() => {})
            .parallel(cc.tween().to(0.1 * speed, { opacity: 255 }), cc.tween().then(cc.bezierTo(1.5 * speed, points)))
            .call(() => {
                callback?.(index);
                node.destroy();
            })
            .start();
    }

    playYellow(): void {
        this.yellowCoinNode.opacity = ++this._yellowReferenceCount > 0 ? 255 : 0;
        if (Panel_Activity.isActivityCollectable()) {
            this.activityNode.opacity = ++this._activityReferenceCount > 0 ? 255 : 0;
        }
    }

    stopGreen(): void {
        this._greenReferenceCount = Math.max(0, this._greenReferenceCount - 1);
        this.greenCoinNode.opacity = this._greenReferenceCount > 0 ? 255 : 0;
    }

    piaoBitCoin(
        coin: number,
        charity: number,
        charityTimes: number,
        origin?: { x: number; y: number },
        callback?: () => void
    ): void {
        let coinDone = false;
        let charityDone = false;
        let callbackDone = false;
        const tryCallback = () => {
            if (coinDone && charityDone && !callbackDone) {
                callbackDone = true;
                callback?.();
            }
        };
        if (coin > 0) {
            let target = CashFishCredit.getTarget("yellowCoin");
            target = target.getChildByName("coin") || target;
            const endPos = target.convertToWorldSpaceAR(cc.Vec2.ZERO);
            const startPos = cc.v2(
                origin?.x ?? 0.5 * cc.winSize.width,
                origin?.y ?? 0.5 * cc.winSize.height
            );
            const count = coin > 5 ? 5 : coin;
            if (charity > 0) {
                startPos.x -= 100;
            }
            this.playYellow();
            this.startFlyProcess(false, startPos, endPos, undefined, () => {
                cc.director.emit("FRESH_CREDIT", {
                    type: "yellowCoin",
                    num: FrameData.saveData.credit.yellowCoin + coin,
                    change: coin,
                });
                FrameData.saveData.credit.yellowCoin += coin;
                this.stopYellow();
                coinDone = true;
                tryCallback();
            }, count);
            if (Panel_Activity.isActivityCollectable()) {
                const activityPos = Panel_Activity.coinTarget.convertToWorldSpaceAR(cc.Vec2.ZERO);
                this.startFlyProcess(false, startPos, activityPos, undefined, () => {
                    if (Panel_Activity.isActivityCollectable()) {
                        Panel_Activity.addCoin(coin);
                    }
                }, count);
            }
        } else {
            coinDone = true;
        }
        if (charity > 0) {
            let target = CashFishCredit.getTarget("greenCoin");
            target = target.getChildByName("coin") || target;
            const endPos = target.convertToWorldSpaceAR(cc.Vec2.ZERO);
            const startPos = cc.v2(
                origin?.x ?? 0.5 * cc.winSize.width,
                origin?.y ?? 0.5 * cc.winSize.height
            );
            const count = charity > 5 ? 5 : charity;
            if (coin > 0) {
                startPos.x += 100;
            }
            this.playGreen();
            this.startFlyProcess(true, startPos, endPos, undefined, () => {
                cc.director.emit("FRESH_CREDIT", {
                    type: "greenCoin",
                    num: FrameData.saveData.credit.greenCoin + charity,
                    change: charity,
                });
                FrameData.saveData.credit.greenCoin += charity;
                const rate = FrameData.getCoinOutNum("charityRate");
                for (let i = 0; i < charityTimes; i++) {
                    FrameData.saveData.charityDonated += FrameSDK.randomInt(rate[0], rate[1]);
                }
                FrameData.saveData.charityDonateTime += Math.max(0, Math.floor(charityTimes));
                this.stopGreen();
                charityDone = true;
                tryCallback();
            }, count);
        } else {
            charityDone = true;
        }
        tryCallback();
        if (!callbackDone) {
            FrameSDK.playEffect("pool_ui_butie");
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
}
