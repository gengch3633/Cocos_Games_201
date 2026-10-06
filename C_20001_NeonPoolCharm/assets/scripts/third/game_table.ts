import * as BallLogicMgr from "./BallLogicMgr";
import CueDataSys from "./CueDataSys";
import PropDataSys from "./PropDataSys";
import * as CueHelper from "./CueHelper";
import DB from "./DB";
import { GameConfigurations } from "./GameConfigurations";
import GameHelper from "./GameHelper";
import LevelObserver from "./LevelObserver";
import { PoolLogger } from "./PoolLogger";
import ConfigDataSys from "./ConfigDataSys";
import PlayerDataSys from "./PlayerDataSys";
import SystemDataSys from "./SystemDataSys";
import * as ConfigDataMgr from "./ConfigDataMgr";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import SdkHelper from "./SdkHelper";
import EngineUtil from "./EngineUtil";
import TimeUtils from "./TimeUtils";
import * as GameMgr from "./GameMgr";
import * as GlobalConfig from "./GlobalConfig";
import GuideEvent from "./GuideEvent";
import GuideManager from "./GuideManager";
import GameServiceMgr from "./GameServiceMgr";
import { UiManager } from "./UiManage";
import * as MoviePlayer from "./MoviePlayer";
import * as platform from "./platform";
import TimeDataSys from "./TimeDataSys";
import * as util from "./util";
import PageMgr from "./PageMgr";

const { ccclass, property } = cc._decorator;

