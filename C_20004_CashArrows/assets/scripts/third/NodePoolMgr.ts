import NodePool from "./NodePool";
import Singleton from "./Singleton";

const { ccclass } = cc._decorator;

@ccclass
export default class NodePoolMgr extends Singleton {
    public pool_snake: NodePool;
    public pool_map: NodePool;

    constructor() {
        super();
        this.pool_snake = new NodePool();
        this.pool_map = new NodePool();
    }
}