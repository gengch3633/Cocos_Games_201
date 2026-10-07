let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "d232cHdpBxOPoTRp4cwgUdP", "GodGuide");
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
o.TouchType = void 0;
var r = e("GodCommand.js"),
l = e("GuideFinger.js"),
s = e("Locator.js"),
c = e("GameServiceMgr.js"),
u = e("AudioManager.js"),
p = e("SdkHelper.js"),
d = e("PlayerDataSys.js"),
_ = e("SystemDataSys.js"),
f = cc._decorator,
h = f.ccclass,
g = f.property,
y = 2* Math.PI/ 360;
function v(e, t, o) {
  var n = cc.v2(),
  i = - t* y;
  n.x = (e.x- o.x)* Math.cos(i)-(e.y- o.y)* Math.sin(i)+ o.x;
  n.y = (e.x- o.x)* Math.sin(i)+(e.y- o.y)* Math.cos(i)+ o.y;
  return n;
}
function m(e, t, o) {
  return[cc.v2(e.x, e.y), cc.v2(e.x+ e.width, e.y), cc.v2(e.x+ e.width, e.y+ e.height), cc.v2(e.x, e.y+ e.height)].map(function(e) {
    return v(e, t, o);
  }
);
}
function b(e) {
  var t = document.documentElement,
  o = window.pageXOffset- t.clientLeft,
  n = window.pageYOffset- t.clientTop;
  if("function" == typeof e.getBoundingClientRect) {
    var i = e.getBoundingClientRect();
    return {
      left: i.left+ o,
      top: i.top+ n,
      width: i.width,
      height: i.height
    }
;
  }
  return e instanceof HTMLCanvasElement? {
    left: o,
    top: n,
    width: e.width,
    height: e.height
  }
: {
    left: o,
    top: n,
    width: parseInt(e.style.width),
    height: parseInt(e.style.height)
  }
;
}
function C(e, t) {
  var o,
  n = window._cc? window._cc.inputManager: cc.internal.inputManager;
  if(cc.sys.isBrowser) o = b(document.getElementById("GameCanvas"));
  else {
(o = cc.view.getFrameSize()).left = 0;
    o.top = 0;
  }
  var i = cc.view.getViewportRect(),
  a = cc.view.getScaleX(),
  r = cc.view.getScaleY(),
  l = cc.view.getDevicePixelRatio(),
  s = (e* a+ i.x)/ l+ o.left,
  c = o.top+ o.height-(t* r+ i.y)/ l,
  u = cc.v2(s, c);
  cc.log("模拟点击坐标："+ u.x+ ", "+ u.y);
  var p = n.getTouchByXY(u.x, u.y, o);
  n.handleTouchesBegin([p]);
  setTimeout(function() {
    n.handleTouchesEnd([p]);
  }
, 200);
}
cc._decorator;
var P = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t._selector = "";
    t.stepId = 0;
    t.FINGER_PREFAB = null;
    t.TEXT_PREFAB = null;
    t.endTaskid = 1e3;
    t.GodGuide = null;
    t._targetNode = null;
    t._debugNode = null;
    t._autorun = null;
    t._mask = null;
    t._maskBg = null;
    t._task = null;
    t._dispatchEvent = null;
    t._clickDelegate = null;
    return t;
  }
  Object.defineProperty(t.prototype, "selector", {
    get: function() {
      return this._selector;
    }
, set: function(e) {
      this._selector = e;
      this.find(e);
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "getGuideId", {
    get: function() {
      return _.default.is_IOS_reviewer? 1e3: d.default.guide_id|| 0;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  t.prototype.run = function(e) {
    var t = this;
    if(this._task) {
      console.log("this._task.steps----------\x3e", this._task.steps);
      async.eachSeries(this._task.steps, function(e, o) {
        var n = t.getGuideId;
        console.log("step.id----------\x3e", e.id, ".id----------\x3e", n);
        t.stepId = e.id;
        if(e.id <= n) {
          t._task.debug&& console.log("跳过步骤 "+ e.desc);
          o();
        } else t._processStep(e, o);
      }
, function() {
        t._task = null;
        cc.log("任务结束");
        t._mask.node.active = ! 1;
        t._finger&& (t._finger.active = ! 1);
        e&& e();
      }
);
    }
  }
;
  t.prototype._processStep = function(e, t) {
    var o = this;
    async.series({
      stepStart: function(t) {
        e.onStart? e.onStart(function() {
          t();
        }
): t();
      }
, stepCommand: function(t) {
        o._mask.node.active = e.mask;
        o._maskBg.opacity = e.blackMask? 120: 0;
        o.scheduleOnce(function() {
          e.blackMask2&& (o._maskBg.opacity = 120);
          o._processStepCommand(e, function() {
            t();
          }
);
        }
, e.delayTime|| 0);
      }
, taskEnd: function(t) {
        o._mask._graphics.clear();
        e.taskEndCloseMask&& (o._mask.node.active = ! 1);
        e.command.cmd == r.GodCommand.ANI&& e.onEnd|| (o._finger.active = ! 1);
        if(e.onEnd) e.onEnd(function() {
          o._finger.active = ! 1;
          e.sound&& u.default.getInstance().stopMusic(e.sound, ! 1);
          t();
        }
);
        else {
          e.sound&& u.default.getInstance().stopMusic(e.sound, ! 1);
          t();
        }
      }
    }
, function() {
      e.save&& o.setGuideId(e.id);
      p.default.reportData("guide_id", {
        id: e.id
      }
);
      o._task.debug&& console.log("步骤【"+ e.desc+ "】结束！");
      t();
    }
);
  }
;
  t.prototype.init = function() {
    var e = this;
    this.node.setContentSize(cc.winSize);
    this._targetNode = null;
    if(this.FINGER_PREFAB) {
      this._finger = cc.instantiate(this.FINGER_PREFAB);
      this._finger.parent = this.node;
      this._finger.active = ! 1;
    }
    if(this.TEXT_PREFAB) {
      this._text = cc.instantiate(this.TEXT_PREFAB);
      this._text.parent = this.node;
      this._text.active = ! 1;
    }
    this._debugNode = this.node.getChildByName("debug");
    this._autorun = cc.find("autorun/Background/Label", this._debugNode).getComponent(cc.Label);
    this._autorun.string = "自动执行（关）";
    this._mask = this.node.getComponentInChildren(cc.Mask);
    this._maskBg = this._mask.node.getChildByName("bg");
    this._mask.inverted = ! 0;
    this._mask.node.active = ! 1;
    this.node.on(cc.Node.EventType.TOUCH_START, function(t) {
      if(e._dispatchEvent) e.node._touchListener.setSwallowTouches(! 1);
      else if(e._mask.node.active) {
        if(e._targetNode) {
          if(e._targetNode.isValid) {
            if(e._clickDelegate) {
              e.node._touchListener.setSwallowTouches(! 1);
              cc.log("允许点击任意位置，放行");
              e._clickDelegate();
            } else if(e._targetNode.getBoundingBoxToWorld().contains(t.getLocation())) {
              e.node._touchListener.setSwallowTouches(! 1);
              cc.log("命中目标节点，放行");
            } else {
              e.node._touchListener.setSwallowTouches(! 0);
              cc.log("未命中目标节点，拦截");
            }
          } else {
            cc.warn("节点被销毁了");
            e.node._touchListener.setSwallowTouches(! 0);
          }
        } else e.node._touchListener.setSwallowTouches(! 0);
      } else e.node._touchListener.setSwallowTouches(! 1);
    }
, this);
  }
;
  t.prototype.start = function() {
    cc.debug.setDisplayStats(! 1);
  }
;
  t.prototype.showText = function(e, t, o, n, i) {
    this._text.once("click", i);
    var a = this._text.getComponent(this.TEXT_PREFAB.name),
    r = cc.v3(0, 0, 0);
    o&& (r.x+= o);
    n&& (r.y+= n);
    a.setPos(r);
    a.setText(e, t);
  }
;
  t.prototype.showVideo = function() {
  }
;
  t.prototype.showFingerText = function(e, t, o, n, i) {
    var a = this._text.getComponent(this.TEXT_PREFAB.name),
    r = this.node.convertToNodeSpaceAR(e.parent.convertToWorldSpaceAR(e.position));
    o&& (r.x+= o);
    n&& (r.y+= n);
    a.setPos(r);
    a.setText(t, i);
  }
;
  t.prototype.getNodeFullPath = function(e) {
    var t = [],
    o = e;
    do {
      t.unshift(o.name);
      o = o.parent;
    }
    while(o&& "Canvas" !== o.name);
    return t.join("/");
  }
;
  t.prototype.fingerToNode = function(e, t, o) {
    this._finger|| o();
    this._finger.active = ! 0;
    var n = this.node.convertToNodeSpaceAR(e.parent.convertToWorldSpaceAR(e.position));
    this._finger.position = n;
    this._finger.getComponent(l.default).play(t);
    o();
  }
;
  t.prototype.getNodePoints = function(e, t, o) {
    return m(e, t, o).map(function(e) {
      return e;
    }
);
  }
;
  t.prototype.setAutorun = function() {
    if(this._task) {
      this._task.autorun = ! this._task.autorun;
      this._autorun.string = "自动执行("+(this._task.autorun? "开": "关")+ ")";
    }
  }
;
  t.prototype.setGuideId = function(e) {
    if(d.default.guide_id != e) {
      d.default.guide_id = e;
      c.default.submitGuideLevel(e);
    }
  }
;
  t.prototype.startRecordNodeTouch = function() {
    if(this._task) cc.warn("任务引导中，不能录制");
    else if(this._dispatchEvent) cc.warn("已经进入录制模式");
    else {
      this._dispatchEvent = cc.Node.prototype.dispatchEvent;
      this._recordSteps = [];
      var e = this,
      t = Date.now();
      cc.Node.prototype.dispatchEvent = function(o) {
        e._dispatchEvent.call(this, o);
        if(! e.isGuideNode(this)&& o.type === cc.Node.EventType.TOUCH_END) {
          var n = Date.now(),
          i = (n- t)/ 1e3;
          t = n;
          var a = e.getNodeFullPath(this);
          e._recordSteps.push({
            desc: "点击"+ a, command: {
              cmd: "finger", args: a
            }
, delay: i
          }
);
        }
      }
;
    }
  }
;
  t.prototype.close = function() {
    this.node.active = ! 1;
  }
;
  t.prototype.locateNodeByEvent = function(e) {
    this._selector = e.string;
  }
;
  t.prototype.getTask = function() {
    return this._task;
  }
;
  t.prototype.find = function(e, t) {
    var o = this;
    s.Locator.locateNode(cc.find("Canvas"), e, function(n, i) {
      if(n) cc.log(n);
      else {
        cc.log("定位节点成功", e);
        var a = o._focusToNode(i);
        t&& t(i, a);
      }
    }
);
  }
;
  t.prototype.fillPolygon = function(e) {
    var t = this,
    o = e[0];
    this._mask._graphics.moveTo(o.x, o.y);
    e.slice(1).forEach(function(e) {
      t._mask._graphics.lineTo(e.x, e.y);
    }
);
    this._mask._graphics.lineTo(o.x, o.y);
    this._mask._graphics.stroke();
    this._mask._graphics.fill();
  }
;
  t.prototype.isGuideNode = function(e) {
    var t = ! 1,
    o = e;
    do {
      if(o === this.node) {
        t = ! 0;
        break;
      }
    }
    while(o = o.parent);
    return t;
  }
;
  t.prototype.stopRecordNodeTouch = function() {
    if(this._dispatchEvent) {
      cc.Node.prototype.dispatchEvent = this._dispatchEvent;
      this._dispatchEvent = null;
      cc.warn("退出录制状态");
    } else cc.warn("未进入录制状态");
  }
;
  t.prototype.touchSimulation = function(e, t) {
    void 0 === t&& (t = 1);
    this._task.debug&& console.log("自动执行，模拟触摸");
    this.scheduleOnce(function() {
      cc.log("自动节点 :", JSON.stringify(e.position));
      var t = e.parent.convertToWorldSpaceAR(e.position);
      cc.log("世界节点 :", JSON.stringify(t));
      C(t.x, t.y);
    }
, t);
  }
;
  t.prototype.end = function() {
    this.stepId = 1e3;
    this.setGuideId(this.stepId);
  }
;
  t.prototype.playRecordNodeTouch = function(e, t) {
    this.stopRecordNodeTouch();
    if(this._recordSteps&& this._recordSteps.length) {
      cc.log("生成任务：", JSON.stringify(this._recordSteps));
      var o = {
        autorun: ! ! t,
        debug: ! 0,
        steps: this._recordSteps
      }
;
      this._recordSteps = null;
      this.setTask(o);
      this.run();
    }
  }
;
  t.prototype.onLoad = function() {
    this.init();
    this.GodGuide = this;
  }
;
  t.prototype.fillPoints = function(e) {
    var t = this,
    o = e[0];
    this._mask._graphics.moveTo(o.x, o.y);
    e.slice(1).forEach(function(e) {
      t._mask._graphics.lineTo(e.x, e.y);
    }
);
    this._mask._graphics.lineTo(o.x, o.y);
    this._mask._graphics.stroke();
    this._mask._graphics.fill();
  }
;
  t.prototype._processStepCommand = function(e, t) {
    var o = this,
    n = r.GodCommand[e.command.cmd];
    if(n) {
      this._task.debug&& console.log("执行步骤【"+ e.desc+ "】指令: "+ e.command.cmd+ " time: "+ cc.director.getTotalTime());
      e.sound&& u.default.getInstance().playMusic(e.sound);
      n(this, e, function() {
        o._task.debug&& console.log("步骤【"+ e.desc+ "】指令: "+ e.command.cmd+ " 执行完毕 time: "+ cc.director.getTotalTime());
        t();
      }
);
    } else {
      this._task.debug&& console.log("执行步骤【"+ e.desc+ "】指令: "+ e.command.cmd+ " 不存在！");
      t();
    }
  }
;
  t.prototype.setTask = function(e) {
    if(this._task) cc.warn("当前任务还未处理完毕！");
    else {
      this._debugNode.active = ! ! e.debugUI;
      this._autorun.string = "自动执行("+(e.autorun? "开": "关")+ ")";
      this._task = e;
    }
  }
;
  t.prototype.openPage = function(e, t) {
    t();
  }
;
  t.prototype._focusToNode = function(e) {
    this._mask._graphics.clear();
    var t = e.getBoundingBoxToWorld(),
    o = this.node.convertToNodeSpaceAR(t.origin);
    t.x = o.x;
    t.y = o.y;
    this._mask._graphics.fillRect(t.x, t.y, t.width, t.height);
    return t;
  }
;
  t.prototype.log = function(e) {
    this._task.debug&& cc.log(e);
  }
;
  a([g(cc.Prefab)], t.prototype, "FINGER_PREFAB", void 0);
  a([g(cc.Prefab)], t.prototype, "TEXT_PREFAB", void 0);
  return a([h], t);
}
(cc.Component);
o.default = P;
o.TouchType = cc.Enum({
  Click: 0, DragHorizontal: 1, DragVertical: 2
}
);
cc._RF.pop();
