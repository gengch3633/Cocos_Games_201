let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "b31731stFtIVJxFxzmbmqYq", "task1");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    o.task = void 0;
    var n = e("PageMgr.js"),
      i = e("GodCommand.js"),
      a = e("GuideEvent.js");
    o.task = {
      name: "浇水引导",
      debugUI: !1,
      debug: !0,
      autorun: !1,
      mask: !0,
      steps: [{
        id: 200,
        desc: "闯关",
        command: {
          cmd: i.GodCommand.FINGER,
          args: "MainUI > bottom_area > btn_paly"
        },
        text: "<color=#FF0000>每关都有现金奖励</color>，继续闯关赚钱吧",
        sound: "py_pool_06",
        delayTime: 0,
        mask: !0,
        taskEndCloseMask: !0,
        blackMask: !0,
        textOffsetY: 300,
        onStart: function (e) {
          cc.game.once(a.default.OpenMain, function () {
            e();
          }, this);
        }
      }, {
        id: 200.1,
        desc: "闯关目标",
        command: {
          cmd: i.GodCommand.FINGER,
          args: "top_area > level_condition_area"
        },
        text: "每次击球不进或白球进洞会扣红心，有红心并将<color=#FF0000>球打光就能过关</color>提现了",
        sound: "py_pool_07",
        delayTime: 0,
        blackMask: !0,
        mask: !0,
        taskEndCloseMask: !0,
        textOffsetY: -450,
        textOffsetX: -100,
        onStart: function (e) {
          cc.game.once(a.default.StartGame, function () {
            e();
            n.default.hideAllPage();
          }, this);
        }
      }, {
        id: 201,
        desc: "第一次闯关结束",
        save: !0,
        command: {
          cmd: i.GodCommand.FINGER,
          args: "pages/CashRewardPage/content/bg_qipao1"
        },
        text: "",
        textOffsetY: 200,
        sound: "py_pool_08",
        mask: !0,
        delayTime: 0,
        onStart: function (e) {
          cc.game.once(a.default.OpenCashPage, function () {
            e();
          }, this);
        }
      }, {
        id: 202,
        desc: "第二次提现按钮",
        command: {
          cmd: i.GodCommand.FINGER,
          args: "TopButton > Group > cash_container2"
        },
        text: "右上角的现金都可以打款到微信",
        sound: "py_pool_09",
        mask: !0,
        blackMask: !1,
        blackMask2: !0,
        textOffsetY: -500,
        textOffsetX: -150,
        delayTime: 3,
        onStart: function (e) {
          cc.game.once(a.default.OpenMain, function () {
            e();
          }, this);
        }
      }, {
        id: 203,
        desc: "第二次提现",
        save: !0,
        command: {
          cmd: i.GodCommand.FINGER,
          args: "pages > TiXianPage > btn_qiandao"
        },
        text: "点击这里再次打款",
        sound: "py_pool_10",
        textOffsetY: 200,
        blackMask: !0,
        mask: !0,
        delayTime: 0,
        taskEndCloseMask: !0,
        onStart: function (e) {
          cc.game.once(a.default.OpenTixian, function () {
            e();
          }, this);
        }
      }, {
        id: 204,
        desc: "第二次到账",
        save: !0,
        command: {
          cmd: i.GodCommand.FINGER,
          args: "pages > TiXianSuccessPage > bg_weixintixian_1 > btn_close"
        },
        text: "闯关到达<color=#FF0000>新地区</color>，还能发起多次<color=#FF0000>现金全额</color>打款",
        sound: "py_pool_11",
        mask: !0,
        hideGirl: !0,
        delayTime: 0,
        textOffsetY: -200,
        onStart: function (e) {
          cc.game.once(a.default.OpenTixianSuccess, function () {
            e();
          }, this);
        }
      }, {
        id: 205,
        desc: "新手领取现金奖励",
        save: !0,
        command: {
          cmd: i.GodCommand.OPENPAGE,
          args: "TixianUpGuidePage"
        },
        onEnd: function (e) {
          cc.game.once(a.default.GetGuideXianJin, function () {
            e();
          }, this);
        }
      }]
    };
    cc._RF.pop();
