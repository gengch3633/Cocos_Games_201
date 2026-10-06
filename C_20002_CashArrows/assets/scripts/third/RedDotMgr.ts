import Singleton from "./Singleton";
import RedDotNode from "./RedDotNode";

export default class RedDotMgr extends Singleton {
    root: any;

    constructor() {
        super();
        this.root = new RedDotNode(" RedDotMgr_Root ");
    }

    addRedDot(e: any) {
        this.root.addChild(e);
    }

    getRedDot(e: any) {
        return this.findChild(e, this.root);
    }

    findChild(e: any, t: any) {
        if (!t) return null;
        for (var i = 0; i < t.children.length; i++) if (t.children[i].id == e) return t.children[i];
        for (i = 0; i < t.children.length; i++) {
            var n = this.findChild(e, t.children[i]);
            if (n) return n;
        }
        return null;
    }
}
