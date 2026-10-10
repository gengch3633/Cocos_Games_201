import { GodCommand } from "./GodCommand";
import GuideEvent from "./GuideEvent";

export const task = {
    name: "打开任务",
    debugUI: false,
    debug: true,
    autorun: false,
    steps: [{
        id: 300,
        desc: "闯关",
        command: {
            cmd: GodCommand.FINGER,
            args: "MainUI > bottom_area > btn_paly"
        },
        text: "每次<color=#FF0000>击球进洞</color>还能额外<color=#FF0000>赚取红包</color>",
        sound: "py_pool_13",
        delayTime: 0,
        save: false,
        mask: true,
        blackMask: true,
        taskEndCloseMask: true,
        textOffsetY: 300,
        onStart: function (e) {
            cc.game.once(GuideEvent.OpenMain, function () {
                e();
            }, this);
        }
    }, {
        id: 301,
        desc: "第二次闯关结束",
        save: true,
        command: {
            cmd: GodCommand.FINGER,
            args: "pages/CashRewardPage/content/btn_adget"
        },
        text: "点这可将红包奖励额大幅提升",
        sound: "py_pool_14",
        textOffsetY: 200,
        hideGirl: true,
        mask: true,
        delayTime: 0,
        onStart: function (e) {
            cc.game.once(GuideEvent.OpenCashPage, function () {
                e();
            }, this);
        }
    }, {
        id: 302,
        desc: "红包提现按钮",
        save: false,
        command: {
            cmd: GodCommand.FINGER,
            args: "TopButton > Group > cash_container"
        },
        text: "左上角的红包只要满0.1元即可提现",
        sound: "py_pool_15",
        mask: true,
        delayTime: 3,
        blackMask: false,
        blackMask2: true,
        textOffsetY: -500,
        textOffsetX: 150,
        onStart: function (e) {
            cc.game.once(GuideEvent.OpenMain, function () {
                e();
            }, this);
        }
    }, {
        id: 303,
        desc: "红包提现",
        save: true,
        command: {
            cmd: GodCommand.FINGER,
            args: "pages > HongBaoPage > btn_qiandao"
        },
        text: "看视频可得大额红包，点击提现",
        sound: "py_pool_16",
        mask: true,
        blackMask: true,
        hideGirl: true,
        textOffsetY: -200,
        delayTime: 0,
        onStart: function (e) {
            cc.game.once(GuideEvent.OpenHongBao, function () {
                e();
            }, this);
        }
    }, {
        id: 304,
        desc: "红包到账",
        save: true,
        command: {
            cmd: GodCommand.FINGER,
            args: "pages > HongBaoSuccessPage > bg_weixintixian_1 > btn_close"
        },
        text: "闯关到达<color=#FF0000>新地区</color>可提升红包<color=#FF0000>提现比例</color>",
        sound: "py_pool_17",
        mask: true,
        hideGirl: true,
        delayTime: 0,
        textOffsetY: -200,
        onStart: function (e) {
            cc.game.once(GuideEvent.OpenHongBaoSuccess, function () {
                e();
            }, this);
        }
    }, {
        id: 305,
        save: true,
        desc: "结束语",
        textOffsetY: -250,
        command: {
            cmd: GodCommand.TEXT,
            args: ["游戏中还有很多地区，<color=#FF0000>到达越多赚钱就越多</color>，让我们继续闯关赚钱吧"]
        },
        sound: "py_pool_18"
    }]
};
