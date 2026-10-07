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

    onBeginContact(e: cc.PhysicsContact, t: cc.PhysicsCollider, o: cc.PhysicsCollider): void {
        const a = o.body.node;
        const r = t.body.node;
        a.parent?.getComponent("game_table")?.ballEnterHole(a, r);
    }

    onLoad(): void {
        cc.director.getCollisionManager().enabled = true;
    }
}
