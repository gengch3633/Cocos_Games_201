import GEMgr from "./GEMgr";

const { ccclass } = cc._decorator;

@ccclass
export default class ylEvent {
    static loading() {
        (GEMgr as any).userSetOnce({
            firstVersion: " v1.0.0 "
        });
        (GEMgr as any).userSet({
            curVersion: " v1.0.0 "
        });
        (GEMgr as any).userAdd({
            activeNum: 1
        });
    }

    static accuAds() {
        (GEMgr as any).userAdd({
            accuAds: 1
        });
    }

    static stageEnd(e: boolean, t?: any) {
        e ? (GEMgr as any).userAdd({
            winNum: 1
        }) : (GEMgr as any).userAdd({
            lostNum: 1
        });
        t && (GEMgr as any).userSet({
            maxLv: t
        });
    }

    static stageIn() {
        (GEMgr as any).userAdd({
            openLv: 1
        });
    }

    static setAllTime() {
        (GEMgr as any).userAdd({
            allTime: ylEvent.tiemStep
        });
    }

    static tiemStep = 10;
}
