interface I18nEntry {
    key: string;
    [lang: string]: string;
}

interface CountryEntry {
    id: number;
    name: string;
    country: string;
    language: string;
    rate: number;
    symbol: string;
    ad_t: number;
    cash_id: number[];
}

interface I18nStringHost {
    sKey?: string;
    keystring?: string;
    string: string;
    _string?: string;
    _N$string?: string;
}

export default class PoolI18n {
    static i18nArray: Record<string, Record<number, I18nEntry>> = {};
    static myLanguge = "en";
    static COUNTRY_LIST: CountryEntry[] = [{
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
    static _FRESH_STRINGArray: I18nStringHost[] = [];

    static changeStr(text: string): string {
        for (const key in PoolI18n.i18nArray) {
            const index = text.indexOf(key);
            if (-1 != index) {
                let result = text;
                const suffix = text.substring(index + key.length, index + key.length + 3);
                const num = parseInt(suffix);
                const replaceStr = PoolI18n.getReplaceStr(key, num);
                if (replaceStr) {
                    result = text.replace(key + suffix, replaceStr);
                    const nested = PoolI18n.changeStr(result);
                    if (nested) {
                        result = nested;
                    }
                }
                return result;
            }
        }
        return null;
    }

    static init(entries: I18nEntry[], language?: string, countryList?: CountryEntry[]): void {
        PoolI18n.addi18nArray(entries);
        PoolI18n.setLanguage(language || cc.sys.languageCode);
        if (countryList) {
            PoolI18n.COUNTRY_LIST = countryList;
        }
        const resolveString = function (this: I18nStringHost, value: string): string {
            const resolved = PoolI18n.getKeyStr(value);
            if (resolved) {
                if (!this.sKey) {
                    for (let i = PoolI18n._FRESH_STRINGArray.length - 1; i >= 0; i--) {
                        const item = PoolI18n._FRESH_STRINGArray[i];
                        if ((cc.isValid(item as any) && item.sKey) || PoolI18n._FRESH_STRINGArray.splice(i, 1)) {
                        }
                    }
                    PoolI18n._FRESH_STRINGArray.push(this);
                }
                this.sKey = value;
                this.keystring = resolved;
                value = resolved;
            } else if (this.sKey && this.keystring != value) {
                this.sKey = null;
            }
            return value;
        };
        const labelDescriptor = Object.getOwnPropertyDescriptor(cc.Label.prototype, "string");
        Object.defineProperty(cc.Label.prototype, "string", {
            set: function (this: I18nStringHost, value: string) {
                labelDescriptor.set.call(this, resolveString.call(this, value.toString()));
            },
            get: function (this: I18nStringHost) {
                this._string = resolveString.call(this, this._string);
                return labelDescriptor.get.call(this);
            },
        });
        const richTextDescriptor = Object.getOwnPropertyDescriptor(cc.RichText.prototype, "string");
        Object.defineProperty(cc.RichText.prototype, "string", {
            set: function (this: I18nStringHost, value: string) {
                richTextDescriptor.set.call(this, resolveString.call(this, value.toString()));
            },
            get: function (this: I18nStringHost) {
                this._N$string = resolveString.call(this, this._N$string);
                return richTextDescriptor.get.call(this);
            },
        });
    }

    static getKeyStr(text: string): string {
        if (PoolI18n.i18nArray) {
            const changed = PoolI18n.changeStr(text);
            if (changed) {
                const markerIndex = changed.indexOf("??&");
                if (-1 != markerIndex) {
                    let result = changed.substring(0, markerIndex);
                    const query = changed.substring(markerIndex + 2, changed.length);
                    const params = PoolI18n.parseURL(query);
                    const matches = result.match(/xxx_\d/g);
                    if (matches) {
                        for (let i = 0; i < matches.length; i++) {
                            result = result.replace(matches[i], params["value" + matches[i].substring(4, 5)]);
                        }
                    }
                    return result;
                }
                return changed;
            }
            return null;
        }
    }

    static addi18nArray(entries: I18nEntry[]): void {
        if (PoolI18n.i18nArray) {
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                const lastUnderscore = entry.key.lastIndexOf("_");
                if (!(lastUnderscore < 0)) {
                    const prefix = entry.key.substring(0, lastUnderscore + 1);
                    const index = parseInt(entry.key.substring(lastUnderscore + 1, entry.key.length));
                    if (null == PoolI18n.i18nArray[prefix]) {
                        PoolI18n.i18nArray[prefix] = {};
                    }
                    if (null == PoolI18n.i18nArray[prefix][index]) {
                        PoolI18n.i18nArray[prefix][index] = entry;
                    } else {
                        console.error("" + prefix + index + " 已存在");
                    }
                }
            }
        } else {
            PoolI18n.i18nArray = {};
            setTimeout(() => {
                PoolI18n.addi18nArray(entries);
            }, 16.6);
        }
    }

    static updataString(): void {
        for (let i = PoolI18n._FRESH_STRINGArray.length - 1; i >= 0; i--) {
            const item = PoolI18n._FRESH_STRINGArray[i];
            if (cc.isValid(item as any) && item.sKey) {
                const resolved = PoolI18n.getKeyStr(item.sKey);
                item.keystring = resolved;
                item.string = resolved;
            } else {
                PoolI18n._FRESH_STRINGArray.splice(i, 1);
            }
        }
    }

    static setLanguage(languageCode: string): void {
        const parseLanguageCode = (code: string) => {
            const hashIndex = code.indexOf("#");
            const normalized = code.substring(0, -1 == hashIndex ? code.length : hashIndex);
            const parts = normalized.split(-1 != normalized.indexOf("_") ? "_" : "-");
            for (let i = parts.length - 1; i >= 0; i--) {
                if ("" == parts[i]) {
                    parts.splice(i, 1);
                }
            }
            let parsed = {
                lang: parts[0],
                country: "SBALL",
            };
            if (parts.length > 1) {
                parsed = {
                    lang: parts[0],
                    country: parts[parts.length - 1],
                };
            }
            return parsed;
        };
        const matched = (() => {
            let parsed = parseLanguageCode(languageCode);
            const countryList = PoolI18n.COUNTRY_LIST;
            for (let i = 0; i < countryList.length; i++) {
                const item = countryList[i];
                if (parsed.country.toLowerCase() == item.country.toLowerCase()) {
                    return item;
                }
            }
            parsed = {
                lang: "en",
                country: "SBALL",
            };
            for (let i = 0; i < countryList.length; i++) {
                const item = countryList[i];
                if (parsed.country.toLowerCase() == item.country.toLowerCase()) {
                    return item;
                }
            }
            return countryList[0];
        })();
        PoolI18n.myLanguge = matched.language;
        PoolI18n.updataString();
    }

    static getReplaceStr(prefix: string, index: number): string {
        if (PoolI18n.i18nArray[prefix] && PoolI18n.i18nArray[prefix][index]) {
            const entry = PoolI18n.i18nArray[prefix][index];
            return entry[PoolI18n.myLanguge]
                ? entry[PoolI18n.myLanguge]
                : entry.en
                  ? entry.en
                  : null;
        }
    }

    static parseURL(query: string): Record<string, string> {
        const result: Record<string, string> = {};
        const pairs = query.split("&");
        for (let i = 0; i < pairs.length; i++) {
            if (pairs[i]) {
                const parts = pairs[i].split("==");
                parts[1] = parts[1].replace(/%/g, "%25");
                result[parts[0]] = decodeURIComponent(parts[1]);
            }
        }
        return result;
    }
}

cc.js.setClassName("PoolI18n", PoolI18n);
