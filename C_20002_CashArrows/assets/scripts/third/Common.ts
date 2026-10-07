import ConfigMgr from "./ConfigMgr";
import { VipListConfig } from "./ConfigDefine";
import MultiPlatform from "./MultiPlatform";

export default class Common {
    static version = "1.0.0";
    static GameModel = 0;

    static get isGM(): boolean {
        return !!cc.sys.isBrowser ||
            ConfigMgr.getInstance().getOne(VipListConfig).vipList.indexOf(MultiPlatform.getInstance().openId) >= 0;
    }
}
