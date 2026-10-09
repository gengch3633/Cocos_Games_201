import EngineUtil from "./EngineUtil";
import LocalServer from "./LocalServer";

export default class GameService {
    static getRemoveCard(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static getDiamondList(e) {
        null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static GuideGift(e, t?) {
        e.runWith({
            code: 1,
            data: {
                gold_balance: 9999
            },
            ecp: 0,
            message: ""
        });
    }

    static GmGetCpmRecord(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {
                records: []
            },
            ecp: 0,
            message: ""
        });
    }

    static signIn(e, t?) {
        null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static offline(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static GMAddSignInCount(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static repaireOrder(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static report(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static extractInfo(e) {
        null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static getRefreshLevel(e) {
        null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static checkCashInfo(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static chouJiang(e, t, o?) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static GmChangeLevel(e, t, o?) {
        null == t || t.runWith(LocalServer.instance.debugRequestChangeLevel(e.levelA, e.levelB));
    }

    static deprecatedGmChangeTurn(e, t, o?) {
        null == t || t.runWith(LocalServer.instance.deprecatedDebugRequestChangeTurn(e.turn));
    }

    static deprecatedGmChangeLevel(e, t, o?) {
        null == t || t.runWith(LocalServer.instance.deprecatedDebugRequestChangeLevel(e.levelA, e.levelB, e.levelC));
    }

    static reportAd(e, t, o?) {
        null == t || t.runWith(LocalServer.instance.requestCompleteAd(e.ad_type, e.success));
    }

    static PayerMaxCreateOrder(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static createOrer(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static orderStatus(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static getLevelStatistics(e) {
        null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static receiveGift(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static getCommitTask(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static getClub(e, t, o?) {
        null == t || t.runWith(LocalServer.instance.requestUnlockCue(e.club_id, e.use));
    }

    static getDiamond(e) {
        null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static verifyOrder(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static getTaskList(e) {
        null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static refreshNextClub(e, t, o?) {
        null == t || t.runWith(LocalServer.instance.requestRefreshNextCue());
    }

    static useDiamond(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static GmChangeCash(e, t, o?) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static gmToLevel(e, t, o?) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static GmOpenCues(e, t, o?) {
        null == t || t.runWith(LocalServer.instance.debugRequestOpenCues(e.cueCount));
    }

    static extractRecord(e, t?) {
        null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static PayerMaxCheckOrderStatus(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static gmAddDiamond(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static submitGuideLevel(e, t, o?) {
        null == t || t.runWith(LocalServer.instance.requestCompleteGuide(e.guide_id));
    }

    static GetGameLevelConfig(e, t, o?) {
        EngineUtil.loadResourceAsset("config/lv/" + e.level_name).then(function (e) {
            if (t) {
                const o = e.json;
                o && t.runWith({
                    code: 1,
                    data: {
                        config: o
                    },
                    ecp: 0,
                    message: ""
                });
            }
        }).catch(function (e) {
            console.log("err====", e);
        });
    }

    static getUseProps(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static getRelive(e) {
        null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static getGetBillboard(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static exchangeClub(e, t, o?) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static checkExtract(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static GmChangeRound(e, t, o?) {
        null == t || t.runWith(LocalServer.instance.debugRequestChangeRound(e.round));
    }

    static UseClubProp(e, t, o?) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static clubGold(e, t, o?) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static UseMoveCueBallProp(e, t, o?) {
        null == t || t.runWith(LocalServer.instance.requestUseMoveCueBallProp());
    }

    static extractGold(e, t, o?) {
        t.runWith({
            code: 1,
            data: {
                extract_gold_cash_record: [{
                    gold_cash: 10,
                    id: 1,
                    rank: 0
                }],
                extract_money: 1e3,
                gold_balance: 1e3
            },
            ecp: 0,
            message: ""
        });
    }

    static submitLevel(e, t, o?) {
        null == t || t.runWith(LocalServer.instance.requestCompleteGame(e.success));
    }

    static GmGetClubShard(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static headList(e) {
        null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static changeClub(e, t, o?) {
        null == t || t.runWith(LocalServer.instance.requestChangeCue(e.club_id));
    }

    static getUpdateLevel(e, t) {
        null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: ""
        });
    }

    static extractCash(e, t, o?) {
        t.runWith({
            code: 1,
            data: {
                cash_balance: 1e3,
                extract_game_cash: 2639,
                extract_money: 1e3,
                fail_message: "",
                success: true
            },
            ecp: 0,
            message: ""
        });
    }
}
