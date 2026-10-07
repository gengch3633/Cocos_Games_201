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

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/prefabs/RollingNoticeCtrl")
export default class RollingNoticeCtrl extends cc.Component {
    ui: RollingNotice = null;
    runCount = 0;
    fTypeCount = 0;
    fNode: cc.Node = null;
    sNode: cc.Node = null;
    topY: number = null;
    playerInfo: string[] = null;
    sroll_msg_list: any[] = [];

    static prefabUrl = "assets/resources/prefabs/RollingNotice";
    static className = "RollingNoticeCtrl";

    getNoticeTime(): number {
        const userLevel = PlayerDataSys.user_level;
        if (userLevel == 1 || userLevel == 2 || userLevel == 3) {
            return 0.5;
        }
        if (userLevel == 4) {
            const noticeTimeData = GameDataMgr.getNoticeTimeData();
            const durationList: number[] = [];
            const showDuration = noticeTimeData.show_duration;
            const showDurationRate = noticeTimeData.show_duration_rate;
            showDuration &&
                showDurationRate &&
                showDuration.forEach((duration: number, index: number) => {
                    for (let count = 0; count < showDurationRate[index]; count++) {
                        durationList.push(duration);
                    }
                });
            const randomIndex = Math.floor(Math.random() * durationList.length);
            const selectedDuration = durationList[randomIndex];
            return Number(selectedDuration);
        }
    }

    onLoad(): void {
        this.onUILoad();
        this.addEvent();
        this.addButtonListen();
        this.loadPlayerInfo();
    }

    start(): void {
    }

    getNoticeNum(): number {
        const userLevel = PlayerDataSys.user_level;
        if (userLevel == 1 || userLevel == 2) {
            return 1;
        }
        if (userLevel == 3) {
            return Math.random() <= 0.1 ? 2 : 1;
        }
        if (userLevel == 4) {
            const noticeData = GameDataMgr.getNoticeData();
            if (noticeData) {
                noticeData.average_tryTimes_max;
                noticeData.average_tryTimes_min;
                const tryTimesShow = noticeData.tryTimes_show;
                const tryTimesShowRate = noticeData.tryTimes_show_rate;
                const tryTimesList: number[] = [];
                const showList = tryTimesShow;
                const rateList = tryTimesShowRate;
                noticeData.try_times;
                showList &&
                    rateList &&
                    showList.forEach((times: number, index: number) => {
                        for (let count = 0; count < rateList[index]; count++) {
                            tryTimesList.push(times);
                        }
                    });
                let minTimes: number;
                let maxTimes: number;
                const randomIndex = Math.floor(Math.random() * tryTimesList.length);
                const selectedTimes = tryTimesList[randomIndex];
                showList.forEach((times: number, index: number) => {
                    if (times == selectedTimes) {
                        if (index == 0) {
                            minTimes = 1;
                            maxTimes = times + 1;
                        } else {
                            minTimes = showList[index - 1];
                            maxTimes = times;
                        }
                    }
                });
                return EngineUtil.random(minTimes, maxTimes);
            }
        }
    }

    initData(): void {
    }

    addButtonListen(): void {
    }

    nextNotice(): void {
        this.dealShowDes(false);
    }

    onUILoad(): void {
        this.ui = this.node.addComponent(RollingNotice);
    }

    updateScollMsg(): void {
        console.log("更新公告数据======", this.sroll_msg_list);
    }

    runNoticeAction(reset: boolean, showTime = 3): void {
        if (reset) {
            this.dealShowDes(true);
            this.runCount = 13;
        }
        this.run(showTime);
    }

    addEvent(): void {
    }

    getPayPlat(): number {
        const random = Math.random();
        return random <= 0.3 ? 2 : random <= 0.6 && random > 0.3 ? 3 : 1;
    }

    adjustScale(node: cc.Node): void {
        const winSize = cc.winSize;
        let scale = 1;
        if (node.width > winSize.width - 200) {
            scale = (winSize.width - 200) / node.width;
        }
        node.scale = scale;
    }

