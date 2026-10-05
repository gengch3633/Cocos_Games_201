import { UiManager } from "./UiManage";
import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import CuePage from "./CuePage";
import CueDataSys from "./CueDataSys";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import List from "./List";
import ConfigDataSys from "./ConfigDataSys";
import SystemDataSys from "./SystemDataSys";
import NewCueListLitemCtr from "./NewCueListLitemCtr";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/CuePageCtrl")
export default class CuePageCtrl extends BasePageCtrl {
    ui: CuePage = null;
    _selectedCueId: number = 2;
    _curCueId: number = 1;
    _attriItemCtrMap: Map<any, any> = new Map();
    nodeMap: Map<any, any> = new Map();
    maxLevel: number = null;
    data: any[] = null;
    list: List = null;

    onEnable(): void {
        super.onEnable?.();
        EventMgr.listen(GameEventType.ON_UNLOCKED_CLUBS_CHANGED, this.updateBar, this);
    }

    onLoad(): void {
        console.log("onload");
        this.onUILoad();
        this._animType = AnimType.NONE;
        this._touchControl = false;
        this._hasPeneLock = true;
        this._hasBlack = true;
        this._hasTouchLock = false;
        this.list = this.ui.cue_item_scv.getComponent(List);
        super.onLoad();
        this.addButtonListen();
        console.log("onload22");
        this.initCueItemList();
        this.maxLevel = ConfigDataSys.club_gold_configMap.size;
    }

    getStatusPriority(cueId: number): number {
        let priority = 10;
        if (cueId === CueDataSys.usedCueId) {
            priority = 0;
        } else if (!CueDataSys.isCueNotOpened(cueId)) {
            priority = CueDataSys.isCueUnlocked(cueId) ? 1 : 2;
        }
        return priority;
    }

    initCueItemList(): void {
        const handler = new cc.Component.EventHandler();
        handler.target = this.node;
        handler.component = "CuePageCtrl";
        handler.handler = "onListRender";
        this.list = this.ui.cue_item_scv.getComponent(List);
        this.list.renderEvent = handler;
    }

    _init(): void {
        console.log("_init");
        if (SystemDataSys.is_IOS_reviewer) {
            const widget = this.ui.cue_item_scv.getComponent(cc.Widget);
            widget.top = 0;
            widget.bottom = 0;
        }
        this._selectedCueId = CueDataSys.usedCueId;
        this._curCueId = CueDataSys.usedCueId;
        this.data = [];
        ConfigDataSys.cue_configMap.forEach((config, id) => {
            if (CueDataSys.isCueNotOpened(id) && id !== CueDataSys.nextCueID) {
                return;
            }
            this.data.push(config);
        });
        this.data.sort((a, b) => {
            const priorityA = this.getStatusPriority(a.id);
            const priorityB = this.getStatusPriority(b.id);
            return priorityA != priorityB ? priorityA - priorityB : a.id - b.id;
        });
        this.list.numItems = this.data.length;
        this.updateBar();
    }

    onDisable(): void {
        EventMgr.ignore(GameEventType.ON_UNLOCKED_CLUBS_CHANGED, this.updateBar, this);
    }

    updateBar(): void {
        const unlocked = CueDataSys.unlockedCueCount;
        const total = ConfigDataSys.cue_configMap.size;
        this.ui.progressBar.getComponent(cc.ProgressBar).progress = unlocked / total;
        this.ui.progressLabel.getComponent(cc.Label).string = unlocked + "/" + total;
    }

    clickClose(): void {
        this.hide();
    }

    onListRender(item: cc.Node, index: number): void {
        const config = this.data[index];
        item.getComponent(NewCueListLitemCtr).initData(config.id, this.updateBar.bind(this));
    }

    addButtonListen(): void {
        UiManager.addButtonListen(this.ui.btn_back, this.clickClose, this);
    }

    onUILoad(): void {
        this.ui = this.node.addComponent(CuePage);
    }

    static prefabUrl = "CuePage";
    static className = "CuePageCtrl";
}
