import AudioMgr from "./AudioMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent, bundleName } from "./InterfaceMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class zhanai extends cc.Component {
    gameManager: any = null;

    @property(cc.Label)
    txt_num: cc.Label = null;

    num_zhanai = 0;
    posInfo: { x: number; y: number } | null = null;

    start() {
        GlobalEventMgr.getInstance().on(gameEvent.notifySnakeNumChange, this.updateNum, this);
    }

    onDestroy() {
        GlobalEventMgr.getInstance().off(gameEvent.notifySnakeNumChange, this.updateNum, this);
    }

    Init(e: any) {
        var t = e.Index % this.gameManager.levelInfo.XSize,
            i = Math.floor(e.Index / this.gameManager.levelInfo.XSize);
        this.gameManager.num_mapInfo[t][i] = " x ";
        this.num_zhanai = e.LockTime;
        this.reference();
        this.posInfo = {
            x: t,
            y: i
        };
        this.node.setPosition(this.getNodePos(this.posInfo));
    }

    getNodePos(e: { x: number; y: number }) {
        var t = this.gameManager.Layout_map.node.children[0].position;
        return cc.v3(50 * e.x, 50 * e.y, 0).addSelf(t);
    }

    reference() {
        this.txt_num.string = this.num_zhanai.toString();
    }

    updateNum() {
        var self = this;
        this.num_zhanai--;
        this.reference();
        if (this.num_zhanai <= 0) {
            var skeleton = this.node.getChildByName(" zhanai ").getComponent(sp.Skeleton);
            AudioMgr.getInstance().playEffect(" audio/ unlock_obstacle ", bundleName.game);
            this.gameManager.zhanai.splice(this.gameManager.zhanai.indexOf(this), 1);
            this.gameManager.num_mapInfo[this.posInfo.x][this.posInfo.y] = " 0 ";
            this.scheduleOnce(function () {
                skeleton.node.getChildByName(" txt_num ").active = false;
            }, .2);
            skeleton.setAnimation(0, " zhangaixiaochu ", false);
            skeleton.setCompleteListener(function () {
                self.node.destroy();
            });
        }
    }

    setGameManager(e: any) {
        this.gameManager = e;
    }
}
