import AudioManager from "./AudioManager";
import BallLogicMgr from "./BallLogicMgr";

const l = Math.PI / 180;
const whiteBallId = 100 * BallLogicMgr.BallIDType_White;

const CueHelper = {
    cueRes: null as cc.Node,
    node_cue_container: null as cc.Node,
    ball_white_pos_node: null as cc.Node,
    ball_white: null as cc.Node,
    ballMgr: null as any,
    isOnAni: false,
    curApplyXY: null as cc.Vec2,

    init(e: cc.Node, t: cc.Node, o: cc.Node, n: any): void {
        CueHelper.cueRes = cc.find("plane_table", e).getChildByName("node_cue_container").getChildByName("node_cue2").getChildByName("10522_Pool_Cue_v1_SG");
        CueHelper.node_cue_container = cc.find("plane_table", e).getChildByName("node_cue_container");
        CueHelper.ball_white_pos_node = t;
        CueHelper.ball_white = o;
        CueHelper.ballMgr = n;
    },

    hide(): void {
        this.isOnAni || (CueHelper.node_cue_container.opacity = 0);
    },

    show(): void {
        CueHelper.cueRes.y = 30;
        CueHelper.node_cue_container.opacity = 255;
    },

    isShow(): boolean {
        return CueHelper.node_cue_container && 0 != CueHelper.node_cue_container.opacity && !this.isOnAni;
    },

    hideByAni(e: number, t: Function): void {
        const u = [0.75, 0.3, 0];
        const p = ["pool_ball_75", "pool_ball_50", "pool_ball_30"];
        let i = "pool_ball_30";
        for (let a = 0; a < u.length; a++) {
            if (e >= u[a]) {
                i = p[a];
                break;
            }
        }
        this.isOnAni = true;
        cc.tween(CueHelper.cueRes).to(0.1, {
            y: 0
        }, {
            easing: "quadOut"
        }).call(() => {
            t();
            AudioManager.getInstance().playMusic(i);
        }).to(0.1, {
            y: 80
        }, {
            easing: "quadOut"
        }).call(() => {
            CueHelper.node_cue_container.opacity = 0;
            CueHelper.isOnAni = false;
        }).start();
    },

    CuePosByPower(e: number): void {
        e > 0 && CueHelper.show();
        CueHelper.cueRes.y = 310 * e + 25;
    },

    applyByRad(e: number, t?: number): { dir: cc.Vec2; rad: number; len: number } {
        const o = CueHelper.node_cue_container;
        t = t || 20;
        let n = Math.cos(e) * t;
        let i = Math.sin(e) * t;
        n += CueHelper.ball_white.x;
        i += CueHelper.ball_white.y;
        o.x = n;
        o.y = i;
        const a = cc.v2(n - CueHelper.ball_white.x, i - CueHelper.ball_white.y);
        const r = Math.atan2(i - CueHelper.ball_white.y, n - CueHelper.ball_white.x);
        o.angle = r / l;
        return {
            dir: a,
            rad: e,
            len: t
        };
    },

    applyByTargetBall(e: cc.Node): { dir: cc.Vec2; rad: number; len: number } {
        return CueHelper.applyByXY(e.x, e.y);
    },

    applyByXY(e: number, t: number): { dir: cc.Vec2; rad: number; len: number } {
        this.curApplyXY = cc.v2(e, t);
        const o = Math.atan2(CueHelper.ball_white_pos_node.y - t, CueHelper.ball_white_pos_node.x - e);
        return CueHelper.applyByRad(o);
    },

    randomDirToBall(): { dir: cc.Vec2; rad: number; len: number } {
        if (CueHelper.ballMgr) {
            for (const [, n] of CueHelper.ballMgr.entries()) {
                const a = n.getComponent("Ball2DControl");
                if (whiteBallId == a.ballID) {
                    continue;
                }
                if (!a.isOnDestroy()) {
                    return CueHelper.applyByTargetBall(n);
                }
            }
            return null;
        }
    }
};

export default CueHelper;
