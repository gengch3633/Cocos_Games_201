import BallLogicMgr from "./BallLogicMgr";
import { ETaiQiuPropType } from "./ConfigDataMgr";
import ConfigDataSys from "./ConfigDataSys";
import CueDataSys from "./CueDataSys";
import CueHelper from "./CueHelper";
import DB from "./DB";
import EngineUtil from "./EngineUtil";
import EventMgr from "./EventMgr";
import { GameConfigurations } from "./GameConfigurations";
import GameEventType from "./GameEventType";
import GameHelper from "./GameHelper";
import GameMgr from "./GameMgr";
import GameServiceMgr from "./GameServiceMgr";
import GlobalConfig from "./GlobalConfig";
import GuideEvent from "./GuideEvent";
import GuideManager from "./GuideManager";
import LevelObserver from "./LevelObserver";
import MoviePlayer from "./MoviePlayer";
import PageMgr from "./PageMgr";
import PlayerDataSys from "./PlayerDataSys";
import { PoolLogger } from "./PoolLogger";
import PropDataSys from "./PropDataSys";
import SdkHelper from "./SdkHelper";
import SystemDataSys from "./SystemDataSys";
import TimeDataSys from "./TimeDataSys";
import TimeUtils from "./TimeUtils";
import { UiManager } from "./UiManage";
import platform from "./platform";
import util from "./util";

const { ccclass, property } = cc._decorator;

const Y = Math.PI / 180;
const W = 100 * BallLogicMgr.BallIDType_White;
const J = 100 * BallLogicMgr.BallIDType_Normal;

@ccclass
export default class game_table extends cc.Component {
    @property(cc.Node)
    target = null;

    @property(cc.Prefab)
    ball = null;

    @property(cc.Node)
    flyNumPrefab = null;

    @property(cc.Node)
    ballParent = null;

    @property(cc.Prefab)
    ballPosNode = null;

    @property(cc.Node)
    circle_target = null;

    @property(cc.Node)
    ball_white = null;

    @property(cc.Node)
    white_ball_shadow = null;

    @property(cc.Prefab)
    ui_alert_Prefab = null;

    @property(cc.Prefab)
    ui_radPage_Prefab = null;

    @property(cc.Label)
    levelLabel = null;

    @property(cc.Node)
    levelSpliter = null;

    @property(cc.RichText)
    roundRichText = null;

    @property(cc.ProgressBar)
    turnProgressBar = null;

    @property(cc.Label)
    turnLabel = null;

    @property(cc.Label)
    heartNumLabel = null;

    @property(cc.Prefab)
    xiaoqiuHoleEffectPreb = null;

    @property(cc.Prefab)
    jinDongEffectPreb = null;

    @property(sp.Skeleton)
    ball_click_effect = null;

    @property(cc.Node)
    shadow_container = null;

    @property(cc.Prefab)
    shadow_prefab = null;

    @property(cc.Camera)
    camera2D = null;

    @property(cc.Camera)
    camera3D = null;

    @property(cc.Node)
    gm_touch = null;

    @property(cc.Node)
    moveCueBallPropNode = null;

    @property(cc.Node)
    top_touch_block = null;

    @property(cc.Node)
    top_guide_touch_block = null;

    @property(cc.Node)
    bottom_touch_block1 = null;

    @property(cc.Node)
    bottom_touch_block2 = null;

    @property(cc.Node)
    bottom_touch_block3 = null;

    @property({
        type: [cc.Node]
    })
    game_hide_nodes = [];

    ballMgr: any = new Map();
    ball_white_pos_node = null;
    oneCueXiaoQiuCount = 0;
    _xiaoQiuConfigCount = undefined;
    non_goal_cue_count = 0;
    is_open_prop = false;
    _shouldShowBonusPage = false;
    _waitingForBonusPage = false;
    _topTouchBlockHandlerSet = new Set();
    ballID = null;
    isAutoPlaying = null;
    _isXiaoQiuStart = null;
    isIngame = null;
    failedNum = null;
    doOneCueFinished = null;
    _aimPower = null;
    oneCueLock = null;
    isGuideLevel = null;
    showHongBao = null;
    pvpCueLock = null;
    ganNum = null;
    _xiaoqiuStartHoleIndex = null;
    _xiaoqiuTargetNode = null;
    commboCount = null;
    _xiaoqiuCount = 0;
    _xiaoqiuHoleId = null;
    mode = null;
    editingTableInfo = null;
    editingConditionInfo = null;
    _clearCount = null;
    answers = null;
    ticker_start = null;
    lockTouchNode = null;
    rad = null;
    dir = null;
    _isAimTarget = null;
    oneCueDestroyBalls = [];
    oneCueAnswer = null;
    oneCue_rad_angle = null;
    oneCue_rad_value = null;
    oneMV = null;
    do_timer = null;
    do_timer_sec = null;
    do_update = null;
    _zhuoDongContainer = null;
    _jinDongEffectArray = null;
    _xiaoQiuHoleEffectArray = null;
    _xiaoqiuGuiJiEffect = null;
    _cueXiaoQiuSk = null;
    _isEnterXiaoQiu = null;
    isReportGameDataStatis = null;
    levelDataStatis;
    ball_white_ball2dCtr;
    _whiteBallRestitution;
    _dirYellow;
    _dirGreen;
    _sprite_virtualBall;
    cueRes;
    ballCount;
    state;
    progress;
    quat;
    mv_moves_starTimer;
    _slectedWhiteBall;
    oneMV_cues_idx;
    frame_idx;
    axis;
    mv_oneCue_moves;

