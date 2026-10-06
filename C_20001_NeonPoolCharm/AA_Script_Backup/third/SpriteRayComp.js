let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "dfc8dWKqJxPQL1ppColDQ98", "SpriteRayComp");
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
var r = cc._decorator,
l = r.ccclass,
s = r.property,
c = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.normal_node = null;
    t.normal_bianxian = null;
    t.normal_normal_line = null;
    t.normal_xuli_line = null;
    t.supper_node = null;
    t.supper_top_line = null;
    t.super_top_bg = null;
    t.supper_bottom_line = null;
    t.super_jiantou = null;
    t.isDoUpdate = null;
    t.lineColor = null;
    return t;
  }
  t.prototype.onLoad = function() {
    this.isDoUpdate = ! 1;
    this.lineColor = new Map([[201, {
      normal_bian: new cc.Color(208, 192, 0), normal_xuli: new cc.Color(255, 236, 15), sj_bianxian: new cc.Color(255, 246, 187), sj_normal: new cc.Color(251, 235, 125), sj_xuli: new cc.Color(140, 124, 17), sj_jiantou: new cc.Color(255, 227, 35)
    }
], [202, {
      normal_bian: new cc.Color(6, 0, 127), normal_xuli: new cc.Color(32, 14, 225), sj_bianxian: new cc.Color(169, 227, 224), sj_normal: new cc.Color(101, 124, 255), sj_xuli: new cc.Color(16, 164, 248), sj_jiantou: new cc.Color(32, 73, 143)
    }
], [203, {
      normal_bian: new cc.Color(183, 7, 16), normal_xuli: new cc.Color(254, 52, 105), sj_bianxian: new cc.Color(255, 156, 140), sj_normal: new cc.Color(241, 9, 75), sj_xuli: new cc.Color(254, 53, 103), sj_jiantou: new cc.Color(138, 32, 32)
    }
], [204, {
      normal_bian: new cc.Color(57, 5, 129), normal_xuli: new cc.Color(244, 41, 242), sj_bianxian: new cc.Color(255, 189, 252), sj_normal: new cc.Color(230, 62, 223), sj_xuli: new cc.Color(253, 34, 244), sj_jiantou: new cc.Color(151, 38, 146)
    }
], [205, {
      normal_bian: new cc.Color(166, 102, 0), normal_xuli: new cc.Color(243, 158, 22), sj_bianxian: new cc.Color(255, 210, 137), sj_normal: new cc.Color(250, 122, 59), sj_xuli: new cc.Color(244, 128, 17), sj_jiantou: new cc.Color(205, 82, 21)
    }
], [206, {
      normal_bian: new cc.Color(10, 96, 3), normal_xuli: new cc.Color(147, 255, 49), sj_bianxian: new cc.Color(202, 255, 154), sj_normal: new cc.Color(154, 232, 86), sj_xuli: new cc.Color(147, 255, 49), sj_jiantou: new cc.Color(59, 110, 25)
    }
], [207, {
      normal_bian: new cc.Color(86, 3, 5), normal_xuli: new cc.Color(182, 13, 16), sj_bianxian: new cc.Color(255, 187, 188), sj_normal: new cc.Color(213, 56, 93), sj_xuli: new cc.Color(203, 20, 66), sj_jiantou: new cc.Color(161, 39, 68)
    }
], [208, {
      normal_bian: new cc.Color(0, 0, 0), normal_xuli: new cc.Color(0, 0, 0), sj_bianxian: new cc.Color(255, 255, 255), sj_normal: new cc.Color(96, 96, 96), sj_xuli: new cc.Color(77, 77, 77), sj_jiantou: new cc.Color(59, 59, 59)
    }
], [209, {
      normal_bian: new cc.Color(208, 192, 0), normal_xuli: new cc.Color(255, 236, 15), sj_bianxian: new cc.Color(255, 246, 187), sj_normal: new cc.Color(251, 235, 125), sj_xuli: new cc.Color(140, 124, 17), sj_jiantou: new cc.Color(255, 227, 35)
    }
], [210, {
      normal_bian: new cc.Color(6, 0, 127), normal_xuli: new cc.Color(32, 14, 225), sj_bianxian: new cc.Color(169, 227, 224), sj_normal: new cc.Color(101, 124, 255), sj_xuli: new cc.Color(16, 164, 248), sj_jiantou: new cc.Color(32, 73, 143)
    }
], [211, {
      normal_bian: new cc.Color(183, 7, 16), normal_xuli: new cc.Color(254, 52, 105), sj_bianxian: new cc.Color(255, 156, 140), sj_normal: new cc.Color(241, 9, 75), sj_xuli: new cc.Color(254, 53, 103), sj_jiantou: new cc.Color(138, 32, 32)
    }
], [212, {
      normal_bian: new cc.Color(57, 5, 129), normal_xuli: new cc.Color(244, 41, 242), sj_bianxian: new cc.Color(255, 189, 252), sj_normal: new cc.Color(230, 62, 223), sj_xuli: new cc.Color(253, 34, 244), sj_jiantou: new cc.Color(151, 38, 146)
    }
], [213, {
      normal_bian: new cc.Color(166, 102, 0), normal_xuli: new cc.Color(243, 158, 22), sj_bianxian: new cc.Color(255, 210, 137), sj_normal: new cc.Color(250, 122, 59), sj_xuli: new cc.Color(244, 128, 17), sj_jiantou: new cc.Color(205, 82, 21)
    }
], [214, {
      normal_bian: new cc.Color(10, 96, 3), normal_xuli: new cc.Color(147, 255, 49), sj_bianxian: new cc.Color(202, 255, 154), sj_normal: new cc.Color(154, 232, 86), sj_xuli: new cc.Color(147, 255, 49), sj_jiantou: new cc.Color(59, 110, 25)
    }
], [215, {
      normal_bian: new cc.Color(86, 3, 5), normal_xuli: new cc.Color(182, 13, 16), sj_bianxian: new cc.Color(255, 187, 188), sj_normal: new cc.Color(213, 56, 93), sj_xuli: new cc.Color(203, 20, 66), sj_jiantou: new cc.Color(161, 39, 68)
    }
]]);
  }
