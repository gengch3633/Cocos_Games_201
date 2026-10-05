let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "7e73cN7FeJJTZ4IzaSceIu3", "RankItemCtrl");
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
var r = e(PlayerDataSys "
  }].js),
      l = e(" rankItem.js "),
      s = cc._decorator,
      c = s.ccclass,
      u = s.menu;
    cc._decorator.property;
    var p = function (e) {
      i(t, e);
      function t() {
        var t = null !== e && e.apply(this, arguments) || this;
        t.ui = null;
        return t;
      }
      t.prototype.onUILoad = function () {
        this.ui = this.node.addComponent(l.default);
      };
      t.prototype.setData = function (e) {
        this.initData(e);
      };
      t.prototype.start = function () {};
      t.prototype.addButtonListen = function () {};
      t.prototype.onLoad = function () {
        this.onUILoad();
        this.addButtonListen();
      };
      t.prototype.initData = function (e) {
        if (e) {
          this.ui.rank_1.active = 1 == e[0];
          this.ui.rank_2.active = 2 == e[0];
          this.ui.rank_3.active = 3 == e[0];
          this.ui.rank_item_bg.active = 0 == Number(e[0] % 2);
          this.ui.rank_num.getComponent(cc.Label).string = e[0];
          this.ui.people.getComponent(cc.Label).string = e[1];
          this.ui.level.getComponent(cc.Label).string = e[2];
          this.ui.cash.getComponent(cc.Label).string = r.default.getCashWithUnit(e[3]);
        }
      };
      t.prefabUrl = " assets/ resources/ prefabs/ rankItem ";
      t.className = " RankItemCtrl ";
      return a([c, u(" UI/ prefabs/ RankItemCtrl ")], t);
    }(cc.Component);
    o.default = p;
    cc._RF.pop();
