interface I18nEntry {
    key: string;
    [lang: string]: string;
}

interface CountryInfo {
    id: number;
    name: string;
    country: string;
    language: string;
    rate: number;
    symbol: string;
    ad_t: number;
    cash_id: number[];
}

interface LangInfo {
    lang: string;
    country: string;
}

export default class PoolI18n {
    static i18nArray: { [prefix: string]: { [index: number]: I18nEntry } } = {};
    static myLanguge = "en";
    static COUNTRY_LIST: CountryInfo[] = [
        { id: 101, name: "美国", country: "US", language: "en", rate: 1, symbol: "$", ad_t: 1, cash_id: [101, 103, 102, 104] },
        { id: 102, name: "英国", country: "GB", language: "en", rate: 1, symbol: "￡", ad_t: 1, cash_id: [101, 103, 102, 104] },
        { id: 103, name: "法国", country: "FR", language: "fr", rate: 1, symbol: "€", ad_t: 1, cash_id: [101, 103, 102, 104] },
        { id: 104, name: "德国", country: "DE", language: "de", rate: 1, symbol: "€", ad_t: 1, cash_id: [101, 103, 102, 104] },
        { id: 105, name: "日本", country: "JP", language: "ja", rate: 100, symbol: "円", ad_t: 1, cash_id: [122, 126, 101, 103] },
        { id: 106, name: "加拿大", country: "CA", language: "en", rate: 1, symbol: "$", ad_t: 1, cash_id: [101, 103, 102, 104] },
        { id: 107, name: "澳大利亚", country: "AU", language: "en", rate: 1, symbol: "$", ad_t: 1, cash_id: [101, 103, 102, 104] },
        { id: 108, name: "新西兰", country: "NZ", language: "en", rate: 1, symbol: "$", ad_t: 1, cash_id: [101, 103, 102, 104] },
        { id: 109, name: "挪威", country: "NO", language: "no", rate: 10, symbol: "NOK", ad_t: 1, cash_id: [101, 103, 102, 104] },
        { id: 110, name: "新加坡", country: "SG", language: "en", rate: 1, symbol: "$", ad_t: 1, cash_id: [101, 103, 102, 104] },
        { id: 111, name: "瑞典", country: "SE", language: "se", rate: 10, symbol: "SEK", ad_t: 1, cash_id: [101, 103, 102, 104] },
        { id: 112, name: "瑞士", country: "CH", language: "de", rate: 1, symbol: "CHF", ad_t: 1, cash_id: [101, 103, 102, 104] },
        { id: 201, name: "西班牙", country: "ES", language: "es", rate: 1, symbol: "€", ad_t: 2, cash_id: [113, 111, 101, 103] },
        { id: 202, name: "阿拉伯", country: "SA", language: "ar", rate: 5, symbol: "SR", ad_t: 2, cash_id: [101, 103, 102, 104] },
        { id: 203, name: "波兰", country: "PL", language: "pl", rate: 5, symbol: "złote", ad_t: 2, cash_id: [101, 103, 102, 104] },
        { id: 204, name: "韩国", country: "KR", language: "ko", rate: 1000, symbol: "₩", ad_t: 2, cash_id: [130, 101, 103, 102] },
        { id: 205, name: "意大利", country: "IT", language: "it", rate: 1, symbol: "€", ad_t: 2, cash_id: [101, 103, 102, 104] },
        { id: 206, name: "比利时", country: "BE", language: "nl", rate: 1, symbol: "€", ad_t: 2, cash_id: [101, 103, 102, 104] },
        { id: 207, name: "荷兰", country: "NL", language: "nl", rate: 1, symbol: "€", ad_t: 2, cash_id: [101, 103, 102, 104] },
        { id: 301, name: "印度", country: "IN", language: "hi", rate: 80, symbol: "₹", ad_t: 3, cash_id: [124, 125, 101, 103] },
        { id: 302, name: "印尼", country: "ID", language: "in", rate: 15000, symbol: "Rp", ad_t: 3, cash_id: [105, 106, 101, 103] },
        { id: 303, name: "葡萄牙", country: "PT", language: "pt", rate: 1, symbol: "€", ad_t: 3, cash_id: [101, 103, 102, 104] },
        { id: 304, name: "泰国", country: "TH", language: "th", rate: 30, symbol: "฿", ad_t: 3, cash_id: [112, 118, 101, 103] },
        { id: 305, name: "菲律宾", country: "PH", language: "fil", rate: 50, symbol: "₱", ad_t: 3, cash_id: [121, 116, 101, 103] },
        { id: 306, name: "马来西亚", country: "MY", language: "ms", rate: 5, symbol: "RM", ad_t: 3, cash_id: [119, 121, 101, 103] },
        { id: 307, name: "哥伦比亚", country: "CO", language: "es", rate: 3000, symbol: "COP", ad_t: 3, cash_id: [101, 103, 102, 104] },
        { id: 308, name: "阿根廷", country: "AR", language: "es", rate: 350, symbol: "ARS", ad_t: 3, cash_id: [101, 103, 102, 104] },
        { id: 309, name: "墨西哥", country: "MX", language: "es", rate: 20, symbol: "Mex.$", ad_t: 3, cash_id: [113, 111, 101, 103] },
        { id: 310, name: "巴西", country: "BR", language: "pt", rate: 5, symbol: "R$", ad_t: 3, cash_id: [107, 113, 123, 101] },
        { id: 311, name: "越南", country: "VN", language: "vi", rate: 20000, symbol: "₫", ad_t: 3, cash_id: [120, 115, 101, 103] },
        { id: 312, name: "土耳其", country: "TR", language: "tr", rate: 8, symbol: "₺", ad_t: 3, cash_id: [101, 103, 102, 104] },
        { id: 313, name: "罗马尼亚", country: "RO", language: "ro", rate: 5, symbol: "Lei", ad_t: 3, cash_id: [101, 103, 102, 104] },
        { id: 314, name: "约旦", country: "JO", language: "ar", rate: 1, symbol: "$", ad_t: 3, cash_id: [101, 103, 102, 104] },
        { id: 315, name: "伊拉克", country: "IQ", language: "ar", rate: 1, symbol: "$", ad_t: 3, cash_id: [101, 103, 102, 104] },
        { id: 316, name: "埃及", country: "EG", language: "ar", rate: 1, symbol: "$", ad_t: 3, cash_id: [101, 103, 102, 104] },
        { id: 317, name: "以色列", country: "IL", language: "ar", rate: 1, symbol: "$", ad_t: 3, cash_id: [101, 103, 102, 104] },
        { id: 318, name: "俄罗斯", country: "RU", language: "ru", rate: 70, symbol: "₽", ad_t: 3, cash_id: [114, 117, 101, 103] },
        { id: 319, name: "乌克兰", country: "UA", language: "uk", rate: 20, symbol: "₴", ad_t: 3, cash_id: [101, 103, 102, 104] },
        { id: 400, name: "SBALL", country: "SBALL", language: "en", rate: 1, symbol: "$", ad_t: 3, cash_id: [101, 103, 102, 104] },
    ];
    static _FRESH_STRINGArray: any[] = [];

