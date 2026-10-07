let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "57e25YnSWVIvZxwQ/C3fepa", "task");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
o.task = void 0;
var n = e("PoolLogger.js"),
i = e("GodCommand.js"),
a = e("GodGuide.js"),
r = e("GuideEvent.js"),
l = e("PageMgr.js");
o.task = {
  name: "击球引导",
  debugUI: ! 1,
  debug: ! 0,
  autorun: ! 1,
  mask: ! 0,
  steps:[{
    id: 100, desc: "闯关", command: {
      cmd: i.GodCommand.FINGER, args: "MainUI > bottom_area > btn_paly"
    }
, text: "", delayTime: 0, mask: ! 0, taskEndCloseMask: ! 0, blackMask: ! 0, onStart: function(e) {
      cc.game.once(r.default.OpenMain, function() {
        n.PoolLogger.instance.logGameEvent("thepool_game_new", {
          object_action: "show", object_name: "new_9"
        }
, ! 0);
        e();
        cc.game.emit(r.default.GuideToPlay);
      }
, this);
    }
  }
, {
    id: 101, desc: "瞄准", command: {
      cmd: i.GodCommand.ANI, args: "guideNode"
    }
, text: "pkey_026", fingerType: a.TouchType.DragHorizontal, delayTime: 0, textOffsetY: 130, onStart: function(e) {
      cc.game.once(r.default.StartGame, function() {
        e();
        l.default.hideAllPage();
        n.PoolLogger.instance.logGameEvent("thepool_game_new", {
          object_action: "show", object_name: "new_11"
        }
, ! 0);
      }
, this);
    }
, onEnd: function(e) {
      cc.game.once(r.default.MiaoZhun, function() {
        e();
      }
, this);
    }
  }
, {
    id: 102, desc: "击球", save: ! 1, command: {
      cmd: i.GodCommand.ANI, args: "bottom_area > node_power2"
    }
, text: "pkey_027", fingerType: a.TouchType.DragVertical, delayTime: 0, textOffsetX:- 283, textOffsetY: 80, onStart: function(e) {
      e();
      n.PoolLogger.instance.logGameEvent("thepool_game_new", {
        object_action: "show", object_name: "new_12"
      }
, ! 0);
    }
, onEnd: function(e) {
      cc.game.once(r.default.JiQiu, function() {
        e();
      }
, this);
    }
  }
, {
    id: 103, desc: "闯关目标", command: {
      cmd: i.GodCommand.FINGER, args: "bottom_area > xin"
    }
, text: "pkey_028", delayTime: 0, blackMask: ! 0, mask: ! 0, taskEndCloseMask: ! 0, clickAnywhereToEnd: ! 0, textOffsetX:- 283, textOffsetY:- 800, onStart: function(e) {
      e();
      n.PoolLogger.instance.logGameEvent("thepool_game_new", {
        object_action: "show", object_name: "new_13"
      }
, ! 0);
    }
, onEnd: function(e) {
      e();
      n.PoolLogger.instance.logGameEvent("thepool_game_new", {
        object_action: "show", object_name: "new_14"
      }
, ! 0);
    }
  }
]
}
;
cc._RF.pop();
