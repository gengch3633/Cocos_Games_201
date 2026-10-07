let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "2971eDexgBA9KGEuWr8w0yS", "task2");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
o.task = void 0;
var n = e("GodCommand.js"),
i = e("GuideEvent.js");
o.task = {
  name: "打开任务",
  debugUI: ! 1,
  debug: ! 0,
  autorun: ! 1,
  steps:[{
    id: 300, desc: "闯关", command: {
      cmd: n.GodCommand.FINGER, args: "MainUI > bottom_area > btn_paly"
    }
, text: "每次<color=#FF0000>击球进洞</color>还能额外<color=#FF0000>赚取红包</color>", sound: "py_pool_13", delayTime: 0, save: ! 1, mask: ! 0, blackMask: ! 0, taskEndCloseMask: ! 0, textOffsetY: 300, onStart: function(e) {
      cc.game.once(i.default.OpenMain, function() {
        e();
      }
, this);
    }
  }
, {
    id: 301, desc: "第二次闯关结束", save: ! 0, command: {
      cmd: n.GodCommand.FINGER, args: "pages/CashRewardPage/content/btn_adget"
    }
, text: "点这可将红包奖励额大幅提升", sound: "py_pool_14", textOffsetY: 200, hideGirl: ! 0, mask: ! 0, delayTime: 0, onStart: function(e) {
      cc.game.once(i.default.OpenCashPage, function() {
        e();
      }
, this);
    }
  }
, {
    id: 302, desc: "红包提现按钮", save: ! 1, command: {
      cmd: n.GodCommand.FINGER, args: "TopButton > Group > cash_container"
    }
, text: "左上角的红包只要满0.1元即可提现", sound: "py_pool_15", mask: ! 0, delayTime: 3, blackMask: ! 1, blackMask2: ! 0, textOffsetY:- 500, textOffsetX: 150, onStart: function(e) {
      cc.game.once(i.default.OpenMain, function() {
        e();
      }
, this);
    }
  }
, {
    id: 303, desc: "红包提现", save: ! 0, command: {
      cmd: n.GodCommand.FINGER, args: "pages > HongBaoPage > btn_qiandao"
    }
, text: "看视频可得大额红包，点击提现", sound: "py_pool_16", mask: ! 0, blackMask: ! 0, hideGirl: ! 0, textOffsetY:- 200, delayTime: 0, onStart: function(e) {
      cc.game.once(i.default.OpenHongBao, function() {
        e();
      }
, this);
    }
  }
, {
    id: 304, desc: "红包到账", save: ! 0, command: {
      cmd: n.GodCommand.FINGER, args: "pages > HongBaoSuccessPage > bg_weixintixian_1 > btn_close"
    }
, text: "闯关到达<color=#FF0000>新地区</color>可提升红包<color=#FF0000>提现比例</color>", sound: "py_pool_17", mask: ! 0, hideGirl: ! 0, delayTime: 0, textOffsetY:- 200, onStart: function(e) {
      cc.game.once(i.default.OpenHongBaoSuccess, function() {
        e();
      }
, this);
    }
  }
, {
    id: 305, save: ! 0, desc: "结束语", textOffsetY:- 250, command: {
      cmd: n.GodCommand.TEXT, args:["游戏中还有很多地区，<color=#FF0000>到达越多赚钱就越多</color>，让我们继续闯关赚钱吧"]
    }
, sound: "py_pool_18"
  }
]
}
;
cc._RF.pop();