    static changeStr(text: string): string {
        for (const prefix in PoolI18n.i18nArray) {
            const index = text.indexOf(prefix);
            if (index != -1) {
                let result = text;
                const suffix = text.substring(index + prefix.length, index + prefix.length + 3);
                const num = parseInt(suffix);
                const replaceStr = PoolI18n.getReplaceStr(prefix, num);
                if (replaceStr) {
                    result = text.replace(prefix + suffix, replaceStr);
                    const nested = this.changeStr(result);
                    nested && (result = nested);
                }
                return result;
            }
        }
        return null;
    }

    static init(entries: I18nEntry[], language?: string, countryList?: CountryInfo[]): void {
        PoolI18n.addi18nArray(entries);
        PoolI18n.setLanguage(language || cc.sys.languageCode);
        countryList && (PoolI18n.COUNTRY_LIST = countryList);
        const freshString = function (this: any, text: string): string {
            const keyStr = PoolI18n.getKeyStr(text);
            if (keyStr) {
                if (!this.sKey) {
                    for (let n = PoolI18n._FRESH_STRINGArray.length - 1; n >= 0; n--) {
                        const item = PoolI18n._FRESH_STRINGArray[n];
                        if (cc.isValid(item) && item.sKey) {
                            continue;
                        }
                        PoolI18n._FRESH_STRINGArray.splice(n, 1);
                    }
                    PoolI18n._FRESH_STRINGArray.push(this);
                }
                this.sKey = text;
                this.keystring = keyStr;
                text = keyStr;
            } else if (this.sKey && this.keystring != text) {
                this.sKey = null;
            }
            return text;
        };
        const labelDesc = Object.getOwnPropertyDescriptor(cc.Label.prototype, "string");
        Object.defineProperty(cc.Label.prototype, "string", {
            set(value: string) {
                labelDesc.set.call(this, freshString.call(this, value.toString()));
            },
            get() {
                this._string = freshString.call(this, this._string);
                return labelDesc.get.call(this);
            },
        });
        const richTextDesc = Object.getOwnPropertyDescriptor(cc.RichText.prototype, "string");
        Object.defineProperty(cc.RichText.prototype, "string", {
            set(value: string) {
                richTextDesc.set.call(this, freshString.call(this, value.toString()));
            },
            get() {
                this._N$string = freshString.call(this, this._N$string);
                return richTextDesc.get.call(this);
            },
        });
    }

