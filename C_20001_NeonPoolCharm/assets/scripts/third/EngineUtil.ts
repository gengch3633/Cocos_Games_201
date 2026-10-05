import { GAME_NAME } from "./SystemConfig";
import PageMgr from "./PageMgr";
import PlayerDataSys from "./PlayerDataSys";
import SystemDataSys from "./SystemDataSys";

class EngineUtil {
    toastContent: string = "";
    color: cc.Color = new cc.Color();
    currSeed: number = new Date().getTime();
    manageToast: cc.Prefab = null;
    manageShows: number = 0;
    bigToast: cc.Prefab = null;
    bigShows: number = 0;

    private static _instance: EngineUtil = null;

    private static _getInstance(): EngineUtil {
        if (!EngineUtil._instance) {
            EngineUtil._instance = new EngineUtil();
        }
        return EngineUtil._instance;
    }

    randomKey(e: number): string {
        const t = [
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        ];
        let o = "";
        const n = t.length;
        for (let i = 0; i < e; i++) {
            o += t[this.randomInt(0, n - 1)];
        }
        return o;
    }

    getRandId(): string {
        return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
    }

    getRandomNum(e: number, t: number): number {
        return Math.floor(Math.random() * (t - e + 1)) + e;
    }

    seti18nString(e: cc.Node, t: string, o?: any): void {
        const n = e.getComponent(cc.Label);
        if (n) {
            n.string = (i18n as any).t(t, o);
        } else {
            const i = e.getComponent(cc.RichText);
            if (i) {
                i.string = (i18n as any).t(t, o);
            }
        }
    }

    getTimeStamp(): number {
        return Math.floor(Date.now() / 1e3);
    }

    setLocalData(e: string, t: string): void {
        cc.sys.localStorage.setItem(e, t);
    }

    error(...args: any[]): void {
        if (!SystemDataSys.online_release) {
            if (cc.sys.isNative) {
                try {
                    console.error(GAME_NAME, JSON.stringify(args));
                } catch (err) {
                    console.error(GAME_NAME, err);
                }
            } else {
                console.error(GAME_NAME, args);
            }
        }
    }

    registerBtnEvent(
        e: cc.Node,
        t: string | ((...args: any[]) => void),
        o: cc.Component,
        n: string = "",
        i: Record<string, any> = {},
        a: number = cc.Button.Transition.SCALE
    ): void {
        if (cc.isValid(e)) {
            if (t) {
                t = (t as any).name ? (t as any).name : t;
            }
            if (typeof t == "function") {
                const r = "__BtnClick__" + this.randomKey(16);
                (o as any)[r] = t;
                t = r;
            }
            let l = e.getComponent(cc.Button);
            if (!l) {
                l = e.addComponent(cc.Button);
                l.transition = a;
                l.zoomScale = 1.05;
                if (i.isScale == 0) {
                    l.transition = cc.Button.Transition.NONE;
                }
            }
            if (l && !l.clickEvents[0]) {
                const s = new cc.Component.EventHandler();
                s.target = o.node;
                s.component = cc.js.getClassName(o);
                s.handler = t as string;
                s.customEventData = n;
                l.clickEvents[0] = s;
                for (const c in i) {
                    if (i.hasOwnProperty(c)) {
                        (l as any)[c] = i[c];
                    }
                }
            }
            e.on("click", () => {});
        }
    }

