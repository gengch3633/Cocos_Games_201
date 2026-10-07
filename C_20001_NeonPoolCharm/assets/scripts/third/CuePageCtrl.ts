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
    ui: CuePage = null;
    _selectedCueId = 2;
    _curCueId = 1;
    _attriItemCtrMap = new Map();
    nodeMap = new Map();
    _animType = null;
    _touchControl = null;
    _hasPeneLock = null;
    _hasBlack = null;
    _hasTouchLock = null;
    maxLevel = null;
    data: any[] = null;
    node: cc.Node = null;
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

    getStatusPriority(e: number): number {
        let t = 10;
        e === CueDataSys.usedCueId ? t = 0 : CueDataSys.isCueNotOpened(e) || (t = CueDataSys.isCueUnlocked(e) ? 1 : 2);
        return t;
    }

    initCueItemList(): void {
        const e = new cc.Component.EventHandler();
        e.target = this.node;
        e.component = "CuePageCtrl";
        e.handler = "onListRender";
        this.list = this.ui.cue_item_scv.getComponent(List);
        this.list.renderEvent = e;
    }

    _init(): void {
        console.log("_init");
        if (SystemDataSys.is_IOS_reviewer) {
            const t = this.ui.cue_item_scv.getComponent(cc.Widget);
            t.top = 0;
            t.bottom = 0;
        }
        this._selectedCueId = CueDataSys.usedCueId;
        this._curCueId = CueDataSys.usedCueId;
        this.data = [];
        ConfigDataSys.cue_configMap.forEach((t, o) => {
            CueDataSys.isCueNotOpened(o) && o !== CueDataSys.nextCueID || this.data.push(t);
        });
        this.data.sort((t, o) => {
            const n = this.getStatusPriority(t.id);
            const i = this.getStatusPriority(o.id);
            return n != i ? n - i : t.id - o.id;
        });
        this.list.numItems = this.data.length;
        this.updateBar();
    }

    onDisable(): void {
        EventMgr.ignore(GameEventType.ON_UNLOCKED_CLUBS_CHANGED, this.updateBar, this);
    }

    updateBar(): void {
        const e = CueDataSys.unlockedCueCount;
        const t = ConfigDataSys.cue_configMap.size;
        this.ui.progressBar.getComponent(cc.ProgressBar).progress = e / t;
        this.ui.progressLabel.getComponent(cc.Label).string = e + "/" + t;
    }

    clickClose(): void {
        this.hide();
    }

    onListRender(e: cc.Node, t: number): void {
        const o = this.data[t];
        e.getComponent(NewCueListLitemCtr).initData(o.id, this.updateBar.bind(this));
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
