import CueDataSys from "./CueDataSys";
import * as GameServiceMgr from "./GameServiceMgr";
import ConfigDataMgr, { itemsConfigDDName, layerDDName } from "./ConfigDataMgr";
import PlayerDataSys from "./PlayerDataSys";

class ConfigDataSys extends ConfigDataMgr {
    sim_MaxPlayerTimes: number = null;
    sim_playTimesRange: number[] = null;
    sim_cashRange: number[] = null;
    sim_rollingTimeRange: number[] = null;
    layerDDConfig: number[] = null;
    goodsDDConfig: any[] = null;
    add_slot_price: number;

    private static _instance: ConfigDataSys = null;

    get levelqiqiu(): boolean {
        return Number(this.global_ConfigMap.get("levelqiqiu")) == 1;
    }

    get getShowMaxCash(): number {
        return 1000;
    }

    initPropConfig(data: any): void {
        this.initConfig(data.prop_config, this.prop_ConfigMap, "id", true);
    }

    parseStageItemConfig(data: any): any[] {
        if (!data) {
            return undefined;
        }
        const result: any[] = [];
        Object.keys(data).forEach((key) => {
            const item = data[key];
            const parsed: any = {};
            const id = item.ID;
            parsed.id = id;
            parsed.item_id = id;
            Object.keys(item).forEach((field) => {
                parsed[field] = item[field];
            });
            result.push(parsed);
        });
        return result;
    }

    getLinePropTime(): number {
        const seconds = Number(this.ad_configMap.get(GameServiceMgr.AD_TYPE.line_prop).type_para);
        return Math.floor(seconds / 60);
    }

    initGlobalConfig(data: any): void {
        Object.keys(data).forEach((key) => {
            const entry = data[key];
            this.global_ConfigMap.set(key, entry.para_value);
        });
    }

    initSimData(): void {
        this.sim_MaxPlayerTimes = Array.from(this.rollingNotice_ConfigMap.keys()).reverse()[0];
        this.sim_playTimesRange = [];
        this.sim_cashRange = [
            Number(this.global_ConfigMap.get("tips_cash_a")),
            Number(this.global_ConfigMap.get("tips_cash_b")),
        ];
        this.sim_rollingTimeRange = [];
        let parts = this.global_ConfigMap.get("top_num").split(",");
        this.sim_playTimesRange[0] = Number(parts[0]);
        this.sim_playTimesRange[1] = Number(parts[1]);
        parts = this.global_ConfigMap.get("tips_time").split(",");
        this.sim_rollingTimeRange[0] = Number(parts[0]);
        this.sim_rollingTimeRange[1] = Number(parts[1]);
    }

    parseStageLayerConfig(data: any): number[] {
        if (!data) {
            return undefined;
        }
        const result: number[] = [];
        Object.keys(data).forEach((key) => {
            const item = data[key];
            const layerStyleId = Number(item.layer_style_id);
            if (Number.isInteger(layerStyleId) && layerStyleId > 0) {
                result.push(layerStyleId);
            }
        });
        return result;
    }

    init(data: any): void {
        if (!data) {
            return;
        }
        this.initConfig(data.scene, this.scene_configMap);
        this.initConfig(data.level_main, this.level_configMap);
        this.initConfig(data.club, this.cue_configMap);
        this.initConfig(data.cash_extract, this.cash_extract_configMap);
        this.initConfig(data.gold_extract, this.gold_extract_configMap);
        this.initConfig(data.sign_in, this.sign_in_configMap);
        this.initConfig(data.lucky_draw, this.chouJiang_configMap);
        this.initConfig(data.ad, this.ad_configMap);
        this.initConfig(data.club_gold, this.club_gold_configMap);
        this.initGlobalConfig(data.game_global);
        CueDataSys.initCueDataMgr();
    }

    getFreeChouJiang(): boolean {
        const parts = this.ad_configMap.get(GameServiceMgr.AD_TYPE.lucky_draw).type_para.split("_");
        console.log(parts);
        return !!(parts && parts[1] && Number(parts[1]));
    }

    getLevelCashNum(): number {
        return this.level_configMap.get(PlayerDataSys.validConfigLevelID).cash_reward;
    }

