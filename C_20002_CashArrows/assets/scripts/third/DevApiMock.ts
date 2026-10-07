/**
 * Local offline mock for business / middle / SDK HTTP APIs.
 * Set ENABLE_DEV_API_MOCK to false before release builds that need real servers.
 */
export const ENABLE_DEV_API_MOCK = true;

const LOG_PREFIX = "[DevApiMock]";

function success(data?: any): any {
    return data === undefined ? { code: 1 } : { code: 1, data: data };
}

function mockUserId(): any {
    return {
        yid: "dev_mock_yid",
        user_id: "dev_user_001",
        user_name: "DevGuest"
    };
}

function mockUserInfo(): any {
    return {
        cash_balance: 100,
        fund_balance: 0,
        bubble_balance: 0,
        user_level: 1,
        task_point_num: 0,
        ltv_task_point_num: 0,
        circle_count: 0,
        sign_in: 0,
        hint_prop_count: 3,
        guideline_prop_count: 3,
        levels_passed_count: 0,
        guideline_eliminate_num: 0,
        current_arrow_level_id: "1",
        is_tourists: true,
        create_time: String(Math.floor(Date.now() / 1000)),
        ab_info: {},
        tx_bind_info: [],
        conf: {
            parameter_conf: {},
            cash_extract_conf: {}
        }
    };
}

function mockArrowLevel(businessData?: any): any {
    const levelId = Number(businessData?.arrow_level_id || 1);
    return {
        arrow_level_id: levelId,
        level_index: levelId,
        time_limit: 300,
        arrow_count: 20,
        big_reward_trigger: 0,
        tail_clearance: 5,
        show_countdown: false,
        eliminate_reward: 1,
        life_count: 3
    };
}

function mockRewardResult(): any {
    return {
        cash_balance: 100,
        bubble_balance: 0,
        user_level: 1,
        cash_reward: 1,
        reward_amount: 1
    };
}

const BUSINESS_MOCK_BUILDERS: Record<string, (businessData?: any) => any> = {
    config: () => success({
        is_encrypt: 0,
        new_user: 1,
        is_new: true
    }),
    auto_submit: () => success(mockUserId()),
    TouristLogin: () => success(mockUserId()),
    GetGameConfig: () => success({
        difficulty_max: 10,
        difficulty_min: 1,
        max_cash_reward: 999,
        props_rate_conf: {},
        game_level_phase_cfg: null,
        app_review_enabled: 0
    }),
    UserInfo: () => success(mockUserInfo()),
    ArrowLevelConfig: (businessData) => success({
        arrow_level: mockArrowLevel(businessData)
    }),
    ArrowClaimReward: () => success(mockRewardResult()),
    ArrowClaimAdReward: () => success(mockRewardResult()),
    ArrowRewardSettle: () => success(mockRewardResult()),
    ArrowConsumeProp: () => success({
        hint_prop_count: 3,
        guideline_prop_count: 3
    }),
    WithdrawInfo: () => success({
        cash_balance: 100,
        user_level: 1,
        info: []
    }),
    WithdrawCash: () => success({
        cash_balance: 100
    }),
    BindTxAccount: () => success({}),
    BarrageList: () => success({
        money_list: [
            { name: "PlayerA", money: 88 },
            { name: "PlayerB", money: 66 }
        ]
    }),
    TaskInfo: () => success({
        task_list: []
    }),
    TaskOnlyReward: () => success(mockRewardResult()),
    TaskShowReward: () => success(mockRewardResult()),
    HotUpdate: () => success({
        url: ""
    }),
    FirebaseToken: () => success({}),
    WithdrawChannels: () => success({
        channels: []
    }),
    VerifyBindInfo: () => success({}),
    StartGame: () => success({}),
    SubmitGame: () => success(mockRewardResult()),
    OverGame: () => success(mockRewardResult()),
    LuckyReward: () => success(mockRewardResult()),
    GuideReward: () => success(mockRewardResult()),
    GuideUpdate: () => success({}),
    RefreshBlock: () => success({}),
    BubbleInfo: () => success({}),
    RankInfo: () => success({}),
    ScrollMsg: () => success({}),
    AdMake: () => success({}),
    NotifyDec: () => success({}),
    ExtractFundDashboard: () => success({}),
    ExtractCashDashboard: () => success({}),
    ExtractCashRecord: () => success({}),
    ExtractFundRecord: () => success({}),
    ExtractCash: () => success({}),
    BindTx: () => success({})
};

