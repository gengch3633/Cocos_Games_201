import GEMgr from "./GEMgr";

const { ccclass } = cc._decorator;

cc._RF.push(module, "31319TkuzxGhapzu3fCJHYn", "ylEvent");

@ccclass
export default class ylEvent {
    public static tiemStep: number = 10;

    public static loading(): void {
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

    public static accuAds(): void {
        GEMgr.userAdd({
            accuAds: 1
        });
    }

    public static stageEnd(isWin: boolean, maxLv: number): void {
        if (isWin) {
            GEMgr.userAdd({
                winNum: 1
            });
        } else {
            GEMgr.userAdd({
                lostNum: 1
            });
        }
        if (maxLv) {
            GEMgr.userSet({
                maxLv: maxLv
            });
        }
    }

    public static stageIn(): void {
        GEMgr.userAdd({
            openLv: 1
        });
    }

    public static setAllTime(): void {
        GEMgr.userAdd({
            allTime: ylEvent.tiemStep
        });
    }
}

cc._RF.pop();