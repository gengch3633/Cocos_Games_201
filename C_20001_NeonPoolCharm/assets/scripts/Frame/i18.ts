export default class i18 {
    static i18nArray: any = {};
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
        for (let i = this._FRESH_STRINGArray.length - 1; i >= 0; i--) {
            const label = this._FRESH_STRINGArray[i];
            if (cc.isValid(label) && label.sKey) {
                const str = this.getKeyStr(label.sKey);
                label.keystring = str;
                label.string = str;
            } else {
                this._FRESH_STRINGArray.splice(i, 1);
            }
        }
    }

    static parseURL(query: string): any {
        const result: any = {};
        const parts = query.split("&");
        for (let i = 0; i < parts.length; i++) {
            if (parts[i]) {
                const kv = parts[i].split("==");
                kv[1] = kv[1].replace(/%/g, "%25");
                result[kv[0]] = decodeURIComponent(kv[1]);
            }
        }
        return result;
    }

    static setLanguage(langCode: string): void {
        const parseLang = (code: string) => {
            const hashIndex = code.indexOf("#");
            const parts = code
                .substring(0, hashIndex === -1 ? code.length : hashIndex)
                .split(code.indexOf("_") !== -1 ? "_" : "-");
            for (let i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === "") {
                    parts.splice(i, 1);
                }
            }
            let result: any = { lang: parts[0], country: "SBALL" };
            if (parts.length > 1) {
                result = { lang: parts[0], country: parts[parts.length - 1] };
            }
            return result;
        };

        const countryConf = (() => {
            let parsed = parseLang(langCode);
            for (const item of this.COUNTRY_LIST) {
                if (parsed.country.toLowerCase() === item.country.toLowerCase()) {
                    return item;
                }
            }
            parsed = { lang: "en", country: "SBALL" };
            for (const item of this.COUNTRY_LIST) {
                if (parsed.country.toLowerCase() === item.country.toLowerCase()) {
                    return item;
                }
            }
            return this.COUNTRY_LIST[0];
        })();

        this.myLanguge = countryConf.language;
        this.updataString();
    }

    static getKeyStr(key: string): string {
        if (this.i18nArray) {
            const changed = this.changeStr(key);
            if (changed) {
                const paramIndex = changed.indexOf("??&");
                if (paramIndex !== -1) {
                    const prefix = changed.substring(0, paramIndex);
                    const params = changed.substring(paramIndex + 2, changed.length);
                    const parsed = this.parseURL(params);
                    let result = prefix;
                    const placeholders = prefix.match(/ xxx_ \d/g);
                    if (placeholders) {
                        for (let i = 0; i < placeholders.length; i++) {
                            result = result.replace(
                                placeholders[i],
                                parsed["value" + placeholders[i].substring(4, 5)]
                            );
                        }
                    }
                    return result;
                }
                return changed;
            }
            return null;
        }
    }

    static getReplaceStr(group: string, index: number): string {
        if (this.i18nArray[group] && this.i18nArray[group][index]) {
            return this.i18nArray[group][index][this.myLanguge]
                ? this.i18nArray[group][index][this.myLanguge]
                : this.i18nArray[group][index].en
                ? this.i18nArray[group][index].en
                : null;
        }
    }

    static changeStr(text: string): string {
        for (const group in this.i18nArray) {
            const index = text.indexOf(group);
            if (index !== -1) {
                let result = text;
                const numStr = text.substring(index + group.length, index + group.length + 3);
                const num = parseInt(numStr);
                const replacement = this.getReplaceStr(group, num);
                if (replacement) {
                    result = text.replace(group + numStr, replacement);
                    const nested = this.changeStr(result);
                    if (nested) {
                        result = nested;
                    }
                }
                return result;
            }
        }
        return null;
    }

    static addi18nArray(items: any[]): void {
        if (this.i18nArray) {
            for (const item of items) {
                const lastUnderscore = item.key.lastIndexOf("_") + 1;
                const group = item.key.substring(0, lastUnderscore);
                const num = parseInt(item.key.substring(lastUnderscore, item.key.length));
                if (this.i18nArray[group] == null) {
                    this.i18nArray[group] = {};
                }
                if (this.i18nArray[group][num] == null) {
                    this.i18nArray[group][num] = item;
                } else {
                    console.error("" + group + num + " 已存在");
                }
            }
        } else {
            this.i18nArray = {};
            setTimeout(() => {
                this.addi18nArray(items);
            }, 16.6);
        }
    }

    static init(items: any[], langCode?: string, countryList?: any[]): void {
        this.addi18nArray(items);
        this.setLanguage(langCode || cc.sys.languageCode);
        if (countryList) {
            this.COUNTRY_LIST = countryList;
        }

        const wrapString = function (this: any, text: string) {
            const translated = i18.getKeyStr(text);
            if (translated) {
                if (!this.sKey) {
                    for (let i = i18._FRESH_STRINGArray.length - 1; i >= 0; i--) {
                        const label = i18._FRESH_STRINGArray[i];
                        if (!cc.isValid(label) || label.sKey) {
                            i18._FRESH_STRINGArray.splice(i, 1);
                        }
                    }
                    i18._FRESH_STRINGArray.push(this);
                }
                this.sKey = text;
                this.keystring = translated;
                text = translated;
            } else if (this.sKey && this.keystring !== text) {
                this.sKey = null;
            }
            return text;
        };

        const labelDesc = Object.getOwnPropertyDescriptor(cc.Label.prototype, "string");
        Object.defineProperty(cc.Label.prototype, "string", {
            set(value: string) {
                labelDesc.set.call(this, wrapString.call(this, value.toString()));
            },
            get() {
                this._string = wrapString.call(this, this._string);
                return labelDesc.get.call(this);
            },
        });

        const richTextDesc = Object.getOwnPropertyDescriptor(cc.RichText.prototype, "string");
        Object.defineProperty(cc.RichText.prototype, "string", {
            set(value: string) {
                richTextDesc.set.call(this, wrapString.call(this, value.toString()));
            },
            get() {
                this._N$string = wrapString.call(this, this._N$string);
                return richTextDesc.get.call(this);
            },
        });
    }
}

cc.js.setClassName("i18", i18);
