const { ccclass, property } = cc._decorator;

@ccclass
export default class BallEditor extends cc.Component {
    @property(cc.Node)
    Light: cc.Node = null;

    matIdx = null;

    SetSelect(e = true) {
        this.Light.active = e;
    }

    setMatIdx(e) {
        this.matIdx = e + 0;
        const t = this.node.getChildByName("New Sphere").getComponent(cc.MeshRenderer);
        const o = t.getMaterials();
        this.matIdx >= o.length && (this.matIdx = 0);
        const n = o[this.matIdx];
        t.setMaterial(0, n);
    }
}
