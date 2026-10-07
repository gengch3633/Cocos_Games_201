let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "d4ce105yotHj4l/b131C8Ae", "game_table_editor");
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
l = e("GameMgr.js"),
s = e("GlobalConfig.js"),
c = cc._decorator,
u = c.ccclass,
p = c.property;
function d(e, t) {
  var o;
  if("undefined" == typeof Symbol|| null == e[Symbol.iterator]) {
    if(Array.isArray(e)|| (o = _(e))|| t&& e&& "number" == typeof e.length) {
      o&& (e = o);
      var n = 0;
      return function() {
        return n >= e.length? {
          done: ! 0
        }
: {
          done: ! 1,
          value: e[n++]
        }
;
      }
;
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  return(o = e[Symbol.iterator]()).next.bind(o);
}
function _(e, t) {
  if(e) {
    if("string" == typeof e) return f(e, t);
    var o = Object.prototype.toString.call(e).slice(8, - 1);
    "Object" === o&& e.constructor&& (o = e.constructor.name);
    return "Map" === o|| "Set" === o? Array.from(e): "Arguments" === o|| / ^(?: Ui| I) nt(?: 8| 16| 32)(?: Clamped)? Array$/.test(o)? f(e, t): void 0;
  }
}
function f(e, t) {
(null == t|| t > e.length)&& (t = e.length);
  for(var o = 0, n = new Array(t);
  o < t;
  o++) n[o] = e[o];
  return n;
}
var h = s.Editor_MaxBallSize|| 25,
g = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.ball_model_Prefab = null;
    t.newBall_Prefab = null;
    t.white_newBall_Prefab = null;
    t.ui_condition_Prefab = null;
    t.ballIdx = null;
    t.ui_condition = null;
    t.ballMap = null;
    t.ballMatIdxs = null;
    t.tableInfo = null;
    return t;
  }
  t.prototype.onLoad = function() {
    var e = this;
    s.debug_alpha&& (this.node.opacity = 25);
    this.ui_condition = cc.instantiate(this.ui_condition_Prefab);
    this.ui_condition.getComponent("game_UI_condition").setCallback(function(t) {
      var o = e.saveTableInfo(0);
      console.log("tableInfo && conditionInfo", o, t);
      if(o&& t) {
        if(! o.balls) {
          e.showTip("请选择目标球");
          return;
        }
        if(o.balls.length <= 1) return;
        o.condition = t;
        var n = r.pack_PublicTableInfo(o, ! 0);
        l.local_set(l.LSKEY_EditingTableInfo, n);
        e.node.destroy();
        r.gotoTable_editing(o);
      }
    }
);
    this.ballMap = new Map();
    this.ballIdx = 0;
    this.ballMatIdxs = [];
    for(var t = cc.find("node_table", this.node), o = (cc.find("node_ball_model_white", this.node), cc.find("node_ballModel_container", this.node)), n = 0;
    n < 5;
    n++) {
(p = cc.instantiate(this.ball_model_Prefab)).parent = o;
      p.y = 90*- n;
      p.scale = 2;
      var i = n+ 2;
      p.getComponent("BallMaterialComp").setMatIdx(i);
      this.addTouchEvent(p, t);
      this.ballMatIdxs.push(i);
    }
    var a = r.shop_config(),
    c = cc.find("node_ballModel_container2", this.node),
    u = s.shop_ball_get().arr;
    for(n = 0;
    n < u.length;
    n++) {
      var p,
      d = u[n],
      _ = r.getBy_cid(d, a.balls_more);
(p = cc.instantiate(this.ball_model_Prefab)).parent = c;
      p.y = 90*- n;
      p.scale = 2;
      i = _.matIdx;
      p.getComponent("BallMaterialComp").setMatIdx(i);
      this.addTouchEvent(p, t);
      this.ballMatIdxs.push(i);
    }
    cc.find("button_ok", this.node).on("click", function() {
      var t = e.saveTableInfo(0);
      console.log("button_ok", t);
      if(t) {
        console.log("tableInfo", t, t.balls);
        if(! t.balls) {
          e.showTip("无法保存空场景");
          return;
        }
        if(t.balls.length <= 1) {
          e.showTip("无法保存空场景");
          return;
        }
        if(e.checkBallsCollide()) {
          e.showTip("有重叠，无法保存");
          return;
        }
        if(e.getMatNum() >= 8) {
          e.showTip("球的种类太多了!");
          return;
        }
        e.ui_condition.parent = e.node;
        for(var o = [], n = cc.find("node_table", e.node).children, i = 0;
        i < n.length;
        i++) {
          var a = n[i];
          if(a.getComponent("BallControlInEditor")) {
            var r = a.getComponent("BallControlInEditor").ballID, l = a.getComponent("BallControlInEditor").getMatIdx();
            console.log("matIdx ballID", l, r);
            o.indexOf(l) < 0&& 100 != r&& o.push(l);
          }
        }
        e.ui_condition.getComponent("game_UI_condition").setMatIdxs(o);
      } else e.showTip("无法保存空场景");
    }
);
    cc.find("button_back", this.node).on("click", function() {
      var t = e.saveTableInfo();
      if(t) {
        var o = r.pack_PublicTableInfo(t, ! 0);
        l.local_set(l.LSKEY_EditingTableInfo, o);
      }
      e.node.destroy();
      r.backtoInfoList();
    }
);
    cc.find("button_clear", this.node).on("click", function() {
      e.clear();
      e.showTip("已经清空！");
    }
);
    cc.find("button_save2", this.node).on("click", function() {
      var t = e.saveTableInfo(), o = r.pack_PublicTableInfo(t, ! 0);
      l.local_set(l.LSKEY_EditingTableInfo, o);
    }
);
    r.editingTableInfo? this.loadTableInfo(r.editingTableInfo): console.log("into editor but no editingTableInfo", r.editingTableInfo);
    this.node.on(cc.Node.EventType.TOUCH_START, function(o) {
      console.log("TOUCH_START");
      var n = cc.v2(o.touch._point.x, o.touch._point.y), i = t.convertToNodeSpaceAR(n);
      e.sel_ball = e.checkBallClicked(i);
      e.sel_ball&& e.sel_ball.getComponent("BallControlInEditor").onStart(o);
    }
);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, function(t) {
      console.log("TOUCH_MOVE");
      if(e.sel_ball) {
        var o = cc.v2(t.touch._point.x, t.touch._point.y), n = e.sel_ball.parent.convertToNodeSpaceAR(o);
        e.checkNewPosAvailable(e.sel_ball, n)&& e.sel_ball.getComponent("BallControlInEditor").onMove(t);
      }
    }
);
    this.node.on(cc.Node.EventType.TOUCH_END, function(t) {
      console.log("TOUCH_END");
      e.sel_ball&& e.sel_ball.getComponent("BallControlInEditor").onEnd(t);
      e.sel_ball = null;
    }
);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(t) {
      console.log("TOUCH_CANCEL");
      e.sel_ball&& e.sel_ball.getComponent("BallControlInEditor").onCancel(t);
      e.sel_ball = null;
    }
);
  }
