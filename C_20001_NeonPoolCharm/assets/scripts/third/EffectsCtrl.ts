import PlayerDataSys from "./PlayerDataSys";
import { RewardType } from "./RequestData";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import EngineUtil from "./EngineUtil";
import GameDataMgr, { EffectEnum } from "./GameDataMgr";

const { ccclass } = cc._decorator;

export const prefabsEnum = cc.Enum({
    casheffect: 0,
    diamondeffect: 1,
    AddCashNumEffect: 2,
    AddDiamondNumEffect: 3,
    yellowcasheffect: 4,
    earn: 5,
});

const spriteFramePaths: string[] = [];
const prefabPaths: string[] = [];

@ccclass
export default class EffectsCtrl extends cc.Component {
    effectPool = new cc.NodePool();
    cashPool = new cc.NodePool();
    earnPool = new cc.NodePool();
    load_imgs: cc.SpriteFrame[] = [];
    load_fruits: unknown[] = [];
    load_prefabs: cc.Prefab[] = [];
    tarNodes = new Map<number, cc.Node>();
    diamondPool = new cc.NodePool();
    isEnableWork = false;

    loadSpriteFrames(): void {
        for (let i = 0; i < spriteFramePaths.length; i++) {
            const path = "" + spriteFramePaths[i];
            cc.loader.loadRes(
                path,
                cc.SpriteFrame,
                function (this: EffectsCtrl, err: Error, frame: cc.SpriteFrame) {
                    if (err) {
                        cc.error(err.message || err);
                    } else if (frame instanceof cc.SpriteFrame) {
                        this.load_imgs[i] = frame;
                    }
                }.bind(this)
            );
        }
    }

    onLoad(): void {
        EventMgr.listen(GameEventType.SHOWEFFECT_FLYINGRED, this.addEffects, this);
        EventMgr.listen(GameEventType.SET_EFFECT_TARGETS, this.setTargetNodes, this);
        EventMgr.listen(GameEventType.PUSH_EFFECT_TARGETS, this.pushTargetNode, this);
        EventMgr.listen(GameEventType.SHOWEFFECT_BLANCE, this.addCashNumEffect, this);
        EventMgr.listen(GameEventType.SHOWEFFECT_DIAMOND, this.addLoveNumEffect, this);
        EventMgr.listen(GameEventType.GUIDEEFFECT, this.guideEffect, this);
        EventMgr.listen(GameEventType.SHOWEFFECT_EARN, this.earnEffect, this);
    }

    earnEffect(targetNode: cc.Node): void {
        const pos = EngineUtil.convertNodePosition(cc.find("persist/effects"), targetNode);
        const prefab = this.load_prefabs[prefabsEnum.earn];
        if (prefab) {
            const node = this.earnPool.size() > 0 ? this.earnPool.get() : cc.instantiate(prefab);
            node.setPosition(pos);
            this.getEffectParent().addChild(node);
            node.scale = 0;
            cc.tween(node)
                .by(0.5, { scale: 1 })
                .by(0.5, { scale: 0 })
                .call(() => this.recoveryEarn(node))
                .start();
        } else {
            console.error("CashEffect error");
        }
    }

