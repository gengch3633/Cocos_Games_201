interface MovieCueInfo {
    hit: {
        rad: number;
        power: number;
        time: number;
        radAngle: number;
        radVx: number;
        radVy: number;
    };
    moves: string[];
    des: string[];
}

interface MovieData {
    balls?: ArrayBuffer[] | any[];
    cues?: MovieCueInfo[];
}

const scaleToInt = (value: number): number => Math.floor(10 * value);
const scaleFromInt = (value: number): number => value / 10;

const arrayBufferToString = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    return String.fromCharCode.apply(null, bytes as unknown as number[]);
};

const stringToArrayBuffer = (text: string): ArrayBuffer => {
    const buffer = new ArrayBuffer(text.length);
    const bytes = new Uint8Array(buffer);
    for (let i = 0, len = text.length; i < len; i++) {
        bytes[i] = text.charCodeAt(i);
    }
    return buffer;
};

export let refreshTime = new Date().getTime();
export let curCueInfo: MovieCueInfo = null;
export let oneMV: MovieData = {};

export function createNewMV(): void {
    oneMV = {};
}

export function oneCue(data: {
    rad: number;
    power: number;
    radAngle: number;
    radVx: number;
    radVy: number;
}): void {
    oneMV.cues = oneMV.cues || [];
    const cue: MovieCueInfo = {
        hit: {
            rad: data.rad,
            power: data.power,
            time: new Date().getTime() - refreshTime,
            radAngle: data.radAngle,
            radVx: data.radVx,
            radVy: data.radVy,
        },
        moves: [],
        des: [],
    };
    oneMV.cues.push(cue);
    curCueInfo = cue;
    console.log("MoviePlayer.oneCue", cue);
}

export function packInitBalls(data: {
    ballID: number;
    ballType: number;
    ballMatIdx: number;
    x: number;
    y: number;
}): void {
    const buffer = new ArrayBuffer(10);
    const view = new DataView(buffer, 0, 10);
    view.setUint16(0, data.ballID, true);
    view.setUint16(2, data.ballType, true);
    view.setUint16(4, data.ballMatIdx, true);
    view.setInt16(6, scaleToInt(data.x), true);
    view.setInt16(8, scaleToInt(data.y), true);
    if (oneMV) {
        oneMV.balls = oneMV.balls || [];
        oneMV.balls.push(arrayBufferToString(buffer));
    }
}

export function packBallMove(data: {
    ballID: number;
    time: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
}): void {
    const buffer = new ArrayBuffer(14);
    const view = new DataView(buffer, 0, 14);
    view.setUint16(0, data.ballID, true);
    view.setUint32(2, data.time - refreshTime, true);
    view.setInt16(6, scaleToInt(data.x), true);
    view.setInt16(8, scaleToInt(data.y), true);
    view.setInt16(10, scaleToInt(data.vx), true);
    view.setInt16(12, scaleToInt(data.vy), true);
    if (curCueInfo) {
        curCueInfo.moves.push(arrayBufferToString(buffer));
    }
}

export function packBallDestroy(data: { ballID: number; time: number }): void {
    const buffer = new ArrayBuffer(6);
    const view = new DataView(buffer, 0, 6);
    view.setUint16(0, data.ballID, true);
    view.setUint32(2, data.time - refreshTime, true);
    if (curCueInfo) {
        curCueInfo.des.push(arrayBufferToString(buffer));
    }
}

export function unpackInitBalls(buffer: ArrayBuffer): any {
    const result: any = {};
    const view = new DataView(buffer);
    result.ballID = view.getUint16(0, true);
    result.ballType = view.getUint16(2, true);
    result.ballMatIdx = view.getUint16(4, true);
    result.x = scaleFromInt(view.getInt16(6, true));
    result.y = scaleFromInt(view.getInt16(8, true));
    return result;
}

export function unpackBallMove(buffer: ArrayBuffer): any {
    const result: any = {};
    const view = new DataView(buffer);
    result.ballID = view.getUint16(0, true);
    result.time = view.getUint32(2, true);
    result.x = scaleFromInt(view.getInt16(6, true));
    result.y = scaleFromInt(view.getInt16(8, true));
    result.vx = scaleFromInt(view.getInt16(10, true));
    result.vy = scaleFromInt(view.getInt16(12, true));
    return result;
}

export function unpackBallDestroy(buffer: ArrayBuffer): any {
    const result: any = {};
    const view = new DataView(buffer);
    result.ballID = view.getUint16(0, true);
    result.time = view.getUint32(2, true);
    return result;
}

export function compress(): string {
    console.log("compress", oneMV);
    if (oneMV) {
        const json = JSON.stringify(oneMV);
        console.log("zip_obj", typeof json, json.length);
        return json;
    }
    return null;
}

export function uncompress(text: string): any {
    const parsed = JSON.parse(text);
    oneMV_strToArrayBuffer(parsed);
    console.log("uncompress", parsed);
    unpackOneMV(parsed);
    resetTimeOneMV(parsed);
    return parsed;
}

export function oneMV_strToArrayBuffer(data: any): void {
    if (data.balls) {
        for (let i = 0; i < data.balls.length; i++) {
            data.balls[i] = stringToArrayBuffer(data.balls[i]);
        }
    }
    if (data.cues) {
        for (let i = 0; i < data.cues.length; i++) {
            const moves = data.cues[i].moves;
            for (let j = 0; j < moves.length; j++) {
                moves[j] = stringToArrayBuffer(moves[j]);
            }
            const des = data.cues[i].des;
            if (des) {
                for (let j = 0; j < des.length; j++) {
                    des[j] = stringToArrayBuffer(des[j]);
                }
            }
        }
    }
}

export function unpackOneMV(data: any): void {
    if (data) {
        const balls = data.balls;
        const cues = data.cues;
        for (let i = 0; i < balls.length; i++) {
            balls[i] = unpackInitBalls(balls[i]);
        }
        for (let i = 0; i < cues.length; i++) {
            const cue = cues[i];
            const moves = cue.moves;
            for (let j = 0; j < moves.length; j++) {
                moves[j] = unpackBallMove(moves[j]);
            }
            const des = cue.des;
            if (des) {
                for (let j = 0; j < des.length; j++) {
                    des[j] = unpackBallDestroy(des[j]);
                }
            }
        }
        console.log("unpackOneMV", data);
    }
}

export function resetTimeOneMV(data: any): void {
    if (data) {
        const cues = data.cues;
        let baseTime = 0;
        for (let i = 0; i < cues.length; i++) {
            const cue = cues[i];
            const hit = cue.hit;
            if (baseTime == 0) {
                baseTime = hit.time;
            }
            const moves = cue.moves;
            for (let j = 0; j < moves.length; j++) {
                moves[j].time = moves[j].time - baseTime + 2000;
            }
            const des = cue.des;
            if (des) {
                for (let j = 0; j < des.length; j++) {
                    des[j].time = des[j].time - baseTime + 2000;
                }
            }
        }
        console.log("resetTimeOneMV", data);
    }
}

export function playOneMV(data: any): void {
    if (data) {
        data.balls;
    }
}
