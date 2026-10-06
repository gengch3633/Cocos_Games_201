let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "30052IBlcFHLKVxDMAeCJMT", "rankItem");
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
    t.rankItem = null;
    t.node = null;
    t.rank_item_bg = null;
    t.rank_num = null;
    t.rank_1 = null;
    t.rank_2 = null;
    t.rank_3 = null;
    t.people = null;
    t.level = null;
    t.cash = null;
    return t;
  }
  t.prototype.onLoad = function() {
    this.rankItem = this.node;
    this.rank_item_bg = this.rankItem.getChildByName("rank_item_bg");
    this.rank_num = this.rankItem.getChildByName("rank_num");
    this.rank_1 = this.rankItem.getChildByName("rank_1");
    this.rank_2 = this.rankItem.getChildByName("rank_2");
    this.rank_3 = this.rankItem.getChildByName("rank_3");
    this.people = this.rankItem.getChildByName("people");
    this.level = this.rankItem.getChildByName("level");
    this.cash = this.rankItem.getChildByName("cash");
  }
;
  t.URL = "db://assets/resources/prefabs/rankItem.prefab";
  return a([r], t);
}
(cc.Component);
o.default = l;
cc._RF.pop();
