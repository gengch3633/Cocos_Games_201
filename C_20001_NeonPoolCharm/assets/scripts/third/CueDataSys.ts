import ConfigDataSys from "./ConfigDataSys";
import PlayerDataSys from "./PlayerDataSys";
import EngineUtil from "./EngineUtil";
import CueDataMgr from "./CueDataMgr";
import { UiManager } from "./UiManage";

class CueDataSys extends CueDataMgr {
    private static _instance: CueDataSys = null;

    club_gold_index: number = null;
    club_shard = new Map<number, number>();

    getUsedCueAimLineLen(): number {
        const config = ConfigDataSys.cue_configMap.get(this.usedCueId);
        return config ? config.aiming : 90;
    }

    isCueNotOpened(cueId: number): boolean {
        return typeof this.get_clubs[cueId] != "boolean";
    }

    updateClubShard(shardData: Record<string, number>): void {
        this.club_shard = new Map();
        Object.entries(shardData).forEach(([key, value]) => {
            this.club_shard.set(Number(key), value);
        });
    }

    getUsedCuePower(): number {
        const config = ConfigDataSys.cue_configMap.get(this.usedCueId);
        return config ? config.force : 100;
    }

    initData(data: {
        use_club_id: number;
        get_clubs: Record<string, boolean>;
        next_club_id: number;
        club_gold_index: number;
        club_shard: Record<string, number>;
    }): void {
        this.usedCueId = data.use_club_id;
        this.get_clubs = data.get_clubs;
        this.nextCueID = data.next_club_id;
        this.club_gold_index = data.club_gold_index;
        this.updateClubShard(data.club_shard);
    }

    getCueSourceName(cueId: number): string {
        const config = ConfigDataSys.cue_configMap.get(cueId);
        return config ? config.cuepng : "cue01";
    }

    private static _getInstance(): CueDataSys {
        if (!CueDataSys._instance) {
            CueDataSys._instance = new CueDataSys();
        }
        return CueDataSys._instance;
    }

    isCueInNewUnlocked(cueId: number): boolean {
        return EngineUtil.localStorageGetItem("new_unlock_cue", "").split(",").indexOf(String(cueId)) > -1;
    }

    addCueToUnlockedHistoryRecored(cueId: number): void {
        const stored = EngineUtil.localStorageGetItem("unlocked_cues", "");
        const list = stored.length < 1 ? [] : stored.split(",");
        list.push(String(cueId));
        EngineUtil.localStorageSetItem("unlocked_cues", list.join(","));
    }

    getUsedCueRoleAngle(): number {
        const config = ConfigDataSys.cue_configMap.get(this.usedCueId);
        return config ? config.spin : 30;
    }

    setCueIcon(node: cc.Node, cueId: number, callback?: () => void): void {
        UiManager.loadSpriteFrame(node, "cue_icon", this.getCueSourceName(cueId), callback);
    }

    setCueSpine(node: cc.Node, cueId: number): void {
        UiManager.loadSpine(node, "cue_spine", this.getCueSourceName(cueId), () => {
            node.getComponent(sp.Skeleton).setAnimation(0, "animation", true);
        });
    }

    isCueUnlocked(cueId: number): boolean {
        return this.get_clubs[cueId] === true;
    }

    getNewUnlockCueRecored(): string[] {
        const stored = EngineUtil.localStorageGetItem("new_unlock_cue", "");
        console.log("getNewUnlockCueRecored : ", stored);
        return stored.length < 1 ? [] : stored.split(",");
    }

    isCueInUnlockedHistory(cueId: number): boolean {
        return EngineUtil.localStorageGetItem("unlocked_cues", "").split(",").indexOf(String(cueId)) > -1;
    }

    addCueToNewUnlockedRecored(cueId: number): void {
        const stored = EngineUtil.localStorageGetItem("new_unlock_cue", "");
        const list = stored.length < 1 ? [] : stored.split(",");
        list.push(String(cueId));
        console.log("addCueToNewUnlockedRecored : ", list);
        EngineUtil.localStorageSetItem("new_unlock_cue", list.join(","));
    }

    removeCueFormNewUnlockCueRecored(cueId: number): void {
        const stored = EngineUtil.localStorageGetItem("new_unlock_cue", "");
        const list = stored.length < 1 ? [] : stored.split(",");
        const index = list.indexOf(String(cueId));
        if (index > -1) {
            list.splice(index, 1);
            EngineUtil.localStorageSetItem("new_unlock_cue", list.length < 1 ? "" : list.join(","));
        }
    }

    getCurCueSourceName(): string {
        return this.getCueSourceName(this.usedCueId);
    }

    checkUnlockCue(): void {
        const cueIds = Array.from(ConfigDataSys.cue_configMap.keys());
        for (let i = 0; i < cueIds.length; i++) {
            const config = ConfigDataSys.cue_configMap.get(cueIds[i]);
            if (config.unlock_cue > 0 && !this.isCueUnlocked(config.id) && PlayerDataSys.curSceneID < config.unlock_cue) {
                const prevId = config.id - 1;
                const prevConfig = ConfigDataSys.cue_configMap.get(prevId);
                if (prevConfig && prevConfig.unlock_cue > 0) {
                    if (prevConfig.unlock_cue <= PlayerDataSys.curSceneID && !this.isCueInUnlockedHistory(prevId) && !this.isCueUnlocked(prevConfig.id)) {
                        this.addCueToNewUnlockedRecored(prevId);
                    }
                    break;
                }
            }
        }
    }
}

export default CueDataSys._getInstance();
