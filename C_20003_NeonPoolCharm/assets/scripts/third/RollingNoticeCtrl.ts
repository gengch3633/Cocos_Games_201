import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import GameDataMgr from "./GameDataMgr";
import GameEventType from "./GameEventType";
import GlobalDataMgr from "./GlobalDataMgr";
import PlayerDataSys from "./PlayerDataSys";
import RollingNotice from "./RollingNotice";
import SdkHelper from "./SdkHelper";
import { languages } from "./SystemConfig";
import { UiManager } from "./UiManage";

declare const i18n: any;

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/RollingNoticeCtrl")
export default class RollingNoticeCtrl extends cc.Component {
    ui = null;
    runCount = 0;
    fTypeCount = 0;
    fNode = null;
    sNode = null;
    topY = null;
    playerInfo = null;
    sroll_msg_list = [];

    static prefabUrl = "assets/resources/prefabs/RollingNotice";
    static className = "RollingNoticeCtrl";

    *_getItemGenerator() {
        for (let e = 0; e < 13; e++) {
            yield this._initItem(e);
        }
    }

    getNoticeTime() {
        const e = PlayerDataSys.user_level;
        if (1 == e || 2 == e || 3 == e) return .5;
        if (4 == e) {
            const t = GameDataMgr.getNoticeTimeData();
            const o = [];
            const n = t.show_duration;
            const i = t.show_duration_rate;
            n && i && n.forEach(function (e, t) {
                for (let n = 0; n < i[t]; n++) o.push(e);
            });
            const a = Math.floor(Math.random() * o.length);
            const l = o[a];
            return Number(l);
        }
    }

    onLoad() {
        this.onUILoad();
        this.addEvent();
        this.addButtonListen();
        this.loadPlayerInfo();
    }

    start() {}

    getNoticeNum() {
        const e = PlayerDataSys.user_level;
        if (1 == e || 2 == e) return 1;
        if (3 == e) return Math.random() <= .1 ? 2 : 1;
        if (4 == e) {
            const t = GameDataMgr.getNoticeData();
            if (t) {
                t.average_tryTimes_max, t.average_tryTimes_min;
                const o = t.tryTimes_show;
                const n = t.tryTimes_show_rate;
                const i = (t.try_times, []);
                const a = o;
                const l = n;
                a && l && a.forEach(function (e, t) {
                    for (let o = 0; o < l[t]; o++) i.push(e);
                });
                let s;
                let c;
                const u = Math.floor(Math.random() * i.length);
                const p = i[u];
                a.forEach(function (e, t) {
                    if (e == p) if (0 == t) {
                        s = 1;
                        c = e + 1;
                    } else {
                        s = a[t - 1];
                        c = e;
                    }
                });
                return EngineUtil.random(s, c);
            }
        }
    }

    initData() {}

    addButtonListen() {}

    nextNotice() {
        this.dealShowDes(false);
    }

    onUILoad() {
        this.ui = this.node.addComponent(RollingNotice);
    }

    updateScollMsg() {
        console.log("更新公告数据======", this.sroll_msg_list);
    }

    runNoticeAction(e, t) {
        if (undefined === t) t = 3;
        if (e) {
            this.dealShowDes(true);
            this.runCount = 13;
        }
        this.run(t);
    }

    addEvent() {}

    getPayPlat() {
        const e = Math.random();
        return e <= .3 ? 2 : e <= .6 && e > .3 ? 3 : 1;
    }

    adjustScale(e) {
        const t = cc.winSize;
        let o = 1;
        e.width > t.width - 200 && (o = (t.width - 200) / e.width);
        e.scale = o;
    }

    setShowDes(e, t) {
        const o = e.payPlat;
        const n = e.Name;
        const i = e.tryTimes;
        const a = e.reward;
        const l = t.getChildByName("icon");
        const s = t.getChildByName("messageRichText");
        const c = i18n.t("home_large_barrage", {
            0: n,
            1: i,
            2: PlayerDataSys.getCashWithUnit(a)
        });
        UiManager.loadSpriteFrame(l, "pay", o);
        s.getComponent(cc.RichText).string = c;
    }

