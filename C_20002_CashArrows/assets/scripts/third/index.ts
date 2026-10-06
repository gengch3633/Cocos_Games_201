import NodeUnit from "./node-unit";
import NodeMemPool from "./node-mem-pool";

export const NodeMemPoolInstance = new (NodeMemPool as any)(NodeUnit);
export { NodeMemPoolInstance as NodeMemPool };
