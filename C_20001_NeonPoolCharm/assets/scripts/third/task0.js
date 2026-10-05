let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "380f3U4MQ5HAYbybXvRR6Hg", "task0");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
o.task = void 0;
var n = e("GodCommand.js"),
i = e("GodGuide.js"),
a = e(GuideEvent "
  }].js);
    o.task = {
      name: " 击球引导 ",
      debugUI: !1,
      debug: !0,
      autorun: !1,
      mask: !0,
      steps: [{
        id: 100,
        desc: " 播放视频 ",
        command: {
          cmd: n.GodCommand.VIDEO,
          args: " "
        },
        playTime: 5.5,
        onStart: function (e) {
          cc.game.once(a.default.PlayVideo, function () {
            e();
          }, this);
        }
      }, {
        id: 100.1,
        desc: " 欢迎语 ",
        command: {
          cmd: n.GodCommand.TEXT,
          args: [" 欢迎来到好运台球 ， 在这里您只要打球过关即可轻松赚现金 ， 现金能全部打款到微信 "]
        },
        textOffsetY: -100,
        sound: " py_pool_0 "
      }, {
        id: 101,
        desc: " 瞄准 ",
        command: {
          cmd: n.GodCommand.ANI,
          args: " guideNode "
        },
        sound: " py_pool_01 ",
        text: " < color = # FF0000 > 点目标球 < / color > 或 < color = # FF0000 > 滑屏 < / color > ， 将瞄准线 < color = # FF0000 > 对准 < / color > 球洞 ",
        fingerType: i.TouchType.DragHorizontal,
        delayTime: 0,
        textOffsetY: 130,
        onEnd: function (e) {
          cc.game.once(a.default.MiaoZhun, function () {
            e();
          }, this);
        }
      }, {
        id: 102,
        desc: " 击球 ",
        save: !1,
        command: {
          cmd: n.GodCommand.ANI,
          args: " bottom_area > node_power2 "
        },
        sound: " py_pool_02 ",
        text: " < color = # FF0000 > 下拉 < / color > 或 < color = # FF0000 > 点击 < / color > 力度条 ， 即可 < color = # FF0000 > 击球 < / color > ",
        fingerType: i.TouchType.DragVertical,
        delayTime: 0,
        textOffsetX: -300,
        textOffsetY: 80,
        onEnd: function (e) {
          cc.game.once(a.default.JiQiu, function () {
            e();
          }, this);
        }
      }, {
        id: 103,
        desc: " 领奖 ",
        save: !1,
        command: {
          cmd: n.GodCommand.FINGER,
          args: " pages > TixianGuidePage > btn_get "
        },
        text: " 赚钱就是这么简单 ， 快去提现吧 ",
        sound: " py_pool_03 ",
        mask: !0,
        delayTime: 0,
        textOffsetY: 150,
        onStart: function (e) {
          cc.game.once(a.default.OpenReward, function () {
            e();
          }, this);
        }
      }, {
        id: 104,
        desc: " 提现 ",
        save: !0,
        command: {
          cmd: n.GodCommand.FINGER,
          args: " pages > TiXianPage > btn_qiandao "
        },
        text: " 点击按钮发起打款 ",
        sound: " py_pool_04 ",
        mask: !0,
        blackMask: !0,
        taskEndCloseMask: !0,
        delayTime: 0,
        textOffsetY: 200,
        onStart: function (e) {
          cc.game.once(a.default.OpenTixian, function () {
            e();
          }, this);
        }
      }, {
        id: 105,
        desc: " 到账 ",
        save: !0,
        command: {
          cmd: n.GodCommand.FINGER,
          args: " pages > TiXianSuccessPage > bg_weixintixian_1 > btn_close "
        },
        text: " 打款成功 ！ 现金一会儿就到账了 ",
        sound: " py_pool_05 ",
        mask: !0,
        hideGirl: !0,
        delayTime: 0,
        textOffsetY: -200,
        onStart: function (e) {
          cc.game.once(a.default.OpenTixianSuccess, function () {
            e();
          }, this);
        }
      }]
    };
    cc._RF.pop();
