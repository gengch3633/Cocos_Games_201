import ConfigMgr from "./ConfigMgr";
import MultiPlatform from "./MultiPlatform";
import { VipListConfig } from "./ConfigDefine";

export default class Common {
    static version = "1.0.0";
    static GameModel = 0;

    static get isGM(): boolean {
        if (cc.sys.isBrowser) {
            return true;
        }
        const vipList = ConfigMgr.getInstance().getOne(VipListConfig)?.vipList || [];
        return vipList.indexOf(MultiPlatform.getInstance().openId) >= 0;
    }
}
