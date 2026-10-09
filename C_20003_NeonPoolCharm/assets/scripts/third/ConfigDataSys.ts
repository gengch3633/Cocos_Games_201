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
    add_slot_price;

    static _instance = null;

    get levelqiqiu() {
        return 1 == Number(this.global_ConfigMap.get("levelqiqiu"));
    }

    get getShowMaxCash() {
        return 1e3;
    }

    initPropConfig(data) {
        this.initConfig(data.prop_config, this.prop_ConfigMap, "id", true);
    }

    parseStageItemConfig(data) {
        if (data) {
            const list = [];
            Object.keys(data).forEach(function (key) {
                const source = data[key];
                const item: any = {};
                const id = source.ID;
                item.id = id;
                item.item_id = id;
                Object.keys(source).forEach(function (field) {
                    item[field] = source[field];
                });
                list.push(item);
            });
            return list;
        }
    }

    getLinePropTime() {
        const seconds = Number(this.ad_configMap.get(AD_TYPE.line_prop).type_para);
        return Math.floor(seconds / 60);
    }

    initGlobalConfig(data) {
        const self = this;
        Object.keys(data).forEach(function (key) {
            const item = data[key];
            self.global_ConfigMap.set(key, item.para_value);
        });
    }

    initSimData() {
        this.sim_MaxPlayerTimes = Array.from(this.rollingNotice_ConfigMap.keys()).reverse()[0];
        this.sim_playTimesRange = [];
        this.sim_cashRange = [Number(this.global_ConfigMap.get("tips_cash_a")), Number(this.global_ConfigMap.get("tips_cash_b"))];
        this.sim_rollingTimeRange = [];
        let range = this.global_ConfigMap.get("top_num").split(",");
        this.sim_playTimesRange[0] = Number(range[0]);
        this.sim_playTimesRange[1] = Number(range[1]);
        range = this.global_ConfigMap.get("tips_time").split(",");
        this.sim_rollingTimeRange[0] = Number(range[0]);
        this.sim_rollingTimeRange[1] = Number(range[1]);
    }

    parseStageLayerConfig(data) {
        if (data) {
            const list = [];
            Object.keys(data).forEach(function (key) {
                const item = data[key];
                const styleId = Number(item.layer_style_id);
                if (Number.isInteger(styleId) && styleId > 0) {
                    list.push(styleId);
                }
            });
            return list;
        }
    }

    init(data) {
        if (data) {
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
    }

    getFreeChouJiang() {
        const parts = this.ad_configMap.get(AD_TYPE.lucky_draw).type_para.split("_");
        console.log(parts);
        return !!(parts && parts[1] && Number(parts[1]));
    }

    getLevelCashNum() {
        return this.level_configMap.get(PlayerDataSys.validConfigLevelID).cash_reward;
    }

    initConfig(data, map, idKey?, asNumber?) {
        if (undefined === asNumber) {
            asNumber = false;
        }
        if (data) {
            map.clear();
            Object.keys(data).forEach(function (key) {
                const source = data[key];
                const item: any = {};
                let id = idKey ? source[idKey] : Number(key);
                if (asNumber) {
                    id = Number(id);
                }
                item.id = id;
                Object.keys(source).forEach(function (field) {
                    item[field] = source[field];
                });
                map.set(id, item);
            });
        }
    }

    getFuhuoHeartAddCount() {
        return Number(this.ad_configMap.get(AD_TYPE.relive).type_para);
    }

    static _getInstance() {
        if (!ConfigDataSys._instance) {
            ConfigDataSys._instance = new ConfigDataSys();
        }
        return ConfigDataSys._instance;
    }

    initTaskConfig(data) {
        this.initConfig(data.tasks, this.task_ConfigMap, "pass_task_id");
        const byType = this.task_ConfigMapByType;
        this.task_ConfigMap.forEach(function (task) {
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

    getQiQiuLevel() {
        return Number(this.ad_configMap.get(AD_TYPE.baoxiang).type_para);
    }

    initLayerStyleConfig(data) {
        const self = this;
        if (data) {
            Object.keys(data).forEach(function (key) {
                const source = data[key];
                const item: any = {};
                const id = source.ID;
                item.id = id;
                Object.keys(source).forEach(function (field) {
                    if (field.startsWith("box")) {
                        const text = String(source[field]);
                        if (text.indexOf(",") > -1) {
                            const parts = text.split(",");
                            const box = {
                                boxTypeID: Number(parts[0]),
                                boxLogicX: Number(parts[1])
                            };
                            if (!item.boxConfig) {
                                item.boxConfig = [];
                            }
                            item.boxConfig.push(box);
                        }
                    }
                });
                self.layerStyleMap.set(id, item);
            });
        }
    }

    initStripleStageConfig(data) {
        const self = this;
        this.initConfig(data.levels, this.stage_configMap, "id");
        this.stage_configMap.forEach(function (stage) {
            const layerName = stage.layer_config_name;
            const itemName = stage.item_config_name;
            if (!self.stage_layerMap.has(layerName)) {
                self.stage_layerMap.set(layerName, self.parseStageLayerConfig(data[layerName]));
            }
            itemName.split("#");
            itemName.split("#").forEach(function (name) {
                if (!self.stage_itemConfigMap.has(name)) {
                    self.stage_itemConfigMap.set(name, self.parseStageItemConfig(data[name]));
                }
            });
        });
        this.layerDDConfig = this.parseStageLayerConfig(data[layerDDName]);
        this.goodsDDConfig = this.parseStageItemConfig(data[itemsConfigDDName]);
    }

    getLevelCash() {
        const level = this.level_configMap.get(PlayerDataSys.validConfigLevelID);
        return PlayerDataSys.getCashWithUnit(level.cash_reward);
    }

    initDiamondConfig(data) {
        this.initConfig(data.recharge, this.diamond_ConfigMap, "id");
        const list = Array.from(this.diamond_ConfigMap.values()).sort(function (a, b) {
            return a.id > b.id ? 1 : -1;
        });
        this.diamond_ListConfig = [];
        let group = [];
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (3 != item.gear_type) {
                if (2 != item.gear_type) {
                    group.push(item.id);
                    this.diamond_ListConfig.push(group);
                    group = [];
                } else {
                    group.push(item.id);
                }
            }
            if (6 == item.id) {
                this.add_slot_price = item.gear_price;
            }
        }
    }

    getBaiqiuPropCount() {
        return this.ad_configMap.get(AD_TYPE.baiqiu_prop).type_para;
    }
}

export default ConfigDataSys._getInstance();
