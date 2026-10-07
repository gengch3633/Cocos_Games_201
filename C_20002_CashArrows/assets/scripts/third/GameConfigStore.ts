class GameConfigStoreImpl {
    fd_status: boolean = false;
    game_level_phase_cfg: any = null;
    difficulty_max: number = 0;
    difficulty_min: number = 0;
    max_cash_reward: number = 0;
    props_rate_conf: any = null;
    app_review_enabled: number = 0;

    init(config: any): void {
        this.fd_status = true;
        if (config) {
            this.game_level_phase_cfg = config.game_level_phase_cfg;
            this.difficulty_max = config.difficulty_max;
            this.difficulty_min = config.difficulty_min;
            this.max_cash_reward = config.max_cash_reward;
            this.props_rate_conf = config.props_rate_conf;
            const rawReview = config.app_review_enabled;
            this.app_review_enabled = rawReview == null ? 1 : rawReview ? 1 : 0;
            try {
                cc.sys.localStorage.setItem("MB_APP_REVIEW_ENABLED", String(this.app_review_enabled));
            } catch (e) {
            }
            console.log("[GameConfigStore] init app_review_enabled raw=" + rawReview + " -> " + this.app_review_enabled);
        }
    }

    isAppReviewEnabled(): boolean {
        return this.app_review_enabled === 1;
    }
}

export default new GameConfigStoreImpl();
