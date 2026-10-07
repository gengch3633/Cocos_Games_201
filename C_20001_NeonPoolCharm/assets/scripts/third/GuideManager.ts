import AudioManager, { DEFAULT_BGM_NAME } from "./AudioManager";
import GodGuide from "./GodGuide";
import GuideEvent from "./GuideEvent";

declare const async: any;

const { ccclass, property } = cc._decorator;

@ccclass
export default class GuideManager extends cc.Component {
    static Instance: GuideManager = null;

    @property(cc.Prefab)
    PREFAB: cc.Prefab = null;

    @property(cc.Node)
    parent: cc.Node = null;

    @property()
    zIndex = 0;

    @property([cc.String])
    tasks: string[] = [];

    private _godGuide: GodGuide = null;

    get id(): number {
        return this._godGuide.getGuideId;
    }

    get stepId(): number {
        return this._godGuide.stepId;
    }

    onLoad(): void {
        GuideManager.Instance = this;
        this.loadPrefab();
        cc.game.on(GuideEvent.VideoEnd, this.playMusic, this);
    }

    playMusic(): void {
        if (!AudioManager.getInstance().isMusicPlaying()) {
            AudioManager.getInstance().playMusic(DEFAULT_BGM_NAME, true, true);
        }
    }

    updateGuide(): void {
        const guideId = this.id;
        console.log("updateGuide", guideId);
        if (guideId == 104) {
            this._godGuide.setGuideId(105);
        }
        if (guideId == 203) {
            this._godGuide.setGuideId(204);
        }
        if (guideId == 303 || guideId == 304) {
            this._godGuide.setGuideId(305);
        }
    }

    loadPrefab(): void {
        try {
            const node = cc.instantiate(this.PREFAB);
            node.position = cc.v3(0, 0, 0);
            node.parent = this.parent || this.node;
            this._godGuide = node.getComponent(GodGuide);
        } catch (err) {
            cc.error(this.PREFAB);
            cc.error(err);
        }
    }

    emit(event: string): void {
        this.scheduleOnce(() => {
            cc.game.emit(event);
        }, 0.1);
    }

    runTask(updateGuide: boolean = true): void {
        console.log("guidetime runTask", cc.director.getTotalTime());
        if (updateGuide) {
            this.updateGuide();
        }
        async.eachSeries(
            this.tasks,
            (taskFile: string, next: () => void) => {
                console.log("taskFile---------->", taskFile);
                const mod = require("./" + taskFile);
                const task = mod.task;
                this._godGuide.setTask(task);
                this._godGuide.run(next);
            },
            () => {
                cc.log("任务全部完成");
                this._godGuide.end();
            }
        );
    }

    checkGuide(): void {
        if (!this.id) {
            this.emit(GuideEvent.OpenMain);
        }
    }

    showVideo(data: any): void {
        this._godGuide.showVideo(data);
    }
}