const MIDDLE_MOCK_BUILDERS: Record<string, (params?: any) => any> = {
    Regional: () => success({
        region: "US",
        up_h: true,
        forbid_red_envelope: false,
        forbid_used: false,
        recog_ire: false,
        recog_tf: false,
        mfi: true,
        is_ump: false,
        is_ump_country: false
    }),
    TFRegional: () => ({
        code: 1,
        is_self_match_tf: false
    }),
    ADSDK: () => success(),
    APPLOG: () => success(),
    COREDATA: () => success(),
    event: () => success(),
    Platform: () => success({}),
    BindWithdrawal: () => success({}),
    AdConfig: () => success({})
};

const URI_TO_REQUEST_KEY: Record<string, string> = {
    "AfBJn/config": "config",
    "mOIrra/GwJUnl": "auto_submit",
    "mOIrra/VfVrta": "TouristLogin",
    "AfBJn/getGameConfig": "GetGameConfig",
    "YZCUIm/MgQDzj": "UserInfo",
    "xKmD9w/QrLv7n": "ArrowLevelConfig",
    "ehwqDl/CCDFGN": "ArrowClaimReward",
    "vNZlOY/KWcPza": "ArrowClaimAdReward",
    "ehwqDl/tMvhRC": "ArrowRewardSettle",
    "xKmD9w/pUsH3k": "ArrowConsumeProp",
    "LcmMRi/BYqawo": "WithdrawInfo",
    "LcmMRi/ZworCc": "WithdrawCash",
    "LcmMRi/arHKkf": "BindTxAccount",
    "YZCUIm/PqyICJ": "BarrageList",
    "YZCUIm/UCNZBa": "TaskInfo",
    "YZCUIm/PpAmkA": "TaskOnlyReward",
    "lpzvzk": "HotUpdate"
};

export function isDevApiMockEnabled(): boolean {
    return ENABLE_DEV_API_MOCK;
}

export function runDevApiMockAsync(callback: () => void): void {
    if (typeof setTimeout === "function") {
        setTimeout(callback, 0);
    } else {
        callback();
    }
}

export function resolveBusinessRequestKey(url: string, requestKey?: string): string {
    if (requestKey) {
        return requestKey;
    }
    if (!url) {
        return "";
    }
    try {
        const path = url.split("?")[0];
        const parts = path.replace(/^https?:\/\/[^/]+\//, "").split("/");
        const normalized = parts.filter(Boolean).slice(-2).join("/");
        if (URI_TO_REQUEST_KEY[normalized]) {
            return URI_TO_REQUEST_KEY[normalized];
        }
        if (parts.length === 1 && URI_TO_REQUEST_KEY[parts[0]]) {
            return URI_TO_REQUEST_KEY[parts[0]];
        }
    } catch (err) { }
    return "";
}

export function getBusinessMockResponse(requestKey: string, businessData?: any, url?: string): any {
    const key = requestKey || resolveBusinessRequestKey(url || "", requestKey);
    const builder = BUSINESS_MOCK_BUILDERS[key];
    const response = builder ? builder(businessData) : success({});
    console.log(LOG_PREFIX, "business", key || url || "unknown", "->", JSON.stringify(response));
    return response;
}

export function getMiddleMockResponse(requestType: string, params?: any): any {
    const builder = MIDDLE_MOCK_BUILDERS[requestType];
    const response = builder ? builder(params) : success({});
    console.log(LOG_PREFIX, "middle", requestType, "->", JSON.stringify(response));
    return response;
}

export function getSdkMockResponse(requestKey: string, businessData?: any): any {
    const builder = BUSINESS_MOCK_BUILDERS[requestKey];
    const response = builder ? builder(businessData) : success({});
    console.log(LOG_PREFIX, "sdk", requestKey, "->", JSON.stringify(response));
    return response;
}
