const fontPaths: any = {
    ar: "font/NotoSansArabic",
    ur: "font/NotoNastaliqUrdu",
    bn: "font/NotoSansBengali"
};

const bundleName = "game";

let cachedFonts: any = {
    ar: null,
    ur: null,
    bn: null
};

let loadingFlags: any = {
    ar: false,
    ur: false,
    bn: false
};

let failedFlags: any = {
    ar: false,
    ur: false,
    bn: false
};

let pendingCallbacks: any = {
    ar: [],
    ur: [],
    bn: []
};

let cachedBundle: any = null;
let bundleLoading = false;
let bundleWaiters: any[] = [];

function flushCallbacks(lang: any, font: any) {
    var list = pendingCallbacks[lang] || [];
    pendingCallbacks[lang] = [];
    for (var i = 0; i < list.length; i++) {
        try {
            list[i](font);
        } catch (e) {
            cc.warn("[RTLFontService] callback error:", e);
        }
    }
}

function ensureBundle(callback: any) {
    if (cachedBundle) {
        callback(cachedBundle);
    } else {
        bundleWaiters.push(callback);
        if (!bundleLoading) {
            bundleLoading = true;
            var existing = cc.assetManager && cc.assetManager.getBundle ? cc.assetManager.getBundle(bundleName) : null;
            if (existing) {
                cachedBundle = existing;
                bundleLoading = false;
                var readyWaiters = bundleWaiters;
                bundleWaiters = [];
                for (var i = 0; i < readyWaiters.length; i++) {
                    try {
                        readyWaiters[i](cachedBundle);
                    } catch (e) { }
                }
            } else if (cc.assetManager && cc.assetManager.loadBundle) {
                cc.assetManager.loadBundle(bundleName, function (err: any, bundle: any) {
                    bundleLoading = false;
                    if (!err && bundle) {
                        cachedBundle = bundle;
                        var loadedWaiters = bundleWaiters;
                        bundleWaiters = [];
                        for (var j = 0; j < loadedWaiters.length; j++) {
                            try {
                                loadedWaiters[j](cachedBundle);
                            } catch (e) { }
                        }
                    } else {
                        cc.warn("[RTLFontService] loadBundle " + bundleName + " failed:", err);
                        cachedBundle = null;
                        var failedWaiters = bundleWaiters;
                        bundleWaiters = [];
                        for (var k = 0; k < failedWaiters.length; k++) {
                            try {
                                failedWaiters[k](null);
                            } catch (e) { }
                        }
                    }
                });
            } else {
                bundleLoading = false;
                cachedBundle = null;
                cc.warn("[RTLFontService] cc.assetManager.loadBundle unavailable");
                var unavailableWaiters = bundleWaiters;
                bundleWaiters = [];
                for (var n = 0; n < unavailableWaiters.length; n++) {
                    try {
                        unavailableWaiters[n](null);
                    } catch (e) { }
                }
            }
        }
    }
}

const RTLFontService = {
    getFont: function (lang: any) {
        return cachedFonts[lang] || null;
    },
    isFailed: function (lang: any) {
        return true === failedFlags[lang];
    },
    isLoading: function (lang: any) {
        return true === loadingFlags[lang];
    },
    ensureFont: function (lang: any, callback: any) {
        var path = fontPaths[lang];
        if (path) {
            if (cachedFonts[lang]) {
                callback && callback(cachedFonts[lang]);
            } else if (failedFlags[lang]) {
                callback && callback(null);
            } else {
                callback && pendingCallbacks[lang].push(callback);
                if (!loadingFlags[lang]) {
                    loadingFlags[lang] = true;
                    ensureBundle(function (bundle: any) {
                        if (bundle) {
                            bundle.load(path, cc.Font, function (err: any, font: any) {
                                loadingFlags[lang] = false;
                                if (!err && font) {
                                    cachedFonts[lang] = font;
                                    flushCallbacks(lang, font);
                                } else {
                                    failedFlags[lang] = true;
                                    cc.warn("[RTLFontService] font missing or load failed: " + path + " (run tools/i18n/download_rtl_fonts.py and refresh meta in Cocos Creator)", err);
                                    flushCallbacks(lang, null);
                                }
                            });
                        } else {
                            failedFlags[lang] = true;
                            loadingFlags[lang] = false;
                            flushCallbacks(lang, null);
                        }
                    });
                }
            }
        } else {
            callback && callback(null);
        }
    },
    reset: function () {
        cachedFonts = {
            ar: null,
            ur: null,
            bn: null
        };
        loadingFlags = {
            ar: false,
            ur: false,
            bn: false
        };
        failedFlags = {
            ar: false,
            ur: false,
            bn: false
        };
        pendingCallbacks = {
            ar: [],
            ur: [],
            bn: []
        };
    }
};

export default RTLFontService;
