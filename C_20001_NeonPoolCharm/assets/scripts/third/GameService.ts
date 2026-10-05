import LocalServer from "./LocalServer";
import EngineUtil from "./EngineUtil";
import Handler from "./Handler";

interface ServiceResponse {
    code: number;
    data: Record<string, unknown>;
    ecp: number;
    message: string;
}

export default class GameService {
    static getRemoveCard(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static getDiamondList(callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static GuideGift(callback: Handler): void {
        callback.runWith({
            code: 1,
            data: {
                gold_balance: 9999,
            },
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static GmGetCpmRecord(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {
                records: [],
            },
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static signIn(callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static offline(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static GMAddSignInCount(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static repaireOrder(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static report(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static extractInfo(callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static getRefreshLevel(callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static checkCashInfo(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static chouJiang(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static GmChangeLevel(params: { levelA: unknown; levelB: unknown }, callback: Handler | null): void {
        callback?.runWith(LocalServer.instance.debugRequestChangeLevel(params.levelA, params.levelB));
    }

    static deprecatedGmChangeTurn(params: { turn: unknown }, callback: Handler | null): void {
        callback?.runWith(LocalServer.instance.deprecatedDebugRequestChangeTurn(params.turn));
    }

    static deprecatedGmChangeLevel(
        params: { levelA: unknown; levelB: unknown; levelC: unknown },
        callback: Handler | null
    ): void {
        callback?.runWith(
            LocalServer.instance.deprecatedDebugRequestChangeLevel(params.levelA, params.levelB, params.levelC)
        );
    }

    static reportAd(params: { ad_type: unknown; success: unknown }, callback: Handler | null): void {
        callback?.runWith(LocalServer.instance.requestCompleteAd(params.ad_type, params.success));
    }

    static PayerMaxCreateOrder(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static createOrer(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static orderStatus(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static getLevelStatistics(callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static receiveGift(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static getCommitTask(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static getClub(params: { club_id: unknown; use: unknown }, callback: Handler | null): void {
        callback?.runWith(LocalServer.instance.requestUnlockCue(params.club_id, params.use));
    }

    static getDiamond(callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static verifyOrder(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static getTaskList(callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static refreshNextClub(_params: unknown, callback: Handler | null): void {
        callback?.runWith(LocalServer.instance.requestRefreshNextCue());
    }

    static useDiamond(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static GmChangeCash(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static gmToLevel(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static GmOpenCues(params: { cueCount: unknown }, callback: Handler | null): void {
        callback?.runWith(LocalServer.instance.debugRequestOpenCues(params.cueCount));
    }

    static extractRecord(callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static PayerMaxCheckOrderStatus(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static gmAddDiamond(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static submitGuideLevel(params: { guide_id: unknown }, callback: Handler | null): void {
        callback?.runWith(LocalServer.instance.requestCompleteGuide(params.guide_id));
    }

    static GetGameLevelConfig(params: { level_name: string }, callback: Handler | null): void {
        EngineUtil.loadResourceAsset("config/lv/" + params.level_name)
            .then((asset: cc.JsonAsset) => {
                if (callback) {
                    const json = asset.json;
                    if (json) {
                        callback.runWith({
                            code: 1,
                            data: {
                                config: json,
                            },
                            ecp: 0,
                            message: "",
                        } as ServiceResponse);
                    }
                }
            })
            .catch((error) => {
                console.log("err====", error);
            });
    }

    static getUseProps(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static getRelive(callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static getGetBillboard(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static exchangeClub(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static checkExtract(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static GmChangeRound(params: { round: unknown }, callback: Handler | null): void {
        callback?.runWith(LocalServer.instance.debugRequestChangeRound(params.round));
    }

    static UseClubProp(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static clubGold(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static UseMoveCueBallProp(_params: unknown, callback: Handler | null): void {
        callback?.runWith(LocalServer.instance.requestUseMoveCueBallProp());
    }

    static extractGold(_params: unknown, callback: Handler): void {
        callback.runWith({
            code: 1,
            data: {
                extract_gold_cash_record: [
                    {
                        gold_cash: 10,
                        id: 1,
                        rank: 0,
                    },
                ],
                extract_money: 1000,
                gold_balance: 1000,
            },
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static submitLevel(params: { success: unknown }, callback: Handler | null): void {
        callback?.runWith(LocalServer.instance.requestCompleteGame(params.success));
    }

    static GmGetClubShard(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static headList(callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static changeClub(params: { club_id: unknown }, callback: Handler | null): void {
        callback?.runWith(LocalServer.instance.requestChangeCue(params.club_id));
    }

    static getUpdateLevel(_params: unknown, callback: Handler | null): void {
        callback?.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }

    static extractCash(_params: unknown, callback: Handler): void {
        callback.runWith({
            code: 1,
            data: {
                cash_balance: 1000,
                extract_game_cash: 2639,
                extract_money: 1000,
                fail_message: "",
                success: true,
            },
            ecp: 0,
            message: "",
        } as ServiceResponse);
    }
}
