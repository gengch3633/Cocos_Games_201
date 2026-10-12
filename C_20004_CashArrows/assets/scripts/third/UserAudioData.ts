import UserArchive from "./UserArchive";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UserAudioData extends UserArchive {
    public musicMute: boolean = false;
    public effectMute: boolean = false;
    public vibrate: boolean = true;

    constructor() {
        super("UserAudio", 1);
    }

    public init(): void {
    }
}