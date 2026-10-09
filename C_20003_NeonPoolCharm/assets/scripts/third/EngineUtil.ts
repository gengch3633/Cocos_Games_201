import PageMgr from "./PageMgr";
import PlayerDataSys from "./PlayerDataSys";
import { GAME_NAME } from "./SystemConfig";
import SystemDataSys from "./SystemDataSys";

declare const i18n: any;

class EngineUtil {
    toastContent = "";
    color = new cc.Color();
    currSeed = new Date().getTime();
    manageToast = null;
    manageShows = 0;
    bigToast = null;
    bigShows = 0;
    static _isntance;

    randomKey(e) {
        const t = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        let o = "";
        const n = t.length;
        for (let i = 0; i < e; i++) o += t[this.randomInt(0, n - 1)];
        return o;
    }

    getRandId() {
        return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
    }

    getRandomNum(e, t) {
        return Math.floor(Math.random() * (t - e + 1)) + e;
    }

    seti18nString(e, t, o?) {
        const n = e.getComponent(cc.Label);
        if (n) n.string = i18n.t(t, o); else {
            const i = e.getComponent(cc.RichText);
            i && (i.string = i18n.t(t, o));
        }
    }

    getTimeStamp() {
        return Math.floor(Date.now() / 1e3);
    }

    setLocalData(e, t) {
        cc.sys.localStorage.setItem(e, t);
    }

    error(...e) {
        if (!SystemDataSys.online_release) if (cc.sys.isNative) try {
            console.error(GAME_NAME, JSON.stringify(e));
        } catch (e) {
            console.error(GAME_NAME, e);
        } else console.error(GAME_NAME, e);
    }

    registerBtnEvent(e, t, o, n?, i?, a?) {
        if (undefined === n) {
            n = "";
        }
        if (undefined === i) {
            i = {};
        }
        if (undefined === a) {
            a = cc.Button.Transition.SCALE;
        }
        if (cc.isValid(e)) {
            t && (t = t.name ? t.name : t);
            if ("function" == typeof t) {
                const r = "__BtnClick__" + this.randomKey(16);
                o[r] = t;
                t = r;
            }
            let l = e.getComponent(cc.Button);
            if (!l) {
                (l = e.addComponent(cc.Button)).transition = a;
                l.zoomScale = 1.05;
                0 == i.isScale && (l.transition = cc.Button.Transition.NONE);
            }
            if (l && !l.clickEvents[0]) {
                const s = new cc.Component.EventHandler();
                s.target = o.node;
                s.component = cc.js.getClassName(o);
                s.handler = t;
                s.customEventData = n;
                l.clickEvents[0] = s;
                for (const c in i) i.hasOwnProperty(c) && (l[c] = i[c]);
            }
            e.on("click", function () {});
        }
    }

    loadRemoteJpg(e) {
        return new Promise(function (t, o) {
            cc.sys.isNative ? cc.assetManager.loadRemote(e, {
                ext: ".jpg"
            }, function (e, n) {
                e ? o(e) : t(n);
            }) : t(null);
        });
    }

    random(e, t) {
        return Math.round(Math.random() * (t - e) + e);
    }

    setStatsColor(e?, t?) {
        if (undefined === e) {
            e = cc.Color.WHITE;
        }
        if (undefined === t) {
            t = cc.color(255, 255, 255, 100);
        }
        const o = cc.find("PROFILER-NODE");
        if (!o) return cc.warn("未找到统计面板节点！");
        o.children.forEach(function (t) {
            return t.color = e;
        });
        let n = o.getChildByName("BACKGROUND");
        if (!n) {
            n = new cc.Node("BACKGROUND");
            o.addChild(n, cc.macro.MIN_ZINDEX);
            n.setContentSize(o.getBoundingBoxToWorld());
            n.setPosition(0, 0);
        }
        const i = n.getComponent(cc.Graphics) || n.addComponent(cc.Graphics);
        i.clear();
        i.rect(-5, 12.5, n.width + 10, n.height - 10);
        i.fillColor = t;
        i.fill();
    }

    dealPro(e, t) {
        if (null != e && null != t) return (Math.round(e / t * 1e4) / 100).toFixed(2) + "%";
    }

    getScript(e) {
        if (!e) return null;
        for (let t = e._components, o = 0; o < t.length; o++) if (t[o] && t[o].hasOwnProperty("_super")) return t[o];
        return null;
    }

    loadRemoteAsset(e) {
        return new Promise(function (t, o) {
            cc.assetManager.loadRemote(e, function (n, i) {
                if (n) {
                    console.log("加载远程资源错误url:" + e, n);
                    o(n);
                } else t(i);
            });
        });
    }

