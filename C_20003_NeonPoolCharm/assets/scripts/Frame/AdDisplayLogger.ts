export type AdDisplayType = "video" | "interstitial" | "web" | "splash" | "native_video";

export interface AdDisplayCounts {
    video: number;
    interstitial: number;
    web: number;
    splash: number;
    native_video: number;
    total: number;
    byPlacement: Record<string, number>;
}

const STORAGE_KEY = "ad_display_counts";

export class AdDisplayLogger {

    private static _counts: AdDisplayCounts = null;

    static load(): AdDisplayCounts {
        if (this._counts) {
            return this._counts;
        }
        const raw = cc.sys.localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                this._counts = this.normalize(parsed);
                return this._counts;
            } catch (e) {
                console.warn("[AdDisplayLogger] parse failed, reset counts", e);
            }
        }
        this._counts = this.createEmpty();
        return this._counts;
    }

    static save() {
        if (!this._counts) {
            return;
        }
        cc.sys.localStorage.setItem(STORAGE_KEY, JSON.stringify(this._counts));
    }

    static getCounts(): AdDisplayCounts {
        return this.load();
    }

    static reset() {
        this._counts = this.createEmpty();
        this.save();
        console.log("[AdDisplayLogger] counts reset");
    }

    static logShow(type: AdDisplayType, placement?: string) {
        const counts = this.load();
        if (counts[type] == null) {
            counts[type] = 0;
        }
        counts[type]++;
        counts.total++;
        const key = placement || "unknown";
        counts.byPlacement[key] = (counts.byPlacement[key] || 0) + 1;
        this.save();
        console.log(
            "[AdDisplayLogger] ad_show"
            + " type=" + type
            + " placement=" + key
            + " typeCount=" + counts[type]
            + " totalCount=" + counts.total
            + " counts=" + JSON.stringify({
                video: counts.video,
                interstitial: counts.interstitial,
                web: counts.web,
                splash: counts.splash,
                native_video: counts.native_video,
                total: counts.total
            })
        );
    }

    private static createEmpty(): AdDisplayCounts {
        return {
            video: 0,
            interstitial: 0,
            web: 0,
            splash: 0,
            native_video: 0,
            total: 0,
            byPlacement: {}
        };
    }

    private static normalize(raw: any): AdDisplayCounts {
        const empty = this.createEmpty();
        if (!raw || typeof raw !== "object") {
            return empty;
        }
        empty.video = Number(raw.video) || 0;
        empty.interstitial = Number(raw.interstitial) || 0;
        empty.web = Number(raw.web) || 0;
        empty.splash = Number(raw.splash) || 0;
        empty.native_video = Number(raw.native_video) || 0;
        empty.byPlacement = raw.byPlacement && typeof raw.byPlacement === "object" ? raw.byPlacement : {};
        empty.total = empty.video + empty.interstitial + empty.web + empty.splash + empty.native_video;
        return empty;
    }
}

cc.js.setClassName("AdDisplayLogger", AdDisplayLogger);
