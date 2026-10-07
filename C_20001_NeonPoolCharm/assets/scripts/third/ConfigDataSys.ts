import ConfigDataMgr, { itemsConfigDDName, layerDDName } from "./ConfigDataMgr";
import CueDataSys from "./CueDataSys";
import { AD_TYPE } from "./GameServiceMgr";
import PlayerDataSys from "./PlayerDataSys";

class ConfigDataSys extends ConfigDataMgr {
    sim_MaxPlayerTimes = null;
    sim_playTimesRange = null;
    sim_cashRange = null;
    sim_rollingTimeRange = null;
    diamond_ListConfig = null;
    layerDDConfig = null;
    goodsDDConfig = null;
    add_slot_price: any = null;

    get levelqiqiu() {
        return 1 == Number(this.global_ConfigMap.get("levelqiqiu"));
    }

    get getShowMaxCash() {
        return 1e3;
    }

    initPropConfig(e: any): void {
        this.initConfig(e.prop_config, this.prop_ConfigMap, "id", true);
    }

    parseStageItemConfig(e: any): any[] {
        if (e) {
            const t = [];
            Object.keys(e).forEach((o) => {
                const n = e[o];
                const i: any = {};
                const a = n.ID;
                i.id = a;
                i.item_id = a;
                Object.keys(n).forEach((key) => {
                    i[key] = n[key];
                });
                t.push(i);
            });
            return t;
        }
    }

    getLinePropTime(): number {
        const e = Number(this.ad_configMap.get(AD_TYPE.line_prop).type_para);
        return Math.floor(e / 60);
    }

    initGlobalConfig(e: any): void {
        Object.keys(e).forEach((o) => {
            const n = e[o];
            this.global_ConfigMap.set(o, n.para_value);
        });
    }

    initSimData(): void {
        this.sim_MaxPlayerTimes = Array.from(this.rollingNotice_ConfigMap.keys()).reverse()[0];
        this.sim_playTimesRange = [];
        this.sim_cashRange = [Number(this.global_ConfigMap.get("tips_cash_a")), Number(this.global_ConfigMap.get("tips_cash_b"))];
        this.sim_rollingTimeRange = [];
        let e = this.global_ConfigMap.get("top_num").split(",");
        this.sim_playTimesRange[0] = Number(e[0]);
        this.sim_playTimesRange[1] = Number(e[1]);
        e = this.global_ConfigMap.get("tips_time").split(",");
        this.sim_rollingTimeRange[0] = Number(e[0]);
        this.sim_rollingTimeRange[1] = Number(e[1]);
    }

    parseStageLayerConfig(e: any): number[] {
        if (e) {
            const t = [];
            Object.keys(e).forEach((o) => {
                const n = e[o];
                const i = Number(n.layer_style_id);
                Number.isInteger(i) && i > 0 && t.push(i);
            });
            return t;
        }
    }

    init(e: any): void {
        if (e) {
            this.initConfig(e.scene, this.scene_configMap);
            this.initConfig(e.level_main, this.level_configMap);
            this.initConfig(e.club, this.cue_configMap);
            this.initConfig(e.cash_extract, this.cash_extract_configMap);
            this.initConfig(e.gold_extract, this.gold_extract_configMap);
            this.initConfig(e.sign_in, this.sign_in_configMap);
            this.initConfig(e.lucky_draw, this.chouJiang_configMap);
            this.initConfig(e.ad, this.ad_configMap);
            this.initConfig(e.club_gold, this.club_gold_configMap);
            this.initGlobalConfig(e.game_global);
            CueDataSys.initCueDataMgr();
        }
    }

    getFreeChouJiang(): boolean {
        const e = this.ad_configMap.get(AD_TYPE.lucky_draw).type_para.split("_");
        console.log(e);
        return !!(e && e[1] && Number(e[1]));
    }

    getLevelCashNum(): any {
        return this.level_configMap.get(PlayerDataSys.validConfigLevelID).cash_reward;
    }

