export default class i18 {

    static updataString() {
        for (let t = i18._FRESH_STRINGArray.length - 1; t >= 0; t--) {
            let a = i18._FRESH_STRINGArray[t];
            if (cc.isValid(a) && a.sKey) {
                let o = i18.getKeyStr(a.sKey);
                a.keystring = o;
                a.string = o;
            } else {
                i18._FRESH_STRINGArray.splice(t, 1);
            }
        }
    }

    static parseURL(e) {
        let a = {};
        let o = e.split("&");
        let n = o.length;
        for (let i = 0; i < n; i++) {
            if (o[i]) {
                let t = o[i].split("==");
                t[1] = t[1].replace(/%/g, "%25");
                a[t[0]] = decodeURIComponent(t[1]);
            }
        }
        return a;
    }

    static setLanguage(t) {
        function parseLang(e) {
            let hash = e.indexOf("#");
            e = e.substring(0, -1 == hash ? e.length : hash);
            let parts = e.split(-1 != e.indexOf("_") ? "_" : "-");
            for (let o = parts.length - 1; o >= 0; o--) {
                if ("" == parts[o]) {
                    parts.splice(o, 1);
                }
            }
            let n: any = {
                lang: parts[0],
                country: "SBALL"
            };
            if (parts.length > 1) {
                n = {
                    lang: parts[0],
                    country: parts[parts.length - 1]
                };
            }
            return n;
        }
        let o = function () {
            let parsed = parseLang(t);
            let n = i18.COUNTRY_LIST;
            for (let i = 0, r = n; i < r.length; i++) {
                let c = r[i];
                if (parsed.country.toLowerCase() == c.country.toLowerCase()) {
                    return c;
                }
            }
            parsed = {
                lang: "en",
                country: "SBALL"
            };
            for (let s = 0, l = n; s < l.length; s++) {
                let c = l[s];
                if (parsed.country.toLowerCase() == c.country.toLowerCase()) {
                    return c;
                }
            }
            return n[0];
        }();
        i18.myLanguge = o.language;
        i18.updataString();
    }

    static getKeyStr(t) {
        if (i18.i18nArray) {
            let a = i18.changeStr(t);
            if (a) {
                let o = a.indexOf("??&");
                if (-1 != o) {
                    let n = a.substring(0, o);
                    let i = a.substring(o + 2, a.length);
                    let r = i18.parseURL(i);
                    let c = n.match(/xxx_\d/g);
                    if (c) {
                        for (let s = 0; s < c.length; s++) {
                            n = n.replace(c[s], r["value" + c[s].substring(4, 5)]);
                        }
                    }
                    return n;
                }
                return a;
            }
            return null;
        }
    }

    static getReplaceStr(t, a) {
        if (i18.i18nArray[t] && i18.i18nArray[t][a]) {
            return i18.i18nArray[t][a][i18.myLanguge] ? i18.i18nArray[t][a][i18.myLanguge] : i18.i18nArray[t][a].en ? i18.i18nArray[t][a].en : null;
        }
    }

    static changeStr(t) {
        for (let key in i18.i18nArray) {
            let o = t.indexOf(key);
            if (-1 != o) {
                let n = t;
                let i = t.substring(o + key.length, o + key.length + 3);
                let r = parseInt(i);
                let c = i18.getReplaceStr(key, r);
                if (c) {
                    n = t.replace(key + i, c);
                    let s = this.changeStr(n);
                    if (s) {
                        n = s;
                    }
                }
                return n;
            }
        }
        return null;
    }

    static addi18nArray(t) {
        let self = this;
        if (i18.i18nArray) {
            for (let o = 0, n = t; o < n.length; o++) {
                let i = n[o];
                let r = i.key.lastIndexOf("_") + 1;
                let c = i.key.substring(0, r);
                let s = parseInt(i.key.substring(r, i.key.length));
                if (null == i18.i18nArray[c]) {
                    i18.i18nArray[c] = {};
                }
                if (null == i18.i18nArray[c][s]) {
                    i18.i18nArray[c][s] = i;
                } else {
                    console.error("" + c + s + " 已存在");
                }
            }
        } else {
            i18.i18nArray = {};
            setTimeout(function () {
                self.addi18nArray(t);
            }, 16.6);
        }
    }

    static init(t, a, o) {
        i18.addi18nArray(t);
        i18.setLanguage(a || cc.sys.languageCode);
        if (o) {
            i18.COUNTRY_LIST = o;
        }
        let n = function (key) {
            let translated = i18.getKeyStr(key);
            if (translated) {
                if (!this.sKey) {
                    for (let index = i18._FRESH_STRINGArray.length - 1; index >= 0; index--) {
                        let item = i18._FRESH_STRINGArray[index];
                        if (!(cc.isValid(item) && item.sKey)) {
                            i18._FRESH_STRINGArray.splice(index, 1);
                        }
                    }
                    i18._FRESH_STRINGArray.push(this);
                }
                this.sKey = key;
                this.keystring = translated;
                key = translated;
            } else if (this.sKey && this.keystring != key) {
                this.sKey = null;
            }
            return key;
        };
        let labelDesc = Object.getOwnPropertyDescriptor(cc.Label.prototype, "string");
        Object.defineProperty(cc.Label.prototype, "string", {
            set: function (e) {
                labelDesc.set.call(this, n.call(this, e.toString()));
            },
            get: function () {
                this._string = n.call(this, this._string);
                return labelDesc.get.call(this);
            }
        });
        let richDesc = Object.getOwnPropertyDescriptor(cc.RichText.prototype, "string");
        Object.defineProperty(cc.RichText.prototype, "string", {
            set: function (e) {
                richDesc.set.call(this, n.call(this, e.toString()));
            },
            get: function () {
                this._N$string = n.call(this, this._N$string);
                return richDesc.get.call(this);
            }
        });
    }

    static i18nArray: any = {};
    static myLanguge: string = "en";
    static COUNTRY_LIST: any[] = [{
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
    static _FRESH_STRINGArray: any[] = [];
}

cc.js.setClassName("i18", i18);
