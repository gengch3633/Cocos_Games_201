import BallLogicMgr from "./BallLogicMgr";
import DB from "./DB";
import GlobalConfig from "./GlobalConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopListItemComp extends cc.Component {
    @property
    idx = 0;

    isEditing: boolean = null;
    btn_state: number = null;
    cfg: any = null;
    shop: any = null;
    type: number = null;

    update(): void {
    }

    setShop(shop: any): void {
        this.shop = shop;
    }

    setupConfig(type: number, config: any): void {
        this.type = type;
        this.cfg = config;
        const coinNode = cc.find("node_coin", this.node);
        const coinLabel = cc.find("label_coin", coinNode);
        let ballNode = cc.find("node_ball2_shop_all", this.node);
        coinLabel.getComponent(cc.Label).string = config.cost;
        ballNode.getComponent(cc.ParticleSystem).enabled = false;
        ballNode = cc.find("node_ball2_shop_all", this.node);
        if (type == 0) {
            ballNode.getComponent("BallMaterialComp").setMatIdx(this.cfg.matIdx);
        } else if (type == 1) {
            ballNode.getComponent("BallMaterialComp").setMatIdx(1);
        } else if (type == 2) {
            ballNode.getComponent("BallMaterialComp").setMatIdx(1);
            ballNode.getComponent(cc.ParticleSystem).enabled = true;
            cc.loader.loadRes("mParticles/" + this.cfg.file, cc.ParticleAsset, (_err, particleAsset) => {
                ballNode.getComponent(cc.ParticleSystem).file = particleAsset;
            });
        }
        this.update_btnstate();
    }

    set_btnstate(state: number): void {
        this.btn_state = state;
        const buyLabel = cc.find("button_buy", this.node).getChildByName("Background").getChildByName("Label");
        const inUseNode = cc.find("cm_inuse", this.node);
        inUseNode.opacity = 0;
        if (state == 0) {
            buyLabel.getComponent(cc.Label).string = "购买";
        } else if (state == 1) {
            buyLabel.getComponent(cc.Label).string = "装备";
        } else if (state == 2) {
            buyLabel.getComponent(cc.Label).string = "卸下";
            inUseNode.opacity = 255;
        }
    }

    setAsEditing(editing: boolean): void {
        this.isEditing = editing;
    }

    getIsEditing(): boolean {
        return this.isEditing;
    }

    onLoad(): void {
        this.idx = this.idx || 0;
        this.isEditing = this.isEditing || false;
        cc.find("node_ball2_shop_all", this.node).getComponent("BallMaterialComp").setMatIdx(0);
        cc.find("button_buy", this.node).on("click", () => {
            console.log("cfg", this.cfg, DB.userInfo.coin, this.type, this.cfg.cid);
            if (this.cfg) {
                if (this.btn_state == 0) {
                    if (DB.userInfo.coin >= this.cfg.cost) {
                        if (this.type == 0) {
                            this.cfg.cid &&
                                BallLogicMgr.buy_ball(this.cfg, (_data, resultCode) => {
                                    if (resultCode == 0) {
                                        DB.userInfo.coin = DB.userInfo.coin - this.cfg.cost;
                                        this.set_btnstate(1);
                                        this.shop.updateCoin();
                                        this.showTip("购买成功");
                                    }
                                });
                        } else if (this.type == 1) {
                            this.cfg.cid &&
                                BallLogicMgr.buy_color(this.cfg, () => {
                                    DB.userInfo.coin = DB.userInfo.coin - this.cfg.cost;
                                    this.set_btnstate(1);
                                    this.shop.updateCoin();
                                    this.showTip("购买成功");
                                });
                        } else if (this.type == 2) {
                            this.cfg.cid &&
                                BallLogicMgr.buy_particle(this.cfg, () => {
                                    DB.userInfo.coin = DB.userInfo.coin - this.cfg.cost;
                                    this.set_btnstate(1);
                                    this.shop.updateCoin();
                                    this.showTip("购买成功");
                                });
                        }
                    } else {
                        BallLogicMgr.coin_notEnough();
                        this.showTip("金币不足");
                    }
                } else if (this.btn_state == 1) {
                    if (this.type == 0) {
                        if (this.cfg.cid) {
                            BallLogicMgr.pack_ballMatIdx(this.cfg.cid);
                            BallLogicMgr.last_pack_ball = this;
                        }
                    } else if (this.type == 1) {
                        if (this.cfg.cid) {
                            BallLogicMgr.pack_color(this.cfg.cid);
                            BallLogicMgr.last_pack_color && BallLogicMgr.last_pack_color.set_btnstate(1);
                            BallLogicMgr.last_pack_color = this;
                        }
                    } else if (this.type == 2 && this.cfg.cid) {
                        BallLogicMgr.pack_particle(this.cfg.cid);
                        BallLogicMgr.last_pack_particle && BallLogicMgr.last_pack_particle.set_btnstate(1);
                        BallLogicMgr.last_pack_particle = this;
                    }
                    this.set_btnstate(2);
                } else if (this.btn_state == 2) {
                    if (this.type == 0) {
                        if (this.cfg.cid) {
                            BallLogicMgr.unpack_ballMatIdx(this.cfg.cid);
                            BallLogicMgr.last_pack_ball = null;
                        }
                    } else if (this.type == 1) {
                        if (this.cfg.cid) {
                            BallLogicMgr.pack_color(-1);
                            BallLogicMgr.last_pack_color = null;
                        }
                    } else if (this.type == 2 && this.cfg.cid) {
                        BallLogicMgr.pack_particle(-1);
                        BallLogicMgr.last_pack_particle = null;
                    }
                    this.set_btnstate(1);
                }
            }
        });
        this.set_btnstate(0);
    }

    onDestroy(): void {
        this.clear();
    }

    onEnable(): void {
    }

    update_btnstate(): void {
        if (this.cfg) {
            const cid = this.cfg.cid;
            if (this.type == 0) {
                console.log("PageType.Ball bmIdx", DB.userInfo.reward.bmIdx, typeof DB.userInfo.reward.bmIdx);
                if (DB.userInfo.reward.bmIdx.indexOf(cid) < 0) {
                    this.set_btnstate(0);
                } else if (GlobalConfig.shop_ball_get().arr.indexOf(cid) >= 0) {
                    this.set_btnstate(2);
                    BallLogicMgr.last_pack_ball = this;
                } else {
                    this.set_btnstate(1);
                }
            } else if (this.type == 1) {
                if (DB.userInfo.reward.btx1.indexOf(cid) < 0) {
                    this.set_btnstate(0);
                } else if (GlobalConfig.shop_color_get() == cid) {
                    this.set_btnstate(2);
                    BallLogicMgr.last_pack_color = this;
                } else {
                    this.set_btnstate(1);
                }
            } else if (this.type == 2) {
                if (DB.userInfo.reward.btx2.indexOf(cid) < 0) {
                    this.set_btnstate(0);
                } else if (GlobalConfig.shop_particle_get() == cid) {
                    this.set_btnstate(2);
                    BallLogicMgr.last_pack_particle = this;
                } else {
                    this.set_btnstate(1);
                }
            }
        }
    }

    showTip(message: string): void {
        this.shop.showTip(message);
    }

    random_move(enable: boolean): void {
        const ballNode = cc.find("node_ball2_shop_all", this.node);
        if (enable) {
            const moveRight = cc.moveTo(2.3, cc.v2(100, ballNode.y));
            const moveLeft = cc.moveTo(2.3, cc.v2(-100, ballNode.y));
            const repeatAction = cc.repeatForever(cc.sequence(moveRight, moveLeft));
            ballNode.runAction(repeatAction);
        } else {
            ballNode.x = 0;
            ballNode.stopAllActions();
        }
    }

    clear(): void {
    }

    setData(): void {
    }
}
