import AudioManager, { DEFAULT_BGM_NAME } from "./AudioManager";
import GuideEvent from "./GuideEvent";

declare const async: {
    eachSeries<T>(
        arr: T[],
        iteratee: (item: T, callback: () => void) => void,
        done: () => void
    ): void;
};

declare function require(module: string): { task: unknown };

interface GodGuideComponent extends cc.Component {
    getGuideId: number;
    stepId: number;
    setGuideId(id: number): void;
    setTask(task: unknown): void;
    run(callback: () => void): void;
    end(): void;
    showVideo(path: string): void;
}

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

    private _godGuide: GodGuideComponent = null;

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
            node.setPosition(0, 0, 0);
            node.parent = this.parent || this.node;
            this._godGuide = node.getComponent("GodGuide") as GodGuideComponent;
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

    runTask(updateFirst = true): void {
        console.log("guidetime runTask", cc.director.getTotalTime());
        if (updateFirst) {
            this.updateGuide();
        }
        async.eachSeries(this.tasks, (taskFile, next) => {
            console.log("taskFile---------->", taskFile);
            const task = require(taskFile).task;
            this._godGuide.setTask(task);
            this._godGuide.run(next);
        }, () => {
            cc.log("任务全部完成");
            this._godGuide.end();
        });
    }

    checkGuide(): void {
        if (!this.id) {
            this.emit(GuideEvent.OpenMain);
        }
    }

    showVideo(path: string): void {
        this._godGuide.showVideo(path);
    }
}
