const { ccclass } = cc._decorator;

@ccclass
export default class cue_list_item extends cc.Component {
    cue_list_item = null;

    node = null;

    cue_list_item_root = null;

    bg_2 = null;

    cue_icon = null;

    sp_border = null;

    lock_info_area = null;

    lock_info_bg = null;

    lock_info_lock = null;

    icon_qiugan_suipian = null;

    label_unlock = null;

    ad_info_area = null;

    pb_4_2 = null;

    label_ad_get = null;

    use_info_area = null;

    pb_cue_item_use = null;

    static URL = "db://assets/prefabs/cue_list_item.prefab";

    onLoad() {
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
