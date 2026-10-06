export default new class {
    fd_status: boolean;
    game_level_phase_cfg: any;
    difficulty_max: number;
    difficulty_min: number;
    max_cash_reward: number;
    props_rate_conf: any;
    app_review_enabled: number;

    constructor() {
        this.fd_status = false;
        this.game_level_phase_cfg = null;
        this.difficulty_max = 0;
        this.difficulty_min = 0;
        this.max_cash_reward = 0;
        this.props_rate_conf = null;
        this.app_review_enabled = 0;
    }

    init(config: any) {
        this.fd_status = true;
        if (config) {
            const gameLevelPhaseCfg = config.game_level_phase_cfg, difficultyMax = config.difficulty_max, difficultyMin = config.difficulty_min, maxCashReward = config.max_cash_reward, propsRateConf = config.props_rate_conf;
            this.game_level_phase_cfg = gameLevelPhaseCfg;
            this.difficulty_max = difficultyMax;
            this.difficulty_min = difficultyMin;
            this.max_cash_reward = maxCashReward;
            this.props_rate_conf = propsRateConf;
            const appReviewEnabled = config.app_review_enabled;
            this.app_review_enabled = null == appReviewEnabled ? 1 : appReviewEnabled ? 1 : 0;
            try {
                cc.sys.localStorage.setItem("MB_APP_REVIEW_ENABLED", String(this.app_review_enabled));
            } catch (e) {
            }
            console.log("[GameConfigStore] init app_review_enabled raw=" + appReviewEnabled + " -> " + this.app_review_enabled);
        }
    }

    isAppReviewEnabled() {
        return 1 === this.app_review_enabled;
    }
}();
