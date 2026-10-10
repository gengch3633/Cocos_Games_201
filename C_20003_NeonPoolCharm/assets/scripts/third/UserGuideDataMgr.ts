import AudioManager from "./AudioManager";
import EngineUtil from "./EngineUtil";

export class UserGuideDataMgr {
    _guideId = 0;
    guideAudio = "";
    isGuidePlant = false;

    static _instance;

    get guideId() {
        this._guideId || (this._guideId = parseInt(EngineUtil.getLocalData("guideId")) || 0);
        return this._guideId;
    }

    set guideId(value) {
        this._guideId = value;
        EngineUtil.setLocalData("guideId", this._guideId + "");
    }

    static get instance() {
        this._instance || (this._instance = new UserGuideDataMgr());
        return this._instance;
    }

    update(step) {
        if (undefined === step) {
            step = 0;
        }
        const prev = this["step" + this.guideId];
        if (prev) {
            prev.active = false;
        }
        console.log("guide====", step);
        if (step) {
            this.guideId = step + 1;
        } else {
            this.guideId++;
        }
        console.log("guideStep:" + this.guideId);
        if (!(this._guideId > 3)) {
            this.refresh();
        }
    }

    refresh() {
        const stepNode = this["step" + this.guideId];
        if (stepNode) {
            stepNode.active = true;
        }
    }

    stopGuideAudio() {
        AudioManager.getInstance().stopMusic(this.guideAudio, false);
        this.guideAudio = "";
    }

    playGuideAudio() {
        this.stopGuideAudio();
        console.log("播放音频this.guideId====", this.guideId);
        this.guideAudio = "step_" + this.guideId;
        AudioManager.getInstance().playMusic(this.guideAudio);
    }

    startGuide(step) {
        const stepNode = this["step" + step];
        if (stepNode) {
            stepNode.active = true;
            this.playGuideAudio();
        }
    }
}