    addEffect(
        startPos: cc.Vec2,
        endPos: cc.Vec2,
        rewardType: number,
        callback?: () => void,
        _seedId?: unknown,
        _reward?: unknown,
        _index?: number
    ): void {
        let prefab: cc.Prefab = null;
        if (rewardType == RewardType.XianJin) {
            prefab = this.load_prefabs[prefabsEnum.diamondeffect];
        } else if (rewardType == RewardType.HongBao) {
            prefab = this.load_prefabs[prefabsEnum.casheffect];
        } else {
            prefab = this.load_prefabs[prefabsEnum.AddCashNumEffect];
        }
        if (prefab) {
            let pool: cc.NodePool = null;
            if (rewardType == RewardType.XianJin) {
                pool = this.diamondPool;
            } else if (rewardType == RewardType.HongBao) {
                pool = this.cashPool;
            } else {
                pool = this.effectPool;
            }
            const node = pool.size() > 0 ? pool.get() : cc.instantiate(prefab);
            if (this.getTarNode(rewardType)) {
                if (node) {
                    node.setPosition(startPos);
                    let scatter = 110;
                    if (rewardType == 4) {
                        scatter = 110;
                    }
                    const rot = EngineUtil.getRandomNum(0, 360);
                    scatter = EngineUtil.getRandomNum(10, scatter);
                    const offset = EngineUtil.getPosByRot(scatter, rot);
                    const duration = EngineUtil.getRandomNum(8, 10) / 16;
                    this.node.addChild(node);
                    callback && EventMgr.trigger(GameEventType.EFFECTFLYSTART);
                    cc.tween(node)
                        .by(0.1, { x: offset.x, y: offset.y })
                        .delay(0.1)
                        .to(duration, { x: endPos.x, y: endPos.y }, { easing: "cubicIn" })
                        .to(0.1, { scale: 0 })
                        .call(() => {
                            if (callback) {
                                callback();
                                EventMgr.trigger(GameEventType.EFFECTFLYEND, rewardType);
                            }
                            cc.Tween.stopAllByTarget(node);
                            node.scale = 1;
                            pool.put(node);
                        })
                        .start();
                } else {
                    console.error("effect error " + rewardType);
                }
            } else {
                console.error("tarNode error " + rewardType);
            }
        } else {
            console.error("effect error");
        }
    }

    onDestroy(): void {
        EventMgr.ignore(GameEventType.SHOWEFFECT_FLYINGRED, this.addEffects, this);
        EventMgr.ignore(GameEventType.SET_EFFECT_TARGETS, this.setTargetNodes, this);
        EventMgr.ignore(GameEventType.PUSH_EFFECT_TARGETS, this.pushTargetNode, this);
        EventMgr.ignore(GameEventType.SHOWEFFECT_BLANCE, this.addCashNumEffect, this);
        EventMgr.ignore(GameEventType.SHOWEFFECT_DIAMOND, this.addLoveNumEffect, this);
        EventMgr.ignore(GameEventType.GUIDEEFFECT, this.guideEffect, this);
        EventMgr.ignore(GameEventType.SHOWEFFECT_EARN, this.earnEffect, this);
    }

    pushTargetNode(targets: Map<number, cc.Node>): void {
        if (targets) {
            if (this.tarNodes.size > 0) {
                targets.forEach((node, key) => {
                    this.tarNodes.set(key, node);
                });
            } else {
                this.tarNodes = targets;
            }
            this.isEnableWork = true;
        }
    }

    getEffectParent(): cc.Node {
        return this.node;
    }

    recoveryCash(node: cc.Node): void {
        cc.Tween.stopAllByTarget(node);
        node.scale = 1;
        this.cashPool.put(node);
    }

    addCashNumEffect(amount: number): void {
        const prefab = this.load_prefabs[prefabsEnum.AddCashNumEffect];
        if (prefab) {
            const node = this.cashPool.size() > 0 ? this.cashPool.get() : cc.instantiate(prefab);
            node.getComponent(cc.Label).string = "+" + PlayerDataSys.getCashWithUnit(amount);
            const target = this.getTarNode(EffectEnum.cash);
            if (target) {
                const localPos = this.node.convertToNodeSpaceAR(target.convertToWorldSpaceAR(cc.v2(0, 0)));
                node.setPosition(cc.v2(localPos.x + 80, localPos.y));
                this.getEffectParent().addChild(node);
                node.opacity = 255;
                cc.tween(node)
                    .by(1.5, { y: 40, opacity: -100 })
                    .call(() => this.recoveryCash(node))
                    .start();
            } else {
                console.error("tarNode error 0000");
            }
        } else {
            console.error("CashEffect error");
        }
    }

    recoveryEarn(node: cc.Node): void {
        cc.Tween.stopAllByTarget(node);
        this.earnPool.put(node);
    }

    setTargetNodes(targets: Map<number, cc.Node>): void {
        if (targets) {
            this.tarNodes = targets;
            this.isEnableWork = true;
        }
    }

