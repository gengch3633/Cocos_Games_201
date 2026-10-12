import * as ConfigDefine from "./ConfigDefine";
import ConfigMgr from "./ConfigMgr";
import MultiPlatform from "./MultiPlatform";

export default class Common {
    public static readonly version: string = "1.0.0";
    public static readonly GameModel: number = 0;

    public static get isGM(): boolean {
        return !!cc.sys.isBrowser
            || ConfigMgr.getInstance()
                .getOne(ConfigDefine.VipListConfig)
                .vipList
                .indexOf(MultiPlatform.getInstance().openId) >= 0;
    }
}