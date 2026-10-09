import { AD_TYPE } from "./GameServiceMgr";

export const EPropID = cc.Enum({
    E_CiTie: 1,
    E_XiPai: 2,
    E_CheChu: 3,
    E_FUHUO: 4,
    E_JIA_CAO: 5
});

export const PropIconMap = {
    [EPropID.E_CiTie]: "prop2",
    [EPropID.E_CheChu]: "prop3",
    [EPropID.E_XiPai]: "prop4",
    [EPropID.E_JIA_CAO]: "prop1"
};

export const ECueAttriType = cc.Enum({
    E_POWER: 1,
    E_SPIN: 2,
    E_AMIING: 3
});

export const ETaiQiuPropType = cc.Enum({
    E_BaiQiu: 1,
    E_Line: 2
});

export const layerDDName = "layer_dd";
export const itemsConfigDDName = "goods_dd";

export default class ConfigDataMgr {
    _color = null;
    scene_configMap = new Map();
    level_configMap = new Map();
    cue_configMap = new Map();
    global_ConfigMap = new Map();
    gold_extract_configMap = new Map();
    cash_extract_configMap = new Map();
    sign_in_configMap = new Map();
    chouJiang_configMap = new Map();
    club_gold_configMap = new Map();
    ad_configMap = new Map();
    layerStyleMap = new Map();
    stage_configMap = new Map();
    stage_layerMap = new Map();
    stage_itemConfigMap = new Map();
    diamond_ConfigMap = new Map();
    diamond_ListConfig = [];
    task_ConfigMap = new Map();
    task_ConfigMapByType = new Map();
    prop_ConfigMap = new Map();
    rollingNotice_ConfigMap = new Map();

    get color() {
        return this._color;
    }

    set color(value) {
        this._color = value;
    }

    get xiaoqiuADMaxCount() {
        return Number(this.ad_configMap.get(AD_TYPE.remove_billiard_cash).type_para);
    }

    calculateValue(value) {
        const parts = this.global_ConfigMap.get("nonlinear_progress").split("#");
        const start = Number(parts[0].split(",")[0]);
        const startValue = Number(parts[0].split(",")[1]);
        const mid = Number(parts[1].split(",")[0]);
        const midValue = Number(parts[1].split(",")[1]);
        const end = Number(parts[2].split(",")[0]);
        const endValue = Number(parts[2].split(",")[1]);
        return value >= end ? Math.min(endValue + 1e-4 * (value - end), .9999) : value >= start && value < mid ? startValue + (midValue - startValue) / (mid - start) * (value - start) : value >= mid && value < end ? midValue + (endValue - midValue) / (end - mid) * (value - mid) : startValue / start * value;
    }
}
