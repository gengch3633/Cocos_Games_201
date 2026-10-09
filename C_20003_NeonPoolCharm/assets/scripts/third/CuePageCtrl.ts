import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import ConfigDataSys from "./ConfigDataSys";
import CueDataSys from "./CueDataSys";
import CuePage from "./CuePage";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import List from "./List";
import NewCueListLitemCtr from "./NewCueListLitemCtr";
import SystemDataSys from "./SystemDataSys";
import { UiManager } from "./UiManage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/CuePageCtrl")
export default class CuePageCtrl extends BasePageCtrl {
    static prefabUrl = "CuePage";
    static className = "CuePageCtrl";

    ui = null;
    _selectedCueId = 2;
    _curCueId = 1;
    _attriItemCtrMap = new Map();
    nodeMap = new Map();
    maxLevel = null;
    data = null;
    list = null;

    constructor() {
        super();
        this._animType = null;
        this._touchControl = null;
        this._hasPeneLock = null;
        this._hasBlack = null;
        this._hasTouchLock = null;
        this.node = null;
    }

    onEnable() {
        if (super.onEnable != null) {
            super.onEnable();
        }
        EventMgr.listen(GameEventType.ON_UNLOCKED_CLUBS_CHANGED, this.updateBar, this);
    }

    onLoad() {
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

    getStatusPriority(cueId) {
        let priority = 10;
        if (cueId === CueDataSys.usedCueId) {
            priority = 0;
        } else if (!CueDataSys.isCueNotOpened(cueId)) {
            priority = CueDataSys.isCueUnlocked(cueId) ? 1 : 2;
        }
        return priority;
    }

    initCueItemList() {
        const handler = new cc.Component.EventHandler();
        handler.target = this.node;
        handler.component = "CuePageCtrl";
        handler.handler = "onListRender";
        this.list = this.ui.cue_item_scv.getComponent(List);
        this.list.renderEvent = handler;
    }

    _init() {
        const self = this;
        console.log("_init");
        if (SystemDataSys.is_IOS_reviewer) {
            const widget = this.ui.cue_item_scv.getComponent(cc.Widget);
            widget.top = 0;
            widget.bottom = 0;
        }
        this._selectedCueId = CueDataSys.usedCueId;
        this._curCueId = CueDataSys.usedCueId;
        this.data = [];
        ConfigDataSys.cue_configMap.forEach(function (cue, cueId) {
            if (CueDataSys.isCueNotOpened(cueId) && cueId !== CueDataSys.nextCueID) {
            } else {
                self.data.push(cue);
            }
        });
        this.data.sort(function (a, b) {
            const priorityA = self.getStatusPriority(a.id);
            const priorityB = self.getStatusPriority(b.id);
            return priorityA != priorityB ? priorityA - priorityB : a.id - b.id;
        });
        this.list.numItems = this.data.length;
        this.updateBar();
    }

    onDisable() {
        EventMgr.ignore(GameEventType.ON_UNLOCKED_CLUBS_CHANGED, this.updateBar, this);
    }

    updateBar() {
        const unlocked = CueDataSys.unlockedCueCount;
        const total = ConfigDataSys.cue_configMap.size;
        this.ui.progressBar.getComponent(cc.ProgressBar).progress = unlocked / total;
        this.ui.progressLabel.getComponent(cc.Label).string = unlocked + "/" + total;
    }

    clickClose() {
        this.hide();
    }

    onListRender(item, index) {
        const cue = this.data[index];
        item.getComponent(NewCueListLitemCtr).initData(cue.id, this.updateBar.bind(this));
    }

    addButtonListen() {
        UiManager.addButtonListen(this.ui.btn_back, this.clickClose, this);
    }

    onUILoad() {
        this.ui = this.node.addComponent(CuePage);
    }
}
