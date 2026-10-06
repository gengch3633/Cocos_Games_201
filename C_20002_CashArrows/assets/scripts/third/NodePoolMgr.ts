import NodePool from "./NodePool";
import Singleton from "./Singleton";

export default class NodePoolMgr extends Singleton {
    pool_snake: any;
    pool_map: any;

    constructor() {
        super();
        this.pool_snake = new NodePool();
        this.pool_map = new NodePool();
    }
}
