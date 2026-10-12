import AdLegacyBridge from "./AdLegacyBridge";

interface RewardVideoRequest {
    slotId: number;
    is_force: boolean;
}

export default class AdRequestService {
    public static buildRewardVideoRequest(isForce: boolean, slotId: number = 0): RewardVideoRequest {
        return {
            slotId: slotId,
            is_force: isForce
        };
    }

    public static requestRewardVideo(request: RewardVideoRequest): void {
        if (cc.sys.isNative) {
            AdLegacyBridge.showRewardVideoByPlatform(request);
        }
    }
}