    setShowDes(msgData: any, itemNode: cc.Node): void {
        const payPlat = msgData.payPlat;
        const name = msgData.Name;
        const tryTimes = msgData.tryTimes;
        const reward = msgData.reward;
        const iconNode = itemNode.getChildByName("icon");
        const messageRichText = itemNode.getChildByName("messageRichText");
        const message = i18n.t("home_large_barrage", {
            0: name,
            1: tryTimes,
            2: PlayerDataSys.getCashWithUnit(reward),
        });
        UiManager.loadSpriteFrame(iconNode, "pay", payPlat);
        messageRichText.getComponent(cc.RichText).string = message;
    }

    createList(): void {
        const payPlat = this.getPayPlat();
        const playerName = this.playerInfo[EngineUtil.random(0, this.playerInfo.length - 1)];
        const tryTimes = this.getNoticeNum();
        const showTime = this.getNoticeTime();
        const reward = this.getNoticeCash(tryTimes);
        const msgData = {
            payPlat,
            Name: playerName,
            tryTimes,
            showTime,
            reward,
        };
        this.sroll_msg_list.push(msgData);
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
            const rollingItem = GameDataMgr.getrollingItem();
            rollingItem.parent = this.ui.maskNode;
            rollingItem.setPosition(0, -1485);
            this.createList();
            const msgData = this.sroll_msg_list[this.runCount - 1];
            this.setShowDes(msgData, rollingItem);
            this.runNoticeAction(false, msgData.showTime);
        }
    }

    getTempOut(count: number, sourceList: any[]): any[] {
        if (sourceList) {
            const result: any[] = [];
            const used: Record<number, number> = {};
            const sourceLength = sourceList.length;
            for (let attempt = 0; result.length < count; attempt++) {
                const randomIndex = Math.floor(Math.random() * sourceLength);
                if (!used[randomIndex]) {
                    used[randomIndex] = 1;
                    result.push(sourceList[randomIndex]);
                }
            }
            return result;
        }
    }

    loadPlayerInfo(): void {
        if (languages[String(GlobalDataMgr.curLanguage)]) {
            EngineUtil.loadResourceAsset("config/name")
                .then((asset: any) => {
                    if (asset) {
                        const json = asset.json;
                        if (json) {
                            this.playerInfo = json[GlobalDataMgr.isUsingForeignResources()];
                            this.runNoticeAction(true);
                        }
                    }
                })
                .catch((err: any) => {
                    console.log("err====", err);
                });
        }
    }

    run(delay: number): void {
        for (let index = 0; index < 13; index++) {
            cc.tween(this.ui.maskNode.children[index])
                .delay(delay)
                .by(0.2, { x: 0, y: 120 })
                .call(() => {
                    if (75 == this.ui.maskNode.children[index].y) {
                        this.runCount += 1;
                        this.ui.maskNode.children[index].removeFromParent();
                        this.nextNotice();
                    }
                })
                .start();
        }
    }

    async framingLoad(): Promise<void> {
        for (let index = 0; index < 13; index++) {
            await new Promise<void>((resolve) => {
                const startTime = new Date().getTime();
                this._initItem(index);
                if (new Date().getTime() - startTime > 1) {
                    this.scheduleOnce(() => resolve());
                } else {
                    resolve();
                }
            });
        }
        this.run(0);
    }

    _initItem(index: number): void {
        const rollingItem = GameDataMgr.getrollingItem();
        rollingItem.parent = this.ui.maskNode;
        rollingItem.setPosition(0, -45 - 120 * index);
        this.createList();
        this.setShowDes(this.sroll_msg_list[index], rollingItem);
    }

    getNoticeCash(tryTimes: number): number {
        let baseCash: number;
        let minRate: number;
        let maxRate: number;
        const userLevel = PlayerDataSys.user_level;
        if (userLevel == 1) {
            baseCash = 5;
            minRate = 4;
            maxRate = 4;
        } else if (userLevel == 2) {
            baseCash = 50;
            minRate = 6;
            maxRate = 6;
        } else if (userLevel == 3) {
            baseCash = 100;
            minRate = 5;
            maxRate = 7;
        } else if (userLevel == 4) {
            baseCash = 500;
            minRate = 50;
            maxRate = 90;
        }
        return Number(tryTimes * baseCash * EngineUtil.random(minRate, maxRate));
    }
}
