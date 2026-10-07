let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "5e3e4iwjfNC7r3LaL7isDHf", "CueListItemCtr");
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
var r = e("UiManage.js"),
l = e("CueDataSys.js"),
s = e("EventMgr.js"),
c = e("GameEventType.js"),
u = e("EngineUtil.js"),
p = e("ConfigDataSys.js"),
d = cc._decorator,
_ = d.ccclass,
f = d.menu,
h = d.property,
g = (cc._decorator, function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.cue_list_item_root = null;
    t.lock_info_area = null;
    t.cue_icon = null;
    t.label_unlock = null;
    t.icon_cue = null;
    t.icon_city = null;
    t.ad_info_area = null;
    t.label_ad_get = null;
    t.use_info_area = null;
    t.label_cue_item_use = null;
    t.sp_light = null;
    t._curTouchLock = null;
    t._cueID = null;
    return t;
  }
  Object.defineProperty(t.prototype, "cueID", {
    get: function() {
      return this._cueID;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  t.prototype.onLoad = function() {
    r.UiManager.addButtonListen(this.cue_list_item_root, this.onSelected, this);
  }
;
  t.prototype.onEnable = function() {
    this._curTouchLock = ! 1;
    s.default.listen(c.default.ON_UNLOCKED_CLUBS_CHANGED, this.onUnlockClubsChanged, this);
    s.default.listen(c.default.ON_USED_CLUB_CHANGED, this.onUsedClubChanged, this);
  }
;
  t.prototype.onGetBtnClicked = function() {
    this._curTouchLock|| (this._curTouchLock = ! 0);
  }
;
  t.prototype.updateData = function() {
    this.updateLockState();
  }
;
  t.prototype.onUnlockClubsChanged = function() {
    this.updateLockState();
  }
;
  t.prototype.showLight = function() {
    this.sp_light.active = ! 0;
  }
;
  t.prototype.onDisable = function() {
    s.default.ignore(c.default.ON_UNLOCKED_CLUBS_CHANGED, this.onUnlockClubsChanged, this);
    s.default.ignore(c.default.ON_USED_CLUB_CHANGED, this.onUsedClubChanged, this);
  }
;
  t.prototype.initData = function(e) {
    this._cueID = e;
    this.setCueIcon();
    this.updateLockState();
    this.hideLight();
  }
;
  t.prototype.onUsedClubChanged = function() {
    this.updateLockState();
  }
;
  t.prototype.hideLight = function() {
    this.sp_light.active = ! 1;
  }
;
  t.prototype.onSelected = function() {
    this.selectCB&& this.selectCB(this._cueID);
  }
;
  t.prototype.setCueIcon = function() {
    p.default.cue_configMap.get(this._cueID)&& l.default.setCueIcon(this.cue_icon.node, this._cueID);
  }
;
  t.prototype.updateLockState = function() {
    var e = p.default.cue_configMap.get(this._cueID);
    if(e) {
      this.lock_info_area.active = l.default.isCueNotOpened(this._cueID)&& ! l.default.isCueUnlocked(this._cueID);
      this.ad_info_area.active = ! l.default.isCueNotOpened(this._cueID)&& ! l.default.isCueUnlocked(this._cueID);
      this.use_info_area.active = l.default.usedCueId == this._cueID;
      if(this.lock_info_area.active) {
        var t = p.default.cue_configMap.get(this._cueID);
        this.icon_city.active = - 1 != t.unlock_cue;
        this.icon_cue.active = ! this.icon_city.active;
        if(t) if(0 == t.unlock_cue) {
          var o = l.default.club_shard.get(this._cueID);
          this.label_unlock.getComponent(cc.Label).string = o+ "/"+ e.unlock_type;
        } else {
          var n = p.default.scene_configMap.get(t.unlock_cue);
          n&& u.default.seti18nString(this.label_unlock.node, i18n.t(n.language));
        }
      }
    }
  }
;
  a([h(cc.Node)], t.prototype, "cue_list_item_root", void 0);
  a([h(cc.Node)], t.prototype, "lock_info_area", void 0);
  a([h(cc.Sprite)], t.prototype, "cue_icon", void 0);
  a([h(cc.Label)], t.prototype, "label_unlock", void 0);
  a([h(cc.Node)], t.prototype, "icon_cue", void 0);
  a([h(cc.Node)], t.prototype, "icon_city", void 0);
  a([h(cc.Node)], t.prototype, "ad_info_area", void 0);
  a([h(cc.Node)], t.prototype, "label_ad_get", void 0);
  a([h(cc.Node)], t.prototype, "use_info_area", void 0);
  a([h(cc.Node)], t.prototype, "label_cue_item_use", void 0);
  a([h(cc.Node)], t.prototype, "sp_light", void 0);
  return a([_, f("UI/pages/items/CueListItemCtr")], t);
}
(cc.Component));
o.default = g;
cc._RF.pop();