;
  t.prototype.update = function() {
  }
;
  t.prototype.loadTableInfo = function(e) {
    console.log("loadTableInfo", e);
    this.tableInfo = e;
    for(var t = null, o = this, n = cc.find("node_table", this.node), i = cc.find("node_table", this.node).getChildByName("node_ball_model_white"), a = 0;
    a < this.tableInfo.balls.length;
    a++) {
      var l = this.tableInfo.balls[a];
      if(l.ballType == r.BallIDType_Normal) {
(t = cc.instantiate(o.newBall_Prefab)).parent = n;
        t.getComponent("BallControlInEditor").node_editor = o;
        t.getComponent("BallControlInEditor").ballType = l.ballType;
        t.getComponent("BallControlInEditor").ballID = l.ballID;
        t.getComponent("BallControlInEditor").setMatIdx(l.ballMatIdx);
        t.getComponent("BallControlInEditor").deleteFun(function(e) {
          o.delleteOne(e);
        }
);
        t.x = Math.floor(l.x);
        t.y = Math.floor(l.y);
        this.ballMap.set(t, l);
      } else {
        i.x = Math.floor(l.x);
        i.y = Math.floor(l.y);
      }
    }
  }
;
  t.prototype.getMatNum = function() {
    for(var e, t = [], o = d(this.ballMap.entries());
!(e = o()).done;
) {
      var n = e.value,
      i = (n[0], n[1]);
      t.indexOf(i.ballMatIdx) < 0&& t.push(i.ballMatIdx);
    }
    return t.length;
  }
