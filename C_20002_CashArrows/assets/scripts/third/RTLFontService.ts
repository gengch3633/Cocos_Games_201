type RtlFontKey = "ar" | "ur" | "bn";

const FONT_PATHS: { [key in RtlFontKey]: string } = {
    ar: "font/NotoSansArabic",
    ur: "font/NotoNastaliqUrdu",
    bn: "font/NotoSansBengali",
};

const BUNDLE_NAME = "game";

const fonts: { [key in RtlFontKey]: cc.Font | null } = {
    ar: null,
    ur: null,
    bn: null,
};

const loading: { [key in RtlFontKey]: boolean } = {
    ar: false,
    ur: false,
    bn: false,
};

const failed: { [key in RtlFontKey]: boolean } = {
    ar: false,
    ur: false,
    bn: false,
};

const callbacks: { [key in RtlFontKey]: Array<(font: cc.Font | null) => void> } = {
    ar: [],
    ur: [],
    bn: [],
};

let gameBundle: cc.AssetManager.Bundle | null = null;
let bundleLoading = false;
const bundleCallbacks: Array<(bundle: cc.AssetManager.Bundle | null) => void> = [];

function flushCallbacks(key: RtlFontKey, font: cc.Font | null): void {
    const pending = callbacks[key] || [];
    callbacks[key] = [];
    for (let i = 0; i < pending.length; i++) {
        try {
            pending[i](font);
        } catch (e) {
            cc.warn("[RTLFontService] callback error:", e);
        }
    }
}

function ensureBundle(callback: (bundle: cc.AssetManager.Bundle | null) => void): void {
    if (gameBundle) {
        callback(gameBundle);
        return;
    }
    bundleCallbacks.push(callback);
    if (bundleLoading) {
        return;
    }
    bundleLoading = true;
    const existingBundle = cc.assetManager && cc.assetManager.getBundle
        ? cc.assetManager.getBundle(BUNDLE_NAME)
        : null;
    if (existingBundle) {
        gameBundle = existingBundle;
        bundleLoading = false;
        const pending = bundleCallbacks;
        bundleCallbacks.length = 0;
        for (let i = 0; i < pending.length; i++) {
            try {
                pending[i](gameBundle);
            } catch (e) {
            }
        }
    } else if (cc.assetManager && cc.assetManager.loadBundle) {
        cc.assetManager.loadBundle(BUNDLE_NAME, (err, bundle) => {
            bundleLoading = false;
            if (!err && bundle) {
                gameBundle = bundle;
                const pending = bundleCallbacks;
                bundleCallbacks.length = 0;
                for (let i = 0; i < pending.length; i++) {
                    try {
                        pending[i](gameBundle);
                    } catch (e) {
                    }
                }
            } else {
                cc.warn("[RTLFontService] loadBundle " + BUNDLE_NAME + " failed:", err);
                gameBundle = null;
                const pending = bundleCallbacks;
                bundleCallbacks.length = 0;
                for (let i = 0; i < pending.length; i++) {
                    try {
                        pending[i](null);
                    } catch (e) {
                    }
                }
            }
        });
    } else {
        bundleLoading = false;
        gameBundle = null;
        cc.warn("[RTLFontService] cc.assetManager.loadBundle unavailable");
        const pending = bundleCallbacks;
        bundleCallbacks.length = 0;
        for (let i = 0; i < pending.length; i++) {
            try {
                pending[i](null);
            } catch (e) {
            }
        }
    }
}

const RTLFontService = {
    getFont(key: string): cc.Font | null {
        return fonts[key as RtlFontKey] || null;
    },

    isFailed(key: string): boolean {
        return failed[key as RtlFontKey] === true;
    },

    isLoading(key: string): boolean {
        return loading[key as RtlFontKey] === true;
    },

    ensureFont(key: string, callback?: (font: cc.Font | null) => void): void {
        const fontPath = FONT_PATHS[key as RtlFontKey];
        if (!fontPath) {
            callback && callback(null);
            return;
        }
        if (fonts[key as RtlFontKey]) {
            callback && callback(fonts[key as RtlFontKey]);
            return;
        }
        if (failed[key as RtlFontKey]) {
            callback && callback(null);
            return;
        }
        callback && callbacks[key as RtlFontKey].push(callback);
        if (loading[key as RtlFontKey]) {
            return;
        }
        loading[key as RtlFontKey] = true;
        ensureBundle((bundle) => {
            if (bundle) {
                bundle.load(fontPath, cc.Font, (err, font) => {
                    loading[key as RtlFontKey] = false;
                    if (!err && font) {
                        fonts[key as RtlFontKey] = font;
                        flushCallbacks(key as RtlFontKey, font);
                    } else {
                        failed[key as RtlFontKey] = true;
                        cc.warn(
                            "[RTLFontService] font missing or load failed: " + fontPath +
                            " (run tools/i18n/download_rtl_fonts.py and refresh meta in Cocos Creator)",
                            err
                        );
                        flushCallbacks(key as RtlFontKey, null);
                    }
                });
            } else {
                failed[key as RtlFontKey] = true;
                loading[key as RtlFontKey] = false;
                flushCallbacks(key as RtlFontKey, null);
            }
        });
    },

    reset(): void {
        fonts.ar = null;
        fonts.ur = null;
        fonts.bn = null;
        loading.ar = false;
        loading.ur = false;
        loading.bn = false;
        failed.ar = false;
        failed.ur = false;
        failed.bn = false;
        callbacks.ar = [];
        callbacks.ur = [];
        callbacks.bn = [];
    },
};

export default RTLFontService;
