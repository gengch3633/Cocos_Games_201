import * as BallLogicMgr from "./BallLogicMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BallControlInEditor extends cc.Component {
    @property
    ballID = 0;

    matIdx: number = null;
    deleteOne: ((node: cc.Node) => void) = null;
    startx: number = null;
    starty: number = null;
    ballType: number = null;
    posx: number = null;
    posy: number = null;
    node_editor: cc.Node = null;

    setMatIdx(idx: number): void {
        this.matIdx = idx;
        const renderer = this.node.getChildByName("New Sphere").getComponent(cc.MeshRenderer);
        const materials = renderer.getMaterials();
        if (this.matIdx >= materials.length) {
            this.matIdx = 0;
        }
        const material = materials[this.matIdx];
        renderer.setMaterial(0, material);
    }

    getMatIdx(): number {
        return this.matIdx;
    }

    onEnd(): void {
        console.log("TOUCH_END");
        const node = this.node;
        if (!this.checkAvailable(node)) {
            node.x = this.startx;
            node.y = this.starty;
            this.deleteOne(node);
            node.parent = null;
            node.destroy();
        }
    }

    checkAvailable(node: cc.Node): boolean {
        const checkRect = this.node.parent.getChildByName("node_checkRect");
        if (
            !cc
                .rect(-checkRect.width / 2, -checkRect.height / 2, checkRect.width, checkRect.height)
                .contains(cc.v2(node.x, node.y))
        ) {
            console.log("not contains");
            return false;
        }
        return true;
    }

    onStart(): void {
        console.log("TOUCH_START");
        const node = this.node;
        this.startx = Math.floor(node.x);
        this.starty = Math.floor(node.y);
    }

    onEnable(): void {}

    onCancel(): void {
        console.log("TOUCH_CANCEL");
        const node = this.node;
        if (!this.checkAvailable(node)) {
            node.x = this.startx;
            node.y = this.starty;
        }
    }

    onLoad(): void {
        this.ballID = this.ballID || 0;
        this.ballType = BallLogicMgr.BallIDType_Normal;
        this.matIdx = this.matIdx || 0;
        this.deleteOne = this.deleteOne || null;
        this.posx = 0;
        this.posy = 0;
        this.node_editor = null;
        this.startx = 0;
        this.starty = 0;
    }

    onMove(event: cc.Event.EventTouch): void {
        const node = this.node;
        const touchPoint = cc.v2((event.touch as any)._point.x, (event.touch as any)._point.y);
        const localPos = node.parent.convertToNodeSpaceAR(touchPoint);
        node.x = Math.floor(localPos.x);
        node.y = Math.floor(localPos.y);
    }

    deleteFun(callback: (node: cc.Node) => void): void {
        this.deleteOne = callback;
    }

    update(): void {}
}
