import { UiManager } from "./UiManage";
import CueDataSys from "./CueDataSys";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import EngineUtil from "./EngineUtil";
import ConfigDataSys from "./ConfigDataSys";

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

    selectCB: (cueId: number) => void = null;

    private _curTouchLock = false;
    private _cueID: number = null;

    get cueID(): number {
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
        if (!this._curTouchLock) {
            this._curTouchLock = true;
        }
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

    initData(cueId: number): void {
        this._cueID = cueId;
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
        if (ConfigDataSys.cue_configMap.get(this._cueID)) {
            CueDataSys.setCueIcon(this.cue_icon.node, this._cueID);
        }
    }

    updateLockState(): void {
        const config = ConfigDataSys.cue_configMap.get(this._cueID);
        if (config) {
            this.lock_info_area.active = CueDataSys.isCueNotOpened(this._cueID) && !CueDataSys.isCueUnlocked(this._cueID);
            this.ad_info_area.active = !CueDataSys.isCueNotOpened(this._cueID) && !CueDataSys.isCueUnlocked(this._cueID);
            this.use_info_area.active = CueDataSys.usedCueId == this._cueID;
            if (this.lock_info_area.active) {
                const cueConfig = ConfigDataSys.cue_configMap.get(this._cueID);
                this.icon_city.active = cueConfig.unlock_cue != -1;
                this.icon_cue.active = !this.icon_city.active;
                if (cueConfig) {
                    if (cueConfig.unlock_cue == 0) {
                        const shard = CueDataSys.club_shard.get(this._cueID);
                        this.label_unlock.getComponent(cc.Label).string = shard + "/" + config.unlock_type;
                    } else {
                        const sceneConfig = ConfigDataSys.scene_configMap.get(cueConfig.unlock_cue);
                        sceneConfig && EngineUtil.seti18nString(this.label_unlock.node, i18n.t(sceneConfig.language));
                    }
                }
            }
        }
    }
}
