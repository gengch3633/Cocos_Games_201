import { GodCommand } from "./GodCommand";
import { TouchType } from "./GodGuide";
import GuideEvent from "./GuideEvent";
import PageMgr from "./PageMgr";
import { PoolLogger } from "./PoolLogger";

export const task = {
    name: "击球引导",
    debugUI: false,
    debug: true,
    autorun: false,
    mask: true,
    steps: [
        {
            id: 100,
            desc: "闯关",
            command: {
                cmd: GodCommand.FINGER,
                args: "MainUI > bottom_area > btn_paly",
            },
            text: "",
            delayTime: 0,
            mask: true,
            taskEndCloseMask: true,
            blackMask: true,
            onStart(callback: () => void) {
                cc.game.once(GuideEvent.OpenMain, function () {
                    PoolLogger.instance.logGameEvent(
                        "thepool_game_new",
                        {
                            object_action: "show",
                            object_name: "new_9",
                        },
                        true,
                    );
                    callback();
                    cc.game.emit(GuideEvent.GuideToPlay);
                }, this);
            },
        },
        {
            id: 101,
            desc: "瞄准",
            command: {
                cmd: GodCommand.ANI,
                args: "guideNode",
            },
            text: "pkey_026",
            fingerType: TouchType.DragHorizontal,
            delayTime: 0,
            textOffsetY: 130,
            onStart(callback: () => void) {
                cc.game.once(GuideEvent.StartGame, function () {
                    callback();
                    PageMgr.hideAllPage();
                    PoolLogger.instance.logGameEvent(
                        "thepool_game_new",
                        {
                            object_action: "show",
                            object_name: "new_11",
                        },
                        true,
                    );
                }, this);
            },
            onEnd(callback: () => void) {
                cc.game.once(GuideEvent.MiaoZhun, function () {
                    callback();
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
            text: "pkey_027",
            fingerType: TouchType.DragVertical,
            delayTime: 0,
            textOffsetX: -283,
            textOffsetY: 80,
            onStart(callback: () => void) {
                callback();
                PoolLogger.instance.logGameEvent(
                    "thepool_game_new",
                    {
                        object_action: "show",
                        object_name: "new_12",
                    },
                    true,
                );
            },
            onEnd(callback: () => void) {
                cc.game.once(GuideEvent.JiQiu, function () {
                    callback();
                }, this);
            },
        },
        {
            id: 103,
            desc: "闯关目标",
            command: {
                cmd: GodCommand.FINGER,
                args: "bottom_area > xin",
            },
            text: "pkey_028",
            delayTime: 0,
            blackMask: true,
            mask: true,
            taskEndCloseMask: true,
            clickAnywhereToEnd: true,
            textOffsetX: -283,
            textOffsetY: -800,
            onStart(callback: () => void) {
                callback();
                PoolLogger.instance.logGameEvent(
                    "thepool_game_new",
                    {
                        object_action: "show",
                        object_name: "new_13",
                    },
                    true,
                );
            },
            onEnd(callback: () => void) {
                callback();
                PoolLogger.instance.logGameEvent(
                    "thepool_game_new",
                    {
                        object_action: "show",
                        object_name: "new_14",
                    },
                    true,
                );
            },
        },
    ],
};
