import AudioManager from "./AudioManager";
import BallLogicMgr from "./BallLogicMgr";

const radToDeg = Math.PI / 180;
const powerThresholds = [.75, .3, 0];
const powerSounds = ["pool_ball_75", "pool_ball_50", "pool_ball_30"];
const whiteBallId = 100 * BallLogicMgr.BallIDType_White;

export default class CueHelper {
    static cueRes = null;
    static node_cue_container = null;
    static ball_white_pos_node = null;
    static ball_white = null;
    static ballMgr = null;
    static isOnAni;
    static curApplyXY;

    static init(root, whitePosNode, whiteBall, ballMgr) {
        CueHelper.cueRes = cc.find("plane_table", root).getChildByName("node_cue_container").getChildByName("node_cue2").getChildByName("10522_Pool_Cue_v1_SG");
        CueHelper.node_cue_container = cc.find("plane_table", root).getChildByName("node_cue_container");
        CueHelper.ball_white_pos_node = whitePosNode;
        CueHelper.ball_white = whiteBall;
        CueHelper.ballMgr = ballMgr;
    }

    static hide() {
        if (!this.isOnAni) {
            CueHelper.node_cue_container.opacity = 0;
        }
    }

    static show() {
        CueHelper.cueRes.y = 30;
        CueHelper.node_cue_container.opacity = 255;
    }

    static isShow() {
        return CueHelper.node_cue_container && 0 != CueHelper.node_cue_container.opacity && !this.isOnAni;
    }

    static hideByAni(power, callback) {
        const self = this;
        let sound = "pool_ball_30";
        for (let i = 0; i < powerThresholds.length; i++) {
            if (power >= powerThresholds[i]) {
                sound = powerSounds[i];
                break;
            }
        }
        this.isOnAni = true;
        cc.tween(CueHelper.cueRes).to(.1, {
            y: 0
        }, {
            easing: "quadOut"
        }).call(function () {
            callback();
            AudioManager.getInstance().playMusic(sound);
        }).to(.1, {
            y: 80
        }, {
            easing: "quadOut"
        }).call(function () {
            CueHelper.node_cue_container.opacity = 0;
            self.isOnAni = false;
        }).start();
    }

    static CuePosByPower(power) {
        if (power > 0) {
            CueHelper.show();
        }
        CueHelper.cueRes.y = 310 * power + 25;
    }

    static applyByRad(rad, len) {
        const container = CueHelper.node_cue_container;
        len = len || 20;
        let x = Math.cos(rad) * len;
        let y = Math.sin(rad) * len;
        x += CueHelper.ball_white.x;
        y += CueHelper.ball_white.y;
        container.x = x;
        container.y = y;
        const dir = cc.v2(x - CueHelper.ball_white.x, y - CueHelper.ball_white.y);
        const angle = Math.atan2(y - CueHelper.ball_white.y, x - CueHelper.ball_white.x);
        container.angle = angle / radToDeg;
        return {
            dir: dir,
            rad: rad,
            len: len
        };
    }

    static applyByTargetBall(ball) {
        return CueHelper.applyByXY(ball.x, ball.y);
    }

    static applyByXY(x, y) {
        this.curApplyXY = cc.v2(x, y);
        const rad = Math.atan2(CueHelper.ball_white_pos_node.y - y, CueHelper.ball_white_pos_node.x - x);
        return CueHelper.applyByRad(rad);
    }

    static randomDirToBall() {
        if (CueHelper.ballMgr) {
            const entries = CueHelper.ballMgr.entries();
            let step = entries.next();
            while (!step.done) {
                const entry = step.value;
                const ball = entry[1];
                const control = ball.getComponent("Ball2DControl");
                if (whiteBallId == control.ballID) {
                } else if (!control.isOnDestroy()) {
                    return CueHelper.applyByTargetBall(ball);
                }
                step = entries.next();
            }
            return null;
        }
    }
}
