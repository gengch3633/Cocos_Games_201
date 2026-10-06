import UnitBase from "./unit-base";

const Float64 = Float64Array;
Uint32Array;
Uint32Array;
Uint32Array;
Int32Array;
Uint8Array;
Uint8Array;
Uint8Array;
Uint32Array;

function NodeUnit(this: any, unitID: number, memPool: any) {
    UnitBase.call(this, unitID, memPool);
    const contentNum = this._contentNum;
    this.trsList = new Float64(10 * contentNum);
    this.localMatList = new Float64(16 * contentNum);
    this.worldMatList = new Float64(16 * contentNum);
    for (let o = 0; o < contentNum; o++) {
        const r = this._spacesData[o];
        r.trs = new Float64(this.trsList.buffer, 80 * o, 10);
        r.localMat = new Float64(this.localMatList.buffer, 128 * o, 16);
        r.worldMat = new Float64(this.worldMatList.buffer, 128 * o, 16);
    }
}

function F() {}
F.prototype = UnitBase.prototype;
NodeUnit.prototype = new F();
NodeUnit.prototype.constructor = NodeUnit;

export default NodeUnit;
