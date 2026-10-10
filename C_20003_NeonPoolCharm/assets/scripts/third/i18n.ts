export default class PoolI18n {
    static changeStr(t) {
        for (const o in PoolI18n.i18nArray) {
            const n = t.indexOf(o);
            if (-1 != n) {
                let i = t;
                const a = t.substring(n + o.length, n + o.length + 3);
                const r = parseInt(a);
                const l = PoolI18n.getReplaceStr(o, r);
                if (l) {
                    i = t.replace(o + a, l);
                    const s = this.changeStr(i);
                    if (s) {
                        i = s;
                    }
                }
                return i;
            }
        }
        return null;
    }

    static init(t, o, n) {
        PoolI18n.addi18nArray(t);
        PoolI18n.setLanguage(o || cc.sys.languageCode);
        if (n) {
            PoolI18n.COUNTRY_LIST = n;
        }
        const i = function (key) {
            const text = PoolI18n.getKeyStr(key);
            if (text) {
                if (!this.sKey) {
                    for (let idx = PoolI18n._FRESH_STRINGArray.length - 1; idx >= 0; idx--) {
                        const item = PoolI18n._FRESH_STRINGArray[idx];
                        if (!(cc.isValid(item) && item.sKey)) {
                            PoolI18n._FRESH_STRINGArray.splice(idx, 1);
                        }
                    }
                    PoolI18n._FRESH_STRINGArray.push(this);
                }
                this.sKey = key;
                this.keystring = text;
                key = text;
            } else if (this.sKey && this.keystring != key) {
                this.sKey = null;
            }
            return key;
        };
        const a = Object.getOwnPropertyDescriptor(cc.Label.prototype, "string");
        Object.defineProperty(cc.Label.prototype, "string", {
            set: function (e) {
                a.set.call(this, i.call(this, e.toString()));
            },
            get: function () {
                this._string = i.call(this, this._string);
                return a.get.call(this);
            }
        });
        const r = Object.getOwnPropertyDescriptor(cc.RichText.prototype, "string");
        Object.defineProperty(cc.RichText.prototype, "string", {
            set: function (e) {
                r.set.call(this, i.call(this, e.toString()));
            },
            get: function () {
                this._N$string = i.call(this, this._N$string);
                return r.get.call(this);
            }
        });
    }

    static getKeyStr(t) {
        if (PoolI18n.i18nArray) {
            const o = PoolI18n.changeStr(t);
            if (o) {
                const n = o.indexOf("??&");
                if (-1 != n) {
                    let i = o.substring(0, n);
                    const a = o.substring(n + 2, o.length);
                    const r = PoolI18n.parseURL(a);
                    const l = i.match(/xxx_\d/g);
                    if (l) {
                        for (let s = 0; s < l.length; s++) {
                            i = i.replace(l[s], r["value" + l[s].substring(4, 5)]);
                        }
                    }
                    return i;
                }
                return o;
            }
            return null;
        }
    }

    static addi18nArray(t) {
        const self = this;
        if (PoolI18n.i18nArray) {
            for (let n = 0, list = t; n < list.length; n++) {
                const a = list[n];
                const r = a.key.lastIndexOf("_");
                if (!(r < 0)) {
                    const l = r + 1;
                    const s = a.key.substring(0, l);
                    const c = parseInt(a.key.substring(l, a.key.length));
                    if (null == PoolI18n.i18nArray[s]) {
                        PoolI18n.i18nArray[s] = {};
                    }
                    if (null == PoolI18n.i18nArray[s][c]) {
                        PoolI18n.i18nArray[s][c] = a;
                    } else {
                        console.error("" + s + c + " 已存在");
                    }
                }
            }
        } else {
            PoolI18n.i18nArray = {};
            setTimeout(function () {
                self.addi18nArray(t);
            }, 16.6);
        }
    }

    static updataString() {
        for (let t = PoolI18n._FRESH_STRINGArray.length - 1; t >= 0; t--) {
            const o = PoolI18n._FRESH_STRINGArray[t];
            if (cc.isValid(o) && o.sKey) {
                const n = PoolI18n.getKeyStr(o.sKey);
                o.keystring = n;
                o.string = n;
            } else {
                PoolI18n._FRESH_STRINGArray.splice(t, 1);
            }
        }
    }

    static setLanguage(t) {
        function o(e) {
            let hash = e.indexOf("#");
            e = e.substring(0, -1 == hash ? e.length : hash);
            const parts = e.split(-1 != e.indexOf("_") ? "_" : "-");
            for (let n = parts.length - 1; n >= 0; n--) {
                if ("" == parts[n]) {
                    parts.splice(n, 1);
                }
            }
            let i = {
                lang: parts[0],
                country: "SBALL"
            };
            if (parts.length > 1) {
                i = {
                    lang: parts[0],
                    country: parts[parts.length - 1]
                };
            }
            return i;
        }
        const n = function () {
            let parsed = o(t);
            const list = PoolI18n.COUNTRY_LIST;
            for (let a = 0; a < list.length; a++) {
                const l = list[a];
                if (parsed.country.toLowerCase() == l.country.toLowerCase()) {
                    return l;
                }
            }
            parsed = {
                lang: "en",
                country: "SBALL"
            };
            for (let s = 0; s < list.length; s++) {
                const l = list[s];
                if (parsed.country.toLowerCase() == l.country.toLowerCase()) {
                    return l;
                }
            }
            return list[0];
        }();
        PoolI18n.myLanguge = n.language;
        PoolI18n.updataString();
    }

    static getReplaceStr(t, o) {
        if (PoolI18n.i18nArray[t] && PoolI18n.i18nArray[t][o]) {
            return PoolI18n.i18nArray[t][o][PoolI18n.myLanguge] ? PoolI18n.i18nArray[t][o][PoolI18n.myLanguge] : PoolI18n.i18nArray[t][o].en ? PoolI18n.i18nArray[t][o].en : null;
        }
    }

    static parseURL(e) {
        let pair;
        const o = {};
        const n = e.split("&");
        const i = n.length;
        for (let a = 0; a < i; a++) {
            if (n[a]) {
                pair = n[a].split("==");
                pair[1] = pair[1].replace(/%/g, "%25");
                o[pair[0]] = decodeURIComponent(pair[1]);
            }
        }
        return o;
    }

    static i18nArray = {};
    static myLanguge = "en";
    static COUNTRY_LIST = [{
        id: 101,
        name: "美国",
        country: "US",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 102,
        name: "英国",
        country: "GB",
        language: "en",
        rate: 1,
        symbol: "￡",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 103,
        name: "法国",
        country: "FR",
        language: "fr",
        rate: 1,
        symbol: "€",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 104,
        name: "德国",
        country: "DE",
        language: "de",
        rate: 1,
        symbol: "€",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 105,
        name: "日本",
        country: "JP",
        language: "ja",
        rate: 100,
        symbol: "円",
        ad_t: 1,
        cash_id: [122, 126, 101, 103]
    }, {
        id: 106,
        name: "加拿大",
        country: "CA",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 107,
        name: "澳大利亚",
        country: "AU",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 108,
        name: "新西兰",
        country: "NZ",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 109,
        name: "挪威",
        country: "NO",
        language: "no",
        rate: 10,
        symbol: "NOK",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 110,
        name: "新加坡",
        country: "SG",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 111,
        name: "瑞典",
        country: "SE",
        language: "se",
        rate: 10,
        symbol: "SEK",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 112,
        name: "瑞士",
        country: "CH",
        language: "de",
        rate: 1,
        symbol: "CHF",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 201,
        name: "西班牙",
        country: "ES",
        language: "es",
        rate: 1,
        symbol: "€",
        ad_t: 2,
        cash_id: [113, 111, 101, 103]
    }, {
        id: 202,
        name: "阿拉伯",
        country: "SA",
        language: "ar",
        rate: 5,
        symbol: "SR",
        ad_t: 2,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 203,
        name: "波兰",
        country: "PL",
        language: "pl",
        rate: 5,
        symbol: "złote",
        ad_t: 2,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 204,
        name: "韩国",
        country: "KR",
        language: "ko",
        rate: 1e3,
        symbol: "₩",
        ad_t: 2,
        cash_id: [130, 101, 103, 102]
    }, {
        id: 205,
        name: "意大利",
        country: "IT",
        language: "it",
        rate: 1,
        symbol: "€",
        ad_t: 2,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 206,
        name: "比利时",
        country: "BE",
        language: "nl",
        rate: 1,
        symbol: "€",
        ad_t: 2,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 207,
        name: "荷兰",
        country: "NL",
        language: "nl",
        rate: 1,
        symbol: "€",
        ad_t: 2,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 301,
        name: "印度",
        country: "IN",
        language: "hi",
        rate: 80,
        symbol: "₹",
        ad_t: 3,
        cash_id: [124, 125, 101, 103]
    }, {
        id: 302,
        name: "印尼",
        country: "ID",
        language: "in",
        rate: 15e3,
        symbol: "Rp",
        ad_t: 3,
        cash_id: [105, 106, 101, 103]
    }, {
        id: 303,
        name: "葡萄牙",
        country: "PT",
        language: "pt",
        rate: 1,
        symbol: "€",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 304,
        name: "泰国",
        country: "TH",
        language: "th",
        rate: 30,
        symbol: "฿",
        ad_t: 3,
        cash_id: [112, 118, 101, 103]
    }, {
        id: 305,
        name: "菲律宾",
        country: "PH",
        language: "fil",
        rate: 50,
        symbol: "₱",
        ad_t: 3,
        cash_id: [121, 116, 101, 103]
    }, {
        id: 306,
        name: "马来西亚",
        country: "MY",
        language: "ms",
        rate: 5,
        symbol: "RM",
        ad_t: 3,
        cash_id: [119, 121, 101, 103]
    }, {
        id: 307,
        name: "哥伦比亚",
        country: "CO",
        language: "es",
        rate: 3e3,
        symbol: "COP",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 308,
        name: "阿根廷",
        country: "AR",
        language: "es",
        rate: 350,
        symbol: "ARS",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 309,
        name: "墨西哥",
        country: "MX",
        language: "es",
        rate: 20,
        symbol: "Mex.$",
        ad_t: 3,
        cash_id: [113, 111, 101, 103]
    }, {
        id: 310,
        name: "巴西",
        country: "BR",
        language: "pt",
        rate: 5,
        symbol: "R$",
        ad_t: 3,
        cash_id: [107, 113, 123, 101]
    }, {
        id: 311,
        name: "越南",
        country: "VN",
        language: "vi",
        rate: 2e4,
        symbol: "₫",
        ad_t: 3,
        cash_id: [120, 115, 101, 103]
    }, {
        id: 312,
        name: "土耳其",
        country: "TR",
        language: "tr",
        rate: 8,
        symbol: "₺",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 313,
        name: "罗马尼亚",
        country: "RO",
        language: "ro",
        rate: 5,
        symbol: "Lei",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 314,
        name: "约旦",
        country: "JO",
        language: "ar",
        rate: 1,
        symbol: "$",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 315,
        name: "伊拉克",
        country: "IQ",
        language: "ar",
        rate: 1,
        symbol: "$",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 316,
        name: "埃及",
        country: "EG",
        language: "ar",
        rate: 1,
        symbol: "$",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 317,
        name: "以色列",
        country: "IL",
        language: "ar",
        rate: 1,
        symbol: "$",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 318,
        name: "俄罗斯",
        country: "RU",
        language: "ru",
        rate: 70,
        symbol: "₽",
        ad_t: 3,
        cash_id: [114, 117, 101, 103]
    }, {
        id: 319,
        name: "乌克兰",
        country: "UA",
        language: "uk",
        rate: 20,
        symbol: "₴",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
    }, {
        id: 400,
        name: "SBALL",
        country: "SBALL",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
    }];
    static _FRESH_STRINGArray = [];
}

cc.js.setClassName("PoolI18n", PoolI18n);
