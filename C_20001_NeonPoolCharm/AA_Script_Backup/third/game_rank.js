let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "7d2afid3QNOFYxTj/ssw1R9", "game_rank");
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
var r = e("BallLogicMgr.js"),
l = cc._decorator,
s = l.ccclass,
c = l.property,
u = {
  Free: 0,
  GK: 1
}
,
p = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.node_page_item_Prefab = null;
    t.pageItems = null;
    t.pageType = null;
    t.pageIdx = null;
    return t;
  }
  t.prototype.callback = function() {
  }
;
  t.prototype.onLoad = function() {
    var e = this;
    this.pageItems = [];
    this.pageType = u.Ball;
    this.initPageItems();
    this.hideAllItems();
    cc.find("button_prev", this.node).on("click", function() {
      e.updatePageItems(e.pageIdx- 1);
    }
);
    cc.find("button_next", this.node).on("click", function() {
      e.updatePageItems(e.pageIdx+ 1);
    }
);
    cc.find("button_back", this.node).on("click", function() {
      r.gotoHall();
    }
);
    var t = cc.find("toggleContainer", this.node);
    t.getChildByName("toggle1").on("toggle", function() {
      e.pageType = u.Free;
      e.pageIdx = 0;
      e.updatePageItems();
    }
);
    t.getChildByName("toggle2").on("toggle", function() {
      e.pageType = u.GK;
      e.pageIdx = 0;
      e.updatePageItems();
    }
);
    this.pageType = u.Free;
    this.pageIdx = 0;
    this.updatePageItems();
  }
;
  t.prototype.hideAllItems = function() {
  }
;
  t.prototype.showTip = function(e) {
    cc.find("node_floatTip", this.node).getComponent("FloatTipComp").show(e);
  }
;
  t.prototype.initPageItems = function() {
    this.pageItems = [];
    for(var e = cc.find("node_page", this.node), t = 0;
    t < 8;
    t++) {
      var o = cc.instantiate(this.node_page_item_Prefab);
      o.getComponent("RankListItemComp").idx = t;
      o.parent = e;
      o.y = - 50- 105* t;
      this.pageItems.push(o);
    }
  }
;
  t.prototype.destroyAllItems = function() {
    for(var e = 0;
    e < 6;
    e++) this.pageItems[e].destroy();
  }
;
  t.prototype.update = function() {
  }
;
  t.prototype.updatePageItems = function(e) {
(e = e|| 0) < 0&& (e = 0);
  }
;
  t.prototype.onDestroy = function() {
    this.destroyAllItems();
  }
;
  a([c(cc.Prefab)], t.prototype, "node_page_item_Prefab", void 0);
  return a([s], t);
}
(cc.Component);
o.default = p;
cc._RF.pop();
