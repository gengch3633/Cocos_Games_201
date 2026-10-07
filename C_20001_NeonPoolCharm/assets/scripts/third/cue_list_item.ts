const { ccclass } = cc._decorator;

@ccclass("cue_list_item")
export default class CueListItem extends cc.Component {
    static URL = "db://assets/prefabs/cue_list_item.prefab";

    cue_list_item: cc.Node = null;
    cue_list_item_root: cc.Node = null;
    bg_2: cc.Node = null;
    cue_icon: cc.Node = null;
    sp_border: cc.Node = null;
    lock_info_area: cc.Node = null;
    lock_info_bg: cc.Node = null;
    lock_info_lock: cc.Node = null;
    icon_qiugan_suipian: cc.Node = null;
    label_unlock: cc.Node = null;
    ad_info_area: cc.Node = null;
    pb_4_2: cc.Node = null;
    label_ad_get: cc.Node = null;
    use_info_area: cc.Node = null;
    pb_cue_item_use: cc.Node = null;

    onLoad(): void {
        this.cue_list_item = this.node;
        this.cue_list_item_root = this.cue_list_item.getChildByName("cue_list_item_root");
        this.bg_2 = this.cue_list_item_root.getChildByName("bg_2");
        this.cue_icon = this.cue_list_item_root.getChildByName("cue_icon");
        this.sp_border = this.cue_list_item_root.getChildByName("sp_border");
        this.lock_info_area = this.cue_list_item_root.getChildByName("lock_info_area");
        this.lock_info_bg = this.lock_info_area.getChildByName("lock_info_bg");
        this.lock_info_lock = this.lock_info_area.getChildByName("lock_info_lock");
        this.icon_qiugan_suipian = this.lock_info_area.getChildByName("icon_qiugan_suipian");
        this.label_unlock = this.lock_info_area.getChildByName("label_unlock");
        this.ad_info_area = this.cue_list_item_root.getChildByName("ad_info_area");
        this.pb_4_2 = this.ad_info_area.getChildByName("pb_4_2");
        this.label_ad_get = this.ad_info_area.getChildByName("label_ad_get");
        this.use_info_area = this.cue_list_item_root.getChildByName("use_info_area");
        this.pb_cue_item_use = this.use_info_area.getChildByName("pb_cue_item_use");
    }
}
