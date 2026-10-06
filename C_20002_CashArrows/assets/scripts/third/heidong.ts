const { ccclass } = cc._decorator;

@ccclass
export default class heidong extends cc.Component {
    gameManager: any = null;
    posInfo: any = null;

    start() {
    }

    Init(e: number) {
        var t = e % this.gameManager.levelInfo.XSize,
            i = Math.floor(e / this.gameManager.levelInfo.XSize);
        this.gameManager.num_mapInfo[t][i] = "o";
        this.node.setPosition(this.getNodePos({
            x: t, y: i
        }));
        console.log(this.gameManager.num_mapInfo);
        this.posInfo = {
            x: t,
            y: i
        };
    }

    getNodePos(e: { x: number; y: number }) {
        var t = this.gameManager.Layout_map.node.children[0].position;
        return cc.v3(50 * e.x, 50 * e.y, 0).addSelf(t);
    }

    showStartAni() {
        var e = this.node.getChildByName("zhangai").getComponent(sp.Skeleton);
        e.setAnimation(0, "heidong", !1);
        e.setAnimation(0, "heidongidle", !0);
    }

    showEndAni() {
        var e = this;
        this.scheduleOnce(function () {
            e.node.getChildByName("zhangai").getComponent(sp.Skeleton).setAnimation(0, "daiji2", !1);
        }, .5);
    }

    setGameManager(e: any) {
        this.gameManager = e;
    }
}
