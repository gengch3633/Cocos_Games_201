import PageMgr from "./PageMgr";
import PlayerDataSys from "./PlayerDataSys";
import SystemDataSys from "./SystemDataSys";
import { GAME_NAME } from "./SystemConfig";

class EngineUtil {
    toastContent = "";
    color = new cc.Color();
    currSeed = new Date().getTime();
    manageToast: cc.Prefab = null;
    manageShows = 0;
    bigToast: cc.Prefab = null;
    bigShows = 0;

    randomKey(length: number): string {
        const chars = [
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        ];
        let result = "";
        const count = chars.length;
        for (let i = 0; i < length; i++) {
            result += chars[this.randomInt(0, count - 1)];
        }
        return result;
    }

    getRandId(): string {
        return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
    }

    getRandomNum(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    seti18nString(node: cc.Node, key: string, params?: any): void {
        const label = node.getComponent(cc.Label);
        if (label) {
            label.string = i18n.t(key, params);
        } else {
            const richText = node.getComponent(cc.RichText);
            if (richText) {
                richText.string = i18n.t(key, params);
            }
        }
    }

    getTimeStamp(): number {
        return Math.floor(Date.now() / 1e3);
    }

    setLocalData(key: string, value: string): void {
        cc.sys.localStorage.setItem(key, value);
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
        node: cc.Node,
        handlerName: string | Function,
        target: cc.Component,
        customEventData: string = "",
        options: any = {},
        transition: number = cc.Button.Transition.SCALE
    ): void {
        if (cc.isValid(node)) {
            if (handlerName) {
                handlerName = (handlerName as any).name ? (handlerName as any).name : handlerName;
            }
            if (typeof handlerName === "function") {
                const key = "__BtnClick__" + this.randomKey(16);
                (target as any)[key] = handlerName;
                handlerName = key;
            }
            let button = node.getComponent(cc.Button);
            if (!button) {
                button = node.addComponent(cc.Button);
                button.transition = transition;
                button.zoomScale = 1.05;
                if (options.isScale == 0) {
                    button.transition = cc.Button.Transition.NONE;
                }
            }
            if (button && !button.clickEvents[0]) {
                const eventHandler = new cc.Component.EventHandler();
                eventHandler.target = target.node;
                eventHandler.component = cc.js.getClassName(target);
                eventHandler.handler = handlerName as string;
                eventHandler.customEventData = customEventData;
                button.clickEvents[0] = eventHandler;
                for (const key in options) {
                    if (options.hasOwnProperty(key)) {
                        (button as any)[key] = options[key];
                    }
                }
            }
            node.on("click", () => {});
        }
    }

    async loadRemoteJpg(url: string): Promise<cc.Asset> {
        if (cc.sys.isNative) {
            return new Promise((resolve, reject) => {
                cc.assetManager.loadRemote(url, { ext: ".jpg" }, (err, asset) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(asset);
                    }
                });
            });
        }
        return null;
    }

    random(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }

    setStatsColor(textColor: cc.Color = cc.Color.WHITE, bgColor: cc.Color = cc.color(255, 255, 255, 100)): void {
        const profilerNode = cc.find("PROFILER-NODE");
        if (!profilerNode) {
            return cc.warn("未找到统计面板节点！");
        }
        profilerNode.children.forEach((child) => (child.color = textColor));
        let background = profilerNode.getChildByName("BACKGROUND");
        if (!background) {
            background = new cc.Node("BACKGROUND");
            profilerNode.addChild(background, cc.macro.MIN_ZINDEX);
            background.setContentSize(profilerNode.getBoundingBoxToWorld());
            background.setPosition(0, 0);
        }
        const graphics = background.getComponent(cc.Graphics) || background.addComponent(cc.Graphics);
        graphics.clear();
        graphics.rect(-5, 12.5, background.width + 10, background.height - 10);
        graphics.fillColor = bgColor;
        graphics.fill();
    }

    dealPro(current: number, total: number): string {
        if (current != null && total != null) {
            return (Math.round((current / total) * 1e4) / 100).toFixed(2) + "%";
        }
    }

    getScript(node: cc.Node): cc.Component {
        if (!node) {
            return null;
        }
        const components = (node as any)._components;
        for (let i = 0; i < components.length; i++) {
            if (components[i] && components[i].hasOwnProperty("_super")) {
                return components[i];
            }
        }
        return null;
    }

    async loadRemoteAsset(url: string): Promise<cc.Asset> {
        return new Promise((resolve, reject) => {
            cc.assetManager.loadRemote(url, (err, asset) => {
                if (err) {
                    console.log("加载远程资源错误url:" + url, err);
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

    showBigToast(content: string = "", duration: number = 0.8, force: boolean = true): void {
        if (content && (!(this.bigShows > 0) || force)) {
            if (this.bigToast) {
                const node = cc.instantiate(this.bigToast);
                PageMgr.setToastNode(node);
                node.getChildByName("content").getChildByName("text").getComponent(cc.RichText).string = content;
                node.zIndex = 999;
                this.bigShows++;
                node.runAction(
                    cc.sequence(
                        cc.moveBy(duration, 0, 160),
                        cc.delayTime(2),
                        cc.fadeOut(0.3),
                        cc.callFunc(() => {
                            node.parent = null;
                            node.destroy();
                            this.bigShows--;
                        })
                    )
                );
            } else {
                cc.loader.loadRes("prefabs/NoticeToast", cc.Prefab, (err, prefab) => {
                    if (!err) {
                        this.bigToast = prefab;
                        this.showBigToast(content, duration, force);
                    }
                });
            }
        }
    }

    shuffle<T>(array: T[]): T[] {
        let temp: T[];
        let index = array.length;
        while (index) {
            const randomIndex = Math.floor(Math.random() * index--);
            temp = [array[index], array[randomIndex]];
            array[randomIndex] = temp[0];
            array[index] = temp[1];
        }
        return array;
    }

    isLargeScreen(): boolean {
        const ratio = cc.winSize.height / cc.winSize.width;
        return Number(ratio.toFixed(2)) > 2;
    }

    convertNodePosition(fromNode: cc.Node, toNode: cc.Node): cc.Vec2 {
        if (fromNode && fromNode.parent && toNode && toNode.parent) {
            return fromNode.parent.convertToNodeSpaceAR(toNode.parent.convertToWorldSpaceAR(toNode.position));
        }
    }

    hundredsNum(value: number | string, separator: string = "."): string {
        let result = "";
        let count = 0;
        const text = (value || 0).toString();
        for (let i = text.length - 1; i >= 0; i--) {
            count++;
            result = text.charAt(i) + result;
            if (count % 2 || i == 0) {
                continue;
            }
            result = separator + result;
        }
        return result;
    }

    showManageViewToast(content: string = "", duration: number = 0.8, force: boolean = true): void {
        if (content && (!(this.manageShows > 0) || force)) {
            if (this.manageToast) {
                const node = cc.instantiate(this.manageToast);
                PageMgr.setToastNode(node);
                node.getChildByName("content").getChildByName("text").getComponent(cc.Label).string = content;
                node.zIndex = 999;
                node.y = -cc.winSize.height / 2 + 200;
                this.manageShows++;
                node.runAction(
                    cc.sequence(
                        cc.delayTime(3),
                        cc.fadeOut(0.3),
                        cc.callFunc(() => {
                            node.parent = null;
                            node.destroy();
                            this.manageShows--;
                        })
                    )
                );
            } else {
                cc.loader.loadRes("prefabs/Toast", cc.Prefab, (err, prefab) => {
                    if (!err) {
                        this.manageToast = prefab;
                        this.showManageViewToast(content, duration, force);
                    }
                });
            }
        }
    }

    subUserName(name: string, maxLength: number = 8): string {
        return name != "" && name.length > maxLength ? name.substring(0, maxLength) : name;
    }

    getBottomPosY(): number {
        let posY = -cc.winSize.height / 2;
        if (this.isLargeScreen()) {
            posY += 30;
        }
        return posY;
    }

    formatTime(seconds: number): string {
        let minutes: any = Math.floor((seconds / 60) << 0);
        let remain: any = Math.floor(seconds % 60);
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (remain < 10) {
            remain = "0" + remain;
        }
        return minutes + ":" + remain;
    }

    range(min: number, max: number): number {
        max = max || 1;
        min = min || 0;
        this.currSeed = (9301 * this.currSeed + 49297) % 233280;
        const seed = this.currSeed / 233280;
        return parseInt((min + seed * (max - min)).toString());
    }

    randomsInt(min: number, max: number, count: number): number[] {
        let temp: number[];
        if (count > max - min) {
            count = max - min;
        }
        const pool = Array.from({ length: max - min }, (_, index) => index + min);
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * (pool.length - i) + i);
            temp = [pool[randomIndex], pool[i]];
            pool[i] = temp[0];
            pool[randomIndex] = temp[1];
        }
        pool.length = count;
        return pool;
    }

    GetChildByName(root: cc.Node | cc.Component, name: string, recursive?: boolean): cc.Node {
        const node = (root as cc.Component).node ? (root as cc.Component).node : (root as cc.Node);
        let result: cc.Node = null;
        if (node && name) {
            result = node.getChildByName(name);
            if (recursive && !result) {
                const children = node.children;
                const count = node.childrenCount;
                for (let i = 0; i < count && !(result = this.GetChildByName(children[i], name, recursive)); ++i);
            }
        }
        return result;
    }

    destroyNode(node: cc.Node): void {
        if (cc.isValid(node)) {
            node.removeFromParent(false);
            node.destroy();
        } else {
            console.error("Tools: destroyNode error, param is invalid");
        }
    }

    localStorageSetItem(key: string, value: string): void {
        cc.sys.localStorage.setItem(key, value);
    }

    localStorageGetItem(key: string, defaultValue: string): string {
        const value = cc.sys.localStorage.getItem(key);
        return value && value != "" && value != null && value != "nan" ? value : defaultValue;
    }

    GetPrize(weights: number[]): number {
        const total = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.ceil(Math.random() * total);
        for (let i = 0; i < weights.length; i++) {
            if (random <= weights[i]) {
                return i;
            }
        }
    }

    isEmptyObj(obj: object): boolean {
        return "{}" === JSON.stringify(obj);
    }

    getRandPos(from: cc.Vec2, to: cc.Vec2): cc.Vec2 {
        const result = cc.v2(0, 0);
        from.lerp(to, Math.random(), result);
        return result;
    }

    isEmojiCharacter(text: string): boolean {
        if (!text) {
            return false;
        }
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            if (55296 <= code && code <= 56319) {
                if (text.length > 1) {
                    const fullCode = 1024 * (code - 55296) + (text.charCodeAt(i + 1) - 56320) + 65536;
                    if (118784 <= fullCode && fullCode <= 128895) {
                        return true;
                    }
                }
            } else if (text.length > 1) {
                if (8419 == text.charCodeAt(i + 1)) {
                    return true;
                }
            } else {
                if (8448 <= code && code <= 10239) {
                    return true;
                }
                if (11013 <= code && code <= 11015) {
                    return true;
                }
                if (10548 <= code && code <= 10549) {
                    return true;
                }
                if (12951 <= code && code <= 12953) {
                    return true;
                }
                if (169 == code || 174 == code || 12349 == code || 12336 == code || 11093 == code || 11036 == code || 11035 == code || 11088 == code) {
                    return true;
                }
            }
        }
        return false;
    }

    thousandsNum(value: number | string, separator: string = "."): string {
        let result = "";
        let count = 0;
        const text = (value || 0).toString();
        for (let i = text.length - 1; i >= 0; i--) {
            count++;
            result = text.charAt(i) + result;
            if (count % 3 || i == 0) {
                continue;
            }
            result = separator + result;
        }
        return result;
    }

    async loadRemoteImg(url: string): Promise<cc.Asset> {
        return new Promise((resolve, reject) => {
            cc.assetManager.loadRemote(url, { ext: ".png" }, (err, asset) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(asset);
                }
            });
        });
    }

    getPosByRot(radius: number, angle: number): cc.Vec2 {
        const x = radius * Math.cos((2 * Math.PI) / 360 * (90 - angle));
        const y = radius * Math.sin((2 * Math.PI) / 360 * (90 - angle));
        return cc.v2(x, y);
    }

    async loadResourceAsset(path: string): Promise<cc.Asset> {
        return new Promise((resolve, reject) => {
            cc.resources.load(path, (err, asset) => {
                if (err) {
                    console.log("加载resource错误url:" + path, err);
                    reject(err);
                } else {
                    resolve(asset);
                }
            });
        });
    }

    getColor(hex: string): cc.Color {
        if (!hex.includes("#")) {
            hex = "#" + hex;
        }
        return this.color.fromHEX(hex);
    }

    randomInt(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }

    getTopPosY(): number {
        let posY = cc.winSize.height / 2;
        if (this.isLargeScreen()) {
            posY -= 65;
        }
        return posY;
    }

    getLocalData(key: string): string {
        return cc.sys.localStorage.getItem(key) || "";
    }

    getTempOut(count: number, pool: any[]): any[] {
        if (pool) {
            const result: any[] = [];
            const used: Record<number, number> = {};
            const length = pool.length;
            for (let i = 0; result.length < count; i++) {
                const index = Math.floor(Math.random() * length);
                if (!used[index]) {
                    used[index] = 1;
                    result.push(pool[index]);
                }
            }
            return result;
        }
    }

    setHead(sprite: cc.Sprite): void {
        if (PlayerDataSys.wx_head) {
            this.loadRemoteImg(PlayerDataSys.wx_head)
                .then((texture) => {
                    if (texture) {
                        sprite.spriteFrame = new cc.SpriteFrame(texture as any);
                    }
                })
                .catch((err) => {
                    console.log("setHead 加载图片失败:" + PlayerDataSys.wx_head, err);
                });
        }
    }

    static _isntance: EngineUtil = null;

    static _getInstance(): EngineUtil {
        if (!EngineUtil._isntance) {
            EngineUtil._isntance = new EngineUtil();
        }
        return EngineUtil._isntance;
    }

    formatDate(timestamp: number, separator: string = "-"): string {
        const date = new Date(timestamp);
        return "" + date.getFullYear() + separator + (date.getMonth() + 1) + separator + date.getDate();
    }

    getProgressWidth(ratio: number, minWidth: number, maxWidth: number): { width: number; persent: number } {
        let width = ratio < 0.5 ? Math.ceil(ratio * maxWidth) : Math.floor(ratio * maxWidth);
        if (width != 0 && width < minWidth) {
            width = minWidth;
        }
        if (width > maxWidth) {
            width = maxWidth;
        }
        let percent = Math.floor(100 * ratio);
        if (isNaN(percent)) {
            percent = 1;
        }
        return { width, persent: percent };
    }
}

export default EngineUtil._getInstance();