    loadRemoteJpg(e: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (cc.sys.isNative) {
                cc.assetManager.loadRemote(e, { ext: ".jpg" }, (err: Error, asset: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(asset);
                    }
                });
            } else {
                resolve(null);
            }
        });
    }

    random(e: number, t: number): number {
        return Math.round(Math.random() * (t - e) + e);
    }

    setStatsColor(e: cc.Color = cc.Color.WHITE, t: cc.Color = cc.color(255, 255, 255, 100)): void {
        const o = cc.find("PROFILER-NODE");
        if (!o) {
            return cc.warn("未找到统计面板节点！");
        }
        o.children.forEach((child) => {
            child.color = e;
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

    dealPro(e: number, t: number): string {
        if (e != null && t != null) {
            return (Math.round((e / t) * 1e4) / 100).toFixed(2) + "%";
        }
    }

    getScript(e: cc.Node): cc.Component {
        if (!e) {
            return null;
        }
        const t = (e as any)._components;
        for (let o = 0; o < t.length; o++) {
            if (t[o] && t[o].hasOwnProperty("_super")) {
                return t[o];
            }
        }
        return null;
    }

    loadRemoteAsset(e: string): Promise<any> {
        return new Promise((resolve, reject) => {
            cc.assetManager.loadRemote(e, (err: Error, asset: any) => {
                if (err) {
                    console.log("加载远程资源错误url:" + e, err);
                    reject(err);
                } else {
                    resolve(asset);
                }
            });
        });
    }

    log(...args: any[]): void {
        if (cc.sys.isNative) {
            try {
                console.log(GAME_NAME, JSON.stringify(args));
            } catch (err) {
                console.error(GAME_NAME, err);
            }
        } else {
            console.log(GAME_NAME, args);
        }
    }

    showBigToast(e: string = "", t: number = 0.8, o: boolean = true): void {
        if (e && (!(this.bigShows > 0) || o)) {
            if (this.bigToast) {
                const a = cc.instantiate(this.bigToast);
                PageMgr.setToastNode(a);
                a.getChildByName("content").getChildByName("text").getComponent(cc.RichText).string = e;
                a.zIndex = 999;
                this.bigShows++;
                a.runAction(
                    cc.sequence(
                        cc.moveBy(t, 0, 160),
                        cc.delayTime(2),
                        cc.fadeOut(0.3),
                        cc.callFunc(() => {
                            a.parent = null;
                            a.destroy();
                            this.bigShows--;
                        })
                    )
                );
            } else {
                cc.loader.loadRes("prefabs/NoticeToast", cc.Prefab, (err: Error, prefab: cc.Prefab) => {
                    if (!err) {
                        this.bigToast = prefab;
                        this.showBigToast(e, t, o);
                    }
                });
            }
        }
    }

    shuffle<T>(e: T[]): T[] {
        let t: T[];
        let o = e.length;
        while (o) {
            const n = Math.floor(Math.random() * o--);
            t = [e[o], e[n]];
            e[n] = t[0];
            e[o] = t[1];
        }
        return e;
    }

    isLargeScreen(): boolean {
        const e = cc.winSize.height / cc.winSize.width;
        return Number(e.toFixed(2)) > 2;
    }

    convertNodePosition(e: cc.Node, t: cc.Node): cc.Vec2 {
        if (e && e.parent && t && t.parent) {
            return e.parent.convertToNodeSpaceAR(t.parent.convertToWorldSpaceAR(t.position));
        }
    }

    hundredsNum(e: number | string, t: string = "."): string {
        let o = "";
        let n = 0;
        e = (e || 0).toString();
        for (let i = e.length - 1; i >= 0; i--) {
            n++;
            o = e.charAt(i) + o;
            if (n % 2 == 0 && i != 0) {
                o = t + o;
            }
        }
        return o;
    }

    showManageViewToast(e: string = "", t: number = 0.8, o: boolean = true): void {
        if (e && (!(this.manageShows > 0) || o)) {
            if (this.manageToast) {
                const a = cc.instantiate(this.manageToast);
                PageMgr.setToastNode(a);
                a.getChildByName("content").getChildByName("text").getComponent(cc.Label).string = e;
                a.zIndex = 999;
                a.y = -cc.winSize.height / 2 + 200;
                this.manageShows++;
                a.runAction(
                    cc.sequence(
                        cc.delayTime(3),
                        cc.fadeOut(0.3),
                        cc.callFunc(() => {
                            a.parent = null;
                            a.destroy();
                            this.manageShows--;
                        })
                    )
                );
            } else {
                cc.loader.loadRes("prefabs/Toast", cc.Prefab, (err: Error, prefab: cc.Prefab) => {
                    if (!err) {
                        this.manageToast = prefab;
                        this.showManageViewToast(e, t, o);
                    }
                });
            }
        }
    }

    subUserName(e: string, t: number = 8): string {
        return e != "" && e.length > t ? e.substring(0, t) : e;
    }

    getBottomPosY(): number {
        let e = -cc.winSize.height / 2;
        if (this.isLargeScreen()) {
            e += 30;
        }
        return e;
    }

    formatTime(e: number): string {
        let t: string | number = Math.floor((e / 60) << 0);
        let o: string | number = Math.floor(e % 60);
        if (t < 10) {
            t = "0" + t;
        }
        if (o < 10) {
            o = "0" + o;
        }
        return t + ":" + o;
    }

    range(e?: number, t?: number): number {
        t = t || 1;
        e = e || 0;
        this.currSeed = (9301 * this.currSeed + 49297) % 233280;
        const o = this.currSeed / 233280;
        return parseInt((e + o * (t - e)).toString());
    }

    randomsInt(e: number, t: number, o: number): number[] {
        let n: number[];
        if (o > t - e) {
            o = t - e;
        }
        const i = Array.from({ length: t - e }, (_, idx) => idx + e);
        for (let a = 0; a < o; a++) {
            const r = Math.floor(Math.random() * (i.length - a) + a);
            n = [i[r], i[a]];
            i[a] = n[0];
            i[r] = n[1];
        }
        i.length = o;
        return i;
    }

    GetChildByName(e: cc.Node | cc.Component, t: string, o?: boolean): cc.Node {
        const n = (e as any).node ? (e as any).node : e;
        let i: cc.Node = null;
        if (n && t) {
            i = n.getChildByName(t);
            if (o && !i) {
                const a = n.children;
                const r = n.childrenCount;
                for (let l = 0; l < r && !(i = this.GetChildByName(a[l], t, o)); ++l) {}
            }
        }
        return i;
    }

    destroyNode(e: cc.Node): void {
        if (cc.isValid(e)) {
            e.removeFromParent(false);
            e.destroy();
        } else {
            console.error("Tools: destroyNode error, param is invalid");
        }
    }

    localStorageSetItem(e: string, t: string): void {
        cc.sys.localStorage.setItem(e, t);
    }

    localStorageGetItem(e: string, t?: any): any {
        const o = cc.sys.localStorage.getItem(e);
        return o && o != "" && o != null && o != "nan" ? o : t;
    }

    GetPrize(e: number[]): number {
        const t = e.reduce((sum, val) => sum + val, 0);
        let o = Math.ceil(Math.random() * t);
        for (let n = 0; n < e.length; n++) {
            if (o <= e[n]) {
                return n;
            }
        }
    }

    isEmptyObj(e: any): boolean {
        return "{}" === JSON.stringify(e);
    }

    getRandPos(e: cc.Vec2, t: cc.Vec2): cc.Vec2 {
        const o = cc.v2(0, 0);
        e.lerp(t, Math.random(), o);
        return o;
    }

    isEmojiCharacter(e: string): boolean {
        if (!e) {
            return false;
        }
        for (let t = 0; t < e.length; t++) {
            const o = e.charCodeAt(t);
            if (55296 <= o && o <= 56319) {
                if (e.length > 1) {
                    const n = 1024 * (o - 55296) + (e.charCodeAt(t + 1) - 56320) + 65536;
                    if (118784 <= n && n <= 128895) {
                        return true;
                    }
                }
            } else if (e.length > 1) {
                if (8419 == e.charCodeAt(t + 1)) {
                    return true;
                }
            } else {
                if (8448 <= o && o <= 10239) {
                    return true;
                }
                if (11013 <= o && o <= 11015) {
                    return true;
                }
                if (10548 <= o && o <= 10549) {
                    return true;
                }
                if (12951 <= o && o <= 12953) {
                    return true;
                }
                if (169 == o || 174 == o || 12349 == o || 12336 == o || 11093 == o || 11036 == o || 11035 == o || 11088 == o) {
                    return true;
                }
            }
        }
        return false;
    }

    thousandsNum(e: number | string, t: string = "."): string {
        let o = "";
        let n = 0;
        e = (e || 0).toString();
        for (let i = e.length - 1; i >= 0; i--) {
            n++;
            o = e.charAt(i) + o;
            if (n % 3 == 0 && i != 0) {
                o = t + o;
            }
        }
        return o;
    }

    loadRemoteImg(e: string): Promise<any> {
        return new Promise((resolve, reject) => {
            cc.assetManager.loadRemote(e, { ext: ".png" }, (err: Error, asset: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(asset);
                }
            });
        });
    }

    getPosByRot(e: number, t: number): cc.Vec2 {
        const o = e * Math.cos((2 * Math.PI) / 360 * (90 - t));
        const n = e * Math.sin((2 * Math.PI) / 360 * (90 - t));
        return cc.v2(o, n);
    }

    loadResourceAsset(e: string): Promise<any> {
        return new Promise((resolve, reject) => {
            cc.resources.load(e, (err: Error, asset: any) => {
                if (err) {
                    console.log("加载resource错误url:" + e, err);
                    reject(err);
                } else {
                    resolve(asset);
                }
            });
        });
    }

    getColor(e: string): cc.Color {
        if (!e.includes("#")) {
            e = "#" + e;
        }
        return this.color.fromHEX(e);
    }

    randomInt(e: number, t: number): number {
        return Math.round(Math.random() * (t - e) + e);
    }

    getTopPosY(): number {
        let e = cc.winSize.height / 2;
        if (this.isLargeScreen()) {
            e -= 65;
        }
        return e;
    }

    getLocalData(e: string): string {
        return cc.sys.localStorage.getItem(e) || "";
    }

    getTempOut<T>(e: number, t: T[]): T[] {
        if (t) {
            const o: T[] = [];
            const n: number[] = [];
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

    setHead(e: cc.Sprite): void {
        if (PlayerDataSys.wx_head) {
            this.loadRemoteImg(PlayerDataSys.wx_head)
                .then((t) => {
                    if (t) {
                        e.spriteFrame = new cc.SpriteFrame(t);
                    }
                })
                .catch((err) => {
                    console.log("setHead 加载图片失败:" + PlayerDataSys.wx_head, err);
                });
        }
    }

    formatDate(e: number, t: string = "-"): string {
        const o = new Date(e);
        return "" + o.getFullYear() + t + (o.getMonth() + 1) + t + o.getDate();
    }

    getProgressWidth(e: number, t: number, o: number): { width: number; persent: number } {
        let n = e < 0.5 ? Math.ceil(e * o) : Math.floor(e * o);
        if (n != 0 && n < t) {
            n = t;
        }
        if (n > o) {
            n = o;
        }
        let i = Math.floor(100 * e);
        if (isNaN(i)) {
            i = 1;
        }
        return {
            width: n,
            persent: i,
        };
    }
}

export default EngineUtil._getInstance();
