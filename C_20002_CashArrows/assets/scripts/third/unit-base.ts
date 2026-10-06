export default function UnitBase(this: any, unitID: number, memPool: any, contentNum?: number) {
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
        this._spacesData[n] = {
            index: n,
            unitID: unitID
        };
    }
    this._signData[2 * (contentNum - 1)] = 65535;
}

const proto = UnitBase.prototype;

proto.hasSpace = function () {
    return 65535 !== this._data[0];
};

proto.isAllFree = function () {
    return 0 == this._data[1];
};

proto.pop = function () {
    const e = this._data[0];
    if (65535 === e) return null;
    const t = e;
    const i = 2 * t;
    const n = this._spacesData[t];
    this._signData[i + 1] = 1;
    this._data[0] = this._signData[i + 0];
    this._data[1]++;
    return n;
};

proto.push = function (e: number) {
    const t = 2 * e;
    this._signData[t + 1] = 0;
    this._signData[t + 0] = this._data[0];
    this._data[0] = e;
    this._data[1]--;
};

proto.dump = function () {
    let e = 0;
    let t = this._data[0];
    let i = "";
    for (; 65535 != t;) {
        e++;
        i += t + "->";
        t = this._signData[2 * t + 0];
    }
    let n = 0;
    let a = "";
    const o = this._contentNum;
    for (let r = 0; r < o; r++) {
        if (1 == this._signData[2 * r + 1]) {
            n++;
            a += r + "->";
        }
    }
    const s = e + n;
    console.log("unitID:", this.unitID, "spaceNum:", e, "calc using num:", n, "store using num:", this._data[1], "calc total num:", s, "actually total num:", this._contentNum);
    console.log("free info:", i);
    console.log("using info:", a);
    n != this._data[1] && cc.error("using num error", "calc using num:", n, "store using num:", this._data[1]);
    e + n != this._contentNum && cc.error("total num error", "calc total num:", s, "actually total num:", this._contentNum);
};
