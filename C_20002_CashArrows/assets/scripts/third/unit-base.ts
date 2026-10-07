export default class UnitBase {
    unitID: number;
    _memPool: any;
    _data: Uint16Array;
    _contentNum: number;
    _signData: Uint16Array;
    _spacesData: Array<{ index: number; unitID: number; trs?: Float64Array; localMat?: Float64Array; worldMat?: Float64Array }>;

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
        for (let i = 0; i < contentNum; i++) {
            const offset = 2 * i;
            this._signData[offset + 0] = i + 1;
            this._signData[offset + 1] = 0;
            this._spacesData[i] = {
                index: i,
                unitID: unitID
            };
        }
        this._signData[2 * (contentNum - 1)] = 65535;
    }

    hasSpace(): boolean {
        return 65535 !== this._data[0];
    }

    isAllFree(): boolean {
        return 0 == this._data[1];
    }

    pop(): { index: number; unitID: number } | null {
        const head = this._data[0];
        if (65535 === head) {
            return null;
        }
        const index = head;
        const offset = 2 * index;
        const space = this._spacesData[index];
        this._signData[offset + 1] = 1;
        this._data[0] = this._signData[offset + 0];
        this._data[1]++;
        return space;
    }

    push(index: number): void {
        const offset = 2 * index;
        this._signData[offset + 1] = 0;
        this._signData[offset + 0] = this._data[0];
        this._data[0] = index;
        this._data[1]--;
    }

    dump(): void {
        let freeCount = 0;
        let freeChain = this._data[0];
        let freeInfo = "";
        while (65535 != freeChain) {
            freeCount++;
            freeInfo += freeChain + "->";
            freeChain = this._signData[2 * freeChain + 0];
        }
        let usingCount = 0;
        let usingInfo = "";
        for (let i = 0; i < this._contentNum; i++) {
            if (1 == this._signData[2 * i + 1]) {
                usingCount++;
                usingInfo += i + "->";
            }
        }
        const total = freeCount + usingCount;
        console.log("unitID:", this.unitID, "spaceNum:", freeCount, "calc using num:", usingCount, "store using num:", this._data[1], "calc total num:", total, "actually total num:", this._contentNum);
        console.log("free info:", freeInfo);
        console.log("using info:", usingInfo);
        if (usingCount != this._data[1]) {
            cc.error("using num error", "calc using num:", usingCount, "store using num:", this._data[1]);
        }
        if (freeCount + usingCount != this._contentNum) {
            cc.error("total num error", "calc total num:", total, "actually total num:", this._contentNum);
        }
    }
}
