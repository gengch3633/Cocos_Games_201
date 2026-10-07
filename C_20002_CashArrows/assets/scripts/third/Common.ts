import ConfigMgr from "./ConfigMgr";
import { VipListConfig } from "./ConfigDefine";

export default class Common {
    static version = "1.0.0";
    static GameModel = 0;

    static get isGM(): boolean {
        const MultiPlatform = require("./MultiPlatform").default;
        return !!cc.sys.isBrowser ||
            ConfigMgr.getInstance().getOne(VipListConfig).vipList.indexOf(MultiPlatform.getInstance().openId) >= 0;
    }
}
