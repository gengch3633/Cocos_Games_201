import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import GameDataMgr, { EffectEnum } from "./GameDataMgr";
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
    load_fruits: any[] = [];
    load_prefabs: cc.Prefab[] = [];
    tarNodes = new Map<number, cc.Node>();
    diamondPool = new cc.NodePool();
    isEnableWork = false;

    loadSpriteFrames(): void {
        for (let i = 0; i < spriteFramePaths.length; i++) {
            const path = "" + spriteFramePaths[i];
            cc.loader.loadRes(path, cc.SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    cc.error(err.message || err);
                } else if (spriteFrame instanceof cc.SpriteFrame) {
                    this.load_imgs[i] = spriteFrame;
                }
            });
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
        const startPos = EngineUtil.convertNodePosition(cc.find("persist/effects"), targetNode);
        const prefab = this.load_prefabs[prefabsEnum.earn];
        if (prefab) {
            const node = this.earnPool.size() > 0 ? this.earnPool.get() : cc.instantiate(prefab);
            node.setPosition(startPos);
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
        _seedId?: any,
        _reward?: any,
        _index?: number
    ): void {
        let prefab: cc.Prefab;
        if (rewardType == RewardType.XianJin) {
            prefab = this.load_prefabs[prefabsEnum.diamondeffect];
        } else if (rewardType == RewardType.HongBao) {
            prefab = this.load_prefabs[prefabsEnum.casheffect];
        } else {
            prefab = this.load_prefabs[prefabsEnum.AddCashNumEffect];
        }
        if (prefab) {
            let pool: cc.NodePool;
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
                    const rotation = EngineUtil.getRandomNum(0, 360);
                    scatter = EngineUtil.getRandomNum(10, scatter);
                    const offset = EngineUtil.getPosByRot(scatter, rotation);
                    const duration = EngineUtil.getRandomNum(8, 10) / 16;
                    this.node.addChild(node);
                    if (callback) {
                        EventMgr.trigger(GameEventType.EFFECTFLYSTART);
                    }
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

    pushTargetNode(nodes: Map<number, cc.Node>): void {
        if (nodes) {
            if (this.tarNodes.size > 0) {
                nodes.forEach((node, key) => {
                    this.tarNodes.set(key, node);
                });
            } else {
                this.tarNodes = nodes;
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
                node.setPosition(cc.v2(localPos.x + 80, localPos.y + 0));
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

    setTargetNodes(nodes: Map<number, cc.Node>): void {
        if (nodes) {
            this.tarNodes = nodes;
            this.isEnableWork = true;
        }
    }

    guideEffect(): void {
        let endPos: cc.Vec2;
        const target = this.getTarNode(0);
        if (target) {
            const pos = EngineUtil.convertNodePosition(this.node, target);
            endPos = cc.v2(pos.x, pos.y);
        }
        for (let i = 0; i < this.node.children.length; i++) {
            const child = this.node.children[i];
            cc.tween(child)
                .to(1, { x: endPos.x, y: endPos.y }, { easing: "cubicIn" })
                .call(() => {
                    target.parent.getChildByName("sk").active = true;
                    target.parent.getChildByName("sk").getComponent(sp.Skeleton).setAnimation(0, "fankui", false);
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
                node.setPosition(cc.v2(localPos.x + 45, localPos.y + 0));
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
        endPos?: cc.Vec2;
        type: number[];
        callback?: () => void;
        seed_id?: any;
        reward?: any;
    }): void {
        if (this.isEnableWork) {
            let num = data.num;
            let startPos = data.startPos;
            let endPos = data.endPos;
            const types = data.type;
            const callback = data.callback;
            const seedId = data.seed_id;
            const reward = data.reward;
            const keepEndPos = !endPos;
            for (let c = 0; c < types.length; c++) {
                const rewardType = types[c];
                if (!endPos) {
                    const target = this.getTarNode(rewardType);
                    if (target) {
                        const pos = EngineUtil.convertNodePosition(this.node, target);
                        endPos = cc.v2(pos.x, pos.y);
                    }
                }
                const count = num;
                for (let h = 0; h < count; h++) {
                    if (h == count - 1) {
                        this.addEffect(startPos, endPos, rewardType, callback, seedId, reward);
                    } else {
                        this.addEffect(startPos, endPos, rewardType, null, seedId, "", h);
                    }
                }
                if (keepEndPos) {
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
            cc.loader.loadRes(path, cc.Prefab, (err, prefab) => {
                if (err) {
                    cc.error(err.message || err);
                } else if (prefab instanceof cc.Prefab) {
                    this.load_prefabs[i] = prefab;
                }
            });
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

    loadArray(arr: any[], index: number, value: any): void {
        if (value) {
            arr[index] = value;
        }
    }
}
