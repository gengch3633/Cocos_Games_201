import MultiPlatform from "./MultiPlatform";
import Singleton from "./Singleton";

export default class UMengManger extends Singleton {
    public enable: boolean = true;

    public trackEvent(eventName: string, params?: any): void {
        if (!this.enable) {
            return;
        }

        const uma = MultiPlatform.getInstance().uma;
        if (uma) {
            uma.trackEvent(eventName, params);
        }
    }
}