let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "57b6cojosNCS5M8FpjoWf55", "GodCommand");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
o.GodCommand = void 0;
var n = e("GodGuide.js"),
i = e("GuideEvent.js"),
a = function() {
  function e() {
  }
  e.text = function(e, t, o) {
    var n = t.command.args;
! n|| "string" != typeof n&& "number" != typeof n|| (n = [n]);
    var i = ! t.hideGirl,
    a = e.getTask().autorun;
    async.eachSeries(n, function(o, n) {
      var r = ! 1;
      e.showText(o, i, t.textOffsetX, t.textOffsetY, function() {
        n();
      }
);
      a&& setTimeout(function() {
        if(! r) {
          r = ! 0;
          n();
        }
      }
, 1e3);
    }
, o);
  }
;
  e.finger = function(e, t, o) {
    var i = t.command.args;
    e._targetNode = null;
    var a = ! t.hideGirl;
    e.find(i, function(i) {
      e.showFingerText(i, t.text, t.textOffsetX, t.textOffsetY, a);
      e.fingerToNode(i, t.fingerType|| n.TouchType.Click, function() {
        e._targetNode = i;
        if(t.clickAnywhereToEnd) e._clickDelegate = function() {
          cc.log("wide node clicked");
          e._clickDelegate = null;
          o();
        }
;
        else {
          e._clickDelegate = null;
          i.once(cc.Node.EventType.TOUCH_END, function() {
            cc.log("node clicked");
            o();
          }
);
        }
      }
);
      e.getTask().autorun&& e.touchSimulation(i);
    }
);
  }
;
  e.ani = function(e, t, o) {
    var i = t.command.args;
    e._targetNode = null;
    var a = ! t.hideGirl;
    e.find(i, function(i) {
      e.showFingerText(i, t.text, t.textOffsetX, t.textOffsetY, a);
      e.fingerToNode(i, t.fingerType|| n.TouchType.Click, function() {
        e._targetNode = i;
        cc.log("节点被点击");
        o();
      }
);
      e.getTask().autorun&& e.touchSimulation(i);
    }
);
  }
;
  e.locator = function(e, t, o) {
    var n = t.command.args;
    e.find(n, function(t) {
      e._targetNode = t;
      t.once(cc.Node.EventType.TOUCH_END, function() {
        cc.log("节点被点击");
        o();
      }
);
      e.getTask().autorun&& e.touchSimulation(t);
    }
);
  }
;
  e.video = function(e, t, o) {
    e.VIDEO.node.active = ! 0;
    e.VIDEO.play();
    e.scheduleOnce(function() {
      e.VIDEO.node.active = ! 1;
      cc.log("播放完成");
      cc.game.emit(i.default.VideoEnd);
      o();
    }
, t.playTime|| 0);
  }
;
  e.openpage = function(e, t, o) {
    var n = t.command.args;
    n&& "string" == typeof n? e.openPage(n, o): console.error("检查配置参数", t.desc, t.command);
  }
;
  e.DIALOGUE = "dialogue";
  e.FINGER = "finger";
  e.OPENPAGE = "openpage";
  e.ANI = "ani";
  e.TEXT = "text";
  e.LOCATOR = "locator";
  e.SAVE = "save";
  e.NODETEXT = "nodetext";
  e.VIDEO = "video";
  e.typeList = [e.DIALOGUE, e.FINGER, e.TEXT, e.LOCATOR, e.SAVE, e.VIDEO, e.ANI, e.OPENPAGE];
  return e;
}
();
o.GodCommand = a;
cc._RF.pop();
