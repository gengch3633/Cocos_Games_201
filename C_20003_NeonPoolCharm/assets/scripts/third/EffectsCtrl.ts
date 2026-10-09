import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import { EffectEnum } from "./GameDataMgr";
import GameEventType from "./GameEventType";
import PlayerDataSys from "./PlayerDataSys";
import { RewardType } from "./RequestData";

const { ccclass } = cc._decorator;

export const prefabsEnum = cc.Enum({
    casheffect: 0,
    diamondeffect: 1,
    AddCashNumEffect: 2,
    AddDiamondNumEffect: 3,
    yellowcasheffect: 4,
    earn: 5
});

const _ = [];
const f = [];

@ccclass
export default class EffectsCtrl extends cc.Component {
    effectPool = new cc.NodePool();
    cashPool = new cc.NodePool();
    earnPool = new cc.NodePool();
    load_imgs = [];
    load_fruits = [];
    load_prefabs = [];
    tarNodes = new Map();
    diamondPool = new cc.NodePool();
    isEnableWork = false;
    node = null;

    loadSpriteFrames() {
        const t = this;
        const e = function (e) {
            const o = "" + _[e];
            cc.loader.loadRes(o, cc.SpriteFrame, function (t, o) {
                t ? cc.error(t.message || t) : o instanceof cc.SpriteFrame && (this.load_imgs[e] = o);
            }.bind(t));
        };
        for (let o = 0; o < _.length; o++) e(o);
    }

    onLoad() {
        EventMgr.listen(GameEventType.SHOWEFFECT_FLYINGRED, this.addEffects, this);
        EventMgr.listen(GameEventType.SET_EFFECT_TARGETS, this.setTargetNodes, this);
        EventMgr.listen(GameEventType.PUSH_EFFECT_TARGETS, this.pushTargetNode, this);
        EventMgr.listen(GameEventType.SHOWEFFECT_BLANCE, this.addCashNumEffect, this);
        EventMgr.listen(GameEventType.SHOWEFFECT_DIAMOND, this.addLoveNumEffect, this);
        EventMgr.listen(GameEventType.GUIDEEFFECT, this.guideEffect, this);
        EventMgr.listen(GameEventType.SHOWEFFECT_EARN, this.earnEffect, this);
    }

    earnEffect(e) {
        const t = this;
        const n = EngineUtil.convertNodePosition(cc.find("persist/effects"), e);
        const i = this.load_prefabs[prefabsEnum.earn];
        if (i) {
            const a = this.earnPool.size() > 0 ? this.earnPool.get() : cc.instantiate(i);
            a.setPosition(n);
            this.getEffectParent().addChild(a);
            a.scale = 0;
            cc.tween(a).by(.5, {
                scale: 1
            }).by(.5, {
                scale: 0
            }).call(function () {
                return t.recoveryEarn(a);
            }).start();
        } else console.error("CashEffect error");
    }

    addEffect(e, t, n, i, seed_id?, reward?, index?) {
        let a;
        if (a = n == RewardType.XianJin ? this.load_prefabs[prefabsEnum.diamondeffect] : n == RewardType.HongBao ? this.load_prefabs[prefabsEnum.casheffect] : this.load_prefabs[prefabsEnum.AddCashNumEffect]) {
            let r;
            const p = (r = n == RewardType.XianJin ? this.diamondPool : n == RewardType.HongBao ? this.cashPool : this.effectPool).size() > 0 ? r.get() : cc.instantiate(a);
            if (this.getTarNode(n)) {
                if (p) {
                    p.setPosition(e);
                    let d = 110;
                    4 == n && (d = 110);
                    const _ = EngineUtil.getRandomNum(0, 360);
                    d = EngineUtil.getRandomNum(10, d);
                    const f = EngineUtil.getPosByRot(d, _);
                    const h = f.x;
                    const g = f.y;
                    const y = EngineUtil.getRandomNum(8, 10) / 16;
                    this.node.addChild(p);
                    i && EventMgr.trigger(GameEventType.EFFECTFLYSTART);
                    cc.tween(p).by(.1, {
                        x: h,
                        y: g
                    }).delay(.1).to(y, {
                        x: t.x,
                        y: t.y
                    }, {
                        easing: "cubicIn"
                    }).to(.1, {
                        scale: 0
                    }).call(function () {
                        if (i) {
                            i();
                            EventMgr.trigger(GameEventType.EFFECTFLYEND, n);
                        }
                        cc.Tween.stopAllByTarget(p);
                        p.scale = 1;
                        r.put(p);
                    }).start();
                } else console.error("effect error " + n);
            } else console.error("tarNode error " + n);
        } else console.error("effect error");
    }

    onDestroy() {
        EventMgr.ignore(GameEventType.SHOWEFFECT_FLYINGRED, this.addEffects, this);
        EventMgr.ignore(GameEventType.SET_EFFECT_TARGETS, this.setTargetNodes, this);
        EventMgr.ignore(GameEventType.PUSH_EFFECT_TARGETS, this.pushTargetNode, this);
        EventMgr.ignore(GameEventType.SHOWEFFECT_BLANCE, this.addCashNumEffect, this);
        EventMgr.ignore(GameEventType.SHOWEFFECT_DIAMOND, this.addLoveNumEffect, this);
        EventMgr.ignore(GameEventType.GUIDEEFFECT, this.guideEffect, this);
        EventMgr.ignore(GameEventType.SHOWEFFECT_EARN, this.earnEffect, this);
    }

