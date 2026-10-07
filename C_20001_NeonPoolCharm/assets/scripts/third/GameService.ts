import EngineUtil from "./EngineUtil";
import LocalServer from "./LocalServer";

export default class GameService {
    static getRemoveCard(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static getDiamondList(handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static GuideGift(handler: any): void {
        handler.runWith({ code: 1, data: { gold_balance: 9999 }, ecp: 0, message: "" });
    }

    static GmGetCpmRecord(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: { records: [] }, ecp: 0, message: "" });
    }

    static signIn(handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static offline(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static GMAddSignInCount(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static repaireOrder(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static report(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static extractInfo(handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static getRefreshLevel(handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static checkCashInfo(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static chouJiang(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static GmChangeLevel(data: any, handler: any): void {
        handler?.runWith(LocalServer.instance.debugRequestChangeLevel(data.levelA, data.levelB));
    }

    static deprecatedGmChangeTurn(data: any, handler: any): void {
        handler?.runWith(LocalServer.instance.deprecatedDebugRequestChangeTurn(data.turn));
    }

    static deprecatedGmChangeLevel(data: any, handler: any): void {
        handler?.runWith(LocalServer.instance.deprecatedDebugRequestChangeLevel(data.levelA, data.levelB, data.levelC));
    }

    static reportAd(data: any, handler: any): void {
        handler?.runWith(LocalServer.instance.requestCompleteAd(data.ad_type, data.success));
    }

    static PayerMaxCreateOrder(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static createOrer(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static orderStatus(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static getLevelStatistics(handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static receiveGift(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static getCommitTask(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static getClub(data: any, handler: any): void {
        handler?.runWith(LocalServer.instance.requestUnlockCue(data.club_id, data.use));
    }

    static getDiamond(handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static verifyOrder(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static getTaskList(handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static refreshNextClub(data: any, handler: any): void {
        handler?.runWith(LocalServer.instance.requestRefreshNextCue());
    }

    static useDiamond(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static GmChangeCash(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static gmToLevel(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static GmOpenCues(data: any, handler: any): void {
        handler?.runWith(LocalServer.instance.debugRequestOpenCues(data.cueCount));
    }

    static extractRecord(handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static PayerMaxCheckOrderStatus(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static gmAddDiamond(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static submitGuideLevel(data: any, handler: any): void {
        handler?.runWith(LocalServer.instance.requestCompleteGuide(data.guide_id));
    }

    static GetGameLevelConfig(data: any, handler: any): void {
        EngineUtil.loadResourceAsset("config/lv/" + data.level_name)
            .then((asset: any) => {
                if (handler) {
                    const o = asset.json;
                    if (o) {
                        handler.runWith({
                            code: 1,
                            data: { config: o },
                            ecp: 0,
                            message: "",
                        });
                    }
                }
            })
            .catch((err: any) => {
                console.log("err====", err);
            });
    }

    static getUseProps(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static getRelive(handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static getGetBillboard(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static exchangeClub(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static checkExtract(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static GmChangeRound(data: any, handler: any): void {
        handler?.runWith(LocalServer.instance.debugRequestChangeRound(data.round));
    }

    static UseClubProp(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static clubGold(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static UseMoveCueBallProp(data: any, handler: any): void {
        handler?.runWith(LocalServer.instance.requestUseMoveCueBallProp());
    }

    static extractGold(data: any, handler: any): void {
        handler.runWith({
            code: 1,
            data: {
                extract_gold_cash_record: [{ gold_cash: 10, id: 1, rank: 0 }],
                extract_money: 1e3,
                gold_balance: 1e3,
            },
            ecp: 0,
            message: "",
        });
    }

    static submitLevel(data: any, handler: any): void {
        handler?.runWith(LocalServer.instance.requestCompleteGame(data.success));
    }

    static GmGetClubShard(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static headList(handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static changeClub(data: any, handler: any): void {
        handler?.runWith(LocalServer.instance.requestChangeCue(data.club_id));
    }

    static getUpdateLevel(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    static extractCash(data: any, handler: any): void {
        handler.runWith({
            code: 1,
            data: {
                cash_balance: 1e3,
                extract_game_cash: 2639,
                extract_money: 1e3,
                fail_message: "",
                success: true,
            },
            ecp: 0,
            message: "",
        });
    }
}
