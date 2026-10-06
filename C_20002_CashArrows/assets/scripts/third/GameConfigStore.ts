interface GameConfigInitPayload {
    game_level_phase_cfg?: unknown;
    difficulty_max?: number;
    difficulty_min?: number;
    max_cash_reward?: number;
    props_rate_conf?: unknown;
    app_review_enabled?: boolean | number | null;
}

const GameConfigStore = new (class {
    fd_status = false;
    game_level_phase_cfg: unknown = null;
    difficulty_max = 0;
    difficulty_min = 0;
    max_cash_reward = 0;
    props_rate_conf: unknown = null;
    app_review_enabled = 0;

    init(payload: GameConfigInitPayload): void {
        this.fd_status = true;
        if (!payload) {
            return;
        }

        this.game_level_phase_cfg = payload.game_level_phase_cfg;
        this.difficulty_max = payload.difficulty_max || 0;
        this.difficulty_min = payload.difficulty_min || 0;
        this.max_cash_reward = payload.max_cash_reward || 0;
        this.props_rate_conf = payload.props_rate_conf;

        const rawReviewFlag = payload.app_review_enabled;
        this.app_review_enabled = rawReviewFlag == null ? 1 : rawReviewFlag ? 1 : 0;
        try {
            cc.sys.localStorage.setItem("MB_APP_REVIEW_ENABLED", String(this.app_review_enabled));
        } catch {
            // ignore
        }
        console.log("[GameConfigStore] init app_review_enabled raw=" + rawReviewFlag + " -> " + this.app_review_enabled);
    }

    isAppReviewEnabled(): boolean {
        return this.app_review_enabled === 1;
    }
})();

export default GameConfigStore;
