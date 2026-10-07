import UnitBase from "./unit-base";

export default class NodeUnit extends UnitBase {
    trsList: Float64Array;
    localMatList: Float64Array;
    worldMatList: Float64Array;

    constructor(unitID: number, memPool: any) {
        super(unitID, memPool);
        const contentNum = this._contentNum;
        this.trsList = new Float64Array(10 * contentNum);
        this.localMatList = new Float64Array(16 * contentNum);
        this.worldMatList = new Float64Array(16 * contentNum);
        for (let i = 0; i < contentNum; i++) {
            const space = this._spacesData[i];
            space.trs = new Float64Array(this.trsList.buffer, 80 * i, 10);
            space.localMat = new Float64Array(this.localMatList.buffer, 128 * i, 16);
            space.worldMat = new Float64Array(this.worldMatList.buffer, 128 * i, 16);
        }
    }
}