    public async onLoad(): Promise<void> {
        const Z = this;
        LevelObserver.instance.startLog(PlayerDataSys.turn_pass + 1, PlayerDataSys.level_info.level_a + "-" + PlayerDataSys.level_info.level_b, PlayerDataSys.table, BallLogicMgr.editingTableInfo.tableID, BallLogicMgr.editingTableInfo.balls.length - 1);
        this.turnProgressBar.node.parent.active = false;
        this.non_goal_cue_count = 0;
        this.isGuideLevel = BallLogicMgr.isGuideLevel;
        this.top_guide_touch_block.active = this.isGuideLevel;
        this.bottom_touch_block1.active = this.isGuideLevel;
        this.bottom_touch_block2.active = this.isGuideLevel;
        this.bottom_touch_block3.active = this.isGuideLevel;
        TimeDataSys.setTimerStart(true);
        TimeDataSys.resetGameTime();
        this.levelDataStatis = {
            level_id: PlayerDataSys.user_level,
            level_file: PlayerDataSys.getLevelTableFileName(),
            hit_count: 0,
            xiaoqiu_count: 0,
            heart_lost: 0,
            baiqiu_count: 0,
            line_count: PropDataSys.isLinePropUsed ? 1 : 0,
            fuhuo_count: 0,
            game_time: TimeUtils.getTimeinSeconds(),
            remain_heart: 0,
            full_heart: 0,
            is_success: 0
        };
        SdkHelper.reportData("enter_level", {
            level_id: PlayerDataSys.user_level,
            level_file: PlayerDataSys.getLevelTableFileName()
        });
        const t = "prefabs/tables/table_" + BallLogicMgr.editingTableInfo.tableID;
        const o = await UiManager.loaderPrefabInDeepPath(t);
        if (!o) {
            return;
        }
        this.gm_touch.active = !SystemDataSys.online_release;
        ConfigDataSys.getLevelCashNum();
        const n = cc.instantiate(o);
        this.addTableNode(n);
        let i = this;
        const a = cc.winSize;
        a.height / a.width > 2 && (cc.find("Camera3D", this.node).z *= 1.225);
        GlobalConfig.debug_alpha && (this.node.opacity = 25);
        if (platform.isTT()) {
            i.updateRecIcon();
            BallLogicMgr.initRecord();
            BallLogicMgr.updateRecIcon = function () {
                i.updateRecIcon();
            };
        }
        i = this;
        this.pvpCueLock = false;
        this.state = "pregame";
        this.rad = 0;
        this.dir = cc.v2(0, 0);
        this.progress = 0;
        this.quat = cc.quat();
        this.do_update = false;
        this.isAutoPlaying = false;
        this.failedNum = 0;
        this.mode = BallLogicMgr.MODE.ME_Free;
        this.do_timer = false;
        this.do_timer_sec = 0;
        this.mv_moves_starTimer = -1;
        this.oneCueXiaoQiuCount = 0;
        this.ballParent || this.node;
        const r = cc.find("node_ball2Pos", this.node);
        const l = r.getComponent("Ball2DControl");
        this.ball_white_ball2dCtr = l;
        this._whiteBallRestitution = r.getComponent(cc.PhysicsCircleCollider).restitution;
        this.ball_white_pos_node = r;
        l.stopCallback = function (e) {
            l.isOnDeapMoving() || setTimeout(function () {
                i.oneBallIsStop(e);
            }, .02);
        };
        this.ball_white_pos_node.x = -180;
        this.ball_white_pos_node.y = -180;
        this.ball_white_pos_node.getComponent(cc.RigidBody).syncRotation();
        this.ballMgr.clear();
        this.ball_white_pos_node.getComponent("Ball2DControl").ballID = W;
        const d = this.ball_white;
        this.ball_white_pos_node.getComponent("Ball2DControl").ball3D = d;
        i.ballMgr.set(W, this.ball_white_pos_node);
        this.ballID = J;
        this.editingTableInfo = null;
        this.editingConditionInfo = null;
        this.oneCueDestroyBalls = [];
        this.commboCount = 0;
        this._xiaoqiuCount = 0;
        this._clearCount = 0;
        this.oneCueAnswer = null;
        this.tableIsReset();
        console.log("game_table onLoad 8");
        this.oneCue_rad_angle = 0;
        this.oneCue_rad_value = cc.v2(0, 0);
        this._dirYellow = cc.find("plane_table", this.node).getChildByName("sprite_dir_yellow");
        this._dirGreen = cc.find("plane_table", this.node).getChildByName("sprite_dir_green");
        this._sprite_virtualBall = cc.find("plane_table", this.node).getChildByName("sprite_virtualBall");
        this.ball_click_effect.setCompleteListener(function () {
            Z.ball_click_effect.active = false;
        });
        this.ball_click_effect.active = false;
        i.updateAimBall();
        const _ = cc.find("plane_table", this.node);
        cc.find("node_btns", this.node);
        i.initJinDongEffect();
        i.initXiaoQiuNode();
        this.cueRes = cc.find("plane_table", this.node).getChildByName("node_cue_container").getChildByName("node_cue2").getChildByName("10522_Pool_Cue_v1_SG");
        UiManager.loadSpine(this.cueRes, "cue_spine", CueDataSys.getCurCueSourceName(), function () {
            i.cueRes.getComponent(sp.Skeleton).setAnimation(0, "animation", true);
        });
        CueHelper.init(this.node, this.ball_white_pos_node, this.ball_white, i.ballMgr);
        console.log("game_table onLoad 9");
        const f = cc.find("bottom_area", this.node);
        let g = 1;
        cc.find("node_roll", f).getChildByName("roll_scroll").getComponent("RollScrollComp").setCallBack(function (e) {
            if (i.checkCanOP()) {
                GlobalConfig.sens_toggle_get();
                const t = i._isAimTarget ? GlobalConfig.gan_move_roll_multy_aim : GlobalConfig.gan_move_roll_multy;
                g += e *= t;
                if (Math.abs(g) > .008) {
                    g = 0;
                    BallLogicMgr.playSound("pool_ruler");
                }
                i.oneRadStep(0, e);
            }
        });
        cc.find("node_power2", f).getComponent("PowerBar2Comp").setCallBack(function (e) {
            console.log("percent", e);
            i.checkCanOP() && i.btn_go(e);
        });
        cc.find("node_power2", f).getComponent("PowerBar2Comp").setCallBack_update(function (e) {
            i.checkCanOP() && i.CuePosByPower(100 * e);
        });
        const b = cc.find("bottom_area", this.node);
        cc.find("btn_setting", b).on("click", function () {
            console.log("btn_setting", this, i);
            BallLogicMgr.playUIClick();
            PageMgr.showPage("SetPageInGame", {
                exitCB: function () {
                    i.gotoHall();
                }
            });
        });
        const I = _.getChildByName("table_touch");
        const E = I.getBoundingBox();
        const w = I.getBoundingBoxToWorld();
        const O = cc.v2(w.xMax, w.yMax);
        const L = cc.v2(w.xMin, w.yMin);
        const x = i.camera3D.getWorldToScreenPoint(O);
        const k = i.camera3D.getWorldToScreenPoint(L);
        const U = x.x - k.x;
        const G = x.y - k.y;
        const F = new cc.Rect(k.x, k.y, U, G);
        const j = function (e) {
            const t = e.sub(F.center);
            const o = t.x / (U / 2) * I.width / 2;
            const n = t.y / (G / 2) * I.height / 2;
            return cc.v2(o, n);
        };
        const H = [];
        I.childrenCount > 0 && I.children.forEach(function (e) {
            const t = e.getComponent(cc.PolygonCollider);
            t ? H.push({
                type: 1,
                value: t.points
            }) : H.push({
                type: 0,
                value: e.getBoundingBox()
            });
        });
        const V = H.length;
        const pointInPoly = function (e, t) {
            const o = e.x;
            const n = e.y;
            let polyInside = false;
            for (let a = 0, r = t.length - 1; a < t.length; r = a++) {
                const l = t[a].x;
                const s = t[a].y;
                const c = t[r].x;
                const u = t[r].y;
                s > n != u > n && o < (c - l) * (n - s) / (u - s) + l && (polyInside = !polyInside);
            }
            return polyInside;
        };
        const K = function (e) {
            if (V < 1) return E.contains(e);
            for (let t = 0; t < V; t++) {
                const o = H[t];
                if (0 == o.type) {
                    if (o.value.contains(e)) return true;
                } else if (pointInPoly(e, o.value)) return true;
            }
            return false;
        };
        let X = 0;
        let Q = cc.v2(0, 0);
        I.on(cc.Node.EventType.TOUCH_START, function (e) {
            if (!e.touch || 0 == e.touch.getID()) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                X = 0;
                if (i.checkCanOP() && !i.lockTouchNode) {
                    const t = I.convertToNodeSpaceAR(e.touch._point);
                    console.log("table_touch start", t.x, t.y);
                    if (PropDataSys.isBaiQiuPropInUse) {
                        const o = i.checkBallClicked(e.touch._point, true, GlobalConfig.ball_radius + GlobalConfig.ball_radius);
                        i._slectedWhiteBall = !!o;
                        if (i._slectedWhiteBall) {
                            CueHelper.hide();
                            i.node.getComponent("CircleRayComp").clear();
                        }
                        if (o) {
                            const n = j(e.touch._point);
                            Q = cc.v2(d.x, d.y).subSelf(n);
                            console.log("touched white ball ");
                        }
                    } else i._slectedWhiteBall = false;
                }
            }
        });
        I.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
            if (!e.touch || 0 == e.touch.getID()) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                if (i.checkCanOP() && !i.lockTouchNode) {
                    const t = e.currentTouch;
                    X += t._point.sub(t._prevPoint).len();
                    if (i._slectedWhiteBall) {
                        const o = j(e.touch._point).addSelf(Q);
                        const n = K(o);
                        !i.checkBallClicked3D(o, false, 2 * (GlobalConfig.ball_radius + 1)) && n && (i.ball_white_pos_node.position = o);
                    } else {
                        const a = I.parent.convertToNodeSpaceAR(t._point);
                        const r = I.parent.convertToNodeSpaceAR(t._prevPoint);
                        const l = i.calculateRotationDirection(a, r, i.ball_white_pos_node.position) * r.sub(a).len();
                        0 != l && i.applyByRad(i.rad + l / 180 / (i._isAimTarget ? GlobalConfig.gan_move_rad_multy_aim : GlobalConfig.gan_move_rad_multy_normal));
                    }
                }
            }
        });
        I.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (!e.touch || 0 == e.touch.getID()) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                if (i.checkCanOP() && !i.lockTouchNode) {
                    I.convertToNodeSpaceAR(e.touch._point);
                    let a;
                    if (i._slectedWhiteBall) {
                        const t = i.getNearBallByWhite();
                        CueHelper.show();
                        a = t ? CueHelper.applyByTargetBall(t) : CueHelper.applyByXY(CueHelper.curApplyXY.x, CueHelper.curApplyXY.y);
                        i.rad = a.rad;
                        i.dir = a.dir;
                        i.applyRayByRad(a.rad, a.len);
                    }
                    i._slectedWhiteBall = false;
                    let o = false;
                    if (0 == X || X < 10) {
                        const n = i.checkBallClicked(e.touch._point);
                        if (n) {
                            if (a = CueHelper.applyByTargetBall(n)) {
                                i.rad = a.rad;
                                i.dir = a.dir;
                                i.applyRayByRad(a.rad, a.len);
                                i.ball_click_effect.active = true;
                                i.ball_click_effect.node.setPosition(n.getPosition());
                                i.ball_click_effect.setAnimation(0, "animation", false);
                                o = true;
                                BallLogicMgr.playSound("pool_ball_click");
                            }
                            i.tableResetFinish();
                        }
                        if (!o) {
                            const r = j(e.touch._point);
                            if (a = CueHelper.applyByXY(r.x, r.y)) {
                                i.rad = a.rad;
                                i.dir = a.dir;
                                i.applyRayByRad(a.rad, a.len);
                            }
                        }
                    }
                    X = 0;
                }
            }
        });
        cc.find("node_btn_radBall", f).getComponent("game_btn_radBall").setClickCB(function () {
            BallLogicMgr.playUIClick();
            i.ui_radPage_Prefab && cc.instantiate(i.ui_radPage_Prefab).getComponent("game_UI_radPage").show(i.node, function (e, t) {
                i.oneCue_rad_value = e;
                i.oneCue_rad_angle = t;
                i.updateRadBallBtnInfo();
            });
        });
        console.log("game_table onLoad 10");
        this.ballCount = BallLogicMgr.editingTableInfo ? BallLogicMgr.editingTableInfo.balls.length - 1 : 0;
        console.log("球的数量" + this.ballCount);
        this.scheduleOnce(function () {
            BallLogicMgr.editingTableInfo && i.loadEditingTableInfo(BallLogicMgr.editingTableInfo);
            LevelObserver.instance.logging && LevelObserver.instance.endLog(function () {
                GameServiceMgr.GmChangeRound(PlayerDataSys.turn_pass + 2, function () {
                    BallLogicMgr.loadTable(PlayerDataSys.turn_pass, PlayerDataSys.table);
                });
            });
        }, .1);
    }

    closeWhiteBallEffect() {
        this.ball_white;
    }

    callback2(e) {
        const t = 2 * (e.progress - .5);
        const o = cc.find("plane_table", this.node);
        console.log("slider target", o);
        this.do_orbit2(o, t);
    }

    allStopTodo(e, t) {
        const n = this;
        if (this.isAutoPlaying) {
            if (e) {
                this.pvpCueLock = false;
                this.setAutoPlayingMode(false);
                this.state = "moviefinish";
            }
            console.log("播放对方动作全部结束");
        } else if (e && !this._waitingForBonusPage) {
            console.log("己方动作全部结束");
            if (this._shouldShowBonusPage && (t || this.ballMgr.size <= 1)) {
                this._shouldShowBonusPage = false;
                this._waitingForBonusPage = true;
                if (PlayerDataSys.level_info.level_a >= GameConfigurations.customConfig.startLevelForClearAward) {
                    const o = GameHelper.frameSDK;
                    if (null !== o && undefined !== o) {
                        o.openABAward(function () {
                            n._waitingForBonusPage = false;
                            n.oneCueActionFinish(t);
                        });
                    }
                } else {
                    this._waitingForBonusPage = false;
                    this.oneCueActionFinish(t);
                }
            } else this.oneCueActionFinish(t);
        }
        this.doAftOneCueActionFinish(e);
    }

    oneCueFinish() {
        this.oneCueLock = true;
        this.doOneCueFinished = false;
        this.CuePosByPower(0);
        CueHelper.hide();
        PropDataSys.propUsedComplete(ETaiQiuPropType.E_BaiQiu);
        this.oneCue_rad_angle = 0;
        this.oneCue_rad_value = cc.v2(0, 0);
        this.updateRadBallBtnInfo();
    }

    checkBaiQiuEffect() {
        this.ball_white_ball2dCtr.showBaiQiuEffect(PropDataSys.isBaiQiuPropInUse && !this.oneCueLock);
    }

    continueOneMV() {
        console.log("do continueOneMV");
        if (this.oneMV) {
            this.oneMV_cues_idx = this.oneMV_cues_idx + 1;
            this.playOneMV(this.oneMV);
        }
    }

    onBallEffect(e) {
        let o = GameConfigurations.customConfig.bonusPerBall;
        Array.isArray(o) && (o = 2 + Math.floor(Math.random() * (o[1] - o[0] + 1)));
        const frameSDK = GameHelper.frameSDK;
        if (null !== frameSDK && undefined !== frameSDK) {
            frameSDK.addBitCoin(o, 0, 0, e.convertToWorldSpaceAR(cc.Vec2.ZERO));
        }
    }

    gotoHall() {
        this.destroyAllBall();
        BallLogicMgr.gotoHall();
    }

    onXiaoQiuEffectComplete(e, t) {
        t.loop || (e.active = false);
    }

    applyByRad(e) {
        this.circle_target;
        this.rad = e;
        this.rad = Math.floor(1e5 * this.rad) / 1e5;
        const t = CueHelper.applyByRad(e);
        this.dir = t.dir;
        const o = t.len;
        this.applyRayByRad(e, o);
    }

    getWhiteBallFuHuoP(e) {
        const o = 2 * (GlobalConfig.ball_radius + 3);
        for (const entry of this.ballMgr.entries()) {
            const a = entry[0];
            const r = entry[1];
            if (a != W) {
                const l = r.getComponent("Ball2DControl").ball3D;
                const s = cc.v2(l.x, l.y);
                let c = cc.v2(e.x, e.y).sub(s);
                console.log("getWhiteBallFuHuoP minLen", o);
                if (c.len() < o) {
                    0 == c.len() && (c = cc.v2(1, 0).rotateSelf(EngineUtil.random(0, Math.PI)));
                    e = s.add(c.normalizeSelf().mulSelf(o));
                    return this.getWhiteBallFuHuoP(e);
                }
            }
        }
        return e;
    }

    whiteBallIsDestroyed() {}

    onSlider(e) {
        this.oneRadStep(2 * (e.progress - .5));
    }

    isInPVPBattle() {
        return false;
    }

    getNearBallByWhite() {
        const t = this.ball_white_pos_node.position;
        let o = 0;
        let n = null;
        for (const entry of this.ballMgr.entries()) {
            const r = entry[1];
            const l = r.getComponent("Ball2DControl");
            if (W == l.ballID) {
            } else if (!l.isOnDestroy()) {
                const s = t.sub(r.position).len();
                if (!n || o > s) {
                    o = s;
                    n = r;
                }
            }
        }
        return n;
    }

    gotoInfoList() {
        this.destroyAllBall();
        BallLogicMgr.gotoInfoList();
    }

    calculateRotationDirection(e, t, o) {
        const n = e.x - t.x;
        const i = e.y - t.y;
        return n * (t.y - o.y) - i * (t.x - o.x) > 0 ? -1 : 1;
    }

    updateTimer() {
        const e = cc.find("node_condition_title", this.node);
        if (e) {
            const t = e.getChildByName("label_time");
            const o = Math.floor(this.do_timer_sec);
            const n = this.getTotalChallengeSec();
            t.getComponent(cc.Label).string = o + "/" + n + "s";
            if (o >= n) {
                this.stopTimer();
                this.mode != BallLogicMgr.MODE.PVE_Challenge && this.mode != BallLogicMgr.MODE.ME_Editing || this.challangeFail("超时了，");
            }
        }
    }

    destroyAllBall() {
        for (const entry of this.ballMgr.entries()) {
            const n = entry[0];
            const i = entry[1];
            if (W == i.getComponent("Ball2DControl").ballID) i.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0); else {
                this.ballMgr.delete(n);
                i.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                const a = i.getComponent("Ball2DControl").ball3D.children[0].getComponent("3D_ballRoll");
                a.shadow_node.parent = null;
                a.shadow_node.destroy();
                i.getComponent("Ball2DControl").ball3D.parent = null;
                i.parent = null;
                i.getComponent("Ball2DControl").ball3D.destroy();
                i.destroy();
            }
        }
        this.ballID = J;
    }

    playOneMV_TableFinish() {}

    onPropUsedStateChanged(e) {
        const t = e.prop_type;
        const o = e.state;
        const n = e.isUsedProp;
        if (t == ETaiQiuPropType.E_BaiQiu) {
            1 == o && n && this.levelDataStatis.baiqiu_count++;
            this.checkBaiQiuEffect();
        }
    }

    oneRadStep(e, t) {
        if (!this.lockTouchNode) {
            t = t || 0;
            cc.v3(0, 0, 1);
            let o = 0;
            if (0 != t) o = this.rad + t; else {
                if (0 == e) return;
                o = Math.PI * e;
            }
            this.applyByRad(o);
        }
    }

    playOneMV(e) {
        if (e) {
            this.oneMV = e;
            this.oneMV_cues_idx = this.oneMV_cues_idx || 0;
            BallLogicMgr.game_mode = BallLogicMgr.MODE.ME_PlayMV;
            this.setAutoPlayingMode(true);
            0 == this.oneMV_cues_idx ? this.reloadEditingTableInfo() : this.playOneMV_TableFinish();
        }
    }

    onEnable() {
        const e = this;
        this.addEventListener();
        if (!LevelObserver.instance.logging) {
            EventMgr.trigger(GameEventType.SHOW_MAIN_UI_TOUCH_BLOCK, "game-initing");
            this._waitingForBonusPage = false;
            PoolLogger.instance.logGameEvent("thepool_game_table", {
                object_action: "show",
                object_name: "table_open",
                object_notes: PlayerDataSys.table
            });
            new Promise(function (e) {
                GameHelper.frameSDK ? GameHelper.frameSDK.beforeGameLevelStart(PlayerDataSys.level_info.level_a, PlayerDataSys.level_info.level_b, undefined, function () {
                    return e();
                }) : e();
            }).then(function () {
                if (e.ballCount >= GameConfigurations.customConfig.minBallNumberForPropHint && !e.isGuideLevel && PropDataSys.isLinePropUseable) {
                    EngineUtil.showManageViewToast("pkey_006");
                    PageMgr.showPage("UsePropPage", {
                        prop_type: ETaiQiuPropType.E_Line
                    });
                } else GuideManager.Instance.emit(GuideEvent.StartGame);
                EventMgr.trigger(GameEventType.HIDE_MAIN_UI_TOUCH_BLOCK, "game-initing");
            });
        }
    }

    recv_ballDestroy(e) {
        const o = e.ballID;
        for (const entry of this.ballMgr.entries()) {
            const a = entry[0];
            const r = entry[1];
            if (r.getComponent("Ball2DControl").ballID == o) {
                if (W == r.getComponent("Ball2DControl").ballID) this.resetWhiteBall(); else {
                    this.ballMgr.delete(a);
                    console.log("destroyBall idx", r.getComponent("Ball2DControl").ballID);
                    r.getComponent("Ball2DControl").ball3D.parent = null;
                    r.parent = null;
                }
                break;
            }
        }
    }

    choseDirToBall() {
        const e = this.getDirToTargetBall();
        return e ? CueHelper.applyByTargetBall(e) : CueHelper.randomDirToBall();
    }

    checkBallClicked3D(e, t, o) {
        if (undefined === o) {
            o = 2 * GlobalConfig.ball_radius;
        }
        let i = o;
        let a = null;
        for (const entry of this.ballMgr.entries()) {
            const s = entry[0];
            const c = entry[1];
            if (t) {
                if (s != W) continue;
            } else if (s == W) continue;
            const u = c.getComponent("Ball2DControl").ball3D;
            const p = cc.Vec2.distance(cc.v2(u.x, u.y), e);
            if (p <= i) {
                i = p;
                a = u;
            }
        }
        return a;
    }

    do_orbit2(e, t) {
        const o = e;
        let n = new cc.Mat4();
        n = o.getWorldRotation(n);
        let i = cc.v3(0, 0, 0);
        let a = new cc.Mat4();
        a = o.getWorldMatrix(a);
        this.getUpVector(a, i);
        let r = i;
        r = r.normalizeSelf();
        let l = Math.PI * t * .1;
        l = this.rad + l;
        cc.Quat.rotateAround(n, n, r, l);
        o.setRotation(n);
    }

    onDisable() {
        this.removeEventListener();
        PropDataSys.propUsedComplete(ETaiQiuPropType.E_BaiQiu);
    }

    applyByPower(e) {
        const t = -Math.cos(this.oneCue_rad_angle * Y) * e;
        const o = Math.sin(this.oneCue_rad_angle * Y) * e;
        const n = this.ball_white.getChildByName("New Sphere").getComponent("3D_ballRoll").pos_node;
        this.isAutoPlaying || n.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(this.dir.x * t, this.dir.y * t), cc.v2(0, 0), true);
        n.getComponent("Ball2DControl").setRadMove(this.oneCue_rad_value, o);
        this.oneCueDestroyBalls.length = 0;
        const i = Math.floor(100 * this.rad);
        this.oneCueAnswer = BallLogicMgr.pack_answer(i, e);
        const a = cc.find("node_condition_title", this.node);
        this.mode == BallLogicMgr.MODE.PVE_Challenge || this.mode == BallLogicMgr.MODE.ME_Editing ? a.getComponent("ConditionTitleComp").updateGunNum(this.ganNum) : this.mode == BallLogicMgr.MODE.ME_Free && (BallLogicMgr.freeMode_totalGanNum = BallLogicMgr.freeMode_totalGanNum + 1);
        this.oneCueFinish();
    }

    checkCanOP() {
        return this.mode != BallLogicMgr.MODE.PVP_Friend && !this.oneCueLock;
    }

    initJinDongEffect() {
        const e = cc.find("plane_table", this.node).getChildByName("table_layers");
        this._zhuoDongContainer = e.getChildByName("table").getChildByName("zhuo_pengzhuang_daizi_3d");
        this._jinDongEffectArray = [];
        for (let t = 0; t < this._zhuoDongContainer.childrenCount; t++) {
            const o = cc.instantiate(this.jinDongEffectPreb);
            o.setParent(this._zhuoDongContainer.children[t]);
            o.setPosition(cc.Vec2.ZERO);
            o.getChildByName("jindong").getComponent(sp.Skeleton).setCompleteListener(this.onJinDongEffectComplete.bind(this, o));
            this._jinDongEffectArray.push(o);
            o.active = false;
        }
    }

    playOneMV_moves(e) {
        if (e && e.length > 0) {
            this.mv_oneCue_moves = e;
            this.mv_moves_starTimer = e[0].time;
        }
    }

    recv_ballMove(e) {
        const t = this.ballMgr.get(e.ballID);
        if (t) {
            t.x = e.x;
            t.y = e.y;
            const o = t.getComponent(cc.RigidBody);
            t.getComponent("Ball2DControl").isTooSmallV(cc.v2(e.vx, e.vy)) || (o.linearVelocity = cc.v2(e.vx, e.vy));
        }
    }

    getXiaoQiuHoldeIndex() {
        let t = null;
        let o = null;
        for (const entry of CueHelper.ballMgr.entries()) {
            const a = entry[1].getComponent("Ball2DControl");
            if (W == a.ballID) {
            } else if (!a.isOnDestroy()) {
                const r = this.getNearestHodeIndexForBall(a.ball3D, a.ballID);
                const l = r.distance;
                const s = r.holeIndex;
                const c = r.weight;
                if (null != l && null != c && (null == t || c < t)) {
                    t = c;
                    o = s;
                }
            }
        }
        return o;
    }

    oneCueActionFinish(e) {
        const t = this;
        if (this.isIngame && !this.doOneCueFinished) {
            this.doOneCueFinished = true;
            if (this.editingConditionInfo) {
                let o = true;
                let n = false;
                let i = "";
                for (let a = 0; a < this.oneCueDestroyBalls.length; a++) if (W == this.oneCueDestroyBalls[a].ballID) {
                    n = true;
                    i = "母球进洞,";
                    break;
                }
                let r = 0;
                const l = this.ganNum;
                let c;
                if (e) {
                    r = this.oneCueDestroyBalls.length;
                    n && r--;
                } else {
                    this.ganNum = this.ganNum + (n ? 2 : 1);
                    r = this.oneCueDestroyBalls.length;
                    n && r--;
                    r > 0 ? this.ganNum = Math.max(0, this.ganNum - 1) : this.cancelXiaoQiuEffect();
                    if (this.ganNum > l) {
                        BallLogicMgr.playSound(n ? "pool_heart2" : "pool_heart1");
                        this.levelDataStatis.heart_lost += this.ganNum - l;
                    }
                }
                if (this.mode == BallLogicMgr.MODE.PVE_Challenge || this.mode == BallLogicMgr.MODE.ME_Editing) this.updateHart(this.ganNum); else if (this.mode == BallLogicMgr.MODE.ME_Free) {
                    BallLogicMgr.freeMode_totalGanNum = BallLogicMgr.freeMode_totalGanNum + 1;
                    this.updateHart(this.ganNum);
                }
                if (this.editingConditionInfo) {
                    const _ = this.editingConditionInfo.cdBalls;
                    if (0 == _.length) {
                        console.log("error:condition ball len is 0");
                        o = false;
                    }
                    for (let f = 0; f < _.length; f++) if (this.checkBallMatIdxInMap(_[f].ballMatIdx)) {
                        console.log("condition fail:find ball matIdx left", _[f].ballMatIdx, _[f], _.length);
                        o = false;
                        break;
                    }
                    let h;
                    if (this.mode == BallLogicMgr.MODE.ME_Editing) {
                        if (n) {
                            this.stopTimer();
                            (h = cc.instantiate(this.ui_alert_Prefab)).parent = this.node;
                            h.getComponent("game_UI_alert").show(i + "失败！是否重试一次？", function () {
                                t.reloadEditingTableInfo();
                            }, function () {
                                t.gotoTableEditor();
                            }, "重试", "返回");
                        } else if (o) {
                            console.log("condition suc!!!");
                            this.stopTimer();
                            (h = cc.instantiate(this.ui_alert_Prefab)).parent = this.node;
                            h.getComponent("game_UI_alert").show("尝试成功，你编辑的关卡将要进行保存！", function () {
                                console.log("save win32", typeof t.editingTableInfo);
                                const e = {
                                    tableInfo: t.editingTableInfo,
                                    mv: MoviePlayer.uncompress(MoviePlayer.compress()),
                                    mvCompress: 0,
                                    time: util.formatDateTime(new Date())
                                };
                                util.save2(e, e.time);
                                BallLogicMgr.gotoInfoList();
                            }, function () {
                                t.gotoTableEditor();
                            }, "好的", "返回", "挑战成功");
                        } else if (this.ganNum >= this.editingConditionInfo.ganNum) {
                            console.log("condition fail:ganNum is 0,but never acheive");
                            this.stopTimer();
                            this.failedNum = this.failedNum + 1;
                            if (this.failedNum < BallLogicMgr.editingTryMaxNum) {
                                (h = cc.instantiate(this.ui_alert_Prefab)).parent = this.node;
                                h.getComponent("game_UI_alert").show("失败！是否重试一次？", function () {
                                    t.reloadEditingTableInfo();
                                }, function () {
                                    t.gotoTableEditor();
                                }, "重试", "返回", "挑战失败");
                            } else {
                                (h = cc.instantiate(this.ui_alert_Prefab)).parent = this.node;
                                h.getComponent("game_UI_alert").show("失败太多次了，建议重新编辑关卡！", function () {
                                    t.gotoTableEditor();
                                }, function () {
                                    t.gotoTableEditor();
                                });
                            }
                        }
                    } else if (this.mode == BallLogicMgr.MODE.PVE_Challenge) {
                        if (n) c = this.challangeFail(i, n); else if (o) {
                            console.log("challenge suc!!!");
                            this.stopTimer();
                            (h = cc.instantiate(this.ui_alert_Prefab)).parent = this.node;
                            h.getComponent("game_UI_alert").show("恭喜，挑战成功！", function () {
                                t.gotoInfoList();
                            }, function () {
                                t.gotoInfoList();
                            }, "好的", "返回", "挑战成功");
                            DB.updateOnePublicTableInfo(BallLogicMgr.challenging_publictableInfo, "totalNum", BallLogicMgr.pack_WinInfo(this.do_timer_sec), function () {});
                        } else if (this.ganNum >= this.editingConditionInfo.ganNum) {
                            console.log("challenge fail:ganNum is 0,but never acheive");
                            c = this.challangeFail(i, n);
                        }
                    } else if (this.mode == BallLogicMgr.MODE.ME_Free) {
                        if (n) {
                            if (this.ballMgr.size <= 1 && this.ganNum < this.editingConditionInfo.ganNum) {
                                if (!BallLogicMgr.isWin) {
                                    console.log("challenge suc!!!");
                                    this.stopTimer();
                                    this.doGameSuccess();
                                }
                            } else c = this.challangeFail(i, n);
                        } else if (o) {
                            if (this.ballMgr.size < 2) {
                                console.log("challenge suc!!!");
                                this.stopTimer();
                                this.doGameSuccess();
                            } else if (this.ganNum >= this.editingConditionInfo.ganNum) {
                                console.log("challenge fail:ganNum is 0,but never acheive");
                                c = this.challangeFail(i, n);
                            }
                        } else if (this.ganNum >= this.editingConditionInfo.ganNum) {
                            console.log("challenge fail:ganNum is 0,but never acheive");
                            c = this.challangeFail(i, n);
                        }
                    }
                }
                if (this.mode == BallLogicMgr.MODE.ME_Editing || this.mode == BallLogicMgr.MODE.PVE_Challenge || this.mode == BallLogicMgr.MODE.ME_Free) {
                    CueHelper.isShow() || this.getXiaoQiuTarget();
                    if (this._isXiaoQiuStart) {
                        this.doOneCueFinished = false;
                        this.doXiaoQiuAction();
                    } else {
                        if (n) {
                            this._isXiaoQiuStart = false;
                            this.cancelXiaoQiuEffect();
                        }
                        if (this.oneCueDestroyBalls.length < 1 || n) {
                            this.commboCount = 0;
                            this._xiaoqiuCount = 0;
                            EventMgr.trigger(GameEventType.ON_COMMBO_HIT, this.commboCount);
                        }
                        if (!CueHelper.isShow()) {
                            n && 2 == c && this.pickUpWhiteBall();
                            r - this.oneCueXiaoQiuCount > 1 && !n && EventMgr.trigger(GameEventType.ON_MULTY_GOAL, r);
                            this.oneCueXiaoQiuCount = 0;
                            this._xiaoQiuConfigCount || (this._xiaoQiuConfigCount = Number(ConfigDataSys.global_ConfigMap.get("lv_killball_num")));
                            this._xiaoqiuCount >= this._xiaoQiuConfigCount && !n && this.ballMgr.size > 1 && this.showXiaoQiuHoleEffect();
                            CueHelper.show();
                            EventMgr.trigger(GameEventType.HIDE_MAIN_UI_TOUCH_BLOCK, "game-shooting");
                            if (r < 1) {
                                this.non_goal_cue_count++;
                                console.log("第几个球没进", this.non_goal_cue_count, this.is_open_prop, this.ganNum < this.editingConditionInfo.ganNum);
                                const g = Number(ConfigDataSys.global_ConfigMap.get("help_num")) || 1;
                                if (this.ganNum < this.editingConditionInfo.ganNum && this.non_goal_cue_count >= g && !this.is_open_prop) {
                                    if (PropDataSys.isLinePropUsed) {
                                        if (0 == PropDataSys.getPropCount(ETaiQiuPropType.E_BaiQiu)) {
                                            EngineUtil.showManageViewToast("pkey_006");
                                            PageMgr.showPage("UsePropPage", {
                                                prop_type: ETaiQiuPropType.E_BaiQiu
                                            });
                                            this.is_open_prop = true;
                                        } else {
                                            EngineUtil.showManageViewToast("pkey_006");
                                            this.is_open_prop = true;
                                            this.moveCueBallPropNode.scale = 1;
                                            cc.Tween.stopAllByTarget(this.moveCueBallPropNode);
                                            cc.tween(this.moveCueBallPropNode).to(.3, {
                                                scale: 1.2
                                            }, {
                                                easing: "sineIn"
                                            }).to(.15, {
                                                scale: 1
                                            }).to(.3, {
                                                scale: 1.2
                                            }, {
                                                easing: "sineIn"
                                            }).to(.15, {
                                                scale: 1
                                            }).delay(.8).union().repeat(2).start();
                                        }
                                    } else {
                                        EngineUtil.showManageViewToast("pkey_006");
                                        PageMgr.showPage("UsePropPage", {
                                            prop_type: ETaiQiuPropType.E_Line
                                        });
                                        this.is_open_prop = true;
                                    }
                                }
                            } else this.non_goal_cue_count = 0;
                        }
                        const v = this.choseDirToBall();
                        if (v) {
                            this.rad = v.rad;
                            this.dir = v.dir;
                            this.applyRayByRad(v.rad, v.len);
                        } else {
                            CueHelper.hide();
                            this.node.getComponent("CircleRayComp").clear();
                        }
                    }
                }
            }
            console.log("MoviePlayer.oneMV", MoviePlayer.oneMV);
        }
    }

    challangeFail(e, t) {
        const o = this;
        if (this.ballMgr.size <= 1) this.doChallangeFail(e); else {
            if (t && this.ganNum < this.editingConditionInfo.ganNum) return 2;
            PoolLogger.instance.logGameEvent("thepool_game_table", {
                object_action: "show",
                object_name: "table_fail",
                object_notes: PlayerDataSys.table
            });
            PageMgr.showPage("FuHuoPage", {
                exitCB: function (t) {
                    t ? o.fuhuo() : o.doChallangeFail(e);
                }
            });
        }
        return 1;
    }

    doChallangeFail(e) {
        const t = this;
        e = e || "";
        this.stopTimer();
        this.clearTable();
        this.isIngame = false;
        this.failedNum = this.failedNum + 1;
        this.mode != BallLogicMgr.MODE.ME_Free && this.mode != BallLogicMgr.MODE.ME_Editing && DB.updateOnePublicTableInfo(BallLogicMgr.challenging_publictableInfo, "totalNum", 0, function () {});
        this.reportGameDataStatis();
        PoolLogger.instance.logGameEvent("thepool_game_table", {
            object_action: "show",
            object_name: "table_fail",
            object_notes: PlayerDataSys.table
        });
        setTimeout(function () {
            PageMgr.showPage("GameEndPage", {
                timeoutCB: function () {
                    return t.failAndGoBack();
                }
            });
        }, 200);
    }

    setTitleFreeMode() {
        const e = cc.find("node_condition_title", this.node);
        e.getChildByName("label_time_title").getComponent(cc.Label).string = "关卡";
        const t = BallLogicMgr.freeMode_jsonCfg_idx + 1;
        e.getChildByName("label_time").getComponent(cc.Label).string = t;
    }

    gotoTableEditor() {
        this.destroyAllBall();
        BallLogicMgr.gotoTableEditor();
    }

    pickUpWhiteBall() {
        this.commboCount = 0;
        this._xiaoqiuCount = 0;
        const e = BallLogicMgr.editingTableInfo.balls;
        for (let t = 0; t < e.length; t++) {
            const o = e[t];
            o.ballType == BallLogicMgr.BallIDType_White && this.createOneBall(o, true);
        }
        const n = this;
        this.scheduleOnce(function () {
            PropDataSys.usePropBaiQiu(false);
            this.checkBaiQiuEffect();
            const e = n.choseDirToBall();
            if (e) {
                n.rad = e.rad;
                n.dir = e.dir;
                n.applyRayByRad(e.rad, e.len);
            } else {
                CueHelper.hide();
                this.node.getComponent("CircleRayComp").clear();
            }
            n.tableResetFinish();
        }, .01);
    }

    playJinDongEffect(e) {
        const t = e.parent.children.indexOf(e);
        if (t >= 0 && t < this._jinDongEffectArray.length) {
            const o = this._jinDongEffectArray[t];
            const n = o.getChildByName("jindong").getComponent(sp.Skeleton);
            o.active = true;
            n.setAnimation(0, n.defaultAnimation, false);
        }
    }

    oneBallIsStop(e, t) {
        const o = this;
        console.log("oneBallIsStop", e, t);
        let i = false;
        for (const entry of this.ballMgr.entries()) {
            const r = entry[1];
            if (r.getComponent("Ball2DControl").isOnDeapMoving()) {
                i = true;
                console.log("isMoving", r.getComponent("Ball2DControl").ballID);
                break;
            }
        }
        this.scheduleOnce(function () {
            return o.allStopTodo(!i, t);
        }, .01);
    }

    destroyBall(e, t, o) {
        const n = this;
        console.log("destroyBall size", this.ballMgr.size, e.getComponent("Ball2DControl").ballID, o);
        const i = e.getComponent("Ball2DControl").ballID;
        const a = W == i;
        if (a) SdkHelper.setVibrator(50); else {
            if (this.isGuideLevel) {
                cc.game.emit("GuideEvent_JiQiu");
                console.log("cc.game.emit GuideEvent_JiQiu");
                this.lockTouchNode = false;
                this.top_guide_touch_block.active = false;
                this.bottom_touch_block1.active = false;
                this.bottom_touch_block2.active = false;
                this.bottom_touch_block3.active = false;
            }
            ++this._xiaoqiuCount;
            ++this._clearCount;
            EventMgr.trigger(GameEventType.ON_COMMBO_HIT, ++this.commboCount);
            let r = false;
            if (t) {
                r = this.checkEnterXiaoQiu(t);
                this._shouldShowBonusPage = r || this._shouldShowBonusPage;
            }
            r ? SdkHelper.setVibrator(150) : SdkHelper.setVibrator(50);
        }
        const c = function () {
            o ? setTimeout(function () {
                return n.oneBallIsStop(i, o);
            }, 1300) : n.oneBallIsStop(i, o);
        };
        for (const entry of this.ballMgr.entries()) {
            const key = entry[0];
            const ballNode = entry[1];
            if (ballNode == e) {
                e.getComponent("Ball2DControl").doDestroyTween(a, t, function () {
                    const destroyed = {
                        ballID: e.getComponent("Ball2DControl").ballID,
                        ballMatIdx: 0
                    };
                    if (a) {
                        destroyed.ballMatIdx = 0;
                        e.getComponent("Ball2DControl").ballWillBeDestroy(true);
                        e.getComponent("Ball2DControl").ball3D.children[0].getComponent("3D_ballRoll").setShowShadow(false);
                        e.getComponent("Ball2DControl").stopMove();
                    } else {
                        n.ballMgr.delete(key);
                        e.getComponent("Ball2DControl").ballWillBeDestroy(false);
                        const roll = e.getComponent("Ball2DControl").ball3D.children[0].getComponent("3D_ballRoll");
                        roll.shadow_node.parent = null;
                        roll.shadow_node.destroy();
                        e.getComponent("Ball2DControl").ball3D.parent = null;
                        e.parent = null;
                        ballNode.getComponent("Ball2DControl").ball3D.destroy();
                        ballNode.destroy();
                        destroyed.ballMatIdx = e.getComponent("Ball2DControl").ball3D.getComponent("BallMaterialComp").getMatIdx();
                    }
                    n.oneCueDestroyBalls.push(destroyed);
                    o && (n._isXiaoQiuStart = false);
                    t && BallLogicMgr.playSound("pool_ball_in");
                    (n.ballMgr.size <= 1 || !a) && c();
                });
                break;
            }
        }
        this.ballMgr.size <= 1 && !a && c();
        a || this.onBallEffect(e);
    }

    loadEditingTableInfo(e) {
        console.log("loadEditingTableInfo", e);
        this.mode = BallLogicMgr.game_mode;
        console.log("this.mode", this.mode);
        this.editingTableInfo = util.clone(e);
        this.editingConditionInfo = e.condition;
        const t = e.balls;
        this._isXiaoQiuStart = false;
        this.commboCount = 0;
        this._xiaoqiuCount = 0;
        this._clearCount = 0;
        this._xiaoqiuStartHoleIndex = undefined;
        this._xiaoqiuTargetNode = null;
        this.cancelXiaoQiuEffect();
        this._xiaoqiuHoleId = undefined;
        this.destroyAllBall();
        this.closeWhiteBallEffect();
        this.mode == BallLogicMgr.MODE.ME_Editing && MoviePlayer.createNewMV();
        const o = cc.winSize;
        const n = o.height / o.width;
        const i = cc.find("node_condition_title", this.node);
        if (i) {
            n > 1.79 && (i.y = (o.height - 1280) / 2 - 50);
            this.mode == BallLogicMgr.MODE.ME_Free && this.setTitleFreeMode();
            this.mode == BallLogicMgr.MODE.PVE_Challenge || this.mode == BallLogicMgr.MODE.ME_Editing || this.mode == BallLogicMgr.MODE.ME_Free ? this.scheduleOnce(function () {
                i.getComponent("ConditionTitleComp").setCondition(this.editingConditionInfo);
            }, .1) : i.parent = null;
        }
        for (let a = 0; a < t.length; a++) this.createOneBall(t[a]);
        this.tableIsReset();
        console.log("game_table loadEditingTableInfo 10");
        this.initLevelInfo();
        this.initHart();
    }

    getTotalChallengeSec() {
        let e = 30;
        if (this.editingConditionInfo && this.editingConditionInfo.ganNum) {
            let t = this.editingConditionInfo.ganNum - 2;
            e += 10 * (t = t < 0 ? 0 : t);
        }
        return e;
    }

    fuhuo(e) {
        PoolLogger.instance.logGameEvent("thepool_game_table", {
            object_action: "show",
            object_name: "table_open",
            object_notes: PlayerDataSys.table
        });
        this.levelDataStatis.fuhuo_count++;
        const t = Number(ConfigDataSys.getFuhuoHeartAddCount());
        const o = Number(ConfigDataSys.global_ConfigMap.get("line_lv_life"));
        (e = o - this.ganNum) < 0 && (e = 0);
        Math.min(t, o - e);
        (e += t) > o && (e = o);
        this.ganNum = o - e;
        this.updateHart(this.ganNum);
        this.isIngame = true;
        this._isXiaoQiuStart = false;
        this._xiaoqiuStartHoleIndex = undefined;
        this._xiaoqiuTargetNode = null;
        this.commboCount = 0;
        this._xiaoqiuCount = 0;
        this.cancelXiaoQiuEffect();
        this._xiaoqiuHoleId = undefined;
        const balls = BallLogicMgr.editingTableInfo.balls;
        for (let i = 0; i < balls.length; i++) {
            const a = balls[i];
            a.ballType == BallLogicMgr.BallIDType_White && this.createOneBall(a, true);
        }
        const r = this;
        this.scheduleOnce(function () {
            const e = r.choseDirToBall();
            if (e) {
                r.rad = e.rad;
                r.dir = e.dir;
                r.applyRayByRad(e.rad, e.len);
            } else {
                CueHelper.hide();
                this.node.getComponent("CircleRayComp").clear();
            }
            r.tableResetFinish();
        }, .01);
    }

    applyOneCueMV_oneBallMove(e) {
        const t = this.ballMgr.get(e.ballID);
        if (t) {
            t.x = e.x;
            t.y = e.y;
            const o = t.getComponent(cc.RigidBody);
            t.getComponent("Ball2DControl").isTooSmallV(cc.v2(e.vx, e.vy)) || (o.linearVelocity = cc.v2(e.vx, e.vy));
        }
    }

    setupWhiteBallEffect(e, t) {
        console.log("setupWhiteBallEffect", e, t);
        if (e && t) {
            this.ball_white;
            const o = BallLogicMgr.shop_config();
            let n;
            if (e >= 0) {
                n = o.ball_colors;
                BallLogicMgr.getBy_cid(e, n);
            }
            t >= 0 && (n = o.ball_particles, BallLogicMgr.getBy_cid(t, n));
        }
    }

    cancelXiaoQiuEffect() {
        if (this._cueXiaoQiuSk) {
            const e = this._cueXiaoQiuSk;
            this._cueXiaoQiuSk = null;
            console.log("hole effect cancelXiaoQiuEffect ---", this._xiaoqiuHoleId);
            e.setAnimation(0, "dongkou_xiaoshi", false);
        }
    }

    clearRay() {
        this.node.getComponent("CircleRayComp").clear();
    }

    getUpVector(e, t) {
        t.x = e.m04;
        t.y = e.m05;
        t.z = e.m06;
        t.normalizeSelf();
        console.log("dst", t);
    }

    setAutoPlayingMode(e) {
        if (this.isAutoPlaying != e) {
            this.isAutoPlaying = e;
            let i;
            for (const entry of this.ballMgr.entries()) {
                i = entry[1];
                i.getComponent(cc.PhysicsCircleCollider).sensor = e;
                i.getComponent("Ball2DControl").isAutoPlaying = e;
            }
            console.log("setAutoPlayingMode", i.getComponent("Ball2DControl").ballID, e);
        }
    }

    createOneBall(e, t) {
        if (undefined === t) {
            t = false;
        }
        const o = this;
        const n = o.ballParent || o.node;
        if (o.ballPosNode) {
            if (e.ballType == BallLogicMgr.BallIDType_Normal) {
                const i = cc.instantiate(o.ballPosNode);
                i.parent = o.node;
                i.x = e.x;
                i.y = e.y;
                const a = i.getComponent("Ball2DControl");
                a.ballID = e.ballID;
                a.isAutoPlaying = o.isAutoPlaying;
                a.stopCallback = function (e) {
                    o.oneBallIsStop(e);
                };
                i.getComponent("Ball2DControl").sensor_value = false;
                const r = cc.instantiate(o.ball);
                n.addChild(r);
                r.getComponent("BallMaterialComp").setMatIdx(e.ballMatIdx);
                r.x = e.x;
                r.y = e.y;
                if (o.ballPosNode) {
                    const l = r.getChildByName("New Sphere");
                    l.getComponent("3D_ballRoll").pos_node = i;
                    l.getComponent("3D_ballRoll").bind_node_ps = true;
                    const c = cc.instantiate(o.shadow_prefab);
                    c.setParent(o.shadow_container);
                    c.setPosition(r.getPosition());
                    l.getComponent("3D_ballRoll").shadow_node = c;
                }
                i.getComponent("Ball2DControl").ball3D = r;
                o.ballMgr.set(o.ballID, i);
                o.ballID = o.ballID + 1;
            } else if (e.ballType == BallLogicMgr.BallIDType_White) {
                o.ball_white.x = e.x;
                o.ball_white.y = e.y;
                o.ball_white.scale = 1;
                const u = o.ball_white_pos_node.getComponent("Ball2DControl");
                u.ballID = e.ballID;
                o.ball_white_pos_node.x = e.x;
                o.ball_white_pos_node.y = e.y;
                u.sensor_value = true;
                const p = o.ball_white_pos_node.getComponent(cc.PhysicsCircleCollider);
                p.enabled = u.sensor_value;
                p.restitution = this._whiteBallRestitution;
                u.node.group = "default";
                u.ball3D.group = "3d";
                u.ball3D.children.forEach(function (e) {
                    e.group = "3d";
                });
                u.ball3D.children[0].getComponent("3D_ballRoll").setShowShadow(true);
                p.apply();
                if (t) {
                    const d = o.getWhiteBallFuHuoP(e);
                    o.ball_white_pos_node.x = d.x;
                    o.ball_white_pos_node.y = d.y;
                }
            }
            MoviePlayer.packInitBalls({
                ballID: e.ballID,
                ballType: e.ballType,
                ballMatIdx: e.ballMatIdx,
                x: e.x,
                y: e.y
            });
        }
    }

    doXiaoQiuAction() {
        if (this._cueXiaoQiuSk && this._isXiaoQiuStart && null != this._xiaoqiuStartHoleIndex && this._xiaoqiuTargetNode) {
            const e = this._xiaoQiuHoleEffectArray[this._xiaoqiuStartHoleIndex].parent;
            const t = this._cueXiaoQiuSk;
            this._cueXiaoQiuSk = null;
            t.setAnimation(0, "jinqiu", false);
            this.oneCueXiaoQiuCount++;
            const o = this._xiaoqiuTargetNode.getComponent("Ball2DControl");
            const n = o.ball3D;
            this._xiaoqiuGuiJiEffect.getChildByName("xiaoqiu").active = false;
            this._xiaoqiuGuiJiEffect.getChildByName("taiqiu_tuowei").active = true;
            this._xiaoqiuGuiJiEffect.x = e.x;
            this._xiaoqiuGuiJiEffect.y = e.y;
            this._xiaoqiuGuiJiEffect.active = true;
            cc.tween(this._xiaoqiuGuiJiEffect).to(.7, {
                x: n.x,
                y: n.y
            }).call(this.onXiaoQiuEnd.bind(this, o)).start();
        }
    }

    ballEnterHole(e, t) {
        this.playJinDongEffect(t);
        this.destroyBall(e, t);
    }

    reloadEditingTableInfo(e) {
        e = e || BallLogicMgr.editingTableInfo;
        this.loadEditingTableInfo(e);
    }

    setText() {}

    onXiaoQiuEnd(e) {
        this.levelDataStatis.xiaoqiu_count++;
        PlayerDataSys.xiaoqiuADCount++;
        BallLogicMgr.playSound("pool_ball_xiao");
        this._xiaoqiuGuiJiEffect.getChildByName("xiaoqiu").active = true;
        this._xiaoqiuGuiJiEffect.getChildByName("xiaoqiu").getComponent(sp.Skeleton).setAnimation(0, "qiuxiaoshi", false);
        this.destroyBall(e.node, null, true);
    }

    update(e) {
        if (this.do_update) {
            this.frame_idx = this.frame_idx + 1;
            if (this.frame_idx >= 10) {
                cc.Quat.rotateAround(this.quat, this.quat, this.axis, this.rad);
                this.target.setRotation(this.quat);
                this.frame_idx = 0;
            }
        }
        if (this.do_timer) {
            this.do_timer_sec = this.do_timer_sec + e;
            this.updateTimer();
        }
        if (this.mv_moves_starTimer > 0) {
            for (; this.mv_oneCue_moves.length > 0;) {
                const t = this.mv_oneCue_moves[0];
                if (!(t.time <= this.mv_moves_starTimer)) break;
                this.applyOneCueMV_oneBallMove(t);
                this.mv_oneCue_moves.shift();
            }
            this.mv_moves_starTimer = this.mv_moves_starTimer + 1e3 * e;
        }
    }

    recv_gamePlayFinish() {
        this.setText("轮到对方击球了");
    }

    failAndGoBack() {
        console.log("failAndGoBack");
        this.mode == BallLogicMgr.MODE.ME_Free ? this.gotoHall() : (this.mode, BallLogicMgr.MODE.PVE_Challenge, this.gotoHall());
    }

    tableResetFinish() {
        this.oneCueLock = false;
        this.isIngame = true;
        this.checkBaiQiuEffect();
        this.mode == BallLogicMgr.MODE.ME_PlayMV ? this.playOneMV_TableFinish() : this.mode != BallLogicMgr.MODE.PVE_Challenge && this.mode != BallLogicMgr.MODE.ME_Editing || this.startTimer();
        this.mode != BallLogicMgr.MODE.ME_Editing && this.mode != BallLogicMgr.MODE.PVE_Challenge && this.mode != BallLogicMgr.MODE.ME_Free || CueHelper.show();
        this.editingTableInfo && this.setupWhiteBallEffect(this.editingTableInfo.color, this.editingTableInfo.particle);
        EventMgr.trigger(GameEventType.HIDE_MAIN_UI_TOUCH_BLOCK, "game-shooting");
    }

    recv_ballInit(e) {
        console.log("recv_ballInit", e);
        const t = this.ballParent || this.node;
        const o = this;
        if (o.ballPosNode) {
            const n = cc.instantiate(o.ballPosNode);
            n.parent = o.node;
            n.x = e.x;
            n.y = e.y;
            n.getComponent("Ball2DControl").ballID = o.ballID;
            n.getComponent("Ball2DControl").isAutoPlaying = o.isAutoPlaying;
            n.getComponent("Ball2DControl").stopCallback = function (e) {
                o.oneBallIsStop(e);
            };
            n.getComponent("Ball2DControl").sensor_value = true;
            const i = cc.instantiate(o.ball);
            t.addChild(i);
            i.x = e.x;
            i.y = e.y;
            if (o.ballPosNode) {
                const a = i.getChildByName("New Sphere");
                a.getComponent("3D_ballRoll").pos_node = n;
                a.getComponent("3D_ballRoll").bind_node_ps = true;
            }
            n.getComponent("Ball2DControl").ball3D = i;
            o.ballMgr.set(o.ballID, n);
            o.ballID = o.ballID + 1;
        }
    }

    showXiaoQiuHoleEffect() {
        let e = this.getXiaoQiuHoldeIndex();
        if (null == e) for (;;) {
            e = EngineUtil.randomInt(0, this._xiaoQiuHoleEffectArray.length - 1);
            if (null == this._xiaoqiuHoleId || e != this._xiaoqiuHoleId) break;
        }
        console.log("hole effect showXiaoQiuHoleEffect ---");
        this._xiaoqiuHoleId = e;
        const t = this._xiaoQiuHoleEffectArray[e];
        t.active = true;
        const o = t.getChildByName("xiaoqiu").getComponent(sp.Skeleton);
        o.setAnimation(0, "dongkou_daiji", true);
        this._cueXiaoQiuSk = o;
    }

    reportGameDataStatis(e) {
        if (!this.isReportGameDataStatis) {
            this.isReportGameDataStatis = true;
            const t = TimeDataSys.getTimeCuration(true);
            if (t > 10800) {
                this.levelDataStatis.game_time = Math.max(0, TimeUtils.getTimeinSeconds() - this.levelDataStatis.game_time);
                this.levelDataStatis.game_time > 10800 && (this.levelDataStatis.game_time = 0);
            } else this.levelDataStatis.game_time = t;
            this.levelDataStatis.is_success = e ? 1 : 0;
            this.levelDataStatis.remain_heart = Math.max(0, BallLogicMgr.editingTableInfo.condition.ganNum - this.ganNum);
            this.levelDataStatis.full_heart = 0 == this.ganNum ? 1 : 0;
            SdkHelper.reportData("level_statis", this.levelDataStatis);
        }
    }

    updateRadBallBtnInfo() {
        const e = cc.find("bottom_area", this.node);
        cc.find("node_btn_radBall", e).getComponent("game_btn_radBall").setInfo(this.oneCue_rad_value, this.oneCue_rad_angle);
        console.log("updateRadBallBtnInfo", this.oneCue_rad_value, this.oneCue_rad_angle);
    }

    updateHart(e) {
        e = null != e ? e : this.ganNum;
        let t = Number(this.heartNumLabel.string);
        isNaN(t) && (t = 0);
        const o = Math.max(0, BallLogicMgr.editingTableInfo.condition.ganNum - e);
        const n = this.heartNumLabel.node.parent;
        this.heartNumLabel.string = "" + o;
        cc.Tween.stopAllByTarget(n);
        n.scale = 1;
        n.x = this.moveCueBallPropNode.x;
        o > t ? cc.tween(n).to(.12, {
            scale: 1.15
        }).to(.1, {
            scale: 1
        }).to(.1, {
            scale: 1.2
        }).to(.1, {
            scale: 1
        }).start() : o < t && cc.tween(n).by(.04, {
            x: -6
        }).by(.07, {
            x: 10
        }).by(.06, {
            x: -7
        }).by(.05, {
            x: 5
        }).by(.03, {
            x: -3
        }).by(.02, {
            x: 3
        }).by(.01, {
            x: -2
        }).start();
    }

    updateRadLabel() {
        const e = Math.floor(1e3 * (this.rad + Math.PI));
        const t = cc.find("bottom_area", this.node);
        cc.find("node_roll", t).getChildByName("roll_scroll").getComponent("RollScrollComp").updateLabel(e);
    }

    onModifyBallMoveToHole(e) {
        const t = e.moveDir;
        const o = e.ball2DCtrl;
        const n = e.cb;
        const i = o.ball3D;
        const a = cc.v2(i.x, i.y);
        let r = null;
        for (let l = 0; l < this._xiaoQiuHoleEffectArray.length; l++) {
            const c = this._xiaoQiuHoleEffectArray[l].parent;
            const u = cc.v2(c.x, c.y).subSelf(a);
            if (u.angle(t) <= BallLogicMgr.ballDirModifyThreshold) {
                r = u;
                break;
            }
        }
        n && n(r);
    }

    initXiaoQiuNode() {
        const e = cc.find("plane_table", this.node).getChildByName("table_layers");
        this._zhuoDongContainer = e.getChildByName("table").getChildByName("zhuo_pengzhuang_daizi_3d");
        this._xiaoQiuHoleEffectArray = [];
        let n;
        for (let t = 0; t < this._zhuoDongContainer.childrenCount; t++) {
            const o = cc.instantiate(this.xiaoqiuHoleEffectPreb);
            o.setParent(this._zhuoDongContainer.children[t]);
            o.setPosition(cc.Vec2.ZERO);
            n = o.getChildByName("xiaoqiu").getComponent(sp.Skeleton);
            n.setCompleteListener(this.onXiaoQiuEffectComplete.bind(this, o));
            this._xiaoQiuHoleEffectArray.push(o);
            o.active = false;
        }
        this._xiaoqiuGuiJiEffect = cc.instantiate(this.xiaoqiuHoleEffectPreb);
        this._xiaoqiuGuiJiEffect.setParent(this._zhuoDongContainer.parent);
        this._xiaoqiuGuiJiEffect.active = false;
        (n = this._xiaoqiuGuiJiEffect.getChildByName("xiaoqiu").getComponent(sp.Skeleton)).setCompleteListener(this.onXiaoQiuGuiJiEffectComplete.bind(this, this._xiaoqiuGuiJiEffect));
        this._xiaoqiuGuiJiEffect.getChildByName("xiaoqiu").active = false;
    }

    getXiaoQiuTarget() {
        let e = false;
        if (!this._cueXiaoQiuSk || this._isXiaoQiuStart) return e;
        const t = this._cueXiaoQiuSk;
        if (!this._isEnterXiaoQiu) {
            this._cueXiaoQiuSk = null;
            t.setAnimation(0, "dongkou_xiaoshi", false);
            return e;
        }
        console.log("hole effect getXiaoQiuTarget ---", this._xiaoqiuHoleId);
        if (null != this._xiaoqiuHoleId && null != this._xiaoqiuHoleId) {
            if (!this.doXiaoQiu(this._xiaoqiuHoleId)) {
                this._cueXiaoQiuSk = null;
                t.setAnimation(0, "dongkou_xiaoshi", false);
            }
            e = true;
        } else {
            this._cueXiaoQiuSk = null;
            t.setAnimation(0, "dongkou_xiaoshi", false);
        }
        this._isEnterXiaoQiu = false;
        return e;
    }

    resetWhiteBall() {
        this.ball_white_pos_node.getComponent("Ball2DControl").resetWhiteBallPos();
    }

    removeEventListener() {
        EventMgr.ignore(GameEventType.ON_LINE_PROP_USED_STATE_CHANGED, this.onUseLineProp, this);
        EventMgr.ignore(GameEventType.ON_PROP_USED_STATE_CHANGED, this.onPropUsedStateChanged, this);
        EventMgr.ignore(GameEventType.SHOW_MAIN_UI_TOUCH_BLOCK, this.onShowTopTouchBlock, this);
        EventMgr.ignore(GameEventType.HIDE_MAIN_UI_TOUCH_BLOCK, this.onHideTopTouchBlock, this);
        EventMgr.ignore(GameEventType.ModifyBallMoveDir, this.onModifyBallMoveToHole, this);
        EventMgr.ignore(GameEventType.ON_LEVEL_SWITCH_UI_HIDE, this.onLevelSwitchUIHide, this);
    }

    addEventListener() {
        EventMgr.listen(GameEventType.ON_LINE_PROP_USED_STATE_CHANGED, this.onUseLineProp, this);
        EventMgr.listen(GameEventType.ON_PROP_USED_STATE_CHANGED, this.onPropUsedStateChanged, this);
        EventMgr.listen(GameEventType.SHOW_MAIN_UI_TOUCH_BLOCK, this.onShowTopTouchBlock, this);
        EventMgr.listen(GameEventType.HIDE_MAIN_UI_TOUCH_BLOCK, this.onHideTopTouchBlock, this);
        EventMgr.listen(GameEventType.ModifyBallMoveDir, this.onModifyBallMoveToHole, this);
        EventMgr.listen(GameEventType.ON_LEVEL_SWITCH_UI_HIDE, this.onLevelSwitchUIHide, this);
    }

    doAftOneCueActionFinish(e) {
        if (e && this.oneCueLock && !this._isXiaoQiuStart) {
            this.oneCueLock = false;
            this.mode == BallLogicMgr.MODE.ME_PlayMV && this.continueOneMV();
            this.checkBaiQiuEffect();
        }
    }

    checkEnterXiaoQiu(e) {
        let t = false;
        if (!this._cueXiaoQiuSk || this._isXiaoQiuStart) return t;
        const o = e.parent.children.indexOf(e);
        if (o > -1) {
            console.log("hole effect checkEnterXiaoQiu ---", this._xiaoqiuHoleId, o);
            if (this._xiaoqiuHoleId == o) {
                this._isEnterXiaoQiu = true;
                t = true;
            }
        }
        return t;
    }

    clearTable() {
        this.oneCueLock = true;
        this.destroyAllBall();
    }

    applyRayByRad(e, t) {
        if (this.isGuideLevel && !this.lockTouchNode && this.top_guide_touch_block.active) {
            const o = Math.atan2(this.dir.y, this.dir.x);
            if (o >= -1.929735555 && o <= -1.9222755) {
                this.lockTouchNode = true;
                this.bottom_touch_block3.active = false;
                this.applyByRad(-1.9233395);
                cc.game.emit("GuideEvent_MiaoZhun");
                console.log("cc.game.emit GuideEvent_MiaoZhun");
                return;
            }
        }
        const n = e - Math.PI;
        const i = Math.cos(n) * t;
        const a = Math.sin(n) * t;
        const r = this.node.getComponent("CircleRayComp").check_line(this.ball_white_pos_node, this.ballMgr, e, cc.v2(i, a));
        const l = r.tar_node;
        const s = r.zhexian;
        this._isAimTarget = !!l;
        this.ball_white_ball2dCtr.aimTargetUUID = l ? l.uuid : "empty";
        this.ball_white_ball2dCtr.aimZheXian = s ? s.normalize() : null;
        this.updateRadLabel();
    }

    recv_gameStart(e) {
        const t = e.myTurn;
        this.setAutoPlayingMode(1 != t);
        this.pvpCueLock = 1 != t;
        this.mode = BallLogicMgr.MODE.PVP_Friend;
        this.isAutoPlaying ? this.setText("游戏开始，对方球权") : this.setText("游戏开始，你的球权");
        this.destroyAllBall();
        const o = this.ballParent || this.node;
        const n = this;
        for (let i = 0; i < 5; i++) if (n.ballPosNode) {
            const a = 30 * i - 180;
            const r = cc.instantiate(n.ballPosNode);
            r.parent = n.node;
            r.x = a;
            r.y = 100;
            r.getComponent("Ball2DControl").ballID = n.ballID;
            r.getComponent("Ball2DControl").isAutoPlaying = n.isAutoPlaying;
            r.getComponent("Ball2DControl").stopCallback = function (e) {
                n.oneBallIsStop(e);
            };
            r.getComponent("Ball2DControl").sensor_value = true;
            const l = cc.instantiate(n.ball);
            o.addChild(l);
            l.x = a;
            l.y = 100;
            if (n.ballPosNode) {
                const c = l.getChildByName("New Sphere");
                c.getComponent("3D_ballRoll").pos_node = r;
                c.getComponent("3D_ballRoll").bind_node_ps = true;
            }
            r.getComponent("Ball2DControl").ball3D = l;
            n.ballMgr.set(n.ballID, r);
            n.ballID = n.ballID + 1;
        }
        this.resetWhiteBall();
        GameMgr.setInBattle();
        this.tableIsReset();
    }

    onShowTopTouchBlock(e) {
        this._topTouchBlockHandlerSet.add(e);
        this.top_touch_block.active = true;
    }

    recv_enemyHit() {
        this.setText("对方击球了");
        this.setAutoPlayingMode(true);
    }

    checkBallMatIdxInMap(e) {
        for (const entry of this.ballMgr.entries()) {
            const i = entry[1];
            if (W == i.getComponent("Ball2DControl").ballID) {
            } else if (i.getComponent("Ball2DControl").ball3D.getComponent("BallMaterialComp").getMatIdx() == e) {
                console.log("find ballID", i.getComponent("Ball2DControl").ballID);
                return true;
            }
        }
        return false;
    }

    updateRecIcon() {}

    startTimer() {
        cc.find("node_condition_title", this.node);
        this.do_timer = true;
        this.do_timer_sec = 0;
    }

    start() {
        BallLogicMgr.isWin = false;
    }

    getNearestHodeIndexForBall(e) {
        let t = null;
        const o = cc.v2(e.x, e.y);
        const n = this.ball_white_pos_node.getComponent("Ball2DControl").ball3D;
        const i = cc.v2(n.x, n.y);
        const a = o.sub(i);
        const r = .04 * a.len();
        const l = a.len();
        let s = null;
        let c = 0;
        for (let u = 0; u < this._xiaoQiuHoleEffectArray.length; u++) {
            const p = this._xiaoQiuHoleEffectArray[u].parent;
            const d = cc.v2(p.x, p.y);
            const _ = cc.v2(p.x, p.y).subSelf(o);
            const f = _.angle(a);
            if (!(this.node.getComponent("CircleRayComp").getLineLen(i, a) < l)) {
                const h = d.subSelf(o).len();
                const g = r + .2 * _.len() + 100 * f;
                if (null == t || g < t) {
                    t = g;
                    s = h;
                    c = u;
                }
            }
        }
        return {
            distance: s,
            holeIndex: c,
            weight: t
        };
    }

    doXiaoQiu(e) {
        if (this.ballMgr.size <= 1) return false;
        const t = Array.from(this.ballMgr.values());
        let o = 0;
        for (;;) {
            const n = t[EngineUtil.randomInt(0, t.length - 1)];
            const i = n.getComponent("Ball2DControl");
            if (W != i.ballID && !i.isOnDeapMoving()) {
                this._isXiaoQiuStart = true;
                this._xiaoqiuTargetNode = n;
                this._xiaoqiuStartHoleIndex = e;
                break;
            }
            if (50 == ++o) break;
        }
        return this._isXiaoQiuStart;
    }

    onLevelSwitchUIHide() {
        if (!(this.ballCount < GameConfigurations.customConfig.minBallNumberForPropHint)) {
            EngineUtil.showManageViewToast("pkey_006");
            PageMgr.showPage("UsePropPage", {
                prop_type: ETaiQiuPropType.E_Line
            });
        }
    }

    onXiaoQiuGuiJiEffectComplete(e, t) {
        "qiuxiaoshi" == t.animation.name && (e.x = -2e4);
        t.loop || (e.getChildByName("xiaoqiu").active = false);
    }

    initHart(e) {
        this.heartNumLabel.string = "" + (null != e ? e : BallLogicMgr.editingTableInfo.condition.ganNum);
    }

    updateAimBall() {
        const e = PropDataSys.isLinePropUsed;
        const t = this._aimPower || 0;
        this._sprite_virtualBall.children[0].active = !e && t >= 1;
        this._sprite_virtualBall.children[1].active = !e;
        this._sprite_virtualBall.children[2].active = e;
    }

    CuePosByPower(e) {
        e /= CueDataSys.getUsedCuePower();
        let t;
        const o = Math.min(1, e / .2);
        this._aimPower = o;
        this._dirGreen.getComponent("SpriteRayComp").setPowerPercent(o);
        this.updateAimBall();
        e > .2 && (t = Math.min(1, e));
        this._dirYellow.getComponent("SpriteRayComp").setPowerPercent(t);
        CueHelper.CuePosByPower(e);
    }

    onUseLineProp(e) {
        if (CueHelper.isShow()) {
            this.applyByRad(this.rad);
            this.updateAimBall();
        }
        e && this.levelDataStatis.line_count++;
    }

    addTableNode(e) {
        const t = cc.find("plane_table", this.node);
        const o = t.getChildByName("table_layers");
        o.removeAllChildren(true);
        const n = e.getChildByName("plane_table");
        const i = n.getChildByName("table_layers").getChildByName("table");
        i.setParent(o);
        i.setPosition(cc.Vec2.ZERO);
        const a = t.getChildByName("table_touch");
        t.removeChild(a, true);
        const r = n.getChildByName("table_touch");
        r.setParent(t);
        r.setPosition(cc.Vec2.ZERO);
        const l = cc.find("zhuo_pengzhuang", this.node);
        l.removeAllChildren(true);
        const s = e.getChildByName("zhuo_pengzhuang").getChildByName("pengzhuang_root");
        s.setParent(l);
        s.setPosition(cc.Vec2.ZERO);
        const c = i.getChildByName("sprite_table");
        c && (c.active = false);
    }

    recv_outRoom() {
        if (this.isInPVPBattle()) {
            GameMgr.setOutBattle();
            this.setText("对方逃跑，游戏结束");
            this.destroyAllBall();
        }
    }

    tableIsReset() {
        const e = this;
        this.ganNum = 0;
        this.answers = [];
        MoviePlayer.refreshTime = new Date().getTime();
        this.ticker_start = new Date().getTime();
        BallLogicMgr.msgCache_balls = [];
        this.scheduleOnce(function () {
            let t;
            if (t = this.isGuideLevel ? CueHelper.applyByXY(50, 400) : e.choseDirToBall()) {
                e.rad = t.rad;
                e.dir = t.dir;
                e.applyRayByRad(t.rad, t.len);
            } else {
                CueHelper.hide();
                this.node.getComponent("CircleRayComp").clear();
            }
            e.tableResetFinish();
        }, .01);
    }

    checkBallClicked(e, t, o) {
        if (undefined === o) {
            o = 25;
        }
        console.log("check touch p(scren p) : " + e);
        let i = o;
        let a = null;
        for (const entry of this.ballMgr.entries()) {
            const s = entry[0];
            const c = entry[1];
            if (t) {
                if (s != W) continue;
            } else if (s == W) continue;
            const u = c.getComponent("Ball2DControl").ball3D;
            const p = u.convertToWorldSpaceAR(cc.Vec3.ZERO);
            const d = this.camera3D.getWorldToScreenPoint(p);
            const _ = cc.v2(d.x, d.y);
            const f = cc.Vec2.distance(e, _);
            if (f <= i) {
                i = f;
                a = u;
            }
        }
        return a;
    }

    btn_go(e) {
        const t = this;
        if (!this.oneCueLock && 0 != e) if (this.pvpCueLock) {
            this.setText("现在是对方击球");
            console.log("现在是对方击球");
        } else {
            EventMgr.trigger(GameEventType.SHOW_MAIN_UI_TOUCH_BLOCK, "game-shooting");
            this.isGuideLevel && (e = 1);
            e = e || 1;
            this.node.getComponent("CircleRayComp").clear();
            BallLogicMgr.curPowerPercentFlag = e;
            let o = CueDataSys.getUsedCuePower();
            const n = GlobalConfig.PowerMin;
            BallLogicMgr.useSimCueAttri && BallLogicMgr.simCuePower && (o = BallLogicMgr.simCuePower);
            let i = o * e;
            (i = Math.floor(i)) <= n && (i = n);
            i > o && (i = o);
            const a = Math.floor(1e5 * this.rad);
            this.mode == BallLogicMgr.MODE.ME_Editing && MoviePlayer.oneCue({
                rad: a,
                power: i,
                radAngle: this.oneCue_rad_angle,
                radVx: this.oneCue_rad_value.x,
                radVy: this.oneCue_rad_value.y
            });
            const r = this;
            CueHelper.hideByAni(e, function () {
                t.levelDataStatis.hit_count++;
                r.applyByPower(i);
                r.state = "hitfinish";
            });
        }
    }

    onHideTopTouchBlock(e) {
        if (this._topTouchBlockHandlerSet.has(e)) {
            this._topTouchBlockHandlerSet.delete(e);
            this._topTouchBlockHandlerSet.size < 1 && (this.top_touch_block.active = false);
        }
    }

    stopTimer() {
        this.do_timer = false;
        this.do_timer_sec = 0;
    }

    getDirToTargetBall() {
        let t = null;
        let o = null;
        for (const entry of CueHelper.ballMgr.entries()) {
            const a = entry[1];
            const r = a.getComponent("Ball2DControl");
            if (W == r.ballID) {
            } else if (!r.isOnDestroy()) {
                const l = this.getNearestHodeIndexForBall(r.ball3D, r.ballID);
                const s = l.distance;
                const c = (l.holeIndex, l.weight);
                if (null != s && null != c && (null == t || c < t)) {
                    t = c;
                    o = a;
                }
            }
        }
        return o;
    }

    initLevelInfo() {
        this.turnProgressBar.node.parent.active = !GameHelper.pocketed;
        this.levelLabel.string = "LV. " + PlayerDataSys.level_info.level_a;
        this.roundRichText.string = "pkey_001??&value1==<color= #E29EFF>" + PlayerDataSys.level_info.level_b + "</c>&value2==" + PlayerDataSys.level_info.roundCount;
        this.turnProgressBar.progress = PlayerDataSys.level_info.turnCount <= 0 ? 1 : PlayerDataSys.level_info.level_c / PlayerDataSys.level_info.turnCount;
        this.turnLabel.string = PlayerDataSys.level_info.level_c + "/" + PlayerDataSys.level_info.turnCount;
        this.levelSpliter.active = this.roundRichText.node.active = PlayerDataSys.level_info.roundCount > 1;
        this.turnProgressBar.node.active = PlayerDataSys.level_info.turnCount > 1;
    }

    doGameSuccess(e) {
        if (undefined === e) {
            e = false;
        }
        e || PoolLogger.instance.logGameEvent("thepool_game_table", {
            object_action: "show",
            object_name: "table_clear",
            object_notes: PlayerDataSys.table
        });
        this.isIngame = false;
        this.cancelXiaoQiuEffect();
        BallLogicMgr.isWin = true;
        PageMgr.showPage("GameEndPage", {
            isSuccess: true,
            ballCount: this.ballCount
        });
        BallLogicMgr.saveFreeModeFinishIdx();
    }

    onJinDongEffectComplete(e) {
        e.active = false;
    }

    onGMLevelSuccess() {
        this.doGameSuccess(true);
    }
}