;
  t.prototype.showTip = function(e) {
    cc.find("node_floatTip", this.node).getComponent("FloatTipComp").show(e);
  }
;
  t.prototype.checkBallClicked = function(e) {
    for(var t, o = 30, n = null, i = d(this.ballMap.entries());
!(t = i()).done;
) {
      var a = t.value,
      r = a[0],
      l = (a[1], cc.v2(r.x, r.y)),
      s = cc.Vec2.distance(e, l);
      console.log("len", s);
      if(s <= o) {
        o = s;
        n = r;
      }
    }
    var c = cc.find("node_table", this.node).getChildByName("node_ball_model_white");
    l = cc.v2(c.x, c.y);
    if((s = cc.Vec2.distance(e, l)) <= o) {
      o = s;
      n = c;
    }
    return n;
  }
;
  t.prototype.saveTableInfo = function(e) {
    e = e|| 0;
    for(var t, o = [], n = 100* r.BallIDType_Normal, i = d(this.ballMap.entries());
!(t = i()).done;
) {
      var a = t.value,
      l = a[0],
      s = a[1],
      c = r.pack_BallInfo(n, s.ballType, Math.floor(l.x), Math.floor(l.y), s.ballMatIdx);
      o.push(c);
      n+= 1;
    }
    var u = cc.find("node_table", this.node).getChildByName("node_ball_model_white"),
    p = r.pack_BallInfo(100* r.BallIDType_White, r.BallIDType_White, Math.floor(u.x), Math.floor(u.y));
    o.push(p);
    if(o.length > 0&& this.tableInfo) {
      this.tableInfo.balls = o;
      return this.tableInfo;
    }
    console.log("saveTableInfo failed", o.length > 0, this.tableInfo);
    return null;
  }
;
  t.prototype.clear = function() {
    for(var e, t = d(this.ballMap.entries());
!(e = t()).done;
) {
      var o = e.value,
      n = o[0];
      o[1];
      n.parent = null;
      n.destroy();
    }
    this.ballMap.clear();
    this.ballIdx = 0;
    var i = cc.find("node_table", this.node).getChildByName("node_ball_model_white");
    i.x = 0;
    i.y = - 195;
  }
;
  t.prototype.delleteOne = function(e) {
    if(this.ballMap.get(e)) {
      this.ballMap.delete(e);
      this.ballIdx = this.ballIdx- 1;
    }
  }
;
  t.prototype.checkNewPosAvailable = function(e, t) {
    for(var o, n = cc.find("node_table", this.node).getChildByName("node_ball_model_white"), i = d(this.ballMap.entries());
!(o = i()).done;
) {
      var a = o.value,
      r = a[0];
      a[1];
      if(r != e) {
        var l = cc.Vec2.distance(cc.v2(r.x, r.y), cc.v2(t.x, t.y));
        console.log("len", l, l <= 32);
        if(l <= 32) return ! 1;
      }
    }
    return !((r = n) != e&& (l = cc.Vec2.distance(cc.v2(r.x, r.y), cc.v2(t.x, t.y))) <= 32);
  }
;
  t.prototype.saveOne = function(e) {
    var t = {
      x: Math.floor(e.x),
      y: Math.floor(e.y),
      ballType: e.getComponent("BallControlInEditor").ballType,
      ballMatIdx: e.getComponent("BallControlInEditor").getMatIdx()
    }
;
    this.ballMap.set(e, t);
    this.ballIdx = this.ballIdx+ 1;
    console.log("saveOne", this.ballMap.size, e.getComponent("BallControlInEditor").getMatIdx());
  }
