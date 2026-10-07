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
    submitLevel(data: any, onSuccess?: () => void, onFail?: () => void): void {
        if (PlayerDataSys.getUserCpm()) {
            Object.assign(data, PlayerDataSys.getUserCpm());
        }
        GameService.submitLevel(
            data,
            Handler.create(this, (e: any) => {
                console.log(" submitLevel 返回 ", e);
                if (e && e.code == 1) {
                    const n = e.data;
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
                    if (n.level_ad) {
                        PlayerDataSys.level_ad = n.level_ad;
                    }
                    if (n.total_video_count) {
                        PlayerDataSys.total_video_count = n.total_video_count;
                    }
                    PlayerDataSys.scene_id = n.scene_id;
                    PlayerDataSys.level_pass_success_count = n.level_pass_success_count || 0;
                    CueDataSys.checkUnlockCue();
                    PlayerDataSys.updateCashRecord(n.extract_gold_cash_record);
                    onSuccess && onSuccess();
                } else if (e && e.message) {
                    onFail && onFail();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    headList(callback?: () => void): void {
        callback && callback();
    }

    GmOpenCues(data: any, onSuccess?: () => void, onFail?: (err?: any) => void): void {
        GameService.GmOpenCues(
            data,
            Handler.create(this, (e: any) => {
                console.log(" GmOpenCues 返回 ", e);
                if (e && e.code == 1) {
                    const t = e.data;
                    CueDataSys.get_clubs = t.get_clubs;
                    CueDataSys.usedCueId = t.use_club_id;
                    CueDataSys.nextCueID = t.next_club_id;
                    EventMgr.trigger(GameEventType.ON_GETTED_CLUBS_CHANGED);
                    EventMgr.trigger(GameEventType.ON_USED_CLUB_CHANGED);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    exchangeClub(clubId: any, onSuccess?: (data: any) => void, onFail?: () => void): void {
        GameService.exchangeClub(
            { club_id: clubId },
            Handler.create(this, (e: any) => {
                console.log(" exchangeClub 返回 ", e);
                if (e && e.code == 1) {
                    const a = e.data;
                    const l = a.get_clubs;
                    const c = a.use_club_id;
                    const u = a.level_pass;
                    const _ = a.max_extract_id;
                    if (l) {
                        CueDataSys.get_clubs = l;
                    }
                    if (c) {
                        CueDataSys.usedCueId = c;
                    }
                    if (u != null) {
                        PlayerDataSys.level_pass = u;
                    }
                    if (_ != null) {
                        PlayerDataSys.max_extract_id = _;
                    }
                    this.checkTiXianUp();
                    AudioManager.getInstance().playMusic("pool_cueunlock");
                    EventMgr.trigger(GameEventType.ON_GETTED_CLUBS_CHANGED);
                    EventMgr.trigger(GameEventType.ON_USED_CLUB_CHANGED);
                    onSuccess && onSuccess(e);
                } else if (e && e.message) {
                    onFail && onFail();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    GmGetCpmRecord(callback?: (data: any) => void): void {
        GameService.GmGetCpmRecord(
            {},
            Handler.create(this, (t: any) => {
                if (t && t.code == 1) {
                    callback && callback(t.data);
                }
            })
        );
    }

    submitGuideLevel(guideId: any, onSuccess?: (data: any) => void, onFail?: () => void): void {
        GameService.submitGuideLevel(
            { guide_id: guideId },
            Handler.create(this, (n: any) => {
                console.log(" submitGuideLevel 返回 ", guideId, n);
                if (n && n.code == 1) {
                    const i = n.data;
                    if (i.gold_balance) {
                        PlayerDataSys.gold_balance = i.gold_balance;
                    }
                    onSuccess && onSuccess(n.data);
                } else if (n && n.message) {
                    onFail && onFail();
                    EngineUtil.showManageViewToast(n.message);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    GetGameLevelConfig(levelName: string, onSuccess?: (config: any) => void, onFail?: () => void): void {
        GameService.GetGameLevelConfig(
            { level_name: levelName },
            Handler.create(this, (n: any) => {
                console.log("  获取关卡球桌配置文件 ", n);
                if (n && n.code == 1) {
                    onSuccess && onSuccess(n.data.config);
                } else if (n && n.message) {
                    onFail && onFail();
                    console.log("GetGameLevelConfig failed : ", levelName);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    refreshNextClub(onSuccess?: () => void, onFail?: (err?: any) => void): void {
        GameService.refreshNextClub(
            null,
            Handler.create(this, (e: any) => {
                console.log(" refreshNextClub 返回 ", e);
                if (e && e.code == 1) {
                    const t = e.data;
                    CueDataSys.get_clubs = t.get_clubs;
                    CueDataSys.usedCueId = t.use_club_id;
                    CueDataSys.nextCueID = t.next_club_id;
                    EventMgr.trigger(GameEventType.ON_GETTED_CLUBS_CHANGED);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    GmChangeRound(round: any, onSuccess?: (data: any) => void, onFail?: () => void): void {
        GameService.GmChangeRound(
            { round },
            Handler.create(this, (e: any) => {
                console.log(" GmChangeRound 返回 ", e);
                if (e && e.code == 1) {
                    const n = e.data;
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
                    onSuccess && onSuccess(e.data);
                } else if (e && e.message) {
                    onFail && onFail();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    reportAd(data: any, onSuccess?: (data: any) => void, onFail?: () => void): void {
        if (data.success && PlayerDataSys.getUserCpm()) {
            Object.assign(data, PlayerDataSys.getUserCpm());
        }
        GameService.reportAd(
            data,
            Handler.create(this, (i: any) => {
                console.log(" reportAd 返回 ", i);
                if (i && i.code == 1) {
                    const a = i.data;
                    const r = a.level_ad;
                    const c = a.cash_balance;
                    const _ = a.prop;
                    const f = a.remove_billiard_force;
                    const h = a.total_video_count;
                    if (r != null) {
                        PlayerDataSys.level_ad = r;
                    }
                    if (h != null) {
                        PlayerDataSys.total_video_count = h;
                    }
                    PlayerDataSys.updateCashRecord(a.extract_gold_cash_record);
                    if (_) {
                        PlayerDataSys.prop_info = _;
                    }
                    if (f != null) {
                        PlayerDataSys.remove_billiard_force = f;
                    }
                    if (c) {
                        PlayerDataSys.cash_balance = c;
                    }
                    const y: any[] = [];
                    if (a.cash_prize) {
                        y.push({ type: RewardType.HongBao, num: a.cash_prize });
                    }
                    if (AD_TYPE.relive == data.ad_type) {
                        const v = Number(ConfigDataSys.getFuhuoHeartAddCount());
                        y.push({ type: RewardType.Xin, num: v });
                    }
                    if (AD_TYPE.baiqiu_prop == data.ad_type) {
                        const m = Number(ConfigDataSys.getBaiqiuPropCount());
                        y.push({ type: RewardType.DaoJu, num: m });
                    }
                    if (AD_TYPE.line_prop == data.ad_type) {
                        const m = ConfigDataSys.getLinePropTime();
                        y.push({ type: RewardType.MiaoZhunXian, num: m });
                    }
                    EventMgr.trigger(GameEventType.ON_PROP_COUNT_CHANGED);
                    onSuccess && onSuccess(i);
                } else if (i && i.message) {
                    onFail && onFail();
                    EngineUtil.showManageViewToast(i.message);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    static _getInstance(): GameServiceMgr {
        if (!GameServiceMgr._instance) {
            GameServiceMgr._instance = new GameServiceMgr();
        }
        return GameServiceMgr._instance;
    }

    GmChangeLevel(data: any, onSuccess?: (data: any) => void, onFail?: () => void): void {
        GameService.GmChangeLevel(
            data,
            Handler.create(this, (e: any) => {
                console.log(" GmChangeLevel 返回 ", e);
                if (e && e.code == 1) {
                    const n = e.data;
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
                    onSuccess && onSuccess(e.data);
                } else if (e && e.message) {
                    onFail && onFail();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    deprecatedGmChangeLevel(data: any, onSuccess?: (data: any) => void, onFail?: () => void): void {
        GameService.deprecatedGmChangeLevel(
            data,
            Handler.create(this, (e: any) => {
                console.log(" GmChangeLevel 返回 ", e);
                if (e && e.code == 1) {
                    const n = e.data;
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
                    onSuccess && onSuccess(e.data);
                } else if (e && e.message) {
                    onFail && onFail();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    extractRecord(onSuccess?: (data: any) => void, onFail?: () => void): void {
        GameService.extractRecord(
            Handler.create(this, (o: any) => {
                console.log(" extractRecord 返回 ", o);
                if (o && o.code == 1) {
                    onSuccess && onSuccess(o.data);
                } else if (o && o.message) {
                    onFail && onFail();
                    EngineUtil.showManageViewToast(o.message);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    UseMoveCueBallProp(onSuccess?: (data: any) => void, onFail?: () => void): void {
        GameService.UseMoveCueBallProp(
            {},
            Handler.create(this, (e: any) => {
                console.log(" UseClubProp 返回 ", e);
                if (e && e.code == 1) {
                    const n = e.data.prop;
                    if (n) {
                        PlayerDataSys.prop_info = n;
                        PropDataSys.usePropBaiQiu(true);
                        EventMgr.trigger(GameEventType.ON_PROP_COUNT_CHANGED);
                    }
                    onSuccess && onSuccess(e.data);
                } else if (e && e.message) {
                    onFail && onFail();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    getClub(clubId: any, onSuccess?: (data: any) => void, onFail?: () => void): void {
        const n: any = { club_id: clubId, use: true };
        if (PlayerDataSys.getUserCpm()) {
            Object.assign(n, PlayerDataSys.getUserCpm());
        }
        GameService.getClub(
            n,
            Handler.create(this, (e: any) => {
                console.log(" getClub 返回 ", e);
                if (e && e.code == 1) {
                    const n = e.data;
                    const a = n.level_ad;
                    const l = n.get_clubs;
                    const c = n.use_club_id;
                    const u = n.level_pass;
                    const _ = n.max_extract_id;
                    const f = n.cash_balance;
                    const h = n.total_video_count;
                    if (l) {
                        CueDataSys.get_clubs = l;
                    }
                    if (c) {
                        CueDataSys.usedCueId = c;
                    }
                    CueDataSys.nextCueID = n.next_club_id;
                    if (u != null) {
                        PlayerDataSys.level_pass = u;
                    }
                    if (_ != null) {
                        PlayerDataSys.max_extract_id = _;
                    }
                    if (a != null) {
                        PlayerDataSys.level_ad = a;
                    }
                    if (h != null) {
                        PlayerDataSys.total_video_count = h;
                    }
                    AudioManager.getInstance().playMusic("pool_cueunlock");
                    if (f) {
                        PlayerDataSys.cash_balance = f;
                    }
                    EventMgr.trigger(GameEventType.ON_GETTED_CLUBS_CHANGED);
                    EventMgr.trigger(GameEventType.ON_USED_CLUB_CHANGED);
                    onSuccess && onSuccess(e);
                } else if (e && e.message) {
                    onFail && onFail();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    extractCash(extractId: any, onSuccess?: (data: any) => void, onFail?: () => void): void {
        console.log(" 提现红包挡位 ", extractId);
        const n = ConfigDataSys.cash_extract_configMap.get(extractId);
        if (PlayerDataSys.cash_balance * n.withdraw_percent < 10) {
            EngineUtil.showManageViewToast("满0.1元可提现，看视频可快速累积红包");
        } else {
            GameService.extractCash(
                { extract_id: extractId },
                Handler.create(this, (e: any) => {
                    console.log(" 提现返回 ", e);
                    if (e && e.code == 1) {
                        const n = e.data;
                        PlayerDataSys.cash_balance = n.cash_balance;
                        if (!n.success) {
                            EngineUtil.showManageViewToast(n.fail_message);
                        }
                        onSuccess && onSuccess(n);
                    } else if (e && e.message) {
                        onFail && onFail();
                        EngineUtil.showManageViewToast(e.message);
                    }
                }),
                Handler.create(this, (e: any) => {
                    onFail && onFail(e);
                    EngineUtil.showManageViewToast(i18n.t("network_toast"));
                })
            );
        }
    }

    GuideGift(onSuccess?: (data: any) => void, onFail?: () => void): void {
        console.log(" 领取引导奖励 ");
        GameService.GuideGift(
            Handler.create(this, (o: any) => {
                console.log(" 领取引导奖励 ", o);
                if (o && o.code == 1) {
                    const n = o.data;
                    PlayerDataSys.total_gold += n.gold_balance - PlayerDataSys.gold_balance;
                    PlayerDataSys.gold_balance = n.gold_balance;
                    onSuccess && onSuccess(n);
                } else if (o && o.message) {
                    onFail && onFail();
                    EngineUtil.showManageViewToast(o.message);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    signIn(onSuccess?: (data: any) => void, onFail?: () => void): void {
        GameService.signIn(
            Handler.create(this, (o: any) => {
                console.log(" signIn 返回 ", o);
                if (o && o.code == 1) {
                    const n = o.data;
                    PlayerDataSys.sign_today = true;
                    PlayerDataSys.sign_in_count++;
                    if (n.level_ad) {
                        PlayerDataSys.level_ad = n.level_ad;
                    }
                    if (n.total_video_count) {
                        PlayerDataSys.total_video_count = n.total_video_count;
                    }
                    PlayerDataSys.updateCashRecord(n.extract_gold_cash_record);
                    n.rewards.forEach((e: any) => {
                        const t: any = { type: Number(e.type), num: e.count };
                        if (e.cash_balance) {
                            PlayerDataSys.cash_balance = e.cash_balance;
                        }
                        if (e.gold_balance) {
                            PlayerDataSys.gold_balance = e.gold_balance;
                            PlayerDataSys.total_gold += e.count;
                        }
                        if (e.prop) {
                            PlayerDataSys.prop_info = e.prop;
                        }
                        if (e.get_clubs) {
                            CueDataSys.get_clubs = e.get_clubs;
                            CueDataSys.usedCueId = e.use_club_id;
                            t.num = 1;
                            t.id = e.count;
                            EventMgr.trigger(GameEventType.ON_GETTED_CLUBS_CHANGED);
                        }
                        if (e.sign_balance) {
                            PlayerDataSys.sign_balance = e.sign_balance;
                        }
                    });
                    onSuccess && onSuccess(n);
                } else if (o && o.message) {
                    onFail && onFail();
                    EngineUtil.showManageViewToast(o.message);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    checkTiXianUp(): void {
        if (PlayerDataSys.show_extract && !SystemDataSys.is_IOS_reviewer) {
            PlayerDataSys.show_extract = false;
        }
    }

    GMAddSignInCount(count: any, callback?: (data: any) => void): void {
        GameService.GMAddSignInCount(
            { sign_in_count: count },
            Handler.create(this, (e: any) => {
                callback && callback(e.data);
                const o = e.data.sign_in_count;
                PlayerDataSys.sign_in_count = o;
            })
        );
    }

    extractGold(extractId: any, onSuccess?: (data: any) => void, onFail?: () => void): void {
        console.log(" 提现现金挡位 ", extractId);
        if (PlayerDataSys.gold_balance < 10) {
            EngineUtil.showManageViewToast("满0.1元可提现，看视频可快速累积现金");
        } else {
            GameService.extractGold(
                { extract_id: extractId },
                Handler.create(this, (e: any) => {
                    console.log(" 现金提现返回 ", e);
                    if (e && e.code == 1) {
                        const n = e.data;
                        PlayerDataSys.gold_balance = n.gold_balance;
                        PlayerDataSys.updateCashRecord(n.extract_gold_cash_record);
                        EventMgr.trigger(GameEventType.UPDATE_QIPAO);
                        onSuccess && onSuccess(n);
                    } else if (e && e.message) {
                        onFail && onFail();
                        EngineUtil.showManageViewToast(e.message);
                    }
                }),
                Handler.create(this, (e: any) => {
                    onFail && onFail(e);
                    EngineUtil.showManageViewToast(i18n.t("network_toast"));
                })
            );
        }
    }

    UseClubProp(propId: any, onSuccess?: (data: any) => void, onFail?: () => void): void {
        GameService.UseClubProp(
            { prop_id: propId },
            Handler.create(this, (e: any) => {
                console.log(" UseClubProp 返回 ", e);
                if (e && e.code == 1) {
                    const n = e.data.prop;
                    if (n) {
                        PlayerDataSys.prop_info = n;
                        PropDataSys.usePropBaiQiu(true);
                        EventMgr.trigger(GameEventType.ON_PROP_COUNT_CHANGED);
                    }
                    onSuccess && onSuccess(e.data);
                } else if (e && e.message) {
                    onFail && onFail();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    GmChangeCash(type: string, num: number, onSuccess?: (data: any) => void, onFail?: () => void): void {
        GameService.GmChangeCash(
            { type, num },
            Handler.create(this, (e: any) => {
                console.log(" GmChangeCash返回 ", e);
                if (e && e.code == 1) {
                    const t = e.data;
                    const i = t.cash_balance;
                    const a = t.gold_balance;
                    if (i) {
                        PlayerDataSys.cash_balance = i;
                    }
                    if (a) {
                        PlayerDataSys.total_gold += a - PlayerDataSys.gold_balance;
                        PlayerDataSys.gold_balance = a;
                    }
                    onSuccess && onSuccess(e);
                } else if (e && e.message) {
                    onFail && onFail();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    clubGold(id: any, onSuccess?: (data: any) => void, onFail?: () => void): void {
        GameService.clubGold(
            { id },
            Handler.create(this, (e: any) => {
                console.log(" clubGold 返回 ", e);
                if (e && e.code == 1) {
                    const n = e.data;
                    CueDataSys.club_gold_index = n.club_gold_index;
                    PlayerDataSys.gold_balance = n.gold_balance;
                    PlayerDataSys.total_gold += n.gold_prize;
                    EventMgr.trigger(GameEventType.ON_UNLOCKED_CLUBS_GOLD);
                    onSuccess && onSuccess(e);
                } else if (e && e.message) {
                    onFail && onFail();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    GmGetClubShard(): void {
        GameService.GmGetClubShard(
            {},
            Handler.create(this, (e: any) => {
                if (e && e.code == 1) {
                    const t = e.data.club_shard;
                    for (let o = 0; o < t.length; o++) {
                        const a = t[o];
                        CueDataSys.club_shard[a] = t[a];
                    }
                }
            })
        );
    }

    deprecatedGmChangeTurn(turn: any, onSuccess?: (data: any) => void, onFail?: () => void): void {
        GameService.deprecatedGmChangeTurn(
            { turn },
            Handler.create(this, (e: any) => {
                console.log(" GmChangeTurn 返回 ", e);
                if (e && e.code == 1) {
                    const n = e.data;
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
                    onSuccess && onSuccess(e.data);
                } else if (e && e.message) {
                    onFail && onFail();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    changeClub(clubId: any, onSuccess?: (data: any) => void, onFail?: () => void): void {
        GameService.changeClub(
            { club_id: clubId },
            Handler.create(this, (e: any) => {
                console.log(" changeClub 返回 ", e);
                if (e && e.code == 1) {
                    const n = e.data;
                    const a = n.get_clubs;
                    const r = n.use_club_id;
                    if (a) {
                        CueDataSys.get_clubs = a;
                    }
                    if (r) {
                        CueDataSys.usedCueId = r;
                    }
                    CueDataSys.nextCueID = n.next_club_id;
                    EventMgr.trigger(GameEventType.ON_GETTED_CLUBS_CHANGED);
                    EventMgr.trigger(GameEventType.ON_USED_CLUB_CHANGED);
                    onSuccess && onSuccess(e);
                } else if (e && e.message) {
                    onFail && onFail();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    logoff(): void {
        BaseSystem.logoff(
            { yid: PlayerDataSys.yid },
            Handler.create(this, (e: any) => {
                console.log("用户注销接口返回====", e);
                if (e && e.code == 1) {
                    PageMgr.clear();
                    EngineUtil.setLocalData("yid", "");
                    EngineUtil.showManageViewToast("用户注销成功");
                    cc.game.restart();
                } else {
                    EngineUtil.showManageViewToast(e.message || "网络异常，检查网络后重试");
                }
            }),
            Handler.create(this, () => {
                EngineUtil.showManageViewToast("网络异常，检查网络后重试");
            })
        );
    }

    chouJiang(isAd: boolean, onSuccess?: (data: any) => void, onFail?: () => void): void {
        const n: any = { is_ad: isAd };
        if (isAd && PlayerDataSys.getUserCpm()) {
            Object.assign(n, PlayerDataSys.getUserCpm());
        }
        GameService.chouJiang(
            n,
            Handler.create(this, (e: any) => {
                console.log(" 抽奖返回 ", e);
                if (e && e.code == 1) {
                    const n = e.data;
                    if (n.level_ad) {
                        PlayerDataSys.level_ad = n.level_ad;
                    }
                    if (n.total_video_count) {
                        PlayerDataSys.total_video_count = n.total_video_count;
                    }
                    PlayerDataSys.updateCashRecord(n.extract_gold_cash_record);
                    onSuccess && onSuccess(n);
                } else if (e && e.message) {
                    onFail && onFail();
                    EngineUtil.showManageViewToast(e.message);
                }
            }),
            Handler.create(this, (e: any) => {
                onFail && onFail(e);
                EngineUtil.showManageViewToast(i18n.t("network_toast"));
            })
        );
    }

    private static _instance: GameServiceMgr = null;
}

export default GameServiceMgr._getInstance();