;
  t.prototype.reset = function(e, t, o, n) {
    this.node.angle = o/ Math.PI* 180+ 90;
    this.node.height = t;
    this.normal_node.active = ! n;
    this.supper_node.active = n;
  }
;
  t.prototype.setPowerPercent = function(e) {
    this.normal_xuli_line.height = this.node.height* e;
    this.supper_bottom_line.height = this.node.height* e;
  }
;
  t.prototype.update = function() {
  }
;
  t.prototype.resetWillGo = function(e, t, o, n, i) {
    var a;
    a = e- 90;
    this.node.angle = a;
    this.node.height = t;
    this.normal_node.active = ! n;
    this.supper_node.active = n;
    var r = i.getComponent("Ball2DControl").ballID,
    l = this.lineColor.get(r);
    l|| (l = this.lineColor.get(201));
    this.normal_xuli_line.color = l.normal_xuli;
    this.normal_bianxian&& (this.normal_bianxian.color = l.normal_bian);
    this.supper_top_line&& (this.supper_top_line.color = l.sj_bianxian);
    this.super_top_bg&& (this.super_top_bg.color = l.sj_normal);
    this.supper_bottom_line&& (this.supper_bottom_line.color = l.sj_xuli);
    this.super_jiantou&& (this.super_jiantou.color = l.sj_jiantou);
  }
;
  a([s(cc.Node)], t.prototype, "normal_node", void 0);
  a([s(cc.Node)], t.prototype, "normal_bianxian", void 0);
  a([s(cc.Node)], t.prototype, "normal_normal_line", void 0);
  a([s(cc.Node)], t.prototype, "normal_xuli_line", void 0);
  a([s(cc.Node)], t.prototype, "supper_node", void 0);
  a([s(cc.Node)], t.prototype, "supper_top_line", void 0);
  a([s(cc.Node)], t.prototype, "super_top_bg", void 0);
  a([s(cc.Node)], t.prototype, "supper_bottom_line", void 0);
  a([s(cc.Node)], t.prototype, "super_jiantou", void 0);
  return a([l], t);
}
(cc.Component);
o.default = c;
cc._RF.pop();