    initConfig(e: any, t: Map<any, any>, o?: string, n: boolean = false): void {
        if (e) {
            t.clear();
            Object.keys(e).forEach((i) => {
                const a = e[i];
                const r: any = {};
                let l = o ? a[o] : Number(i);
                n && (l = Number(l));
                r.id = l;
                Object.keys(a).forEach((key) => {
                    r[key] = a[key];
                });
                t.set(l, r);
            });
        }
    }

    getFuhuoHeartAddCount(): number {
        return Number(this.ad_configMap.get(AD_TYPE.relive).type_para);
    }

    initTaskConfig(e: any): void {
        this.initConfig(e.tasks, this.task_ConfigMap, "pass_task_id");
        const t = this.task_ConfigMapByType;
        this.task_ConfigMap.forEach((item) => {
            item.type = Number(item.type);
            const o = item.type;
            let n = t.get(o);
            if (!n) {
                n = [];
                t.set(o, n);
            }
            n.push(item);
        });
    }

    getQiQiuLevel(): number {
        return Number(this.ad_configMap.get(AD_TYPE.baoxiang).type_para);
    }

    initLayerStyleConfig(e: any): void {
        e && Object.keys(e).forEach((o) => {
            const n = e[o];
            const i: any = {};
            const a = n.ID;
            i.id = a;
            Object.keys(n).forEach((key) => {
                if (key.startsWith("box")) {
                    const val = String(n[key]);
                    if (val.indexOf(",") > -1) {
                        const parts = val.split(",");
                        const boxConfig = {
                            boxTypeID: Number(parts[0]),
                            boxLogicX: Number(parts[1])
                        };
                        i.boxConfig || (i.boxConfig = []);
                        i.boxConfig.push(boxConfig);
                    }
                }
            });
            this.layerStyleMap.set(a, i);
        });
    }

    initStripleStageConfig(e: any): void {
        this.initConfig(e.levels, this.stage_configMap, "id");
        this.stage_configMap.forEach((o) => {
            const n = o.layer_config_name;
            const i = o.item_config_name;
            this.stage_layerMap.has(n) || this.stage_layerMap.set(n, this.parseStageLayerConfig(e[n]));
            i.split("#");
            i.split("#").forEach((itemName) => {
                this.stage_itemConfigMap.has(itemName) || this.stage_itemConfigMap.set(itemName, this.parseStageItemConfig(e[itemName]));
            });
        });
        this.layerDDConfig = this.parseStageLayerConfig(e[layerDDName]);
        this.goodsDDConfig = this.parseStageItemConfig(e[itemsConfigDDName]);
    }

    getLevelCash(): any {
        const e = this.level_configMap.get(PlayerDataSys.validConfigLevelID);
        return PlayerDataSys.getCashWithUnit(e.cash_reward);
    }

    initDiamondConfig(e: any): void {
        this.initConfig(e.recharge, this.diamond_ConfigMap, "id");
        const t = Array.from(this.diamond_ConfigMap.values()).sort((a, b) => {
            return a.id > b.id ? 1 : -1;
        });
        this.diamond_ListConfig = [];
        let o = [];
        for (let n = 0; n < t.length; n++) {
            const i = t[n];
            if (3 != i.gear_type) {
                if (2 != i.gear_type) {
                    o.push(i.id);
                    this.diamond_ListConfig.push(o);
                    o = [];
                } else {
                    o.push(i.id);
                }
            }
            6 == i.id && (this.add_slot_price = i.gear_price);
        }
    }

    getBaiqiuPropCount(): any {
        return this.ad_configMap.get(AD_TYPE.baiqiu_prop).type_para;
    }

    static _getInstance(): ConfigDataSys {
        ConfigDataSys._instance || (ConfigDataSys._instance = new ConfigDataSys());
        return ConfigDataSys._instance;
    }

    static _instance: ConfigDataSys = null;
}

export default ConfigDataSys._getInstance();
