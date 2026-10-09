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

    _yellowReferenceCount: number = 0;
    _greenReferenceCount: number = 0;
    _activityReferenceCount: number = 0;

    static _nodePool: cc.NodePool = new cc.NodePool();

    playGreen() {
        this.greenCoinNode.opacity = ++this._greenReferenceCount > 0 ? 255 : 0;
    }

    piaoCoin(e, t, a, o) {
        if (!CashFishCredit.isUnlocked("yellowCoin")) {
            e = 0;
        }
        if (!CashFishCredit.isUnlocked("greenCoin")) {
            t = 0;
        }
        let hasYellow = 0 !== e;
        let hasGreen = 0 !== t && !FrameSDK.frameData.gameData.noProfitAd;
        if (hasYellow || hasGreen) {
            new Promise<boolean>(function (resolve) {
                if (e <= 100) {
                    resolve(false);
                } else {
                    FrameSDK.openWindow("Panel_CoinTips", {
                        num: e,
                        charityNum: t,
                        closeCB: function () {
                            return resolve(true);
                        }
                    });
                }
            }).then((d) => {
                this.inputBlocker.enabled = d;
                this.particle.node.active = d;
                if (d) {
                    FrameSDK.frameData.gameFuc.vibrate(500);
                    this.particle.resetSystem();
                }
                let yellowDone = false;
                let greenDone = false;
                let finished = false;
                if (hasYellow && e > 0) {
                    let f = cc.v3(.5 * cc.winSize.width, .5 * cc.winSize.height);
                    let spread = undefined;
                    let count = e < 10 ? 5 : e <= 50 ? 10 : 20;
                    let delay = 0;
                    if (hasGreen && t > 0) {
                        f.x -= 100;
                    }
                    if (d) {
                        spread = 200;
                        delay = 1.5;
                        FrameSDK.playEffect("done_coin_arrange");
                    }
                    cc.Tween.stopAllByTarget(this.animationRootNode);
                    cc.tween(this.animationRootNode).delay(delay).call(function () {
                        return FrameSDK.playEffect(count > 5 ? "coin_arrange_collect" : "coin_less_collect");
                    }).start();
                    let yellowTarget = CashFishCredit.getTarget("yellowCoin");
                    yellowTarget = yellowTarget.getChildByName("coin") || yellowTarget;
                    let g = yellowTarget.convertToWorldSpaceAR(cc.v3());
                    this.playYellow();
                    this.playGlodTween(f, g, false, count, undefined, spread, delay, () => {
                        cc.director.emit("FRESH_CREDIT", {
                            type: "yellowCoin",
                            num: FrameData.saveData.credit.yellowCoin + e,
                            change: e
                        });
                        FrameData.saveData.credit.yellowCoin += e;
                        this.stopYellow();
                        yellowDone = true;
                        if (greenDone && !finished) {
                            finished = true;
                            this.inputBlocker.enabled = false;
                            if (null != o) {
                                o();
                            }
                        }
                    }, true);
                    if (Panel_Activity.isActivityCollectable() && e > 0) {
                        let D = Panel_Activity.coinTarget.convertToWorldSpaceAR(cc.v3());
                        this.playGlodTween(f, D, false, count, undefined, spread, delay, () => {
                            if (Panel_Activity.isActivityCollectable() && e > 0) {
                                Panel_Activity.addCoin(e);
                            }
                        }, false);
                    }
                } else {
                    if (e < 0) {
                        let F = Math.max(0, FrameData.saveData.credit.yellowCoin + e);
                        cc.director.emit("FRESH_CREDIT", {
                            type: "yellowCoin",
                            num: F,
                            change: e
                        });
                        FrameData.saveData.credit.yellowCoin = F;
                    }
                    yellowDone = true;
                }
                if (hasGreen && t > 0) {
                    let f = cc.v3(.5 * cc.winSize.width, .5 * cc.winSize.height);
                    let spread = undefined;
                    let count = t < 10 ? 1 : t <= 40 ? 3 : 5;
                    let delay = 0;
                    let playCollectSound = true;
                    if (hasGreen && e > 0) {
                        f.x += 100;
                        playCollectSound = false;
                    }
                    if (d) {
                        spread = 200;
                        delay = 1.5;
                    }
                    let greenTarget = CashFishCredit.getTarget("greenCoin");
                    greenTarget = greenTarget.getChildByName("coin") || greenTarget;
                    let g = greenTarget.convertToWorldSpaceAR(cc.v3());
                    if (playCollectSound) {
                        FrameSDK.playEffect(count > 5 ? "coin_arrange_collect" : "coin_less_collect");
                    }
                    this.playGreen();
                    this.playGlodTween(f, g, true, count, undefined, spread, delay, () => {
                        cc.director.emit("FRESH_CREDIT", {
                            type: "greenCoin",
                            num: FrameData.saveData.credit.greenCoin + t,
                            change: t
                        });
                        FrameData.saveData.credit.greenCoin += t;
                        let rate = FrameData.getCoinOutNum("charityRate");
                        for (let i = 0; i < a; i++) {
                            FrameData.saveData.charityDonated += FrameSDK.randomInt(rate[0], rate[1]);
                        }
                        FrameData.saveData.charityDonateTime += Math.max(0, Math.floor(a));
                        this.stopGreen();
                        greenDone = true;
                        if (yellowDone && !finished) {
                            this.inputBlocker.enabled = false;
                            finished = true;
                            if (null != o) {
                                o();
                            }
                        }
                    }, true);
                } else {
                    if (t < 0 && !FrameSDK.frameData.gameData.noProfitAd) {
                        let F = Math.max(0, FrameData.saveData.credit.greenCoin + t);
                        cc.director.emit("FRESH_CREDIT", {
                            type: "greenCoin",
                            num: F,
                            change: t
                        });
                        FrameData.saveData.credit.greenCoin = F;
                    }
                    greenDone = true;
                }
                if (yellowDone && greenDone && !finished) {
                    this.inputBlocker.enabled = false;
                    finished = true;
                    if (null != o) {
                        o();
                    }
                }
            });
        } else if (null != o) {
            o();
        }
    }

    createIconAndFlyBezier(e, t, a, o, n, i) {
        if (undefined === i) {
            i = 1;
        }
        a = new cc.Vec2(a.x - t.getParent().width / 2, a.y - t.getParent().height / 2);
        o = new cc.Vec2(o.x - t.getParent().width / 2, o.y - t.getParent().height / 2);
        t.setPosition(a);
        t.zIndex = 1e3;
        let c = e % 2 == 0 ? FrameSDK.randomIntNum(10, 60) : -FrameSDK.randomIntNum(10, 60);
        let l = FrameSDK.randomIntNum(-80, -20);
        cc.tween(t).to(.3 * i, {
            position: cc.v3(a.x + c, a.y + l)
        }, {
            easing: "quadOut"
        }).call(() => {
            this.createBezier(e, t, a, o, n, i);
        }).start();
    }

    startFlyProcess(e, t, o, n, i, r) {
        if (undefined === r) {
            r = 5;
        }
        let spriteFrame = e ? this.charity_SpriteFrame : this.icon_SpriteFrame;
        let d = this.animationRootNode.convertToNodeSpaceAR(t);
        let p = this.animationRootNode.convertToNodeSpaceAR(o);
        let h = .15;
        if (r > 1 && .2 + 1.4 + h * (r - 1) > 2) {
            h = Math.max(.01, (1.8 - 1.4) / (r - 1));
        }
        for (let index = 0; index < r; index++) {
            let pooled = effectsLayout._nodePool.get();
            let node = null !== pooled && undefined !== pooled ? pooled : new cc.Node();
            node.scale = 1;
            node.opacity = 0;
            node.setPosition(d.x, d.y, 0);
            this.animationRootNode.addChild(node);
            let sprite = node.getComponent(cc.Sprite);
            (null !== sprite && undefined !== sprite ? sprite : node.addComponent(cc.Sprite)).spriteFrame = spriteFrame;
            let offsetX = index % 2 == 0 ? FrameSDK.randomIntNum(10, 60) : -FrameSDK.randomIntNum(10, 60);
            let offsetY = FrameSDK.randomIntNum(-80, -20);
            let m = FrameSDK.randomIntNum(80, 150);
            if (index % 3 == 1) {
                m = -m;
            } else if (index % 3 == 2) {
                m = FrameSDK.randomIntNum(-80, 80);
            }
            let v = cc.v2(d.x + m, d.y - Math.abs(m));
            let y = cc.v2(p.x - m, p.y - Math.abs(m));
            let g = index;
            cc.tween(node).delay(h * index).set({
                opacity: 255
            }).to(.2, {
                x: d.x + offsetX,
                y: d.y + offsetY
            }, {
                easing: "sineInOut"
            }).bezierTo(1.4, v, y, p).call(function () {
                FrameSDK.playEffect("cash_collect");
                if (null != n) {
                    n(g);
                }
                if (g === r - 1 && null != i) {
                    i();
                }
                effectsLayout._nodePool.put(node);
            }).start();
        }
    }

    playGlodTween(e, t, o, n, i, r, c, l, u) {
        if (undefined === n) {
            n = 15;
        }
        if (undefined === i) {
            i = 150;
        }
        if (undefined === r) {
            r = 150;
        }
        if (undefined === c) {
            c = 0;
        }
        if (undefined === l) {
            l = null;
        }
        if (undefined === u) {
            u = true;
        }
        e = this.animationRootNode.convertToNodeSpaceAR(e);
        t = this.animationRootNode.convertToNodeSpaceAR(t);
        let spriteFrame = o ? this.charity_SpriteFrame : this.icon_SpriteFrame;
        let playCollect = u ? function () {
            return FrameSDK.playEffect("cash_collect");
        } : function () {};
        let finished = 0;
        for (let index = 0; index < n; index++) {
            let pooled = effectsLayout._nodePool.get();
            let node = null !== pooled && undefined !== pooled ? pooled : new cc.Node();
            let sprite = node.getComponent(cc.Sprite);
            (null !== sprite && undefined !== sprite ? sprite : node.addComponent(cc.Sprite)).spriteFrame = spriteFrame;
            node.scale = 1;
            node.opacity = 0;
            node.setPosition(e);
            this.animationRootNode.addChild(node);
            let scatter = cc.v3(e.x + FrameSDK.randomIntNum(-i, i), e.y + FrameSDK.randomIntNum(-r, r));
            let step = index;
            cc.tween(node).delay(c).set({
                opacity: 255
            }).to(.08 + .015 * step, {
                position: scatter
            }).delay(.2 + .01 * step).to(.47, {
                position: t
            }).call(function () {
                return playCollect();
            }).parallel(cc.tween().to(.2, {
                scale: 1.5
            }), cc.tween().to(.2, {
                opacity: 0
            })).call(function () {
                effectsLayout._nodePool.put(node);
                if (++finished === n && null != l) {
                    l();
                }
            }).start();
        }
    }

    onEnable() {
        cc.director.on("ADD_COIN", this.piaoCoin, this);
        cc.director.on("ADD_BIT_COIN", this.piaoBitCoin, this);
        this.inputBlocker.enabled = false;
        this.yellowCoinNode.opacity = 0;
        this.greenCoinNode.opacity = 0;
        this.activityNode.opacity = 0;
    }

    onDisable() {
        cc.director.removeAll(this);
    }

    createBezier(e, t, a, o, n, i) {
        let scale = t.scale;
        let c = FrameSDK.randomIntNum(80, 150);
        if (e % 3 == 1) {
            c = -c;
        } else if (e % 3 == 2) {
            c = FrameSDK.randomIntNum(-80, 80);
        }
        let points = [];
        let u = cc.v2(a.x + c, a.y - Math.abs(c));
        let d = cc.v2(o.x - c, o.y - Math.abs(c));
        points.push(u);
        points.push(d);
        points.push(o);
        cc.tween(t).repeatForever(cc.tween().to(.3, {
            scaleX: -1 * scale
        }).to(.3, {
            scaleX: 1 * scale
        }));
        cc.tween(t).delay(.1 * e * i).call(function () {}).parallel(cc.tween().to(.1 * i, {
            opacity: 255
        }), cc.tween().then(cc.bezierTo(1.5 * i, points))).call(function () {
            if (null != n) {
                n(e);
            }
            t.destroy();
        }).start();
    }

    playYellow() {
        this.yellowCoinNode.opacity = ++this._yellowReferenceCount > 0 ? 255 : 0;
        if (Panel_Activity.isActivityCollectable()) {
            this.activityNode.opacity = ++this._activityReferenceCount > 0 ? 255 : 0;
        }
    }

    stopGreen() {
        this._greenReferenceCount = Math.max(0, this._greenReferenceCount - 1);
        this.greenCoinNode.opacity = this._greenReferenceCount > 0 ? 255 : 0;
    }

    piaoBitCoin(e, t, a, o, n) {
        let yellowDone = false;
        let greenDone = false;
        let finished = false;
        let done = function () {
            if (yellowDone && greenDone && !finished) {
                finished = true;
                if (null != n) {
                    n();
                }
            }
        };
        if (e > 0) {
            let target = CashFishCredit.getTarget("yellowCoin");
            target = target.getChildByName("coin") || target;
            let y = target.convertToWorldSpaceAR(cc.Vec2.ZERO);
            let ox = null == o ? undefined : o.x;
            let oy = null == o ? undefined : o.y;
            let g = cc.v2(null !== ox && undefined !== ox ? ox : .5 * cc.winSize.width, null !== oy && undefined !== oy ? oy : .5 * cc.winSize.height);
            let D = e > 5 ? 5 : e;
            if (t > 0) {
                g.x -= 100;
            }
            this.playYellow();
            this.startFlyProcess(false, g, y, undefined, () => {
                cc.director.emit("FRESH_CREDIT", {
                    type: "yellowCoin",
                    num: FrameData.saveData.credit.yellowCoin + e,
                    change: e
                });
                FrameData.saveData.credit.yellowCoin += e;
                this.stopYellow();
                yellowDone = true;
                done();
            }, D);
            if (Panel_Activity.isActivityCollectable()) {
                let F = Panel_Activity.coinTarget.convertToWorldSpaceAR(cc.Vec2.ZERO);
                this.startFlyProcess(false, g, F, undefined, () => {
                    if (Panel_Activity.isActivityCollectable()) {
                        Panel_Activity.addCoin(e);
                    }
                }, D);
            }
        } else {
            yellowDone = true;
        }
        if (t > 0) {
            let target = CashFishCredit.getTarget("greenCoin");
            target = target.getChildByName("coin") || target;
            let y = target.convertToWorldSpaceAR(cc.Vec2.ZERO);
            let ox = null == o ? undefined : o.x;
            let oy = null == o ? undefined : o.y;
            let g = cc.v2(null !== ox && undefined !== ox ? ox : .5 * cc.winSize.width, null !== oy && undefined !== oy ? oy : .5 * cc.winSize.height);
            let D = t > 5 ? 5 : t;
            if (e > 0) {
                g.x += 100;
            }
            this.playGreen();
            this.startFlyProcess(true, g, y, undefined, () => {
                cc.director.emit("FRESH_CREDIT", {
                    type: "greenCoin",
                    num: FrameData.saveData.credit.greenCoin + t,
                    change: t
                });
                FrameData.saveData.credit.greenCoin += t;
                let rate = FrameData.getCoinOutNum("charityRate");
                for (let i = 0; i < a; i++) {
                    FrameData.saveData.charityDonated += FrameSDK.randomInt(rate[0], rate[1]);
                }
                FrameData.saveData.charityDonateTime += Math.max(0, Math.floor(a));
                this.stopGreen();
                greenDone = true;
                done();
            }, D);
        } else {
            greenDone = true;
        }
        done();
        if (!finished) {
            FrameSDK.playEffect("pool_ui_butie");
        }
    }

    stopYellow() {
        this._yellowReferenceCount = Math.max(0, this._yellowReferenceCount - 1);
        this.yellowCoinNode.opacity = this._yellowReferenceCount > 0 ? 255 : 0;
        if (this.activityNode.opacity > 0) {
            this._activityReferenceCount = Math.max(0, this._activityReferenceCount - 1);
            this.activityNode.opacity = this._activityReferenceCount > 0 ? 255 : 0;
        }
    }
}
