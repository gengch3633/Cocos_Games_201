const { ccclass } = cc._decorator;

@ccclass("game-table-physics-check")
export default class GameTablePhysicsCheck extends cc.Component {
    onCollisionEnter(): void {
        console.log("on collision enter");
    }

    onPreSolve(): void {
        console.log("on collision onPreSolve");
    }

    onPostSolve(): void {
        console.log("on collision onPostSolve");
    }

    onEndContact(): void {
        console.log("on collision onEndContact");
    }

    onBeginContact(_contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider): void {
        const ballNode = other.body.node;
        const holeNode = self.body.node;
        ballNode.parent?.getComponent("game_table")?.ballEnterHole(ballNode, holeNode);
    }

    onLoad(): void {
        cc.director.getCollisionManager().enabled = true;
    }
}
