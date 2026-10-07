let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "2b638U50ZVCN6aLyME0ZFFH", "SetPageInGameCtrl");
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
var r = e("Debugger.js"),
l = e("GameConfigurations.js"),
s = e("AudioManager.js"),
c = e("UiManage.js"),
u = e("PoolNative.js"),
p = e("BasePageCtrl.js"),
d = e("PageMgr.js"),
_ = e("SetPageInGame.js"),
f = cc._decorator,
h = f.ccclass,
g = f.menu,
y = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.ui = null;
    t._animType = null;
    t._touchControl = null;
    t._hasPeneLock = null;
    t._hasBlack = null;
    t._hasTouchLock = null;
    t._exitCB = null;
    t._debugFlag = 0;
    t._debugScheduleFunc = null;
    return t;
  }
  t.prototype.onDisable = function() {
    e.prototype.onDisable.call(this);
    this._exitCB = null;
  }
;
  t.prototype._clickTitle = function() {
    if(r.Debugger.isDebugMode) {
      this.hide();
      d.default.showPage("DebugPage");
    } else if(l.GameConfigurations.debugCode.length > 0) if(6 == ++ this._debugFlag) {
      this._debugFlag = 0;
      this._stopDebugSchedule();
      this.hide();
      d.default.showPage("DebugCodePage");
    } else this._startDebugSchedule();
  }
;
  t.prototype.onLoad = function() {
    this.onUILoad();
    this._animType = p.AnimType.SCALE;
    this._touchControl = ! 1;
    this._hasPeneLock = ! 0;
    this._hasBlack = ! 0;
    this._hasTouchLock = ! 1;
    e.prototype.onLoad.call(this);
    this.addButtonListen();
  }
;
  t.prototype.onUILoad = function() {
    this.ui = this.node.addComponent(_.default);
  }
;
  t.prototype.clickMoreGame = function() {
    var e,
    t,
    o = l.GameConfigurations.moreGameURLsArray;
    d.default.showPage("MoreGamePage", {
      url: null !== (t = null === (e = o[Math.floor(Math.random()* o.length)])|| void 0 === e? void 0: e.link_url)&& void 0 !== t? t: ""
    }
);
  }
;
  t.prototype.musicTouch = function() {
    if(s.default.getInstance().getMusicState()) {
      s.default.getInstance().closeBg();
      s.default.getInstance().pauseMusic(s.DEFAULT_BGM_NAME, ! 0);
    } else {
      s.default.getInstance().openBg();
      s.default.getInstance().playMusic(s.DEFAULT_BGM_NAME, ! 0, ! 0);
    }
  }
;
  t.prototype.addButtonListen = function() {
(r.Debugger.isDebugMode|| l.GameConfigurations.debugCode.length > 0)&& c.UiManager.addButtonListen(this.ui.titleLabel, this._clickTitle, this, void 0, void 0, void 0, cc.Button.Transition.NONE);
    c.UiManager.addButtonListen(this.ui.btn_close, this.clickClose, this);
    c.UiManager.addButtonListen(this.ui.btn_sound, this.clickSound, this);
    c.UiManager.addButtonListen(this.ui.btn_shake, this.clickShake, this);
    c.UiManager.addButtonListen(this.ui.btn_music, this.clickMusic, this);
    c.UiManager.addButtonListen(this.ui.btn_quit, this.clickQuit, this);
    c.UiManager.addButtonListen(this.ui.btn_more_game, this.clickMoreGame, this);
    c.UiManager.addButtonListen(this.ui.policy, this.clickPolicy, this);
  }
;
  t.prototype.audioTouch = function() {
    s.default.getInstance().getAudioState()? s.default.getInstance().closeAudio(): s.default.getInstance().openAudio();
  }
;
  t.prototype._init = function(e) {
    this._exitCB = e? e.exitCB: null;
    this.ui.icon_on.active = s.default.getInstance().getMusicState();
    this.ui.icon_off.active = ! this.ui.icon_on.active;
    this.ui.icon_sound_on.active = s.default.getInstance().getAudioState();
    this.ui.icon_sound_off.active = ! this.ui.icon_sound_on.active;
    this.ui.icon_shake_on.active = s.default.getInstance().getVibratorState();
    this.ui.icon_shake_off.active = ! this.ui.icon_shake_on.active;
    var t = ! ! this._exitCB;
    this.ui.btn_quit.active = t;
    this.ui.btn_more_game.active = l.GameConfigurations.moreGameURLsArray.length > 0;
  }
;
  t.prototype.clickSound = function() {
    this.audioTouch();
    this.ui.icon_sound_on.active = s.default.getInstance().getAudioState();
    this.ui.icon_sound_off.active = ! this.ui.icon_sound_on.active;
  }
;
  t.prototype.start = function() {
  }
;
  t.prototype.clickClose = function() {
    this.hide();
  }
;
  t.prototype._stopDebugSchedule = function() {
    if(this._debugScheduleFunc) {
      this.unschedule(this._debugScheduleFunc);
      this._debugScheduleFunc = null;
    }
  }
;
  t.prototype.clckReplayBtn = function() {
    this._exitCB&& this._exitCB();
    this.clickClose();
  }
;
  t.prototype._startDebugSchedule = function() {
    var e = this;
    this._stopDebugSchedule();
    this.scheduleOnce(this._debugScheduleFunc = function() {
      return e._debugFlag = 0;
    }
, 1);
  }
;
  t.prototype.clickPolicy = function() {
    u.PoolNative.openURL(l.GameConfigurations.PRIVACY_POLICY);
  }
;
  t.prototype.clickMusic = function() {
    this.musicTouch();
    this.ui.icon_on.active = s.default.getInstance().getMusicState();
    this.ui.icon_off.active = ! this.ui.icon_on.active;
  }
;
  t.prototype.clickShake = function() {
    s.default.getInstance().getVibratorState()? s.default.getInstance().closeVibrator(): s.default.getInstance().openVibrator();
    this.ui.icon_shake_on.active = s.default.getInstance().getVibratorState();
    this.ui.icon_shake_off.active = ! this.ui.icon_shake_on.active;
  }
;
  t.prototype.clickQuit = function() {
    this._exitCB&& this._exitCB();
    this.clickClose();
  }
;
  t.prefabUrl = "SetPageInGame";
  t.className = "SetPageInGameCtrl";
  return a([h, g("UI/pages/SetPageInGameCtrl")], t);
}
(p.default);
o.default = y;
cc._RF.pop();
