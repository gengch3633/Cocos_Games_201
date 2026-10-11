import { VipListConfig } from "./ConfigDefine";
import ConfigMgr from "./ConfigMgr";
import MultiPlatform from "./MultiPlatform";

export default class Common {
    public static version: string = "1.0.0";
    public static GameModel: number = 0;

    public static get isGM(): boolean {
        return (
            !!cc.sys.isBrowser ||
            ConfigMgr.getInstance()
                .getOne(VipListConfig)
                .vipList.indexOf(MultiPlatform.getInstance().openId) >= 0
        );
    }
}