    log(...e) {
        if (cc.sys.isNative) try {
            console.log(GAME_NAME, JSON.stringify(e));
        } catch (e) {
            console.error(GAME_NAME, e);
        } else console.log(GAME_NAME, e);
    }

    showBigToast(e?, t?, o?) {
        const n = this;
        if (undefined === e) {
            e = "";
        }
        if (undefined === t) {
            t = .8;
        }
        if (undefined === o) {
            o = true;
        }
        if (e && (!(this.bigShows > 0) || o)) if (this.bigToast) {
            const a = cc.instantiate(this.bigToast);
            PageMgr.setToastNode(a);
            a.getChildByName("content").getChildByName("text").getComponent(cc.RichText).string = e;
            a.zIndex = 999;
            this.bigShows++;
            a.runAction(cc.sequence(cc.moveBy(t, 0, 160), cc.delayTime(2), cc.fadeOut(.3), cc.callFunc(function () {
                a.parent = null;
                a.destroy();
                n.bigShows--;
            })));
        } else cc.loader.loadRes("prefabs/NoticeToast", cc.Prefab, function (i, a) {
            if (!i) {
                n.bigToast = a;
                n.showBigToast(e, t, o);
            }
        });
    }

    shuffle(e) {
        let t;
        for (let o = e.length; o;) {
            const n = Math.floor(Math.random() * o--);
            t = [e[o], e[n]], e[n] = t[0], e[o] = t[1];
        }
        return e;
    }

    isLargeScreen() {
        const e = cc.winSize.height / cc.winSize.width;
        return Number(e.toFixed(2)) > 2;
    }

    convertNodePosition(e, t) {
        if (e && e.parent && t && t.parent) return e.parent.convertToNodeSpaceAR(t.parent.convertToWorldSpaceAR(t.position));
    }

    hundredsNum(e, t?) {
        if (undefined === t) {
            t = ".";
        }
        let o = "";
        let n = 0;
        for (let i = (e = (e || 0).toString()).length - 1; i >= 0; i--) {
            n++;
            o = e.charAt(i) + o;
            n % 2 || 0 == i || (o = t + o);
        }
        return o;
    }

    showManageViewToast(e?, t?, o?) {
        const n = this;
        if (undefined === e) {
            e = "";
        }
        if (undefined === t) {
            t = .8;
        }
        if (undefined === o) {
            o = true;
        }
        if (e && (!(this.manageShows > 0) || o)) if (this.manageToast) {
            const a = cc.instantiate(this.manageToast);
            PageMgr.setToastNode(a);
            a.getChildByName("content").getChildByName("text").getComponent(cc.Label).string = e;
            a.zIndex = 999;
            a.y = -cc.winSize.height / 2 + 200;
            this.manageShows++;
            a.runAction(cc.sequence(cc.delayTime(3), cc.fadeOut(.3), cc.callFunc(function () {
                a.parent = null;
                a.destroy();
                n.manageShows--;
            })));
        } else {
            const r = this;
            cc.loader.loadRes("prefabs/Toast", cc.Prefab, function (n, i) {
                if (!n) {
                    r.manageToast = i;
                    r.showManageViewToast(e, t, o);
                }
            });
        }
    }

    subUserName(e, t?) {
        if (undefined === t) {
            t = 8;
        }
        return "" != e && e.length > t ? e.substring(0, t) : e;
    }

    getBottomPosY() {
        let e = -cc.winSize.height / 2;
        this.isLargeScreen() && (e += 30);
        return e;
    }

    formatTime(e) {
        let t: any = Math.floor(e / 60 << 0);
        let o: any = Math.floor(e % 60);
        t < 10 && (t = "0" + t);
        o < 10 && (o = "0" + o);
        return t + ":" + o;
    }

    range(e, t) {
        t = t || 1;
        e = e || 0;
        this.currSeed = (9301 * this.currSeed + 49297) % 233280;
        const o = this.currSeed / 233280;
        return parseInt((e + o * (t - e)).toString());
    }

    randomsInt(e, t, o) {
        let n;
        o > t - e && (o = t - e);
        const i = Array.from({
            length: t - e
        }, function (t, o) {
            return o + e;
        });
        for (let a = 0; a < o; a++) {
            const r = Math.floor(Math.random() * (i.length - a) + a);
            n = [i[r], i[a]], i[a] = n[0], i[r] = n[1];
        }
        i.length = o;
        return i;
    }

