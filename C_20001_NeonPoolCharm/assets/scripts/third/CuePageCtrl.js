let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "b16938iD1dIJobBf0lXFx6f", "CuePageCtrl");
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
l = e("BasePageCtrl.js"),
s = e("CuePage.js"),
c = e("CueDataSys.js"),
u = e("EventMgr.js"),
p = e("GameEventType.js"),
d = e("List.js"),
_ = e("ConfigDataSys.js"),
f = e("SystemDataSys.js"),
h = e("NewCueListLitemCtr.js"),
g = cc._decorator,
y = g.ccclass,
v = g.menu,
m = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.ui = null;
    t._selectedCueId = 2;
    t._curCueId = 1;
    t._attriItemCtrMap = new Map();
    t.nodeMap = new Map();
    t._animType = null;
    t._touchControl = null;
    t._hasPeneLock = null;
    t._hasBlack = null;
    t._hasTouchLock = null;
    t.maxLevel = null;
    t.data = null;
    t.node = null;
    t.list = null;
    return t;
  }
  t.prototype.onEnable = function() {
    var t;
    null === (t = e.prototype.onEnable)|| void 0 === t|| t.call(this);
    u.default.listen(p.default.ON_UNLOCKED_CLUBS_CHANGED, this.updateBar, this);
  }
;
  t.prototype.onLoad = function() {
    console.log("onload");
    this.onUILoad();
    this._animType = l.AnimType.NONE;
    this._touchControl = ! 1;
    this._hasPeneLock = ! 0;
    this._hasBlack = ! 0;
    this._hasTouchLock = ! 1;
    this.list = this.ui.cue_item_scv.getComponent(d.default);
    e.prototype.onLoad.call(this);
    this.addButtonListen();
    console.log("onload22");
    this.initCueItemList();
    this.maxLevel = _.default.club_gold_configMap.size;
  }
;
  t.prototype.getStatusPriority = function(e) {
    var t = 10;
    e === c.default.usedCueId? t = 0: c.default.isCueNotOpened(e)|| (t = c.default.isCueUnlocked(e)? 1: 2);
    return t;
  }
;
  t.prototype.initCueItemList = function() {
    var e = new cc.Component.EventHandler();
    e.target = this.node;
    e.component = "CuePageCtrl";
    e.handler = "onListRender";
    this.list = this.ui.cue_item_scv.getComponent(d.default);
    this.list.renderEvent = e;
  }
;
  t.prototype._init = function() {
    var e = this;
    console.log("_init");
    if(f.default.is_IOS_reviewer) {
      var t = this.ui.cue_item_scv.getComponent(cc.Widget);
      t.top = 0;
      t.bottom = 0;
    }
    this._selectedCueId = c.default.usedCueId;
    this._curCueId = c.default.usedCueId;
    this.data = [];
    _.default.cue_configMap.forEach(function(t, o) {
      c.default.isCueNotOpened(o)&& o !== c.default.nextCueID|| e.data.push(t);
    }
);
    this.data.sort(function(t, o) {
      var n = e.getStatusPriority(t.id), i = e.getStatusPriority(o.id);
      return n != i? n- i: t.id- o.id;
    }
);
    this.list.numItems = this.data.length;
    this.updateBar();
  }
;
  t.prototype.onDisable = function() {
    u.default.ignore(p.default.ON_UNLOCKED_CLUBS_CHANGED, this.updateBar, this);
  }
;
  t.prototype.updateBar = function() {
    var e = c.default.unlockedCueCount,
    t = _.default.cue_configMap.size;
    this.ui.progressBar.getComponent(cc.ProgressBar).progress = e/ t;
    this.ui.progressLabel.getComponent(cc.Label).string = e+ "/"+ t;
  }
;
  t.prototype.clickClose = function() {
    this.hide();
  }
;
  t.prototype.onListRender = function(e, t) {
    var o = this.data[t];
    e.getComponent(h.default).initData(o.id, this.updateBar.bind(this));
  }
;
  t.prototype.addButtonListen = function() {
    r.UiManager.addButtonListen(this.ui.btn_back, this.clickClose, this);
  }
;
  t.prototype.onUILoad = function() {
    this.ui = this.node.addComponent(s.default);
  }
;
  t.prefabUrl = "CuePage";
  t.className = "CuePageCtrl";
  return a([y, v("UI/pages/CuePageCtrl")], t);
}
(l.default);
o.default = m;
cc._RF.pop();
