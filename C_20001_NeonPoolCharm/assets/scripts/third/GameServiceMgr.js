let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "4d680crVLBKlJe+S6eeILRr", "GameServiceMgr");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
o.AD_TYPE = void 0;
var n,
i = e("CueDataSys.js"),
a = e("PropDataSys.js"),
r = e("AudioManager.js"),
l = e("ConfigDataSys.js"),
s = e("PlayerDataSys.js"),
c = e("SystemDataSys.js"),
u = e(RequestData "
  }].js),
      p = e(" EventMgr.js "),
      d = e(" GameEventType.js "),
      _ = e(" Handler.js "),
      f = e(" GameService.js "),
      h = e(" BaseSystem.js "),
      g = e(" EngineUtil.js "),
      y = e(" PageMgr.js ");
    (function (e) {
      e.big_cash = " big_cash ";
      e.lucky_box = " lucky_box ";
      e.task = " task ";
      e.subsidy_card = " subsidy_card ";
      e.props_remove = " props_remove ";
      e.props_redo = " props_redo ";
      e.props_refresh = " props_refresh ";
      e.subsidy_card_passive = " subsidy_card_passive ";
      e.subsidy_card_active = " subsidy_card_active ";
      e[e.level_submit = 1] = " level_submit ";
      e[e.level_submit_force = 2] = " level_submit_force ";
      e[e.remove_billiard_cash = 3] = " remove_billiard_cash ";
      e[e.remove_billiard_cash_force = 4] = " remove_billiard_cash_force ";
      e[e.relive = 5] = " relive ";
      e[e.line_prop = 6] = " line_prop ";
      e[e.baiqiu_prop = 7] = " baiqiu_prop ";
      e[e.get_clubs = 8] = " get_clubs ";
      e[e.lucky_draw = 9] = " lucky_draw ";
      e[e.baoxiang = 10] = " baoxiang ";
      e[e.hongbaoqun = 11] = " hongbaoqun ";
    })(n = o.AD_TYPE || (o.AD_TYPE = {}));
    var v = function () {
      function e() {}
      e.prototype.submitLevel = function (e, t, o) {
        s.default.getUserCpm() && Object.assign(e, s.default.getUserCpm());
        f.default.submitLevel(e, _.default.create(this, function (e) {
          console.log(" submitLevel 返回 ", e);
          if (e && 1 == e.code) {
            var n = e.data;
            s.default.user_level = n.level_a;
            s.default.level_info = {
              level_a: n.level_a,
              level_b: n.level_b,
              level_c: n.level_c,
              roundCount: n.roundCount,
              turnCount: n.turnCount
            };
            s.default.table = n.table;
            s.default.turn_pass = n.turn_pass;
            s.default.cash_balance = n.cash_balance;
            s.default.gold_balance = n.gold_balance;
            s.default.total_gold += n.gold_prize;
            s.default.level_force = n.level_force;
            s.default.show_draw = n.show_draw;
            s.default.show_level_reward = n.show_level_reward;
            s.default.max_extract_id = n.max_extract_id;
            s.default.level_pass = n.level_pass;
            s.default.sign_level_count++;
            n.level_ad && (s.default.level_ad = n.level_ad);
            n.total_video_count && (s.default.total_video_count = n.total_video_count);
            s.default.scene_id = n.scene_id;
            s.default.level_pass_success_count = n.level_pass_success_count || 0;
            i.default.checkUnlockCue();
            s.default.updateCashRecord(n.extract_gold_cash_record);
            t && t();
          } else if (e && e.message) {
            o && o();
            g.default.showManageViewToast(e.message);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.headList = function (e) {
        e && e();
      };
      e.prototype.GmOpenCues = function (e, t, o) {
        f.default.GmOpenCues(e, _.default.create(this, function (e) {
          console.log(" GmOpenCues 返回 ", e);
          if (e && 1 == e.code) {
            var t = e.data;
            i.default.get_clubs = t.get_clubs;
            i.default.usedCueId = t.use_club_id;
            i.default.nextCueID = t.next_club_id;
            p.default.trigger(d.default.ON_GETTED_CLUBS_CHANGED);
            p.default.trigger(d.default.ON_USED_CLUB_CHANGED);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.exchangeClub = function (e, t, o) {
        var n = this;
        f.default.exchangeClub({
          club_id: e
        }, _.default.create(this, function (e) {
          console.log(" exchangeClub 返回 ", e);
          if (e && 1 == e.code) {
            var a = e.data,
              l = (a.level_ad, a.get_clubs),
              c = a.use_club_id,
              u = a.level_pass,
              _ = a.max_extract_id;
            l && (i.default.get_clubs = l);
            c && (i.default.usedCueId = c);
            null != u && (s.default.level_pass = u);
            null != _ && (s.default.max_extract_id = _);
            n.checkTiXianUp();
            r.default.getInstance().playMusic(" pool_cueunlock ");
            p.default.trigger(d.default.ON_GETTED_CLUBS_CHANGED);
            p.default.trigger(d.default.ON_USED_CLUB_CHANGED);
            t && t(e);
          } else if (e && e.message) {
            o && o();
            g.default.showManageViewToast(e.message);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.GmGetCpmRecord = function (e) {
        f.default.GmGetCpmRecord({}, _.default.create(this, function (t) {
          t && 1 == t.code && e && e(t.data);
        }));
      };
      e.prototype.submitGuideLevel = function (e, t, o) {
        f.default.submitGuideLevel({
          guide_id: e
        }, _.default.create(this, function (n) {
          console.log(" submitGuideLevel 返回 ", e, n);
          if (n && 1 == n.code) {
            var i = n.data;
            i.gold_balance && (s.default.gold_balance = i.gold_balance);
            t && t(n.data);
          } else if (n && n.message) {
            o && o();
            g.default.showManageViewToast(n.message);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.GetGameLevelConfig = function (e, t, o) {
        f.default.GetGameLevelConfig({
          level_name: e
        }, _.default.create(this, function (n) {
          console.log(" 获取关卡球桌配置文件 ", n);
          if (n && 1 == n.code) t && t(n.data.config);else if (n && n.message) {
            o && o();
            console.log(" GetGameLevelConfig failed: ", e);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.refreshNextClub = function (e, t, o) {
        f.default.refreshNextClub(null, _.default.create(this, function (e) {
          console.log(" refreshNextClub 返回 ", e);
          if (e && 1 == e.code) {
            var t = e.data;
            i.default.get_clubs = t.get_clubs;
            i.default.usedCueId = t.use_club_id;
            i.default.nextCueID = t.next_club_id;
            p.default.trigger(d.default.ON_GETTED_CLUBS_CHANGED);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.GmChangeRound = function (e, t, o) {
        f.default.GmChangeRound({
          round: e
        }, _.default.create(this, function (e) {
          console.log(" GmChangeRound 返回 ", e);
          if (e && 1 == e.code) {
            var n = e.data;
            s.default.user_level = n.level_a;
            s.default.level_info = {
              level_a: n.level_a,
              level_b: n.level_b,
              level_c: n.level_c,
              roundCount: n.roundCount,
              turnCount: n.turnCount
            };
            s.default.turn_pass = n.turn_pass;
            s.default.level_pass = n.level_pass;
            s.default.table = n.table;
            s.default.level_loop = n.level_loop;
            console.log(" jump to level: " + n.level_a + "- " + n.level_b + "- " + n.level_c);
            t && t(e.data);
          } else if (e && e.message) {
            o && o();
            g.default.showManageViewToast(e.message);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.reportAd = function (e, t, o) {
        e.success && s.default.getUserCpm() && Object.assign(e, s.default.getUserCpm());
        f.default.reportAd(e, _.default.create(this, function (i) {
          console.log(" reportAd 返回 ", i);
          if (i && 1 == i.code) {
            var a = i.data,
              r = a.level_ad,
              c = a.cash_balance,
              _ = a.prop,
              f = a.remove_billiard_force,
              h = a.total_video_count;
            null != r && (s.default.level_ad = r);
            null != h && (s.default.total_video_count = h);
            s.default.updateCashRecord(a.extract_gold_cash_record);
            _ && (s.default.prop_info = _);
            null != f && (s.default.remove_billiard_force = f);
            c && (s.default.cash_balance = c);
            var y = [];
            a.cash_prize && y.push({
              type: u.RewardType.HongBao,
              num: a.cash_prize
            });
            if (n.relive == e.ad_type) {
              var v = Number(l.default.getFuhuoHeartAddCount());
              y.push({
                type: u.RewardType.Xin,
                num: v
              });
            }
            if (n.baiqiu_prop == e.ad_type) {
              var m = Number(l.default.getBaiqiuPropCount());
              y.push({
                type: u.RewardType.DaoJu,
                num: m
              });
            }
            if (n.line_prop == e.ad_type) {
              m = l.default.getLinePropTime();
              y.push({
                type: u.RewardType.MiaoZhunXian,
                num: m
              });
            }
            p.default.trigger(d.default.ON_PROP_COUNT_CHANGED);
            t && t(i);
          } else if (i && i.message) {
            o && o();
            g.default.showManageViewToast(i.message);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e._getInstance = function () {
        e._instance || (e._instance = new e());
        return e._instance;
      };
      e.prototype.GmChangeLevel = function (e, t, o) {
        f.default.GmChangeLevel(e, _.default.create(this, function (e) {
          console.log(" GmChangeLevel 返回 ", e);
          if (e && 1 == e.code) {
            var n = e.data;
            s.default.user_level = n.level_a;
            s.default.level_info = {
              level_a: n.level_a,
              level_b: n.level_b,
              level_c: n.level_c,
              roundCount: n.roundCount,
              turnCount: n.turnCount
            };
            s.default.turn_pass = n.turn_pass;
            s.default.level_pass = n.level_pass;
            s.default.table = n.table;
            s.default.level_loop = n.level_loop;
            console.log(" jump to level: " + n.level_a + "- " + n.level_b);
            t && t(e.data);
          } else if (e && e.message) {
            o && o();
            g.default.showManageViewToast(e.message);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.deprecatedGmChangeLevel = function (e, t, o) {
        f.default.deprecatedGmChangeLevel(e, _.default.create(this, function (e) {
          console.log(" GmChangeLevel 返回 ", e);
          if (e && 1 == e.code) {
            var n = e.data;
            s.default.user_level = n.level_a;
            s.default.level_info = {
              level_a: n.level_a,
              level_b: n.level_b,
              level_c: n.level_c,
              roundCount: n.roundCount,
              turnCount: n.turnCount
            };
            s.default.turn_pass = n.turn_pass;
            s.default.level_pass = n.level_pass;
            s.default.table = n.table;
            s.default.level_loop = n.level_loop;
            console.log(" jump to level: " + n.level_a + "- " + n.level_b + "- " + n.level_c);
            t && t(e.data);
          } else if (e && e.message) {
            o && o();
            g.default.showManageViewToast(e.message);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.extractRecord = function (e, t) {
        f.default.extractRecord(_.default.create(this, function (o) {
          console.log(" extractRecord 返回 ", o);
          if (o && 1 == o.code) {
            o.data;
            e && e(o.data);
          } else if (o && o.message) {
            t && t();
            g.default.showManageViewToast(o.message);
          }
        }), _.default.create(this, function (e) {
          t && t(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.UseMoveCueBallProp = function (e, t, o) {
        f.default.UseMoveCueBallProp({}, _.default.create(this, function (e) {
          console.log(" UseClubProp 返回 ", e);
          if (e && 1 == e.code) {
            var n = e.data.prop;
            if (n) {
              s.default.prop_info = n;
              a.default.usePropBaiQiu(!0);
              p.default.trigger(d.default.ON_PROP_COUNT_CHANGED);
            }
            t && t(e.data);
          } else if (e && e.message) {
            o && o();
            g.default.showManageViewToast(e.message);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.getClub = function (e, t, o) {
        var n = {
          club_id: e,
          use: !0
        };
        s.default.getUserCpm() && Object.assign(n, s.default.getUserCpm());
        f.default.getClub(n, _.default.create(this, function (e) {
          console.log(" getClub 返回 ", e);
          if (e && 1 == e.code) {
            var n = e.data,
              a = n.level_ad,
              l = n.get_clubs,
              c = n.use_club_id,
              u = n.level_pass,
              _ = n.max_extract_id,
              f = (n.cash_prize, n.cash_balance),
              h = n.total_video_count;
            n.extract_gold_cash_record;
            l && (i.default.get_clubs = l);
            c && (i.default.usedCueId = c);
            i.default.nextCueID = n.next_club_id;
            null != u && (s.default.level_pass = u);
            null != _ && (s.default.max_extract_id = _);
            null != a && (s.default.level_ad = a);
            null != h && (s.default.total_video_count = h);
            r.default.getInstance().playMusic(" pool_cueunlock ");
            f && (s.default.cash_balance = f);
            p.default.trigger(d.default.ON_GETTED_CLUBS_CHANGED);
            p.default.trigger(d.default.ON_USED_CLUB_CHANGED);
            t && t(e);
          } else if (e && e.message) {
            o && o();
            g.default.showManageViewToast(e.message);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.extractCash = function (e, t, o) {
        console.log(" 提现红包挡位 ", e);
        var n = l.default.cash_extract_configMap.get(e);
        s.default.cash_balance * n.withdraw_percent < 10 ? g.default.showManageViewToast(" 满0.1元可提现 ， 看视频可快速累积红包 ") : f.default.extractCash({
          extract_id: e
        }, _.default.create(this, function (e) {
          console.log(" 提现返回 ", e);
          if (e && 1 == e.code) {
            var n = e.data;
            s.default.cash_balance = n.cash_balance;
            n.success || g.default.showManageViewToast(n.fail_message);
            t && t(n);
          } else if (e && e.message) {
            o && o();
            g.default.showManageViewToast(e.message);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.GuideGift = function (e, t) {
        console.log(" 领取引导奖励 ");
        f.default.GuideGift(_.default.create(this, function (o) {
          console.log(" 领取引导奖励 ", o);
          if (o && 1 == o.code) {
            var n = o.data;
            s.default.total_gold += n.gold_balance - s.default.gold_balance;
            s.default.gold_balance = n.gold_balance;
            e && e(n);
          } else if (o && o.message) {
            t && t();
            g.default.showManageViewToast(o.message);
          }
        }), _.default.create(this, function (e) {
          t && t(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.signIn = function (e, t) {
        f.default.signIn(_.default.create(this, function (o) {
          console.log(" signIn 返回 ", o);
          if (o && 1 == o.code) {
            var n = o.data;
            s.default.sign_today = !0;
            s.default.sign_in_count++;
            n.level_ad && (s.default.level_ad = n.level_ad);
            n.total_video_count && (s.default.total_video_count = n.total_video_count);
            s.default.updateCashRecord(n.extract_gold_cash_record);
            var a = [];
            n.rewards.forEach(function (e) {
              var t = {
                type: Number(e.type),
                num: e.count
              };
              a.push(t);
              e.cash_balance && (s.default.cash_balance = e.cash_balance);
              if (e.gold_balance) {
                s.default.gold_balance = e.gold_balance;
                s.default.total_gold += e.count;
              }
              e.prop && (s.default.prop_info = e.prop);
              if (e.get_clubs) {
                i.default.get_clubs = e.get_clubs;
                i.default.usedCueId = e.use_club_id;
                t.num = 1;
                t.id = e.count;
                p.default.trigger(d.default.ON_GETTED_CLUBS_CHANGED);
              }
              e.sign_balance && (s.default.sign_balance = e.sign_balance);
            });
            e && e(n);
          } else if (o && o.message) {
            t && t();
            g.default.showManageViewToast(o.message);
          }
        }), _.default.create(this, function (e) {
          t && t(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.checkTiXianUp = function () {
        s.default.show_extract && !c.default.is_IOS_reviewer && (s.default.show_extract = !1);
      };
      e.prototype.GMAddSignInCount = function (e, t) {
        f.default.GMAddSignInCount({
          sign_in_count: e
        }, _.default.create(this, function (e) {
          t && t(e.data);
          var o = e.data.sign_in_count;
          s.default.sign_in_count = o;
        }));
      };
      e.prototype.extractGold = function (e, t, o) {
        console.log(" 提现现金挡位 ", e);
        s.default.gold_balance < 10 ? g.default.showManageViewToast(" 满0.1元可提现 ， 看视频可快速累积现金 ") : f.default.extractGold({
          extract_id: e
        }, _.default.create(this, function (e) {
          console.log(" 现金提现返回 ", e);
          if (e && 1 == e.code) {
            var n = e.data;
            s.default.gold_balance = n.gold_balance;
            s.default.updateCashRecord(n.extract_gold_cash_record);
            p.default.trigger(d.default.UPDATE_QIPAO);
            t && t(n);
          } else if (e && e.message) {
            o && o();
            g.default.showManageViewToast(e.message);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.UseClubProp = function (e, t, o) {
        f.default.UseClubProp({
          prop_id: e
        }, _.default.create(this, function (e) {
          console.log(" UseClubProp 返回 ", e);
          if (e && 1 == e.code) {
            var n = e.data.prop;
            if (n) {
              s.default.prop_info = n;
              a.default.usePropBaiQiu(!0);
              p.default.trigger(d.default.ON_PROP_COUNT_CHANGED);
            }
            t && t(e.data);
          } else if (e && e.message) {
            o && o();
            g.default.showManageViewToast(e.message);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.GmChangeCash = function (e, t, o, n) {
        f.default.GmChangeCash({
          type: e,
          num: t
        }, _.default.create(this, function (e) {
          console.log(" GmChangeCash返回 ", e);
          if (e && 1 == e.code) {
            var t = e.data,
              i = t.cash_balance,
              a = t.gold_balance;
            i && (s.default.cash_balance = i);
            if (a) {
              s.default.total_gold += a - s.default.gold_balance;
              s.default.gold_balance = a;
            }
            o && o(e);
          } else if (e && e.message) {
            n && n();
            g.default.showManageViewToast(e.message);
          }
        }), _.default.create(this, function (e) {
          n && n(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.clubGold = function (e, t, o) {
        f.default.clubGold({
          id: e
        }, _.default.create(this, function (e) {
          console.log(" clubGold 返回 ", e);
          if (e && 1 == e.code) {
            var n = e.data;
            i.default.club_gold_index = n.club_gold_index;
            s.default.gold_balance = n.gold_balance;
            s.default.total_gold += n.gold_prize;
            p.default.trigger(d.default.ON_UNLOCKED_CLUBS_GOLD);
            t && t(e);
          } else if (e && e.message) {
            o && o();
            g.default.showManageViewToast(e.message);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.GmGetClubShard = function () {
        f.default.GmGetClubShard({}, _.default.create(this, function (e) {
          if (e && 1 == e.code) for (var t = e.data.club_shard, o = 0, n = t; o < n.length; o++) {
            var a = n[o];
            i.default.club_shard[a] = t[a];
          }
        }));
      };
      e.prototype.deprecatedGmChangeTurn = function (e, t, o) {
        f.default.deprecatedGmChangeTurn({
          turn: e
        }, _.default.create(this, function (e) {
          console.log(" GmChangeTurn 返回 ", e);
          if (e && 1 == e.code) {
            var n = e.data;
            s.default.user_level = n.level_a;
            s.default.level_info = {
              level_a: n.level_a,
              level_b: n.level_b,
              level_c: n.level_c,
              roundCount: n.roundCount,
              turnCount: n.turnCount
            };
            s.default.turn_pass = n.turn_pass;
            s.default.level_pass = n.level_pass;
            s.default.table = n.table;
            s.default.level_loop = n.level_loop;
            console.log(" jump to level: " + n.level_a + "- " + n.level_b + "- " + n.level_c);
            t && t(e.data);
          } else if (e && e.message) {
            o && o();
            g.default.showManageViewToast(e.message);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.changeClub = function (e, t, o) {
        f.default.changeClub({
          club_id: e
        }, _.default.create(this, function (e) {
          console.log(" changeClub 返回 ", e);
          if (e && 1 == e.code) {
            var n = e.data,
              a = (n.level_ad, n.get_clubs),
              r = n.use_club_id;
            a && (i.default.get_clubs = a);
            r && (i.default.usedCueId = r);
            i.default.nextCueID = n.next_club_id;
            p.default.trigger(d.default.ON_GETTED_CLUBS_CHANGED);
            p.default.trigger(d.default.ON_USED_CLUB_CHANGED);
            t && t(e);
          } else if (e && e.message) {
            o && o();
            g.default.showManageViewToast(e.message);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e.prototype.logoff = function () {
        h.default.logoff({
          yid: s.default.yid
        }, _.default.create(this, function (e) {
          console.log(" 用户注销接口返回 === = ", e);
          if (e && 1 == e.code) {
            y.default.clear();
            g.default.setLocalData(" yid ", " ");
            g.default.showManageViewToast(" 用户注销成功 ");
            cc.game.restart();
          } else g.default.showManageViewToast(e.message || " 网络异常 ， 检查网络后重试 ");
        }), _.default.create(this, function () {
          g.default.showManageViewToast(" 网络异常 ， 检查网络后重试 ");
        }));
      };
      e.prototype.chouJiang = function (e, t, o) {
        var n = {
          is_ad: e
        };
        e && s.default.getUserCpm() && Object.assign(n, s.default.getUserCpm());
        f.default.chouJiang(n, _.default.create(this, function (e) {
          console.log(" 抽奖返回 ", e);
          if (e && 1 == e.code) {
            var n = e.data;
            n.level_ad && (s.default.level_ad = n.level_ad);
            n.total_video_count && (s.default.total_video_count = n.total_video_count);
            s.default.updateCashRecord(n.extract_gold_cash_record);
            t && t(n);
          } else if (e && e.message) {
            o && o();
            g.default.showManageViewToast(e.message);
          }
        }), _.default.create(this, function (e) {
          o && o(e);
          g.default.showManageViewToast(i18n.t(" network_toast "));
        }));
      };
      e._instance = null;
      return e;
    }();
    o.default = v._getInstance();
    cc._RF.pop();
