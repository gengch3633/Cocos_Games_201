import MultiPlatform from "./MultiPlatform";
import Singleton from "./Singleton";

export default class UMengManger extends Singleton {
    enable: boolean = true;

    trackEvent(e: any, t: any) {
        if (this.enable) {
            var i = MultiPlatform.getInstance().uma;
            i && i.trackEvent(e, t);
        }
    }
}
