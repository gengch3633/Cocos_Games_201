const { ccclass, property } = cc._decorator;

@ccclass
export default class velocity extends cc.Component {
    @property({
        type: cc.Node
    })
    tmpNode = null;

    @property({
        type: cc.Label
    })
    label = null;

    @property
    autoAllocTime = 0.5;

    allocedNodes = null;
    time = null;
    node = null;
    stop = null;

    allocNode() {
        if (this.node) {
            const e = cc.instantiate(this.tmpNode);
            e.parent = this.node;
            e.active = true;
            e.getComponent(cc.RigidBody);
            this.allocedNodes++;
            this.label && (this.label.string = "Nodes : " + this.allocedNodes);
        }
    }

    update(e) {
        if (!this.stop) {
            this.time += e;
            if (!(this.time < this.autoAllocTime)) {
                this.time = 0;
                this.allocNode();
            }
        }
    }

    onTouchStart() {
        this.stop = !this.stop;
    }

    onLoad() {
        this.allocedNodes = 0;
        this.time = 0;
        cc.find("Canvas").on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }
}
