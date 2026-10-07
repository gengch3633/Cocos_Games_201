const { ccclass, property } = cc._decorator;

@ccclass
export default class velocity extends cc.Component {
    @property({ type: cc.Node })
    tmpNode: cc.Node = null;

    @property({ type: cc.Label })
    label: cc.Label = null;

    @property
    autoAllocTime = 0.5;

    allocedNodes = 0;
    time = 0;
    stop = false;

    allocNode(): void {
        if (this.node) {
            const e = cc.instantiate(this.tmpNode);
            e.parent = this.node;
            e.active = true;
            e.getComponent(cc.RigidBody);
            this.allocedNodes++;
            if (this.label) {
                this.label.string = "Nodes : " + this.allocedNodes;
            }
        }
    }

    update(e: number): void {
        if (!this.stop) {
            this.time += e;
            if (!(this.time < this.autoAllocTime)) {
                this.time = 0;
                this.allocNode();
            }
        }
    }

    onTouchStart(): void {
        this.stop = !this.stop;
    }

    onLoad(): void {
        this.allocedNodes = 0;
        this.time = 0;
        cc.find("Canvas").on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }
}
