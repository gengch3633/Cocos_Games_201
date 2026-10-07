import UnitBase from "./unit-base";

export default class NodeUnit extends UnitBase {
    trsList: Float64Array;
    localMatList: Float64Array;
    worldMatList: Float64Array;

    constructor(unitID: number, memPool: any, contentNum?: number) {
        super(unitID, memPool, contentNum);
        const i = this._contentNum;
        this.trsList = new Float64Array(10 * i);
        this.localMatList = new Float64Array(16 * i);
        this.worldMatList = new Float64Array(16 * i);
        for (let o = 0; o < i; o++) {
            const r = this._spacesData[o];
            r.trs = new Float64Array(this.trsList.buffer, 80 * o, 10);
            r.localMat = new Float64Array(this.localMatList.buffer, 128 * o, 16);
            r.worldMat = new Float64Array(this.worldMatList.buffer, 128 * o, 16);
        }
    }
}
