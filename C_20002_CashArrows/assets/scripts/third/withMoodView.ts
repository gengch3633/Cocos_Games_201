import BarrageDataService from "./BarrageDataService";
import cashArrowCheckView from "./cashArrowCheckView";
import cashArrowSetView from "./cashArrowSetView";
import CountryAssetService from "./CountryAssetService";
import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import { gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";
import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";
import NetErrorPopupService from "./NetErrorPopupService";
import NewbieGuideFlow from "./NewbieGuideFlow";
import PlayerDataStore from "./PlayerDataStore";
import ResMgr from "./ResMgr";
import Tips from "./Tips";
import UIDefine from "./UIDefine";
import UIMgr from "./UIMgr";
import UserData from "./UserData";
import UserInfoService from "./UserInfoService";

const WithMoodView = cc.Class({
  extends: cc.Component, properties: {
  }
, onLoad: function() {
    this.options = [];
    this.selectedIndex = 0;
    this.userLevel = Number(UserData.getInstance().user_level|| 0);
    this.userBalance = 0;
    this.isForbidPai = ! 1;
    this.barrageList = [];
    this.barragePlayIndex = 0;
    this.barrageDuration = 7;
    this.barrageMoveSpeed = 180;
    this.barrageSpacing = 14;
    this.barrageOffscreenPadding = 140;
    this.barrageTween = null;
    this.barrageFontSize = 30;
    this.barrageLineHeight = 34;
    this.barrageArrowNames = ["with_arrow_1", "with_arrow_2", "with_arrow_3", "with_arrow_4"];
    this.barrageIconImageName = "";
    this.barrageIconReqVersion = 0;
    this.lastBarrageArrowIndex = - 1;
    this.barrageNormalColor = "#E7E7E7";
    this.barrageHighlightColor = "#E71A4C";
    this.barrageItemTemplateWidth = 0;
    this.localizedImageReqVersionMap = {
    }
;
    this.optionBgNormalSprite = null;
    this.optionBgSelectedSprite = null;
    this.optionLayoutBaseX = - 240;
    this.optionLayoutBaseY = 0;
    this.optionLayoutStepX = 240;
    this.optionLayoutStepY = - 180;
    this.isWithdrawSubmitting = ! 1;
    this._lastClickTime = 0;
    this._bypassClickThrottle = ! 1;
    this._withdrawInfoLoaded = ! 1;
    this.newbieGuidePulseNode = null;
    this.newbieGuidePulseScale = 1;
    this.newbieGuideToastStep = 0;
    this._guideStep5Pending = ! 1;
    this.guideStep4TipNode = null;
    this.guideStep5TipNode = null;
    this.guideStep6TipNode = null;
    this.guideStep4Overlay = null;
    this.guideStep4Mask = null;
    this.guideStep5Overlay = null;
    this.guideStep5Mask = null;
    this.guideStep6Overlay = null;
    this.guideStep6Mask = null;
    this.lblGuideStep4Tip = null;
    this.lblGuideStep5Tip = null;
    this.lblGuideStep6Tip = null;
    this.getNewbieGuideFlow().bootstrap();
    this.bindNodes();
    this.i18nGroup = this.node.getComponent("I18nGroup");
    this.bindEvents();
    this.bindLanguageEvent();
    this.loadWithdrawInfo();
    this.loadBarrageList();
    this.loadOptionBgSpriteFrames();
    this.refreshLocalizedImageI18n();
    this.refreshAll();
  }
, onDestroy: function() {
    this._guideStep5Pending = ! 1;
    this.stopBarragePlayer();
    this.stopNewbieGuidePulse();
    this.hideAllNewbieGuideOverlays();
    this.unbindLanguageEvent();
    this.unbindEvents();
    GlobalEventMgr.getInstance().emit(gameEvent.closeSet);
  }
, bindLanguageEvent: function() {
    GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this.onLanguageChanged, this);
  }
, unbindLanguageEvent: function() {
    GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this.onLanguageChanged, this);
  }
, onLanguageChanged: function() {
    this.i18nGroup&& this.i18nGroup.refreshChildren&& this.i18nGroup.refreshChildren();
    this.refreshAll();
    this.refreshLocalizedImageI18n();
    this.refreshBarrageIconByCountry();
    this.playNextBarrage();
  }
, setEntryData: function(e) {
    if(e) {
      void 0 !== e.cash_balance&& (this.userBalance = e.cash_balance);
      if(void 0 !== e.user_level) {
        this.userLevel = Number(e.user_level);
        UserData.getInstance().user_level = e.user_level;
      }
      this.refreshAll();
    }
  }
, bindNodes: function() {
    this.btnBack = this.findNode("btn_back");
    this.btnHistory = this.findNode("btn_history");
    this.btnWithdraw = this.findNode("btn_withdraw");
    this.lblPageTitle = this.findLabel("title");
    this.lblHistory = this.btnHistory? this.btnHistory.getComponent(cc.Label): null;
    this.lblBalanceTitle = this.findLabel("lbl_balance_title");
    this.lblExplainTitle = this.findLabel("lbl_explain_title");
    this.lblLv = this.findLabel("lbl_lv");
    this.lblBalance = this.findLabel("lbl_balance");
    this.barrageTextNode = this.findNode("lbl_barrage");
    this.lblBarrage = this.ensureBarrageRichText(this.barrageTextNode);
    this.barrageTrack = this.findNode("barrage_track");
    this.barrageItem = this.findNode("barrage_item");
    this.iconBarrage = this.findNode("icon_barrage");
    this.barrageItemTemplateWidth = this.barrageItem&& this.barrageItem.width|| 0;
    this.lblOptionsTitle = this.findLabel("lbl_options_title");
    this.lblCondition1 = this.findLabel("lbl_condition1");
    this.lblCondition2 = this.findLabel("lbl_condition2");
    this.lblBottomCondition = this.findLabel("lbl_bottom_condition");
    this.lblWithdrawBtn = this.findLabel("lbl_withdraw");
    this.progressBg = this.findNode("progress_bg");
    this.progressFill = this.findNode("progress_fill");
    this.progressRightDecor = this.findNode("progress_right_decor");
    this.applyProgressHorizontalPadding();
    this.scrollViewNode = this.findNode("scroll_view");
    this.scrollView = this.scrollViewNode? this.scrollViewNode.getComponent(cc.ScrollView): null;
    this.scrollViewView = this.findNode("view");
    this.scrollContent = this.findNode("content");
    this.optionsRoot = this.findNode("options_root");
    this.optionTemplateSelected = this.findNode("tpl_option_selected");
    this.optionTemplateNormal = this.findNode("tpl_option_normal");
    this.prepareOptionTemplates();
    this.optionButtons = this.collectExistingOptionItems();
    this.captureOptionLayoutRule();
    this.guideStep4TipNode = this.findNode("guide_step4_tip");
    this.guideStep5TipNode = this.findNode("guide_step5_tip");
    this.guideStep6TipNode = this.findNode("guide_step6_tip");
    this.guideStep4Overlay = this.findNode("guide_step4_overlay");
    this.guideStep4Mask = this.findNode("guide_step4_mask");
    this.guideStep5Overlay = this.findNode("guide_step5_overlay");
    this.guideStep5Mask = this.findNode("guide_step5_mask");
    this.guideStep6Overlay = this.findNode("guide_step6_overlay");
    this.guideStep6Mask = this.findNode("guide_step6_mask");
    this.lblGuideStep4Tip = this.guideStep4TipNode? this.guideStep4TipNode.getComponent(cc.Label): null;
    this.lblGuideStep5Tip = this.guideStep5TipNode? this.guideStep5TipNode.getComponent(cc.Label): null;
    this.lblGuideStep6Tip = this.guideStep6TipNode? this.guideStep6TipNode.getComponent(cc.Label): null;
    this.hideAllNewbieGuideTipNodes();
    this.hideAllNewbieGuideOverlays();
  }
, ensureBarrageRichText: function(e) {
    if(! e) return null;
    var t = e.getComponent(cc.Label);
    t|| (t = e.addComponent(cc.Label));
    return t;
  }
, bindEvents: function() {
    this.btnBack&& this.btnBack.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    this.btnHistory&& this.btnHistory.on(cc.Node.EventType.TOUCH_END, this.onClickHistory, this);
    this.btnWithdraw&& this.btnWithdraw.on(cc.Node.EventType.TOUCH_END, this.onClickWithdraw, this);
  }
, unbindEvents: function() {
    this.btnBack&& this.btnBack.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    this.btnHistory&& this.btnHistory.off(cc.Node.EventType.TOUCH_END, this.onClickHistory, this);
    this.btnWithdraw&& this.btnWithdraw.off(cc.Node.EventType.TOUCH_END, this.onClickWithdraw, this);
    this.clearOptionItems();
  }
, clearOptionItems: function() {
    for(var e = 0;
    e < this.optionButtons.length;
    e++) {
      var t = this.optionButtons[e];
      t.node&& t.node.off(cc.Node.EventType.TOUCH_END, this.onClickOption, this);
    }
  }
, prepareOptionTemplates: function() {
    this.optionTemplateSelected&& (this.optionTemplateSelected.active = ! 1);
    this.optionTemplateNormal&& (this.optionTemplateNormal.active = ! 1);
  }
, hasOptionTemplates: function() {
    return !(! this.optionTemplateSelected&& ! this.optionTemplateNormal);
  }
, collectExistingOptionItems: function() {
    if(! this.optionsRoot) return[];
    for(var e = [], t = 0;
    t < this.optionsRoot.childrenCount;
    t++) {
      var i = this.optionsRoot.children[t];
      if(i&& 0 === i.name.indexOf("option_")) {
        var n = this.buildOptionItemRef(i, e.length);
        e.push(n);
      }
    }
    e.sort(function(e, t) {
      return(e.index|| 0)-(t.index|| 0);
    }
);
    for(var a = 0;
    a < e.length;
    a++) e[a].node._optionIndex = a;
    return e;
  }
, buildOptionItemRef: function(e, t) {
    var i = e.getComponent(cc.Sprite), n = e.getComponent(cc.Label);
    n|| (n = this.findLabelInNode(e));
    var a = {
      index: this.getOptionNodeIndex(e, t), node: e, bg: i, amount: n, countdownNode: e.getChildByName("countdown"), countdown: null, checkNode: e.getChildByName("check")
    }
;
    a.countdownNode&& (a.countdown = a.countdownNode.getComponent(cc.Label));
    e._optionIndex = t;
    e.off(cc.Node.EventType.TOUCH_END, this.onClickOption, this);
    e.on(cc.Node.EventType.TOUCH_END, this.onClickOption, this);
    return a;
  }
, getOptionNodeIndex: function(e, t) {
    if(! e|| ! e.name) return t|| 0;
    var i = e.name.match(/ ^ option_(\ d+) $/);
    if(! i) return t|| 0;
    var n = parseInt(i[1], 10);
    return isNaN(n)? t|| 0: n;
  }
, findLabelInNode: function(e) {
    if(! e) return null;
    var t = e.getComponent(cc.Label);
    if(t) return t;
    for(var i = 0;
    i < e.childrenCount;
    i++) if(t = this.findLabelInNode(e.children[i])) return t;
    return null;
  }
, captureOptionLayoutRule: function() {
    if(this.hasOptionTemplates()&& this.optionTemplateSelected) {
      this.optionLayoutBaseX = this.optionTemplateSelected.x;
      this.optionLayoutBaseY = this.optionTemplateSelected.y;
      this.optionLayoutStepX = this.optionTemplateNormal? this.optionTemplateNormal.x- this.optionTemplateSelected.x: 224.5;
      Math.abs(this.optionLayoutStepX) < 1&& (this.optionLayoutStepX = 224.5);
      this.optionLayoutStepY = - 146;
    } else if(this.optionButtons&& !(this.optionButtons.length <= 0)) {
      this.optionLayoutBaseX = this.optionButtons[0].node.x;
      this.optionLayoutBaseY = this.optionButtons[0].node.y;
      this.optionButtons.length > 1&& (this.optionLayoutStepX = this.optionButtons[1].node.x- this.optionButtons[0].node.x);
      this.optionButtons.length > 3&& (this.optionLayoutStepY = this.optionButtons[3].node.y- this.optionButtons[0].node.y);
    }
  }
, getOptionPosition: function(e) {
    var t = e% 3, i = Math.floor(e/ 3);
    return cc.v2(this.optionLayoutBaseX+ t* this.optionLayoutStepX, this.optionLayoutBaseY+ i* this.optionLayoutStepY);
  }
, ensureOptionItemsForCount: function(e) {
    if(this.optionsRoot) if(this.hasOptionTemplates()) {
      for(var t = this.optionTemplateNormal|| this.optionTemplateSelected, i = 0;
      t&& this.optionButtons.length < e;
) {
        var n = this.optionButtons.length, a = cc.instantiate(t);
        a.name = "option_"+ n;
        a.active = ! 0;
        this.optionsRoot.addChild(a);
        var o = this.getOptionPosition(n);
        a.setPosition(o.x, o.y);
        this.optionButtons.push(this.buildOptionItemRef(a, n));
        i+= 1;
      }
      i > 0&& this.refreshMoneyArrowIconSprites();
    } else e <= this.optionButtons.length|| cc.warn("[withMoodView] option count exceeds prefab nodes, extra items will be ignored");
  }
, relayoutOptionItems: function() {
    for(var e = 0;
    e < this.optionButtons.length;
    e++) {
      var t = this.optionButtons[e];
      t.node._optionIndex = e;
      t.node.name = "option_"+ e;
      if(this.hasOptionTemplates()) {
        var i = this.getOptionPosition(e);
        t.node.setPosition(i.x, i.y);
      }
    }
  }
, applyOptionVisualByTemplate: function(e, t) {
    if(e&& e.node) {
      var i = t? this.optionTemplateSelected: this.optionTemplateNormal;
      if(i) {
        if(e.bg) {
          var n = i.getComponent(cc.Sprite);
          if(n) {
            e.bg.spriteFrame = n.spriteFrame;
            e.bg.type = n.type;
            e.bg.sizeMode = n.sizeMode;
            e.bg.node.color = n.node.color;
          }
        }
        if(e.amount) {
          var a = this.findLabelInNode(i);
          if(a) {
            e.amount.fontSize = a.fontSize;
            e.amount.lineHeight = a.lineHeight;
            e.amount.node.color = a.node.color;
            var o = a.getComponent(cc.LabelOutline), r = e.amount.getComponent(cc.LabelOutline);
            if(o) {
              r|| (r = e.amount.node.addComponent(cc.LabelOutline));
              r.enabled = o.enabled;
              r.color = o.color;
              r.width = o.width;
            } else r&& (r.enabled = ! 1);
          }
        }
        if(e.checkNode) {
          var s = i.getChildByName("check");
          e.checkNode.active = !(! s|| ! s.active);
        }
      }
    }
  }
, loadOptionBgSpriteFrames: function() {
    this.optionBgNormalSprite = null;
    this.optionBgSelectedSprite = null;
  }
, loadWithdrawInfo: function() {
    var e = this;
    this.options = [];
    this.selectedIndex = 0;
    var t = NetErrorPopupService, i = function() {
      e.loadWithdrawInfo();
    }
;
    LoadingHttpService.getWithdrawInfo(Handler.create(e, function(n) {
      if(t&& t.shouldPop(n)) {
        cc.warn("[withMoodView] WithdrawInfo force-retry code=", n&& n.code);
        t.showAndRetry(i);
      } else if(n&& 1 === n.code&& n.data) {
        var a = n.data;
        void 0 !== a.cash_balance&& (e.userBalance = a.cash_balance);
        if(void 0 !== a.user_level) {
          e.userLevel = Number(a.user_level);
          UserData.getInstance().user_level = a.user_level;
        } else void 0 !== a.game_level&& (e.userLevel = a.game_level);
        var o = a.info|| [];
        e.options = [];
        for(var r = 0;
        r < o.length;
        r++) {
          var s = o[r], l = {
          }
;
          for(var c in s) s.hasOwnProperty(c)&& (l[c] = s[c]);
          void 0 !== l.status&& (l.status = parseInt(l.status, 10)|| 0);
          e.options.push(l);
        }
        e.selectedIndex = 0;
        e._withdrawInfoLoaded = ! 0;
        e.refreshAll();
      } else cc.warn("[withMoodView] WithdrawInfo failed:", n&& n.message);
    }
), Handler.create(e, function(e) {
      if(t&& t.shouldPop(e)) {
        cc.warn("[withMoodView] WithdrawInfo 网络异常，弹重试窗 err=", e&& e.message);
        t.showAndRetry(i);
      } else cc.warn("[withMoodView] WithdrawInfo error:", e&& e.message);
    }
));
  }
, loadBarrageList: function() {
    s.ensureStarted();
    this.playNextBarrage();
  }
, stopBarragePlayer: function() {
    this.barrageTween&& this.barrageTween.stop();
    this.barrageTween = null;
    if(this._barrageRetryTimer) {
      clearTimeout(this._barrageRetryTimer);
      this._barrageRetryTimer = null;
    }
  }
, playNextBarrage: function() {
    var e = this;
    if(this.barrageTrack&& this.barrageItem&& this.lblBarrage) {
      this.stopBarragePlayer();
      this.refreshRandomBarrageIcon();
      var t = s.takeOne();
      if(t) {
        this.lblBarrage.string = this.getBarrageRichText(t);
        var i = this.barrageItemTemplateWidth|| this.barrageItem.width|| 0, n = this.barrageTrack.convertToNodeSpaceAR(cc.v2(cc.winSize.width, cc.winSize.height/ 2)), a = this.barrageTrack.convertToNodeSpaceAR(cc.v2(0, cc.winSize.height/ 2)), o = n.x+ i/ 2, r = a.x- i/ 2, l = Math.abs(o- r)/ Math.max(1, this.barrageMoveSpeed|| 150);
        this.barrageItem.stopAllActions();
        this.barrageItem.x = o;
        var c = this.barrageItem.y, u = cc.moveTo(l, r, c), d = cc.callFunc(function() {
          e.playNextBarrage();
        }
);
        this.barrageTween = cc.sequence(u, d);
        this.barrageItem.runAction(this.barrageTween);
      } else {
        this.lblBarrage.string = this.i18n("key_common_barrage_empty");
        this._barrageRetryTimer = setTimeout(function() {
          e._barrageRetryTimer = null;
          e.playNextBarrage();
        }
, 500);
      }
    }
  }
, updateBarrageItemLayout: function() {
    if(this.barrageItem&& this.lblBarrage&& this.iconBarrage) {
      var e = this.iconBarrage.width|| 0, t = this.lblBarrage.node.width|| 0, i = e+ this.barrageSpacing+ t;
      this.barrageItem.width = i;
      this.iconBarrage.x = - i/ 2+ e/ 2;
      this.lblBarrage.node.x = this.iconBarrage.x+ e/ 2+ this.barrageSpacing+ t/ 2;
    }
  }
, getBarrageRichText: function(e) {
    if(! e) return this.i18n("key_common_barrage_empty");
    var t = e.name|| this.i18n("key_common_user_default"), i = void 0 !== e.amount? this.getCurrencyText(e.amount): "";
    return ! i&& e.text? e.text: this.i18n("key_barrage_success_plain", [t, i]);
  }
, getBarrageItemWidth: function() {
    if(! this.barrageItem) return 0;
    var e = this.barrageItem.width|| 0;
    e <= 0&& this.lblBarrage&& (e = this.lblBarrage.node.width);
    return Math.max(e, 0);
  }
, refreshLocalizedImageI18n: function() {
    this.refreshWithProgressDecorSprite();
    this.refreshMoneyArrowIconSprites();
  }
, refreshWithProgressDecorSprite: function() {
    this.loadLocalizedImageToNodes("with_progress", [this.progressRightDecor], "with_progress_decor");
  }
, refreshMoneyArrowIconSprites: function() {
    this.loadLocalizedImageToNodes("money_arrow_icon", this.collectMoneyArrowIconNodes(), "money_arrow_icon_nodes");
  }
, collectMoneyArrowIconNodes: function() {
    var e = [], t = function(t) {
! t|| ! t.isValid|| e.indexOf(t) >= 0|| e.push(t);
    }
;
    this.optionTemplateSelected&& t(this.optionTemplateSelected.getChildByName("icon"));
    this.optionTemplateNormal&& t(this.optionTemplateNormal.getChildByName("icon"));
    for(var i = 0;
    i < this.optionButtons.length;
    i++) {
      var n = this.optionButtons[i];
      n&& n.node&& t(n.node.getChildByName("icon"));
    }
    return e;
  }
, loadLocalizedImageToNodes: function(e, t, i) {
    if(e&& t&& !(t.length <= 0)) {
      for(var n = [], a = 0;
      a < t.length;
      a++) {
        var o = t[a];
        if(o&& o.isValid) {
          var r = o.getComponent(cc.Sprite);
          r&& n.push(r);
        }
      }
      n.length <= 0|| this.loadLocalizedSpriteFrame(e, i|| e, function(e) {
        if(e) for(var t = 0;
        t < n.length;
        t++) {
          var i = n[t];
          i&& i.isValid&& (i.spriteFrame = e);
        }
      }
);
    }
  }
, loadLocalizedSpriteFrame: function(e, t, i) {
    if(e&& "function" == typeof i) {
      this.localizedImageReqVersionMap|| (this.localizedImageReqVersionMap = {
      }
);
      var n = t|| e, a = (this.localizedImageReqVersionMap[n]|| 0)+ 1;
      this.localizedImageReqVersionMap[n] = a;
      var o = this, s = c.getPathByImageName(e), l = c.getPathByImageName(e, "ID"), u = function(e) {
        a === o.localizedImageReqVersionMap[n]&& i(e|| null);
      }
;
      ResMgr.getInstance().loadRes(s, cc.SpriteFrame, this, "game").then(function(t) {
        if(t) u(t);
        else if(l&& l !== s) ResMgr.getInstance().loadRes(l, cc.SpriteFrame, o, "game").then(function(t) {
          t|| cc.warn("[withMoodView] load localized image fallback failed:", e, l);
          u(t|| null);
        }
);
        else {
          cc.warn("[withMoodView] load localized image failed:", e, s);
          u(null);
        }
      }
);
    }
  }
, refreshRandomBarrageIcon: function() {
    var e = this.pickRandomBarrageArrowName();
    e&& this.loadBarrageIconByImageName(e);
  }
, refreshBarrageIconByCountry: function() {
    this.barrageIconImageName&& this.loadBarrageIconByImageName(this.barrageIconImageName);
  }
, pickRandomBarrageArrowName: function() {
    if(! this.barrageArrowNames|| this.barrageArrowNames.length <= 0) return "";
    var e = this.barrageArrowNames.length, t = Math.floor(Math.random()* e);
    e > 1&& t === this.lastBarrageArrowIndex&& (t = (t+ 1+ Math.floor(Math.random()*(e- 1)))% e);
    this.lastBarrageArrowIndex = t;
    return this.barrageArrowNames[t];
  }
, loadBarrageIconByImageName: function(e) {
    if(this.iconBarrage&& e) {
      var t = this.iconBarrage.getComponent(cc.Sprite);
      if(t) {
        var i = this;
        this.barrageIconImageName = e;
        var n = ++ this.barrageIconReqVersion, a = c.getPathByImageName(e), o = c.getPathByImageName(e, "ID"), s = function(e) {
          n === i.barrageIconReqVersion&& i.iconBarrage&& i.iconBarrage.isValid&& e&& (t.spriteFrame = e);
        }
;
        ResMgr.getInstance().loadRes(a, cc.SpriteFrame, this, "game").then(function(e) {
          e? s(e): o&& o !== a? ResMgr.getInstance().loadRes(o, cc.SpriteFrame, i, "game").then(function(e) {
            e? s(e): cc.warn("[withMoodView] load barrage icon fallback failed:", o);
          }
): cc.warn("[withMoodView] load barrage icon failed:", a);
        }
);
      }
    }
  }
, refreshAll: function() {
    this.setLabelI18n(this.lblPageTitle, "key_withdraw_page_title");
    this.setLabelI18n(this.lblHistory, "key_withdraw_history");
    this.setLabelI18n(this.lblBalanceTitle, "key_withdraw_balance_title");
    this.setLabelI18n(this.lblOptionsTitle, "key_withdraw_options_title");
    this.setLabelI18n(this.lblExplainTitle, "key_withdraw_explain_title");
    if(this.lblLv) {
      var e = Number(UserData.getInstance().user_level|| 0);
      e > 0&& (this.userLevel = e);
      this.lblLv.string = this.i18n("key_common_lv_prefix")+(null != this.userLevel? this.userLevel: 0);
    }
    this.lblBalance&& (this.lblBalance.string = this.getCurrencyText(this.userBalance));
    this.refreshOptions();
    this.refreshConditions();
    this.refreshWithdrawBtn();
    this.applyProgressHorizontalPadding();
    this.refreshNewbieGuide();
  }
, applyProgressHorizontalPadding: function() {
    if(this.progressBg&& this.progressBg.parent) {
      var e = this.progressBg.parent.width|| 0, t = Math.max(0, e- 80);
      this.progressBg.width = t;
      this.progressBg.x = 0;
      if(this.progressFill) {
        var i = Math.max(1, this._progressMaxValue|| 1), n = Math.max(0, Math.min(1, (this._progressValue|| 0)/ i));
        this.progressFill.width = this.progressBg.width* n;
        this.progressFill.anchorX = 0;
        this.progressFill.x = this.progressBg.x- this.progressBg.width/ 2;
        this.progressFill.y = this.progressBg.y;
      }
    }
  }
, refreshOptions: function() {
    this.ensureOptionItemsForCount(this.options.length);
    this.relayoutOptionItems();
    for(var e = 0;
    e < this.optionButtons.length;
    e++) {
      var t = this.optionButtons[e], i = this.options[e];
      if(i) {
        t.node.active = ! 0;
        t.amount.string = this.getCurrencyText(i.money);
        var n = e === this.selectedIndex;
        t.node.color = cc.Color.WHITE;
        this.applyOptionVisualByTemplate(t, n);
        if(! this.hasOptionTemplates()) {
          if(t.bg) {
            n&& this.optionBgSelectedSprite? t.bg.spriteFrame = this.optionBgSelectedSprite: this.optionBgNormalSprite&& (t.bg.spriteFrame = this.optionBgNormalSprite);
            t.bg.node.color = cc.Color.WHITE;
          }
          t.amount&& (t.amount.node.color = n? new cc.Color(255, 201, 53): cc.Color.WHITE);
          t.checkNode&& (t.checkNode.active = n);
        }
        t.countdownNode&& (t.countdownNode.active = ! ! i.cpm_flag);
        i.cpm_flag? t.countdown&& (t.countdown.string = (i._remaining|| i.cpm_countdown|| 0)+ "s"): t.countdown&& (t.countdown.string = "");
      } else t.node.active = ! 1;
    }
    this.guideStep4Overlay&& this.guideStep4Overlay.active&& this.updateStep4GuideMask();
  }
, refreshConditions: function() {
    var e = this.options[this.selectedIndex];
    if(e) {
      var t = this.getCurrencyText(e.money);
      this.setLabelI18n(this.lblCondition1, "key_withdraw_cond_platform_amount", [t]);
      this.setLabelText(this.lblCondition2, "");
      this.setLabelText(this.lblBottomCondition, "");
      if(4 !== e.status) if(0 !== e.status) if(1 !== e.status) if(2 !== e.status) {
        if(3 === e.status) {
          this.setLabelI18n(this.lblBottomCondition, "key_withdraw_cond_need_level", [e.level_limit|| 0, t]);
          this.setProgress(e.level|| 0, e.level_limit|| 1);
        }
      } else {
        var i = Math.max(0, (e.sign_in_limit|| 0)-(e.sign_in|| 0));
        this.setLabelI18n(this.lblBottomCondition, "key_withdraw_cond_need_days", [i, t]);
        this.setProgress(e.sign_in|| 0, e.sign_in_limit|| 1);
      } else {
        var n = e.current_extract_levels_passed_count|| 0, a = Math.max(0, (e.levels_passed_limit|| 0)- n);
        this.setLabelI18n(this.lblCondition2, "key_withdraw_cond_play_tip");
        this.setLabelI18n(this.lblBottomCondition, "key_withdraw_cond_need_episode", [a, t]);
        this.setProgress(n, e.levels_passed_limit|| 1);
      } else {
        var o = Math.max(0, e.money- this.userBalance);
        if(o <= 0) {
          this.setLabelI18n(this.lblBottomCondition, "key_withdraw_cond_ready");
          this.setProgress(1, 1);
        } else {
          this.setLabelI18n(this.lblBottomCondition, "key_withdraw_cond_need_gap", [t, this.getCurrencyText(o)]);
          this.setProgress(this.userBalance, e.money);
        }
      } else {
        this.setLabelI18n(this.lblCondition1, "key_withdraw_cond_ready");
        this.setProgress(1, 1);
      }
    } else {
      this.setLabelI18n(this.lblCondition1, "key_withdraw_cond_none");
      this.setLabelText(this.lblCondition2, "");
      this.setLabelText(this.lblBottomCondition, "");
      this.setProgress(0, 1);
    }
  }
, refreshWithdrawBtn: function() {
    var e = this.options[this.selectedIndex];
    this.setLabelI18n(this.lblWithdrawBtn, "key_withdraw_btn", [this.getCurrencyText(e? e.money: 0)]);
  }
, setProgress: function(e, t) {
    if(this.progressFill&& this.progressBg) {
      this._progressValue = e;
      this._progressMaxValue = t;
      var i = Math.max(1, t), n = Math.max(0, Math.min(1, e/ i));
      this.progressFill.width = this.progressBg.width* n;
      this.progressFill.anchorX = 0;
      this.progressFill.x = this.progressBg.x- this.progressBg.width/ 2;
      this.progressFill.y = this.progressBg.y;
    }
  }
, getNewbieGuideFlow: function() {
    return NewbieGuideFlow;
  }
, getNewbieGuideStep: function() {
    var e = this.getNewbieGuideFlow();
    return e&& "function" == typeof e.getStep? Number(e.getStep()|| 0): 0;
  }
, isNewbieGuideStep: function(e) {
    return this.getNewbieGuideStep() === Number(e|| 0);
  }
, advanceNewbieGuideStep: function(e) {
    var t = this.getNewbieGuideFlow();
    return !(! t|| "function" != typeof t.advanceIfCurrent|| ! t.advanceIfCurrent(e));
  }
, stopNewbieGuidePulse: function() {
    if(this.newbieGuidePulseNode&& this.newbieGuidePulseNode.isValid) {
      cc.Tween.stopAllByTarget(this.newbieGuidePulseNode);
      this.newbieGuidePulseNode.scale = this.newbieGuidePulseScale|| 1;
      this.newbieGuidePulseNode = null;
      this.newbieGuidePulseScale = 1;
    } else this.newbieGuidePulseNode = null;
  }
, startNewbieGuidePulse: function(e) {
    if(e&& e.isValid) {
      if(this.newbieGuidePulseNode !== e) {
        this.stopNewbieGuidePulse();
        this.newbieGuidePulseNode = e;
        this.newbieGuidePulseScale = Number(e.scale|| 1);
        var t = 1.08* this.newbieGuidePulseScale;
        cc.tween(e).to(.3, {
          scale: t
        }
).to(.3, {
          scale: this.newbieGuidePulseScale
        }
).union().repeatForever().start();
      }
    } else this.stopNewbieGuidePulse();
  }
, hideAllNewbieGuideTipNodes: function() {
    this.guideStep4TipNode&& (this.guideStep4TipNode.active = ! 1);
    this.guideStep5TipNode&& (this.guideStep5TipNode.active = ! 1);
    this.guideStep6TipNode&& (this.guideStep6TipNode.active = ! 1);
  }
, resolveStep4GuideTargetNode: function() {
    var e = this.optionButtons&& this.optionButtons[0]&& this.optionButtons[0].node;
    if(e&& e.isValid&& e.activeInHierarchy) return e;
    for(var t = 0;
    t < this.optionButtons.length;
    t++) {
      var i = this.optionButtons[t]&& this.optionButtons[t].node;
      if(i&& i.isValid&& i.activeInHierarchy) return i;
    }
    return null;
  }
, updateStep4GuideMask: function() {
    if(this.guideStep4Overlay&& this.guideStep4Overlay.isValid&& this.guideStep4Mask&& this.guideStep4Mask.isValid) {
      var e = this.resolveStep4GuideTargetNode();
      if(e&& e.isValid&& e.parent&& e.parent.isValid) {
        var t = e.parent.convertToWorldSpaceAR(cc.v2(e.x, e.y)), i = this.guideStep4Overlay.convertToNodeSpaceAR(t);
        this.guideStep4Mask.x = i.x;
        this.guideStep4Mask.y = i.y;
        this.guideStep4Mask.width = Math.max(180, Number(e.width|| 0)+ 28);
        this.guideStep4Mask.height = Math.max(90, Number(e.height|| 0)+ 24);
      }
    }
  }
, setStep4GuideOverlayActive: function(e) {
    if(this.guideStep4Overlay&& this.guideStep4Overlay.isValid) {
      e&& this.updateStep4GuideMask();
      this.guideStep4Overlay.active = ! ! e;
      this.bindGuideOverlayClick(this.guideStep4Overlay, ! ! e, this.onGuideStep4OverlayClick);
    }
  }
, setStep5GuideOverlayActive: function(e) {
    if(this.guideStep5Overlay&& this.guideStep5Overlay.isValid) {
      this.guideStep5Overlay.active = ! ! e;
      this.bindGuideOverlayClick(this.guideStep5Overlay, ! ! e, this.onGuideStep5OverlayClick);
    }
  }
, setStep6GuideOverlayActive: function(e) {
    if(this.guideStep6Overlay&& this.guideStep6Overlay.isValid) {
      this.guideStep6Overlay.active = ! ! e;
      this.bindGuideOverlayClick(this.guideStep6Overlay, ! ! e, this.onGuideStep6OverlayClick);
    }
  }
, bindGuideOverlayClick: function(e, t, i) {
    if(e&& e.isValid&& "function" == typeof i) {
      e.off(cc.Node.EventType.TOUCH_END, i, this);
      t&& e.on(cc.Node.EventType.TOUCH_END, i, this);
    }
  }
, onGuideStep4OverlayClick: function() {
    var e = this.getNewbieGuideFlow();
    if(e&& this.isNewbieGuideStep(e.STEP_WITHDRAW_OPTION)) {
      this.setStep4GuideOverlayActive(! 1);
      this.guideStep4TipNode&& (this.guideStep4TipNode.active = ! 1);
      this.selectedIndex = 0;
      this.advanceNewbieGuideStep(e.STEP_WITHDRAW_OPTION);
      this.refreshAll();
    }
  }
, onGuideStep5OverlayClick: function() {
    var e = this.getNewbieGuideFlow();
    if(e&& this.isNewbieGuideStep(e.STEP_WITHDRAW_BUTTON)) {
      this._guideStep5Pending = ! 0;
      this.setStep5GuideOverlayActive(! 1);
      this.guideStep5TipNode&& (this.guideStep5TipNode.active = ! 1);
      this.stopNewbieGuidePulse();
      this._bypassClickThrottle = ! 0;
      this.onClickWithdraw();
    }
  }
, onGuideStep6OverlayClick: function() {
    var e = this.getNewbieGuideFlow();
    if(e&& this.isNewbieGuideStep(e.STEP_WITHDRAW_BACK)) {
      this._bypassClickThrottle = ! 0;
      this.onClickClose();
    }
  }
, updateGuideMaskOverTarget: function(e, t, i, n, a) {
    if(e&& e.isValid&& t&& t.isValid&& i&& i.isValid&& i.parent&& i.parent.isValid) {
      var o = t.getComponent(cc.Widget);
      o&& (o.enabled = ! 1);
      var r = i.parent.convertToWorldSpaceAR(cc.v2(i.x, i.y)), s = e.convertToNodeSpaceAR(r);
      t.x = s.x;
      t.y = s.y;
      var l = Number(n|| 0), c = Number(a|| 0);
      t.width = Math.max(60, Number(i.width|| 0)+ l);
      t.height = Math.max(60, Number(i.height|| 0)+ c);
    }
  }
, hideAllNewbieGuideOverlays: function() {
    this.setStep4GuideOverlayActive(! 1);
    this.setStep5GuideOverlayActive(! 1);
    this.setStep6GuideOverlayActive(! 1);
  }
, showNewbieGuideTip: function(e, t, i) {
    var n = this.i18n(t, [], i|| "");
    this.hideAllNewbieGuideTipNodes();
    if(n) {
      this.newbieGuideToastStep = e;
      var a = this.getNewbieGuideFlow(), o = null, r = null;
      if(a&& e === a.STEP_WITHDRAW_OPTION) {
        o = this.guideStep4TipNode;
        r = this.lblGuideStep4Tip;
      } else if(a&& e === a.STEP_WITHDRAW_BUTTON) {
        o = this.guideStep5TipNode;
        r = this.lblGuideStep5Tip;
      } else if(a&& e === a.STEP_WITHDRAW_BACK) {
        o = this.guideStep6TipNode;
        r = this.lblGuideStep6Tip;
      }
      if(o&& r) {
        this.setLabelText(r, n);
        o.active = ! 0;
      } else this.setLabelText(this.lblBottomCondition, n);
    }
  }
, refreshNewbieGuide: function() {
    var e = this.getNewbieGuideFlow();
    if(! e|| e.isDone&& e.isDone()) {
      this.stopNewbieGuidePulse();
      this.hideAllNewbieGuideTipNodes();
      this.hideAllNewbieGuideOverlays();
    } else if(this._withdrawInfoLoaded) {
      var t = this.getNewbieGuideStep();
      if(t !== e.STEP_WITHDRAW_OPTION) if(t !== e.STEP_WITHDRAW_BUTTON) if(t !== e.STEP_WITHDRAW_BACK) {
        this.stopNewbieGuidePulse();
        this.hideAllNewbieGuideTipNodes();
        this.hideAllNewbieGuideOverlays();
      } else {
        this.startNewbieGuidePulse(this.btnBack);
        this.setStep4GuideOverlayActive(! 1);
        this.setStep5GuideOverlayActive(! 1);
        this.setStep6GuideOverlayActive(! 0);
        this.guideStep6Mask&& this.guideStep6Mask.isValid&& (this.guideStep6Mask.active = ! 0);
        this.showNewbieGuideTip(t, "key_newbie_guide_step6", "继续闯关赚钱吧");
      } else {
        if(this._guideStep5Pending) {
          this.stopNewbieGuidePulse();
          this.hideAllNewbieGuideTipNodes();
          this.hideAllNewbieGuideOverlays();
          return;
        }
        this.startNewbieGuidePulse(this.btnWithdraw);
        this.setStep4GuideOverlayActive(! 1);
        this.setStep6GuideOverlayActive(! 1);
        this.setStep5GuideOverlayActive(! 0);
        this.guideStep5Mask&& this.guideStep5Mask.isValid&& (this.guideStep5Mask.active = ! 0);
        this.showNewbieGuideTip(t, "key_newbie_guide_step5", "达成目标，立即提现");
      } else {
        var i = this.optionButtons&& this.optionButtons[0]&& this.optionButtons[0].node;
        this.startNewbieGuidePulse(i);
        this.setStep5GuideOverlayActive(! 1);
        this.setStep6GuideOverlayActive(! 1);
        this.setStep4GuideOverlayActive(! 0);
        this.showNewbieGuideTip(t, "key_newbie_guide_step4", "选择你想要提现的金额");
      }
    } else {
      this.stopNewbieGuidePulse();
      this.hideAllNewbieGuideTipNodes();
      this.hideAllNewbieGuideOverlays();
    }
  }
, tryAdvanceToStep6: function() {
    var e = this.getNewbieGuideFlow();
    if(e) {
      this._guideStep5Pending = ! 1;
(this.advanceNewbieGuideStep(e.STEP_WITHDRAW_BUTTON)|| this.isNewbieGuideStep(e.STEP_WITHDRAW_BACK))&& this.refreshAll();
    }
  }
, resetGuideStep5Pending: function() {
    if(this._guideStep5Pending) {
      this._guideStep5Pending = ! 1;
      var e = this.getNewbieGuideFlow();
      e&& this.isNewbieGuideStep(e.STEP_WITHDRAW_BUTTON)&& this.refreshNewbieGuide();
    }
  }
, isClickThrottled: function() {
    if(this._bypassClickThrottle) {
      this._bypassClickThrottle = ! 1;
      this._lastClickTime = Date.now();
      return ! 1;
    }
    var e = Date.now();
    if(e- this._lastClickTime < 500) return ! 0;
    this._lastClickTime = e;
    return ! 1;
  }
, onClickOption: function(e) {
    var t = e&& e.currentTarget&& e.currentTarget._optionIndex;
    if(void 0 !== t&& Number(t) !== Number(this.selectedIndex)) {
      var i = this.getNewbieGuideFlow();
      if(i&& this.isNewbieGuideStep(i.STEP_WITHDRAW_OPTION)) {
        if(0 !== Number(t)) return;
        this.advanceNewbieGuideStep(i.STEP_WITHDRAW_OPTION);
      }
      this.selectedIndex = t;
      this.refreshAll();
    }
  }
, onClickHistory: function() {
    this.isClickThrottled()|| cc.log("[withMoodView] open history");
  }
, onClickWithdraw: function() {
    if(this.isClickThrottled()) this.resetGuideStep5Pending();
    else {
      var e = this, t = this.options[this.selectedIndex];
      if(t) {
        var i = NetErrorPopupService, n = function() {
          e.onClickWithdraw();
        }
;
        LoadingHttpService.getWithdrawChannels(Handler.create(e, function(a) {
          if(i&& i.shouldPop(a)) {
            cc.warn("[withMoodView] getWithdrawChannels force-retry code=", a&& a.code);
            i.showAndRetry(n);
          } else {
            var o = Number(a&& a.code);
            if(a&& a.data&& (isNaN(o)|| 1 === o)) if(e.node&& e.node.isValid&& e.node.activeInHierarchy) {
              var r = a.data, s = e.extractChannelList(r), l = PlayerDataStore, c = Array.isArray(l.tx_bind_info)? l.tx_bind_info:[], u = e.pickValidBindInfo(c, s), d = function() {
                e.tryAdvanceToStep6();
              }
;
              u? e.showCheckView(t, r, u, d): e.showSetView(t, r, null, d);
            } else {
              cc.warn("[withMoodView] getWithdrawChannels success but view already hidden, skip popup");
              e.resetGuideStep5Pending();
            } else {
              cc.warn("[withMoodView] getWithdrawChannels failed:", a&& a.message);
              e.resetGuideStep5Pending();
            }
          }
        }
), Handler.create(e, function(t) {
          if(i&& i.shouldPop(t)) {
            cc.warn("[withMoodView] getWithdrawChannels 网络异常，弹重试窗 err=", t&& t.message);
            i.showAndRetry(n);
          } else {
            cc.warn("[withMoodView] getWithdrawChannels error:", t&& t.message);
            e.resetGuideStep5Pending();
          }
        }
));
      } else {
        cc.warn("[withMoodView] no option selected");
        this.resetGuideStep5Pending();
      }
    }
  }
, showSetView: function(t, i, a, o) {
    var r = this;
    UIMgr.getInstance().show(UIDefine.cashArrowSetView).then(function(n) {
      if(n&& n.isValid) {
        var s = cashArrowSetView, l = n.getComponent(s);
        l|| (l = n.addComponent(s));
        l.setEntryData&& l.setEntryData({
          selectedOpt: t, channelData: i, initialBindInfo: a|| null, onClose: o|| null, onValidated: function(e) {
            r.showCheckView(t, i, e, o);
          }
        }
);
      }
    }
);
  }
, showCheckView: function(t, i, a, o) {
    var r = this;
    UIMgr.getInstance().show(UIDefine.cashArrowCheckView).then(function(n) {
      if(n&& n.isValid) {
        var s = cashArrowCheckView, l = n.getComponent(s);
        l|| (l = n.addComponent(s));
        l.setEntryData&& l.setEntryData({
          selectedOpt: t, channelData: i, bindInfo: a, onClose: o|| null, onRevise: function(e) {
            r.showSetView(t, i, e|| a, o);
          }
, onWithdraw: function(e, i, o) {
            r.tryAdvanceToStep6();
            r.submitWithdrawFlow({
              selectedOpt: i|| t, bindInfo: e|| a, checkNode: n, done: o
            }
);
          }
        }
);
      }
    }
);
  }
, extractChannelList: function(e) {
    if(! e) return[];
    if(Array.isArray(e)) return e;
    var t = e.channel_list|| e.channels|| e.list|| [];
    if(Array.isArray(t)) return t.filter(Boolean);
    if(e.data) {
      var i = e.data;
      t = i.channel_list|| i.channels|| i.list|| [];
      if(Array.isArray(t)) return t.filter(Boolean);
    }
    return[];
  }
, pickValidBindInfo: function(e, t) {
    if(! Array.isArray(e)|| e.length <= 0) return null;
    if(! Array.isArray(t)|| t.length <= 0) return null;
    for(var i = 0;
    i < e.length;
    i++) {
      var n = e[i];
      if(n) for(var a = 0;
      a < t.length;
      a++) {
        var o = t[a];
        if(o&& (n.channel|| "") === (o.channel|| "")&& (n.sub_channel|| "") === (o.sub_channel|| "")) return n;
      }
    }
    return null;
  }
, submitWithdrawFlow: function(e) {
    var t = e&& e.selectedOpt, i = e&& e.bindInfo, n = e&& e.checkNode, a = e&& e.done, o = this;
    if(this.isWithdrawSubmitting) {
      a&& a();
      return ! 1;
    }
    if(! t) {
      cc.warn("[withMoodView] submitWithdrawFlow no selectedOpt");
      this.showToast(this.i18n("key_cash_check_withdraw_failed", null, "Withdrawal failed"));
      a&& a();
      return ! 1;
    }
    if(! i) {
      cc.warn("[withMoodView] submitWithdrawFlow no bindInfo");
      this.showToast(this.i18n("key_cash_check_bind_failed", null, "Binding failed"));
      a&& a();
      return ! 1;
    }
    this.isWithdrawSubmitting = ! 0;
    var r = function() {
      o.isWithdrawSubmitting = ! 1;
      a&& a();
    }
, s = this.buildBindRequestData(i), l = NetErrorPopupService, c = function() {
      o.isWithdrawSubmitting = ! 1;
      o.submitWithdrawFlow(e);
    }
;
    LoadingHttpService.bindTxAccount(s, Handler.create(o, function(e) {
      if(l&& l.shouldPop(e)) {
        cc.warn("[withMoodView] bindTxAccount force-retry code=", e&& e.code);
        o.isWithdrawSubmitting = ! 1;
        l.showAndRetry(c);
      } else if(e&& 1 === Number(e.code)) {
        o.syncBindInfoToStore(e, i);
        o.refreshUserInfoAfterBind();
        var a = o.checkWithdrawCondition(t);
        if(a.pass) o.executeWithdrawRequest(t, i, n, r);
        else {
          o.showToast(a.message|| o.i18n("key_withdraw_cond_not_met", null, "Withdrawal conditions not met"));
          r();
        }
      } else {
        cc.warn("[withMoodView] bind failed:", e&& e.message);
        o.showToast(e&& e.message|| o.i18n("key_cash_check_bind_failed", null, "Binding failed"));
        r();
      }
    }
), Handler.create(o, function(e) {
      if(l&& l.shouldPop(e)) {
        cc.warn("[withMoodView] bindTxAccount 网络异常，弹重试窗 err=", e&& e.message);
        o.isWithdrawSubmitting = ! 1;
        l.showAndRetry(c);
      } else {
        cc.warn("[withMoodView] bind error:", e&& e.message);
        o.showToast(e&& e.message|| o.i18n("key_common_network_error", null, "Network error"));
        r();
      }
    }
));
    return ! 0;
  }
, checkWithdrawCondition: function(e) {
    var t = e|| {
    }
, i = parseInt(t.status, 10);
    isNaN(i)&& (i = 0);
    var n = Number(t.money|| 0);
    if(4 === i) return {
      pass: ! 0, message: ""
    }
;
    if(0 === i) {
      var a = Math.max(0, n- Number(this.userBalance|| 0));
      return a <= 0? {
        pass: ! 0, message: ""
      }
: {
        pass: ! 1, message: this.i18n("key_withdraw_toast_need_gap", [this.getCurrencyText(a)], "Insufficient balance")
      }
;
    }
    if(1 === i) {
      var o = Math.max(0, Number(t.levels_passed_limit|| 0)- Number(t.current_extract_levels_passed_count|| 0));
      return o <= 0? {
        pass: ! 0, message: ""
      }
: {
        pass: ! 1, message: this.i18n("key_withdraw_toast_need_episode", [o], "Not enough cleared levels")
      }
;
    }
    if(2 === i) {
      var r = Math.max(0, Number(t.sign_in_limit|| 0)- Number(t.sign_in|| 0));
      return r <= 0? {
        pass: ! 0, message: ""
      }
: {
        pass: ! 1, message: this.i18n("key_withdraw_toast_need_days", [r], "Not enough check-in days")
      }
;
    }
    if(3 === i) {
      var s = Number(t.level|| this.userLevel|| 0);
      return Math.max(0, Number(t.level_limit|| 0)- s) <= 0? {
        pass: ! 0, message: ""
      }
: {
        pass: ! 1, message: this.i18n("key_withdraw_toast_need_level", [t.level_limit|| 0], "Level too low")
      }
;
    }
    return {
      pass: ! 0, message: ""
    }
;
  }
, buildBindRequestData: function(e) {
    var t = {
      channel: e.channel|| "", sub_channel: e.sub_channel|| ""
    }
;
    if(e._input_data) for(var i in e._input_data) Object.prototype.hasOwnProperty.call(e._input_data, i)&& (t[i] = e._input_data[i]);
    else for(var n = Array.isArray(e.need_field)&& e.need_field.length > 0? e.need_field:[{
      field_value: "account"
    }
, {
      field_value: "payee_name"
    }
], a = 0;
    a < n.length;
    a++) {
      var o = n[a];
      o&& o.field_value&& (t[o.field_value] = this.resolveRawBindFieldValue(e, o.field_value));
    }
    t.account|| (t.account = e.account|| e.phone|| e.email|| "");
    t.payee_name|| (t.payee_name = e.payee_name|| e.name|| "");
! t.name&& t.payee_name&& (t.name = t.payee_name);
    return t;
  }
, resolveRawBindFieldValue: function(e, t) {
    if(! e|| ! t) return "";
    var i = e[t];
    return null != i&& "" !== i? String(i): "name" === t|| "payee_name" === t? e.payee_name|| e.name|| "": "account" === t&& (e.account|| e.phone|| e.email)|| "";
  }
, syncBindInfoToStore: function(e, t) {
    var i = PlayerDataStore;
    if(e&& e.data&& Array.isArray(e.data.tx_bind_info)) i.tx_bind_info = e.data.tx_bind_info;
    else {
      for(var n = Array.isArray(i.tx_bind_info)? i.tx_bind_info.slice():[], a = ! 1, o = 0;
      o < n.length;
      o++) {
        var r = n[o];
        if(r&& (r.channel|| "") === (t.channel|| "")&& (r.sub_channel|| "") === (t.sub_channel|| "")) {
          n[o] = t;
          a = ! 0;
          break;
        }
      }
      a|| n.push(t);
      i.tx_bind_info = n;
    }
  }
, refreshUserInfoAfterBind: function() {
    GlobalEventMgr.getInstance().emit(gameEvent.refreshUserInfo);
    this.fetchUserInfoByService();
  }
, fetchUserInfoByService: function() {
    try {
      var e = UserInfoService;
      if(! e|| "function" != typeof e.getInstance) return;
      var t = e.getInstance();
      t&& "function" == typeof t.fetch&& t.fetch();
    } catch(e) {
      cc.warn("[withMoodView] fetch user info error:", e&& e.message);
    }
  }
, executeWithdrawRequest: function(e, t, i, r) {
    var s = this, l = e&& e.id|| "";
    if(l) {
      var c = {
        tx_id: l, channel: t.channel|| "", sub_channel: t.sub_channel|| ""
      }
, h = NetErrorPopupService, p = function() {
        s.executeWithdrawRequest(e, t, i, r);
      }
;
      LoadingHttpService.withdrawCash(c, Handler.create(s, function(e) {
        if(h&& h.shouldPop(e)) {
          cc.warn("[withMoodView] withdrawCash force-retry code=", e&& e.code);
          h.showAndRetry(p);
        } else if(e&& 1 === Number(e.code)) {
          GlobalEventMgr.getInstance().emit(gameEvent.refreshUserInfo);
          s.fetchUserInfoByService();
          s.showToast(s.i18n("key_cash_check_withdraw_success", null, "Withdrawal successful"));
          i&& i.isValid&& UIMgr.getInstance().hide(i);
          s.loadWithdrawInfo();
          r&& r();
        } else {
          cc.warn("[withMoodView] withdraw failed:", e&& e.message);
          s.showToast(e&& e.message|| s.i18n("key_cash_check_withdraw_failed", null, "Withdrawal failed"));
          r&& r();
        }
      }
), Handler.create(s, function(e) {
        if(h&& h.shouldPop(e)) {
          cc.warn("[withMoodView] withdrawCash 网络异常，弹重试窗 err=", e&& e.message);
          h.showAndRetry(p);
        } else {
          cc.warn("[withMoodView] withdraw error:", e&& e.message);
          s.showToast(e&& e.message|| s.i18n("key_common_network_error", null, "Network error"));
          r&& r();
        }
      }
));
    } else {
      this.showToast(this.i18n("key_cash_check_withdraw_failed", null, "Withdrawal failed"));
      r&& r();
    }
  }
, showToast: function(t) {
    if(t|| 0 === t) {
      var i = String(t);
      try {
        if(cc.sys.isNative&& cc.sys.os === cc.sys.OS_ANDROID) {
          const bridge = NativeSdkBridgeAdapter.getBridge();
          if (bridge && typeof bridge.showAppLongTapToast === "function") {
            bridge.showAppLongTapToast(i, 0);
            return;
          }
        }
        Tips.show(i);
      } catch(e) {
        cc.log("[withMoodView] toast:", i);
      }
    }
  }
, onClickClose: function() {
    if(! this.isClickThrottled()) {
      this._guideStep5Pending = ! 1;
      var e = this.getNewbieGuideFlow();
      e&& this.advanceNewbieGuideStep(e.STEP_WITHDRAW_BACK);
      this.stopNewbieGuidePulse();
      UIMgr.getInstance().hide(this.node);
    }
  }
, formatMoney: function(e) {
    return Math.max(0, Math.floor(e || 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
, getCurrencyText: function(e) {
    var t = arguments.length > 1? arguments[1]: e;
    return LanguageService.formatCurrency(t);
  }
, i18n: function(e, t, i) {
    return LanguageService.t(e, t, i);
  }
, setLabelText: function(e, t) {
    e&& (e.string = t|| "");
  }
, setLabelI18n: function(e, t, i, n) {
    if(e&& t) {
      var a = e.node.getComponent("I18nLabel");
      a&& a.setI18nKey? a.setI18nKey(t, i|| [], n): e.string = this.i18n(t, i|| [], n);
    }
  }
, findNode: function(e) {
    return this.findNodeDeep(this.node, e);
  }
, findLabel: function(e) {
    var t = this.findNode(e);
    return t? t.getComponent(cc.Label)|| t.addComponent(cc.Label): null;
  }
, findNodeDeep: function(e, t) {
    if(! e) return null;
    if(e.name === t) return e;
    for(var i = 0;
    i < e.childrenCount;
    i++) {
      var n = this.findNodeDeep(e.children[i], t);
      if(n) return n;
    }
    return null;
  }
});

export default WithMoodView;
