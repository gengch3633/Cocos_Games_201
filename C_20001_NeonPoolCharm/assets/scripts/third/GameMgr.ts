import GlobalConfig from "./GlobalConfig";

let battleState = 0;

const GameMgr = {
    goto_main(): void {
        console.log("call GameMgr.goto_main");
    },

    replay_scene(): void {},

    correct_one(): void {},

    playEffectSound(path: string): void {
        if (GlobalConfig.setting.sound_effect) {
            cc.loader.loadRes(path, cc.AudioClip, (err, clip: cc.AudioClip) => {
                cc.audioEngine.play(clip, false, 1);
            });
        }
    },

    correct_all(): void {
        GlobalConfig.setting;
    },

    discorrect(): void {},

    connectWSCB(): void {},

    connectWS(): void {},

    LSKEY_EditingTableInfo: "etableInfo",

    setBattleState(state: number): void {
        battleState = state;
    },

    setInBattle(): void {
        battleState = 2;
    },

    isInBattle(): boolean {
        return battleState == 2;
    },

    setOutBattle(): boolean {
        return battleState == 0;
    },

    local_set(key: string, value: any): void {
        if (value) {
            if (typeof value == "object") {
                cc.sys.localStorage.setItem(key, JSON.stringify(value));
            } else {
                cc.sys.localStorage.setItem(key, value);
            }
        }
    },

    local_get(key: string): string | null {
        return cc.sys.localStorage.getItem(key);
    },

    local_remove(key: string): void {
        cc.sys.localStorage.removeItem(key);
    },
};

export default GameMgr;