function iterateEntries(e: any, t?: any): any {
      var o;
      if ("undefined" == typeof Symbol || null == e[Symbol.iterator]) {
        if (Array.isArray(e) || (o = toArrayLike(e)) || t && e && "number" == typeof e.length) {
          o && (e = o);
          var n = 0;
          return function () {
            return n >= e.length ? {
              done: !0
            } : {
              done: !1,
              value: e[n++]
            };
          };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      return (o = e[Symbol.iterator]()).next.bind(o);
    }
function toArrayLike(e: any, t?: number): any[] | undefined {
      if (e) {
        if ("string" == typeof e) return sliceArray(e, t);
        var o = Object.prototype.toString.call(e).slice(8, -1);
        "Object" === o && e.constructor && (o = e.constructor.name);
        return "Map" === o || "Set" === o ? Array.from(e) : "Arguments" === o || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o) ? sliceArray(e, t) : void 0;
      }
    }
function sliceArray(e: any, t?: number): any[] {
      (null == t || t > e.length) && (t = e.length);
      for (var o = 0, n = new Array(t); o < t; o++) n[o] = e[o];
      return n;
    }
    const DEG_TO_RAD = Math.PI / 180;
const WHITE_BALL_ID = 100 * BallLogicMgr.BallIDType_White;
const NORMAL_BALL_ID_START = 100 * BallLogicMgr.BallIDType_Normal;

@ccclass("game_table")
export default class GameTable extends cc.Component {
    @property(cc.Node)
    target: any = null;
    @property(cc.Prefab)
    ball: any = null;
    @property(cc.Node)
    flyNumPrefab: any = null;
    @property(cc.Node)
    ballParent: any = null;
    @property(cc.Prefab)
    ballPosNode: any = null;
    @property(cc.Node)
    circle_target: any = null;
    @property(cc.Node)
    ball_white: any = null;
    @property(cc.Node)
    white_ball_shadow: any = null;
    @property(cc.Prefab)
    ui_alert_Prefab: any = null;
    @property(cc.Prefab)
    ui_radPage_Prefab: any = null;
    @property(cc.Label)
    levelLabel: any = null;
    @property(cc.Node)
    levelSpliter: any = null;
    @property(cc.RichText)
    roundRichText: any = null;
    @property(cc.ProgressBar)
    turnProgressBar: any = null;
    @property(cc.Label)
    turnLabel: any = null;
    @property(cc.Label)
    heartNumLabel: any = null;
    @property(cc.Prefab)
    xiaoqiuHoleEffectPreb: any = null;
    @property(cc.Prefab)
    jinDongEffectPreb: any = null;
    @property(sp.Skeleton)
    ball_click_effect: any = null;
    @property(cc.Node)
    shadow_container: any = null;
    @property(cc.Prefab)
    shadow_prefab: any = null;
    @property(cc.Camera)
    camera2D: any = null;
    @property(cc.Camera)
    camera3D: any = null;
    @property(cc.Node)
    gm_touch: any = null;
    @property(cc.Node)
    moveCueBallPropNode: any = null;
    @property(cc.Node)
    top_touch_block: any = null;
    @property(cc.Node)
    top_guide_touch_block: any = null;
    @property(cc.Node)
    bottom_touch_block1: any = null;
    @property(cc.Node)
    bottom_touch_block2: any = null;
    @property(cc.Node)
    bottom_touch_block3: any = null;
    @property({ type: [cc.Node] })
    game_hide_nodes: any = [];
    ballMgr: Map<any, any> = new Map();
    ball_white_pos_node: any = null;
    oneCueXiaoQiuCount: number = 0;
    _xiaoQiuConfigCount: any = undefined;
    non_goal_cue_count: number = 0;
    is_open_prop: boolean = false;
    _shouldShowBonusPage: boolean = false;
    _waitingForBonusPage: boolean = false;
    _topTouchBlockHandlerSet: Set<any> = new Set();
    ballID: any = null;
    isAutoPlaying: any = null;
    _isXiaoQiuStart: any = null;
    isIngame: any = null;
    failedNum: any = null;
    doOneCueFinished: any = null;
    _aimPower: any = null;
    oneCueLock: any = null;
    isGuideLevel: any = null;
    showHongBao: any = null;
    pvpCueLock: any = null;
    ganNum: any = null;
    _xiaoqiuStartHoleIndex: any = null;
    _xiaoqiuTargetNode: any = null;
    commboCount: any = null;
    _xiaoqiuCount: any = 0;
    _xiaoqiuHoleId: any = null;
    mode: any = null;
    editingTableInfo: any = null;
    editingConditionInfo: any = null;
    _clearCount: any = null;
    answers: any = null;
    ticker_start: any = null;
    lockTouchNode: any = null;
    rad: any = null;
    dir: any = null;
    _isAimTarget: any = null;
    oneCueDestroyBalls: any = [];
    oneCueAnswer: any = null;
    oneCue_rad_angle: any = null;
    oneCue_rad_value: any = null;
    oneMV: any = null;
    do_timer: any = null;
    do_timer_sec: any = null;
    do_update: any = null;
    _zhuoDongContainer: any = null;
    _jinDongEffectArray: any = null;
    _xiaoQiuHoleEffectArray: any = null;
    _xiaoqiuGuiJiEffect: any = null;
    _cueXiaoQiuSk: any = null;
    _isEnterXiaoQiu: any = null;
    isReportGameDataStatis: any = null;

    async onLoad() {
        let o: any, n: any, i: any, a: any, r: any, l: any, d: any, _: any, f: any, g: any, b: any, I: any, E: any, w: any, O: any, L: any, x: any, k: any, U: any, G: any, F: any, j: any, H: any, V: any, Y: any, K: any, X: any, Q: any;
        const Z = this;
                          LevelObserver.instance.startLog(PlayerDataSys.turn_pass + 1, PlayerDataSys.level_info.level_a + "-" + PlayerDataSys.level_info.level_b, PlayerDataSys.table, BallLogicMgr.editingTableInfo.tableID, BallLogicMgr.editingTableInfo.balls.length - 1);
                          this.turnProgressBar.node.parent.active = !1;
                          this.non_goal_cue_count = 0;
                          this.isGuideLevel = BallLogicMgr.isGuideLevel;
                          this.top_guide_touch_block.active = this.isGuideLevel;
                          this.bottom_touch_block1.active = this.isGuideLevel;
                          this.bottom_touch_block2.active = this.isGuideLevel;
                          this.bottom_touch_block3.active = this.isGuideLevel;
                          TimeDataSys.setTimerStart(!0);
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
                          const tablePrefabPath = "prefabs/tables/table_" + BallLogicMgr.editingTableInfo.tableID;
                const o = await UiManager.loaderPrefabInDeepPath(tablePrefabPath);
                if (!o) {
                    return;
                }
                          this.gm_touch.active = !SystemDataSys.online_release;
                          ConfigDataSys.getLevelCashNum();
                          n = cc.instantiate(o);
                          this.addTableNode(n);
                          i = this;
                          (a = cc.winSize).height / a.width > 2 && (cc.find("Camera3D", this.node).z *= 1.225);
                          GlobalConfig.debug_alpha && (this.node.opacity = 25);
                          if (platform.isTT()) {
                            i.updateRecIcon();
                            BallLogicMgr.initRecord();
                            BallLogicMgr.updateRecIcon = function () {
                              i.updateRecIcon();
                            };
                          }
                          i = this;
                          this.pvpCueLock = !1;
                          this.state = "pregame";
                          this.rad = 0;
                          this.dir = cc.v2(0, 0);
                          this.progress = 0;
                          this.quat = cc.quat();
                          this.do_update = !1;
                          this.isAutoPlaying = !1;
                          this.failedNum = 0;
                          this.mode = BallLogicMgr.MODE.ME_Free;
                          this.do_timer = !1;
                          this.do_timer_sec = 0;
                          this.mv_moves_starTimer = -1;
                          this.oneCueXiaoQiuCount = 0;
                          this.ballParent || this.node;
                          r = cc.find("node_ball2Pos", this.node);
                          l = r.getComponent("Ball2DControl");
                          this.ball_white_ball2dCtr = l;
                          this._whiteBallRestitution = r.getComponent(cc.PhysicsCircleCollider).restitution;
                          this.ball_white_pos_node = r;
                          l.stopCallback = function (e: any) {
                            l.isOnDeapMoving() || setTimeout(function () {
                              i.oneBallIsStop(e);
                            }, .02);
                          };
                          this.ball_white_pos_node.x = -180;
                          this.ball_white_pos_node.y = -180;
                          this.ball_white_pos_node.getComponent(cc.RigidBody).syncRotation();
                          this.ballMgr.clear();
                          this.ball_white_pos_node.getComponent("Ball2DControl").ballID = WHITE_BALL_ID;
                          d = this.ball_white;
                          this.ball_white_pos_node.getComponent("Ball2DControl").ball3D = d;
                          i.ballMgr.set(WHITE_BALL_ID, this.ball_white_pos_node);
                          this.ballID = NORMAL_BALL_ID_START;
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
                            Z.ball_click_effect.active = !1;
                          });
                          this.ball_click_effect.active = !1;
                          i.updateAimBall();
                          _ = cc.find("plane_table", this.node);
                          cc.find("node_btns", this.node);
                          i.initJinDongEffect();
                          i.initXiaoQiuNode();
                          this.cueRes = cc.find("plane_table", this.node).getChildByName("node_cue_container").getChildByName("node_cue2").getChildByName("10522_Pool_Cue_v1_SG");
                          UiManager.loadSpine(this.cueRes, "cue_spine", CueDataSys.getCurCueSourceName(), function () {
                            i.cueRes.getComponent(sp.Skeleton).setAnimation(0, "animation", !0);
                          });
                          CueHelper.init(this.node, this.ball_white_pos_node, this.ball_white, i.ballMgr);
                          console.log("game_table onLoad 9");
                          f = cc.find("bottom_area", this.node);
                          g = 1;
                          cc.find("node_roll", f).getChildByName("roll_scroll").getComponent("RollScrollComp").setCallBack(function (e: any) {
                            if (i.checkCanOP()) {
                              GlobalConfig.sens_toggle_get();
                              var t = i._isAimTarget ? GlobalConfig.gan_move_roll_multy_aim : GlobalConfig.gan_move_roll_multy;
                              g += e *= t;
                              if (Math.abs(g) > .008) {
                                g = 0;
                                BallLogicMgr.playSound("pool_ruler");
                              }
                              i.oneRadStep(0, e);
                            }
                          });
                          cc.find("node_power2", f).getComponent("PowerBar2Comp").setCallBack(function (e: any) {
                            console.log("percent", e);
                            i.checkCanOP() && i.btn_go(e);
                          });
                          cc.find("node_power2", f).getComponent("PowerBar2Comp").setCallBack_update(function (e: any) {
                            i.checkCanOP() && i.CuePosByPower(100 * e);
                          });
                          b = cc.find("bottom_area", this.node);
                          cc.find("btn_setting", b).on("click", function () {
                            console.log("btn_setting", this, i);
                            BallLogicMgr.playUIClick();
                            PageMgr.showPage("SetPageInGame", {
                              exitCB: function () {
                                i.gotoHall();
                              }
                            });
                          });
                          I = _.getChildByName("table_touch");
                          E = I.getBoundingBox();
                          w = I.getBoundingBoxToWorld();
                          O = cc.v2(w.xMax, w.yMax);
                          L = cc.v2(w.xMin, w.yMin);
                          x = i.camera3D.getWorldToScreenPoint(O);
                          k = i.camera3D.getWorldToScreenPoint(L);
                          U = util.x - k.x;
                          G = util.y - k.y;
                          F = new cc.Rect(k.x, k.y, U, G);
                          j = function (e: any) {
                            var t = e.sub(F.center),
                              o = t.x / (U / 2) * I.width / 2,
                              n = t.y / (G / 2) * I.height / 2;
                            return cc.v2(o, n);
                          };
                          H = [];
                          I.childrenCount > 0 && I.children.forEach(function (e: any) {
                            var t = e.getComponent(cc.PolygonCollider);
                            t ? H.push({
                              type: 1,
                              value: t.points
                            }) : H.push({
                              type: 0,
                              value: e.getBoundingBox()
                            });
                          });
                          V = H.length;
                          DEG_TO_RAD = function (e: any, t: any) {
                            for (var o = e.x, n = e.y, i = !1, a = 0, r = t.length - 1; a < t.length; r = a++) {
                              var l = t[a].x,
                                s = t[a].y,
                                c = t[r].x,
                                u = t[r].y;
                              s > n != u > n && o < (c - l) * (n - s) / (u - s) + l && (i = !i);
                            }
                            return i;
                          };
                          K = function (e: any) {
                            if (V < 1) return GameMgr.contains(e);
                            for (var t = 0; t < V; t++) {
                              var o = H[t];
                              if (0 == o.type) {
                                if (o.value.contains(e)) return !0;
                              } else if (DEG_TO_RAD(e, o.value)) return !0;
                            }
                            return !1;
                          };
                          X = 0;
                          Q = cc.v2(0, 0);
                          I.on(cc.Node.EventType.TOUCH_START, function (e: any) {
                            if (!e.touch || 0 == e.touch.getID()) {
                              EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                              X = 0;
                              if (i.checkCanOP() && !i.lockTouchNode) {
                                var t = I.convertToNodeSpaceAR(e.touch._point);
                                console.log("table_touch start", t.x, t.y);
                                if (PropDataSys.isBaiQiuPropInUse) {
                                  var o = i.checkBallClicked(e.touch._point, !0, GlobalConfig.ball_radius + GlobalConfig.ball_radius);
                                  i._slectedWhiteBall = !!o;
                                  if (i._slectedWhiteBall) {
                                    CueHelper.hide();
                                    i.node.getComponent("CircleRayComp").clear();
                                  }
                                  if (o) {
                                    var n = iterateEntries(e.touch._point);
                                    Q = cc.v2(DB.x, DB.y).subSelf(n);
                                    console.log("touched white ball ");
                                  }
                                } else i._slectedWhiteBall = !1;
                              }
                            }
                          });
                          I.on(cc.Node.EventType.TOUCH_MOVE, function (e: any) {
                            if (!e.touch || 0 == e.touch.getID()) {
                              EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                              if (i.checkCanOP() && !i.lockTouchNode) {
                                var t = e.currentTouch;
                                X += t._point.sub(t._prevPoint).len();
                                if (i._slectedWhiteBall) {
                                  var o = iterateEntries(e.touch._point).addSelf(Q),
                                    n = K(o);
                                  !i.checkBallClicked3D(o, !1, 2 * (GlobalConfig.ball_radius + 1)) && n && (i.ball_white_pos_node.position = o);
                                } else {
                                  var a = I.parent.convertToNodeSpaceAR(t._point),
                                    r = I.parent.convertToNodeSpaceAR(t._prevPoint),
                                    l = i.calculateRotationDirection(a, r, i.ball_white_pos_node.position) * r.sub(a).len();
                                  0 != l && i.applyByRad(i.rad + l / 180 / (i._isAimTarget ? GlobalConfig.gan_move_rad_multy_aim : GlobalConfig.gan_move_rad_multy_normal));
                                }
                              }
                            }
                          });
                          I.on(cc.Node.EventType.TOUCH_END, function (e: any) {
                            if (!e.touch || 0 == e.touch.getID()) {
                              EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                              if (i.checkCanOP() && !i.lockTouchNode) {
                                I.convertToNodeSpaceAR(e.touch._point);
                                if (i._slectedWhiteBall) {
                                  var t = i.getNearBallByWhite();
                                  CueHelper.show();
                                  a = t ? CueHelper.applyByTargetBall(t) : CueHelper.applyByXY(CueHelper.curApplyXY.x, CueHelper.curApplyXY.y);
                                  i.rad = a.rad;
                                  i.dir = a.dir;
                                  i.applyRayByRad(a.rad, a.len);
                                }
                                i._slectedWhiteBall = !1;
                                var o = !1;
                                if (0 == X || X < 10) {
                                  var n = i.checkBallClicked(e.touch._point);
                                  if (n) {
                                    if (a = CueHelper.applyByTargetBall(n)) {
                                      i.rad = a.rad;
                                      i.dir = a.dir;
                                      i.applyRayByRad(a.rad, a.len);
                                      i.ball_click_effect.active = !0;
                                      i.ball_click_effect.node.setPosition(n.getPosition());
                                      i.ball_click_effect.setAnimation(0, "animation", !1);
                                      o = !0;
                                      BallLogicMgr.playSound("pool_ball_click");
                                    }
                                    i.tableResetFinish();
                                  }
                                  if (!o) {
                                    var a,
                                      r = iterateEntries(e.touch._point);
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
                            i.ui_radPage_Prefab && cc.instantiate(i.ui_radPage_Prefab).getComponent("game_UI_radPage").show(i.node, function (e: any, t: any) {
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

    callback2(e: any) {
        var t = 2 * (e.progress - .5),
                    o = cc.find("plane_table", this.node);
                  console.log("slider target", o);
                  this.do_orbit2(o, t);
    }

    allStopTodo(e: any, t: any) {
        var o,
                    n = this;
                  if (this.isAutoPlaying) {
                    if (e) {
                      this.pvpCueLock = !1;
                      this.setAutoPlayingMode(!1);
                      this.state = "moviefinish";
                    }
                    console.log("播放对方动作全部结束");
                  } else if (e && !this._waitingForBonusPage) {
                    console.log("己方动作全部结束");
                    if (this._shouldShowBonusPage && (t || this.ballMgr.size <= 1)) {
                      this._shouldShowBonusPage = !1;
                      this._waitingForBonusPage = !0;
                      if (PlayerDataSys.level_info.level_a >= GameConfigurations.customConfig.startLevelForClearAward) null === (o = GameHelper.frameSDK) || void 0 === o || o.openABAward(function () {
                        n._waitingForBonusPage = !1;
                        n.oneCueActionFinish(t);
                      });else {
                        this._waitingForBonusPage = !1;
                        this.oneCueActionFinish(t);
                      }
                    } else this.oneCueActionFinish(t);
                  }
                  this.doAftOneCueActionFinish(e);
    }

    oneCueFinish() {
        this.oneCueLock = !0;
                  this.doOneCueFinished = !1;
                  this.CuePosByPower(0);
                  CueHelper.hide();
                  PropDataSys.propUsedComplete(ConfigDataMgr.ETaiQiuPropType.E_BaiQiu);
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

    onBallEffect(e: any) {
        var t,
                    o = GameConfigurations.customConfig.bonusPerBall;
                  Array.isArray(o) && (o = 2 + Math.floor(Math.random() * (o[1] - o[0] + 1)));
                  null === (t = GameHelper.frameSDK) || void 0 === t || t.addBitCoin(o, 0, 0, e.convertToWorldSpaceAR(cc.Vec2.ZERO));
    }

    gotoHall() {
        this.destroyAllBall();
                  BallLogicMgr.gotoHall();
    }

    onXiaoQiuEffectComplete(e: any, t: any) {
        t.loop || (e.active = !1);
    }

    applyByRad(e: any) {
        this.circle_target;
                  this.rad = e;
                  this.rad = Math.floor(1e5 * this.rad) / 1e5;
                  var t = CueHelper.applyByRad(e);
                  this.dir = t.dir;
                  var o = t.len;
                  this.applyRayByRad(e, o);
    }

    getWhiteBallFuHuoP(e: any) {
        for (var t, o = 2 * (GlobalConfig.ball_radius + 3), n = iterateEntries(this.ballMgr.entries()); !(t = n()).done;) {
                    var i = t.value,
                      a = i[0],
                      r = i[1];
                    if (a != WHITE_BALL_ID) {
                      var l = r.getComponent("Ball2DControl").ball3D,
                        s = cc.v2(l.x, l.y),
                        c = cc.v2(e.x, e.y).sub(s);
                      console.log("getWhiteBallFuHuoP minLen", o);
                      if (c.len() < o) {
                        0 == c.len() && (c = cc.v2(1, 0).rotateSelf(EngineUtil.random(0, Math.PI)));
                        e = BallLogicMgr.add(c.normalizeSelf().mulSelf(o));
                        return this.getWhiteBallFuHuoP(e);
                      }
                    }
                  }
                  return e;
    }

    whiteBallIsDestroyed() {
        
    }

    onSlider(e: any) {
        this.oneRadStep(2 * (e.progress - .5));
    }

    isInPVPBattle() {
        return !1;
    }

    getNearBallByWhite() {
        for (var e, t = this.ball_white_pos_node.position, o = 0, n = null, i = iterateEntries(this.ballMgr.entries()); !(e = i()).done;) {
                    var a = e.value,
                      r = (a[0], a[1]),
                      l = r.getComponent("Ball2DControl");
                    if (WHITE_BALL_ID == l.ballID) ;else if (!l.isOnDestroy()) {
                      var s = t.sub(r.position).len();
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

    calculateRotationDirection(e: any, t: any, o: any) {
        var n = e.x - t.x,
                    i = e.y - t.y;
                  return n * (t.y - o.y) - i * (t.x - o.x) > 0 ? -1 : 1;
    }

    updateTimer() {
        var e = cc.find("node_condition_title", this.node);
                  if (e) {
                    var t = e.getChildByName("label_time"),
                      o = Math.floor(this.do_timer_sec),
                      n = this.getTotalChallengeSec();
                    t.getComponent(cc.Label).string = o + "/" + n + "s";
                    if (o >= n) {
                      this.stopTimer();
                      this.mode != BallLogicMgr.MODE.PVE_Challenge && this.mode != BallLogicMgr.MODE.ME_Editing || this.challangeFail("超时了，");
                    }
                  }
    }

    destroyAllBall() {
        for (var e, t = iterateEntries(this.ballMgr.entries()); !(e = t()).done;) {
                    var o = e.value,
                      n = o[0],
                      i = o[1];
                    if (WHITE_BALL_ID == i.getComponent("Ball2DControl").ballID) i.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);else {
                      this.ballMgr.delete(n);
                      i.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                      var a = i.getComponent("Ball2DControl").ball3D.children[0].getComponent("3D_ballRoll");
                      a.shadow_node.parent = null;
                      a.shadow_node.destroy();
                      i.getComponent("Ball2DControl").ball3D.parent = null;
                      i.parent = null;
                      i.getComponent("Ball2DControl").ball3D.destroy();
                      i.destroy();
                    }
                  }
                  this.ballID = NORMAL_BALL_ID_START;
    }

    playOneMV_TableFinish() {
        
    }

    onPropUsedStateChanged(e: any) {
        var t = e.prop_type,
                    o = e.state,
                    n = e.isUsedProp;
                  if (t == ConfigDataMgr.ETaiQiuPropType.E_BaiQiu) {
                    1 == o && n && this.levelDataStatis.baiqiu_count++;
                    this.checkBaiQiuEffect();
                  }
    }

    oneRadStep(e: any, t: any) {
        if (!this.lockTouchNode) {
                    t = t || 0;
                    cc.v3(0, 0, 1);
                    var o = 0;
                    if (0 != t) o = this.rad + t;else {
                      if (0 == e) return;
                      o = Math.PI * e;
                    }
                    this.applyByRad(o);
                  }
    }

    playOneMV(e: any) {
        if (e) {
                    this.oneMV = e;
                    this.oneMV_cues_idx = this.oneMV_cues_idx || 0;
                    BallLogicMgr.game_mode = BallLogicMgr.MODE.ME_PlayMV;
                    this.setAutoPlayingMode(!0);
                    0 == this.oneMV_cues_idx ? this.reloadEditingTableInfo() : this.playOneMV_TableFinish();
                  }
    }

    onEnable() {
        var e = this;
                  this.addEventListener();
                  if (!LevelObserver.instance.logging) {
                    EventMgr.trigger(GameEventType.SHOW_MAIN_UI_TOUCH_BLOCK, "game-initing");
                    this._waitingForBonusPage = !1;
                    PoolLogger.instance.logGameEvent("thepool_game_table", {
                      object_action: "show",
                      object_name: "table_open",
                      object_notes: PlayerDataSys.table
                    });
                    new Promise(function (e) {
                      GameHelper.frameSDK ? GameHelper.frameSDK.beforeGameLevelStart(PlayerDataSys.level_info.level_a, PlayerDataSys.level_info.level_b, void 0, function () {
                        return e();
                      }) : e();
                    }).then(function () {
                      if (e.ballCount >= GameConfigurations.customConfig.minBallNumberForPropHint && !e.isGuideLevel && PropDataSys.isLinePropUseable) {
                        EngineUtil.showManageViewToast("pkey_006");
                        PageMgr.showPage("UsePropPage", {
                          prop_type: ConfigDataMgr.ETaiQiuPropType.E_Line
                        });
                      } else GuideManager.Instance.emit(GuideEvent.StartGame);
                      EventMgr.trigger(GameEventType.HIDE_MAIN_UI_TOUCH_BLOCK, "game-initing");
                    });
                  }
    }

    recv_ballDestroy(e: any) {
        for (var t, o = e.ballID, n = iterateEntries(this.ballMgr.entries()); !(t = n()).done;) {
                    var i = t.value,
                      a = i[0],
                      r = i[1];
                    if (r.getComponent("Ball2DControl").ballID == o) {
                      if (WHITE_BALL_ID == r.getComponent("Ball2DControl").ballID) this.resetWhiteBall();else {
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
        var e = this.getDirToTargetBall();
                  return e ? CueHelper.applyByTargetBall(e) : CueHelper.randomDirToBall();
    }

    checkBallClicked3D(e: any, t: any, o: any) {
        void 0 === o && (o = 2 * GlobalConfig.ball_radius);
                  for (var n, i = o, a = null, r = iterateEntries(this.ballMgr.entries()); !(n = r()).done;) {
                    var l = n.value,
                      s = l[0],
                      c = l[1];
                    if (t) {
                      if (s != WHITE_BALL_ID) continue;
                    } else if (s == WHITE_BALL_ID) continue;
                    var u = c.getComponent("Ball2DControl").ball3D,
                      p = cc.Vec2.distance(cc.v2(u.x, u.y), e);
                    if (p <= i) {
                      i = p;
                      a = u;
                    }
                  }
                  return a;
    }

    do_orbit2(e: any, t: any) {
        var o = e,
                    n = new cc.Mat4();
                  n = o.getWorldRotation(n);
                  var i = cc.v3(0, 0, 0),
                    a = new cc.Mat4();
                  a = o.getWorldMatrix(a);
                  this.getUpVector(a, i);
                  var r = i;
                  r = r.normalizeSelf();
                  var l = Math.PI * t * .1;
                  l = this.rad + l;
                  cc.Quat.rotateAround(n, n, r, l);
                  o.setRotation(n);
    }

    onDisable() {
        this.removeEventListener();
                  PropDataSys.propUsedComplete(ConfigDataMgr.ETaiQiuPropType.E_BaiQiu);
    }

    applyByPower(e: any) {
        var t = -Math.cos(this.oneCue_rad_angle * DEG_TO_RAD) * e,
                    o = Math.sin(this.oneCue_rad_angle * DEG_TO_RAD) * e,
                    n = this.ball_white.getChildByName("New Sphere").getComponent("3D_ballRoll").pos_node;
                  this.isAutoPlaying || n.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(this.dir.x * t, this.dir.y * t), cc.v2(0, 0), !0);
                  n.getComponent("Ball2DControl").setRadMove(this.oneCue_rad_value, o);
                  this.oneCueDestroyBalls.length = 0;
                  var i = Math.floor(100 * this.rad);
                  this.oneCueAnswer = BallLogicMgr.pack_answer(i, e);
                  var a = cc.find("node_condition_title", this.node);
                  this.mode == BallLogicMgr.MODE.PVE_Challenge || this.mode == BallLogicMgr.MODE.ME_Editing ? a.getComponent("ConditionTitleComp").updateGunNum(this.ganNum) : this.mode == BallLogicMgr.MODE.ME_Free && (BallLogicMgr.freeMode_totalGanNum = BallLogicMgr.freeMode_totalGanNum + 1);
                  this.oneCueFinish();
    }

    checkCanOP() {
        return this.mode != BallLogicMgr.MODE.PVP_Friend && !this.oneCueLock;
    }

    initJinDongEffect() {
        var e = cc.find("plane_table", this.node).getChildByName("table_layers");
                  this._zhuoDongContainer = e.getChildByName("table").getChildByName("zhuo_pengzhuang_daizi_3d");
                  this._jinDongEffectArray = [];
                  for (var t = 0; t < this._zhuoDongContainer.childrenCount; t++) {
                    var o = cc.instantiate(this.jinDongEffectPreb);
                    o.setParent(this._zhuoDongContainer.children[t]);
                    o.setPosition(cc.Vec2.ZERO);
                    o.getChildByName("jindong").getComponent(sp.Skeleton).setCompleteListener(this.onJinDongEffectComplete.bind(this, o));
                    this._jinDongEffectArray.push(o);
                    o.active = !1;
                  }
    }

    playOneMV_moves(e: any) {
        if (e && e.length > 0) {
                    this.mv_oneCue_moves = e;
                    this.mv_moves_starTimer = e[0].time;
                  }
    }

    recv_ballMove(e: any) {
        var t = this.ballMgr.get(e.ballID);
                  if (t) {
                    t.x = e.x;
                    t.y = e.y;
                    var o = t.getComponent(cc.RigidBody);
                    t.getComponent("Ball2DControl").isTooSmallV(cc.v2(e.vx, e.vy)) || (o.linearVelocity = cc.v2(e.vx, e.vy));
                  }
    }

    getXiaoQiuHoldeIndex() {
        for (var e, t = null, o = null, n = iterateEntries(CueHelper.ballMgr.entries()); !(e = n()).done;) {
                    var i = e.value,
                      a = (i[0], i[1].getComponent("Ball2DControl"));
                    if (WHITE_BALL_ID == a.ballID) ;else if (!a.isOnDestroy()) {
                      var r = this.getNearestHodeIndexForBall(a.ball3D, a.ballID),
                        l = r.distance,
                        s = r.holeIndex,
                        c = r.weight;
                      if (null != l && null != c && (null == t || c < t)) {
                        t = c;
                        o = s;
                      }
                    }
                  }
                  return o;
    }

    oneCueActionFinish(e: any) {
        var t = this;
                  if (this.isIngame && !this.doOneCueFinished) {
                    this.doOneCueFinished = !0;
                    if (this.editingConditionInfo) {
                      for (var o = !0, n = !1, i = "", a = 0; a < this.oneCueDestroyBalls.length; a++) if (WHITE_BALL_ID == this.oneCueDestroyBalls[a].ballID) {
                        n = !0;
                        i = "母球进洞,";
                        break;
                      }
                      var r = 0,
                        l = this.ganNum,
                        c = void 0;
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
                      if (this.mode == BallLogicMgr.MODE.PVE_Challenge || this.mode == BallLogicMgr.MODE.ME_Editing) this.updateHart(this.ganNum);else if (this.mode == BallLogicMgr.MODE.ME_Free) {
                        BallLogicMgr.freeMode_totalGanNum = BallLogicMgr.freeMode_totalGanNum + 1;
                        this.updateHart(this.ganNum);
                      }
                      if (this.editingConditionInfo) {
                        var _ = this.editingConditionInfo.cdBalls;
                        if (0 == _.length) {
                          console.log("error:condition ball len is 0");
                          o = !1;
                        }
                        for (var f = 0; f < _.length; f++) if (this.checkBallMatIdxInMap(_[f].ballMatIdx)) {
                          console.log("condition fail:find ball matIdx left", _[f].ballMatIdx, _[f], _.length);
                          o = !1;
                          break;
                        }
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
                              var e = {
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
                          if (n) c = this.challangeFail(i, n);else if (o) {
                            console.log("challenge suc!!!");
                            this.stopTimer();
                            var h;
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
                        } else if (this.mode == BallLogicMgr.MODE.ME_Free) if (n) {
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
                      if (this.mode == BallLogicMgr.MODE.ME_Editing || this.mode == BallLogicMgr.MODE.PVE_Challenge || this.mode == BallLogicMgr.MODE.ME_Free) {
                        CueHelper.isShow() || this.getXiaoQiuTarget();
                        if (this._isXiaoQiuStart) {
                          this.doOneCueFinished = !1;
                          this.doXiaoQiuAction();
                        } else {
                          if (n) {
                            this._isXiaoQiuStart = !1;
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
                              var g = Number(ConfigDataSys.global_ConfigMap.get("help_num")) || 1;
                              if (this.ganNum < this.editingConditionInfo.ganNum && this.non_goal_cue_count >= g && !this.is_open_prop) if (PropDataSys.isLinePropUsed) {
                                if (0 == PropDataSys.getPropCount(ConfigDataMgr.ETaiQiuPropType.E_BaiQiu)) {
                                  EngineUtil.showManageViewToast("pkey_006");
                                  PageMgr.showPage("UsePropPage", {
                                    prop_type: ConfigDataMgr.ETaiQiuPropType.E_BaiQiu
                                  });
                                  this.is_open_prop = !0;
                                } else {
                                  EngineUtil.showManageViewToast("pkey_006");
                                  this.is_open_prop = !0;
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
                                  prop_type: ConfigDataMgr.ETaiQiuPropType.E_Line
                                });
                                this.is_open_prop = !0;
                              }
                            } else this.non_goal_cue_count = 0;
                          }
                          var v = this.choseDirToBall();
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

    challangeFail(e: any, t: any) {
        var o = this;
                  if (this.ballMgr.size <= 1) this.doChallangeFail(e);else {
                    if (t && this.ganNum < this.editingConditionInfo.ganNum) return 2;
                    PoolLogger.instance.logGameEvent("thepool_game_table", {
                      object_action: "show",
                      object_name: "table_fail",
                      object_notes: PlayerDataSys.table
                    });
                    PageMgr.showPage("FuHuoPage", {
                      exitCB: function (t: any) {
                        t ? o.fuhuo() : o.doChallangeFail(e);
                      }
                    });
                  }
                  return 1;
    }

    doChallangeFail(e: any) {
        var t = this;
                  e = e || "";
                  this.stopTimer();
                  this.clearTable();
                  this.isIngame = !1;
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
        var e = cc.find("node_condition_title", this.node);
                  e.getChildByName("label_time_title").getComponent(cc.Label).string = "关卡";
                  var t = BallLogicMgr.freeMode_jsonCfg_idx + 1;
                  e.getChildByName("label_time").getComponent(cc.Label).string = t;
    }

    gotoTableEditor() {
        this.destroyAllBall();
                  BallLogicMgr.gotoTableEditor();
    }

    pickUpWhiteBall() {
        this.commboCount = 0;
                  this._xiaoqiuCount = 0;
                  for (var e = BallLogicMgr.editingTableInfo.balls, t = 0; t < e.length; t++) {
                    var o = e[t];
                    o.ballType == BallLogicMgr.BallIDType_White && this.createOneBall(o, !0);
                  }
                  var n = this;
                  this.scheduleOnce(function () {
                    PropDataSys.usePropBaiQiu(!1);
                    this.checkBaiQiuEffect();
                    var e = n.choseDirToBall();
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

    playJinDongEffect(e: any) {
        var t = e.parent.children.indexOf(e);
                  if (t >= 0 && t < this._jinDongEffectArray.length) {
                    var o = this._jinDongEffectArray[t],
                      n = o.getChildByName("jindong").getComponent(sp.Skeleton);
                    o.active = !0;
                    n.setAnimation(0, n.defaultAnimation, !1);
                  }
    }

    oneBallIsStop(e: any, t: any) {
        var o = this;
                  console.log("oneBallIsStop", e, t);
                  for (var n, i = !1, a = iterateEntries(this.ballMgr.entries()); !(n = a()).done;) {
                    var r = n.value[1];
                    if (r.getComponent("Ball2DControl").isOnDeapMoving()) {
                      i = !0;
                      console.log("isMoving", r.getComponent("Ball2DControl").ballID);
                      break;
                    }
                  }
                  this.scheduleOnce(function () {
                    return o.allStopTodo(!i, t);
                  }, .01);
    }

    destroyBall(e: any, t: any, o: any) {
        var n = this;
                  console.log("destroyBall size", this.ballMgr.size, e.getComponent("Ball2DControl").ballID, o);
                  var i = e.getComponent("Ball2DControl").ballID,
                    a = WHITE_BALL_ID == i;
                  if (a) SdkHelper.setVibrator(50);else {
                    if (this.isGuideLevel) {
                      cc.game.emit("GuideEvent_JiQiu");
                      console.log("cc.game.emit GuideEvent_JiQiu");
                      this.lockTouchNode = !1;
                      this.top_guide_touch_block.active = !1;
                      this.bottom_touch_block1.active = !1;
                      this.bottom_touch_block2.active = !1;
                      this.bottom_touch_block3.active = !1;
                    }
                    ++this._xiaoqiuCount;
                    ++this._clearCount;
                    EventMgr.trigger(GameEventType.ON_COMMBO_HIT, ++this.commboCount);
                    var r = !1;
                    if (t) {
                      r = this.checkEnterXiaoQiu(t);
                      this._shouldShowBonusPage = r || this._shouldShowBonusPage;
                    }
                    r ? SdkHelper.setVibrator(150) : SdkHelper.setVibrator(50);
                  }
                  for (var l, c = function () {
                      o ? setTimeout(function () {
                        return n.oneBallIsStop(i, o);
                      }, 1300) : n.oneBallIsStop(i, o);
                    }, u = function () {
                      var i = l.value[0],
                        r = l.value[1];
                      if (r == e) {
                        e.getComponent("Ball2DControl").doDestroyTween(a, t, function () {
                          var l = {
                            ballID: e.getComponent("Ball2DControl").ballID,
                            ballMatIdx: 0
                          };
                          if (a) {
                            l.ballMatIdx = 0;
                            e.getComponent("Ball2DControl").ballWillBeDestroy(!0);
                            e.getComponent("Ball2DControl").ball3D.children[0].getComponent("3D_ballRoll").setShowShadow(!1);
                            e.getComponent("Ball2DControl").stopMove();
                          } else {
                            n.ballMgr.delete(i);
                            e.getComponent("Ball2DControl").ballWillBeDestroy(!1);
                            var u = e.getComponent("Ball2DControl").ball3D.children[0].getComponent("3D_ballRoll");
                            u.shadow_node.parent = null;
                            u.shadow_node.destroy();
                            e.getComponent("Ball2DControl").ball3D.parent = null;
                            e.parent = null;
                            r.getComponent("Ball2DControl").ball3D.destroy();
                            r.destroy();
                            l.ballMatIdx = e.getComponent("Ball2DControl").ball3D.getComponent("BallMaterialComp").getMatIdx();
                          }
                          n.oneCueDestroyBalls.push(l);
                          o && (n._isXiaoQiuStart = !1);
                          t && BallLogicMgr.playSound("pool_ball_in");
                          (n.ballMgr.size <= 1 || !a) && c();
                        });
                        return "break";
                      }
                    }, p = iterateEntries(this.ballMgr.entries()); !(l = p()).done && "break" !== u(););
                  this.ballMgr.size <= 1 && !a && c();
                  a || this.onBallEffect(e);
    }

    loadEditingTableInfo(e: any) {
        console.log("loadEditingTableInfo", e);
                  this.mode = BallLogicMgr.game_mode;
                  console.log("this.mode", this.mode);
                  this.editingTableInfo = util.clone(e);
                  this.editingConditionInfo = e.condition;
                  var t = e.balls;
                  this._isXiaoQiuStart = !1;
                  this.commboCount = 0;
                  this._xiaoqiuCount = 0;
                  this._clearCount = 0;
                  this._xiaoqiuStartHoleIndex = void 0;
                  this._xiaoqiuTargetNode = null;
                  this.cancelXiaoQiuEffect();
                  this._xiaoqiuHoleId = void 0;
                  this.destroyAllBall();
                  this.closeWhiteBallEffect();
                  this.mode == BallLogicMgr.MODE.ME_Editing && MoviePlayer.createNewMV();
                  var o = cc.winSize,
                    n = o.height / o.width,
                    i = cc.find("node_condition_title", this.node);
                  if (i) {
                    n > 1.79 && (i.y = (o.height - 1280) / 2 - 50);
                    this.mode == BallLogicMgr.MODE.ME_Free && this.setTitleFreeMode();
                    this.mode == BallLogicMgr.MODE.PVE_Challenge || this.mode == BallLogicMgr.MODE.ME_Editing || this.mode == BallLogicMgr.MODE.ME_Free ? this.scheduleOnce(function () {
                      i.getComponent("ConditionTitleComp").setCondition(this.editingConditionInfo);
                    }, .1) : i.parent = null;
                  }
                  for (var a = 0; a < t.length; a++) this.createOneBall(t[a]);
                  this.tableIsReset();
                  console.log("game_table loadEditingTableInfo 10");
                  this.initLevelInfo();
                  this.initHart();
    }

    getTotalChallengeSec() {
        var e = 30;
                  if (this.editingConditionInfo && this.editingConditionInfo.ganNum) {
                    var t = this.editingConditionInfo.ganNum - 2;
                    e += 10 * (t = t < 0 ? 0 : t);
                  }
                  return e;
    }

    fuhuo(e: any) {
        PoolLogger.instance.logGameEvent("thepool_game_table", {
                    object_action: "show",
                    object_name: "table_open",
                    object_notes: PlayerDataSys.table
                  });
                  this.levelDataStatis.fuhuo_count++;
                  var t = Number(ConfigDataSys.getFuhuoHeartAddCount()),
                    o = Number(ConfigDataSys.global_ConfigMap.get("line_lv_life"));
                  (e = o - this.ganNum) < 0 && (e = 0);
                  Math.min(t, o - e);
                  (e += t) > o && (e = o);
                  this.ganNum = o - e;
                  this.updateHart(this.ganNum);
                  this.isIngame = !0;
                  this._isXiaoQiuStart = !1;
                  this._xiaoqiuStartHoleIndex = void 0;
                  this._xiaoqiuTargetNode = null;
                  this.commboCount = 0;
                  this._xiaoqiuCount = 0;
                  this.cancelXiaoQiuEffect();
                  this._xiaoqiuHoleId = void 0;
                  for (var n = BallLogicMgr.editingTableInfo.balls, i = 0; i < n.length; i++) {
                    var a = n[i];
                    a.ballType == BallLogicMgr.BallIDType_White && this.createOneBall(a, !0);
                  }
                  var r = this;
                  this.scheduleOnce(function () {
                    var e = r.choseDirToBall();
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

    applyOneCueMV_oneBallMove(e: any) {
        var t = this.ballMgr.get(e.ballID);
                  if (t) {
                    t.x = e.x;
                    t.y = e.y;
                    var o = t.getComponent(cc.RigidBody);
                    t.getComponent("Ball2DControl").isTooSmallV(cc.v2(e.vx, e.vy)) || (o.linearVelocity = cc.v2(e.vx, e.vy));
                  }
    }

    setupWhiteBallEffect(e: any, t: any) {
        console.log("setupWhiteBallEffect", e, t);
                  if (e && t) {
                    this.ball_white;
                    var o = BallLogicMgr.shop_config();
                    if (e >= 0) {
                      var n = o.ball_colors;
                      BallLogicMgr.getBy_cid(e, n);
                    }
                    t >= 0 && (n = o.ball_particles, BallLogicMgr.getBy_cid(t, n));
                  }
    }

    cancelXiaoQiuEffect() {
        if (this._cueXiaoQiuSk) {
                    var e = this._cueXiaoQiuSk;
                    this._cueXiaoQiuSk = null;
                    console.log("hole effect cancelXiaoQiuEffect ---", this._xiaoqiuHoleId);
                    e.setAnimation(0, "dongkou_xiaoshi", !1);
                  }
    }

    clearRay() {
        this.node.getComponent("CircleRayComp").clear();
    }

    getUpVector(e: any, t: any) {
        t.x = e.m04;
                  t.y = e.m05;
                  t.z = e.m06;
                  t.normalizeSelf();
                  console.log("dst", t);
    }

    setAutoPlayingMode(e: any) {
        if (this.isAutoPlaying != e) {
                    this.isAutoPlaying = e;
                    for (var t, o = iterateEntries(this.ballMgr.entries()); !(t = o()).done;) {
                      var n = t.value,
                        i = (n[0], n[1]);
                      i.getComponent(cc.PhysicsCircleCollider).sensor = e;
                      i.getComponent("Ball2DControl").isAutoPlaying = e;
                    }
                    console.log("setAutoPlayingMode", i.getComponent("Ball2DControl").ballID, e);
                  }
    }

    createOneBall(e: any, t: any) {
        void 0 === t && (t = !1);
                  var o = this,
                    n = o.ballParent || o.node;
                  if (o.ballPosNode) {
                    if (e.ballType == BallLogicMgr.BallIDType_Normal) {
                      var i = cc.instantiate(o.ballPosNode);
                      i.parent = o.node;
                      i.x = e.x;
                      i.y = e.y;
                      var a = i.getComponent("Ball2DControl");
                      a.ballID = e.ballID;
                      a.isAutoPlaying = o.isAutoPlaying;
                      a.stopCallback = function (e: any) {
                        o.oneBallIsStop(e);
                      };
                      i.getComponent("Ball2DControl").sensor_value = !1;
                      var r = cc.instantiate(o.ball);
                      n.addChild(r);
                      r.getComponent("BallMaterialComp").setMatIdx(e.ballMatIdx);
                      r.x = e.x;
                      r.y = e.y;
                      if (o.ballPosNode) {
                        var l = r.getChildByName("New Sphere");
                        l.getComponent("3D_ballRoll").pos_node = i;
                        l.getComponent("3D_ballRoll").bind_node_ps = !0;
                        var c = cc.instantiate(o.shadow_prefab);
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
                      var u = o.ball_white_pos_node.getComponent("Ball2DControl");
                      u.ballID = e.ballID;
                      o.ball_white_pos_node.x = e.x;
                      o.ball_white_pos_node.y = e.y;
                      u.sensor_value = !0;
                      var p = o.ball_white_pos_node.getComponent(cc.PhysicsCircleCollider);
                      CueHelper.enabled = u.sensor_value;
                      CueHelper.restitution = this._whiteBallRestitution;
                      u.node.group = "default";
                      u.ball3D.group = "3d";
                      u.ball3D.children.forEach(function (e: any) {
                        e.group = "3d";
                      });
                      u.ball3D.children[0].getComponent("3D_ballRoll").setShowShadow(!0);
                      CueHelper.apply();
                      if (t) {
                        var d = o.getWhiteBallFuHuoP(e);
                        o.ball_white_pos_node.x = DB.x;
                        o.ball_white_pos_node.y = DB.y;
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
                    var e = this._xiaoQiuHoleEffectArray[this._xiaoqiuStartHoleIndex].parent,
                      t = this._cueXiaoQiuSk;
                    this._cueXiaoQiuSk = null;
                    t.setAnimation(0, "jinqiu", !1);
                    this.oneCueXiaoQiuCount++;
                    var o = this._xiaoqiuTargetNode.getComponent("Ball2DControl"),
                      n = o.ball3D;
                    this._xiaoqiuGuiJiEffect.getChildByName("xiaoqiu").active = !1;
                    this._xiaoqiuGuiJiEffect.getChildByName("taiqiu_tuowei").active = !0;
                    this._xiaoqiuGuiJiEffect.x = e.x;
                    this._xiaoqiuGuiJiEffect.y = e.y;
                    this._xiaoqiuGuiJiEffect.active = !0;
                    cc.tween(this._xiaoqiuGuiJiEffect).to(.7, {
                      x: n.x,
                      y: n.y
                    }).call(this.onXiaoQiuEnd.bind(this, o)).start();
                  }
    }

    ballEnterHole(e: any, t: any) {
        this.playJinDongEffect(t);
                  this.destroyBall(e, t);
    }

    reloadEditingTableInfo(e: any) {
        e = e || BallLogicMgr.editingTableInfo;
                  this.loadEditingTableInfo(e);
    }

    setText() {
        
    }

    onXiaoQiuEnd(e: any) {
        this.levelDataStatis.xiaoqiu_count++;
                  PlayerDataSys.xiaoqiuADCount++;
                  BallLogicMgr.playSound("pool_ball_xiao");
                  this._xiaoqiuGuiJiEffect.getChildByName("xiaoqiu").active = !0;
                  this._xiaoqiuGuiJiEffect.getChildByName("xiaoqiu").getComponent(sp.Skeleton).setAnimation(0, "qiuxiaoshi", !1);
                  this.destroyBall(e.node, null, !0);
    }

    update(e: any) {
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
                      var t = this.mv_oneCue_moves[0];
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
        this.oneCueLock = !1;
                  this.isIngame = !0;
                  this.checkBaiQiuEffect();
                  this.mode == BallLogicMgr.MODE.ME_PlayMV ? this.playOneMV_TableFinish() : this.mode != BallLogicMgr.MODE.PVE_Challenge && this.mode != BallLogicMgr.MODE.ME_Editing || this.startTimer();
                  this.mode != BallLogicMgr.MODE.ME_Editing && this.mode != BallLogicMgr.MODE.PVE_Challenge && this.mode != BallLogicMgr.MODE.ME_Free || CueHelper.show();
                  this.editingTableInfo && this.setupWhiteBallEffect(this.editingTableInfo.color, this.editingTableInfo.particle);
                  EventMgr.trigger(GameEventType.HIDE_MAIN_UI_TOUCH_BLOCK, "game-shooting");
    }

    recv_ballInit(e: any) {
        console.log("recv_ballInit", e);
                  var t = this.ballParent || this.node,
                    o = this;
                  if (o.ballPosNode) {
                    var n = cc.instantiate(o.ballPosNode);
                    n.parent = o.node;
                    n.x = e.x;
                    n.y = e.y;
                    n.getComponent("Ball2DControl").ballID = o.ballID;
                    n.getComponent("Ball2DControl").isAutoPlaying = o.isAutoPlaying;
                    n.getComponent("Ball2DControl").stopCallback = function (e: any) {
                      o.oneBallIsStop(e);
                    };
                    n.getComponent("Ball2DControl").sensor_value = !0;
                    var i = cc.instantiate(o.ball);
                    t.addChild(i);
                    i.x = e.x;
                    i.y = e.y;
                    if (o.ballPosNode) {
                      var a = i.getChildByName("New Sphere");
                      a.getComponent("3D_ballRoll").pos_node = n;
                      a.getComponent("3D_ballRoll").bind_node_ps = !0;
                    }
                    n.getComponent("Ball2DControl").ball3D = i;
                    o.ballMgr.set(o.ballID, n);
                    o.ballID = o.ballID + 1;
                  }
    }

    showXiaoQiuHoleEffect() {
        if (null == (e = this.getXiaoQiuHoldeIndex())) for (;;) {
                    var e = EngineUtil.randomInt(0, this._xiaoQiuHoleEffectArray.length - 1);
                    if (null == this._xiaoqiuHoleId || e != this._xiaoqiuHoleId) break;
                  }
                  console.log("hole effect showXiaoQiuHoleEffect ---");
                  this._xiaoqiuHoleId = e;
                  var t = this._xiaoQiuHoleEffectArray[e];
                  t.active = !0;
                  var o = t.getChildByName("xiaoqiu").getComponent(sp.Skeleton);
                  o.setAnimation(0, "dongkou_daiji", !0);
                  this._cueXiaoQiuSk = o;
    }

    reportGameDataStatis(e: any) {
        if (!this.isReportGameDataStatis) {
                    this.isReportGameDataStatis = !0;
                    var t = TimeDataSys.getTimeCuration(!0);
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
        var e = cc.find("bottom_area", this.node);
                  cc.find("node_btn_radBall", e).getComponent("game_btn_radBall").setInfo(this.oneCue_rad_value, this.oneCue_rad_angle);
                  console.log("updateRadBallBtnInfo", this.oneCue_rad_value, this.oneCue_rad_angle);
    }

    updateHart(e: any) {
        e = null != e ? e : this.ganNum;
                  var t = Number(this.heartNumLabel.string);
                  isNaN(t) && (t = 0);
                  var o = Math.max(0, BallLogicMgr.editingTableInfo.condition.ganNum - e),
                    n = this.heartNumLabel.node.parent;
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
        var e = Math.floor(1e3 * (this.rad + Math.PI)),
                    t = cc.find("bottom_area", this.node);
                  cc.find("node_roll", t).getChildByName("roll_scroll").getComponent("RollScrollComp").updateLabel(e);
    }

    onModifyBallMoveToHole(e: any) {
        for (var t = e.moveDir, o = e.ball2DCtrl, n = e.cb, i = o.ball3D, a = cc.v2(i.x, i.y), r = null, l = 0; l < this._xiaoQiuHoleEffectArray.length; l++) {
                    var c = this._xiaoQiuHoleEffectArray[l].parent,
                      u = cc.v2(c.x, c.y).subSelf(a);
                    if (u.angle(t) <= BallLogicMgr.ballDirModifyThreshold) {
                      r = u;
                      break;
                    }
                  }
                  n && n(r);
    }

    initXiaoQiuNode() {
        var e = cc.find("plane_table", this.node).getChildByName("table_layers");
                  this._zhuoDongContainer = e.getChildByName("table").getChildByName("zhuo_pengzhuang_daizi_3d");
                  this._xiaoQiuHoleEffectArray = [];
                  for (var t = 0; t < this._zhuoDongContainer.childrenCount; t++) {
                    var o = cc.instantiate(this.xiaoqiuHoleEffectPreb);
                    o.setParent(this._zhuoDongContainer.children[t]);
                    o.setPosition(cc.Vec2.ZERO);
                    var n = o.getChildByName("xiaoqiu").getComponent(sp.Skeleton);
                    n.setCompleteListener(this.onXiaoQiuEffectComplete.bind(this, o));
                    this._xiaoQiuHoleEffectArray.push(o);
                    o.active = !1;
                  }
                  this._xiaoqiuGuiJiEffect = cc.instantiate(this.xiaoqiuHoleEffectPreb);
                  this._xiaoqiuGuiJiEffect.setParent(this._zhuoDongContainer.parent);
                  this._xiaoqiuGuiJiEffect.active = !1;
                  (n = this._xiaoqiuGuiJiEffect.getChildByName("xiaoqiu").getComponent(sp.Skeleton)).setCompleteListener(this.onXiaoQiuGuiJiEffectComplete.bind(this, this._xiaoqiuGuiJiEffect));
                  this._xiaoqiuGuiJiEffect.getChildByName("xiaoqiu").active = !1;
    }

    getXiaoQiuTarget() {
        var e = !1;
                  if (!this._cueXiaoQiuSk || this._isXiaoQiuStart) return e;
                  var t = this._cueXiaoQiuSk;
                  if (!this._isEnterXiaoQiu) {
                    this._cueXiaoQiuSk = null;
                    t.setAnimation(0, "dongkou_xiaoshi", !1);
                    return e;
                  }
                  console.log("hole effect getXiaoQiuTarget ---", this._xiaoqiuHoleId);
                  if (null != this._xiaoqiuHoleId && null != this._xiaoqiuHoleId) {
                    if (!this.doXiaoQiu(this._xiaoqiuHoleId)) {
                      this._cueXiaoQiuSk = null;
                      t.setAnimation(0, "dongkou_xiaoshi", !1);
                    }
                    e = !0;
                  } else {
                    this._cueXiaoQiuSk = null;
                    t.setAnimation(0, "dongkou_xiaoshi", !1);
                  }
                  this._isEnterXiaoQiu = !1;
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

    doAftOneCueActionFinish(e: any) {
        if (e && this.oneCueLock && !this._isXiaoQiuStart) {
                    this.oneCueLock = !1;
                    this.mode == BallLogicMgr.MODE.ME_PlayMV && this.continueOneMV();
                    this.checkBaiQiuEffect();
                  }
    }

    checkEnterXiaoQiu(e: any) {
        var t = !1;
                  if (!this._cueXiaoQiuSk || this._isXiaoQiuStart) return t;
                  var o = e.parent.children.indexOf(e);
                  if (o > -1) {
                    console.log("hole effect checkEnterXiaoQiu ---", this._xiaoqiuHoleId, o);
                    if (this._xiaoqiuHoleId == o) {
                      this._isEnterXiaoQiu = !0;
                      t = !0;
                    }
                  }
                  return t;
    }

    clearTable() {
        this.oneCueLock = !0;
                  this.destroyAllBall();
    }

    applyRayByRad(e: any, t: any) {
        if (this.isGuideLevel && !this.lockTouchNode && this.top_guide_touch_block.active) {
                    var o = Math.atan2(this.dir.y, this.dir.x);
                    if (o >= -1.929735555 && o <= -1.9222755) {
                      this.lockTouchNode = !0;
                      this.bottom_touch_block3.active = !1;
                      this.applyByRad(-1.9233395);
                      cc.game.emit("GuideEvent_MiaoZhun");
                      console.log("cc.game.emit GuideEvent_MiaoZhun");
                      return;
                    }
                  }
                  var n = e - Math.PI,
                    i = Math.cos(n) * t,
                    a = Math.sin(n) * t,
                    r = this.node.getComponent("CircleRayComp").check_line(this.ball_white_pos_node, this.ballMgr, e, cc.v2(i, a)),
                    l = r.tar_node,
                    s = r.zhexian;
                  this._isAimTarget = !!l;
                  this.ball_white_ball2dCtr.aimTargetUUID = l ? l.uuid : "empty";
                  this.ball_white_ball2dCtr.aimZheXian = s ? BallLogicMgr.normalize() : null;
                  this.updateRadLabel();
    }

    recv_gameStart(e: any) {
        var t = e.myTurn;
                  this.setAutoPlayingMode(1 != t);
                  this.pvpCueLock = 1 != t;
                  this.mode = BallLogicMgr.MODE.PVP_Friend;
                  this.isAutoPlaying ? this.setText("游戏开始，对方球权") : this.setText("游戏开始，你的球权");
                  this.destroyAllBall();
                  for (var o = this.ballParent || this.node, n = this, i = 0; i < 5; i++) if (n.ballPosNode) {
                    var a = 30 * i - 180,
                      r = cc.instantiate(n.ballPosNode);
                    r.parent = n.node;
                    r.x = a;
                    r.y = 100;
                    r.getComponent("Ball2DControl").ballID = n.ballID;
                    r.getComponent("Ball2DControl").isAutoPlaying = n.isAutoPlaying;
                    r.getComponent("Ball2DControl").stopCallback = function (e: any) {
                      n.oneBallIsStop(e);
                    };
                    r.getComponent("Ball2DControl").sensor_value = !0;
                    var l = cc.instantiate(n.ball);
                    o.addChild(l);
                    l.x = a;
                    l.y = 100;
                    if (n.ballPosNode) {
                      var c = l.getChildByName("New Sphere");
                      c.getComponent("3D_ballRoll").pos_node = r;
                      c.getComponent("3D_ballRoll").bind_node_ps = !0;
                    }
                    r.getComponent("Ball2DControl").ball3D = l;
                    n.ballMgr.set(n.ballID, r);
                    n.ballID = n.ballID + 1;
                  }
                  this.resetWhiteBall();
                  GameMgr.setInBattle();
                  this.tableIsReset();
    }

    onShowTopTouchBlock(e: any) {
        this._topTouchBlockHandlerSet.add(e);
                  this.top_touch_block.active = !0;
    }

    recv_enemyHit() {
        this.setText("对方击球了");
                  this.setAutoPlayingMode(!0);
    }

    checkBallMatIdxInMap(e: any) {
        for (var t, o = iterateEntries(this.ballMgr.entries()); !(t = o()).done;) {
                    var n = t.value,
                      i = (n[0], n[1]);
                    if (WHITE_BALL_ID == i.getComponent("Ball2DControl").ballID) ;else if (i.getComponent("Ball2DControl").ball3D.getComponent("BallMaterialComp").getMatIdx() == e) {
                      console.log("find ballID", i.getComponent("Ball2DControl").ballID);
                      return !0;
                    }
                  }
                  return !1;
    }

    updateRecIcon() {
        
    }

    startTimer() {
        cc.find("node_condition_title", this.node);
                  this.do_timer = !0;
                  this.do_timer_sec = 0;
    }

    start() {
        BallLogicMgr.isWin = !1;
    }

    getNearestHodeIndexForBall(e: any) {
        for (var t = null, o = cc.v2(e.x, e.y), n = this.ball_white_pos_node.getComponent("Ball2DControl").ball3D, i = cc.v2(n.x, n.y), a = o.sub(i), r = .04 * a.len(), l = a.len(), s = null, c = 0, u = 0; u < this._xiaoQiuHoleEffectArray.length; u++) {
                    var p = this._xiaoQiuHoleEffectArray[u].parent,
                      d = cc.v2(CueHelper.x, CueHelper.y),
                      _ = cc.v2(CueHelper.x, CueHelper.y).subSelf(o),
                      f = _.angle(a);
                    if (!(this.node.getComponent("CircleRayComp").getLineLen(i, a) < l)) {
                      var h = DB.subSelf(o).len(),
                        g = r + .2 * _.len() + 100 * f;
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

    doXiaoQiu(e: any) {
        if (this.ballMgr.size <= 1) return !1;
                  for (var t = Array.from(this.ballMgr.values()), o = 0;;) {
                    var n = t[EngineUtil.randomInt(0, t.length - 1)],
                      i = n.getComponent("Ball2DControl");
                    if (WHITE_BALL_ID != i.ballID && !i.isOnDeapMoving()) {
                      this._isXiaoQiuStart = !0;
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
                      prop_type: ConfigDataMgr.ETaiQiuPropType.E_Line
                    });
                  }
    }

    onXiaoQiuGuiJiEffectComplete(e: any, t: any) {
        "qiuxiaoshi" == t.animation.name && (e.x = -2e4);
                  t.loop || (e.getChildByName("xiaoqiu").active = !1);
    }

    initHart(e: any) {
        this.heartNumLabel.string = "" + (null != e ? e : BallLogicMgr.editingTableInfo.condition.ganNum);
    }

    updateAimBall() {
        var e = PropDataSys.isLinePropUsed,
                    t = this._aimPower || 0;
                  this._sprite_virtualBall.children[0].active = !e && t >= 1;
                  this._sprite_virtualBall.children[1].active = !e;
                  this._sprite_virtualBall.children[2].active = e;
    }

    CuePosByPower(e: any) {
        e /= CueDataSys.getUsedCuePower();
                  var t,
                    o = Math.min(1, e / .2);
                  this._aimPower = o;
                  this._dirGreen.getComponent("SpriteRayComp").setPowerPercent(o);
                  this.updateAimBall();
                  e > .2 && (t = Math.min(1, e));
                  this._dirYellow.getComponent("SpriteRayComp").setPowerPercent(t);
                  CueHelper.CuePosByPower(e);
    }

    onUseLineProp(e: any) {
        if (CueHelper.isShow()) {
                    this.applyByRad(this.rad);
                    this.updateAimBall();
                  }
                  e && this.levelDataStatis.line_count++;
    }

    addTableNode(e: any) {
        var t = cc.find("plane_table", this.node),
                    o = t.getChildByName("table_layers");
                  o.removeAllChildren(!0);
                  var n = e.getChildByName("plane_table"),
                    i = n.getChildByName("table_layers").getChildByName("table");
                  i.setParent(o);
                  i.setPosition(cc.Vec2.ZERO);
                  var a = t.getChildByName("table_touch");
                  t.removeChild(a, !0);
                  var r = n.getChildByName("table_touch");
                  r.setParent(t);
                  r.setPosition(cc.Vec2.ZERO);
                  var l = cc.find("zhuo_pengzhuang", this.node);
                  l.removeAllChildren(!0);
                  var s = e.getChildByName("zhuo_pengzhuang").getChildByName("pengzhuang_root");
                  BallLogicMgr.setParent(l);
                  BallLogicMgr.setPosition(cc.Vec2.ZERO);
                  var c = i.getChildByName("sprite_table");
                  c && (c.active = !1);
    }

    recv_outRoom() {
        if (this.isInPVPBattle()) {
                    GameMgr.setOutBattle();
                    this.setText("对方逃跑，游戏结束");
                    this.destroyAllBall();
                  }
    }

    tableIsReset() {
        var e = this;
                  this.ganNum = 0;
                  this.answers = [];
                  MoviePlayer.refreshTime = new Date().getTime();
                  this.ticker_start = new Date().getTime();
                  BallLogicMgr.msgCache_balls = [];
                  this.scheduleOnce(function () {
                    var t;
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

    checkBallClicked(e: any, t: any, o: any) {
        void 0 === o && (o = 25);
                  console.log("check touch p(scren p) : " + e);
                  for (var n, i = o, a = null, r = iterateEntries(this.ballMgr.entries()); !(n = r()).done;) {
                    var l = n.value,
                      s = l[0],
                      c = l[1];
                    if (t) {
                      if (s != WHITE_BALL_ID) continue;
                    } else if (s == WHITE_BALL_ID) continue;
                    var u = c.getComponent("Ball2DControl").ball3D,
                      p = u.convertToWorldSpaceAR(cc.Vec3.ZERO),
                      d = this.camera3D.getWorldToScreenPoint(p),
                      _ = cc.v2(DB.x, DB.y),
                      f = cc.Vec2.distance(e, _);
                    if (f <= i) {
                      i = f;
                      a = u;
                    }
                  }
                  return a;
    }

    btn_go(e: any) {
        var t = this;
                  if (!this.oneCueLock && 0 != e) if (this.pvpCueLock) {
                    this.setText("现在是对方击球");
                    console.log("现在是对方击球");
                  } else {
                    EventMgr.trigger(GameEventType.SHOW_MAIN_UI_TOUCH_BLOCK, "game-shooting");
                    this.isGuideLevel && (e = 1);
                    e = e || 1;
                    this.node.getComponent("CircleRayComp").clear();
                    BallLogicMgr.curPowerPercentFlag = e;
                    var o = CueDataSys.getUsedCuePower(),
                      n = GlobalConfig.PowerMin;
                    BallLogicMgr.useSimCueAttri && BallLogicMgr.simCuePower && (o = BallLogicMgr.simCuePower);
                    var i = o * e;
                    (i = Math.floor(i)) <= n && (i = n);
                    i > o && (i = o);
                    var a = Math.floor(1e5 * this.rad);
                    this.mode == BallLogicMgr.MODE.ME_Editing && MoviePlayer.oneCue({
                      rad: a,
                      power: i,
                      radAngle: this.oneCue_rad_angle,
                      radVx: this.oneCue_rad_value.x,
                      radVy: this.oneCue_rad_value.y
                    });
                    var r = this;
                    CueHelper.hideByAni(e, function () {
                      t.levelDataStatis.hit_count++;
                      r.applyByPower(i);
                      r.state = "hitfinish";
                    });
                  }
    }

    onHideTopTouchBlock(e: any) {
        if (this._topTouchBlockHandlerSet.has(e)) {
                    this._topTouchBlockHandlerSet.delete(e);
                    this._topTouchBlockHandlerSet.size < 1 && (this.top_touch_block.active = !1);
                  }
    }

    stopTimer() {
        this.do_timer = !1;
                  this.do_timer_sec = 0;
    }

    getDirToTargetBall() {
        for (var e, t = null, o = null, n = iterateEntries(CueHelper.ballMgr.entries()); !(e = n()).done;) {
                    var i = e.value,
                      a = (i[0], i[1]),
                      r = a.getComponent("Ball2DControl");
                    if (WHITE_BALL_ID == r.ballID) ;else if (!r.isOnDestroy()) {
                      var l = this.getNearestHodeIndexForBall(r.ball3D, r.ballID),
                        s = l.distance,
                        c = (l.holeIndex, l.weight);
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

    doGameSuccess(e: any) {
        void 0 === e && (e = !1);
                  e || PoolLogger.instance.logGameEvent("thepool_game_table", {
                    object_action: "show",
                    object_name: "table_clear",
                    object_notes: PlayerDataSys.table
                  });
                  this.isIngame = !1;
                  this.cancelXiaoQiuEffect();
                  BallLogicMgr.isWin = !0;
                  PageMgr.showPage("GameEndPage", {
                    isSuccess: !0,
                    ballCount: this.ballCount
                  });
                  BallLogicMgr.saveFreeModeFinishIdx();
    }

    onJinDongEffectComplete(e: any) {
        e.active = !1;
    }

    onGMLevelSuccess() {
        this.doGameSuccess(!0);
    }
}
