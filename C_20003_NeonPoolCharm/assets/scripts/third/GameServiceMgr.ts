import AudioManager from "./AudioManager";
import BaseSystem from "./BaseSystem";
import ConfigDataSys from "./ConfigDataSys";
import CueDataSys from "./CueDataSys";
import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import GameService from "./GameService";
import Handler from "./Handler";
import PageMgr from "./PageMgr";
import PlayerDataSys from "./PlayerDataSys";
import PropDataSys from "./PropDataSys";
import { RewardType } from "./RequestData";
import SystemDataSys from "./SystemDataSys";

declare const i18n: any;

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
    hongbaoqun = 11
}

class GameServiceMgr {
    static _instance = null;

    static _getInstance() {
        GameServiceMgr._instance || (GameServiceMgr._instance = new GameServiceMgr());
        return GameServiceMgr._instance;
    }

    submitLevel(e, t, o) {
        PlayerDataSys.getUserCpm() && Object.assign(e, PlayerDataSys.getUserCpm());
        GameService.submitLevel(e, Handler.create(this, function (e) {
            console.log(" submitLevel 返回 ", e);
            if (e && 1 == e.code) {
                const n = e.data;
                PlayerDataSys.user_level = n.level_a;
                PlayerDataSys.level_info = {
                    level_a: n.level_a,
                    level_b: n.level_b,
                    level_c: n.level_c,
                    roundCount: n.roundCount,
                    turnCount: n.turnCount
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
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    headList(e) {
        e && e();
    }

    GmOpenCues(e, t, o) {
        GameService.GmOpenCues(e, Handler.create(this, function (e) {
            console.log(" GmOpenCues 返回 ", e);
            if (e && 1 == e.code) {
                const t = e.data;
                CueDataSys.get_clubs = t.get_clubs;
                CueDataSys.usedCueId = t.use_club_id;
                CueDataSys.nextCueID = t.next_club_id;
                EventMgr.trigger(GameEventType.ON_GETTED_CLUBS_CHANGED);
                EventMgr.trigger(GameEventType.ON_USED_CLUB_CHANGED);
            }
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    exchangeClub(e, t, o) {
        const n = this;
        GameService.exchangeClub({
            club_id: e
        }, Handler.create(this, function (e) {
            console.log(" exchangeClub 返回 ", e);
            if (e && 1 == e.code) {
                const a = e.data,
                    l = (a.level_ad, a.get_clubs),
                    c = a.use_club_id,
                    u = a.level_pass,
                    maxExtractId = a.max_extract_id;
                l && (CueDataSys.get_clubs = l);
                c && (CueDataSys.usedCueId = c);
                null != u && (PlayerDataSys.level_pass = u);
                null != maxExtractId && (PlayerDataSys.max_extract_id = maxExtractId);
                n.checkTiXianUp();
                AudioManager.getInstance().playMusic("pool_cueunlock");
                EventMgr.trigger(GameEventType.ON_GETTED_CLUBS_CHANGED);
                EventMgr.trigger(GameEventType.ON_USED_CLUB_CHANGED);
                t && t(e);
            } else if (e && e.message) {
                o && o();
                EngineUtil.showManageViewToast(e.message);
            }
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    GmGetCpmRecord(e) {
        GameService.GmGetCpmRecord({}, Handler.create(this, function (t) {
            t && 1 == t.code && e && e(t.data);
        }));
    }

    submitGuideLevel(e, t, o) {
        GameService.submitGuideLevel({
            guide_id: e
        }, Handler.create(this, function (n) {
            console.log(" submitGuideLevel 返回 ", e, n);
            if (n && 1 == n.code) {
                const i = n.data;
                i.gold_balance && (PlayerDataSys.gold_balance = i.gold_balance);
                t && t(n.data);
            } else if (n && n.message) {
                o && o();
                EngineUtil.showManageViewToast(n.message);
            }
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    GetGameLevelConfig(e, t, o) {
        GameService.GetGameLevelConfig({
            level_name: e
        }, Handler.create(this, function (n) {
            console.log("  获取关卡球桌配置文件 ", n);
            if (n && 1 == n.code) t && t(n.data.config); else if (n && n.message) {
                o && o();
                console.log("GetGameLevelConfig failed : ", e);
            }
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    refreshNextClub(e, t, o) {
        GameService.refreshNextClub(null, Handler.create(this, function (e) {
            console.log(" refreshNextClub 返回 ", e);
            if (e && 1 == e.code) {
                const t = e.data;
                CueDataSys.get_clubs = t.get_clubs;
                CueDataSys.usedCueId = t.use_club_id;
                CueDataSys.nextCueID = t.next_club_id;
                EventMgr.trigger(GameEventType.ON_GETTED_CLUBS_CHANGED);
            }
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    GmChangeRound(e, t, o) {
        GameService.GmChangeRound({
            round: e
        }, Handler.create(this, function (e) {
            console.log(" GmChangeRound 返回 ", e);
            if (e && 1 == e.code) {
                const n = e.data;
                PlayerDataSys.user_level = n.level_a;
                PlayerDataSys.level_info = {
                    level_a: n.level_a,
                    level_b: n.level_b,
                    level_c: n.level_c,
                    roundCount: n.roundCount,
                    turnCount: n.turnCount
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
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    reportAd(e, t, o) {
        e.success && PlayerDataSys.getUserCpm() && Object.assign(e, PlayerDataSys.getUserCpm());
        GameService.reportAd(e, Handler.create(this, function (i) {
            console.log(" reportAd 返回 ", i);
            if (i && 1 == i.code) {
                const a = i.data,
                    r = a.level_ad,
                    c = a.cash_balance,
                    propInfo = a.prop,
                    f = a.remove_billiard_force,
                    h = a.total_video_count;
                null != r && (PlayerDataSys.level_ad = r);
                null != h && (PlayerDataSys.total_video_count = h);
                PlayerDataSys.updateCashRecord(a.extract_gold_cash_record);
                propInfo && (PlayerDataSys.prop_info = propInfo);
                null != f && (PlayerDataSys.remove_billiard_force = f);
                c && (PlayerDataSys.cash_balance = c);
                const y = [];
                a.cash_prize && y.push({
                    type: RewardType.HongBao,
                    num: a.cash_prize
                });
                if (AD_TYPE.relive == e.ad_type) {
                    const v = Number(ConfigDataSys.getFuhuoHeartAddCount());
                    y.push({
                        type: RewardType.Xin,
                        num: v
                    });
                }
                if (AD_TYPE.baiqiu_prop == e.ad_type) {
                    const m = Number(ConfigDataSys.getBaiqiuPropCount());
                    y.push({
                        type: RewardType.DaoJu,
                        num: m
                    });
                }
                if (AD_TYPE.line_prop == e.ad_type) {
                    const m = ConfigDataSys.getLinePropTime();
                    y.push({
                        type: RewardType.MiaoZhunXian,
                        num: m
                    });
                }
                EventMgr.trigger(GameEventType.ON_PROP_COUNT_CHANGED);
                t && t(i);
            } else if (i && i.message) {
                o && o();
                EngineUtil.showManageViewToast(i.message);
            }
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    GmChangeLevel(e, t, o) {
        GameService.GmChangeLevel(e, Handler.create(this, function (e) {
            console.log(" GmChangeLevel 返回 ", e);
            if (e && 1 == e.code) {
                const n = e.data;
                PlayerDataSys.user_level = n.level_a;
                PlayerDataSys.level_info = {
                    level_a: n.level_a,
                    level_b: n.level_b,
                    level_c: n.level_c,
                    roundCount: n.roundCount,
                    turnCount: n.turnCount
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
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    deprecatedGmChangeLevel(e, t, o) {
        GameService.deprecatedGmChangeLevel(e, Handler.create(this, function (e) {
            console.log(" GmChangeLevel 返回 ", e);
            if (e && 1 == e.code) {
                const n = e.data;
                PlayerDataSys.user_level = n.level_a;
                PlayerDataSys.level_info = {
                    level_a: n.level_a,
                    level_b: n.level_b,
                    level_c: n.level_c,
                    roundCount: n.roundCount,
                    turnCount: n.turnCount
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
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    extractRecord(e, t) {
        GameService.extractRecord(Handler.create(this, function (o) {
            console.log(" extractRecord 返回 ", o);
            if (o && 1 == o.code) {
                o.data;
                e && e(o.data);
            } else if (o && o.message) {
                t && t();
                EngineUtil.showManageViewToast(o.message);
            }
        }), Handler.create(this, function (e) {
            t && t(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    UseMoveCueBallProp(e, t, o) {
        GameService.UseMoveCueBallProp({}, Handler.create(this, function (e) {
            console.log(" UseClubProp 返回 ", e);
            if (e && 1 == e.code) {
                const n = e.data.prop;
                if (n) {
                    PlayerDataSys.prop_info = n;
                    PropDataSys.usePropBaiQiu(true);
                    EventMgr.trigger(GameEventType.ON_PROP_COUNT_CHANGED);
                }
                t && t(e.data);
            } else if (e && e.message) {
                o && o();
                EngineUtil.showManageViewToast(e.message);
            }
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    getClub(e, t, o) {
        const n = {
            club_id: e,
            use: true
        };
        PlayerDataSys.getUserCpm() && Object.assign(n, PlayerDataSys.getUserCpm());
        GameService.getClub(n, Handler.create(this, function (e) {
            console.log(" getClub 返回 ", e);
            if (e && 1 == e.code) {
                const n = e.data,
                    a = n.level_ad,
                    l = n.get_clubs,
                    c = n.use_club_id,
                    u = n.level_pass,
                    maxExtractId = n.max_extract_id,
                    f = (n.cash_prize, n.cash_balance),
                    h = n.total_video_count;
                n.extract_gold_cash_record;
                l && (CueDataSys.get_clubs = l);
                c && (CueDataSys.usedCueId = c);
                CueDataSys.nextCueID = n.next_club_id;
                null != u && (PlayerDataSys.level_pass = u);
                null != maxExtractId && (PlayerDataSys.max_extract_id = maxExtractId);
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
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    extractCash(e, t, o) {
        console.log(" 提现红包挡位 ", e);
        const n = ConfigDataSys.cash_extract_configMap.get(e);
        PlayerDataSys.cash_balance * n.withdraw_percent < 10 ? EngineUtil.showManageViewToast("满0.1元可提现，看视频可快速累积红包") : GameService.extractCash({
            extract_id: e
        }, Handler.create(this, function (e) {
            console.log(" 提现返回 ", e);
            if (e && 1 == e.code) {
                const n = e.data;
                PlayerDataSys.cash_balance = n.cash_balance;
                n.success || EngineUtil.showManageViewToast(n.fail_message);
                t && t(n);
            } else if (e && e.message) {
                o && o();
                EngineUtil.showManageViewToast(e.message);
            }
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    GuideGift(e, t) {
        console.log(" 领取引导奖励 ");
        GameService.GuideGift(Handler.create(this, function (o) {
            console.log(" 领取引导奖励 ", o);
            if (o && 1 == o.code) {
                const n = o.data;
                PlayerDataSys.total_gold += n.gold_balance - PlayerDataSys.gold_balance;
                PlayerDataSys.gold_balance = n.gold_balance;
                e && e(n);
            } else if (o && o.message) {
                t && t();
                EngineUtil.showManageViewToast(o.message);
            }
        }), Handler.create(this, function (e) {
            t && t(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    signIn(e, t) {
        GameService.signIn(Handler.create(this, function (o) {
            console.log(" signIn 返回 ", o);
            if (o && 1 == o.code) {
                const n = o.data;
                PlayerDataSys.sign_today = true;
                PlayerDataSys.sign_in_count++;
                n.level_ad && (PlayerDataSys.level_ad = n.level_ad);
                n.total_video_count && (PlayerDataSys.total_video_count = n.total_video_count);
                PlayerDataSys.updateCashRecord(n.extract_gold_cash_record);
                const a = [];
                n.rewards.forEach(function (e) {
                    const t: any = {
                        type: Number(e.type),
                        num: e.count
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
        }), Handler.create(this, function (e) {
            t && t(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    checkTiXianUp() {
        PlayerDataSys.show_extract && !SystemDataSys.is_IOS_reviewer && (PlayerDataSys.show_extract = false);
    }

    GMAddSignInCount(e, t) {
        GameService.GMAddSignInCount({
            sign_in_count: e
        }, Handler.create(this, function (e) {
            t && t(e.data);
            const o = e.data.sign_in_count;
            PlayerDataSys.sign_in_count = o;
        }));
    }

    extractGold(e, t, o) {
        console.log(" 提现现金挡位 ", e);
        PlayerDataSys.gold_balance < 10 ? EngineUtil.showManageViewToast("满0.1元可提现，看视频可快速累积现金") : GameService.extractGold({
            extract_id: e
        }, Handler.create(this, function (e) {
            console.log(" 现金提现返回 ", e);
            if (e && 1 == e.code) {
                const n = e.data;
                PlayerDataSys.gold_balance = n.gold_balance;
                PlayerDataSys.updateCashRecord(n.extract_gold_cash_record);
                EventMgr.trigger(GameEventType.UPDATE_QIPAO);
                t && t(n);
            } else if (e && e.message) {
                o && o();
                EngineUtil.showManageViewToast(e.message);
            }
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    UseClubProp(e, t, o) {
        GameService.UseClubProp({
            prop_id: e
        }, Handler.create(this, function (e) {
            console.log(" UseClubProp 返回 ", e);
            if (e && 1 == e.code) {
                const n = e.data.prop;
                if (n) {
                    PlayerDataSys.prop_info = n;
                    PropDataSys.usePropBaiQiu(true);
                    EventMgr.trigger(GameEventType.ON_PROP_COUNT_CHANGED);
                }
                t && t(e.data);
            } else if (e && e.message) {
                o && o();
                EngineUtil.showManageViewToast(e.message);
            }
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    GmChangeCash(e, t, o, n) {
        GameService.GmChangeCash({
            type: e,
            num: t
        }, Handler.create(this, function (e) {
            console.log(" GmChangeCash返回 ", e);
            if (e && 1 == e.code) {
                const t = e.data,
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
        }), Handler.create(this, function (e) {
            n && n(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    clubGold(e, t, o) {
        GameService.clubGold({
            id: e
        }, Handler.create(this, function (e) {
            console.log(" clubGold 返回 ", e);
            if (e && 1 == e.code) {
                const n = e.data;
                CueDataSys.club_gold_index = n.club_gold_index;
                PlayerDataSys.gold_balance = n.gold_balance;
                PlayerDataSys.total_gold += n.gold_prize;
                EventMgr.trigger(GameEventType.ON_UNLOCKED_CLUBS_GOLD);
                t && t(e);
            } else if (e && e.message) {
                o && o();
                EngineUtil.showManageViewToast(e.message);
            }
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    GmGetClubShard() {
        GameService.GmGetClubShard({}, Handler.create(this, function (e) {
            if (e && 1 == e.code) for (let t = e.data.club_shard, o = 0, n = t; o < n.length; o++) {
                const a = n[o];
                CueDataSys.club_shard[a] = t[a];
            }
        }));
    }

    deprecatedGmChangeTurn(e, t, o) {
        GameService.deprecatedGmChangeTurn({
            turn: e
        }, Handler.create(this, function (e) {
            console.log(" GmChangeTurn 返回 ", e);
            if (e && 1 == e.code) {
                const n = e.data;
                PlayerDataSys.user_level = n.level_a;
                PlayerDataSys.level_info = {
                    level_a: n.level_a,
                    level_b: n.level_b,
                    level_c: n.level_c,
                    roundCount: n.roundCount,
                    turnCount: n.turnCount
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
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    changeClub(e, t, o) {
        GameService.changeClub({
            club_id: e
        }, Handler.create(this, function (e) {
            console.log(" changeClub 返回 ", e);
            if (e && 1 == e.code) {
                const n = e.data,
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
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }

    logoff() {
        BaseSystem.logoff({
            yid: PlayerDataSys.yid
        }, Handler.create(this, function (e) {
            console.log("用户注销接口返回====", e);
            if (e && 1 == e.code) {
                PageMgr.clear();
                EngineUtil.setLocalData("yid", "");
                EngineUtil.showManageViewToast("用户注销成功");
                cc.game.restart();
            } else EngineUtil.showManageViewToast(e.message || "网络异常，检查网络后重试");
        }), Handler.create(this, function () {
            EngineUtil.showManageViewToast("网络异常，检查网络后重试");
        }));
    }

    chouJiang(e, t, o) {
        const n = {
            is_ad: e
        };
        e && PlayerDataSys.getUserCpm() && Object.assign(n, PlayerDataSys.getUserCpm());
        GameService.chouJiang(n, Handler.create(this, function (e) {
            console.log(" 抽奖返回 ", e);
            if (e && 1 == e.code) {
                const n = e.data;
                n.level_ad && (PlayerDataSys.level_ad = n.level_ad);
                n.total_video_count && (PlayerDataSys.total_video_count = n.total_video_count);
                PlayerDataSys.updateCashRecord(n.extract_gold_cash_record);
                t && t(n);
            } else if (e && e.message) {
                o && o();
                EngineUtil.showManageViewToast(e.message);
            }
        }), Handler.create(this, function (e) {
            o && o(e);
            EngineUtil.showManageViewToast(i18n.t("network_toast"));
        }));
    }
}

export default GameServiceMgr._getInstance();
