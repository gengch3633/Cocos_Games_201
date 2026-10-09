import GlobalConfig from "./GlobalConfig";

let battleState = 0;

const GameMgr = {
    goto_main: function () {
        console.log("call GameMgr.goto_main");
    },
    replay_scene: function () {
    },
    correct_one: function () {
    },
    playEffectSound: function (path) {
        if (GlobalConfig.setting.sound_effect) {
            cc.loader.loadRes(path, cc.AudioClip, function (err, clip) {
                cc.audioEngine.play(clip, false, 1);
            });
        }
    },
    correct_all: function () {
        GlobalConfig.setting;
    },
    discorrect: function () {
    },
    connectWSCB: function () {
    },
    connectWS: function () {
    },
    setBattleState: function (state) {
        battleState = state;
    },
    setInBattle: function () {
        battleState = 2;
    },
    isInBattle: function () {
        return 2 == battleState;
    },
    setOutBattle: function () {
        return 0 == battleState;
    },
    LSKEY_EditingTableInfo: "etableInfo",
    local_set: function (key, value) {
        if (value) {
            if ("object" == typeof value) {
                cc.sys.localStorage.setItem(key, JSON.stringify(value));
            } else {
                cc.sys.localStorage.setItem(key, value);
            }
        }
    },
    local_get: function (key) {
        return cc.sys.localStorage.getItem(key);
    },
    local_remove: function (key) {
        cc.sys.localStorage.removeItem(key);
    }
};

export default GameMgr;