    pushTargetNode(e) {
        const t = this;
        if (e) {
            this.tarNodes.size > 0 ? e.forEach(function (e, o) {
                t.tarNodes.set(o, e);
            }) : this.tarNodes = e;
            this.isEnableWork = true;
        }
    }

    getEffectParent() {
        return this.node;
    }

    recoveryCash(e) {
        cc.Tween.stopAllByTarget(e);
        e.scale = 1;
        this.cashPool.put(e);
    }

    addCashNumEffect(e) {
        const t = this;
        const n = this.load_prefabs[prefabsEnum.AddCashNumEffect];
        if (n) {
            const i = this.cashPool.size() > 0 ? this.cashPool.get() : cc.instantiate(n);
            i.getComponent(cc.Label).string = "+" + PlayerDataSys.getCashWithUnit(e);
            const a = this.getTarNode(EffectEnum.cash);
            if (a) {
                const l = this.node.convertToNodeSpaceAR(a.convertToWorldSpaceAR(cc.v2(0, 0)));
                const s = l.x;
                const c = l.y;
                i.setPosition(cc.v2(s + 80, c + 0));
                this.getEffectParent().addChild(i);
                i.opacity = 255;
                cc.tween(i).by(1.5, {
                    y: 40,
                    opacity: -100
                }).call(function () {
                    return t.recoveryCash(i);
                }).start();
            } else console.error("tarNode error 0000");
        } else console.error("CashEffect error");
    }

    recoveryEarn(e) {
        cc.Tween.stopAllByTarget(e);
        this.earnPool.put(e);
    }

    setTargetNodes(e) {
        if (e) {
            this.tarNodes = e;
            this.isEnableWork = true;
        }
    }

    guideEffect() {
        let e;
        const t = this;
        const o = this.getTarNode(0);
        if (o) {
            const n = EngineUtil.convertNodePosition(this.node, o);
            e = cc.v2(n.x, n.y);
        }
        const a = this;
        const i = function (n) {
            const i = a.node.children[n];
            cc.tween(i).to(1, {
                x: e.x,
                y: e.y
            }, {
                easing: "cubicIn"
            }).call(function () {
                o.parent.getChildByName("sk").active = true;
                o.parent.getChildByName("sk").getComponent(sp.Skeleton).setAnimation(0, "fankui", false);
            }).to(.1, {
                scale: 0
            }).call(function () {
                t.recoveryEffect(i);
            }).start();
        };
        for (let r = 0; r < this.node.children.length; r++) i(r);
    }

    getTarNode(e) {
        let t;
        t = this.tarNodes.get(e);
        if (cc.isValid(t)) return t;
    }

    addLoveNumEffect(e) {
        const t = this;
        const n = this.load_prefabs[prefabsEnum.AddDiamondNumEffect];
        if (n) {
            const i = this.diamondPool.size() > 0 ? this.diamondPool.get() : cc.instantiate(n);
            i.getComponent(cc.Label).string = "+" + e;
            const a = this.getTarNode(EffectEnum.cash);
            if (a) {
                const r = this.node.convertToNodeSpaceAR(a.convertToWorldSpaceAR(cc.v2(0, 0)));
                const l = r.x;
                const s = r.y;
                i.setPosition(cc.v2(l + 45, s + 0));
                this.getEffectParent().addChild(i);
                i.opacity = 255;
                cc.tween(i).by(1.5, {
                    y: 40,
                    opacity: -100
                }).call(function () {
                    return t.recoveryDiamond(i);
                }).start();
            } else console.error("tarNode error 0000");
        } else console.error("LoveNumEffect error");
    }

    addEffects(e) {
        if (this.isEnableWork) for (let t = e.num, o = e.startPos, n = e.endPos, i = e.type, a = e.callback, r = e.seed_id, l = e.reward, s = (e.reward_money, e.reward_love, !n), c = 0; c < i.length; c++) {
            const p = i[c];
            if (!n) {
                const d = this.getTarNode(p);
                if (d) {
                    const _ = EngineUtil.convertNodePosition(this.node, d);
                    n = cc.v2(_.x, _.y);
                }
            }
            for (let f = t, h = 0; h < f; h++) h == f - 1 ? this.addEffect(o, n, p, a, r, l) : this.addEffect(o, n, p, null, r, "", h);
            s && (n = null);
        }
    }

    start() {
        this.loadSpriteFrames();
        this.loadPrefabs();
    }

    loadPrefabs() {
        const t = this;
        const e = function (e) {
            const o = "prefabs/" + f[e];
            cc.loader.loadRes(o, cc.Prefab, function (t, o) {
                t ? cc.error(t.message || t) : o instanceof cc.Prefab && (this.load_prefabs[e] = o);
            }.bind(t));
        };
        for (let o = 0; o < f.length; o++) e(o);
    }

    recoveryDiamond(e) {
        cc.Tween.stopAllByTarget(e);
        e.scale = 1;
        this.diamondPool.put(e);
    }

    recoveryEffect(e) {
        cc.Tween.stopAllByTarget(e);
        e.scale = 1;
        this.effectPool.put(e);
    }

    loadArray(e, t, o) {
        o && (e[t] = o);
    }
}
