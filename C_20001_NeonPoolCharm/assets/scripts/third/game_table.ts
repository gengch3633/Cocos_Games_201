// @ts-nocheck
import BallLogicMgr from "./BallLogicMgr";
import CueDataSys from "./CueDataSys";
import PropDataSys from "./PropDataSys";
import CueHelper from "./CueHelper";
import DB from "./DB";
import { GameConfigurations } from "./GameConfigurations";
import GameHelper from "./GameHelper";
import LevelObserver from "./LevelObserver";
import { PoolLogger } from "./PoolLogger";
import ConfigDataSys from "./ConfigDataSys";
import PlayerDataSys from "./PlayerDataSys";
import SystemDataSys from "./SystemDataSys";
import ConfigDataMgr, { ETaiQiuPropType } from "./ConfigDataMgr";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import SdkHelper from "./SdkHelper";
import EngineUtil from "./EngineUtil";
import TimeUtils from "./TimeUtils";
import GameMgr from "./GameMgr";
import GlobalConfig from "./GlobalConfig";
import GuideEvent from "./GuideEvent";
import GuideManager from "./GuideManager";
import GameServiceMgr from "./GameServiceMgr";
import { UiManager } from "./UiManage";
import MoviePlayer from "./MoviePlayer";
import platform from "./platform";
import TimeDataSys from "./TimeDataSys";
import util from "./util";
import PageMgr from "./PageMgr";

