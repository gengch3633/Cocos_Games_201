import * as GlobalConfig from "./GlobalConfig";

let battleState = 0;

export function goto_main(): void {
    console.log("call GameMgr.goto_main");
}

export function replay_scene(): void {}

export function correct_one(): void {}

export function playEffectSound(path: string): void {
    if (GlobalConfig.setting.sound_effect) {
        cc.loader.loadRes(path, cc.AudioClip, (_err, clip: cc.AudioClip) => {
            cc.audioEngine.play(clip, false, 1);
        });
    }
}

export function correct_all(): void {
    GlobalConfig.setting;
}

export function discorrect(): void {}

export function connectWSCB(): void {}

export function connectWS(): void {}

export function setBattleState(state: number): void {
    battleState = state;
}

export function setInBattle(): void {
    battleState = 2;
}

export function isInBattle(): boolean {
    return battleState == 2;
}

export function setOutBattle(): boolean {
    return battleState == 0;
}

export const LSKEY_EditingTableInfo = "etableInfo";

export function local_set(key: string, value: unknown): void {
    if (value) {
        if (typeof value == "object") {
            cc.sys.localStorage.setItem(key, JSON.stringify(value));
        } else {
            cc.sys.localStorage.setItem(key, value as string);
        }
    }
}

export function local_get(key: string): string {
    return cc.sys.localStorage.getItem(key);
}

export function local_remove(key: string): void {
    cc.sys.localStorage.removeItem(key);
}
