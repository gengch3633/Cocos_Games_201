import BallLogicMgr from "./BallLogicMgr";
import DB from "./DB";
import GlobalConfig from "./GlobalConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopListItemComp extends cc.Component {
    @property
    idx = 0;

    isEditing = null;
    btn_state = null;
    cfg = null;
    shop = null;
    type = null;

    update() {}

    setShop(e) {
        this.shop = e;
    }

    setupConfig(e, t) {
        this.type = e;
        this.cfg = t;
        const o = cc.find("node_coin", this.node);
        const n = cc.find("label_coin", o);
        let i = cc.find("node_ball2_shop_all", this.node);
        n.getComponent(cc.Label).string = t.cost;
        i.getComponent(cc.ParticleSystem).enabled = false;
        i = cc.find("node_ball2_shop_all", this.node);
        if (0 == e) i.getComponent("BallMaterialComp").setMatIdx(this.cfg.matIdx);else if (1 == e) i.getComponent("BallMaterialComp").setMatIdx(1);else if (2 == e) {
            i.getComponent("BallMaterialComp").setMatIdx(1);
            i.getComponent(cc.ParticleSystem).enabled = true;
            cc.loader.loadRes("mParticles/" + this.cfg.file, cc.ParticleAsset, function (e, t) {
                i.getComponent(cc.ParticleSystem).file = t;
            });
        }
        this.update_btnstate();
    }

    set_btnstate(e) {
        this.btn_state = e;
        const t = cc.find("button_buy", this.node).getChildByName("Background").getChildByName("Label");
        const o = cc.find("cm_inuse", this.node);
        o.opacity = 0;
        if (0 == e) t.getComponent(cc.Label).string = "购买";else if (1 == e) t.getComponent(cc.Label).string = "装备";else if (2 == e) {
            t.getComponent(cc.Label).string = "卸下";
            o.opacity = 255;
        }
    }

    setAsEditing(e) {
        this.isEditing = e;
    }

    getIsEditing() {
        return this.isEditing;
    }

    onLoad() {
        const e = this;
        this.idx = this.idx || 0;
        this.isEditing = this.isEditing || false;
        cc.find("node_ball2_shop_all", this.node).getComponent("BallMaterialComp").setMatIdx(0);
        cc.find("button_buy", this.node).on("click", function () {
            console.log("cfg", e.cfg, DB.userInfo.coin, e.type, e.cfg.cid);
            if (e.cfg) if (0 == e.btn_state) {
                if (DB.userInfo.coin >= e.cfg.cost) 0 == e.type ? e.cfg.cid && BallLogicMgr.buy_ball(e.cfg, function (t, o) {
                    if (0 == o) {
                        DB.userInfo.coin = DB.userInfo.coin - e.cfg.cost;
                        e.set_btnstate(1);
                        e.shop.updateCoin();
                        e.showTip("购买成功");
                    }
                }) : 1 == e.type ? e.cfg.cid && BallLogicMgr.buy_color(e.cfg, function () {
                    DB.userInfo.coin = DB.userInfo.coin - e.cfg.cost;
                    e.set_btnstate(1);
                    e.shop.updateCoin();
                    e.showTip("购买成功");
                }) : 2 == e.type && e.cfg.cid && BallLogicMgr.buy_particle(e.cfg, function () {
                    DB.userInfo.coin = DB.userInfo.coin - e.cfg.cost;
                    e.set_btnstate(1);
                    e.shop.updateCoin();
                    e.showTip("购买成功");
                });else {
                    BallLogicMgr.coin_notEnough();
                    e.showTip("金币不足");
                }
            } else if (1 == e.btn_state) {
                if (0 == e.type) {
                    if (e.cfg.cid) {
                        BallLogicMgr.pack_ballMatIdx(e.cfg.cid);
                        BallLogicMgr.last_pack_ball = e;
                    }
                } else if (1 == e.type) {
                    if (e.cfg.cid) {
                        BallLogicMgr.pack_color(e.cfg.cid);
                        BallLogicMgr.last_pack_color && BallLogicMgr.last_pack_color.set_btnstate(1);
                        BallLogicMgr.last_pack_color = e;
                    }
                } else if (2 == e.type && e.cfg.cid) {
                    BallLogicMgr.pack_particle(e.cfg.cid);
                    BallLogicMgr.last_pack_particle && BallLogicMgr.last_pack_particle.set_btnstate(1);
                    BallLogicMgr.last_pack_particle = e;
                }
                e.set_btnstate(2);
            } else if (2 == e.btn_state) {
                if (0 == e.type) {
                    if (e.cfg.cid) {
                        BallLogicMgr.unpack_ballMatIdx(e.cfg.cid);
                        BallLogicMgr.last_pack_ball = null;
                    }
                } else if (1 == e.type) {
                    if (e.cfg.cid) {
                        BallLogicMgr.pack_color(-1);
                        BallLogicMgr.last_pack_color = null;
                    }
                } else if (2 == e.type && e.cfg.cid) {
                    BallLogicMgr.pack_particle(-1);
                    BallLogicMgr.last_pack_particle = null;
                }
                e.set_btnstate(1);
            }
        });
        this.set_btnstate(0);
    }

    onDestroy() {
        this.clear();
    }

    onEnable() {}

    update_btnstate() {
        if (this.cfg) {
            const e = this.cfg.cid;
            if (0 == this.type) {
                console.log("PageType.Ball bmIdx", DB.userInfo.reward.bmIdx, typeof DB.userInfo.reward.bmIdx);
                if (DB.userInfo.reward.bmIdx.indexOf(e) < 0) this.set_btnstate(0);else if (GlobalConfig.shop_ball_get().arr.indexOf(e) >= 0) {
                    this.set_btnstate(2);
                    BallLogicMgr.last_pack_ball = this;
                } else this.set_btnstate(1);
            } else if (1 == this.type) {
                if (DB.userInfo.reward.btx1.indexOf(e) < 0) this.set_btnstate(0);else if (GlobalConfig.shop_color_get() == e) {
                    this.set_btnstate(2);
                    BallLogicMgr.last_pack_color = this;
                } else this.set_btnstate(1);
            } else if (2 == this.type) if (DB.userInfo.reward.btx2.indexOf(e) < 0) this.set_btnstate(0);else if (GlobalConfig.shop_particle_get() == e) {
                this.set_btnstate(2);
                BallLogicMgr.last_pack_particle = this;
            } else this.set_btnstate(1);
        }
    }

    showTip(e) {
        this.shop.showTip(e);
    }

    random_move(e) {
        const t = cc.find("node_ball2_shop_all", this.node);
        if (e) {
            const o = cc.moveTo(2.3, cc.v2(100, t.y));
            const n = cc.moveTo(2.3, cc.v2(-100, t.y));
            const i = cc.repeatForever(cc.sequence(o, n));
            t.runAction(i);
        } else {
            t.x = 0;
            t.stopAllActions();
        }
    }

    clear() {}

    setData() {}
}
