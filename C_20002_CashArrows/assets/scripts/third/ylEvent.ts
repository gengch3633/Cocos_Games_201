import GEMgr from "./GEMgr";

const { ccclass } = cc._decorator;

@ccclass
export default class ylEvent {
    static tiemStep = 10;

    static loading(): void {
        GEMgr.userSetOnce({
            firstVersion: "v1.0.0"
        });
        GEMgr.userSet({
            curVersion: "v1.0.0"
        });
        GEMgr.userAdd({
            activeNum: 1
        });
    }

    static accuAds(): void {
        GEMgr.userAdd({
            accuAds: 1
        });
    }

    static stageEnd(isWin: boolean, maxLevel?: number): void {
        if (isWin) {
            GEMgr.userAdd({
                winNum: 1
            });
        } else {
            GEMgr.userAdd({
                lostNum: 1
            });
        }
        if (maxLevel) {
            GEMgr.userSet({
                maxLv: maxLevel
            });
        }
    }

    static stageIn(): void {
        GEMgr.userAdd({
            openLv: 1
        });
    }

    static setAllTime(): void {
        GEMgr.userAdd({
            allTime: ylEvent.tiemStep
        });
    }
}
