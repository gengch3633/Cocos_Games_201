const { ccclass } = cc._decorator;

@ccclass
export default class BallMaterialComp extends cc.Component {
    matIdx: number = null;

    onLoad(): void {
        this.matIdx = this.matIdx || 0;
    }

    click(): void {}

    getMatIdx(): number {
        return this.matIdx;
    }

    setMatIdx(idx: number): void {
        this.matIdx = idx + 0;
        const renderer = this.node.getChildByName("New Sphere").getComponent(cc.MeshRenderer);
        const materials = renderer.getMaterials();
        if (this.matIdx >= materials.length) {
            this.matIdx = 0;
        }
        const material = materials[this.matIdx];
        renderer.setMaterial(0, material);
    }

    update(): void {}
}
