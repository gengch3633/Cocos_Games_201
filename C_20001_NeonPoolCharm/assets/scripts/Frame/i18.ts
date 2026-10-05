export default class i18 {
    static i18nArray: Record<string, Record<number, any>> = {};
    static myLanguge: string = "en";
    static COUNTRY_LIST: any[] = [
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

    static updataString(): void {
        for (let i = i18._FRESH_STRINGArray.length - 1; i >= 0; i--) {
            const item = i18._FRESH_STRINGArray[i];
            if (cc.isValid(item) && item.sKey) {
                const str = i18.getKeyStr(item.sKey);
                item.keystring = str;
                item.string = str;
            } else {
                i18._FRESH_STRINGArray.splice(i, 1);
            }
        }
    }

    static parseURL(query: string): Record<string, string> {
        const result: Record<string, string> = {};
        const parts = query.split("&");
        for (let i = 0; i < parts.length; i++) {
            if (parts[i]) {
                const pair = parts[i].split("==");
                pair[1] = pair[1].replace(/%/g, "%25");
                result[pair[0]] = decodeURIComponent(pair[1]);
            }
        }
        return result;
    }

    static setLanguage(langCode: string): void {
        const parseLang = (code: string) => {
            const hashIndex = code.indexOf("#");
            const normalized = code.substring(0, hashIndex == -1 ? code.length : hashIndex);
            const parts = normalized.split(normalized.indexOf("_") != -1 ? "_" : "-");
            for (let i = parts.length - 1; i >= 0; i--) {
                if (parts[i] == "") {
                    parts.splice(i, 1);
                }
            }
            let result = { lang: parts[0], country: "SBALL" };
            if (parts.length > 1) {
                result = { lang: parts[0], country: parts[parts.length - 1] };
            }
            return result;
        };
        const matched = (() => {
            let parsed = parseLang(langCode);
            for (const country of i18.COUNTRY_LIST) {
                if (parsed.country.toLowerCase() == country.country.toLowerCase()) {
                    return country;
                }
            }
            parsed = { lang: "en", country: "SBALL" };
            for (const country of i18.COUNTRY_LIST) {
                if (parsed.country.toLowerCase() == country.country.toLowerCase()) {
                    return country;
                }
            }
            return i18.COUNTRY_LIST[0];
        })();
        i18.myLanguge = matched.language;
        i18.updataString();
    }

    static getKeyStr(key: string): string {
        if (!i18.i18nArray) {
            return null;
        }
        const changed = i18.changeStr(key);
        if (!changed) {
            return null;
        }
        const paramIndex = changed.indexOf("??&");
        if (paramIndex != -1) {
            let text = changed.substring(0, paramIndex);
            const params = i18.parseURL(changed.substring(paramIndex + 2));
            const placeholders = text.match(/xxx_\d/g);
            if (placeholders) {
                for (let i = 0; i < placeholders.length; i++) {
                    text = text.replace(placeholders[i], params["value" + placeholders[i].substring(4, 5)]);
                }
            }
            return text;
        }
        return changed;
    }

    static getReplaceStr(group: string, index: number): string {
        if (i18.i18nArray[group] && i18.i18nArray[group][index]) {
            const entry = i18.i18nArray[group][index];
            return entry[i18.myLanguge] ? entry[i18.myLanguge] : entry.en ? entry.en : null;
        }
        return null;
    }

    static changeStr(text: string): string {
        for (const group in i18.i18nArray) {
            const index = text.indexOf(group);
            if (index != -1) {
                let result = text;
                const suffix = text.substring(index + group.length, index + group.length + 3);
                const num = parseInt(suffix);
                const replacement = i18.getReplaceStr(group, num);
                if (replacement) {
                    result = text.replace(group + suffix, replacement);
                    const nested = i18.changeStr(result);
                    if (nested) {
                        result = nested;
                    }
                }
                return result;
            }
        }
        return null;
    }

    static addi18nArray(entries: any[]): void {
        if (i18.i18nArray) {
            for (const entry of entries) {
                const splitIndex = entry.key.lastIndexOf("_") + 1;
                const group = entry.key.substring(0, splitIndex);
                const index = parseInt(entry.key.substring(splitIndex));
                if (i18.i18nArray[group] == null) {
                    i18.i18nArray[group] = {};
                }
                if (i18.i18nArray[group][index] == null) {
                    i18.i18nArray[group][index] = entry;
                } else {
                    console.error("" + group + index + " 已存在");
                }
            }
        } else {
            i18.i18nArray = {};
            setTimeout(() => {
                i18.addi18nArray(entries);
            }, 16.6);
        }
    }

    static init(entries: any[], langCode?: string, countryList?: any[]): void {
        i18.addi18nArray(entries);
        i18.setLanguage(langCode || cc.sys.languageCode);
        if (countryList) {
            i18.COUNTRY_LIST = countryList;
        }
        const resolveString = function (this: any, value: string) {
            const resolved = i18.getKeyStr(value);
            if (resolved) {
                if (!this.sKey) {
                    for (let i = i18._FRESH_STRINGArray.length - 1; i >= 0; i--) {
                        const item = i18._FRESH_STRINGArray[i];
                        if (!cc.isValid(item) || !item.sKey) {
                            i18._FRESH_STRINGArray.splice(i, 1);
                        }
                    }
                    i18._FRESH_STRINGArray.push(this);
                }
                this.sKey = value;
                this.keystring = resolved;
                value = resolved;
            } else if (this.sKey && this.keystring != value) {
                this.sKey = null;
            }
            return value;
        };
        const labelDesc = Object.getOwnPropertyDescriptor(cc.Label.prototype, "string");
        Object.defineProperty(cc.Label.prototype, "string", {
            set(value: string) {
                labelDesc.set.call(this, resolveString.call(this, value.toString()));
            },
            get() {
                this._string = resolveString.call(this, this._string);
                return labelDesc.get.call(this);
            },
        });
        const richTextDesc = Object.getOwnPropertyDescriptor(cc.RichText.prototype, "string");
        Object.defineProperty(cc.RichText.prototype, "string", {
            set(value: string) {
                richTextDesc.set.call(this, resolveString.call(this, value.toString()));
            },
            get() {
                this._N$string = resolveString.call(this, this._N$string);
                return richTextDesc.get.call(this);
            },
        });
    }
}

cc.js.setClassName("i18", i18);
