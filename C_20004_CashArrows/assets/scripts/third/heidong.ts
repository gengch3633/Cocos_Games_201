const { ccclass } = cc._decorator;

interface IHeidongPosInfo {
    x: number;
    y: number;
}

interface IHeidongGameManager {
    levelInfo: { XSize: number };
    num_mapInfo: string[][];
    Layout_map: { node: cc.Node };
}

@ccclass
export default class heidong extends cc.Component {
    private gameManager: IHeidongGameManager = null;
    private posInfo: IHeidongPosInfo = null;

    protected start(): void {
    }

    public Init(index: number): void {
        const x = index % this.gameManager.levelInfo.XSize;
        const y = Math.floor(index / this.gameManager.levelInfo.XSize);
        this.gameManager.num_mapInfo[x][y] = "o";
        this.node.setPosition(this.getNodePos({ x, y }));
        console.log(this.gameManager.num_mapInfo);
        this.posInfo = { x, y };
    }

    public getNodePos(pos: IHeidongPosInfo): cc.Vec3 {
        const basePos: cc.Vec3 = this.gameManager.Layout_map.node.children[0].position;
        return cc.v3(50 * pos.x, 50 * pos.y, 0).addSelf(basePos);
    }

    public showStartAni(): void {
        const skeleton = this.node.getChildByName("zhangai").getComponent(sp.Skeleton);
        skeleton.setAnimation(0, "heidong", false);
        skeleton.setAnimation(0, "heidongidle", true);
    }

    public showEndAni(): void {
        this.scheduleOnce(() => {
            this.node.getChildByName("zhangai").getComponent(sp.Skeleton).setAnimation(0, "daiji2", false);
        }, 0.5);
    }

    public setGameManager(gameManager: IHeidongGameManager): void {
        this.gameManager = gameManager;
    }
}