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
    cue_list_item_root = null;

    @property(cc.Node)
    lock_info_area = null;

    @property(cc.Sprite)
    cue_icon = null;

    @property(cc.Label)
    label_unlock = null;

    @property(cc.Node)
    icon_cue = null;

    @property(cc.Node)
    icon_city = null;

    @property(cc.Node)
    ad_info_area = null;

    @property(cc.Node)
    label_ad_get = null;

    @property(cc.Node)
    use_info_area = null;

    @property(cc.Node)
    label_cue_item_use = null;

    @property(cc.Node)
    sp_light = null;

    _curTouchLock = null;
    _cueID = null;
    selectCB = null;

    get cueID() {
        return this._cueID;
    }

    onLoad() {
        UiManager.addButtonListen(this.cue_list_item_root, this.onSelected, this);
    }

    onEnable() {
        this._curTouchLock = false;
        EventMgr.listen(GameEventType.ON_UNLOCKED_CLUBS_CHANGED, this.onUnlockClubsChanged, this);
        EventMgr.listen(GameEventType.ON_USED_CLUB_CHANGED, this.onUsedClubChanged, this);
    }

    onGetBtnClicked() {
        if (!this._curTouchLock) {
            this._curTouchLock = true;
        }
    }

    updateData() {
        this.updateLockState();
    }

    onUnlockClubsChanged() {
        this.updateLockState();
    }

    showLight() {
        this.sp_light.active = true;
    }

    onDisable() {
        EventMgr.ignore(GameEventType.ON_UNLOCKED_CLUBS_CHANGED, this.onUnlockClubsChanged, this);
        EventMgr.ignore(GameEventType.ON_USED_CLUB_CHANGED, this.onUsedClubChanged, this);
    }

    initData(cueId) {
        this._cueID = cueId;
        this.setCueIcon();
        this.updateLockState();
        this.hideLight();
    }

    onUsedClubChanged() {
        this.updateLockState();
    }

    hideLight() {
        this.sp_light.active = false;
    }

    onSelected() {
        if (this.selectCB) {
            this.selectCB(this._cueID);
        }
    }

    setCueIcon() {
        if (ConfigDataSys.cue_configMap.get(this._cueID)) {
            CueDataSys.setCueIcon(this.cue_icon.node, this._cueID);
        }
    }

    updateLockState() {
        const config = ConfigDataSys.cue_configMap.get(this._cueID);
        if (config) {
            this.lock_info_area.active = CueDataSys.isCueNotOpened(this._cueID) && !CueDataSys.isCueUnlocked(this._cueID);
            this.ad_info_area.active = !CueDataSys.isCueNotOpened(this._cueID) && !CueDataSys.isCueUnlocked(this._cueID);
            this.use_info_area.active = CueDataSys.usedCueId == this._cueID;
            if (this.lock_info_area.active) {
                const cue = ConfigDataSys.cue_configMap.get(this._cueID);
                this.icon_city.active = -1 != cue.unlock_cue;
                this.icon_cue.active = !this.icon_city.active;
                if (cue) {
                    if (0 == cue.unlock_cue) {
                        const shard = CueDataSys.club_shard.get(this._cueID);
                        this.label_unlock.getComponent(cc.Label).string = shard + "/" + config.unlock_type;
                    } else {
                        const scene = ConfigDataSys.scene_configMap.get(cue.unlock_cue);
                        if (scene) {
                            EngineUtil.seti18nString(this.label_unlock.node, i18n.t(scene.language));
                        }
                    }
                }
            }
        }
    }
}
