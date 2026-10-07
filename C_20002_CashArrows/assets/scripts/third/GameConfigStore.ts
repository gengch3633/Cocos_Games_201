class GameConfigStoreImpl {
    fd_status = false;
    game_level_phase_cfg: any = null;
    difficulty_max = 0;
    difficulty_min = 0;
    max_cash_reward = 0;
    props_rate_conf: any = null;
    app_review_enabled = 0;

    init(data: any): void {
        this.fd_status = true;
        if (data) {
            this.game_level_phase_cfg = data.game_level_phase_cfg;
            this.difficulty_max = data.difficulty_max;
            this.difficulty_min = data.difficulty_min;
            this.max_cash_reward = data.max_cash_reward;
            this.props_rate_conf = data.props_rate_conf;
            const raw = data.app_review_enabled;
            this.app_review_enabled = raw == null ? 1 : raw ? 1 : 0;
            try {
                cc.sys.localStorage.setItem("MB_APP_REVIEW_ENABLED", String(this.app_review_enabled));
            } catch (e) {
            }
            console.log("[GameConfigStore] init app_review_enabled raw=" + raw + " -> " + this.app_review_enabled);
        }
    }

    isAppReviewEnabled(): boolean {
        return this.app_review_enabled === 1;
    }
}

export default new GameConfigStoreImpl();