    guideEffect(): void {
        let targetPos: cc.Vec2 = null;
        const targetNode = this.getTarNode(0);
        if (targetNode) {
            const pos = EngineUtil.convertNodePosition(this.node, targetNode);
            targetPos = cc.v2(pos.x, pos.y);
        }
        for (let i = 0; i < this.node.children.length; i++) {
            const child = this.node.children[i];
            cc.tween(child)
                .to(1, { x: targetPos.x, y: targetPos.y }, { easing: "cubicIn" })
                .call(() => {
                    targetNode.parent.getChildByName("sk").active = true;
                    targetNode.parent
                        .getChildByName("sk")
                        .getComponent(sp.Skeleton)
                        .setAnimation(0, "fankui", false);
                })
                .to(0.1, { scale: 0 })
                .call(() => this.recoveryEffect(child))
                .start();
        }
    }

    getTarNode(key: number): cc.Node {
        const node = this.tarNodes.get(key);
        if (cc.isValid(node)) {
            return node;
        }
    }

    addLoveNumEffect(amount: number): void {
        const prefab = this.load_prefabs[prefabsEnum.AddDiamondNumEffect];
        if (prefab) {
            const node = this.diamondPool.size() > 0 ? this.diamondPool.get() : cc.instantiate(prefab);
            node.getComponent(cc.Label).string = "+" + amount;
            const target = this.getTarNode(EffectEnum.cash);
            if (target) {
                const localPos = this.node.convertToNodeSpaceAR(target.convertToWorldSpaceAR(cc.v2(0, 0)));
                node.setPosition(cc.v2(localPos.x + 45, localPos.y));
                this.getEffectParent().addChild(node);
                node.opacity = 255;
                cc.tween(node)
                    .by(1.5, { y: 40, opacity: -100 })
                    .call(() => this.recoveryDiamond(node))
                    .start();
            } else {
                console.error("tarNode error 0000");
            }
        } else {
            console.error("LoveNumEffect error");
        }
    }

    addEffects(data: {
        num: number;
        startPos: cc.Vec2;
        endPos: cc.Vec2;
        type: number[];
        callback: () => void;
        seed_id: unknown;
        reward: unknown;
        reward_money?: unknown;
        reward_love?: unknown;
    }): void {
        if (this.isEnableWork) {
            const count = data.num;
            let startPos = data.startPos;
            let endPos = data.endPos;
            const types = data.type;
            const callback = data.callback;
            const seedId = data.seed_id;
            const reward = data.reward;
            const resetEndPos = !endPos;
            for (let i = 0; i < types.length; i++) {
                const rewardType = types[i];
                if (!endPos) {
                    const target = this.getTarNode(rewardType);
                    if (target) {
                        const pos = EngineUtil.convertNodePosition(this.node, target);
                        endPos = cc.v2(pos.x, pos.y);
                    }
                }
                for (let j = 0; j < count; j++) {
                    if (j == count - 1) {
                        this.addEffect(startPos, endPos, rewardType, callback, seedId, reward);
                    } else {
                        this.addEffect(startPos, endPos, rewardType, null, seedId, "", j);
                    }
                }
                if (resetEndPos) {
                    endPos = null;
                }
            }
        }
    }

    start(): void {
        this.loadSpriteFrames();
        this.loadPrefabs();
    }

    loadPrefabs(): void {
        for (let i = 0; i < prefabPaths.length; i++) {
            const path = "prefabs/" + prefabPaths[i];
            cc.loader.loadRes(
                path,
                cc.Prefab,
                function (this: EffectsCtrl, err: Error, prefab: cc.Prefab) {
                    if (err) {
                        cc.error(err.message || err);
                    } else if (prefab instanceof cc.Prefab) {
                        this.load_prefabs[i] = prefab;
                    }
                }.bind(this)
            );
        }
    }

    recoveryDiamond(node: cc.Node): void {
        cc.Tween.stopAllByTarget(node);
        node.scale = 1;
        this.diamondPool.put(node);
    }

    recoveryEffect(node: cc.Node): void {
        cc.Tween.stopAllByTarget(node);
        node.scale = 1;
        this.effectPool.put(node);
    }

    loadArray(arr: unknown[], index: number, value: unknown): void {
        if (value) {
            arr[index] = value;
        }
    }
}
