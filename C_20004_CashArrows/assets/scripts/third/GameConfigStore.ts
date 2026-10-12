const { ccclass } = cc._decorator;

interface GameConfigStoreInitData {
    game_level_phase_cfg?: any;
    difficulty_max?: number;
    difficulty_min?: number;
    max_cash_reward?: number;
    props_rate_conf?: any;
    app_review_enabled?: number | boolean;
}

@ccclass
class GameConfigStore {
    public fd_status: boolean = false;
    public game_level_phase_cfg: any = null;
    public difficulty_max: number = 0;
    public difficulty_min: number = 0;
    public max_cash_reward: number = 0;
    public props_rate_conf: any = null;
    public app_review_enabled: number = 0;

    public init(data?: GameConfigStoreInitData | null): void {
        this.fd_status = true;
        if (!data) {
            return;
        }

        this.game_level_phase_cfg = data.game_level_phase_cfg;
        this.difficulty_max = data.difficulty_max;
        this.difficulty_min = data.difficulty_min;
        this.max_cash_reward = data.max_cash_reward;
        this.props_rate_conf = data.props_rate_conf;

        const rawAppReviewEnabled = data.app_review_enabled;
        this.app_review_enabled = rawAppReviewEnabled == null ? 1 : (rawAppReviewEnabled ? 1 : 0);

        try {
            cc.sys.localStorage.setItem("MB_APP_REVIEW_ENABLED", String(this.app_review_enabled));
        } catch (e) {
        }

        console.log(`[GameConfigStore] init app_review_enabled raw=${rawAppReviewEnabled} -> ${this.app_review_enabled}`);
    }

    public isAppReviewEnabled(): boolean {
        return this.app_review_enabled === 1;
    }
}

export default new GameConfigStore();