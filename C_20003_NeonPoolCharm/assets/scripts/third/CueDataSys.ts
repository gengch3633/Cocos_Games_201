import ConfigDataSys from "./ConfigDataSys";
import CueDataMgr from "./CueDataMgr";
import EngineUtil from "./EngineUtil";
import PlayerDataSys from "./PlayerDataSys";
import { UiManager } from "./UiManage";

class CueDataSys extends CueDataMgr {
    club_gold_index = null;
    club_shard = null;

    static _instance = null;

    getUsedCueAimLineLen() {
        const cue = ConfigDataSys.cue_configMap.get(this.usedCueId);
        return cue ? cue.aiming : 90;
    }

    isCueNotOpened(cueId) {
        return "boolean" != typeof this.get_clubs[cueId];
    }

    updateClubShard(shard) {
        const self = this;
        this.club_shard = new Map();
        Object.entries(shard).forEach(function (entry) {
            const key = entry[0];
            const value = entry[1];
            self.club_shard.set(Number(key), value);
        });
    }

    getUsedCuePower() {
        const cue = ConfigDataSys.cue_configMap.get(this.usedCueId);
        return cue ? cue.force : 100;
    }

    initData(data) {
        this.usedCueId = data.use_club_id;
        this.get_clubs = data.get_clubs;
        this.nextCueID = data.next_club_id;
        this.club_gold_index = data.club_gold_index;
        this.updateClubShard(data.club_shard);
    }

    getCueSourceName(cueId) {
        const cue = ConfigDataSys.cue_configMap.get(cueId);
        return cue ? cue.cuepng : "cue01";
    }

    static _getInstance() {
        if (!this._instance) {
            this._instance = new CueDataSys();
        }
        return this._instance;
    }

    isCueInNewUnlocked(cueId) {
        return EngineUtil.localStorageGetItem("new_unlock_cue", "").split(",").indexOf(String(cueId)) > -1;
    }

    addCueToUnlockedHistoryRecored(cueId) {
        const stored = EngineUtil.localStorageGetItem("unlocked_cues", "");
        const list = stored.length < 1 ? [] : stored.split(",");
        list.push(String(cueId));
        const joined = list.join(",");
        EngineUtil.localStorageSetItem("unlocked_cues", joined);
    }

    getUsedCueRoleAngle() {
        const cue = ConfigDataSys.cue_configMap.get(this.usedCueId);
        return cue ? cue.spin : 30;
    }

    setCueIcon(sprite, cueId, callback?) {
        UiManager.loadSpriteFrame(sprite, "cue_icon", this.getCueSourceName(cueId), callback);
    }

    setCueSpine(node, cueId) {
        UiManager.loadSpine(node, "cue_spine", this.getCueSourceName(cueId), function () {
            node.getComponent(sp.Skeleton).setAnimation(0, "animation", true);
        });
    }

    isCueUnlocked(cueId) {
        return true === this.get_clubs[cueId];
    }

    getNewUnlockCueRecored() {
        const stored = EngineUtil.localStorageGetItem("new_unlock_cue", "");
        console.log("getNewUnlockCueRecored : ", stored);
        return stored.length < 1 ? [] : stored.split(",");
    }

    isCueInUnlockedHistory(cueId) {
        return EngineUtil.localStorageGetItem("unlocked_cues", "").split(",").indexOf(String(cueId)) > -1;
    }

    addCueToNewUnlockedRecored(cueId) {
        const stored = EngineUtil.localStorageGetItem("new_unlock_cue", "");
        const list = stored.length < 1 ? [] : stored.split(",");
        list.push(String(cueId));
        const joined = list.join(",");
        console.log("addCueToNewUnlockedRecored : ", list);
        EngineUtil.localStorageSetItem("new_unlock_cue", joined);
    }

    removeCueFormNewUnlockCueRecored(cueId) {
        const stored = EngineUtil.localStorageGetItem("new_unlock_cue", "");
        const list = stored.length < 1 ? [] : stored.split(",");
        const index = list.indexOf(String(cueId));
        if (index > -1) {
            list.splice(index, 1);
            EngineUtil.localStorageSetItem("new_unlock_cue", list.length < 1 ? "" : list.join(","));
        }
    }

    getCurCueSourceName() {
        return this.getCueSourceName(this.usedCueId);
    }

    checkUnlockCue() {
        const keys = Array.from(ConfigDataSys.cue_configMap.keys());
        for (let i = 0; i < keys.length; i++) {
            let previous;
            const cue = ConfigDataSys.cue_configMap.get(keys[i]);
            if (cue.unlock_cue > 0 && !this.isCueUnlocked(cue.id) && PlayerDataSys.curSceneID < cue.unlock_cue) {
                const previousId = cue.id - 1;
                if ((previous = ConfigDataSys.cue_configMap.get(previousId)).unlock_cue > 0) {
                    previous && previous.unlock_cue <= PlayerDataSys.curSceneID && !this.isCueInUnlockedHistory(previousId) && !this.isCueUnlocked(previous.id) && this.addCueToNewUnlockedRecored(previousId);
                    break;
                }
            }
        }
    }
}

export default CueDataSys._getInstance();
