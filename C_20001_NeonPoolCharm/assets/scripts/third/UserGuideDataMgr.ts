import AudioManager from "./AudioManager";
import EngineUtil from "./EngineUtil";

export class UserGuideDataMgr {
    private static _instance: UserGuideDataMgr = null;

    private _guideId = 0;
    guideAudio = "";
    isGuidePlant = false;

    static get instance(): UserGuideDataMgr {
        if (!this._instance) {
            this._instance = new UserGuideDataMgr();
        }
        return this._instance;
    }

    get guideId(): number {
        if (!this._guideId) {
            this._guideId = parseInt(EngineUtil.getLocalData("guideId")) || 0;
        }
        return this._guideId;
    }

    set guideId(value: number) {
        this._guideId = value;
        EngineUtil.setLocalData("guideId", this._guideId + "");
    }

    update(step: number = 0): void {
        const currentStep = (this as any)["step" + this.guideId];
        if (currentStep) {
            currentStep.active = false;
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
        const stepNode = (this as any)["step" + this.guideId];
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
        const stepNode = (this as any)["step" + step];
        if (stepNode) {
            stepNode.active = true;
            this.playGuideAudio();
        }
    }
}
