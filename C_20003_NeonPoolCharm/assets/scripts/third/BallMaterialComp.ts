const { ccclass } = cc._decorator;

@ccclass
export default class BallMaterialComp extends cc.Component {
    matIdx = null;

    onLoad() {
        this.matIdx = this.matIdx || 0;
    }

    click() {}

    getMatIdx() {
        return this.matIdx;
    }

    setMatIdx(e) {
        this.matIdx = e + 0;
        const t = this.node.getChildByName("New Sphere").getComponent(cc.MeshRenderer);
        const o = t.getMaterials();
        this.matIdx >= o.length && (this.matIdx = 0);
        const n = o[this.matIdx];
        t.setMaterial(0, n);
    }

    update() {}
}