    initConfig(data: any, map: Map<number, any>, idKey?: string, forceNumberId?: boolean): void {
        if (forceNumberId === undefined) {
            forceNumberId = false;
        }
        if (!data) {
            return;
        }
        map.clear();
        Object.keys(data).forEach((key) => {
            const source = data[key];
            const target: any = {};
            let id: number = idKey ? source[idKey] : Number(key);
            if (forceNumberId) {
                id = Number(id);
            }
            target.id = id;
            Object.keys(source).forEach((field) => {
                target[field] = source[field];
            });
            map.set(id, target);
        });
    }

    getFuhuoHeartAddCount(): number {
        return Number(this.ad_configMap.get(GameServiceMgr.AD_TYPE.relive).type_para);
    }

    initTaskConfig(data: any): void {
        this.initConfig(data.tasks, this.task_ConfigMap, "pass_task_id");
        const byType = this.task_ConfigMapByType;
        this.task_ConfigMap.forEach((task) => {
            task.type = Number(task.type);
            const type = task.type;
            let list = byType.get(type);
            if (!list) {
                list = [];
                byType.set(type, list);
            }
            list.push(task);
        });
    }

    getQiQiuLevel(): number {
        return Number(this.ad_configMap.get(GameServiceMgr.AD_TYPE.baoxiang).type_para);
    }

    initLayerStyleConfig(data: any): void {
        if (!data) {
            return;
        }
        Object.keys(data).forEach((key) => {
            const source = data[key];
            const target: any = {};
            const id = source.ID;
            target.id = id;
            Object.keys(source).forEach((field) => {
                if (field.startsWith("box")) {
                    const raw = String(source[field]);
                    if (raw.indexOf(",") > -1) {
                        const parts = raw.split(",");
                        const box = {
                            boxTypeID: Number(parts[0]),
                            boxLogicX: Number(parts[1]),
                        };
                        if (!target.boxConfig) {
                            target.boxConfig = [];
                        }
                        target.boxConfig.push(box);
                    }
                }
            });
            this.layerStyleMap.set(id, target);
        });
    }

    initStripleStageConfig(data: any): void {
        this.initConfig(data.levels, this.stage_configMap, "id");
        this.stage_configMap.forEach((stage) => {
            const layerConfigName = stage.layer_config_name;
            const itemConfigName = stage.item_config_name;
            if (!this.stage_layerMap.has(layerConfigName)) {
                this.stage_layerMap.set(layerConfigName, this.parseStageLayerConfig(data[layerConfigName]));
            }
            itemConfigName.split("#").forEach((name: string) => {
                if (!this.stage_itemConfigMap.has(name)) {
                    this.stage_itemConfigMap.set(name, this.parseStageItemConfig(data[name]));
                }
            });
        });
        this.layerDDConfig = this.parseStageLayerConfig(data[layerDDName]);
        this.goodsDDConfig = this.parseStageItemConfig(data[itemsConfigDDName]);
    }

    getLevelCash(): string {
        const level = this.level_configMap.get(PlayerDataSys.validConfigLevelID);
        return PlayerDataSys.getCashWithUnit(level.cash_reward);
    }

    initDiamondConfig(data: any): void {
        this.initConfig(data.recharge, this.diamond_ConfigMap, "id");
        const sorted = Array.from(this.diamond_ConfigMap.values()).sort((a, b) => (a.id > b.id ? 1 : -1));
        this.diamond_ListConfig = [];
        let group: number[] = [];
        for (let i = 0; i < sorted.length; i++) {
            const item = sorted[i];
            if (item.gear_type != 3) {
                if (item.gear_type != 2) {
                    group.push(item.id);
                    this.diamond_ListConfig.push(group);
                    group = [];
                } else {
                    group.push(item.id);
                }
            }
            if (item.id == 6) {
                this.add_slot_price = item.gear_price;
            }
        }
    }

    getBaiqiuPropCount(): string {
        return this.ad_configMap.get(GameServiceMgr.AD_TYPE.baiqiu_prop).type_para;
    }

    private static _getInstance(): ConfigDataSys {
        if (!ConfigDataSys._instance) {
            ConfigDataSys._instance = new ConfigDataSys();
        }
        return ConfigDataSys._instance;
    }
}

export default ConfigDataSys._getInstance();
