import CueDataSys from "./CueDataSys";
import PropDataSys from "./PropDataSys";
import AudioManager from "./AudioManager";
import ConfigDataSys from "./ConfigDataSys";
import PlayerDataSys from "./PlayerDataSys";
import SystemDataSys from "./SystemDataSys";
import { RewardType } from "./RequestData";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import Handler from "./Handler";
import GameService from "./GameService";
import BaseSystem from "./BaseSystem";
import EngineUtil from "./EngineUtil";
import PageMgr from "./PageMgr";

declare const i18n: { t(key: string, params?: any): string };

export enum AD_TYPE {
    big_cash = "big_cash",
    lucky_box = "lucky_box",
    task = "task",
    subsidy_card = "subsidy_card",
    props_remove = "props_remove",
    props_redo = "props_redo",
    props_refresh = "props_refresh",
    subsidy_card_passive = "subsidy_card_passive",
    subsidy_card_active = "subsidy_card_active",
    level_submit = 1,
    level_submit_force = 2,
    remove_billiard_cash = 3,
    remove_billiard_cash_force = 4,
    relive = 5,
    line_prop = 6,
    baiqiu_prop = 7,
    get_clubs = 8,
    lucky_draw = 9,
    baoxiang = 10,
    hongbaoqun = 11,
}

class GameServiceMgr {
    private static _instance: GameServiceMgr = null;

    private static _getInstance(): GameServiceMgr {
        if (!GameServiceMgr._instance) {
            GameServiceMgr._instance = new GameServiceMgr();
        }
        return GameServiceMgr._instance;
    }

