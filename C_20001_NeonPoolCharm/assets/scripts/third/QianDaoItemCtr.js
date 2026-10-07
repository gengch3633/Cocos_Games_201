let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "33830CAysJMXrlEI9RREW1l", "QianDaoItemCtr");
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
var r = e("EventMgr.js"),
l = e("GameEventType.js"),
s = e("PlayerDataSys.js"),
c = e("SystemDataSys.js"),
u = e("RequestData.js"),
p = e("UiManage.js"),
d = e("CueDataSys.js"),
_ = cc._decorator,
f = _.ccclass,
h = _.menu,
g = _.property,
y = (cc._decorator, function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.qipao = null;
    t.light = null;
    t.day = null;
    t.num = null;
    t.successIcon = null;
    t.icon = null;
    t.bigNum = null;
    t.cue = null;
    t.data = null;
    return t;
  }
  t.prototype.updateUi = function() {
    var e = this, t = this.data;
    if(null != t) {
      var o = t.id- 1, n = s.default.sign_in_count% 10, i = s.default.sign_in_count;
      if(s.default.sign_today) {
        i-= 1;
        0 == n&& (n = 10);
        n-= 1;
      }
      if(n == o) {
        this.successIcon.active = s.default.sign_today;
        this.light.active = 0 == s.default.sign_today;
      } else if(n > o) {
        this.successIcon.active = ! 0;
        this.light.active = ! 1;
      } else {
        this.light.active = ! 1;
        this.successIcon.active = ! 1;
      }
      this.day.string = t.id.toString();
      var a = t.reward.split("|"), r = Math.floor(i/ 10), l = a[r]? a[r]: a[a.length- 1];
      if(10 == t.id) {
        this.qipao.active = ! this.successIcon.active&& ! c.default.is_IOS_reviewer;
        var _ = l.split(","), f = _[0].split("_"), h = Number(f[0]), g = Number(f[1]);
        if(h == u.RewardType.Cue) {
          this.cue.node.active = ! 0;
          this.icon.node.active = ! 1;
          this.num.string = "限定稀有球杆";
          p.UiManager.loadSpine(this.cue.node, "cue_spine", d.default.getCueSourceName(g), function() {
            e.cue.setAnimation(0, "animation", ! 0);
          }
);
        } else {
          this.cue.node.active = ! 1;
          this.icon.node.active = ! 0;
          this.num.string = s.default.getCashWithUnit(g);
          p.UiManager.loadSpriteFrame(this.icon.node, "reward_icon", "icon_"+ h);
        }
        var y = _[1].split("_"), v = (Number(y[0]), Number(y[1]));
        this.bigNum&& (this.bigNum.string = s.default.getCashWithUnit(v));
      } else {
        var m = l.split("_"), b = Number(m[0]), C = Number(m[1]);
        if(6 == b) {
          var P = Number(m[1]);
          C = Number(m[2]);
          var S = 44 == P? 2: 7;
          this.num.string = "x"+ C;
          p.UiManager.loadSpriteFrame(this.icon.node, "choujiang_icon", "icon_"+ S);
        } else {
          u.RewardType.HongBao == b|| u.RewardType.XianJin == b|| u.RewardType.SpecialHongBao == b? this.num.string = s.default.getCashWithUnit(C): this.num.string = "x"+ C;
          p.UiManager.loadSpriteFrame(this.icon.node, "reward_icon", "icon_"+ b);
        }
      }
    }
  }
;
  t.prototype.onEnable = function() {
    r.default.listen(l.default.UPDATE_QIANDAO, this.updateUi, this);
  }
;
  t.prototype.initData = function(e) {
    this.data = e;
    this.updateUi();
  }
;
  t.prototype.onDisable = function() {
    r.default.ignore(l.default.UPDATE_QIANDAO, this.updateUi, this);
  }
;
  a([g(cc.Node)], t.prototype, "qipao", void 0);
  a([g(cc.Node)], t.prototype, "light", void 0);
  a([g(cc.Label)], t.prototype, "day", void 0);
  a([g(cc.Label)], t.prototype, "num", void 0);
  a([g(cc.Node)], t.prototype, "successIcon", void 0);
  a([g(cc.Sprite)], t.prototype, "icon", void 0);
  a([g(cc.Label)], t.prototype, "bigNum", void 0);
  a([g(sp.Skeleton)], t.prototype, "cue", void 0);
  return a([f, h("UI/pages/items/QianDaoItemCtr")], t);
}
(cc.Component));
o.default = y;
cc._RF.pop();
