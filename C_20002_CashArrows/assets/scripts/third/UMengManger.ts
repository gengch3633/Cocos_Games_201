import MultiPlatform from "./MultiPlatform";
import Singleton from "./Singleton";

export default class UMengManger extends Singleton {
    enable = true;

    trackEvent(eventName: string, params?: any): void {
        if (this.enable) {
            const uma = MultiPlatform.getInstance().uma;
            if (uma) {
                uma.trackEvent(eventName, params);
            }
        }
    }
}