const { ccclass, property } = cc._decorator;

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

    @property([cc.Node])
    game_hide_nodes: any = null;
    ballMgr = new Map<any, cc.Node>();
    ball_white_pos_node: cc.Node = null;
    ball_white_ball2dCtr: any = null;
    _whiteBallRestitution = 0;
    oneCueXiaoQiuCount = 0;
    _xiaoQiuConfigCount: number = undefined;
    non_goal_cue_count = 0;
    is_open_prop = false;
    _shouldShowBonusPage = false;
    _waitingForBonusPage = false;
    _topTouchBlockHandlerSet = new Set<any>();
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
    _xiaoqiuCount = 0;
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
    oneCueDestroyBalls: any[] = [];
    oneCueAnswer: any = null;
    oneCue_rad_angle: any = null;
    oneCue_rad_value: any = null;
    oneMV: any = null;
    do_timer: any = null;
    do_timer_sec: any = null;
    do_update: any = null;
    _zhuoDongContainer: cc.Node = null;
    _jinDongEffectArray: cc.Node[] = null;
    _xiaoQiuHoleEffectArray: cc.Node[] = null;
    _xiaoqiuGuiJiEffect: cc.Node = null;
    _cueXiaoQiuSk: sp.Skeleton = null;
    _isEnterXiaoQiu: any = null;
    isReportGameDataStatis: any = null;
    state: string = null;
    progress = 0;
    quat = cc.quat();
    ballCount = 0;
    frame_idx = 0;
    axis: cc.Vec3 = null;
    levelDataStatis: any = null;
    cueRes: cc.Node = null;
    _dirYellow: cc.Node = null;
    _dirGreen: cc.Node = null;
    _sprite_virtualBall: cc.Node = null;
    _slectedWhiteBall = false;
    oneMV_cues_idx = 0;
    mv_oneCue_moves: any[] = [];
    mv_moves_starTimer = -1;

    static _iterate<T>(iterable: Iterable<T>): IterableIterator<T> {
        return iterable[Symbol.iterator]();
    }

    async onLoad(): Promise<void> {
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
            is_success: 0,
        };
        SdkHelper.reportData("enter_level", {
            level_id: PlayerDataSys.user_level,
            level_file: PlayerDataSys.getLevelTableFileName(),
        });
        const tablePrefabPath = "prefabs/tables/table_" + BallLogicMgr.editingTableInfo.tableID;
        const tablePrefab = await UiManager.loaderPrefabInDeepPath(tablePrefabPath);
        if (!tablePrefab) {
            return;
        }
        this.gm_touch.active = !SystemDataSys.online_release;
        ConfigDataSys.getLevelCashNum();
        const tableInstance = cc.instantiate(tablePrefab);
        this.addTableNode(tableInstance);
        let self = this;
        const winSize = cc.winSize;
        if (winSize.height / winSize.width > 2) {
            cc.find("Camera3D", this.node).z *= 1.225;
        }
        GlobalConfig.debug_alpha && (this.node.opacity = 25);
        if (platform.isTT()) {
            self.updateRecIcon();
            BallLogicMgr.initRecord();
            BallLogicMgr.updateRecIcon = () => {
                self.updateRecIcon();
            };
        }
        self = this;
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
        const ball2PosNode = cc.find("node_ball2Pos", this.node);
        const whiteBall2DCtrl = ball2PosNode.getComponent("Ball2DControl");
        this.ball_white_ball2dCtr = whiteBall2DCtrl;
        this._whiteBallRestitution = ball2PosNode.getComponent(cc.PhysicsCircleCollider).restitution;
        this.ball_white_pos_node = ball2PosNode;
        whiteBall2DCtrl.stopCallback = (ballID) => {
            if (!whiteBall2DCtrl.isOnDeapMoving()) {
                setTimeout(() => {
                    self.oneBallIsStop(ballID);
                }, 0.02);
            }
        };
        this.ball_white_pos_node.x = -180;
        this.ball_white_pos_node.y = -180;
        this.ball_white_pos_node.getComponent(cc.RigidBody).syncRotation();
        this.ballMgr.clear();
        this.ball_white_pos_node.getComponent("Ball2DControl").ballID = WHITE_BALL_ID;
        const whiteBall3D = this.ball_white;
        this.ball_white_pos_node.getComponent("Ball2DControl").ball3D = whiteBall3D;
        self.ballMgr.set(WHITE_BALL_ID, this.ball_white_pos_node);
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
        this.ball_click_effect.setCompleteListener(() => {
            self.ball_click_effect.active = false;
        });
        this.ball_click_effect.active = false;
        self.updateAimBall();
        const planeTable = cc.find("plane_table", this.node);
        cc.find("node_btns", this.node);
        self.initJinDongEffect();
        self.initXiaoQiuNode();
        this.cueRes = cc.find("plane_table", this.node).getChildByName("node_cue_container").getChildByName("node_cue2").getChildByName("10522_Pool_Cue_v1_SG");
        UiManager.loadSpine(this.cueRes, "cue_spine", CueDataSys.getCurCueSourceName(), () => {
            self.cueRes.getComponent(sp.Skeleton).setAnimation(0, "animation", true);
        });
        CueHelper.init(this.node, this.ball_white_pos_node, this.ball_white, self.ballMgr);
        console.log("game_table onLoad 9");
        const bottomArea = cc.find("bottom_area", this.node);
        let rollAccum = 1;
        cc.find("node_roll", bottomArea).getChildByName("roll_scroll").getComponent("RollScrollComp").setCallBack((delta) => {
            if (self.checkCanOP()) {
                GlobalConfig.sens_toggle_get();
                const multy = self._isAimTarget ? GlobalConfig.gan_move_roll_multy_aim : GlobalConfig.gan_move_roll_multy;
                rollAccum += (delta *= multy);
                if (Math.abs(rollAccum) > 0.008) {
                    rollAccum = 0;
                    BallLogicMgr.playSound("pool_ruler");
                }
                self.oneRadStep(0, delta);
            }
        });
        cc.find("node_power2", bottomArea).getComponent("PowerBar2Comp").setCallBack((percent) => {
            console.log("percent", percent);
            self.checkCanOP() && self.btn_go(percent);
        });
        cc.find("node_power2", bottomArea).getComponent("PowerBar2Comp").setCallBack_update((percent) => {
            self.checkCanOP() && self.CuePosByPower(100 * percent);
        });
        const bottomAreaBtns = cc.find("bottom_area", this.node);
        cc.find("btn_setting", bottomAreaBtns).on("click", () => {
            console.log("btn_setting", this, self);
            BallLogicMgr.playUIClick();
            PageMgr.showPage("SetPageInGame", {
                exitCB: () => {
                    self.gotoHall();
                },
            });
        });
        const tableTouch = planeTable.getChildByName("table_touch");
        const localBox = tableTouch.getBoundingBox();
        const worldBox = tableTouch.getBoundingBoxToWorld();
        const worldMax = cc.v2(worldBox.xMax, worldBox.yMax);
        const worldMin = cc.v2(worldBox.xMin, worldBox.yMin);
        const screenMax = self.camera3D.getWorldToScreenPoint(worldMax);
        const screenMin = self.camera3D.getWorldToScreenPoint(worldMin);
        const screenW = screenMax.x - screenMin.x;
        const screenH = screenMax.y - screenMin.y;
        const touchRect = new cc.Rect(screenMin.x, screenMin.y, screenW, screenH);
        const screenToTable = (point: cc.Vec2) => {
            const offset = point.sub(touchRect.center);
            const x = (offset.x / (screenW / 2)) * tableTouch.width / 2;
            const y = (offset.y / (screenH / 2)) * tableTouch.height / 2;
            return cc.v2(x, y);
        };
        const colliders: any[] = [];
        if (tableTouch.childrenCount > 0) {
            tableTouch.children.forEach((child) => {
                const poly = child.getComponent(cc.PolygonCollider);
                if (poly) {
                    colliders.push({ type: 1, value: poly.points });
                } else {
                    colliders.push({ type: 0, value: child.getBoundingBox() });
                }
            });
        }
        const colliderCount = colliders.length;
        const pointInPolygon = (point: cc.Vec2, polygon: cc.Vec2[]) => {
            const x = point.x;
            const y = point.y;
            let inside = false;
            for (let a = 0, r = polygon.length - 1; a < polygon.length; r = a++) {
                const xi = polygon[a].x;
                const yi = polygon[a].y;
                const xj = polygon[r].x;
                const yj = polygon[r].y;
                if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
                    inside = !inside;
                }
            }
            return inside;
        };
        const pointInTable = (point: cc.Vec2) => {
            if (colliderCount < 1) {
                return localBox.contains(point);
            }
            for (let t = 0; t < colliderCount; t++) {
                const collider = colliders[t];
                if (collider.type == 0) {
                    if (collider.value.contains(point)) {
                        return true;
                    }
                } else if (pointInPolygon(point, collider.value)) {
                    return true;
                }
            }
            return false;
        };
        let touchMoveLen = 0;
        let whiteDragOffset = cc.v2(0, 0);
        tableTouch.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            if (!event.touch || event.touch.getID() == 0) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                touchMoveLen = 0;
                if (self.checkCanOP() && !self.lockTouchNode) {
                    const localPoint = tableTouch.convertToNodeSpaceAR((event.touch as any)._point);
                    console.log("table_touch start", localPoint.x, localPoint.y);
                    if (PropDataSys.isBaiQiuPropInUse) {
                        const clicked = self.checkBallClicked((event.touch as any)._point, true, GlobalConfig.ball_radius + GlobalConfig.ball_radius);
                        self._slectedWhiteBall = !!clicked;
                        if (self._slectedWhiteBall) {
                            CueHelper.hide();
                            self.node.getComponent("CircleRayComp").clear();
                        }
                        if (clicked) {
                            const tablePoint = screenToTable((event.touch as any)._point);
                            whiteDragOffset = cc.v2(whiteBall3D.x, whiteBall3D.y).subSelf(tablePoint);
                            console.log("touched white ball ");
                        }
                    } else {
                        self._slectedWhiteBall = false;
                    }
                }
            }
        });
        tableTouch.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            if (!event.touch || event.touch.getID() == 0) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                if (self.checkCanOP() && !self.lockTouchNode) {
                    const touch = event.currentTouch;
                    touchMoveLen += (touch as any)._point.sub((touch as any)._prevPoint).len();
                    if (self._slectedWhiteBall) {
                        const tablePoint = screenToTable((event.touch as any)._point).addSelf(whiteDragOffset);
                        const inTable = pointInTable(tablePoint);
                        if (!self.checkBallClicked3D(tablePoint, false, 2 * (GlobalConfig.ball_radius + 1)) && inTable) {
                            self.ball_white_pos_node.position = tablePoint;
                        }
                    } else {
                        const cur = tableTouch.parent.convertToNodeSpaceAR((touch as any)._point);
                        const prev = tableTouch.parent.convertToNodeSpaceAR((touch as any)._prevPoint);
                        const rotateDelta = self.calculateRotationDirection(cur, prev, self.ball_white_pos_node.position) * prev.sub(cur).len();
                        if (rotateDelta != 0) {
                            self.applyByRad(self.rad + rotateDelta / 180 / (self._isAimTarget ? GlobalConfig.gan_move_rad_multy_aim : GlobalConfig.gan_move_rad_multy_normal));
                        }
                    }
                }
            }
        });
        tableTouch.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if (!event.touch || event.touch.getID() == 0) {
                EventMgr.trigger(GameEventType.HIDE_GAMETIP);
                if (self.checkCanOP() && !self.lockTouchNode) {
                    tableTouch.convertToNodeSpaceAR((event.touch as any)._point);
                    if (self._slectedWhiteBall) {
                        const nearBall = self.getNearBallByWhite();
                        CueHelper.show();
                        let aimResult = nearBall ? CueHelper.applyByTargetBall(nearBall) : CueHelper.applyByXY(CueHelper.curApplyXY.x, CueHelper.curApplyXY.y);
                        self.rad = aimResult.rad;
                        self.dir = aimResult.dir;
                        self.applyRayByRad(aimResult.rad, aimResult.len);
                    }
                    self._slectedWhiteBall = false;
                    let clickedBall = false;
                    if (touchMoveLen == 0 || touchMoveLen < 10) {
                        const targetBall = self.checkBallClicked((event.touch as any)._point);
                        if (targetBall) {
                            const aimResult = CueHelper.applyByTargetBall(targetBall);
                            if (aimResult) {
                                self.rad = aimResult.rad;
                                self.dir = aimResult.dir;
                                self.applyRayByRad(aimResult.rad, aimResult.len);
                                self.ball_click_effect.active = true;
                                self.ball_click_effect.node.setPosition(targetBall.getPosition());
                                self.ball_click_effect.setAnimation(0, "animation", false);
                                clickedBall = true;
                                BallLogicMgr.playSound("pool_ball_click");
                            }
                            self.tableResetFinish();
                        }
                        if (!clickedBall) {
                            const tablePoint = screenToTable((event.touch as any)._point);
                            const aimResult = CueHelper.applyByXY(tablePoint.x, tablePoint.y);
                            if (aimResult) {
                                self.rad = aimResult.rad;
                                self.dir = aimResult.dir;
                                self.applyRayByRad(aimResult.rad, aimResult.len);
                            }
                        }
                    }
                    touchMoveLen = 0;
                }
            }
        });
        cc.find("node_btn_radBall", bottomArea).getComponent("game_btn_radBall").setClickCB(() => {
            BallLogicMgr.playUIClick();
            if (self.ui_radPage_Prefab) {
                cc.instantiate(self.ui_radPage_Prefab).getComponent("game_UI_radPage").show(self.node, (radValue, radAngle) => {
                    self.oneCue_rad_value = radValue;
                    self.oneCue_rad_angle = radAngle;
                    self.updateRadBallBtnInfo();
                });
            }
        });
        console.log("game_table onLoad 10");
        this.ballCount = BallLogicMgr.editingTableInfo ? BallLogicMgr.editingTableInfo.balls.length - 1 : 0;
        console.log("球的数量" + this.ballCount);
        this.scheduleOnce(() => {
            if (BallLogicMgr.editingTableInfo) {
                self.loadEditingTableInfo(BallLogicMgr.editingTableInfo);
            }
            if (LevelObserver.instance.logging) {
                LevelObserver.instance.endLog(() => {
                    GameServiceMgr.GmChangeRound(PlayerDataSys.turn_pass + 2, () => {
                        BallLogicMgr.loadTable(PlayerDataSys.turn_pass, PlayerDataSys.table);
                    });
                });
            }
        }, 0.1);
    }

    closeWhiteBallEffect(): void {
        
            this.ball_white;
          
    }

    callback2(e: any): void {
        
            var t = 2*(e.progress-.5),
            o = cc.find("plane_table", this.node);
            console.log("slider target", o);
            this.do_orbit2(o, t);
          
    }

    allStopTodo(e: any, t: any): void {
        
            var o,
            n = this;
            if(this.isAutoPlaying) {
              if(e) {
                this.pvpCueLock = ! 1;
                this.setAutoPlayingMode(! 1);
                this.state = "moviefinish";
              }
              console.log("播放对方动作全部结束");
            } else if(e&& ! this._waitingForBonusPage) {
              console.log("己方动作全部结束");
              if(this._shouldShowBonusPage&& (t|| this.ballMgr.size <= 1)) {
                this._shouldShowBonusPage = ! 1;
                this._waitingForBonusPage = ! 0;
                if(PlayerDataSys.level_info.level_a >= GameConfigurations.customConfig.startLevelForClearAward) null === (o = GameHelper.frameSDK)|| undefined === o|| o.openABAward(function() {
                  n._waitingForBonusPage = ! 1;
                  n.oneCueActionFinish(t);
                }
        );
                else {
                  this._waitingForBonusPage = ! 1;
                  this.oneCueActionFinish(t);
                }
              } else this.oneCueActionFinish(t);
            }
            this.doAftOneCueActionFinish(e);
          
    }

    oneCueFinish(): void {
        
            this.oneCueLock = ! 0;
            this.doOneCueFinished = ! 1;
            this.CuePosByPower(0);
            CueHelper.hide();
            PropDataSys.propUsedComplete(ETaiQiuPropType.E_BaiQiu);
            this.oneCue_rad_angle = 0;
            this.oneCue_rad_value = cc.v2(0, 0);
            this.updateRadBallBtnInfo();
          
    }

    checkBaiQiuEffect(): void {
        
            this.ball_white_ball2dCtr.showBaiQiuEffect(PropDataSys.isBaiQiuPropInUse&& ! this.oneCueLock);
          
    }

    continueOneMV(): void {
        
            console.log("do continueOneMV");
            if(this.oneMV) {
              this.oneMV_cues_idx = this.oneMV_cues_idx+ 1;
              this.playOneMV(this.oneMV);
            }
          
    }

    onBallEffect(e: any): void {
        
            var t,
            o = GameConfigurations.customConfig.bonusPerBall;
            Array.isArray(o)&& (o = 2+ Math.floor(Math.random()*(o[1]- o[0]+ 1)));
            null === (t = GameHelper.frameSDK)|| undefined === t|| t.addBitCoin(o, 0, 0, e.convertToWorldSpaceAR(cc.Vec2.ZERO));
          
    }

    gotoHall(): void {
        
            this.destroyAllBall();
            BallLogicMgr.gotoHall();
          
    }

    onXiaoQiuEffectComplete(e: any, t: any): void {
        
            t.loop|| (e.active = ! 1);
          
    }

    applyByRad(e: any): void {
        
            this.circle_target;
            this.rad = e;
            this.rad = Math.floor(1e5* this.rad)/ 1e5;
            var t = CueHelper.applyByRad(e);
            this.dir = t.dir;
            var o = t.len;
            this.applyRayByRad(e, o);
          
    }

    getWhiteBallFuHuoP(e: any): void {
        
            for(var t, o = 2*(GlobalConfig.ball_radius+ 3), n = GameTable._iterate(this.ballMgr.entries());
        !(t = n()).done;
        ) {
              var i = t.value,
              a = i[0],
              r = i[1];
              if(a != WHITE_BALL_ID) {
                var l = r.getComponent("Ball2DControl").ball3D,
                s = cc.v2(l.x, l.y),
                c = cc.v2(e.x, e.y).sub(s);
                console.log("getWhiteBallFuHuoP minLen", o);
                if(c.len() < o) {
                  0 == c.len()&& (c = cc.v2(1, 0).rotateSelf(EngineUtil.random(0, Math.PI)));
                  e = s.add(c.normalizeSelf().mulSelf(o));
                  return this.getWhiteBallFuHuoP(e);
                }
              }
            }
            return e;
          
    }

    whiteBallIsDestroyed(): void {
        
          
    }

    onSlider(e: any): void {
        
            this.oneRadStep(2*(e.progress-.5));
          
    }

    isInPVPBattle(): void {
        
            return ! 1;
          
    }

    getNearBallByWhite(): void {
        
            for(var e, t = this.ball_white_pos_node.position, o = 0, n = null, i = GameTable._iterate(this.ballMgr.entries());
        !(e = i()).done;
        ) {
              var a = e.value,
              r = (a[0], a[1]),
              l = r.getComponent("Ball2DControl");
              if(WHITE_BALL_ID == l.ballID);
              else if(! l.isOnDestroy()) {
                var s = t.sub(r.position).len();
                if(! n|| o > s) {
                  o = s;
                  n = r;
                }
              }
            }
            return n;
          
    }

    gotoInfoList(): void {
        
            this.destroyAllBall();
            BallLogicMgr.gotoInfoList();
          
    }

    calculateRotationDirection(e: any, t: any, o: any): void {
        
            var n = e.x- t.x,
            i = e.y- t.y;
            return n*(t.y- o.y)- i*(t.x- o.x) > 0?- 1: 1;
          
    }

    updateTimer(): void {
        
            var e = cc.find("node_condition_title", this.node);
            if(e) {
              var t = e.getChildByName("label_time"),
              o = Math.floor(this.do_timer_sec),
              n = this.getTotalChallengeSec();
              t.getComponent(cc.Label).string = o+ "/"+ n+ "s";
              if(o >= n) {
                this.stopTimer();
                this.mode != BallLogicMgr.MODE.PVE_Challenge&& this.mode != BallLogicMgr.MODE.ME_Editing|| this.challangeFail("超时了，");
              }
            }
          
    }

    destroyAllBall(): void {
        
            for(var e, t = GameTable._iterate(this.ballMgr.entries());
        !(e = t()).done;
        ) {
              var o = e.value,
              n = o[0],
              i = o[1];
              if(WHITE_BALL_ID == i.getComponent("Ball2DControl").ballID) i.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
              else {
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

    playOneMV_TableFinish(): void {
        
          
    }

    onPropUsedStateChanged(e: any): void {
        
            var t = e.prop_type,
            o = e.state,
            n = e.isUsedProp;
            if(t == ETaiQiuPropType.E_BaiQiu) {
              1 == o&& n&& this.levelDataStatis.baiqiu_count++;
              this.checkBaiQiuEffect();
            }
          
    }

    oneRadStep(e: any, t: any): void {
        
            if(! this.lockTouchNode) {
              t = t|| 0;
              cc.v3(0, 0, 1);
              var o = 0;
              if(0 != t) o = this.rad+ t;
              else {
                if(0 == e) return;
                o = Math.PI* e;
              }
              this.applyByRad(o);
            }
          
    }

    playOneMV(e: any): void {
        
            if(e) {
              this.oneMV = e;
              this.oneMV_cues_idx = this.oneMV_cues_idx|| 0;
              BallLogicMgr.game_mode = BallLogicMgr.MODE.ME_PlayMV;
              this.setAutoPlayingMode(! 0);
              0 == this.oneMV_cues_idx? this.reloadEditingTableInfo(): this.playOneMV_TableFinish();
            }
          
    }

    onEnable(): void {
        
            var e = this;
            this.addEventListener();
            if(! LevelObserver.instance.logging) {
              EventMgr.trigger(GameEventType.SHOW_MAIN_UI_TOUCH_BLOCK, "game-initing");
              this._waitingForBonusPage = ! 1;
              PoolLogger.PoolLogger.instance.logGameEvent("thepool_game_table", {
                object_action: "show", object_name: "table_open", object_notes: PlayerDataSys.table
              }
        );
              new Promise(function(e) {
                GameHelper.frameSDK? GameHelper.frameSDK.beforeGameLevelStart(PlayerDataSys.level_info.level_a, PlayerDataSys.level_info.level_b, undefined, function() {
                  return e();
                }
        ): e();
              }
        ).then(function() {
                if(e.ballCount >= GameConfigurations.customConfig.minBallNumberForPropHint&& ! e.isGuideLevel&& PropDataSys.isLinePropUseable) {
                  EngineUtil.showManageViewToast("pkey_006");
                  PageMgr.showPage("UsePropPage", {
                    prop_type: ETaiQiuPropType.E_Line
                  }
        );
                } else GuideManager.Instance.emit(GuideEvent.StartGame);
                EventMgr.trigger(GameEventType.HIDE_MAIN_UI_TOUCH_BLOCK, "game-initing");
              }
        );
            }
          
    }

    recv_ballDestroy(e: any): void {
        
            for(var t, o = e.ballID, n = GameTable._iterate(this.ballMgr.entries());
        !(t = n()).done;
        ) {
              var i = t.value,
              a = i[0],
              r = i[1];
              if(r.getComponent("Ball2DControl").ballID == o) {
                if(WHITE_BALL_ID == r.getComponent("Ball2DControl").ballID) this.resetWhiteBall();
                else {
                  this.ballMgr.delete(a);
                  console.log("destroyBall idx", r.getComponent("Ball2DControl").ballID);
                  r.getComponent("Ball2DControl").ball3D.parent = null;
                  r.parent = null;
                }
                break;
              }
            }
          
    }

    choseDirToBall(): void {
        
            var e = this.getDirToTargetBall();
            return e? CueHelper.applyByTargetBall(e): CueHelper.randomDirToBall();
          
    }

    checkBallClicked3D(e: any, t: any, o: any): void {
        
            undefined === o&& (o = 2* GlobalConfig.ball_radius);
            for(var n, i = o, a = null, r = GameTable._iterate(this.ballMgr.entries());
        !(n = r()).done;
        ) {
              var l = n.value,
              s = l[0],
              c = l[1];
              if(t) {
                if(s != WHITE_BALL_ID) continue;
              } else if(s == WHITE_BALL_ID) continue;
              var u = c.getComponent("Ball2DControl").ball3D,
              p = cc.Vec2.distance(cc.v2(u.x, u.y), e);
              if(p <= i) {
                i = p;
                a = u;
              }
            }
            return a;
          
    }

    do_orbit2(e: any, t: any): void {
        
            var o = e,
            n = new cc.Mat4();
            n = o.getWorldRotation(n);
            var i = cc.v3(0, 0, 0),
            a = new cc.Mat4();
            a = o.getWorldMatrix(a);
            this.getUpVector(a, i);
            var r = i;
            r = r.normalizeSelf();
            var l = Math.PI* t*.1;
            l = this.rad+ l;
            cc.Quat.rotateAround(n, n, r, l);
            o.setRotation(n);
          
    }

    onDisable(): void {
        
            this.removeEventListener();
            PropDataSys.propUsedComplete(ETaiQiuPropType.E_BaiQiu);
          
    }

    applyByPower(e: any): void {
        
            var t = - Math.cos(this.oneCue_rad_angle* DEG_TO_RAD)* e,
            o = Math.sin(this.oneCue_rad_angle* DEG_TO_RAD)* e,
            n = this.ball_white.getChildByName("New Sphere").getComponent("3D_ballRoll").pos_node;
            this.isAutoPlaying|| n.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(this.dir.x* t, this.dir.y* t), cc.v2(0, 0), ! 0);
            n.getComponent("Ball2DControl").setRadMove(this.oneCue_rad_value, o);
            this.oneCueDestroyBalls.length = 0;
            var i = Math.floor(100* this.rad);
            this.oneCueAnswer = BallLogicMgr.pack_answer(i, e);
            var a = cc.find("node_condition_title", this.node);
            this.mode == BallLogicMgr.MODE.PVE_Challenge|| this.mode == BallLogicMgr.MODE.ME_Editing? a.getComponent("ConditionTitleComp").updateGunNum(this.ganNum): this.mode == BallLogicMgr.MODE.ME_Free&& (BallLogicMgr.freeMode_totalGanNum = BallLogicMgr.freeMode_totalGanNum+ 1);
            this.oneCueFinish();
          
    }

    checkCanOP(): void {
        
            return this.mode != BallLogicMgr.MODE.PVP_Friend&& ! this.oneCueLock;
          
    }

    initJinDongEffect(): void {
        
            var e = cc.find("plane_table", this.node).getChildByName("table_layers");
            this._zhuoDongContainer = e.getChildByName("table").getChildByName("zhuo_pengzhuang_daizi_3d");
            this._jinDongEffectArray = [];
            for(var t = 0;
            t < this._zhuoDongContainer.childrenCount;
            t++) {
              var o = cc.instantiate(this.jinDongEffectPreb);
              o.setParent(this._zhuoDongContainer.children[t]);
              o.setPosition(cc.Vec2.ZERO);
              o.getChildByName("jindong").getComponent(sp.Skeleton).setCompleteListener(this.onJinDongEffectComplete.bind(this, o));
              this._jinDongEffectArray.push(o);
              o.active = ! 1;
            }
          
    }

    playOneMV_moves(e: any): void {
        
            if(e&& e.length > 0) {
              this.mv_oneCue_moves = e;
              this.mv_moves_starTimer = e[0].time;
            }
          
    }

    recv_ballMove(e: any): void {
        
            var t = this.ballMgr.get(e.ballID);
            if(t) {
              t.x = e.x;
              t.y = e.y;
              var o = t.getComponent(cc.RigidBody);
              t.getComponent("Ball2DControl").isTooSmallV(cc.v2(e.vx, e.vy))|| (o.linearVelocity = cc.v2(e.vx, e.vy));
            }
          
    }

    getXiaoQiuHoldeIndex(): void {
        
            for(var e, t = null, o = null, n = GameTable._iterate(CueHelper.ballMgr.entries());
        !(e = n()).done;
        ) {
              var i = e.value,
              a = (i[0], i[1].getComponent("Ball2DControl"));
              if(WHITE_BALL_ID == a.ballID);
              else if(! a.isOnDestroy()) {
                var r = this.getNearestHodeIndexForBall(a.ball3D, a.ballID),
                l = r.distance,
                s = r.holeIndex,
                c = r.weight;
                if(null != l&& null != c&& (null == t|| c < t)) {
                  t = c;
                  o = s;
                }
              }
            }
            return o;
          
    }

    oneCueActionFinish(e: any): void {
        
            var t = this;
            if(this.isIngame&& ! this.doOneCueFinished) {
              this.doOneCueFinished = ! 0;
              if(this.editingConditionInfo) {
                for(var o = ! 0, n = ! 1, i = "", a = 0;
                a < this.oneCueDestroyBalls.length;
                a++) if(WHITE_BALL_ID == this.oneCueDestroyBalls[a].ballID) {
                  n = ! 0;
                  i = "母球进洞,";
                  break;
                }
                var r = 0,
                l = this.ganNum,
                c = undefined;
                if(e) {
                  r = this.oneCueDestroyBalls.length;
                  n&& r--;
                } else {
                  this.ganNum = this.ganNum+(n? 2: 1);
                  r = this.oneCueDestroyBalls.length;
                  n&& r--;
                  r > 0? this.ganNum = Math.max(0, this.ganNum- 1): this.cancelXiaoQiuEffect();
                  if(this.ganNum > l) {
                    BallLogicMgr.playSound(n? "pool_heart2": "pool_heart1");
                    this.levelDataStatis.heart_lost+= this.ganNum- l;
                  }
                }
                if(this.mode == BallLogicMgr.MODE.PVE_Challenge|| this.mode == BallLogicMgr.MODE.ME_Editing) this.updateHart(this.ganNum);
                else if(this.mode == BallLogicMgr.MODE.ME_Free) {
                  BallLogicMgr.freeMode_totalGanNum = BallLogicMgr.freeMode_totalGanNum+ 1;
                  this.updateHart(this.ganNum);
                }
                if(this.editingConditionInfo) {
                  var _ = this.editingConditionInfo.cdBalls;
                  if(0 == _.length) {
                    console.log("error:condition ball len is 0");
                    o = ! 1;
                  }
                  for(var f = 0;
                  f < _.length;
                  f++) if(this.checkBallMatIdxInMap(_[f].ballMatIdx)) {
                    console.log("condition fail:find ball matIdx left", _[f].ballMatIdx, _[f], _.length);
                    o = ! 1;
                    break;
                  }
                  if(this.mode == BallLogicMgr.MODE.ME_Editing) {
                    if(n) {
                      this.stopTimer();
        (h = cc.instantiate(this.ui_alert_Prefab)).parent = this.node;
                      h.getComponent("game_UI_alert").show(i+ "失败！是否重试一次？", function() {
                        t.reloadEditingTableInfo();
                      }
        , function() {
                        t.gotoTableEditor();
                      }
        , "重试", "返回");
                    } else if(o) {
                      console.log("condition suc!!!");
                      this.stopTimer();
        (h = cc.instantiate(this.ui_alert_Prefab)).parent = this.node;
                      h.getComponent("game_UI_alert").show("尝试成功，你编辑的关卡将要进行保存！", function() {
                        console.log("save win32", typeof t.editingTableInfo);
                        var e = {
                          tableInfo: t.editingTableInfo, mv: MoviePlayer.uncompress(MoviePlayer.compress()), mvCompress: 0, time: util.formatDateTime(new Date())
                        }
        ;
                        util.save2(e, e.time);
                        BallLogicMgr.gotoInfoList();
                      }
        , function() {
                        t.gotoTableEditor();
                      }
        , "好的", "返回", "挑战成功");
                    } else if(this.ganNum >= this.editingConditionInfo.ganNum) {
                      console.log("condition fail:ganNum is 0,but never acheive");
                      this.stopTimer();
                      this.failedNum = this.failedNum+ 1;
                      if(this.failedNum < BallLogicMgr.editingTryMaxNum) {
        (h = cc.instantiate(this.ui_alert_Prefab)).parent = this.node;
                        h.getComponent("game_UI_alert").show("失败！是否重试一次？", function() {
                          t.reloadEditingTableInfo();
                        }
        , function() {
                          t.gotoTableEditor();
                        }
        , "重试", "返回", "挑战失败");
                      } else {
        (h = cc.instantiate(this.ui_alert_Prefab)).parent = this.node;
                        h.getComponent("game_UI_alert").show("失败太多次了，建议重新编辑关卡！", function() {
                          t.gotoTableEditor();
                        }
        , function() {
                          t.gotoTableEditor();
                        }
        );
                      }
                    }
                  } else if(this.mode == BallLogicMgr.MODE.PVE_Challenge) {
                    if(n) c = this.challangeFail(i, n);
                    else if(o) {
                      console.log("challenge suc!!!");
                      this.stopTimer();
                      var h;
        (h = cc.instantiate(this.ui_alert_Prefab)).parent = this.node;
                      h.getComponent("game_UI_alert").show("恭喜，挑战成功！", function() {
                        t.gotoInfoList();
                      }
        , function() {
                        t.gotoInfoList();
                      }
        , "好的", "返回", "挑战成功");
                      DB.updateOnePublicTableInfo(BallLogicMgr.challenging_publictableInfo, "totalNum", BallLogicMgr.pack_WinInfo(this.do_timer_sec), function() {
                      }
        );
                    } else if(this.ganNum >= this.editingConditionInfo.ganNum) {
                      console.log("challenge fail:ganNum is 0,but never acheive");
                      c = this.challangeFail(i, n);
                    }
                  } else if(this.mode == BallLogicMgr.MODE.ME_Free) if(n) {
                    if(this.ballMgr.size <= 1&& this.ganNum < this.editingConditionInfo.ganNum) {
                      if(! BallLogicMgr.isWin) {
                        console.log("challenge suc!!!");
                        this.stopTimer();
                        this.doGameSuccess();
                      }
                    } else c = this.challangeFail(i, n);
                  } else if(o) {
                    if(this.ballMgr.size < 2) {
                      console.log("challenge suc!!!");
                      this.stopTimer();
                      this.doGameSuccess();
                    } else if(this.ganNum >= this.editingConditionInfo.ganNum) {
                      console.log("challenge fail:ganNum is 0,but never acheive");
                      c = this.challangeFail(i, n);
                    }
                  } else if(this.ganNum >= this.editingConditionInfo.ganNum) {
                    console.log("challenge fail:ganNum is 0,but never acheive");
                    c = this.challangeFail(i, n);
                  }
                }
                if(this.mode == BallLogicMgr.MODE.ME_Editing|| this.mode == BallLogicMgr.MODE.PVE_Challenge|| this.mode == BallLogicMgr.MODE.ME_Free) {
                  CueHelper.isShow()|| this.getXiaoQiuTarget();
                  if(this._isXiaoQiuStart) {
                    this.doOneCueFinished = ! 1;
                    this.doXiaoQiuAction();
                  } else {
                    if(n) {
                      this._isXiaoQiuStart = ! 1;
                      this.cancelXiaoQiuEffect();
                    }
                    if(this.oneCueDestroyBalls.length < 1|| n) {
                      this.commboCount = 0;
                      this._xiaoqiuCount = 0;
                      EventMgr.trigger(GameEventType.ON_COMMBO_HIT, this.commboCount);
                    }
                    if(! CueHelper.isShow()) {
                      n&& 2 == c&& this.pickUpWhiteBall();
                      r- this.oneCueXiaoQiuCount > 1&& ! n&& EventMgr.trigger(GameEventType.ON_MULTY_GOAL, r);
                      this.oneCueXiaoQiuCount = 0;
                      this._xiaoQiuConfigCount|| (this._xiaoQiuConfigCount = Number(ConfigDataSys.global_ConfigMap.get("lv_killball_num")));
                      this._xiaoqiuCount >= this._xiaoQiuConfigCount&& ! n&& this.ballMgr.size > 1&& this.showXiaoQiuHoleEffect();
                      CueHelper.show();
                      EventMgr.trigger(GameEventType.HIDE_MAIN_UI_TOUCH_BLOCK, "game-shooting");
                      if(r < 1) {
                        this.non_goal_cue_count++;
                        console.log("第几个球没进", this.non_goal_cue_count, this.is_open_prop, this.ganNum < this.editingConditionInfo.ganNum);
                        var g = Number(ConfigDataSys.global_ConfigMap.get("help_num"))|| 1;
                        if(this.ganNum < this.editingConditionInfo.ganNum&& this.non_goal_cue_count >= g&& ! this.is_open_prop) if(PropDataSys.isLinePropUsed) {
                          if(0 == PropDataSys.getPropCount(ETaiQiuPropType.E_BaiQiu)) {
                            EngineUtil.showManageViewToast("pkey_006");
                            PageMgr.showPage("UsePropPage", {
                              prop_type: ETaiQiuPropType.E_BaiQiu
                            }
        );
                            this.is_open_prop = ! 0;
                          } else {
                            EngineUtil.showManageViewToast("pkey_006");
                            this.is_open_prop = ! 0;
                            this.moveCueBallPropNode.scale = 1;
                            cc.Tween.stopAllByTarget(this.moveCueBallPropNode);
                            cc.tween(this.moveCueBallPropNode).to(.3, {
                              scale: 1.2
                            }
        , {
                              easing: "sineIn"
                            }
        ).to(.15, {
                              scale: 1
                            }
        ).to(.3, {
                              scale: 1.2
                            }
        , {
                              easing: "sineIn"
                            }
        ).to(.15, {
                              scale: 1
                            }
        ).delay(.8).union().repeat(2).start();
                          }
                        } else {
                          EngineUtil.showManageViewToast("pkey_006");
                          PageMgr.showPage("UsePropPage", {
                            prop_type: ETaiQiuPropType.E_Line
                          }
        );
                          this.is_open_prop = ! 0;
                        }
                      } else this.non_goal_cue_count = 0;
                    }
                    var v = this.choseDirToBall();
                    if(v) {
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

    challangeFail(e: any, t: any): void {
        
            var o = this;
            if(this.ballMgr.size <= 1) this.doChallangeFail(e);
            else {
              if(t&& this.ganNum < this.editingConditionInfo.ganNum) return 2;
              PoolLogger.PoolLogger.instance.logGameEvent("thepool_game_table", {
                object_action: "show", object_name: "table_fail", object_notes: PlayerDataSys.table
              }
        );
              PageMgr.showPage("FuHuoPage", {
                exitCB: function(t) {
                  t? o.fuhuo(): o.doChallangeFail(e);
                }
              }
        );
            }
            return 1;
          
    }

    doChallangeFail(e: any): void {
        
            var t = this;
            e = e|| "";
            this.stopTimer();
            this.clearTable();
            this.isIngame = ! 1;
            this.failedNum = this.failedNum+ 1;
            this.mode != BallLogicMgr.MODE.ME_Free&& this.mode != BallLogicMgr.MODE.ME_Editing&& DB.updateOnePublicTableInfo(BallLogicMgr.challenging_publictableInfo, "totalNum", 0, function() {
            }
        );
            this.reportGameDataStatis();
            PoolLogger.PoolLogger.instance.logGameEvent("thepool_game_table", {
              object_action: "show", object_name: "table_fail", object_notes: PlayerDataSys.table
            }
        );
            setTimeout(function() {
              PageMgr.showPage("GameEndPage", {
                timeoutCB: function() {
                  return t.failAndGoBack();
                }
              }
        );
            }
        , 200);
          
    }

    setTitleFreeMode(): void {
        
            var e = cc.find("node_condition_title", this.node);
            e.getChildByName("label_time_title").getComponent(cc.Label).string = "关卡";
            var t = BallLogicMgr.freeMode_jsonCfg_idx+ 1;
            e.getChildByName("label_time").getComponent(cc.Label).string = t;
          
    }

    gotoTableEditor(): void {
        
            this.destroyAllBall();
            BallLogicMgr.gotoTableEditor();
          
    }

    pickUpWhiteBall(): void {
        
            this.commboCount = 0;
            this._xiaoqiuCount = 0;
            for(var e = BallLogicMgr.editingTableInfo.balls, t = 0;
            t < e.length;
            t++) {
              var o = e[t];
              o.ballType == BallLogicMgr.BallIDType_White&& this.createOneBall(o, ! 0);
            }
            var n = this;
            this.scheduleOnce(function() {
              PropDataSys.usePropBaiQiu(! 1);
              this.checkBaiQiuEffect();
              var e = n.choseDirToBall();
              if(e) {
                n.rad = e.rad;
                n.dir = e.dir;
                n.applyRayByRad(e.rad, e.len);
              } else {
                CueHelper.hide();
                this.node.getComponent("CircleRayComp").clear();
              }
              n.tableResetFinish();
            }
        , .01);
          
    }

    playJinDongEffect(e: any): void {
        
            var t = e.parent.children.indexOf(e);
            if(t >= 0&& t < this._jinDongEffectArray.length) {
              var o = this._jinDongEffectArray[t],
              n = o.getChildByName("jindong").getComponent(sp.Skeleton);
              o.active = ! 0;
              n.setAnimation(0, n.defaultAnimation, ! 1);
            }
          
    }

    oneBallIsStop(e: any, t: any): void {
        
            var o = this;
            console.log("oneBallIsStop", e, t);
            for(var n, i = ! 1, a = GameTable._iterate(this.ballMgr.entries());
        !(n = a()).done;
        ) {
              var r = n.value[1];
              if(r.getComponent("Ball2DControl").isOnDeapMoving()) {
                i = ! 0;
                console.log("isMoving", r.getComponent("Ball2DControl").ballID);
                break;
              }
            }
            this.scheduleOnce(function() {
              return o.allStopTodo(! i, t);
            }
        , .01);
          
    }

    destroyBall(e: any, t: any, o: any): void {
        
            var n = this;
            console.log("destroyBall size", this.ballMgr.size, e.getComponent("Ball2DControl").ballID, o);
            var i = e.getComponent("Ball2DControl").ballID,
            a = WHITE_BALL_ID == i;
            if(a) SdkHelper.setVibrator(50);
            else {
              if(this.isGuideLevel) {
                cc.game.emit("GuideEvent_JiQiu");
                console.log("cc.game.emit GuideEvent_JiQiu");
                this.lockTouchNode = ! 1;
                this.top_guide_touch_block.active = ! 1;
                this.bottom_touch_block1.active = ! 1;
                this.bottom_touch_block2.active = ! 1;
                this.bottom_touch_block3.active = ! 1;
              }
        ++ this._xiaoqiuCount;
        ++ this._clearCount;
              EventMgr.trigger(GameEventType.ON_COMMBO_HIT, ++ this.commboCount);
              var r = ! 1;
              if(t) {
                r = this.checkEnterXiaoQiu(t);
                this._shouldShowBonusPage = r|| this._shouldShowBonusPage;
              }
              r? SdkHelper.setVibrator(150): SdkHelper.setVibrator(50);
            }
            for(var l, c = function() {
              o? setTimeout(function() {
                return n.oneBallIsStop(i, o);
              }
        , 1300): n.oneBallIsStop(i, o);
            }
        , u = function() {
              var i = l.value[0], r = l.value[1];
              if(r == e) {
                e.getComponent("Ball2DControl").doDestroyTween(a, t, function() {
                  var l = {
                    ballID: e.getComponent("Ball2DControl").ballID, ballMatIdx: 0
                  }
        ;
                  if(a) {
                    l.ballMatIdx = 0;
                    e.getComponent("Ball2DControl").ballWillBeDestroy(! 0);
                    e.getComponent("Ball2DControl").ball3D.children[0].getComponent("3D_ballRoll").setShowShadow(! 1);
                    e.getComponent("Ball2DControl").stopMove();
                  } else {
                    n.ballMgr.delete(i);
                    e.getComponent("Ball2DControl").ballWillBeDestroy(! 1);
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
                  o&& (n._isXiaoQiuStart = ! 1);
                  t&& BallLogicMgr.playSound("pool_ball_in");
        (n.ballMgr.size <= 1|| ! a)&& c();
                }
        );
                return "break";
              }
            }
        , p = GameTable._iterate(this.ballMgr.entries());
        !(l = p()).done&& "break" !== u();
        );
            this.ballMgr.size <= 1&& ! a&& c();
            a|| this.onBallEffect(e);
          
    }

    loadEditingTableInfo(e: any): void {
        
            console.log("loadEditingTableInfo", e);
            this.mode = BallLogicMgr.game_mode;
            console.log("this.mode", this.mode);
            this.editingTableInfo = util.clone(e);
            this.editingConditionInfo = e.condition;
            var t = e.balls;
            this._isXiaoQiuStart = ! 1;
            this.commboCount = 0;
            this._xiaoqiuCount = 0;
            this._clearCount = 0;
            this._xiaoqiuStartHoleIndex = undefined;
            this._xiaoqiuTargetNode = null;
            this.cancelXiaoQiuEffect();
            this._xiaoqiuHoleId = undefined;
            this.destroyAllBall();
            this.closeWhiteBallEffect();
            this.mode == BallLogicMgr.MODE.ME_Editing&& MoviePlayer.createNewMV();
            var o = cc.winSize,
            n = o.height/ o.width,
            i = cc.find("node_condition_title", this.node);
            if(i) {
              n > 1.79&& (i.y = (o.height- 1280)/ 2- 50);
              this.mode == BallLogicMgr.MODE.ME_Free&& this.setTitleFreeMode();
              this.mode == BallLogicMgr.MODE.PVE_Challenge|| this.mode == BallLogicMgr.MODE.ME_Editing|| this.mode == BallLogicMgr.MODE.ME_Free? this.scheduleOnce(function() {
                i.getComponent("ConditionTitleComp").setCondition(this.editingConditionInfo);
              }
        , .1): i.parent = null;
            }
            for(var a = 0;
            a < t.length;
            a++) this.createOneBall(t[a]);
            this.tableIsReset();
            console.log("game_table loadEditingTableInfo 10");
            this.initLevelInfo();
            this.initHart();
          
    }

    getTotalChallengeSec(): void {
        
            var e = 30;
            if(this.editingConditionInfo&& this.editingConditionInfo.ganNum) {
              var t = this.editingConditionInfo.ganNum- 2;
              e+= 10*(t = t < 0? 0: t);
            }
            return e;
          
    }

    fuhuo(e: any): void {
        
            PoolLogger.PoolLogger.instance.logGameEvent("thepool_game_table", {
              object_action: "show", object_name: "table_open", object_notes: PlayerDataSys.table
            }
        );
            this.levelDataStatis.fuhuo_count++;
            var t = Number(ConfigDataSys.getFuhuoHeartAddCount()),
            o = Number(ConfigDataSys.global_ConfigMap.get("line_lv_life"));
        (e = o- this.ganNum) < 0&& (e = 0);
            Math.min(t, o- e);
        (e+= t) > o&& (e = o);
            this.ganNum = o- e;
            this.updateHart(this.ganNum);
            this.isIngame = ! 0;
            this._isXiaoQiuStart = ! 1;
            this._xiaoqiuStartHoleIndex = undefined;
            this._xiaoqiuTargetNode = null;
            this.commboCount = 0;
            this._xiaoqiuCount = 0;
            this.cancelXiaoQiuEffect();
            this._xiaoqiuHoleId = undefined;
            for(var n = BallLogicMgr.editingTableInfo.balls, i = 0;
            i < n.length;
            i++) {
              var a = n[i];
              a.ballType == BallLogicMgr.BallIDType_White&& this.createOneBall(a, ! 0);
            }
            var r = this;
            this.scheduleOnce(function() {
              var e = r.choseDirToBall();
              if(e) {
                r.rad = e.rad;
                r.dir = e.dir;
                r.applyRayByRad(e.rad, e.len);
              } else {
                CueHelper.hide();
                this.node.getComponent("CircleRayComp").clear();
              }
              r.tableResetFinish();
            }
        , .01);
          
    }

    applyOneCueMV_oneBallMove(e: any): void {
        
            var t = this.ballMgr.get(e.ballID);
            if(t) {
              t.x = e.x;
              t.y = e.y;
              var o = t.getComponent(cc.RigidBody);
              t.getComponent("Ball2DControl").isTooSmallV(cc.v2(e.vx, e.vy))|| (o.linearVelocity = cc.v2(e.vx, e.vy));
            }
          
    }

    setupWhiteBallEffect(e: any, t: any): void {
        
            console.log("setupWhiteBallEffect", e, t);
            if(e&& t) {
              this.ball_white;
              var o = BallLogicMgr.shop_config();
              if(e >= 0) {
                var n = o.ball_colors;
                BallLogicMgr.getBy_cid(e, n);
              }
              t >= 0&& (n = o.ball_particles, BallLogicMgr.getBy_cid(t, n));
            }
          
    }

    cancelXiaoQiuEffect(): void {
        
            if(this._cueXiaoQiuSk) {
              var e = this._cueXiaoQiuSk;
              this._cueXiaoQiuSk = null;
              console.log("hole effect cancelXiaoQiuEffect ---", this._xiaoqiuHoleId);
              e.setAnimation(0, "dongkou_xiaoshi", ! 1);
            }
          
    }

    clearRay(): void {
        
            this.node.getComponent("CircleRayComp").clear();
          
    }

    getUpVector(e: any, t: any): void {
        
            t.x = e.m04;
            t.y = e.m05;
            t.z = e.m06;
            t.normalizeSelf();
            console.log("dst", t);
          
    }

    setAutoPlayingMode(e: any): void {
        
            if(this.isAutoPlaying != e) {
              this.isAutoPlaying = e;
              for(var t, o = GameTable._iterate(this.ballMgr.entries());
        !(t = o()).done;
        ) {
                var n = t.value,
                i = (n[0], n[1]);
                i.getComponent(cc.PhysicsCircleCollider).sensor = e;
                i.getComponent("Ball2DControl").isAutoPlaying = e;
              }
              console.log("setAutoPlayingMode", i.getComponent("Ball2DControl").ballID, e);
            }
          
    }

    createOneBall(e: any, t: any): void {
        
            undefined === t&& (t = ! 1);
            var o = this,
            n = o.ballParent|| o.node;
            if(o.ballPosNode) {
              if(e.ballType == BallLogicMgr.BallIDType_Normal) {
                var i = cc.instantiate(o.ballPosNode);
                i.parent = o.node;
                i.x = e.x;
                i.y = e.y;
                var a = i.getComponent("Ball2DControl");
                a.ballID = e.ballID;
                a.isAutoPlaying = o.isAutoPlaying;
                a.stopCallback = function(e) {
                  o.oneBallIsStop(e);
                }
        ;
                i.getComponent("Ball2DControl").sensor_value = ! 1;
                var r = cc.instantiate(o.ball);
                n.addChild(r);
                r.getComponent("BallMaterialComp").setMatIdx(e.ballMatIdx);
                r.x = e.x;
                r.y = e.y;
                if(o.ballPosNode) {
                  var l = r.getChildByName("New Sphere");
                  l.getComponent("3D_ballRoll").pos_node = i;
                  l.getComponent("3D_ballRoll").bind_node_ps = ! 0;
                  var c = cc.instantiate(o.shadow_prefab);
                  c.setParent(o.shadow_container);
                  c.setPosition(r.getPosition());
                  l.getComponent("3D_ballRoll").shadow_node = c;
                }
                i.getComponent("Ball2DControl").ball3D = r;
                o.ballMgr.set(o.ballID, i);
                o.ballID = o.ballID+ 1;
              } else if(e.ballType == BallLogicMgr.BallIDType_White) {
                o.ball_white.x = e.x;
                o.ball_white.y = e.y;
                o.ball_white.scale = 1;
                var u = o.ball_white_pos_node.getComponent("Ball2DControl");
                u.ballID = e.ballID;
                o.ball_white_pos_node.x = e.x;
                o.ball_white_pos_node.y = e.y;
                u.sensor_value = ! 0;
                var p = o.ball_white_pos_node.getComponent(cc.PhysicsCircleCollider);
                p.enabled = u.sensor_value;
                p.restitution = this._whiteBallRestitution;
                u.node.group = "default";
                u.ball3D.group = "3d";
                u.ball3D.children.forEach(function(e) {
                  e.group = "3d";
                }
        );
                u.ball3D.children[0].getComponent("3D_ballRoll").setShowShadow(! 0);
                p.apply();
                if(t) {
                  var d = o.getWhiteBallFuHuoP(e);
                  o.ball_white_pos_node.x = d.x;
                  o.ball_white_pos_node.y = d.y;
                }
              }
              MoviePlayer.packInitBalls({
                ballID: e.ballID, ballType: e.ballType, ballMatIdx: e.ballMatIdx, x: e.x, y: e.y
              }
        );
            }
          
    }

    doXiaoQiuAction(): void {
        
            if(this._cueXiaoQiuSk&& this._isXiaoQiuStart&& null != this._xiaoqiuStartHoleIndex&& this._xiaoqiuTargetNode) {
              var e = this._xiaoQiuHoleEffectArray[this._xiaoqiuStartHoleIndex].parent,
              t = this._cueXiaoQiuSk;
              this._cueXiaoQiuSk = null;
              t.setAnimation(0, "jinqiu", ! 1);
              this.oneCueXiaoQiuCount++;
              var o = this._xiaoqiuTargetNode.getComponent("Ball2DControl"),
              n = o.ball3D;
              this._xiaoqiuGuiJiEffect.getChildByName("xiaoqiu").active = ! 1;
              this._xiaoqiuGuiJiEffect.getChildByName("taiqiu_tuowei").active = ! 0;
              this._xiaoqiuGuiJiEffect.x = e.x;
              this._xiaoqiuGuiJiEffect.y = e.y;
              this._xiaoqiuGuiJiEffect.active = ! 0;
              cc.tween(this._xiaoqiuGuiJiEffect).to(.7, {
                x: n.x, y: n.y
              }
        ).call(this.onXiaoQiuEnd.bind(this, o)).start();
            }
          
    }

    ballEnterHole(e: any, t: any): void {
        
            this.playJinDongEffect(t);
            this.destroyBall(e, t);
          
    }

    reloadEditingTableInfo(e: any): void {
        
            e = e|| BallLogicMgr.editingTableInfo;
            this.loadEditingTableInfo(e);
          
    }

    setText(): void {
        
          
    }

    onXiaoQiuEnd(e: any): void {
        
            this.levelDataStatis.xiaoqiu_count++;
            PlayerDataSys.xiaoqiuADCount++;
            BallLogicMgr.playSound("pool_ball_xiao");
            this._xiaoqiuGuiJiEffect.getChildByName("xiaoqiu").active = ! 0;
            this._xiaoqiuGuiJiEffect.getChildByName("xiaoqiu").getComponent(sp.Skeleton).setAnimation(0, "qiuxiaoshi", ! 1);
            this.destroyBall(e.node, null, ! 0);
          
    }

    update(e: any): void {
        
            if(this.do_update) {
              this.frame_idx = this.frame_idx+ 1;
              if(this.frame_idx >= 10) {
                cc.Quat.rotateAround(this.quat, this.quat, this.axis, this.rad);
                this.target.setRotation(this.quat);
                this.frame_idx = 0;
              }
            }
            if(this.do_timer) {
              this.do_timer_sec = this.do_timer_sec+ e;
              this.updateTimer();
            }
            if(this.mv_moves_starTimer > 0) {
              for(;
              this.mv_oneCue_moves.length > 0;
        ) {
                var t = this.mv_oneCue_moves[0];
                if(!(t.time <= this.mv_moves_starTimer)) break;
                this.applyOneCueMV_oneBallMove(t);
                this.mv_oneCue_moves.shift();
              }
              this.mv_moves_starTimer = this.mv_moves_starTimer+ 1e3* e;
            }
          
    }

    recv_gamePlayFinish(): void {
        
            this.setText("轮到对方击球了");
          
    }

    failAndGoBack(): void {
        
            console.log("failAndGoBack");
            this.mode == BallLogicMgr.MODE.ME_Free? this.gotoHall():(this.mode, BallLogicMgr.MODE.PVE_Challenge, this.gotoHall());
          
    }

    tableResetFinish(): void {
        
            this.oneCueLock = ! 1;
            this.isIngame = ! 0;
            this.checkBaiQiuEffect();
            this.mode == BallLogicMgr.MODE.ME_PlayMV? this.playOneMV_TableFinish(): this.mode != BallLogicMgr.MODE.PVE_Challenge&& this.mode != BallLogicMgr.MODE.ME_Editing|| this.startTimer();
            this.mode != BallLogicMgr.MODE.ME_Editing&& this.mode != BallLogicMgr.MODE.PVE_Challenge&& this.mode != BallLogicMgr.MODE.ME_Free|| CueHelper.show();
            this.editingTableInfo&& this.setupWhiteBallEffect(this.editingTableInfo.color, this.editingTableInfo.particle);
            EventMgr.trigger(GameEventType.HIDE_MAIN_UI_TOUCH_BLOCK, "game-shooting");
          
    }

    recv_ballInit(e: any): void {
        
            console.log("recv_ballInit", e);
            var t = this.ballParent|| this.node,
            o = this;
            if(o.ballPosNode) {
              var n = cc.instantiate(o.ballPosNode);
              n.parent = o.node;
              n.x = e.x;
              n.y = e.y;
              n.getComponent("Ball2DControl").ballID = o.ballID;
              n.getComponent("Ball2DControl").isAutoPlaying = o.isAutoPlaying;
              n.getComponent("Ball2DControl").stopCallback = function(e) {
                o.oneBallIsStop(e);
              }
        ;
              n.getComponent("Ball2DControl").sensor_value = ! 0;
              var i = cc.instantiate(o.ball);
              t.addChild(i);
              i.x = e.x;
              i.y = e.y;
              if(o.ballPosNode) {
                var a = i.getChildByName("New Sphere");
                a.getComponent("3D_ballRoll").pos_node = n;
                a.getComponent("3D_ballRoll").bind_node_ps = ! 0;
              }
              n.getComponent("Ball2DControl").ball3D = i;
              o.ballMgr.set(o.ballID, n);
              o.ballID = o.ballID+ 1;
            }
          
    }

    showXiaoQiuHoleEffect(): void {
        
            if(null == (e = this.getXiaoQiuHoldeIndex())) for(;
        ;
        ) {
              var e = EngineUtil.randomInt(0, this._xiaoQiuHoleEffectArray.length- 1);
              if(null == this._xiaoqiuHoleId|| e != this._xiaoqiuHoleId) break;
            }
            console.log("hole effect showXiaoQiuHoleEffect ---");
            this._xiaoqiuHoleId = e;
            var t = this._xiaoQiuHoleEffectArray[e];
            t.active = ! 0;
            var o = t.getChildByName("xiaoqiu").getComponent(sp.Skeleton);
            o.setAnimation(0, "dongkou_daiji", ! 0);
            this._cueXiaoQiuSk = o;
          
    }

    reportGameDataStatis(e: any): void {
        
            if(! this.isReportGameDataStatis) {
              this.isReportGameDataStatis = ! 0;
              var t = TimeDataSys.getTimeCuration(! 0);
              if(t > 10800) {
                this.levelDataStatis.game_time = Math.max(0, TimeUtils.getTimeinSeconds()- this.levelDataStatis.game_time);
                this.levelDataStatis.game_time > 10800&& (this.levelDataStatis.game_time = 0);
              } else this.levelDataStatis.game_time = t;
              this.levelDataStatis.is_success = e? 1: 0;
              this.levelDataStatis.remain_heart = Math.max(0, BallLogicMgr.editingTableInfo.condition.ganNum- this.ganNum);
              this.levelDataStatis.full_heart = 0 == this.ganNum? 1: 0;
              SdkHelper.reportData("level_statis", this.levelDataStatis);
            }
          
    }

    updateRadBallBtnInfo(): void {
        
            var e = cc.find("bottom_area", this.node);
            cc.find("node_btn_radBall", e).getComponent("game_btn_radBall").setInfo(this.oneCue_rad_value, this.oneCue_rad_angle);
            console.log("updateRadBallBtnInfo", this.oneCue_rad_value, this.oneCue_rad_angle);
          
    }

    updateHart(e: any): void {
        
            e = null != e? e: this.ganNum;
            var t = Number(this.heartNumLabel.string);
            isNaN(t)&& (t = 0);
            var o = Math.max(0, BallLogicMgr.editingTableInfo.condition.ganNum- e),
            n = this.heartNumLabel.node.parent;
            this.heartNumLabel.string = ""+ o;
            cc.Tween.stopAllByTarget(n);
            n.scale = 1;
            n.x = this.moveCueBallPropNode.x;
            o > t? cc.tween(n).to(.12, {
              scale: 1.15
            }
        ).to(.1, {
              scale: 1
            }
        ).to(.1, {
              scale: 1.2
            }
        ).to(.1, {
              scale: 1
            }
        ).start(): o < t&& cc.tween(n).by(.04, {
              x:- 6
            }
        ).by(.07, {
              x: 10
            }
        ).by(.06, {
              x:- 7
            }
        ).by(.05, {
              x: 5
            }
        ).by(.03, {
              x:- 3
            }
        ).by(.02, {
              x: 3
            }
        ).by(.01, {
              x:- 2
            }
        ).start();
          
    }

    updateRadLabel(): void {
        
            var e = Math.floor(1e3*(this.rad+ Math.PI)),
            t = cc.find("bottom_area", this.node);
            cc.find("node_roll", t).getChildByName("roll_scroll").getComponent("RollScrollComp").updateLabel(e);
          
    }

    onModifyBallMoveToHole(e: any): void {
        
            for(var t = e.moveDir, o = e.ball2DCtrl, n = e.cb, i = o.ball3D, a = cc.v2(i.x, i.y), r = null, l = 0;
            l < this._xiaoQiuHoleEffectArray.length;
            l++) {
              var c = this._xiaoQiuHoleEffectArray[l].parent,
              u = cc.v2(c.x, c.y).subSelf(a);
              if(u.angle(t) <= BallLogicMgr.ballDirModifyThreshold) {
                r = u;
                break;
              }
            }
            n&& n(r);
          
    }

    initXiaoQiuNode(): void {
        
            var e = cc.find("plane_table", this.node).getChildByName("table_layers");
            this._zhuoDongContainer = e.getChildByName("table").getChildByName("zhuo_pengzhuang_daizi_3d");
            this._xiaoQiuHoleEffectArray = [];
            for(var t = 0;
            t < this._zhuoDongContainer.childrenCount;
            t++) {
              var o = cc.instantiate(this.xiaoqiuHoleEffectPreb);
              o.setParent(this._zhuoDongContainer.children[t]);
              o.setPosition(cc.Vec2.ZERO);
              var n = o.getChildByName("xiaoqiu").getComponent(sp.Skeleton);
              n.setCompleteListener(this.onXiaoQiuEffectComplete.bind(this, o));
              this._xiaoQiuHoleEffectArray.push(o);
              o.active = ! 1;
            }
            this._xiaoqiuGuiJiEffect = cc.instantiate(this.xiaoqiuHoleEffectPreb);
            this._xiaoqiuGuiJiEffect.setParent(this._zhuoDongContainer.parent);
            this._xiaoqiuGuiJiEffect.active = ! 1;
        (n = this._xiaoqiuGuiJiEffect.getChildByName("xiaoqiu").getComponent(sp.Skeleton)).setCompleteListener(this.onXiaoQiuGuiJiEffectComplete.bind(this, this._xiaoqiuGuiJiEffect));
            this._xiaoqiuGuiJiEffect.getChildByName("xiaoqiu").active = ! 1;
          
    }

    getXiaoQiuTarget(): void {
        
            var e = ! 1;
            if(! this._cueXiaoQiuSk|| this._isXiaoQiuStart) return e;
            var t = this._cueXiaoQiuSk;
            if(! this._isEnterXiaoQiu) {
              this._cueXiaoQiuSk = null;
              t.setAnimation(0, "dongkou_xiaoshi", ! 1);
              return e;
            }
            console.log("hole effect getXiaoQiuTarget ---", this._xiaoqiuHoleId);
            if(null != this._xiaoqiuHoleId&& null != this._xiaoqiuHoleId) {
              if(! this.doXiaoQiu(this._xiaoqiuHoleId)) {
                this._cueXiaoQiuSk = null;
                t.setAnimation(0, "dongkou_xiaoshi", ! 1);
              }
              e = ! 0;
            } else {
              this._cueXiaoQiuSk = null;
              t.setAnimation(0, "dongkou_xiaoshi", ! 1);
            }
            this._isEnterXiaoQiu = ! 1;
            return e;
          
    }

    resetWhiteBall(): void {
        
            this.ball_white_pos_node.getComponent("Ball2DControl").resetWhiteBallPos();
          
    }

    removeEventListener(): void {
        
            EventMgr.ignore(GameEventType.ON_LINE_PROP_USED_STATE_CHANGED, this.onUseLineProp, this);
            EventMgr.ignore(GameEventType.ON_PROP_USED_STATE_CHANGED, this.onPropUsedStateChanged, this);
            EventMgr.ignore(GameEventType.SHOW_MAIN_UI_TOUCH_BLOCK, this.onShowTopTouchBlock, this);
            EventMgr.ignore(GameEventType.HIDE_MAIN_UI_TOUCH_BLOCK, this.onHideTopTouchBlock, this);
            EventMgr.ignore(GameEventType.ModifyBallMoveDir, this.onModifyBallMoveToHole, this);
            EventMgr.ignore(GameEventType.ON_LEVEL_SWITCH_UI_HIDE, this.onLevelSwitchUIHide, this);
          
    }

    addEventListener(): void {
        
            EventMgr.listen(GameEventType.ON_LINE_PROP_USED_STATE_CHANGED, this.onUseLineProp, this);
            EventMgr.listen(GameEventType.ON_PROP_USED_STATE_CHANGED, this.onPropUsedStateChanged, this);
            EventMgr.listen(GameEventType.SHOW_MAIN_UI_TOUCH_BLOCK, this.onShowTopTouchBlock, this);
            EventMgr.listen(GameEventType.HIDE_MAIN_UI_TOUCH_BLOCK, this.onHideTopTouchBlock, this);
            EventMgr.listen(GameEventType.ModifyBallMoveDir, this.onModifyBallMoveToHole, this);
            EventMgr.listen(GameEventType.ON_LEVEL_SWITCH_UI_HIDE, this.onLevelSwitchUIHide, this);
          
    }

    doAftOneCueActionFinish(e: any): void {
        
            if(e&& this.oneCueLock&& ! this._isXiaoQiuStart) {
              this.oneCueLock = ! 1;
              this.mode == BallLogicMgr.MODE.ME_PlayMV&& this.continueOneMV();
              this.checkBaiQiuEffect();
            }
          
    }

    checkEnterXiaoQiu(e: any): void {
        
            var t = ! 1;
            if(! this._cueXiaoQiuSk|| this._isXiaoQiuStart) return t;
            var o = e.parent.children.indexOf(e);
            if(o > - 1) {
              console.log("hole effect checkEnterXiaoQiu ---", this._xiaoqiuHoleId, o);
              if(this._xiaoqiuHoleId == o) {
                this._isEnterXiaoQiu = ! 0;
                t = ! 0;
              }
            }
            return t;
          
    }

    clearTable(): void {
        
            this.oneCueLock = ! 0;
            this.destroyAllBall();
          
    }

    applyRayByRad(e: any, t: any): void {
        
            if(this.isGuideLevel&& ! this.lockTouchNode&& this.top_guide_touch_block.active) {
              var o = Math.atan2(this.dir.y, this.dir.x);
              if(o >= - 1.929735555&& o <= - 1.9222755) {
                this.lockTouchNode = ! 0;
                this.bottom_touch_block3.active = ! 1;
                this.applyByRad(- 1.9233395);
                cc.game.emit("GuideEvent_MiaoZhun");
                console.log("cc.game.emit GuideEvent_MiaoZhun");
                return;
              }
            }
            var n = e- Math.PI,
            i = Math.cos(n)* t,
            a = Math.sin(n)* t,
            r = this.node.getComponent("CircleRayComp").check_line(this.ball_white_pos_node, this.ballMgr, e, cc.v2(i, a)),
            l = r.tar_node,
            s = r.zhexian;
            this._isAimTarget = ! ! l;
            this.ball_white_ball2dCtr.aimTargetUUID = l? l.uuid: "empty";
            this.ball_white_ball2dCtr.aimZheXian = s? s.normalize(): null;
            this.updateRadLabel();
          
    }

    recv_gameStart(e: any): void {
        
            var t = e.myTurn;
            this.setAutoPlayingMode(1 != t);
            this.pvpCueLock = 1 != t;
            this.mode = BallLogicMgr.MODE.PVP_Friend;
            this.isAutoPlaying? this.setText("游戏开始，对方球权"): this.setText("游戏开始，你的球权");
            this.destroyAllBall();
            for(var o = this.ballParent|| this.node, n = this, i = 0;
            i < 5;
            i++) if(n.ballPosNode) {
              var a = 30* i- 180,
              r = cc.instantiate(n.ballPosNode);
              r.parent = n.node;
              r.x = a;
              r.y = 100;
              r.getComponent("Ball2DControl").ballID = n.ballID;
              r.getComponent("Ball2DControl").isAutoPlaying = n.isAutoPlaying;
              r.getComponent("Ball2DControl").stopCallback = function(e) {
                n.oneBallIsStop(e);
              }
        ;
              r.getComponent("Ball2DControl").sensor_value = ! 0;
              var l = cc.instantiate(n.ball);
              o.addChild(l);
              l.x = a;
              l.y = 100;
              if(n.ballPosNode) {
                var c = l.getChildByName("New Sphere");
                c.getComponent("3D_ballRoll").pos_node = r;
                c.getComponent("3D_ballRoll").bind_node_ps = ! 0;
              }
              r.getComponent("Ball2DControl").ball3D = l;
              n.ballMgr.set(n.ballID, r);
              n.ballID = n.ballID+ 1;
            }
            this.resetWhiteBall();
            GameMgr.setInBattle();
            this.tableIsReset();
          
    }

    onShowTopTouchBlock(e: any): void {
        
            this._topTouchBlockHandlerSet.add(e);
            this.top_touch_block.active = ! 0;
          
    }

    recv_enemyHit(): void {
        
            this.setText("对方击球了");
            this.setAutoPlayingMode(! 0);
          
    }

    checkBallMatIdxInMap(e: any): void {
        
            for(var t, o = GameTable._iterate(this.ballMgr.entries());
        !(t = o()).done;
        ) {
              var n = t.value,
              i = (n[0], n[1]);
              if(WHITE_BALL_ID == i.getComponent("Ball2DControl").ballID);
              else if(i.getComponent("Ball2DControl").ball3D.getComponent("BallMaterialComp").getMatIdx() == e) {
                console.log("find ballID", i.getComponent("Ball2DControl").ballID);
                return ! 0;
              }
            }
            return ! 1;
          
    }

    updateRecIcon(): void {
        
          
    }

    startTimer(): void {
        
            cc.find("node_condition_title", this.node);
            this.do_timer = ! 0;
            this.do_timer_sec = 0;
          
    }

    start(): void {
        
            BallLogicMgr.isWin = ! 1;
          
    }

    getNearestHodeIndexForBall(e: any): void {
        
            for(var t = null, o = cc.v2(e.x, e.y), n = this.ball_white_pos_node.getComponent("Ball2DControl").ball3D, i = cc.v2(n.x, n.y), a = o.sub(i), r = .04* a.len(), l = a.len(), s = null, c = 0, u = 0;
            u < this._xiaoQiuHoleEffectArray.length;
            u++) {
              var p = this._xiaoQiuHoleEffectArray[u].parent,
              d = cc.v2(p.x, p.y),
              _ = cc.v2(p.x, p.y).subSelf(o),
              f = _.angle(a);
              if(!(this.node.getComponent("CircleRayComp").getLineLen(i, a) < l)) {
                var h = d.subSelf(o).len(),
                g = r+.2* _.len()+ 100* f;
                if(null == t|| g < t) {
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
            }
        ;
          
    }

    doXiaoQiu(e: any): void {
        
            if(this.ballMgr.size <= 1) return ! 1;
            for(var t = Array.from(this.ballMgr.values()), o = 0;
        ;
        ) {
              var n = t[EngineUtil.randomInt(0, t.length- 1)],
              i = n.getComponent("Ball2DControl");
              if(WHITE_BALL_ID != i.ballID&& ! i.isOnDeapMoving()) {
                this._isXiaoQiuStart = ! 0;
                this._xiaoqiuTargetNode = n;
                this._xiaoqiuStartHoleIndex = e;
                break;
              }
              if(50 == ++ o) break;
            }
            return this._isXiaoQiuStart;
          
    }

    onLevelSwitchUIHide(): void {
        
            if(!(this.ballCount < GameConfigurations.customConfig.minBallNumberForPropHint)) {
              EngineUtil.showManageViewToast("pkey_006");
              PageMgr.showPage("UsePropPage", {
                prop_type: ETaiQiuPropType.E_Line
              }
        );
            }
          
    }

    onXiaoQiuGuiJiEffectComplete(e: any, t: any): void {
        
            "qiuxiaoshi" == t.animation.name&& (e.x = - 2e4);
            t.loop|| (e.getChildByName("xiaoqiu").active = ! 1);
          
    }

    initHart(e: any): void {
        
            this.heartNumLabel.string = ""+(null != e? e: BallLogicMgr.editingTableInfo.condition.ganNum);
          
    }

    updateAimBall(): void {
        
            var e = PropDataSys.isLinePropUsed,
            t = this._aimPower|| 0;
            this._sprite_virtualBall.children[0].active = ! e&& t >= 1;
            this._sprite_virtualBall.children[1].active = ! e;
            this._sprite_virtualBall.children[2].active = e;
          
    }

    CuePosByPower(e: any): void {
        
            e/= CueDataSys.getUsedCuePower();
            var t,
            o = Math.min(1, e/.2);
            this._aimPower = o;
            this._dirGreen.getComponent("SpriteRayComp").setPowerPercent(o);
            this.updateAimBall();
            e > .2&& (t = Math.min(1, e));
            this._dirYellow.getComponent("SpriteRayComp").setPowerPercent(t);
            CueHelper.CuePosByPower(e);
          
    }

    onUseLineProp(e: any): void {
        
            if(CueHelper.isShow()) {
              this.applyByRad(this.rad);
              this.updateAimBall();
            }
            e&& this.levelDataStatis.line_count++;
          
    }

    addTableNode(e: any): void {
        
            var t = cc.find("plane_table", this.node),
            o = t.getChildByName("table_layers");
            o.removeAllChildren(! 0);
            var n = e.getChildByName("plane_table"),
            i = n.getChildByName("table_layers").getChildByName("table");
            i.setParent(o);
            i.setPosition(cc.Vec2.ZERO);
            var a = t.getChildByName("table_touch");
            t.removeChild(a, ! 0);
            var r = n.getChildByName("table_touch");
            r.setParent(t);
            r.setPosition(cc.Vec2.ZERO);
            var l = cc.find("zhuo_pengzhuang", this.node);
            l.removeAllChildren(! 0);
            var s = e.getChildByName("zhuo_pengzhuang").getChildByName("pengzhuang_root");
            s.setParent(l);
            s.setPosition(cc.Vec2.ZERO);
            var c = i.getChildByName("sprite_table");
            c&& (c.active = ! 1);
          
    }

    recv_outRoom(): void {
        
            if(this.isInPVPBattle()) {
              GameMgr.setOutBattle();
              this.setText("对方逃跑，游戏结束");
              this.destroyAllBall();
            }
          
    }

    tableIsReset(): void {
        
            var e = this;
            this.ganNum = 0;
            this.answers = [];
            MoviePlayer.refreshTime = new Date().getTime();
            this.ticker_start = new Date().getTime();
            BallLogicMgr.msgCache_balls = [];
            this.scheduleOnce(function() {
              var t;
              if(t = this.isGuideLevel? CueHelper.applyByXY(50, 400): e.choseDirToBall()) {
                e.rad = t.rad;
                e.dir = t.dir;
                e.applyRayByRad(t.rad, t.len);
              } else {
                CueHelper.hide();
                this.node.getComponent("CircleRayComp").clear();
              }
              e.tableResetFinish();
            }
        , .01);
          
    }

    checkBallClicked(e: any, t: any, o: any): void {
        
            undefined === o&& (o = 25);
            console.log("check touch p(scren p) : "+ e);
            for(var n, i = o, a = null, r = GameTable._iterate(this.ballMgr.entries());
        !(n = r()).done;
        ) {
              var l = n.value,
              s = l[0],
              c = l[1];
              if(t) {
                if(s != WHITE_BALL_ID) continue;
              } else if(s == WHITE_BALL_ID) continue;
              var u = c.getComponent("Ball2DControl").ball3D,
              p = u.convertToWorldSpaceAR(cc.Vec3.ZERO),
              d = this.camera3D.getWorldToScreenPoint(p),
              _ = cc.v2(d.x, d.y),
              f = cc.Vec2.distance(e, _);
              if(f <= i) {
                i = f;
                a = u;
              }
            }
            return a;
          
    }

    btn_go(e: any): void {
        
            var t = this;
            if(! this.oneCueLock&& 0 != e) if(this.pvpCueLock) {
              this.setText("现在是对方击球");
              console.log("现在是对方击球");
            } else {
              EventMgr.trigger(GameEventType.SHOW_MAIN_UI_TOUCH_BLOCK, "game-shooting");
              this.isGuideLevel&& (e = 1);
              e = e|| 1;
              this.node.getComponent("CircleRayComp").clear();
              BallLogicMgr.curPowerPercentFlag = e;
              var o = CueDataSys.getUsedCuePower(),
              n = GlobalConfig.PowerMin;
              BallLogicMgr.useSimCueAttri&& BallLogicMgr.simCuePower&& (o = BallLogicMgr.simCuePower);
              var i = o* e;
        (i = Math.floor(i)) <= n&& (i = n);
              i > o&& (i = o);
              var a = Math.floor(1e5* this.rad);
              this.mode == BallLogicMgr.MODE.ME_Editing&& MoviePlayer.oneCue({
                rad: a, power: i, radAngle: this.oneCue_rad_angle, radVx: this.oneCue_rad_value.x, radVy: this.oneCue_rad_value.y
              }
        );
              var r = this;
              CueHelper.hideByAni(e, function() {
                t.levelDataStatis.hit_count++;
                r.applyByPower(i);
                r.state = "hitfinish";
              }
        );
            }
          
    }

    onHideTopTouchBlock(e: any): void {
        
            if(this._topTouchBlockHandlerSet.has(e)) {
              this._topTouchBlockHandlerSet.delete(e);
              this._topTouchBlockHandlerSet.size < 1&& (this.top_touch_block.active = ! 1);
            }
          
    }

    stopTimer(): void {
        
            this.do_timer = ! 1;
            this.do_timer_sec = 0;
          
    }

    getDirToTargetBall(): void {
        
            for(var e, t = null, o = null, n = GameTable._iterate(CueHelper.ballMgr.entries());
        !(e = n()).done;
        ) {
              var i = e.value,
              a = (i[0], i[1]),
              r = a.getComponent("Ball2DControl");
              if(WHITE_BALL_ID == r.ballID);
              else if(! r.isOnDestroy()) {
                var l = this.getNearestHodeIndexForBall(r.ball3D, r.ballID),
                s = l.distance,
                c = (l.holeIndex, l.weight);
                if(null != s&& null != c&& (null == t|| c < t)) {
                  t = c;
                  o = a;
                }
              }
            }
            return o;
          
    }

    initLevelInfo(): void {
        
            this.turnProgressBar.node.parent.active = ! GameHelper.pocketed;
            this.levelLabel.string = "LV. "+ PlayerDataSys.level_info.level_a;
            this.roundRichText.string = "pkey_001??&value1==<color= #E29EFF>"+ PlayerDataSys.level_info.level_b+ "</c>&value2=="+ PlayerDataSys.level_info.roundCount;
            this.turnProgressBar.progress = PlayerDataSys.level_info.turnCount <= 0? 1: PlayerDataSys.level_info.level_c/ PlayerDataSys.level_info.turnCount;
            this.turnLabel.string = PlayerDataSys.level_info.level_c+ "/"+ PlayerDataSys.level_info.turnCount;
            this.levelSpliter.active = this.roundRichText.node.active = PlayerDataSys.level_info.roundCount > 1;
            this.turnProgressBar.node.active = PlayerDataSys.level_info.turnCount > 1;
          
    }

    doGameSuccess(e: any): void {
        
            undefined === e&& (e = ! 1);
            e|| PoolLogger.PoolLogger.instance.logGameEvent("thepool_game_table", {
              object_action: "show", object_name: "table_clear", object_notes: PlayerDataSys.table
            }
        );
            this.isIngame = ! 1;
            this.cancelXiaoQiuEffect();
            BallLogicMgr.isWin = ! 0;
            PageMgr.showPage("GameEndPage", {
              isSuccess: ! 0, ballCount: this.ballCount
            }
        );
            BallLogicMgr.saveFreeModeFinishIdx();
          
    }

    onJinDongEffectComplete(e: any): void {
        
            e.active = ! 1;
          
    }

    onGMLevelSuccess(): void {
        
            this.doGameSuccess(! 0);
          
    }

}
