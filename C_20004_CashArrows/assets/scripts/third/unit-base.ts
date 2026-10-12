const { ccclass } = cc._decorator;

interface SpaceData {
    index: number;
    unitID: number;
}

@ccclass
export default class UnitBase {
    public unitID: number;

    private _memPool: any;
    private _data: Uint16Array;
    private _contentNum: number;
    private _signData: Uint16Array;
    private _spacesData: SpaceData[];

    constructor(unitID: number, memPool: any, contentNum: number = 128) {
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

    public hasSpace(): boolean {
        return 65535 !== this._data[0];
    }

    public isAllFree(): boolean {
        return 0 === this._data[1];
    }

    public pop(): SpaceData | null {
        const head = this._data[0];
        if (65535 === head) {
            return null;
        }
        const index = head;
        const a = 2 * index;
        const space = this._spacesData[index];
        this._signData[a + 1] = 1;
        this._data[0] = this._signData[a + 0];
        this._data[1]++;
        return space;
    }

    public push(index: number): void {
        const a = 2 * index;
        this._signData[a + 1] = 0;
        this._signData[a + 0] = this._data[0];
        this._data[0] = index;
        this._data[1]--;
    }

    public dump(): void {
        let freeCount = 0;
        let freeInfo = "";
        let cur = this._data[0];
        while (65535 !== cur) {
            freeCount++;
            freeInfo += cur + "->";
            cur = this._signData[2 * cur + 0];
        }

        let usingCount = 0;
        let usingInfo = "";
        const total = this._contentNum;
        for (let r = 0; r < total; r++) {
            if (1 === this._signData[2 * r + 1]) {
                usingCount++;
                usingInfo += r + "->";
            }
        }

        const calcTotal = freeCount + usingCount;
        console.log("unitID:", this.unitID, "spaceNum:", freeCount, "calc using num:", usingCount, "store using num:", this._data[1], "calc total num:", calcTotal, "actually total num:", this._contentNum);
        console.log("free info:", freeInfo);
        console.log("using info:", usingInfo);

        if (usingCount !== this._data[1]) {
            cc.error("using num error", "calc using num:", usingCount, "store using num:", this._data[1]);
        }
        if (freeCount + usingCount !== this._contentNum) {
            cc.error("total num error", "calc total num:", calcTotal, "actually total num:", this._contentNum);
        }
    }
}