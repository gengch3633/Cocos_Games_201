import UserArchive from "./UserArchive";

export default class UserAudioData extends UserArchive {
    musicMute = false;
    effectMute = false;
    vibrate = true;

    constructor() {
        super("UserAudio", 1);
    }

    init(_isNew?: boolean): void {
    }
}
