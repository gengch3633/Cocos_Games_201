import PlayerDataSys from "./PlayerDataSys";
import GlobalDataMgr from "./GlobalDataMgr";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import SdkHelper from "./SdkHelper";
import { languages } from "./SystemConfig";
import EngineUtil from "./EngineUtil";
import { UiManager } from "./UiManage";
import GameDataMgr from "./GameDataMgr";
import RollingNotice from "./RollingNotice";

const { ccclass, menu } = cc._decorator;

interface ScrollMsgItem {
    payPlat: number;
    Name: string;
    tryTimes: number;
    showTime: number;
    reward: number;
}

interface NoticeTimeData {
    show_duration: number[];
    show_duration_rate: number[];
}

interface NoticeData {
    tryTimes_show: number[];
    tryTimes_show_rate: number[];
}

@ccclass
@menu("UI/prefabs/RollingNoticeCtrl")
export default class RollingNoticeCtrl extends cc.Component {
    static prefabUrl = "assets/resources/prefabs/RollingNotice";
    static className = "RollingNoticeCtrl";

    ui: RollingNotice = null;
    runCount = 0;
    fTypeCount = 0;
    fNode: cc.Node = null;
    sNode: cc.Node = null;
    topY: cc.Node = null;
    playerInfo: string[] = null;
    sroll_msg_list: ScrollMsgItem[] = [];

    private *_getItemGenerator(): Generator<void, void, unknown> {
        for (let i = 0; i < 13; i++) {
            yield this._initItem(i);
        }
    }

    getNoticeTime(): number {
        const level = PlayerDataSys.user_level;
        if (1 == level || 2 == level || 3 == level) {
            return 0.5;
        }
        if (4 == level) {
            const timeData = GameDataMgr.getNoticeTimeData() as NoticeTimeData;
            const candidates: number[] = [];
            const durations = timeData.show_duration;
            const rates = timeData.show_duration_rate;
            if (durations && rates) {
                durations.forEach((duration, index) => {
                    for (let i = 0; i < rates[index]; i++) {
                        candidates.push(duration);
                    }
                });
            }
            const pickIndex = Math.floor(Math.random() * candidates.length);
            const picked = candidates[pickIndex];
            return Number(picked);
        }
    }

    onLoad(): void {
        this.onUILoad();
        this.addEvent();
        this.addButtonListen();
        this.loadPlayerInfo();
    }

    start(): void {}

    getNoticeNum(): number {
        const level = PlayerDataSys.user_level;
        if (1 == level || 2 == level) {
            return 1;
        }
        if (3 == level) {
            return Math.random() <= 0.1 ? 2 : 1;
        }
        if (4 == level) {
            const noticeData = GameDataMgr.getNoticeData() as NoticeData;
            if (noticeData) {
                const tryTimesShow = noticeData.tryTimes_show;
                const tryTimesShowRate = noticeData.tryTimes_show_rate;
                const candidates: number[] = [];
                if (tryTimesShow && tryTimesShowRate) {
                    tryTimesShow.forEach((value, index) => {
                        for (let i = 0; i < tryTimesShowRate[index]; i++) {
                            candidates.push(value);
                        }
                    });
                }
                const pickIndex = Math.floor(Math.random() * candidates.length);
                const picked = candidates[pickIndex];
                let min = 0;
                let max = 0;
                tryTimesShow.forEach((value, index) => {
                    if (value == picked) {
                        if (0 == index) {
                            min = 1;
                            max = value + 1;
                        } else {
                            min = tryTimesShow[index - 1];
                            max = value;
                        }
                    }
                });
                return EngineUtil.random(min, max);
            }
        }
    }

    initData(): void {}

    addButtonListen(): void {}

    nextNotice(): void {
        this.dealShowDes(false);
    }

    onUILoad(): void {
        this.ui = this.node.addComponent(RollingNotice);
    }

    updateScollMsg(): void {
        console.log("更新公告数据====", this.sroll_msg_list);
    }

    runNoticeAction(reset = false, showTime = 3): void {
        if (reset) {
            this.dealShowDes(true);
            this.runCount = 13;
        }
        this.run(showTime);
    }

    addEvent(): void {}

    getPayPlat(): number {
        const rand = Math.random();
        return rand <= 0.3 ? 2 : rand <= 0.6 && rand > 0.3 ? 3 : 1;
    }

    adjustScale(node: cc.Node): void {
        const winSize = cc.winSize;
        let scale = 1;
        if (node.width > winSize.width - 200) {
            scale = (winSize.width - 200) / node.width;
        }
        node.scale = scale;
    }

