import AdLegacyBridge from "./AdLegacyBridge";

export default class AdRequestService {
    static buildRewardVideoRequest(isForce: boolean, slotId: number = 0): { slotId: number; is_force: boolean } {
        return {
            slotId: slotId,
            is_force: isForce,
        };
    }

    static requestRewardVideo(adData: { slotId: number; is_force: boolean }): void {
        if (cc.sys.isNative) {
            AdLegacyBridge.showRewardVideoByPlatform(adData);
        }
    }
}
