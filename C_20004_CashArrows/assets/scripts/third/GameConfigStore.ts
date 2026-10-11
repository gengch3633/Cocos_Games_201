class GameConfigStore {
    public fd_status: boolean = false;
    public game_level_phase_cfg: any = null;
    public difficulty_max: number = 0;
    public difficulty_min: number = 0;
    public max_cash_reward: number = 0;
    public props_rate_conf: any = null;
    public app_review_enabled: number = 0;

    public init(config: any): void {
        this.fd_status = true;
        if (config) {
            this.game_level_phase_cfg = config.game_level_phase_cfg;
            this.difficulty_max = config.difficulty_max;
            this.difficulty_min = config.difficulty_min;
            this.max_cash_reward = config.max_cash_reward;
            this.props_rate_conf = config.props_rate_conf;
            const raw = config.app_review_enabled;
            this.app_review_enabled = raw == null ? 1 : raw ? 1 : 0;
            try {
                cc.sys.localStorage.setItem("MB_APP_REVIEW_ENABLED", String(this.app_review_enabled));
            } catch (e) {}
            console.log("[GameConfigStore] init app_review_enabled raw=" + raw + " -> " + this.app_review_enabled);
        }
    }

    public isAppReviewEnabled(): boolean {
        return this.app_review_enabled === 1;
    }
}

export default new GameConfigStore();