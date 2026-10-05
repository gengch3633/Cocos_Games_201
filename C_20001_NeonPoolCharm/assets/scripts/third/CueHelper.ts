import * as BallLogicMgr from "./BallLogicMgr";
import AudioManager from "./AudioManager";

const DEG_TO_RAD = Math.PI / 180;
const WHITE_BALL_ID = 100 * BallLogicMgr.BallIDType_White;

export let cueRes: cc.Node = null;
export let node_cue_container: cc.Node = null;
export let ball_white_pos_node: cc.Node = null;
export let ball_white: cc.Node = null;
export let ballMgr: Map<number, cc.Node> = null;
export let isOnAni = false;
export let curApplyXY: cc.Vec2 = null;

const powerLevels = [0.75, 0.3, 0];
const powerSounds = ["pool_ball_75", "pool_ball_50", "pool_ball_30"];

export function init(
    rootNode: cc.Node,
    whitePosNode: cc.Node,
    whiteBall: cc.Node,
    ballManager: Map<number, cc.Node>
): void {
    cueRes = cc
        .find("plane_table", rootNode)
        .getChildByName("node_cue_container")
        .getChildByName("node_cue2")
        .getChildByName("10522_Pool_Cue_v1_SG");
    node_cue_container = cc.find("plane_table", rootNode).getChildByName("node_cue_container");
    ball_white_pos_node = whitePosNode;
    ball_white = whiteBall;
    ballMgr = ballManager;
}

export function hide(): void {
    if (!isOnAni) {
        node_cue_container.opacity = 0;
    }
}

export function show(): void {
    cueRes.y = 30;
    node_cue_container.opacity = 255;
}

export function isShow(): boolean {
    return node_cue_container && node_cue_container.opacity != 0 && !isOnAni;
}

export function hideByAni(power: number, callback: () => void): void {
    let soundName = "pool_ball_30";
    for (let i = 0; i < powerLevels.length; i++) {
        if (power >= powerLevels[i]) {
            soundName = powerSounds[i];
            break;
        }
    }
    isOnAni = true;
    cc.tween(cueRes)
        .to(0.1, { y: 0 }, { easing: "quadOut" })
        .call(() => {
            callback();
            AudioManager.getInstance().playMusic(soundName);
        })
        .to(0.1, { y: 80 }, { easing: "quadOut" })
        .call(() => {
            node_cue_container.opacity = 0;
            isOnAni = false;
        })
        .start();
}

export function CuePosByPower(power: number): void {
    if (power > 0) {
        show();
    }
    cueRes.y = 310 * power + 25;
}

export function applyByRad(rad: number, len?: number): { dir: cc.Vec2; rad: number; len: number } {
    const cueContainer = node_cue_container;
    const length = len || 20;
    let x = Math.cos(rad) * length;
    let y = Math.sin(rad) * length;
    x += ball_white.x;
    y += ball_white.y;
    cueContainer.x = x;
    cueContainer.y = y;
    const dir = cc.v2(x - ball_white.x, y - ball_white.y);
    const angle = Math.atan2(y - ball_white.y, x - ball_white.x);
    cueContainer.angle = angle / DEG_TO_RAD;
    return { dir, rad, len: length };
}

export function applyByTargetBall(targetBall: cc.Node): { dir: cc.Vec2; rad: number; len: number } {
    return applyByXY(targetBall.x, targetBall.y);
}

export function applyByXY(x: number, y: number): { dir: cc.Vec2; rad: number; len: number } {
    curApplyXY = cc.v2(x, y);
    const rad = Math.atan2(ball_white_pos_node.y - y, ball_white_pos_node.x - x);
    return applyByRad(rad);
}

export function randomDirToBall(): { dir: cc.Vec2; rad: number; len: number } | null {
    if (!ballMgr) {
        return null;
    }
    for (const entry of ballMgr.entries()) {
        const ballNode = entry[1];
        const ballControl = ballNode.getComponent("Ball2DControl") as any;
        if (WHITE_BALL_ID == ballControl.ballID) {
            continue;
        }
        if (!ballControl.isOnDestroy()) {
            return applyByTargetBall(ballNode);
        }
    }
    return null;
}