    static getKeyStr(text: string): string {
        if (PoolI18n.i18nArray) {
            const changed = PoolI18n.changeStr(text);
            if (changed) {
                const paramIndex = changed.indexOf("??&");
                if (paramIndex != -1) {
                    let result = changed.substring(0, paramIndex);
                    const paramStr = changed.substring(paramIndex + 2, changed.length);
                    const params = PoolI18n.parseURL(paramStr);
                    const placeholders = result.match(/ xxx_ \d/g);
                    if (placeholders) {
                        for (let s = 0; s < placeholders.length; s++) {
                            result = result.replace(placeholders[s], params["value" + placeholders[s].substring(4, 5)]);
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
            for (let n = 0; n < entries.length; n++) {
                const entry = entries[n];
                const lastUnderscore = entry.key.lastIndexOf("_");
                if (!(lastUnderscore < 0)) {
                    const prefix = entry.key.substring(0, lastUnderscore + 1);
                    const index = parseInt(entry.key.substring(lastUnderscore + 1, entry.key.length));
                    if (PoolI18n.i18nArray[prefix] == null) {
                        PoolI18n.i18nArray[prefix] = {};
                    }
                    if (PoolI18n.i18nArray[prefix][index] == null) {
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
        for (let t = PoolI18n._FRESH_STRINGArray.length - 1; t >= 0; t--) {
            const item = PoolI18n._FRESH_STRINGArray[t];
            if (cc.isValid(item) && item.sKey) {
                const keyStr = PoolI18n.getKeyStr(item.sKey);
                item.keystring = keyStr;
                item.string = keyStr;
            } else {
                PoolI18n._FRESH_STRINGArray.splice(t, 1);
            }
        }
    }

    static setLanguage(languageCode: string): void {
        const parseLang = (code: string): LangInfo => {
            const hashIndex = code.indexOf("#");
            const normalized = code.substring(0, hashIndex == -1 ? code.length : hashIndex);
            const parts = normalized.split(normalized.indexOf("_") != -1 ? "_" : "-");
            for (let n = parts.length - 1; n >= 0; n--) {
                if (parts[n] == "") {
                    parts.splice(n, 1);
                }
            }
            const info: LangInfo = { lang: parts[0], country: "SBALL" };
            if (parts.length > 1) {
                return { lang: parts[0], country: parts[parts.length - 1] };
            }
            return info;
        };
        const selected = (() => {
            const parsed = parseLang(languageCode);
            const list = PoolI18n.COUNTRY_LIST;
            for (let a = 0; a < list.length; a++) {
                const item = list[a];
                if (parsed.country.toLowerCase() == item.country.toLowerCase()) {
                    return item;
                }
            }
            const fallback = { lang: "en", country: "SBALL" };
            for (let s = 0; s < list.length; s++) {
                const item = list[s];
                if (fallback.country.toLowerCase() == item.country.toLowerCase()) {
                    return item;
                }
            }
            return list[0];
        })();
        PoolI18n.myLanguge = selected.language;
        PoolI18n.updataString();
    }

    static getReplaceStr(prefix: string, index: number): string {
        if (PoolI18n.i18nArray[prefix] && PoolI18n.i18nArray[prefix][index]) {
            const entry = PoolI18n.i18nArray[prefix][index];
            return entry[PoolI18n.myLanguge] ? entry[PoolI18n.myLanguge] : entry.en ? entry.en : null;
        }
    }

    static parseURL(query: string): { [key: string]: string } {
        const result: { [key: string]: string } = {};
        const pairs = query.split("&");
        for (let a = 0; a < pairs.length; a++) {
            if (pairs[a]) {
                const parts = pairs[a].split("==");
                parts[1] = parts[1].replace(/%/g, "%25");
                result[parts[0]] = decodeURIComponent(parts[1]);
            }
        }
        return result;
    }
}

cc.js.setClassName("PoolI18n", PoolI18n);