    createList() {
        const e = this.getPayPlat();
        const t = this.playerInfo[EngineUtil.random(0, this.playerInfo.length - 1)];
        const o = this.getNoticeNum();
        const n = this.getNoticeTime();
        const i = this.getNoticeCash(o);
        const a = {
            payPlat: e,
            Name: t,
            tryTimes: o,
            showTime: n,
            reward: i
        };
        this.sroll_msg_list.push(a);
        if (this.sroll_msg_list.length > 13) {
            this.sroll_msg_list.shift();
            this.runCount--;
        }
        GameDataMgr.sroll_msg_list = this.sroll_msg_list;
        EventMgr.trigger(GameEventType.UPDATE_ROLLING, {
            payPlat: e,
            Name: t,
            tryTimes: o,
            showTime: n,
            reward: i
        });
        SdkHelper.reportData("u_game_event_complete", {
            act_page: "BarrageCountShow"
        });
    }

    dealShowDes(e) {
        if (undefined === e) e = false;
        if (e) {
            this.fTypeCount = 1;
            this.ui.maskNode.removeAllChildren();
            this.framingLoad();
        } else {
            const t = GameDataMgr.getrollingItem();
            t.parent = this.ui.maskNode;
            t.setPosition(0, -1485);
            this.createList();
            const o = this.sroll_msg_list[this.runCount - 1];
            this.setShowDes(o, t);
            this.runNoticeAction(false, o.showTime);
        }
    }

    getTempOut(e, t) {
        if (t) {
            const o = [];
            const n = [];
            const i = t;
            const a = i.length;
            for (let r = 0; o.length < e; r++) {
                const l = Math.floor(Math.random() * a);
                if (!n[l]) {
                    n[l] = 1;
                    o.push(i[l]);
                }
            }
            return o;
        }
    }

    loadPlayerInfo() {
        const e = this;
        languages[String(GlobalDataMgr.curLanguage)] && EngineUtil.loadResourceAsset("config/name").then(function (t) {
            if (t) {
                const o = t.json;
                if (o) {
                    e.playerInfo = o[GlobalDataMgr.isUsingForeignResources()];
                    e.runNoticeAction(true);
                }
            }
        }).catch(function (e) {
            console.log("err====", e);
        });
    }

    run(e) {
        const t = this;
        const n = this;
        const o = function (o) {
            cc.tween(n.ui.maskNode.children[o]).delay(e).by(.2, {
                x: 0,
                y: 120
            }).call(function () {
                if (75 == t.ui.maskNode.children[o].y) {
                    t.runCount += 1;
                    t.ui.maskNode.children[o].removeFromParent();
                    t.nextNotice();
                }
            }).start();
        };
        for (let i = 0; i < 13; i++) o(i);
    }

    public async framingLoad(): Promise<void> {
        await this.executePreFrame(this._getItemGenerator(), 1);
    }

    executePreFrame(e, t) {
        const o = this;
        return new Promise(function () {
            const n = e;
            const i = function () {
                for (let e = new Date().getTime(), a = n.next();; a = n.next()) {
                    if (null == a || a.done) {
                        o.run(0);
                        return;
                    }
                    if (new Date().getTime() - e > t) {
                        o.scheduleOnce(function () {
                            i();
                        });
                        return;
                    }
                }
            };
            i();
        });
    }

    _initItem(e) {
        const t = GameDataMgr.getrollingItem();
        t.parent = this.ui.maskNode;
        t.setPosition(0, -45 - 120 * e);
        this.createList();
        this.setShowDes(this.sroll_msg_list[e], t);
    }

    getNoticeCash(e) {
        let t;
        let o;
        let n;
        const i = PlayerDataSys.user_level;
        if (1 == i) {
            t = 5;
            o = 4;
            n = 4;
        } else if (2 == i) {
            t = 50;
            o = 6;
            n = 6;
        } else if (3 == i) {
            t = 100;
            o = 5;
            n = 7;
        } else if (4 == i) {
            t = 500;
            o = 50;
            n = 90;
        }
        return Number(e * t * EngineUtil.random(o, n));
    }
}
