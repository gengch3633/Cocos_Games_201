let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "76a94FhIaNJ+r6OUi682I5L", "PropBtnCtrl");
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
var r = e("PageMgr.js"),
l = e("EventMgr.js"),
s = e("GameEventType.js"),
c = e("PlayerDataSys.js"),
u = e(ConfigDataMgr "
  }].js),
      p = e(" UiManage.js "),
      d = cc._decorator,
      _ = d.ccclass,
      f = d.menu,
      h = d.property,
      g = (cc._decorator, function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.prop_id = u.EPropID.E_CiTie;
          t.add_icon = null;
          t.count_root = null;
          t.citie_prop_count_label = null;
          t._clickBlocked = null;
          return t;
        }
        t.prototype.onLoad = function () {};
        t.prototype.updateUI = function () {
          var e = c.default.getPropCount(this.prop_id);
          this.add_icon.active = e < 1;
          this.count_root.active = e > 0;
          this.citie_prop_count_label.getComponent(cc.Label).string = e;
        };
        t.prototype.onUpdataProp = function () {
          this.prop_id == this.prop_id && this.updateUI();
        };
        t.prototype.start = function () {
          p.UiManager.addButtonListen(this.node, this.onThisClicked, this);
        };
        t.prototype.removeEvent = function () {
          l.default.ignore(s.default.UPDATE_PROP_ICON, this.onUpdataProp, this);
        };
        t.prototype.useProp = function () {
          if (!c.default.checkPropUseTimes(this.prop_id)) return !1;
          l.default.trigger(s.default.USE_PROP, this.prop_id);
          return !0;
        };
        t.prototype.addEvent = function () {
          l.default.trigger(s.default.UPDATE_PROP_ICON);
          l.default.listen(s.default.UPDATE_PROP_ICON, this.onUpdataProp, this);
        };
        t.prototype.onDisable = function () {
          this.removeEvent();
        };
        t.prototype.onEnable = function () {
          this._clickBlocked = !1;
          this.addEvent();
          this.updateUI();
        };
        t.prototype.onThisClicked = function () {
          var e = this;
          if (!this._clickBlocked) {
            this._clickBlocked = !0;
            if (c.default.getPropCount(this.prop_id)) {
              this.useProp();
              this.scheduleOnce(function () {
                e._clickBlocked = !1;
              }, .2);
            } else {
              r.default.showPage(" BuyPropPage ", {
                prop_id: this.prop_id
              });
              this._clickBlocked = !1;
            }
          }
        };
        a([h({
          tooltip: " 加号 ",
          type: cc.Enum(u.EPropID)
        })], t.prototype, " prop_id ", void 0);
        a([h({
          tooltip: " 加号 ",
          type: cc.Node
        })], t.prototype, " add_icon ", void 0);
        a([h({
          tooltip: " 计数根节点 ",
          type: cc.Node
        })], t.prototype, " count_root ", void 0);
        a([h({
          tooltip: " 道具数量 ",
          type: cc.Node
        })], t.prototype, " citie_prop_count_label ", void 0);
        return a([_, f(" UI/ pages/ items/ PropBtnCtrl ")], t);
      }(cc.Component));
    o.default = g;
    cc._RF.pop();
