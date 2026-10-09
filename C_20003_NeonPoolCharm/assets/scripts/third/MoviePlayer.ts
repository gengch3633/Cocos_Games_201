function scale10(value) {
    return Math.floor(10 * value);
}

function unscale10(value) {
    return value / 10;
}

function bufferToString(buffer) {
    const bytes = new Uint8Array(buffer);
    return String.fromCharCode.apply(null, bytes as any);
}

function stringToBuffer(text) {
    const buffer = new ArrayBuffer(text.length);
    const bytes = new Uint8Array(buffer);
    for (let i = 0, len = text.length; i < len; i++) {
        bytes[i] = text.charCodeAt(i);
    }
    return buffer;
}

const MoviePlayer: any = {
    refreshTime: new Date().getTime(),
    curCueInfo: null,
    oneMV: {},
    createNewMV: function () {
        MoviePlayer.oneMV = {};
    },
    oneCue: function (cue) {
        MoviePlayer.oneMV.cues = MoviePlayer.oneMV.cues || [];
        const info: any = {};
        info.hit = {
            rad: cue.rad,
            power: cue.power,
            time: new Date().getTime() - MoviePlayer.refreshTime,
            radAngle: cue.radAngle,
            radVx: cue.radVx,
            radVy: cue.radVy
        };
        info.moves = [];
        info.des = [];
        MoviePlayer.oneMV.cues.push(info);
        MoviePlayer.curCueInfo = info;
        console.log("MoviePlayer.oneCue", info);
    },
    packInitBalls: function (ball) {
        const buffer = new ArrayBuffer(10);
        const view = new DataView(buffer, 0, 10);
        view.setUint16(0, ball.ballID, true);
        view.setUint16(2, ball.ballType, true);
        view.setUint16(4, ball.ballMatIdx, true);
        view.setInt16(6, scale10(ball.x), true);
        view.setInt16(8, scale10(ball.y), true);
        if (MoviePlayer.oneMV) {
            MoviePlayer.oneMV.balls = MoviePlayer.oneMV.balls || [];
            MoviePlayer.oneMV.balls.push(bufferToString(buffer));
        }
    },
    packBallMove: function (ball) {
        const buffer = new ArrayBuffer(14);
        const view = new DataView(buffer, 0, 14);
        view.setUint16(0, ball.ballID, true);
        view.setUint32(2, ball.time - MoviePlayer.refreshTime, true);
        view.setInt16(6, scale10(ball.x), true);
        view.setInt16(8, scale10(ball.y), true);
        view.setInt16(10, scale10(ball.vx), true);
        view.setInt16(12, scale10(ball.vy), true);
        MoviePlayer.curCueInfo && MoviePlayer.curCueInfo.moves.push(bufferToString(buffer));
    },
    packBallDestroy: function (ball) {
        const buffer = new ArrayBuffer(6);
        const view = new DataView(buffer, 0, 6);
        view.setUint16(0, ball.ballID, true);
        view.setUint32(2, ball.time - MoviePlayer.refreshTime, true);
        MoviePlayer.curCueInfo && MoviePlayer.curCueInfo.des.push(bufferToString(buffer));
    },
    unpackInitBalls: function (buffer) {
        const ball: any = {};
        const view = new DataView(buffer);
        ball.ballID = view.getUint16(0, true);
        ball.ballType = view.getUint16(2, true);
        ball.ballMatIdx = view.getUint16(4, true);
        ball.x = unscale10(view.getInt16(6, true));
        ball.y = unscale10(view.getInt16(8, true));
        return ball;
    },
    unpackBallMove: function (buffer) {
        const ball: any = {};
        const view = new DataView(buffer);
        ball.ballID = view.getUint16(0, true);
        ball.time = view.getUint32(2, true);
        ball.x = unscale10(view.getInt16(6, true));
        ball.y = unscale10(view.getInt16(8, true));
        ball.vx = unscale10(view.getInt16(10, true));
        ball.vy = unscale10(view.getInt16(12, true));
        return ball;
    },
    unpackBallDestroy: function (buffer) {
        const ball: any = {};
        const view = new DataView(buffer);
        ball.ballID = view.getUint16(0, true);
        ball.time = view.getUint32(2, true);
        return ball;
    },
    compress: function () {
        console.log("compress", MoviePlayer.oneMV);
        if (MoviePlayer.oneMV) {
            const text = JSON.stringify(MoviePlayer.oneMV);
            console.log("zip_obj", typeof text, text.length);
            return text;
        }
        return null;
    },
    uncompress: function (data) {
        const raw = data;
        const parsed = JSON.parse(raw);
        MoviePlayer.oneMV_strToArrayBuffer(parsed);
        console.log("uncompress", parsed);
        MoviePlayer.unpackOneMV(parsed);
        MoviePlayer.resetTimeOneMV(parsed);
        return parsed;
    },
    oneMV_strToArrayBuffer: function (mv) {
        if (mv.balls) {
            for (let i = 0; i < mv.balls.length; i++) {
                const text = mv.balls[i];
                mv.balls[i] = stringToBuffer(text);
            }
        }
        if (mv.cues) {
            for (let i = 0; i < mv.cues.length; i++) {
                const moves = mv.cues[i].moves;
                for (let m = 0; m < moves.length; m++) {
                    moves[m] = stringToBuffer(moves[m]);
                }
                const des = mv.cues[i].des;
                if (des) {
                    for (let d = 0; d < des.length; d++) {
                        des[d] = stringToBuffer(des[d]);
                    }
                }
            }
        }
    },
    unpackOneMV: function (mv) {
        if (mv) {
            const balls = mv.balls;
            const cues = mv.cues;
            for (let i = 0; i < balls.length; i++) {
                const packed = balls[i];
                balls[i] = MoviePlayer.unpackInitBalls(packed);
            }
            for (let i = 0; i < cues.length; i++) {
                const cue = cues[i];
                cue.hit;
                const moves = cue.moves;
                for (let m = 0; m < moves.length; m++) {
                    const packed = moves[m];
                    moves[m] = MoviePlayer.unpackBallMove(packed);
                }
                const des = cue.des;
                if (des) {
                    for (let m = 0; m < des.length; m++) {
                        const packed = des[m];
                        des[m] = MoviePlayer.unpackBallDestroy(packed);
                    }
                }
            }
            console.log("unpackOneMV", mv);
        }
    },
    resetTimeOneMV: function (mv) {
        if (mv) {
            const cues = mv.cues;
            let baseTime = 0;
            for (let n = 0; n < cues.length; n++) {
                const cue = cues[n];
                const hit = cue.hit;
                if (0 == baseTime) {
                    baseTime = hit.time;
                }
                baseTime = baseTime;
                const moves = cue.moves;
                for (let l = 0; l < moves.length; l++) {
                    const move = moves[l];
                    move.time = move.time - baseTime + 2000;
                    moves[l] = move;
                }
                const des = cue.des;
                if (des) {
                    for (let l = 0; l < des.length; l++) {
                        const item = des[l];
                        item.time = item.time - baseTime + 2000;
                        des[l] = item;
                    }
                }
            }
            console.log("resetTimeOneMV", mv);
        }
    },
    playOneMV: function (mv) {
        mv && mv.balls;
    }
};

export default MoviePlayer;
