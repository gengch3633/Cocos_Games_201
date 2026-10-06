let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "9c35dlvqKhOeKsonsv2k/1b", "GameService");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = e("LocalServer.js"),
i = e(EngineUtil "
  }].js),
      a = function () {
        function e() {}
        e.getRemoveCard = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.getDiamondList = function (e) {
          null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.GuideGift = function (e) {
          e.runWith({
            code: 1,
            data: {
              gold_balance: 9999
            },
            ecp: 0,
            message: " "
          });
        };
        e.GmGetCpmRecord = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {
              records: []
            },
            ecp: 0,
            message: " "
          });
        };
        e.signIn = function (e) {
          null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.offline = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.GMAddSignInCount = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.repaireOrder = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.report = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.extractInfo = function (e) {
          null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.getRefreshLevel = function (e) {
          null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.checkCashInfo = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.chouJiang = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.GmChangeLevel = function (e, t) {
          null == t || t.runWith(n.default.instance.debugRequestChangeLevel(e.levelA, e.levelB));
        };
        e.deprecatedGmChangeTurn = function (e, t) {
          null == t || t.runWith(n.default.instance.deprecatedDebugRequestChangeTurn(e.turn));
        };
        e.deprecatedGmChangeLevel = function (e, t) {
          null == t || t.runWith(n.default.instance.deprecatedDebugRequestChangeLevel(e.levelA, e.levelB, e.levelC));
        };
        e.reportAd = function (e, t) {
          null == t || t.runWith(n.default.instance.requestCompleteAd(e.ad_type, e.success));
        };
        e.PayerMaxCreateOrder = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.createOrer = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.orderStatus = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.getLevelStatistics = function (e) {
          null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.receiveGift = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.getCommitTask = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.getClub = function (e, t) {
          null == t || t.runWith(n.default.instance.requestUnlockCue(e.club_id, e.use));
        };
        e.getDiamond = function (e) {
          null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.verifyOrder = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.getTaskList = function (e) {
          null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.refreshNextClub = function (e, t) {
          null == t || t.runWith(n.default.instance.requestRefreshNextCue());
        };
        e.useDiamond = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.GmChangeCash = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.gmToLevel = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.GmOpenCues = function (e, t) {
          null == t || t.runWith(n.default.instance.debugRequestOpenCues(e.cueCount));
        };
        e.extractRecord = function (e) {
          null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.PayerMaxCheckOrderStatus = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.gmAddDiamond = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.submitGuideLevel = function (e, t) {
          null == t || t.runWith(n.default.instance.requestCompleteGuide(e.guide_id));
        };
        e.GetGameLevelConfig = function (e, t) {
          i.default.loadResourceAsset(" config/ lv/ " + e.level_name).then(function (e) {
            if (t) {
              var o = e.json;
              o && t.runWith({
                code: 1,
                data: {
                  config: o
                },
                ecp: 0,
                message: " "
              });
            }
          }).catch(function (e) {
            console.log(" err === = ", e);
          });
        };
        e.getUseProps = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.getRelive = function (e) {
          null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.getGetBillboard = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.exchangeClub = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.checkExtract = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.GmChangeRound = function (e, t) {
          null == t || t.runWith(n.default.instance.debugRequestChangeRound(e.round));
        };
        e.UseClubProp = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.clubGold = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.UseMoveCueBallProp = function (e, t) {
          null == t || t.runWith(n.default.instance.requestUseMoveCueBallProp());
        };
        e.extractGold = function (e, t) {
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
            message: " "
          });
        };
        e.submitLevel = function (e, t) {
          null == t || t.runWith(n.default.instance.requestCompleteGame(e.success));
        };
        e.GmGetClubShard = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.headList = function (e) {
          null == e || e.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.changeClub = function (e, t) {
          null == t || t.runWith(n.default.instance.requestChangeCue(e.club_id));
        };
        e.getUpdateLevel = function (e, t) {
          null == t || t.runWith({
            code: 1,
            data: {},
            ecp: 0,
            message: " "
          });
        };
        e.extractCash = function (e, t) {
          t.runWith({
            code: 1,
            data: {
              cash_balance: 1e3,
              extract_game_cash: 2639,
              extract_money: 1e3,
              fail_message: " ",
              success: !0
            },
            ecp: 0,
            message: " "
          });
        };
        return e;
      }();
    o.default = a;
    cc._RF.pop();
