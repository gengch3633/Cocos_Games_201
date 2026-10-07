export default class UnitBase {
    unitID: number;
    _memPool: any;
    _data: Uint16Array;
    _contentNum: number;
    _signData: Uint16Array;
    _spacesData: any[];

    constructor(unitID: number, memPool: any, contentNum?: number) {
        contentNum = contentNum || 128;
        this.unitID = unitID;
        this._memPool = memPool;
        this._data = new Uint16Array(2);
        this._data[0] = 0;
        this._data[1] = 0;
        this._contentNum = contentNum;
        this._signData = new Uint16Array(2 * this._contentNum);
        this._spacesData = [];
        for (let n = 0; n < contentNum; n++) {
            const a = 2 * n;
            this._signData[a + 0] = n + 1;
            this._signData[a + 1] = 0;
            this._spacesData[n] = { index: n, unitID: unitID };
        }
        this._signData[2 * (contentNum - 1)] = 65535;
    }

    hasSpace(): boolean {
        return this._data[0] !== 65535;
    }

    isAllFree(): boolean {
        return this._data[1] === 0;
    }

    pop(): any {
        const e = this._data[0];
        if (e === 65535) return null;
        const t = e;
        const i = 2 * t;
        const n = this._spacesData[t];
        this._signData[i + 1] = 1;
        this._data[0] = this._signData[i + 0];
        this._data[1]++;
        return n;
    }

    push(index: number): void {
        const t = 2 * index;
        this._signData[t + 1] = 0;
        this._signData[t + 0] = this._data[0];
        this._data[0] = index;
        this._data[1]--;
    }

    dump(): void {
        let e = 0;
        let t = this._data[0];
        let i = "";
        while (t !== 65535) {
            e++;
            i += t + "->";
            t = this._signData[2 * t + 0];
        }
        let n = 0;
        let a = "";
        const o = this._contentNum;
        for (let r = 0; r < o; r++) {
            if (this._signData[2 * r + 1] === 1) {
                n++;
                a += r + "->";
            }
        }
        const s = e + n;
        console.log("unitID:", this.unitID, "spaceNum:", e, "calc using num:", n, "store using num:", this._data[1], "calc total num:", s, "actually total num:", this._contentNum);
        console.log("free info:", i);
        console.log("using info:", a);
        if (n !== this._data[1]) cc.error("using num error", "calc using num:", n, "store using num:", this._data[1]);
        if (e + n !== this._contentNum) cc.error("total num error", "calc total num:", s, "actually total num:", this._contentNum);
    }
}
