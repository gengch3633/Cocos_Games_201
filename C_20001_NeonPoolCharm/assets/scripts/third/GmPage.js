let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "b614b8AAq9GNpAoA70urlaI", "GmPage");
var n,
i = this&& this.__extends|| (n = function(e, t) {
  return(n = Object.setPrototypeOf|| {
    __proto__:[]
  }
  instanceof Array&& function(e, t) {
    e.__proto__ = t;
  }
|| function(e, t) {
    for(var o in t) Object.prototype.hasOwnProperty.call(t, o)&& (e[o] = t[o]);
  }
)(e, t);
}
, function(e, t) {
  n(e, t);
  function o() {
    this.constructor = e;
  }
  e.prototype = null === t? Object.create(t):(o.prototype = t.prototype, new o());
}
),
a = this&& this.__decorate|| function(e, t, o, n) {
  var i,
  a = arguments.length,
  r = a < 3? t: null === n? n = Object.getOwnPropertyDescriptor(t, o): n;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);
  else for(var l = e.length- 1;
  l >= 0;
  l--)(i = e[l])&& (r = (a < 3? i(r): a > 3? i(t, o, r): i(t, o))|| r);
  return a > 3&& r&& Object.defineProperty(t, o, r),
  r;
}
;
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var r = cc._decorator.ccclass,
l = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.GmPage = null;
    t.node = null;
    t.main_content = null;
    t.close_btn = null;
    t.Background = null;
    t.Label = null;
    t.level_select = null;
    t.bg2 = null;
    t.level_btn = null;
    t.Background1 = null;
    t.level_name_btn_label = null;
    t.level_config_btn = null;
    t.Background2 = null;
    t.level_config_btn_label = null;
    t.level_start_btn = null;
    t.Background3 = null;
    t.cur_level_info_bg = null;
    t.cur_level_info_label = null;
    t.bg_level_change = null;
    t.level_changed_eb = null;
    t.BACKGROUND_SPRITE = null;
    t.TEXT_LABEL = null;
    t.PLACEHOLDER_LABEL = null;
    t.changelevel_btn = null;
    t.bg_add_cash = null;
    t.add_cash = null;
    t.add_cash_btn = null;
    t.add_gold_btn = null;
    t.add_sign_in_count = null;
    t.add_zhendong = null;
    t.btn_choujiang = null;
    t.fps_60 = null;
    t.fps_90 = null;
    t.fps_auto = null;
    t.fps_show = null;
    t.fps_limit = null;
    t.add_club_shard = null;
    t.add_ad_switch = null;
    t.Background_ad_switch = null;
    t.Label_ad_switch = null;
    t.add_ad_sim_ret = null;
    t.Background_ad_sim = null;
    t.Label_ad_sim_ret = null;
    t.btn_switch_account = null;
    t.Background_switch_account = null;
    t.Label_switch_account = null;
    t.btn_clear_account = null;
    t.Background_clear_account = null;
    t.Label_clear_account = null;
    t.stage_list_root = null;
    t.level_config_list_item = null;
    t.level_config_label = null;
    t.level_name_list_item = null;
    t.level_name_label = null;
    t.level_name_scrollview = null;
    t.scrollBar = null;
    t.bar = null;
    t.view = null;
    t.level_name_content = null;
    t.stage_config_scrollview = null;
    t.view2 = null;
    t.level_config_content = null;
    t.language_area = null;
    t.lang_title = null;
    t.language_list_item = null;
    t.Background11 = null;
    t.language_li_label = null;
    t.cur_lan_bg = null;
    t.cur_lan_label = null;
    t.btn_language = null;
    t.Background_language = null;
    t.clear_lan_label = null;
    t.laguage_scrollview = null;
    t.scrollBar_ln = null;
    t.bar_ln = null;
    t.view_ln = null;
    t.language_content = null;
    t.in_game_area = null;
    t.level_success = null;
    t.attri_setting_aera = null;
    t.attri_setting_bg = null;
    t.use_attri_btn = null;
    t.recover_attri_btn = null;
    t.attri_power_editbox = null;
    t.attri_spin_editbox = null;
    t.attri_aimming_editbox = null;
    t.gan_move_setting_aera = null;
    t.gan_move_setting_bg = null;
    t.use_gan_move_btn = null;
    t.recover_gan_move_btn = null;
    t.gan_move_label1 = null;
    t.attri_gan_move_editbox = null;
    t.attri_gan_move_aimming_editbox = null;
    t.gan_move_label2 = null;
    t.gan_roll_editbox = null;
    t.gan_roll_aimming_editbox = null;
    t.use_gan_roll_move_btn = null;
    t.recover_gan_roll_move_btn = null;
    t.main_ui_area = null;
    t.obj_cpm = null;
    t.lab_cpm_name = null;
    t.lab_cpm = null;
    t.edit_btn = null;
    t.bg_ball_modify = null;
    t.set_ball_modify_angle = null;
    t.btn_set_ball_modify_angle = null;
    t.btn_switch_ball_modify = null;
    t.Background_ball_modify = null;
    t.ball_modify_state_Label = null;
    return t;
  }
  t.prototype.onLoad = function() {
    this.GmPage = this.node;
    this.main_content = this.GmPage.getChildByName("main_content");
    this.close_btn = this.main_content.getChildByName("close_btn");
    this.Background = this.close_btn.getChildByName("Background");
    this.Label = this.Background.getChildByName("Label");
    this.level_select = this.main_content.getChildByName("level_select");
    this.bg2 = this.level_select.getChildByName("bg2");
    this.level_btn = this.bg2.getChildByName("level_btn");
    this.Background1 = this.level_btn.getChildByName("Background1");
    this.level_name_btn_label = this.Background1.getChildByName("level_name_btn_label");
    this.level_config_btn = this.bg2.getChildByName("level_config_btn");
    this.Background2 = this.level_config_btn.getChildByName("Background2");
    this.level_config_btn_label = this.Background2.getChildByName("level_config_btn_label");
    this.level_start_btn = this.level_select.getChildByName("level_start_btn");
    this.Background3 = this.level_start_btn.getChildByName("Background3");
    this.cur_level_info_bg = this.level_select.getChildByName("cur_level_info_bg");
    this.cur_level_info_label = this.cur_level_info_bg.getChildByName("cur_level_info_label");
    this.bg_level_change = this.level_select.getChildByName("bg_level_change");
    this.level_changed_eb = this.bg_level_change.getChildByName("level_changed_eb");
    this.BACKGROUND_SPRITE = this.level_changed_eb.getChildByName("BACKGROUND_SPRITE");
    this.TEXT_LABEL = this.level_changed_eb.getChildByName("TEXT_LABEL");
    this.PLACEHOLDER_LABEL = this.level_changed_eb.getChildByName("PLACEHOLDER_LABEL");
    this.changelevel_btn = this.bg_level_change.getChildByName("changelevel_btn");
    this.bg_add_cash = this.level_select.getChildByName("bg_add_cash");
    this.add_cash = this.bg_add_cash.getChildByName("add_cash");
    this.add_cash_btn = this.bg_add_cash.getChildByName("add_cash_btn");
    this.add_gold_btn = this.bg_add_cash.getChildByName("add_gold_btn");
    this.add_sign_in_count = this.bg_add_cash.getChildByName("add_sign_in_count");
    this.add_zhendong = this.bg_add_cash.getChildByName("add_zhendong");
    this.btn_choujiang = this.bg_add_cash.getChildByName("btn_choujiang");
    this.fps_60 = this.bg_add_cash.getChildByName("fps_60");
    this.fps_90 = this.bg_add_cash.getChildByName("fps_90");
    this.fps_auto = this.bg_add_cash.getChildByName("fps_auto");
    this.fps_show = this.bg_add_cash.getChildByName("fps_show");
    this.fps_limit = this.bg_add_cash.getChildByName("fps_limit");
    this.add_club_shard = this.bg_add_cash.getChildByName("add_club_shard");
    this.add_ad_switch = this.main_content.getChildByName("add_ad_switch");
    this.Background_ad_switch = this.add_ad_switch.getChildByName("Background_ad_switch");
    this.Label_ad_switch = this.Background_ad_switch.getChildByName("Label_ad_switch");
    this.add_ad_sim_ret = this.main_content.getChildByName("add_ad_sim_ret");
    this.Background_ad_sim = this.add_ad_sim_ret.getChildByName("Background_ad_sim");
    this.Label_ad_sim_ret = this.Background_ad_sim.getChildByName("Label_ad_sim_ret");
    this.btn_switch_account = this.main_content.getChildByName("btn_switch_account");
    this.Background_switch_account = this.btn_switch_account.getChildByName("Background_switch_account");
    this.Label_switch_account = this.Background_switch_account.getChildByName("Label_switch_account");
    this.btn_clear_account = this.main_content.getChildByName("btn_clear_account");
    this.Background_clear_account = this.btn_clear_account.getChildByName("Background_clear_account");
    this.Label_clear_account = this.Background_clear_account.getChildByName("Label_clear_account");
    this.stage_list_root = this.main_content.getChildByName("stage_list_root");
    this.level_config_list_item = this.stage_list_root.getChildByName("level_config_list_item");
    this.level_config_label = this.Background.getChildByName("level_config_label");
    this.level_name_list_item = this.stage_list_root.getChildByName("level_name_list_item");
    this.level_name_label = this.Background1.getChildByName("level_name_label");
    this.level_name_scrollview = this.stage_list_root.getChildByName("level_name_scrollview");
    this.scrollBar = this.level_name_scrollview.getChildByName("scrollBar");
    this.bar = this.scrollBar.getChildByName("bar");
    this.view = this.level_name_scrollview.getChildByName("view");
    this.level_name_content = this.view.getChildByName("level_name_content");
    this.stage_config_scrollview = this.stage_list_root.getChildByName("stage_config_scrollview");
    this.view2 = this.stage_config_scrollview.getChildByName("view2");
    this.level_config_content = this.view2.getChildByName("level_config_content");
    this.language_area = this.main_content.getChildByName("language_area");
    this.lang_title = this.language_area.getChildByName("lang_title");
    this.language_list_item = this.language_area.getChildByName("language_list_item");
    this.Background11 = this.language_list_item.getChildByName("Background11");
    this.language_li_label = this.Background11.getChildByName("language_li_label");
    this.cur_lan_bg = this.language_area.getChildByName("cur_lan_bg");
    this.cur_lan_label = this.cur_lan_bg.getChildByName("cur_lan_label");
    this.btn_language = this.language_area.getChildByName("btn_language");
    this.Background_language = this.btn_language.getChildByName("Background_language");
    this.clear_lan_label = this.Background_language.getChildByName("clear_lan_label");
    this.laguage_scrollview = this.language_area.getChildByName("laguage_scrollview");
    this.scrollBar_ln = this.laguage_scrollview.getChildByName("scrollBar_ln");
    this.bar_ln = this.scrollBar_ln.getChildByName("bar_ln");
    this.view_ln = this.laguage_scrollview.getChildByName("view_ln");
    this.language_content = this.view_ln.getChildByName("language_content");
    this.in_game_area = this.main_content.getChildByName("in_game_area");
    this.level_success = this.in_game_area.getChildByName("level_success");
    this.attri_setting_aera = this.in_game_area.getChildByName("attri_setting_aera");
    this.attri_setting_bg = this.attri_setting_aera.getChildByName("attri_setting_bg");
    this.use_attri_btn = this.attri_setting_aera.getChildByName("use_attri_btn");
    this.recover_attri_btn = this.attri_setting_aera.getChildByName("recover_attri_btn");
    this.attri_power_editbox = this.attri_setting_aera.getChildByName("attri_power_editbox");
    this.attri_spin_editbox = this.attri_setting_aera.getChildByName("attri_spin_editbox");
    this.attri_aimming_editbox = this.attri_setting_aera.getChildByName("attri_aimming_editbox");
    this.gan_move_setting_aera = this.in_game_area.getChildByName("gan_move_setting_aera");
    this.gan_move_setting_bg = this.gan_move_setting_aera.getChildByName("gan_move_setting_bg");
    this.use_gan_move_btn = this.gan_move_setting_aera.getChildByName("use_gan_move_btn");
    this.recover_gan_move_btn = this.gan_move_setting_aera.getChildByName("recover_gan_move_btn");
    this.gan_move_label1 = this.gan_move_setting_aera.getChildByName("gan_move_label1");
    this.attri_gan_move_editbox = this.gan_move_setting_aera.getChildByName("attri_gan_move_editbox");
    this.attri_gan_move_aimming_editbox = this.gan_move_setting_aera.getChildByName("attri_gan_move_aimming_editbox");
    this.gan_move_label2 = this.gan_move_setting_aera.getChildByName("gan_move_label2");
    this.gan_roll_editbox = this.gan_move_setting_aera.getChildByName("gan_roll_editbox");
    this.gan_roll_aimming_editbox = this.gan_move_setting_aera.getChildByName("gan_roll_aimming_editbox");
    this.use_gan_roll_move_btn = this.gan_move_setting_aera.getChildByName("use_gan_roll_move_btn");
    this.recover_gan_roll_move_btn = this.gan_move_setting_aera.getChildByName("recover_gan_roll_move_btn");
    this.main_ui_area = this.main_content.getChildByName("main_ui_area");
    this.obj_cpm = this.main_content.getChildByName("obj_cpm");
    this.lab_cpm_name = this.obj_cpm.getChildByName("lab_cpm_name");
    this.lab_cpm = this.obj_cpm.getChildByName("lab_cpm");
    this.edit_btn = this.main_content.getChildByName("edit_btn");
    this.bg_ball_modify = this.main_content.getChildByName("bg_ball_modify");
    this.set_ball_modify_angle = this.bg_ball_modify.getChildByName("set_ball_modify_angle");
    this.btn_set_ball_modify_angle = this.bg_ball_modify.getChildByName("btn_set_ball_modify_angle");
    this.btn_switch_ball_modify = this.bg_ball_modify.getChildByName("btn_switch_ball_modify");
    this.Background_ball_modify = this.btn_switch_ball_modify.getChildByName("Background_ball_modify");
    this.ball_modify_state_Label = this.Background_ball_modify.getChildByName("ball_modify_state_Label");
  }
;
  t.URL = "db://assets/resources/pages/GmPage.prefab";
  return a([r], t);
}
(cc.Component);
o.default = l;
cc._RF.pop();
