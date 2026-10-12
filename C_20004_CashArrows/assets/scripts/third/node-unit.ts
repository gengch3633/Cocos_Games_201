import UnitBase from "./unit-base";

export default class NodeUnit extends UnitBase {
    public trsList: Float64Array;
    public localMatList: Float64Array;
    public worldMatList: Float64Array;

    constructor(type: any, id: any) {
        super(type, id);

        const contentNum: number = (this as any)._contentNum;
        this.trsList = new Float64Array(10 * contentNum);
        this.localMatList = new Float64Array(16 * contentNum);
        this.worldMatList = new Float64Array(16 * contentNum);

        for (let index = 0; index < contentNum; index++) {
            const spaceData: any = (this as any)._spacesData[index];
            spaceData.trs = new Float64Array(this.trsList.buffer, 80 * index, 10);
            spaceData.localMat = new Float64Array(this.localMatList.buffer, 128 * index, 16);
            spaceData.worldMat = new Float64Array(this.worldMatList.buffer, 128 * index, 16);
        }
    }
}