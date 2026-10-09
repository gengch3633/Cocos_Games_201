const { ccclass } = cc._decorator;

@ccclass
export default class GmPageInGame extends cc.Component {
    GmPageInGame = null;
    node = null;
    main_content = null;
    level_success = null;
    Background = null;
    Label = null;
    close_btn = null;
    ad_switch_btn = null;
    ad_btn_label = null;
    attri_setting_aera = null;
    attri_setting_bg = null;
    use_attri_btn = null;
    recover_attri_btn = null;
    attri_power_editbox = null;
    BACKGROUND_SPRITE = null;
    TEXT_LABEL = null;
    PLACEHOLDER_LABEL = null;
    attri_spin_editbox = null;
    attri_aimming_editbox = null;

    static URL = "db://assets/resources/pages/GmPageInGame.prefab";

    onLoad() {
        this.GmPageInGame = this.node;
        this.main_content = this.GmPageInGame.getChildByName("main_content");
        this.level_success = this.main_content.getChildByName("level_success");
        this.Background = this.level_success.getChildByName("Background");
        this.Label = this.Background.getChildByName("Label");
        this.close_btn = this.main_content.getChildByName("close_btn");
        this.ad_switch_btn = this.main_content.getChildByName("ad_switch_btn");
        this.ad_btn_label = this.Background.getChildByName("ad_btn_label");
        this.attri_setting_aera = this.main_content.getChildByName("attri_setting_aera");
        this.attri_setting_bg = this.attri_setting_aera.getChildByName("attri_setting_bg");
        this.use_attri_btn = this.attri_setting_aera.getChildByName("use_attri_btn");
        this.recover_attri_btn = this.attri_setting_aera.getChildByName("recover_attri_btn");
        this.attri_power_editbox = this.attri_setting_aera.getChildByName("attri_power_editbox");
        this.BACKGROUND_SPRITE = this.attri_power_editbox.getChildByName("BACKGROUND_SPRITE");
        this.TEXT_LABEL = this.attri_power_editbox.getChildByName("TEXT_LABEL");
        this.PLACEHOLDER_LABEL = this.attri_power_editbox.getChildByName("PLACEHOLDER_LABEL");
        this.attri_spin_editbox = this.attri_setting_aera.getChildByName("attri_spin_editbox");
        this.attri_aimming_editbox = this.attri_setting_aera.getChildByName("attri_aimming_editbox");
    }
}
