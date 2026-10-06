import UserArchive from "./UserArchive";

export default class UserAudioData extends UserArchive {
    musicMute: boolean = false;
    effectMute: boolean = false;
    vibrate: boolean = true;

    constructor() {
        super("UserAudio", 1);
    }

    init() {
    }
}
