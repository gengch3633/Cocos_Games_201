import ConfigMgr from "./ConfigMgr";
import MultiPlatform from "./MultiPlatform";
import { VipListConfig } from "./ConfigDefine";

export default class Common {
    static get isGM() {
        return !!cc.sys.isBrowser || ConfigMgr.getInstance().getOne(VipListConfig).vipList.indexOf(MultiPlatform.getInstance().openId) >= 0;
    }

    static version = " 1.0.0 ";
    static GameModel = 0;
}
