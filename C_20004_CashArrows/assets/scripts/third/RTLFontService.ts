export type RtlLang = 'ar' | 'ur' | 'bn';

export type FontCallback = (font: cc.Font | null) => void;

type BundleCallback = (bundle: cc.AssetManager.Bundle | null) => void;

const BUNDLE_NAME = 'game';

const FONT_PATHS: { [key: string]: string } = {
    ar: 'font/NotoSansArabic',
    ur: 'font/NotoNastaliqUrdu',
    bn: 'font/NotoSansBengali'
};

function createFontCache(): { [key: string]: cc.Font | null } {
    return {
        ar: null,
        ur: null,
        bn: null
    };
}

function createFlagCache(): { [key: string]: boolean } {
    return {
        ar: false,
        ur: false,
        bn: false
    };
}

function createCallbackCache(): { [key: string]: FontCallback[] } {
    return {
        ar: [],
        ur: [],
        bn: []
    };
}

let fontCache = createFontCache();
let loadingFlags = createFlagCache();
let failedFlags = createFlagCache();
let callbackCache = createCallbackCache();

let bundle: cc.AssetManager.Bundle | null = null;
let bundleLoading = false;
let bundleWaiters: BundleCallback[] = [];

function flushCallbacks(lang: RtlLang, font: cc.Font | null): void {
    const list: FontCallback[] = callbackCache[lang] || [];
    callbackCache[lang] = [];
    for (let i = 0; i < list.length; i++) {
        try {
            list[i](font);
        } catch (err) {
            cc.warn('[RTLFontService] callback error:', err);
        }
    }
}

function dispatchBundleWaiters(loaded: cc.AssetManager.Bundle | null): void {
    const list: BundleCallback[] = bundleWaiters;
    bundleWaiters = [];
    for (let i = 0; i < list.length; i++) {
        try {
            list[i](loaded);
        } catch (err) {
            void err;
        }
    }
}

function withBundle(callback: BundleCallback): void {
    if (bundle) {
        callback(bundle);
        return;
    }

    bundleWaiters.push(callback);
    if (bundleLoading) {
        return;
    }

    bundleLoading = true;
    const manager: any = cc.assetManager;
    const cached: cc.AssetManager.Bundle | null = manager && manager.getBundle ? manager.getBundle(BUNDLE_NAME) : null;

    if (cached) {
        bundle = cached;
        bundleLoading = false;
        dispatchBundleWaiters(cached);
    } else if (manager && manager.loadBundle) {
        manager.loadBundle(BUNDLE_NAME, (err: Error | null, loaded: cc.AssetManager.Bundle | null) => {
            bundleLoading = false;
            if (!err && loaded) {
                bundle = loaded;
                dispatchBundleWaiters(loaded);
            } else {
                cc.warn('[RTLFontService] loadBundle ' + BUNDLE_NAME + ' failed:', err);
                bundle = null;
                dispatchBundleWaiters(null);
            }
        });
    } else {
        bundleLoading = false;
        bundle = null;
        cc.warn('[RTLFontService] cc.assetManager.loadBundle unavailable');
        dispatchBundleWaiters(null);
    }
}

export class RTLFontService {
    public static getFont(lang: RtlLang): cc.Font | null {
        return fontCache[lang] || null;
    }

    public static isFailed(lang: RtlLang): boolean {
        return failedFlags[lang] === true;
    }

    public static isLoading(lang: RtlLang): boolean {
        return loadingFlags[lang] === true;
    }

    public static ensureFont(lang: RtlLang, callback?: FontCallback | null): void {
        const path = FONT_PATHS[lang];
        if (!path) {
            if (callback) {
                callback(null);
            }
            return;
        }

        const cached = fontCache[lang];
        if (cached) {
            if (callback) {
                callback(cached);
            }
            return;
        }

        if (failedFlags[lang]) {
            if (callback) {
                callback(null);
            }
            return;
        }

        if (callback) {
            callbackCache[lang].push(callback);
        }
        if (loadingFlags[lang]) {
            return;
        }

        loadingFlags[lang] = true;
        withBundle((loaded) => {
            if (!loaded) {
                failedFlags[lang] = true;
                loadingFlags[lang] = false;
                flushCallbacks(lang, null);
                return;
            }

            loaded.load(path, cc.Font, (err: Error | null, font: cc.Font | null) => {
                loadingFlags[lang] = false;
                if (!err && font) {
                    fontCache[lang] = font;
                    flushCallbacks(lang, font);
                } else {
                    failedFlags[lang] = true;
                    cc.warn('[RTLFontService] font missing or load failed: ' + path + ' (run tools/i18n/download_rtl_fonts.py and refresh meta in Cocos Creator)', err);
                    flushCallbacks(lang, null);
                }
            });
        });
    }

    public static reset(): void {
        fontCache = createFontCache();
        loadingFlags = createFlagCache();
        failedFlags = createFlagCache();
        callbackCache = createCallbackCache();
    }
}

export default RTLFontService;