    GetChildByName(e, t, o) {
        const n = e.node ? e.node : e;
        let i = null;
        if (n && t) {
            i = n.getChildByName(t);
            if (o && !i) for (let a = n.children, r = n.childrenCount, l = 0; l < r && !(i = this.GetChildByName(a[l], t, o)); ++l);
        }
        return i;
    }

    destroyNode(e) {
        if (cc.isValid(e)) {
            e.removeFromParent(false);
            e.destroy();
        } else console.error("Tools: destroyNode error, param is invalid");
    }

    localStorageSetItem(e, t) {
        cc.sys.localStorage.setItem(e, t);
    }

    localStorageGetItem(e, t?) {
        const o = cc.sys.localStorage.getItem(e);
        return o && "" != o && null != o && "nan" != o ? o : t;
    }

    GetPrize(e) {
        for (let t = e.reduce(function (e, t) {
            return e + t;
        }, 0), o = Math.ceil(Math.random() * t), n = 0; n < e.length; n++) if (o <= e[n]) return n;
    }

    isEmptyObj(e) {
        return "{}" === JSON.stringify(e);
    }

    getRandPos(e, t) {
        const o = cc.v2(0, 0);
        e.lerp(t, Math.random(), o);
        return o;
    }

    isEmojiCharacter(e) {
        if (!e) return false;
        for (let t = 0; t < e.length; t++) {
            const o = e.charCodeAt(t);
            if (55296 <= o && o <= 56319) {
                if (e.length > 1) {
                    const n = 1024 * (o - 55296) + (e.charCodeAt(t + 1) - 56320) + 65536;
                    if (118784 <= n && n <= 128895) return true;
                }
            } else if (e.length > 1) {
                if (8419 == e.charCodeAt(t + 1)) return true;
            } else {
                if (8448 <= o && o <= 10239) return true;
                if (11013 <= o && o <= 11015) return true;
                if (10548 <= o && o <= 10549) return true;
                if (12951 <= o && o <= 12953) return true;
                if (169 == o || 174 == o || 12349 == o || 12336 == o || 11093 == o || 11036 == o || 11035 == o || 11088 == o) return true;
            }
        }
        return false;
    }

    thousandsNum(e, t?) {
        if (undefined === t) {
            t = ".";
        }
        let o = "";
        let n = 0;
        for (let i = (e = (e || 0).toString()).length - 1; i >= 0; i--) {
            n++;
            o = e.charAt(i) + o;
            n % 3 || 0 == i || (o = t + o);
        }
        return o;
    }

    loadRemoteImg(e) {
        return new Promise(function (t, o) {
            cc.assetManager.loadRemote(e, {
                ext: ".png"
            }, function (e, n) {
                e ? o(e) : t(n);
            });
        });
    }

    getPosByRot(e, t) {
        const o = e * Math.cos(2 * Math.PI / 360 * (90 - t));
        const n = e * Math.sin(2 * Math.PI / 360 * (90 - t));
        return cc.v2(o, n);
    }

    loadResourceAsset(e) {
        return new Promise(function (t, o) {
            cc.resources.load(e, function (n, i) {
                if (n) {
                    console.log("加载resource错误url:" + e, n);
                    o(n);
                } else t(i);
            });
        });
    }

    getColor(e) {
        e.includes("#") || (e = "#" + e);
        return this.color.fromHEX(e);
    }

    randomInt(e, t) {
        return Math.round(Math.random() * (t - e) + e);
    }

    getTopPosY() {
        let e = cc.winSize.height / 2;
        this.isLargeScreen() && (e -= 65);
        return e;
    }

    getLocalData(e) {
        return cc.sys.localStorage.getItem(e) || "";
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

    setHead(e) {
        PlayerDataSys.wx_head && this.loadRemoteImg(PlayerDataSys.wx_head).then(function (t) {
            t && (e.spriteFrame = new cc.SpriteFrame(t));
        }).catch(function (e) {
            console.log("setHead 加载图片失败:" + PlayerDataSys.wx_head, e);
        });
    }

    static _getInstance() {
        EngineUtil._isntance || (EngineUtil._isntance = new EngineUtil());
        return EngineUtil._isntance;
    }

    formatDate(e, t?) {
        if (undefined === t) {
            t = "-";
        }
        const o = new Date(e);
        return "" + o.getFullYear() + t + (o.getMonth() + 1) + t + o.getDate();
    }

    getProgressWidth(e, t, o) {
        let n = e < .5 ? Math.ceil(e * o) : Math.floor(e * o);
        0 != n && n < t && (n = t);
        n > o && (n = o);
        let i = Math.floor(100 * e);
        isNaN(i) && (i = 1);
        return {
            width: n,
            persent: i
        };
    }
}

export default EngineUtil._getInstance();