;
  t.prototype.callback = function() {
  }
;
  t.prototype.checkAvailable = function(e) {
    var t = cc.find("node_table", this.node).getChildByName("node_checkRect");
    if(! cc.rect(- t.width/ 2, - t.height/ 2, t.width, t.height).contains(cc.v2(e.x, e.y))) {
      console.log("not contains");
      return ! 1;
    }
    return ! 0;
  }
;
  t.prototype.addTouchEvent = function(e, t, o) {
    var n = this,
    i = null;
    o = o|| r.BallIDType_Normal;
    e.on(cc.Node.EventType.TOUCH_START, function(a) {
      console.log("TOUCH_START");
      var r = cc.v2(a.touch._point.x, a.touch._point.y), l = t.convertToNodeSpaceAR(r);
(i = cc.instantiate(n.newBall_Prefab)).parent = t;
      i.getComponent("BallControlInEditor").node_editor = n;
      i.getComponent("BallControlInEditor").ballType = o;
      i.getComponent("BallControlInEditor").setMatIdx(e.getComponent("BallMaterialComp").getMatIdx());
      i.getComponent("BallControlInEditor").deleteFun(function(e) {
        n.delleteOne(e);
      }
);
      i.x = Math.floor(l.x);
      i.y = Math.floor(l.y);
    }
);
    e.on(cc.Node.EventType.TOUCH_MOVE, function(e) {
      if(i) {
        var o = cc.v2(e.touch._point.x, e.touch._point.y), a = t.convertToNodeSpaceAR(o);
        if(n.checkNewPosAvailable(i, a)) {
          i.x = Math.floor(a.x);
          i.y = Math.floor(a.y);
        }
      }
    }
);
    e.on(cc.Node.EventType.TOUCH_END, function() {
      console.log("TOUCH_END");
      if(i) {
        i.parent = null;
        i.destroy();
      }
      i = null;
    }
);
    e.on(cc.Node.EventType.TOUCH_CANCEL, function() {
      console.log("TOUCH_CANCEL", n.getMatNum());
      if(n.checkAvailable(i)) {
        if(n.getMatNum() >= 8) {
          i.parent = null;
          i.destroy();
          n.showTip("球的种类太多了!");
        } else if(n.ballMap.size < h) n.saveOne(i);
        else {
          i.parent = null;
          i.destroy();
          n.showTip("球的数量超过限制了!");
        }
      } else {
        i.parent = null;
        i.destroy();
      }
      i = null;
    }
);
  }
;
  t.prototype.onDestroy = function() {
    console.log("****game_table_editor destroyed***");
    this.ui_condition.destroy();
  }
;
  t.prototype.checkBallsCollide = function() {
    for(var e, t = [cc.find("node_table", this.node).getChildByName("node_ball_model_white")], o = d(this.ballMap.entries());
!(e = o()).done;
) {
      var n = e.value,
      i = n[0];
      n[1];
      t.push(i);
    }
    for(var a = 0;
    a < t.length;
    a++) for(var r = t[a], l = 0;
    l < t.length;
    l++) if(r != t[l]) {
      var s = cc.Vec2.distance(cc.v2(r.x, r.y), cc.v2(t[l].x, t[l].y));
      console.log("len", s);
      if(s <= 30) return ! 0;
    }
    return ! 1;
  }
;
  a([p(cc.Prefab)], t.prototype, "ball_model_Prefab", void 0);
  a([p(cc.Prefab)], t.prototype, "newBall_Prefab", void 0);
  a([p(cc.Prefab)], t.prototype, "white_newBall_Prefab", void 0);
  a([p(cc.Prefab)], t.prototype, "ui_condition_Prefab", void 0);
  return a([u], t);
}
(cc.Component);
o.default = g;
cc._RF.pop();
