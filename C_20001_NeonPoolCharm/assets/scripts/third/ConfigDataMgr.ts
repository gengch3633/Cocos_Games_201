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
    diamond_ListConfig: any[] = [];
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

    calculateValue(e: number): number {
        const t = this.global_ConfigMap.get("nonlinear_progress").split("#");
        const o = Number(t[0].split(",")[0]);
        const n = Number(t[0].split(",")[1]);
        const i = Number(t[1].split(",")[0]);
        const a = Number(t[1].split(",")[1]);
        const r = Number(t[2].split(",")[0]);
        const l = Number(t[2].split(",")[1]);
        return e >= r ? Math.min(l + 1e-4 * (e - r), 0.9999) : e >= o && e < i ? n + (a - n) / (i - o) * (e - o) : e >= i && e < r ? a + (l - a) / (r - i) * (e - i) : n / o * e;
    }
}
