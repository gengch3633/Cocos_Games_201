import GEMgr from "./GEMgr";

const { ccclass } = cc._decorator;

@ccclass
export default class ylEvent {
    static tiemStep = 10;

    static loading(): void {
        GEMgr.userSetOnce({
            firstVersion: "v1.0.0",
        });
        GEMgr.userSet({
            curVersion: "v1.0.0",
        });
        GEMgr.userAdd({
            activeNum: 1,
        });
    }

    static accuAds(): void {
        GEMgr.userAdd({
            accuAds: 1,
        });
    }

    static stageEnd(win: boolean, maxLv?: number): void {
        if (win) {
            GEMgr.userAdd({
                winNum: 1,
            });
        } else {
            GEMgr.userAdd({
                lostNum: 1,
            });
        }
        if (maxLv) {
            GEMgr.userSet({
                maxLv: maxLv,
            });
        }
    }

    static stageIn(): void {
        GEMgr.userAdd({
            openLv: 1,
        });
    }

    static setAllTime(): void {
        GEMgr.userAdd({
            allTime: ylEvent.tiemStep,
        });
    }
}
