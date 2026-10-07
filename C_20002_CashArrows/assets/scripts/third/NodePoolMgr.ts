import NodePool from "./NodePool";
import Singleton from "./Singleton";

export default class NodePoolMgr extends Singleton {
    pool_snake: NodePool = new NodePool();
    pool_map: NodePool = new NodePool();
}
