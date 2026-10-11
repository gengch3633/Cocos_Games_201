import AdLegacyBridge from "./AdLegacyBridge";

export default class AdRequestService {
    public static buildRewardVideoRequest(isForce: boolean, slotId: number = 0): { slotId: number; is_force: boolean } {
        return {
            slotId: slotId,
            is_force: isForce
        };
    }

    public static requestRewardVideo(request: any): void {
        if (cc.sys.isNative) {
            AdLegacyBridge.showRewardVideoByPlatform(request);
        }
    }
}