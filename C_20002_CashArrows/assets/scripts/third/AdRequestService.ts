import AdLegacyBridge from "./AdLegacyBridge";

export default class AdRequestService {
    static buildRewardVideoRequest(isForce: any, slotId: number = 0) {
        return {
            slotId: slotId,
            is_force: isForce
        };
    }

    static requestRewardVideo(request: any) {
        cc.sys.isNative && AdLegacyBridge.showRewardVideoByPlatform(request);
    }
}
