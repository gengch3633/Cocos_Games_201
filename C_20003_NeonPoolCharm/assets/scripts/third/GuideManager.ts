import AudioManager, { DEFAULT_BGM_NAME } from "./AudioManager";
import GuideEvent from "./GuideEvent";

declare function require(name: string): any;
declare const async: any;

const { ccclass, property } = cc._decorator;

@ccclass
export default class GuideManager extends cc.Component {

    @property(cc.Prefab)
    PREFAB: cc.Prefab = null;

    @property(cc.Node)
    parent: cc.Node = null;

    @property()
    zIndex = 0;

    @property([cc.String])
    tasks = [];

    _godGuide = null;

    static Instance: GuideManager = null;

    get id() {
        return this._godGuide.getGuideId;
    }

    get stepId() {
        return this._godGuide.stepId;
    }

    onLoad() {
        GuideManager.Instance = this;
        this.loadPrefab();
        cc.game.on(GuideEvent.VideoEnd, this.playMusic, this);
    }

    playMusic() {
        AudioManager.getInstance().isMusicPlaying() || AudioManager.getInstance().playMusic(DEFAULT_BGM_NAME, true, true);
    }

    updateGuide() {
        const id = this.id;
        console.log("updateGuide", id);
        104 == id && this._godGuide.setGuideId(105);
        203 == id && this._godGuide.setGuideId(204);
        303 != id && 304 != id || this._godGuide.setGuideId(305);
    }

    loadPrefab() {
        try {
            const node = cc.instantiate(this.PREFAB);
            node.position = cc.v3(0, 0, 0);
            node.parent = this.parent || this.node;
            this._godGuide = node.getComponent("GodGuide");
        } catch (err) {
            cc.error(this.PREFAB);
            cc.error(err);
        }
    }

    emit(event) {
        this.scheduleOnce(function () {
            cc.game.emit(event);
        }, .1);
    }

    runTask(update?) {
        const self = this;
        if (undefined === update) {
            update = true;
        }
        console.log("guidetime runTask", cc.director.getTotalTime());
        update && this.updateGuide();
        async.eachSeries(this.tasks, function (task, next) {
            console.log("taskFile----------\x3e", task);
            const taskData = require(task).task;
            self._godGuide.setTask(taskData);
            self._godGuide.run(next);
        }, function () {
            cc.log("任务全部完成");
            self._godGuide.end();
        });
    }

    checkGuide() {
        this.id || this.emit(GuideEvent.OpenMain);
    }

    showVideo(data) {
        this._godGuide.showVideo(data);
    }
}
