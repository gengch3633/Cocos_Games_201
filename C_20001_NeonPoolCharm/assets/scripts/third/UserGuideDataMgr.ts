import AudioManager from "./AudioManager";
import EngineUtil from "./EngineUtil";

export class UserGuideDataMgr {
    private static _instance: UserGuideDataMgr = null;

    private _guideId = 0;
    guideAudio = "";
    isGuidePlant = false;

    [key: string]: any;

    get guideId(): number {
        if (!this._guideId) {
            this._guideId = parseInt(EngineUtil.getLocalData("guideId"), 10) || 0;
        }
        return this._guideId;
    }

    set guideId(value: number) {
        this._guideId = value;
        EngineUtil.setLocalData("guideId", this._guideId + "");
    }

    static get instance(): UserGuideDataMgr {
        if (!UserGuideDataMgr._instance) {
            UserGuideDataMgr._instance = new UserGuideDataMgr();
        }
        return UserGuideDataMgr._instance;
    }

    update(step: number = 0): void {
        if (this["step" + this.guideId]) {
            this["step" + this.guideId].active = false;
        }
        console.log("guide====", step);
        if (step) {
            this.guideId = step + 1;
        } else {
            this.guideId++;
        }
        console.log("guideStep:" + this.guideId);
        if (this._guideId > 3) {
            return;
        }
        this.refresh();
    }

    refresh(): void {
        const stepNode = this["step" + this.guideId];
        if (stepNode) {
            stepNode.active = true;
        }
    }

    stopGuideAudio(): void {
        AudioManager.getInstance().stopMusic(this.guideAudio, false);
        this.guideAudio = "";
    }

    playGuideAudio(): void {
        this.stopGuideAudio();
        console.log("播放音频this.guideId====", this.guideId);
        this.guideAudio = "step_" + this.guideId;
        AudioManager.getInstance().playMusic(this.guideAudio);
    }

    startGuide(step: number): void {
        if (this["step" + step]) {
            this["step" + step].active = true;
            this.playGuideAudio();
        }
    }
}
