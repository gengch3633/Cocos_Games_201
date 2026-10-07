const FONT_PATHS: { [key: string]: string } = {
    ar: "font/NotoSansArabic",
    ur: "font/NotoNastaliqUrdu",
    bn: "font/NotoSansBengali"
};

const BUNDLE_NAME = "game";
const loadedFonts: { [key: string]: cc.Font } = {
    ar: null,
    ur: null,
    bn: null
};
const loadingFlags: { [key: string]: boolean } = {
    ar: false,
    ur: false,
    bn: false
};
const failedFlags: { [key: string]: boolean } = {
    ar: false,
    ur: false,
    bn: false
};
const pendingCallbacks: { [key: string]: Array<(font: cc.Font) => void> } = {
    ar: [],
    ur: [],
    bn: []
};

let cachedBundle: cc.AssetManager.Bundle = null;
let bundleLoading = false;
let bundleWaiters: Array<(bundle: cc.AssetManager.Bundle) => void> = [];

function flushCallbacks(locale: string, font: cc.Font): void {
    const callbacks = pendingCallbacks[locale] || [];
    pendingCallbacks[locale] = [];
    for (let i = 0; i < callbacks.length; i++) {
        try {
            callbacks[i](font);
        } catch (err) {
            cc.warn("[RTLFontService] callback error:", err);
        }
    }
}

function ensureBundle(callback: (bundle: cc.AssetManager.Bundle) => void): void {
    if (cachedBundle) {
        callback(cachedBundle);
        return;
    }
    bundleWaiters.push(callback);
    if (!bundleLoading) {
        bundleLoading = true;
        const existing = cc.assetManager && cc.assetManager.getBundle ? cc.assetManager.getBundle(BUNDLE_NAME) : null;
        if (existing) {
            cachedBundle = existing;
            bundleLoading = false;
            const waiters = bundleWaiters;
            bundleWaiters = [];
            for (let i = 0; i < waiters.length; i++) {
                try {
                    waiters[i](cachedBundle);
                } catch (err) { }
            }
        } else if (cc.assetManager && cc.assetManager.loadBundle) {
            cc.assetManager.loadBundle(BUNDLE_NAME, (err, bundle) => {
                bundleLoading = false;
                if (!err && bundle) {
                    cachedBundle = bundle;
                    const waiters = bundleWaiters;
                    bundleWaiters = [];
                    for (let i = 0; i < waiters.length; i++) {
                        try {
                            waiters[i](cachedBundle);
                        } catch (innerErr) { }
                    }
                } else {
                    cc.warn("[RTLFontService] loadBundle " + BUNDLE_NAME + " failed:", err);
                    cachedBundle = null;
                    const waiters = bundleWaiters;
                    bundleWaiters = [];
                    for (let i = 0; i < waiters.length; i++) {
                        try {
                            waiters[i](null);
                        } catch (innerErr) { }
                    }
                }
            });
        } else {
            bundleLoading = false;
            cachedBundle = null;
            cc.warn("[RTLFontService] cc.assetManager.loadBundle unavailable");
            const waiters = bundleWaiters;
            bundleWaiters = [];
            for (let i = 0; i < waiters.length; i++) {
                try {
                    waiters[i](null);
                } catch (err) { }
            }
        }
    }
}

const RTLFontService = {
    getFont(locale: string): cc.Font {
        return loadedFonts[locale] || null;
    },

    isFailed(locale: string): boolean {
        return failedFlags[locale] === true;
    },

    isLoading(locale: string): boolean {
        return loadingFlags[locale] === true;
    },

    ensureFont(locale: string, callback?: (font: cc.Font) => void): void {
        const path = FONT_PATHS[locale];
        if (!path) {
            callback && callback(null);
            return;
        }
        if (loadedFonts[locale]) {
            callback && callback(loadedFonts[locale]);
            return;
        }
        if (failedFlags[locale]) {
            callback && callback(null);
            return;
        }
        callback && pendingCallbacks[locale].push(callback);
        if (!loadingFlags[locale]) {
            loadingFlags[locale] = true;
            ensureBundle((bundle) => {
                if (bundle) {
                    bundle.load(path, cc.Font, (err, font) => {
                        loadingFlags[locale] = false;
                        if (!err && font) {
                            loadedFonts[locale] = font;
                            flushCallbacks(locale, font);
                        } else {
                            failedFlags[locale] = true;
                            cc.warn("[RTLFontService] font missing or load failed: " + path + " (run tools/i18n/download_rtl_fonts.py and refresh meta in Cocos Creator)", err);
                            flushCallbacks(locale, null);
                        }
                    });
                } else {
                    failedFlags[locale] = true;
                    loadingFlags[locale] = false;
                    flushCallbacks(locale, null);
                }
            });
        }
    },

    reset(): void {
        loadedFonts.ar = loadedFonts.ur = loadedFonts.bn = null;
        loadingFlags.ar = loadingFlags.ur = loadingFlags.bn = false;
        failedFlags.ar = failedFlags.ur = failedFlags.bn = false;
        pendingCallbacks.ar = [];
        pendingCallbacks.ur = [];
        pendingCallbacks.bn = [];
    }
};

export default RTLFontService;
