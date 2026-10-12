import AudioMgr from "./AudioMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";

const { ccclass, property } = cc._decorator;

interface PosInfo {
    x: number;
    y: number;
}

interface ZhanaiInitData {
    Index: number;
    LockTime: number;
}

interface GameManagerRef {
    levelInfo: { XSize: number };
    num_mapInfo: any[][];
    zhanai: Zhanai[];
    Layout_map: any;
}

@ccclass
export default class Zhanai extends cc.Component {
    public gameManager: GameManagerRef = null;

    @property(cc.Label)
    public txt_num: cc.Label = null;

    public num_zhanai: number = 0;

    public posInfo: PosInfo = null;

    public start(): void {
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.notifySnakeNumChange, this.updateNum, this);
    }

    public onDestroy(): void {
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.notifySnakeNumChange, this.updateNum, this);
    }

    public Init(data: ZhanaiInitData): void {
        const x = data.Index % this.gameManager.levelInfo.XSize;
        const y = Math.floor(data.Index / this.gameManager.levelInfo.XSize);

        this.gameManager.num_mapInfo[x][y] = "x";
        this.num_zhanai = data.LockTime;
        this.reference();

        this.posInfo = { x: x, y: y };
        this.node.setPosition(this.getNodePos(this.posInfo));
    }

    public getNodePos(pos: PosInfo): cc.Vec3 {
        const offset: cc.Vec3 = this.gameManager.Layout_map.node.children[0].position;
        return cc.v3(50 * pos.x, 50 * pos.y, 0).addSelf(offset);
    }

    public reference(): void {
        this.txt_num.string = this.num_zhanai.toString();
    }

    public updateNum(): void {
        this.num_zhanai--;
        this.reference();

        if (this.num_zhanai <= 0) {
            const skeleton: sp.Skeleton = this.node.getChildByName("zhanai").getComponent(sp.Skeleton);

            AudioMgr.getInstance().playEffect("audio/unlock_obstacle", InterfaceMgr.bundleName.game);

            this.gameManager.zhanai.splice(this.gameManager.zhanai.indexOf(this), 1);
            this.gameManager.num_mapInfo[this.posInfo.x][this.posInfo.y] = "0";

            this.scheduleOnce(() => {
                skeleton.node.getChildByName("txt_num").active = false;
            }, 0.2);

            skeleton.setAnimation(0, "zhangaixiaochu", false);
            skeleton.setCompleteListener(() => {
                this.node.destroy();
            });
        }
    }

    public setGameManager(gameManager: GameManagerRef): void {
        this.gameManager = gameManager;
    }
}