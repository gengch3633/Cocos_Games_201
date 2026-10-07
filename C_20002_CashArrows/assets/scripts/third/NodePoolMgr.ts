import NodePool from "./NodePool";
import Singleton from "./Singleton";

export default class NodePoolMgr extends Singleton {
    pool_snake = new NodePool();
    pool_map = new NodePool();
}
