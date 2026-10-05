import { GodCommand } from "./GodCommand";
import { TouchType } from "./GodGuide";
import GuideEvent from "./GuideEvent";

export const task = {
    name: "击球引导",
    debugUI: false,
    debug: true,
    autorun: false,
    mask: true,
    steps: [
        {
            id: 100,
            desc: "播放视频",
            command: {
                cmd: GodCommand.VIDEO,
                args: "",
            },
            playTime: 5.5,
            onStart(done: () => void): void {
                cc.game.once(GuideEvent.PlayVideo, () => {
                    done();
                }, this);
            },
        },
        {
            id: 100.1,
            desc: "欢迎语",
            command: {
                cmd: GodCommand.TEXT,
                args: ["欢迎来到好运台球，在这里您只要打球过关即可轻松赚现金，现金能全部打款到微信"],
            },
            textOffsetY: -100,
            sound: "py_pool_0",
        },
        {
            id: 101,
            desc: "瞄准",
            command: {
                cmd: GodCommand.ANI,
                args: "guideNode",
            },
            sound: "py_pool_01",
            text: "<color=#FF0000>点目标球</color>或<color=#FF0000>滑屏</color>，将瞄准线<color=#FF0000>对准</color>球洞",
            fingerType: TouchType.DragHorizontal,
            delayTime: 0,
            textOffsetY: 130,
            onEnd(done: () => void): void {
                cc.game.once(GuideEvent.MiaoZhun, () => {
                    done();
                }, this);
            },
        },
        {
            id: 102,
            desc: "击球",
            save: false,
            command: {
                cmd: GodCommand.ANI,
                args: "bottom_area > node_power2",
            },
            sound: "py_pool_02",
            text: "<color=#FF0000>下拉</color>或<color=#FF0000>点击</color>力度条，即可<color=#FF0000>击球</color>",
            fingerType: TouchType.DragVertical,
            delayTime: 0,
            textOffsetX: -300,
            textOffsetY: 80,
            onEnd(done: () => void): void {
                cc.game.once(GuideEvent.JiQiu, () => {
                    done();
                }, this);
            },
        },
        {
            id: 103,
            desc: "领奖",
            save: false,
            command: {
                cmd: GodCommand.FINGER,
                args: "pages > TixianGuidePage > btn_get",
            },
            text: "赚钱就是这么简单，快去提现吧",
            sound: "py_pool_03",
            mask: true,
            delayTime: 0,
            textOffsetY: 150,
            onStart(done: () => void): void {
                cc.game.once(GuideEvent.OpenReward, () => {
                    done();
                }, this);
            },
        },
        {
            id: 104,
            desc: "提现",
            save: true,
            command: {
                cmd: GodCommand.FINGER,
                args: "pages > TiXianPage > btn_qiandao",
            },
            text: "点击按钮发起打款",
            sound: "py_pool_04",
            mask: true,
            blackMask: true,
            taskEndCloseMask: true,
            delayTime: 0,
            textOffsetY: 200,
            onStart(done: () => void): void {
                cc.game.once(GuideEvent.OpenTixian, () => {
                    done();
                }, this);
            },
        },
        {
            id: 105,
            desc: "到账",
            save: true,
            command: {
                cmd: GodCommand.FINGER,
                args: "pages > TiXianSuccessPage > bg_weixintixian_1 > btn_close",
            },
            text: "打款成功！现金一会儿就到账了",
            sound: "py_pool_05",
            mask: true,
            hideGirl: true,
            delayTime: 0,
            textOffsetY: -200,
            onStart(done: () => void): void {
                cc.game.once(GuideEvent.OpenTixianSuccess, () => {
                    done();
                }, this);
            },
        },
    ],
};
