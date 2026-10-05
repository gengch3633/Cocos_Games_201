import * as GameServiceMgr from "./GameServiceMgr";

export const EPropID = cc.Enum({
    E_CiTie: 1,
    E_XiPai: 2,
    E_CheChu: 3,
    E_FUHUO: 4,
    E_JIA_CAO: 5,
});

export const PropIconMap: Record<number, string> = {
    [EPropID.E_CiTie]: "prop2",
    [EPropID.E_CheChu]: "prop3",
    [EPropID.E_XiPai]: "prop4",
    [EPropID.E_JIA_CAO]: "prop1",
};

export const ECueAttriType = cc.Enum({
    E_POWER: 1,
    E_SPIN: 2,
    E_AMIING: 3,
});

export const ETaiQiuPropType = cc.Enum({
    E_BaiQiu: 1,
    E_Line: 2,
});

export const layerDDName = "layer_dd";
export const itemsConfigDDName = "goods_dd";

export default class ConfigDataMgr {
    protected _color: unknown = null;
    scene_configMap: Map<number, any> = new Map();
    level_configMap: Map<number, any> = new Map();
    cue_configMap: Map<number, any> = new Map();
    global_ConfigMap: Map<string, any> = new Map();
    gold_extract_configMap: Map<number, any> = new Map();
    cash_extract_configMap: Map<number, any> = new Map();
    sign_in_configMap: Map<number, any> = new Map();
    chouJiang_configMap: Map<number, any> = new Map();
    club_gold_configMap: Map<number, any> = new Map();
    ad_configMap: Map<number, any> = new Map();
    layerStyleMap: Map<number, any> = new Map();
    stage_configMap: Map<number, any> = new Map();
    stage_layerMap: Map<string, any> = new Map();
    stage_itemConfigMap: Map<string, any> = new Map();
    diamond_ConfigMap: Map<number, any> = new Map();
    diamond_ListConfig: number[][] = [];
    task_ConfigMap: Map<number, any> = new Map();
    task_ConfigMapByType: Map<number, any[]> = new Map();
    prop_ConfigMap: Map<number, any> = new Map();
    rollingNotice_ConfigMap: Map<number, any> = new Map();

    get color(): unknown {
        return this._color;
    }
    set color(value: unknown) {
        this._color = value;
    }

    get xiaoqiuADMaxCount(): number {
        return Number(this.ad_configMap.get(GameServiceMgr.AD_TYPE.remove_billiard_cash).type_para);
    }

    calculateValue(value: number): number {
        const parts = this.global_ConfigMap.get("nonlinear_progress").split("#");
        const o = Number(parts[0].split(",")[0]);
        const n = Number(parts[0].split(",")[1]);
        const i = Number(parts[1].split(",")[0]);
        const a = Number(parts[1].split(",")[1]);
        const r = Number(parts[2].split(",")[0]);
        const l = Number(parts[2].split(",")[1]);
        if (value >= r) {
            return Math.min(l + 1e-4 * (value - r), 0.9999);
        }
        if (value >= o && value < i) {
            return n + ((a - n) / (i - o)) * (value - o);
        }
        if (value >= i && value < r) {
            return a + ((l - a) / (r - i)) * (value - i);
        }
        return (n / o) * value;
    }
}
