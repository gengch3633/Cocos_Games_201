import MultiPlatform from "./MultiPlatform";
import Singleton from "./Singleton";

export default class UMengManger extends Singleton {
    enable: boolean = true;

    trackEvent(eventId: string, data?: any): void {
        if (this.enable) {
            const uma = MultiPlatform.getInstance().uma;
            if (uma) {
                uma.trackEvent(eventId, data);
            }
        }
    }
}
