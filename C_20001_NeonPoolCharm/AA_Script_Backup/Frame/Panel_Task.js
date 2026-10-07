let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "20947eS8KVG/o/Af/SrsV5t", "Panel_Task");
var o,
n = this&& this.__extends|| (o = function(e, t) {
  return(o = Object.setPrototypeOf|| {
    __proto__:[]
  }
  instanceof Array&& function(e, t) {
    e.__proto__ = t;
  }
|| function(e, t) {
    for(var a in t) Object.prototype.hasOwnProperty.call(t, a)&& (e[a] = t[a]);
  }
)(e, t);
}
, function(e, t) {
  o(e, t);
  function a() {
    this.constructor = e;
  }
  e.prototype = null === t? Object.create(t):(a.prototype = t.prototype, new a());
}
),
i = this&& this.__decorate|| function(e, t, a, o) {
  var n,
  i = arguments.length,
  r = i < 3? t: null === o? o = Object.getOwnPropertyDescriptor(t, a): o;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, a, o);
  else for(var c = e.length- 1;
  c >= 0;
  c--)(n = e[c])&& (r = (i < 3? n(r): i > 3? n(t, a, r): n(t, a))|| r);
  return i > 3&& r&& Object.defineProperty(t, a, r),
  r;
}
;
Object.defineProperty(a, "__esModule", {
  value: ! 0
}
);
var r = e("CLICKLOCK.js"),
c = e("FrameData.js"),
s = e("FrameSDK.js"),
l = cc._decorator,
u = l.ccclass,
d = l.property,
p = function(e) {
  n(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.panel_window = null;
    t.scrollview = null;
    t.totalBonusLabel = null;
    t.tips = null;
    t.node_content = null;
    t._close_target = null;
    t._scrollViewDesignHeight = 0;
    t.viewData = null;
    return t;
  }
  a = t;
  t.startTask = function(e) {
    c.FrameData.saveData.lvAwardinfo? s.FrameSDK.openWindow("Panel_Task", {
      closeCB: e
    }
): s.FrameSDK.frameData.gameData.passLevel >= c.FrameData.FRAME_CONF.taskLevel? s.FrameSDK.openWindow("Panel_ActivityGuide", {
      type: 1, logoType: "levelReward", dtime: 2.5, text: "skey_072", closeCB: function() {
        s.FrameSDK.openWindow("Panel_Task", {
          closeCB: e
        }
);
      }
    }
): null == e|| e();
  }
;
  t.prototype.onBtnEvent = function(e, t) {
    s.FrameSDK.logGameEvent("thepool_game_act", {
      object_action: "show", object_name: "lvrew_get"
    }
);
    c.FrameData.saveData.lvAwardinfo.push(Number(t));
    for(var a = c.FrameData.getCoinOutNum("free"), o = 0, n = c.FrameData.FRAME_CONF.TaskConfig;
    o < n.length;
    o++) {
      var i = n[o];
      if(i.task_id.toString() == t) {
        a = i.task_num;
        break;
      }
    }
    s.FrameSDK.addCoin(a, 0, 0);
    this.onTouchClose();
  }
;
  t.prototype.onEnable = function() {
    s.FrameSDK.openEffect(this);
    s.FrameSDK.playEffect("page_show");
    this.updateUi();
  }
;
  t.isTaskFinish = function() {
    if(c.FrameData.saveData.lvAwardinfo) for(var e = c.FrameData.FRAME_CONF.TaskConfig.filter(function(e) {
      return- 1 == c.FrameData.saveData.lvAwardinfo.indexOf(e.task_id);
    }
), t = 0;
    t < e.length;
    t++) if(s.FrameSDK.frameData.gameData.passLevel >= e[t].task_lv) return ! 0;
    return ! 1;
  }
;
  t.prototype.onTouchClose = function() {
    cc.director.emit("UPDATA_TASK");
    s.FrameSDK.closeEffect(this, null);
  }
;
  t.openTask = function(e) {
    null == c.FrameData.saveData.lvAwardinfo&& s.FrameSDK.frameData.gameData.passLevel >= c.FrameData.FRAME_CONF.taskLevel&& a.startTask(e);
  }
;
  t.prototype.onLoad = function() {
    this._close_target = a.coinTarget;
    this._scrollViewDesignHeight = this.scrollview.node.height;
    if(null == c.FrameData.saveData.lvAwardinfo) {
      c.FrameData.saveData.lvAwardinfo = [];
      s.FrameSDK.logGameEvent("thepool_game_act", {
        object_action: "show", object_name: "lvrew_start"
      }
, ! 0);
    }
  }
;
  t.prototype.updateUi = function() {
    for(var e, t = this, a = JSON.parse(JSON.stringify(c.FrameData.FRAME_CONF.TaskConfig)).reverse(), o = s.FrameSDK.frameData.gameData.passLevel, n = null, i = 0, r = 0;
    r < a.length;
    r++) {
      var l = a[r];
      i+= l.task_num;
      var u = null !== (e = this.node_content.children[r])&& void 0 !== e? e: cc.instantiate(this.node_content.children[0]);
      u.parent = this.node_content;
      var d = cc.find("box", u);
      cc.find("label_lv", u).getComponent(cc.Label).string = l.task_lv.toString();
      cc.find("label_coin", d).getComponent(cc.Label).string = "x"+ s.FrameSDK.convertCoinToStr(l.task_num);
      var p = u.getComponent(cc.Button);
      p.interactable = o >= l.task_lv&& - 1 == c.FrameData.saveData.lvAwardinfo.indexOf(l.task_id);
      p.clickEvents[0].customEventData = l.task_id.toString();
      null === n&& (p.interactable? n = r: o >= l.task_lv&& (n = r));
      var h = cc.find("toplight_taiq", d),
      m = cc.find("light", d),
      f = cc.find("mengban", d),
      _ = cc.find("load1", u),
      v = cc.find("lvhuang", u);
      if(o >= l.task_lv) {
        _.active = ! 0;
        v.active = ! 0;
        if(p.interactable) {
          h.active = ! 0;
          m.active = ! 0;
          f.active = ! 1;
        } else {
          h.active = ! 1;
          m.active = ! 1;
          f.active = ! 0;
        }
      } else {
        h.active = ! 1;
        m.active = ! 0;
        f.active = ! 1;
        _.active = ! 1;
        v.active = ! 1;
      }
      d.stopAllActions();
      d.x = 0;
(h.active|| l.task_lv- o == 1)&& cc.tween(d).to(.5, {
        x: 10
      }
, {
        easing: "sineInOut"
      }
).to(.5, {
        x:- 10
      }
, {
        easing: "sineInOut"
      }
).union().repeatForever().start();
    }
    this.totalBonusLabel.string = "x"+ s.FrameSDK.convertCoinToStr(i);
    this.tips.string = "skey_071??&value1=="+ s.FrameSDK.convertCoinToStr(i);
    this.scheduleOnce(function() {
      var e = (cc.winSize.height- cc.director.getScene().getComponentInChildren(cc.Canvas).designResolution.height)/ 2;
      t.scrollview.node.setContentSize(t.scrollview.node.width, t.scrollview.node.height+ e);
      t.scrollview.node.getComponentInChildren(cc.Widget).updateAlignment();
      if(null != n) {
        var o = t.scrollview.getMaxScrollOffset();
        o.y = o.y*(n/(a.length- 1));
        t.scrollview.scrollToOffset(o, 2);
      } else t.scrollview.scrollToBottom(2);
    }
);
  }
;
  t.prototype.onDisable = function() {
    this.node_content.children.forEach(function(e) {
      e.active = ! 1;
    }
);
    var e,
    t;
    null === (t = (e = this.viewData).closeCB)|| void 0 === t|| t.call(e);
  }
;
  var a;
  t.coinTarget = null;
  i([d(cc.Node)], t.prototype, "panel_window", void 0);
  i([d(cc.ScrollView)], t.prototype, "scrollview", void 0);
  i([d(cc.Label)], t.prototype, "totalBonusLabel", void 0);
  i([d(cc.Label)], t.prototype, "tips", void 0);
  i([d(cc.Node)], t.prototype, "node_content", void 0);
  i([r.CLICKLOCK()], t.prototype, "onBtnEvent", null);
  return a = i([u], t);
}
(cc.Component);
a.default = p;
cc._RF.pop();
