import ConfigDataSys from "./ConfigDataSys";
import CueDataMgr from "./CueDataMgr";
import EngineUtil from "./EngineUtil";
import PlayerDataSys from "./PlayerDataSys";
import { UiManager } from "./UiManage";

class CueDataSys extends CueDataMgr {
    club_gold_index = null;
    club_shard: Map<number, any> = null;

    getUsedCueAimLineLen(): number {
        const e = ConfigDataSys.cue_configMap.get(this.usedCueId);
        return e ? e.aiming : 90;
    }

    isCueNotOpened(e: number): boolean {
        return "boolean" != typeof this.get_clubs[e];
    }

    updateClubShard(e: Record<string, any>): void {
        this.club_shard = new Map();
        Object.entries(e).forEach(([o, n]) => {
            this.club_shard.set(Number(o), n);
        });
    }

    getUsedCuePower(): number {
        const e = ConfigDataSys.cue_configMap.get(this.usedCueId);
        return e ? e.force : 100;
    }

    initData(e: any): void {
        this.usedCueId = e.use_club_id;
        this.get_clubs = e.get_clubs;
        this.nextCueID = e.next_club_id;
        this.club_gold_index = e.club_gold_index;
        this.updateClubShard(e.club_shard);
    }

    getCueSourceName(e: number): string {
        const t = ConfigDataSys.cue_configMap.get(e);
        return t ? t.cuepng : "cue01";
    }

    static _getInstance(): CueDataSys {
        CueDataSys._instance || (CueDataSys._instance = new CueDataSys());
        return CueDataSys._instance;
    }

    isCueInNewUnlocked(e: number): boolean {
        return EngineUtil.localStorageGetItem("new_unlock_cue", "").split(",").indexOf(String(e)) > -1;
    }

    addCueToUnlockedHistoryRecored(e: number): void {
        const t = EngineUtil.localStorageGetItem("unlocked_cues", "");
        const o = t.length < 1 ? [] : t.split(",");
        o.push(String(e));
        const n = o.join(",");
        EngineUtil.localStorageSetItem("unlocked_cues", n);
    }

    getUsedCueRoleAngle(): number {
        const e = ConfigDataSys.cue_configMap.get(this.usedCueId);
        return e ? e.spin : 30;
    }

    setCueIcon(e: cc.Node, t: number, o?: Function): void {
        UiManager.loadSpriteFrame(e, "cue_icon", this.getCueSourceName(t), o);
    }

    setCueSpine(e: cc.Node, t: number): void {
        UiManager.loadSpine(e, "cue_spine", this.getCueSourceName(t), () => {
            e.getComponent(sp.Skeleton).setAnimation(0, "animation", true);
        });
    }

    isCueUnlocked(e: number): boolean {
        return true === this.get_clubs[e];
    }

    getNewUnlockCueRecored(): string[] {
        const e = EngineUtil.localStorageGetItem("new_unlock_cue", "");
        console.log("getNewUnlockCueRecored : ", e);
        return e.length < 1 ? [] : e.split(",");
    }

    isCueInUnlockedHistory(e: number): boolean {
        return EngineUtil.localStorageGetItem("unlocked_cues", "").split(",").indexOf(String(e)) > -1;
    }

    addCueToNewUnlockedRecored(e: number): void {
        const t = EngineUtil.localStorageGetItem("new_unlock_cue", "");
        const o = t.length < 1 ? [] : t.split(",");
        o.push(String(e));
        const n = o.join(",");
        console.log("addCueToNewUnlockedRecored : ", o);
        EngineUtil.localStorageSetItem("new_unlock_cue", n);
    }

    removeCueFormNewUnlockCueRecored(e: number): void {
        const t = EngineUtil.localStorageGetItem("new_unlock_cue", "");
        const o = t.length < 1 ? [] : t.split(",");
        const n = o.indexOf(String(e));
        if (n > -1) {
            o.splice(n, 1);
            EngineUtil.localStorageSetItem("new_unlock_cue", o.length < 1 ? "" : o.join(","));
        }
    }

    getCurCueSourceName(): string {
        return this.getCueSourceName(this.usedCueId);
    }

    checkUnlockCue(): void {
        const e = Array.from(ConfigDataSys.cue_configMap.keys());
        for (let t = 0; t < e.length; t++) {
            let o;
            const n = ConfigDataSys.cue_configMap.get(e[t]);
            if (n.unlock_cue > 0 && !this.isCueUnlocked(n.id) && PlayerDataSys.curSceneID < n.unlock_cue) {
                const i = n.id - 1;
                if ((o = ConfigDataSys.cue_configMap.get(i)).unlock_cue > 0) {
                    o && o.unlock_cue <= PlayerDataSys.curSceneID && !this.isCueInUnlockedHistory(i) && !this.isCueUnlocked(o.id) && this.addCueToNewUnlockedRecored(i);
                    break;
                }
            }
        }
    }

    static _instance: CueDataSys = null;
}

export default CueDataSys._getInstance();
