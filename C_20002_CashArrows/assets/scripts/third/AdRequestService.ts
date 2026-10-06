import AdLegacyBridge from "./AdLegacyBridge";

export interface RewardVideoRequest {
    slotId: number;
    is_force: boolean;
}

export default class AdRequestService {
    static buildRewardVideoRequest(isForce: boolean, slotId = 0): RewardVideoRequest {
        return {
            slotId,
            is_force: isForce,
        };
    }

    static requestRewardVideo(adData: RewardVideoRequest): void {
        if (cc.sys.isNative) {
            AdLegacyBridge.showRewardVideoByPlatform(adData);
        }
    }
}
