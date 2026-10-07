const { ccclass } = cc._decorator;

@ccclass
export default class heidong extends cc.Component {
    gameManager: any = null;
    posInfo: { x: number; y: number } = null;

    Init(index: number): void {
        const x = index % this.gameManager.levelInfo.XSize;
        const y = Math.floor(index / this.gameManager.levelInfo.XSize);
        this.gameManager.num_mapInfo[x][y] = "o";
        this.node.setPosition(this.getNodePos({ x, y }));
        console.log(this.gameManager.num_mapInfo);
        this.posInfo = { x, y };
    }

    getNodePos(pos: { x: number; y: number }): cc.Vec3 {
        const origin = this.gameManager.Layout_map.node.children[0].position;
        return cc.v3(50 * pos.x, 50 * pos.y, 0).addSelf(origin);
    }

    showStartAni(): void {
        const skeleton = this.node.getChildByName("zhangai").getComponent(sp.Skeleton);
        skeleton.setAnimation(0, "heidong", false);
        skeleton.setAnimation(0, "heidongidle", true);
    }

    showEndAni(): void {
        this.scheduleOnce(() => {
            this.node.getChildByName("zhangai").getComponent(sp.Skeleton).setAnimation(0, "daiji2", false);
        }, 0.5);
    }

    setGameManager(manager: any): void {
        this.gameManager = manager;
    }
}
