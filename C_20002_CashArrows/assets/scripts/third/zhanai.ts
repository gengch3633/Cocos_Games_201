import AudioMgr from "./AudioMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import { bundleName, gameEvent } from "./InterfaceMgr";

declare const sp: any;

const { ccclass, property } = cc._decorator;

@ccclass
export default class Zhanai extends cc.Component {
    gameManager: any = null;

    @property(cc.Label)
    txt_num: cc.Label | null = null;

    num_zhanai = 0;
    posInfo: { x: number; y: number } | null = null;

    start(): void {
        GlobalEventMgr.getInstance().on(gameEvent.notifySnakeNumChange, this.updateNum, this);
    }

    onDestroy(): void {
        GlobalEventMgr.getInstance().off(gameEvent.notifySnakeNumChange, this.updateNum, this);
    }

    Init(data: { Index: number; LockTime: number }): void {
        const x = data.Index % this.gameManager.levelInfo.XSize;
        const y = Math.floor(data.Index / this.gameManager.levelInfo.XSize);
        this.gameManager.num_mapInfo[x][y] = "x";
        this.num_zhanai = data.LockTime;
        this.reference();
        this.posInfo = { x, y };
        this.node.setPosition(this.getNodePos(this.posInfo));
    }

    getNodePos(pos: { x: number; y: number }): cc.Vec3 {
        const origin = this.gameManager.Layout_map.node.children[0].position;
        return cc.v3(50 * pos.x, 50 * pos.y, 0).addSelf(origin);
    }

    reference(): void {
        if (this.txt_num) {
            this.txt_num.string = this.num_zhanai.toString();
        }
    }

    updateNum(): void {
        this.num_zhanai--;
        this.reference();
        if (this.num_zhanai <= 0) {
            const skeleton = this.node.getChildByName("zhanai")!.getComponent(sp.Skeleton);
            AudioMgr.getInstance().playEffect("audio/unlock_obstacle", bundleName.game);
            this.gameManager.zhanai.splice(this.gameManager.zhanai.indexOf(this), 1);
            this.gameManager.num_mapInfo[this.posInfo!.x][this.posInfo!.y] = "0";
            this.scheduleOnce(() => {
                skeleton.node.getChildByName("txt_num")!.active = false;
            }, 0.2);
            skeleton.setAnimation(0, "zhangaixiaochu", false);
            skeleton.setCompleteListener(() => {
                this.node.destroy();
            });
        }
    }

    setGameManager(manager: any): void {
        this.gameManager = manager;
    }
}
