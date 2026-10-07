const { ccclass, property } = cc._decorator;

@ccclass
export default class BallEditor extends cc.Component {
    @property(cc.Node)
    Light: cc.Node = null;

    matIdx: number = null;

    SetSelect(selected: boolean = true): void {
        this.Light.active = selected;
    }

    setMatIdx(idx: number): void {
        this.matIdx = idx + 0;
        const renderer = this.node.getChildByName("New Sphere").getComponent(cc.MeshRenderer);
        const materials = renderer.getMaterials();
        if (this.matIdx >= materials.length) {
            this.matIdx = 0;
        }
        const mat = materials[this.matIdx];
        renderer.setMaterial(0, mat);
    }
}
