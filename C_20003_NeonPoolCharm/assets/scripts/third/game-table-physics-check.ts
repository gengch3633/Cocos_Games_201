const { ccclass } = cc._decorator;

@ccclass("game-table-physics-check")
export default class game_table_physics_check extends cc.Component {
    onCollisionEnter() {
        console.log("on collision enter");
    }

    onPreSolve() {
        console.log("on collision onPreSolve");
    }

    onPostSolve() {
        console.log("on collision onPostSolve");
    }

    onEndContact() {
        console.log("on collision onEndContact");
    }

    onBeginContact(e, t, o) {
        let n;
        let i;
        const a = o.body.node;
        const r = t.body.node;
        if ((i = (n = a.parent) === null || n === undefined ? undefined : n.getComponent("game_table")) === null || i === undefined) return;
        i.ballEnterHole(a, r);
    }

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
    }
}