    setShowDes(data: ScrollMsgItem, itemNode: cc.Node): void {
        const payPlat = data.payPlat;
        const name = data.Name;
        const tryTimes = data.tryTimes;
        const reward = data.reward;
        const iconNode = itemNode.getChildByName("icon");
        const messageRichText = itemNode.getChildByName("messageRichText");
        const message = i18n.t("home_large_barrage", {
            0: name,
            1: tryTimes,
            2: PlayerDataSys.getCashWithUnit(reward),
        });
        UiManager.loadSpriteFrame(iconNode, "pay", String(payPlat));
        messageRichText.getComponent(cc.RichText).string = message;
    }

    createList(): void {
        const payPlat = this.getPayPlat();
        const playerName = this.playerInfo[EngineUtil.random(0, this.playerInfo.length - 1)];
        const tryTimes = this.getNoticeNum();
        const showTime = this.getNoticeTime();
        const reward = this.getNoticeCash(tryTimes);
        const item: ScrollMsgItem = {
            payPlat,
            Name: playerName,
            tryTimes,
            showTime,
            reward,
        };
        this.sroll_msg_list.push(item);
        if (this.sroll_msg_list.length > 13) {
            this.sroll_msg_list.shift();
            this.runCount--;
        }
        GameDataMgr.sroll_msg_list = this.sroll_msg_list;
        EventMgr.trigger(GameEventType.UPDATE_ROLLING, {
            payPlat,
            Name: playerName,
            tryTimes,
            showTime,
            reward,
        });
        SdkHelper.reportData("u_game_event_complete", {
            act_page: "BarrageCountShow",
        });
    }

    dealShowDes(reset = false): void {
        if (reset) {
            this.fTypeCount = 1;
            this.ui.maskNode.removeAllChildren();
            this.framingLoad();
        } else {
            const itemNode = GameDataMgr.getrollingItem();
            itemNode.parent = this.ui.maskNode;
            itemNode.setPosition(0, -1485);
            this.createList();
            const msg = this.sroll_msg_list[this.runCount - 1];
            this.setShowDes(msg, itemNode);
            this.runNoticeAction(false, msg.showTime);
        }
    }

    getTempOut(count: number, source: unknown[]): unknown[] {
        if (source) {
            const result: unknown[] = [];
            const used: Record<number, number> = {};
            const length = source.length;
            for (let i = 0; result.length < count; i++) {
                const index = Math.floor(Math.random() * length);
                if (!used[index]) {
                    used[index] = 1;
                    result.push(source[index]);
                }
            }
            return result;
        }
    }

    loadPlayerInfo(): void {
        if (languages[String(GlobalDataMgr.curLanguage)]) {
            EngineUtil.loadResourceAsset("config/name")
                .then((asset: cc.JsonAsset) => {
                    if (asset) {
                        const json = asset.json;
                        if (json) {
                            this.playerInfo = json[GlobalDataMgr.isUsingForeignResources()];
                            this.runNoticeAction(true);
                        }
                    }
                })
                .catch((err) => {
                    console.log("err====", err);
                });
        }
    }

    run(delay: number): void {
        for (let i = 0; i < 13; i++) {
            cc.tween(this.ui.maskNode.children[i])
                .delay(delay)
                .by(0.2, {
                    x: 0,
                    y: 120,
                })
                .call(() => {
                    if (75 == this.ui.maskNode.children[i].y) {
                        this.runCount += 1;
                        this.ui.maskNode.children[i].removeFromParent();
                        this.nextNotice();
                    }
                })
                .start();
        }
    }

    async framingLoad(): Promise<void> {
        await this.executePreFrame(this._getItemGenerator(), 1);
    }

    executePreFrame(generator: Generator<void, void, unknown>, frameTime: number): Promise<void> {
        return new Promise(() => {
            const iter = generator;
            const step = () => {
                const startTime = new Date().getTime();
                let result = iter.next();
                for (;;) {
                    if (null == result || result.done) {
                        this.run(0);
                        return;
                    }
                    if (new Date().getTime() - startTime > frameTime) {
                        this.scheduleOnce(() => {
                            step();
                        });
                        return;
                    }
                    result = iter.next();
                }
            };
            step();
        });
    }

    _initItem(index: number): void {
        const itemNode = GameDataMgr.getrollingItem();
        itemNode.parent = this.ui.maskNode;
        itemNode.setPosition(0, -45 - 120 * index);
        this.createList();
        this.setShowDes(this.sroll_msg_list[index], itemNode);
    }

    getNoticeCash(tryTimes: number): number {
        let base = 0;
        let minRate = 0;
        let maxRate = 0;
        const level = PlayerDataSys.user_level;
        if (1 == level) {
            base = 5;
            minRate = 4;
            maxRate = 4;
        } else if (2 == level) {
            base = 50;
            minRate = 6;
            maxRate = 6;
        } else if (3 == level) {
            base = 100;
            minRate = 5;
            maxRate = 7;
        } else if (4 == level) {
            base = 500;
            minRate = 50;
            maxRate = 90;
        }
        return Number(tryTimes * base * EngineUtil.random(minRate, maxRate));
    }
}