    submitLevel(e: any, t?: () => void, o?: (err?: any) => void): void {
        PlayerDataSys.getUserCpm() && Object.assign(e, PlayerDataSys.getUserCpm());
        GameService.submitLevel(
            e,
            Handler.create(this, function (e: any) {
                console.log(" submitLevel 返回 ", e);
                if (e && 1 == e.code) {
                    var n = e.data;
                    PlayerDataSys.user_level = n.level_a;
                    PlayerDataSys.level_info = {
                        level_a: n.level_a,
                        level_b: n.level_b,
                        level_c: n.level_c,
                        roundCount: n.roundCount,
                        turnCount: n.turnCount,
                    };
                    PlayerDataSys.table = n.table;
                    PlayerDataSys.turn_pass = n.turn_pass;
                    PlayerDataSys.cash_balance = n.cash_balance;
                    PlayerDataSys.gold_balance = n.gold_balance;
                    PlayerDataSys.total_gold += n.gold_prize;
                    PlayerDataSys.level_force = n.level_force;
                    PlayerDataSys.show_draw = n.show_draw;
                    PlayerDataSys.show_level_reward = n.show_level_reward;
                    PlayerDataSys.max_extract_id = n.max_extract_id;
                    PlayerDataSys.level_pass = n.level_pass;
                    PlayerDataSys.sign_level_count++;
                    n.level_ad && (PlayerDataSys.level_ad = n.level_ad);
                    n.total_video_count && (PlayerDataSys.total_video_count = n.total_video_count);
                    PlayerDataSys.scene_id = n.scene_id;
                    PlayerDataSys.level_pass_success_count = n.level_pass_success_count || 0;
                    CueDataSys.checkUnlockCue();
                    PlayerDataSys.updateCashRecord(n.extract_gold_cash_record);
                    t && t();
                } else if (e && e.message) {
                    o && o();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, function (e: any) {
                o && o(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    headList(e?: () => void): void {
        e && e();
    }

    GmOpenCues(e: any, t?: () => void, o?: (err?: any) => void): void {
        GameService.GmOpenCues(
            e,
            Handler.create(this, function (e: any) {
                console.log(" GmOpenCues 返回 ", e);
                if (e && 1 == e.code) {
                    var t = e.data;
                    CueDataSys.get_clubs = t.get_clubs;
                    CueDataSys.usedCueId = t.use_club_id;
                    CueDataSys.nextCueID = t.next_club_id;
                    EventMgr.trigger(GameEventType.ON_GETTED_CLUBS_CHANGED);
                    EventMgr.trigger(GameEventType.ON_USED_CLUB_CHANGED);
                }
            }),
            Handler.create(this, function (e: any) {
                o && o(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    exchangeClub(e: any, t?: (data?: any) => void, o?: (err?: any) => void): void {
        var n = this;
        GameService.exchangeClub(
            {
                club_id: e,
            },
            Handler.create(this, function (e: any) {
                console.log(" exchangeClub 返回 ", e);
                if (e && 1 == e.code) {
                    var a = e.data,
                        l = (a.level_ad, a.get_clubs),
                        c = a.use_club_id,
                        u = a.level_pass,
                        _ = a.max_extract_id;
                    l && (CueDataSys.get_clubs = l);
                    c && (CueDataSys.usedCueId = c);
                    null != u && (PlayerDataSys.level_pass = u);
                    null != _ && (PlayerDataSys.max_extract_id = _);
                    n.checkTiXianUp();
                    AudioManager.getInstance().playMusic("pool_cueunlock");
                    EventMgr.trigger(GameEventType.ON_GETTED_CLUBS_CHANGED);
                    EventMgr.trigger(GameEventType.ON_USED_CLUB_CHANGED);
                    t && t(e);
                } else if (e && e.message) {
                    o && o();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, function (e: any) {
                o && o(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    GmGetCpmRecord(e?: (data?: any) => void): void {
        GameService.GmGetCpmRecord(
            {},
            Handler.create(this, function (t: any) {
                t && 1 == t.code && e && e(t.data);
            })
        );
    }

    submitGuideLevel(e: any, t?: (data?: any) => void, o?: (err?: any) => void): void {
        GameService.submitGuideLevel(
            {
                guide_id: e,
            },
            Handler.create(this, function (n: any) {
                console.log(" submitGuideLevel 返回 ", e, n);
                if (n && 1 == n.code) {
                    var i = n.data;
                    i.gold_balance && (PlayerDataSys.gold_balance = i.gold_balance);
                    t && t(n.data);
                } else if (n && n.message) {
                    o && o();
                    EngineUtil.showManageViewToast(n.message);
                }
            }),
            Handler.create(this, function (e: any) {
                o && o(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    GetGameLevelConfig(e: any, t?: (config?: any) => void, o?: (err?: any) => void): void {
        GameService.GetGameLevelConfig(
            {
                level_name: e,
            },
            Handler.create(this, function (n: any) {
                console.log("  获取关卡球桌配置文件 ", n);
                if (n && 1 == n.code) t && t(n.data.config);
                else if (n && n.message) {
                    o && o();
                    console.log("GetGameLevelConfig failed : ", e);
                }
            }),
            Handler.create(this, function (e: any) {
                o && o(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    refreshNextClub(e?: any, t?: () => void, o?: (err?: any) => void): void {
        GameService.refreshNextClub(
            null,
            Handler.create(this, function (e: any) {
                console.log(" refreshNextClub 返回 ", e);
                if (e && 1 == e.code) {
                    var t = e.data;
                    CueDataSys.get_clubs = t.get_clubs;
                    CueDataSys.usedCueId = t.use_club_id;
                    CueDataSys.nextCueID = t.next_club_id;
                    EventMgr.trigger(GameEventType.ON_GETTED_CLUBS_CHANGED);
                }
            }),
            Handler.create(this, function (e: any) {
                o && o(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    GmChangeRound(e: any, t?: (data?: any) => void, o?: (err?: any) => void): void {
        GameService.GmChangeRound(
            {
                round: e,
            },
            Handler.create(this, function (e: any) {
                console.log(" GmChangeRound 返回 ", e);
                if (e && 1 == e.code) {
                    var n = e.data;
                    PlayerDataSys.user_level = n.level_a;
                    PlayerDataSys.level_info = {
                        level_a: n.level_a,
                        level_b: n.level_b,
                        level_c: n.level_c,
                        roundCount: n.roundCount,
                        turnCount: n.turnCount,
                    };
                    PlayerDataSys.turn_pass = n.turn_pass;
                    PlayerDataSys.level_pass = n.level_pass;
                    PlayerDataSys.table = n.table;
                    PlayerDataSys.level_loop = n.level_loop;
                    console.log("jump to level: " + n.level_a + "-" + n.level_b + "-" + n.level_c);
                    t && t(e.data);
                } else if (e && e.message) {
                    o && o();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, function (e: any) {
                o && o(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    reportAd(e: any, t?: (data?: any) => void, o?: (err?: any) => void): void {
        e.success && PlayerDataSys.getUserCpm() && Object.assign(e, PlayerDataSys.getUserCpm());
        GameService.reportAd(
            e,
            Handler.create(this, function (i: any) {
                console.log(" reportAd 返回 ", i);
                if (i && 1 == i.code) {
                    var a = i.data,
                        r = a.level_ad,
                        c = a.cash_balance,
                        _ = a.prop,
                        f = a.remove_billiard_force,
                        h = a.total_video_count;
                    null != r && (PlayerDataSys.level_ad = r);
                    null != h && (PlayerDataSys.total_video_count = h);
                    PlayerDataSys.updateCashRecord(a.extract_gold_cash_record);
                    _ && (PlayerDataSys.prop_info = _);
                    null != f && (PlayerDataSys.remove_billiard_force = f);
                    c && (PlayerDataSys.cash_balance = c);
                    var y: any[] = [];
                    a.cash_prize &&
                        y.push({
                            type: RewardType.HongBao,
                            num: a.cash_prize,
                        });
                    if (AD_TYPE.relive == e.ad_type) {
                        var v = Number(ConfigDataSys.getFuhuoHeartAddCount());
                        y.push({
                            type: RewardType.Xin,
                            num: v,
                        });
                    }
                    if (AD_TYPE.baiqiu_prop == e.ad_type) {
                        var m = Number(ConfigDataSys.getBaiqiuPropCount());
                        y.push({
                            type: RewardType.DaoJu,
                            num: m,
                        });
                    }
                    if (AD_TYPE.line_prop == e.ad_type) {
                        m = ConfigDataSys.getLinePropTime();
                        y.push({
                            type: RewardType.MiaoZhunXian,
                            num: m,
                        });
                    }
                    EventMgr.trigger(GameEventType.ON_PROP_COUNT_CHANGED);
                    t && t(i);
                } else if (i && i.message) {
                    o && o();
                    EngineUtil.showManageViewToast(i.message);
                }
            }),
            Handler.create(this, function (e: any) {
                o && o(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    GmChangeLevel(e: any, t?: (data?: any) => void, o?: (err?: any) => void): void {
        GameService.GmChangeLevel(
            e,
            Handler.create(this, function (e: any) {
                console.log(" GmChangeLevel 返回 ", e);
                if (e && 1 == e.code) {
                    var n = e.data;
                    PlayerDataSys.user_level = n.level_a;
                    PlayerDataSys.level_info = {
                        level_a: n.level_a,
                        level_b: n.level_b,
                        level_c: n.level_c,
                        roundCount: n.roundCount,
                        turnCount: n.turnCount,
                    };
                    PlayerDataSys.turn_pass = n.turn_pass;
                    PlayerDataSys.level_pass = n.level_pass;
                    PlayerDataSys.table = n.table;
                    PlayerDataSys.level_loop = n.level_loop;
                    console.log("jump to level: " + n.level_a + "-" + n.level_b);
                    t && t(e.data);
                } else if (e && e.message) {
                    o && o();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, function (e: any) {
                o && o(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    deprecatedGmChangeLevel(e: any, t?: (data?: any) => void, o?: (err?: any) => void): void {
        GameService.deprecatedGmChangeLevel(
            e,
            Handler.create(this, function (e: any) {
                console.log(" GmChangeLevel 返回 ", e);
                if (e && 1 == e.code) {
                    var n = e.data;
                    PlayerDataSys.user_level = n.level_a;
                    PlayerDataSys.level_info = {
                        level_a: n.level_a,
                        level_b: n.level_b,
                        level_c: n.level_c,
                        roundCount: n.roundCount,
                        turnCount: n.turnCount,
                    };
                    PlayerDataSys.turn_pass = n.turn_pass;
                    PlayerDataSys.level_pass = n.level_pass;
                    PlayerDataSys.table = n.table;
                    PlayerDataSys.level_loop = n.level_loop;
                    console.log("jump to level: " + n.level_a + "-" + n.level_b + "-" + n.level_c);
                    t && t(e.data);
                } else if (e && e.message) {
                    o && o();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, function (e: any) {
                o && o(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    extractRecord(e?: (data?: any) => void, t?: (err?: any) => void): void {
        GameService.extractRecord(
            Handler.create(this, function (o: any) {
                console.log(" extractRecord 返回 ", o);
                if (o && 1 == o.code) {
                    o.data;
                    e && e(o.data);
                } else if (o && o.message) {
                    t && t();
                    EngineUtil.showManageViewToast(o.message);
                }
            }),
            Handler.create(this, function (e: any) {
                t && t(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    UseMoveCueBallProp(e?: any, t?: (data?: any) => void, o?: (err?: any) => void): void {
        GameService.UseMoveCueBallProp(
            {},
            Handler.create(this, function (e: any) {
                console.log(" UseClubProp 返回 ", e);
                if (e && 1 == e.code) {
                    var n = e.data.prop;
                    if (n) {
                        PlayerDataSys.prop_info = n;
                        PropDataSys.usePropBaiQiu(!0);
                        EventMgr.trigger(GameEventType.ON_PROP_COUNT_CHANGED);
                    }
                    t && t(e.data);
                } else if (e && e.message) {
                    o && o();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, function (e: any) {
                o && o(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    getClub(e: any, t?: (data?: any) => void, o?: (err?: any) => void): void {
        var n: any = {
            club_id: e,
            use: !0,
        };
        PlayerDataSys.getUserCpm() && Object.assign(n, PlayerDataSys.getUserCpm());
        GameService.getClub(
            n,
            Handler.create(this, function (e: any) {
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
                    l && (CueDataSys.get_clubs = l);
                    c && (CueDataSys.usedCueId = c);
                    CueDataSys.nextCueID = n.next_club_id;
                    null != u && (PlayerDataSys.level_pass = u);
                    null != _ && (PlayerDataSys.max_extract_id = _);
                    null != a && (PlayerDataSys.level_ad = a);
                    null != h && (PlayerDataSys.total_video_count = h);
                    AudioManager.getInstance().playMusic("pool_cueunlock");
                    f && (PlayerDataSys.cash_balance = f);
                    EventMgr.trigger(GameEventType.ON_GETTED_CLUBS_CHANGED);
                    EventMgr.trigger(GameEventType.ON_USED_CLUB_CHANGED);
                    t && t(e);
                } else if (e && e.message) {
                    o && o();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, function (e: any) {
                o && o(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    extractCash(e: any, t?: (data?: any) => void, o?: (err?: any) => void): void {
        console.log(" 提现红包挡位 ", e);
        var n = ConfigDataSys.cash_extract_configMap.get(e);
        PlayerDataSys.cash_balance * n.withdraw_percent < 10
            ? EngineUtil.showManageViewToast("满0.1元可提现，看视频可快速累积红包")
            : GameService.extractCash(
                  {
                      extract_id: e,
                  },
                  Handler.create(this, function (e: any) {
                      console.log(" 提现返回 ", e);
                      if (e && 1 == e.code) {
                          var n = e.data;
                          PlayerDataSys.cash_balance = n.cash_balance;
                          n.success || EngineUtil.showManageViewToast(n.fail_message);
                          t && t(n);
                      } else if (e && e.message) {
                          o && o();
                          EngineUtil.showManageViewToast(e.message);
                      }
                  }),
                  Handler.create(this, function (e: any) {
                      o && o(e);
                      EngineUtil.showManageViewToast(i18n.t("network_toast"));
                  })
              );
    }

    GuideGift(e?: (data?: any) => void, t?: (err?: any) => void): void {
        console.log(" 领取引导奖励 ");
        GameService.GuideGift(
            Handler.create(this, function (o: any) {
                console.log(" 领取引导奖励 ", o);
                if (o && 1 == o.code) {
                    var n = o.data;
                    PlayerDataSys.total_gold += n.gold_balance - PlayerDataSys.gold_balance;
                    PlayerDataSys.gold_balance = n.gold_balance;
                    e && e(n);
                } else if (o && o.message) {
                    t && t();
                    EngineUtil.showManageViewToast(o.message);
                }
            }),
            Handler.create(this, function (e: any) {
                t && t(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    signIn(e?: (data?: any) => void, t?: (err?: any) => void): void {
        GameService.signIn(
            Handler.create(this, function (o: any) {
                console.log(" signIn 返回 ", o);
                if (o && 1 == o.code) {
                    var n = o.data;
                    PlayerDataSys.sign_today = !0;
                    PlayerDataSys.sign_in_count++;
                    n.level_ad && (PlayerDataSys.level_ad = n.level_ad);
                    n.total_video_count && (PlayerDataSys.total_video_count = n.total_video_count);
                    PlayerDataSys.updateCashRecord(n.extract_gold_cash_record);
                    var a: any[] = [];
                    n.rewards.forEach(function (e: any) {
                        var t: any = {
                            type: Number(e.type),
                            num: e.count,
                        };
                        a.push(t);
                        e.cash_balance && (PlayerDataSys.cash_balance = e.cash_balance);
                        if (e.gold_balance) {
                            PlayerDataSys.gold_balance = e.gold_balance;
                            PlayerDataSys.total_gold += e.count;
                        }
                        e.prop && (PlayerDataSys.prop_info = e.prop);
                        if (e.get_clubs) {
                            CueDataSys.get_clubs = e.get_clubs;
                            CueDataSys.usedCueId = e.use_club_id;
                            t.num = 1;
                            t.id = e.count;
                            EventMgr.trigger(GameEventType.ON_GETTED_CLUBS_CHANGED);
                        }
                        e.sign_balance && (PlayerDataSys.sign_balance = e.sign_balance);
                    });
                    e && e(n);
                } else if (o && o.message) {
                    t && t();
                    EngineUtil.showManageViewToast(o.message);
                }
            }),
            Handler.create(this, function (e: any) {
                t && t(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    checkTiXianUp(): void {
        PlayerDataSys.show_extract &&
            !SystemDataSys.is_IOS_reviewer &&
            (PlayerDataSys.show_extract = !1);
    }

    GMAddSignInCount(e: any, t?: (data?: any) => void): void {
        GameService.GMAddSignInCount(
            {
                sign_in_count: e,
            },
            Handler.create(this, function (e: any) {
                t && t(e.data);
                var o = e.data.sign_in_count;
                PlayerDataSys.sign_in_count = o;
            })
        );
    }

    extractGold(e: any, t?: (data?: any) => void, o?: (err?: any) => void): void {
        console.log(" 提现现金挡位 ", e);
        PlayerDataSys.gold_balance < 10
            ? EngineUtil.showManageViewToast("满0.1元可提现，看视频可快速累积现金")
            : GameService.extractGold(
                  {
                      extract_id: e,
                  },
                  Handler.create(this, function (e: any) {
                      console.log(" 现金提现返回 ", e);
                      if (e && 1 == e.code) {
                          var n = e.data;
                          PlayerDataSys.gold_balance = n.gold_balance;
                          PlayerDataSys.updateCashRecord(n.extract_gold_cash_record);
                          EventMgr.trigger(GameEventType.UPDATE_QIPAO);
                          t && t(n);
                      } else if (e && e.message) {
                          o && o();
                          EngineUtil.showManageViewToast(e.message);
                      }
                  }),
                  Handler.create(this, function (e: any) {
                      o && o(e);
                      EngineUtil.showManageViewToast(i18n.t("network_toast"));
                  })
              );
    }

    UseClubProp(e: any, t?: (data?: any) => void, o?: (err?: any) => void): void {
        GameService.UseClubProp(
            {
                prop_id: e,
            },
            Handler.create(this, function (e: any) {
                console.log(" UseClubProp 返回 ", e);
                if (e && 1 == e.code) {
                    var n = e.data.prop;
                    if (n) {
                        PlayerDataSys.prop_info = n;
                        PropDataSys.usePropBaiQiu(!0);
                        EventMgr.trigger(GameEventType.ON_PROP_COUNT_CHANGED);
                    }
                    t && t(e.data);
                } else if (e && e.message) {
                    o && o();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, function (e: any) {
                o && o(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    GmChangeCash(e: any, t: any, o?: (data?: any) => void, n?: (err?: any) => void): void {
        GameService.GmChangeCash(
            {
                type: e,
                num: t,
            },
            Handler.create(this, function (e: any) {
                console.log(" GmChangeCash返回 ", e);
                if (e && 1 == e.code) {
                    var t = e.data,
                        i = t.cash_balance,
                        a = t.gold_balance;
                    i && (PlayerDataSys.cash_balance = i);
                    if (a) {
                        PlayerDataSys.total_gold += a - PlayerDataSys.gold_balance;
                        PlayerDataSys.gold_balance = a;
                    }
                    o && o(e);
                } else if (e && e.message) {
                    n && n();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, function (e: any) {
                n && n(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    clubGold(e: any, t?: (data?: any) => void, o?: (err?: any) => void): void {
        GameService.clubGold(
            {
                id: e,
            },
            Handler.create(this, function (e: any) {
                console.log(" clubGold 返回 ", e);
                if (e && 1 == e.code) {
                    var n = e.data;
                    CueDataSys.club_gold_index = n.club_gold_index;
                    PlayerDataSys.gold_balance = n.gold_balance;
                    PlayerDataSys.total_gold += n.gold_prize;
                    EventMgr.trigger(GameEventType.ON_UNLOCKED_CLUBS_GOLD);
                    t && t(e);
                } else if (e && e.message) {
                    o && o();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, function (e: any) {
                o && o(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    GmGetClubShard(): void {
        GameService.GmGetClubShard(
            {},
            Handler.create(this, function (e: any) {
                if (e && 1 == e.code)
                    for (var t = e.data.club_shard, o = 0, n = t; o < n.length; o++) {
                        var a = n[o];
                        CueDataSys.club_shard[a] = t[a];
                    }
            })
        );
    }

    deprecatedGmChangeTurn(e: any, t?: (data?: any) => void, o?: (err?: any) => void): void {
        GameService.deprecatedGmChangeTurn(
            {
                turn: e,
            },
            Handler.create(this, function (e: any) {
                console.log(" GmChangeTurn 返回 ", e);
                if (e && 1 == e.code) {
                    var n = e.data;
                    PlayerDataSys.user_level = n.level_a;
                    PlayerDataSys.level_info = {
                        level_a: n.level_a,
                        level_b: n.level_b,
                        level_c: n.level_c,
                        roundCount: n.roundCount,
                        turnCount: n.turnCount,
                    };
                    PlayerDataSys.turn_pass = n.turn_pass;
                    PlayerDataSys.level_pass = n.level_pass;
                    PlayerDataSys.table = n.table;
                    PlayerDataSys.level_loop = n.level_loop;
                    console.log("jump to level: " + n.level_a + "-" + n.level_b + "-" + n.level_c);
                    t && t(e.data);
                } else if (e && e.message) {
                    o && o();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, function (e: any) {
                o && o(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    changeClub(e: any, t?: (data?: any) => void, o?: (err?: any) => void): void {
        GameService.changeClub(
            {
                club_id: e,
            },
            Handler.create(this, function (e: any) {
                console.log(" changeClub 返回 ", e);
                if (e && 1 == e.code) {
                    var n = e.data,
                        a = (n.level_ad, n.get_clubs),
                        r = n.use_club_id;
                    a && (CueDataSys.get_clubs = a);
                    r && (CueDataSys.usedCueId = r);
                    CueDataSys.nextCueID = n.next_club_id;
                    EventMgr.trigger(GameEventType.ON_GETTED_CLUBS_CHANGED);
                    EventMgr.trigger(GameEventType.ON_USED_CLUB_CHANGED);
                    t && t(e);
                } else if (e && e.message) {
                    o && o();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, function (e: any) {
                o && o(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    logoff(): void {
        BaseSystem.logoff(
            {
                yid: PlayerDataSys.yid,
            },
            Handler.create(this, function (e: any) {
                console.log("用户注销接口返回====", e);
                if (e && 1 == e.code) {
                    PageMgr.clear();
                    EngineUtil.setLocalData("yid", "");
                    EngineUtil.showManageViewToast("用户注销成功");
                    cc.game.restart();
                } else EngineUtil.showManageViewToast(e.message || "网络异常，检查网络后重试");
            }),
            Handler.create(this, function () {
                EngineUtil.showManageViewToast("网络异常，检查网络后重试");
            })
        );
    }

    chouJiang(e: any, t?: (data?: any) => void, o?: (err?: any) => void): void {
        var n: any = {
            is_ad: e,
        };
        e && PlayerDataSys.getUserCpm() && Object.assign(n, PlayerDataSys.getUserCpm());
        GameService.chouJiang(
            n,
            Handler.create(this, function (e: any) {
                console.log(" 抽奖返回 ", e);
                if (e && 1 == e.code) {
                    var n = e.data;
                    n.level_ad && (PlayerDataSys.level_ad = n.level_ad);
                    n.total_video_count && (PlayerDataSys.total_video_count = n.total_video_count);
                    PlayerDataSys.updateCashRecord(n.extract_gold_cash_record);
                    t && t(n);
                } else if (e && e.message) {
                    o && o();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, function (e: any) {
                o && o(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }
}

export default GameServiceMgr._getInstance();
