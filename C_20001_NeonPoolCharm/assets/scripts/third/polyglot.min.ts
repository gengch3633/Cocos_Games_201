declare const define: any;

(function (e: any, n: (global: any) => PolyglotConstructor) {
    if (typeof define === "function" && define.amd) {
        define([], function () {
            return n(e);
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = n(e);
    } else {
        e.Polyglot = n(e);
    }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (e: any) {
    function Polyglot(this: PolyglotInstance, opts?: PolyglotOptions) {
        opts = opts || {};
        this.phrases = {};
        this.extend(opts.phrases || {});
        this.currentLocale = opts.locale || "en";
        this.allowMissing = !!opts.allowMissing;
        this.warn = opts.warn || warn;
    }

    interface PolyglotOptions {
        phrases?: Record<string, any>;
        locale?: string;
        allowMissing?: boolean;
        warn?: (msg: string) => void;
    }

    interface PolyglotInstance {
        phrases: Record<string, any>;
        currentLocale: string;
        allowMissing: boolean;
        warn: (msg: string) => void;
        locale(e?: string): string;
        extend(e: Record<string, any>, t?: string): void;
        clear(): void;
        replace(e: Record<string, any>): void;
        t(e: string, t?: any): string;
        has(e: string): boolean;
    }

    type PolyglotConstructor = {
        new (opts?: PolyglotOptions): PolyglotInstance;
        VERSION: string;
        prototype: PolyglotInstance;
    };

    function invert(e: Record<string, string[]>) {
        const t: Record<string, string> = {};
        for (const o in e) {
            if (e.hasOwnProperty(o)) {
                const n = e[o];
                for (let i = 0; i < n.length; i++) {
                    t[n[i]] = o;
                }
            }
        }
        return t;
    }

    function trim(e: string) {
        return e.replace(/^\s+|\s+$/g, "");
    }

    function choose(e: string, t: string, o: number) {
        if (o != null && e) {
            const i = e.split("||||");
            return trim(i[pluralIdx(t, o)] || i[0]);
        }
        return e;
    }

    function langToType(e: string) {
        const t = invert(languages);
        return t[e] || t.en;
    }

    function pluralIdx(e: string, t: number) {
        return pluralTypes[langToType(e)](t);
    }

    function interpolate(e: string, t: Record<string, any>) {
        for (const o in t) {
            if (o !== "_" && t.hasOwnProperty(o)) {
                e = e.replace(new RegExp("%\\{" + o + "\\}", "g"), t[o]);
            }
        }
        return e;
    }

    function warn(t: string) {
        if (e.console && e.console.warn) {
            e.console.warn("WARNING: " + t);
        }
    }

    function clone(e: Record<string, any>) {
        const t: Record<string, any> = {};
        for (const o in e) {
            t[o] = e[o];
        }
        return t;
    }

    (Polyglot as PolyglotConstructor).VERSION = "0.4.3";

    Polyglot.prototype.locale = function (locale?: string) {
        if (locale) {
            this.currentLocale = locale;
        }
        return this.currentLocale;
    };

    Polyglot.prototype.extend = function (phrases: Record<string, any>, prefix?: string) {
        for (const key in phrases) {
            if (phrases.hasOwnProperty(key)) {
                let phrase = phrases[key];
                let phraseKey = key;
                if (prefix) {
                    phraseKey = prefix + "." + key;
                }
                if (typeof phrase === "object") {
                    this.extend(phrase, phraseKey);
                } else {
                    this.phrases[phraseKey] = phrase;
                }
            }
        }
    };

    Polyglot.prototype.clear = function () {
        this.phrases = {};
    };

    Polyglot.prototype.replace = function (phrases: Record<string, any>) {
        this.clear();
        this.extend(phrases);
    };

    Polyglot.prototype.t = function (key: string, options?: any) {
        let phrase: string;
        let result: string;
        options = options == null ? {} : options;
        if (typeof options === "number") {
            options = { smart_count: options };
        }
        if (typeof this.phrases[key] === "string") {
            phrase = this.phrases[key];
        } else if (typeof options._ === "string") {
            phrase = options._;
        } else if (this.allowMissing) {
            phrase = key;
        } else {
            this.warn('Missing translation for key: "' + key + '"');
            result = key;
        }
        if (typeof phrase === "string") {
            options = clone(options);
            result = interpolate(choose(phrase, this.currentLocale, options.smart_count), options);
        }
        return result;
    };

    Polyglot.prototype.has = function (key: string) {
        return key in this.phrases;
    };

    const pluralTypes: Record<string, (count: number) => number> = {
        chinese: function () {
            return 0;
        },
        german: function (count) {
            return count !== 1 ? 1 : 0;
        },
        french: function (count) {
            return count > 1 ? 1 : 0;
        },
        russian: function (count) {
            return count % 10 === 1 && count % 100 !== 11
                ? 0
                : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)
                  ? 1
                  : 2;
        },
        czech: function (count) {
            return count === 1 ? 0 : count >= 2 && count <= 4 ? 1 : 2;
        },
        polish: function (count) {
            return count === 1
                ? 0
                : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)
                  ? 1
                  : 2;
        },
        icelandic: function (count) {
            return count % 10 !== 1 || count % 100 === 11 ? 1 : 0;
        },
    };

    const languages = {
        chinese: ["fa", "id", "ja", "ko", "lo", "ms", "th", "tr", "zh"],
        german: ["da", "de", "en", "es", "fi", "el", "he", "hu", "it", "nl", "no", "pt", "sv"],
        french: ["fr", "tl", "pt-br"],
        russian: ["hr", "ru"],
        czech: ["cs"],
        polish: ["pl"],
        icelandic: ["is"],
    };

    return Polyglot as PolyglotConstructor;
});
