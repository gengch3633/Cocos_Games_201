import ConfigDataSys from "./ConfigDataSys";
import CueDataSys from "./CueDataSys";
import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import { UiManager } from "./UiManage";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/items/CueListItemCtr")
export default class CueListItemCtr extends cc.Component {
    @property(cc.Node)
    cue_list_item_root: cc.Node = null;

    @property(cc.Node)
    lock_info_area: cc.Node = null;

    @property(cc.Sprite)
    cue_icon: cc.Sprite = null;

    @property(cc.Label)
    label_unlock: cc.Label = null;

    @property(cc.Node)
    icon_cue: cc.Node = null;

    @property(cc.Node)
    icon_city: cc.Node = null;

    @property(cc.Node)
    ad_info_area: cc.Node = null;

    @property(cc.Node)
    label_ad_get: cc.Node = null;

    @property(cc.Node)
    use_info_area: cc.Node = null;

    @property(cc.Node)
    label_cue_item_use: cc.Node = null;

    @property(cc.Node)
    sp_light: cc.Node = null;

    _curTouchLock = null;
    _cueID = null;
    selectCB: (cueID: number) => void = null;

    get cueID() {
        return this._cueID;
    }

    onLoad(): void {
        UiManager.addButtonListen(this.cue_list_item_root, this.onSelected, this);
    }

    onEnable(): void {
        this._curTouchLock = false;
        EventMgr.listen(GameEventType.ON_UNLOCKED_CLUBS_CHANGED, this.onUnlockClubsChanged, this);
        EventMgr.listen(GameEventType.ON_USED_CLUB_CHANGED, this.onUsedClubChanged, this);
    }

    onGetBtnClicked(): void {
        this._curTouchLock || (this._curTouchLock = true);
    }

    updateData(): void {
        this.updateLockState();
    }

    onUnlockClubsChanged(): void {
        this.updateLockState();
    }

    showLight(): void {
        this.sp_light.active = true;
    }

    onDisable(): void {
        EventMgr.ignore(GameEventType.ON_UNLOCKED_CLUBS_CHANGED, this.onUnlockClubsChanged, this);
        EventMgr.ignore(GameEventType.ON_USED_CLUB_CHANGED, this.onUsedClubChanged, this);
    }

    initData(e: number): void {
        this._cueID = e;
        this.setCueIcon();
        this.updateLockState();
        this.hideLight();
    }

    onUsedClubChanged(): void {
        this.updateLockState();
    }

    hideLight(): void {
        this.sp_light.active = false;
    }

    onSelected(): void {
        this.selectCB && this.selectCB(this._cueID);
    }

    setCueIcon(): void {
        ConfigDataSys.cue_configMap.get(this._cueID) && CueDataSys.setCueIcon(this.cue_icon.node, this._cueID);
    }

    updateLockState(): void {
        const e = ConfigDataSys.cue_configMap.get(this._cueID);
        if (e) {
            this.lock_info_area.active = CueDataSys.isCueNotOpened(this._cueID) && !CueDataSys.isCueUnlocked(this._cueID);
            this.ad_info_area.active = !CueDataSys.isCueNotOpened(this._cueID) && !CueDataSys.isCueUnlocked(this._cueID);
            this.use_info_area.active = CueDataSys.usedCueId == this._cueID;
            if (this.lock_info_area.active) {
                const t = ConfigDataSys.cue_configMap.get(this._cueID);
                this.icon_city.active = -1 != t.unlock_cue;
                this.icon_cue.active = !this.icon_city.active;
                if (t) {
                    if (0 == t.unlock_cue) {
                        const o = CueDataSys.club_shard.get(this._cueID);
                        this.label_unlock.getComponent(cc.Label).string = o + "/" + e.unlock_type;
                    } else {
                        const n = ConfigDataSys.scene_configMap.get(t.unlock_cue);
                        n && EngineUtil.seti18nString(this.label_unlock.node, i18n.t(n.language));
                    }
                }
            }
        }
    }
}
