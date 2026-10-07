const scaleToInt = (e: number): number => Math.floor(10 * e);

const scaleFromInt = (e: number): number => e / 10;

const arrayBufferToString = (e: ArrayBuffer): string => {
    const t = new Uint8Array(e);
    return String.fromCharCode.apply(null, t as unknown as number[]);
};

const stringToArrayBuffer = (e: string): ArrayBuffer => {
    const t = new ArrayBuffer(e.length);
    const o = new Uint8Array(t);
    for (let n = 0, i = e.length; n < i; n++) {
        o[n] = e.charCodeAt(n);
    }
    return t;
};

interface CueHitInfo {
    rad: number;
    power: number;
    time: number;
    radAngle: number;
    radVx: number;
    radVy: number;
}

interface CueInfo {
    hit: CueHitInfo;
    moves: ArrayBuffer[] | string[];
    des: ArrayBuffer[] | string[];
}

interface OneMV {
    balls?: ArrayBuffer[] | string[];
    cues?: CueInfo[];
}

const MoviePlayer = {
    refreshTime: new Date().getTime(),
    curCueInfo: null as CueInfo | null,
    oneMV: {} as OneMV,

    createNewMV(): void {
        MoviePlayer.oneMV = {};
    },

    oneCue(e: { rad: number; power: number; radAngle: number; radVx: number; radVy: number }): void {
        MoviePlayer.oneMV.cues = MoviePlayer.oneMV.cues || [];
        const t: CueInfo = {
            hit: {
                rad: e.rad,
                power: e.power,
                time: new Date().getTime() - MoviePlayer.refreshTime,
                radAngle: e.radAngle,
                radVx: e.radVx,
                radVy: e.radVy,
            },
            moves: [],
            des: [],
        };
        MoviePlayer.oneMV.cues.push(t);
        MoviePlayer.curCueInfo = t;
        console.log("MoviePlayer.oneCue", t);
    },

    packInitBalls(e: { ballID: number; ballType: number; ballMatIdx: number; x: number; y: number }): void {
        const t = new ArrayBuffer(10);
        const i = new DataView(t, 0, 10);
        i.setUint16(0, e.ballID, true);
        i.setUint16(2, e.ballType, true);
        i.setUint16(4, e.ballMatIdx, true);
        i.setInt16(6, scaleToInt(e.x), true);
        i.setInt16(8, scaleToInt(e.y), true);
        if (MoviePlayer.oneMV) {
            MoviePlayer.oneMV.balls = MoviePlayer.oneMV.balls || [];
            MoviePlayer.oneMV.balls.push(arrayBufferToString(t));
        }
    },

    packBallMove(e: { ballID: number; time: number; x: number; y: number; vx: number; vy: number }): void {
        const t = new ArrayBuffer(14);
        const i = new DataView(t, 0, 14);
        i.setUint16(0, e.ballID, true);
        i.setUint32(2, e.time - MoviePlayer.refreshTime, true);
        i.setInt16(6, scaleToInt(e.x), true);
        i.setInt16(8, scaleToInt(e.y), true);
        i.setInt16(10, scaleToInt(e.vx), true);
        i.setInt16(12, scaleToInt(e.vy), true);
        MoviePlayer.curCueInfo && MoviePlayer.curCueInfo.moves.push(arrayBufferToString(t));
    },

    packBallDestroy(e: { ballID: number; time: number }): void {
        const t = new ArrayBuffer(6);
        const n = new DataView(t, 0, 6);
        n.setUint16(0, e.ballID, true);
        n.setUint32(2, e.time - MoviePlayer.refreshTime, true);
        MoviePlayer.curCueInfo && MoviePlayer.curCueInfo.des.push(arrayBufferToString(t));
    },

    unpackInitBalls(e: ArrayBuffer): { ballID: number; ballType: number; ballMatIdx: number; x: number; y: number } {
        const t: any = {};
        const o = new DataView(e);
        t.ballID = o.getUint16(0, true);
        t.ballType = o.getUint16(2, true);
        t.ballMatIdx = o.getUint16(4, true);
        t.x = scaleFromInt(o.getInt16(6, true));
        t.y = scaleFromInt(o.getInt16(8, true));
        return t;
    },

    unpackBallMove(e: ArrayBuffer): { ballID: number; time: number; x: number; y: number; vx: number; vy: number } {
        const t: any = {};
        const o = new DataView(e);
        t.ballID = o.getUint16(0, true);
        t.time = o.getUint32(2, true);
        t.x = scaleFromInt(o.getInt16(6, true));
        t.y = scaleFromInt(o.getInt16(8, true));
        t.vx = scaleFromInt(o.getInt16(10, true));
        t.vy = scaleFromInt(o.getInt16(12, true));
        return t;
    },

    unpackBallDestroy(e: ArrayBuffer): { ballID: number; time: number } {
        const t: any = {};
        const o = new DataView(e);
        t.ballID = o.getUint16(0, true);
        t.time = o.getUint32(2, true);
        return t;
    },

    compress(): string | null {
        console.log("compress", MoviePlayer.oneMV);
        if (MoviePlayer.oneMV) {
            const e = JSON.stringify(MoviePlayer.oneMV);
            console.log("zip_obj", typeof e, e.length);
            return e;
        }
        return null;
    },

    uncompress(e: string): OneMV {
        const t = e;
        const n = JSON.parse(t);
        MoviePlayer.oneMV_strToArrayBuffer(n);
        console.log("uncompress", n);
        MoviePlayer.unpackOneMV(n);
        MoviePlayer.resetTimeOneMV(n);
        return n;
    },

    oneMV_strToArrayBuffer(e: OneMV): void {
        if (e.balls) {
            for (let t = 0; t < e.balls.length; t++) {
                const o = e.balls[t];
                e.balls[t] = stringToArrayBuffer(o as string);
            }
        }
        if (e.cues) {
            for (let t = 0; t < e.cues.length; t++) {
                const n = e.cues[t].moves;
                for (let i = 0; i < n.length; i++) {
                    n[i] = stringToArrayBuffer(n[i] as string);
                }
                const a = e.cues[t].des;
                if (a) {
                    for (let l = 0; l < a.length; l++) {
                        a[l] = stringToArrayBuffer(a[l] as string);
                    }
                }
            }
        }
    },

    unpackOneMV(e: OneMV): void {
        if (e) {
            const t = e.balls;
            const n = e.cues;
            for (let i = 0; i < t.length; i++) {
                let a = t[i];
                t[i] = MoviePlayer.unpackInitBalls(a as ArrayBuffer) as any;
            }
            for (let i = 0; i < n.length; i++) {
                const r = n[i];
                r.hit;
                const l = r.moves;
                for (let s = 0; s < l.length; s++) {
                    let a = l[s];
                    l[s] = MoviePlayer.unpackBallMove(a as ArrayBuffer) as any;
                }
                const c = r.des;
                if (c) {
                    for (let s = 0; s < c.length; s++) {
                        let a = c[s];
                        c[s] = MoviePlayer.unpackBallDestroy(a as ArrayBuffer) as any;
                    }
                }
            }
            console.log("unpackOneMV", e);
        }
    },

    resetTimeOneMV(e: OneMV): void {
        if (e) {
            const t = e.cues;
            let o = 0;
            for (let n = 0; n < t.length; n++) {
                const i = t[n];
                const a = i.hit;
                if (0 == o) {
                    o = a.time;
                }
                o = o;
                const r = i.moves;
                for (let l = 0; l < r.length; l++) {
                    const s = r[l] as any;
                    s.time = s.time - o + 2e3;
                    r[l] = s;
                }
                const c = i.des;
                if (c) {
                    for (let l = 0; l < c.length; l++) {
                        const u = c[l] as any;
                        u.time = u.time - o + 2e3;
                        c[l] = u;
                    }
                }
            }
            console.log("resetTimeOneMV", e);
        }
    },

    playOneMV(e: OneMV): void {
        e && e.balls;
    },
};

export default MoviePlayer;
