declare function require(id: string): any;

var middleHelper: any = null;
try {
    var middleModule = require("./MiddleHelper");
    middleHelper = middleModule && middleModule.default ? middleModule.default : middleModule;
} catch (e) {}

var rules: any = {
    CN: {
        symbol: " ¥ ",
        group: ", ",
        decimal: ".",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    BR: {
        symbol: " R$ ",
        group: ".",
        decimal: ", ",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    ID: {
        symbol: " Rp ",
        group: ".",
        decimal: ", ",
        decimals: 0,
        unit: 1,
        noSpace: true
    },
    US: {
        symbol: " $ ",
        group: ", ",
        decimal: ".",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    JP: {
        symbol: " ¥ ",
        group: ", ",
        decimal: ".",
        decimals: 0,
        unit: 1,
        noSpace: true
    },
    KR: {
        symbol: " ₩ ",
        group: ", ",
        decimal: ".",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    RU: {
        symbol: " ₽ ",
        group: " ",
        decimal: ", ",
        decimals: 2,
        unit: 100,
        noSpace: false
    },
    MX: {
        symbol: " $ ",
        group: ", ",
        decimal: ".",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    CO: {
        symbol: " $ ",
        group: ".",
        decimal: ", ",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    AR: {
        symbol: " AR$ ",
        group: ".",
        decimal: ", ",
        decimals: 0,
        unit: 1,
        noSpace: true
    },
    PE: {
        symbol: " S/ ",
        group: ", ",
        decimal: ".",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    ES: {
        symbol: " € ",
        group: ".",
        decimal: ", ",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    VN: {
        symbol: " ₫ ",
        group: ".",
        decimal: ", ",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    TH: {
        symbol: " ฿ ",
        group: ", ",
        decimal: ".",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    IN: {
        symbol: " ₹ ",
        group: ", ",
        decimal: ".",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    PH: {
        symbol: " ₱ ",
        group: ", ",
        decimal: ".",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    MY: {
        symbol: " RM ",
        group: ", ",
        decimal: ".",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    PT: {
        symbol: " € ",
        group: ".",
        decimal: ", ",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    DE: {
        symbol: " € ",
        group: ".",
        decimal: ", ",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    IT: {
        symbol: " € ",
        group: ".",
        decimal: ", ",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    SA: {
        symbol: " SAR ",
        group: ", ",
        decimal: ".",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    ZA: {
        symbol: " R ",
        group: " ",
        decimal: ".",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    EG: {
        symbol: " E £ ",
        group: ", ",
        decimal: ".",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    KE: {
        symbol: " KSh ",
        group: ", ",
        decimal: ".",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    PK: {
        symbol: " Rs ",
        group: ", ",
        decimal: ".",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    BD: {
        symbol: " ৳ ",
        group: ", ",
        decimal: ".",
        decimals: 2,
        unit: 100,
        noSpace: true
    },
    NG: {
        symbol: " ₦ ",
        group: ", ",
        decimal: ".",
        decimals: 0,
        unit: 1,
        noSpace: true
    }
};

function upper(e: any): string {
    return String(e || " ").toUpperCase();
}

function readHelperCountry(): string {
    if (!middleHelper || "function" != typeof middleHelper.getRegionalState) return " ";
    try {
        var e = middleHelper.getRegionalState();
        return upper(e && e.country);
    } catch (e) {
        return " ";
    }
}

var CurrencyFormatService = {
    _country: " ",
    setCountry: function(e: any) {
        var t = upper(e);
        if (!t) return " ";
        this._country = t;
        try {
            cc.sys.localStorage.setItem(" APP_COUNTRY_CODE ", t);
        } catch (e) {}
        return this._country;
    },
    getCurrentCountry: function() {
        var e = readHelperCountry();
        if (e) {
            this._country = e;
            return e;
        }
        var t: any, i: any, n = upper(this._country);
        if (n) return n;
        try {
            if (n = upper(cc.sys.localStorage.getItem(" APP_COUNTRY_CODE "))) {
                this._country = n;
                return n;
            }
            if (n = upper(cc.sys.localStorage.getItem(" MB_CACHE_ATTR_COUNTRY "))) {
                this._country = n;
                return n;
            }
        } catch (e) {}
        n = (t = cc && cc.sys ? cc.sys.language : " ", 0 === (i = String(t || " ").toLowerCase()).indexOf(" zh ") ? " CN " : 0 === i.indexOf(" id ") ? " ID " : 0 === i.indexOf(" pt- pt ") ? " PT " : 0 === i.indexOf(" pt ") ? " BR " : 0 === i.indexOf(" es ") ? " MX " : 0 === i.indexOf(" ja ") ? " JP " : 0 === i.indexOf(" ko ") ? " KR " : 0 === i.indexOf(" ru ") ? " RU " : 0 === i.indexOf(" th ") ? " TH " : 0 === i.indexOf(" vi ") ? " VN " : 0 === i.indexOf(" de ") ? " DE " : 0 === i.indexOf(" it ") ? " IT " : 0 === i.indexOf(" bn ") ? " BD " : " IN ");
        this._country = n;
        return n;
    },
    getRule: function(e: any) {
        var t = upper(e || this.getCurrentCountry());
        return rules[t] || rules.IN;
    },
    getRealMoney: function(e: any, t: any) {
        var i = this.getRule(t), n = Number(e || 0);
        isNaN(n) && (n = 0);
        return n / (i.unit || 100);
    },
    formatNumber: function(e: any, t: any) {
        var i = this.getRule(t), n = Number(e || 0);
        isNaN(n) && (n = 0);
        var a = n.toFixed(i.decimals).split("."), o = a[0], r = a.length > 1 ? a[1] : " ";
        o = o.replace(/\B(?=(\d{3})+(?!\d))/g, i.group);
        return i.decimals <= 0 ? o : o + i.decimal + r;
    },
    getCurrencySymbol: function(e?: any) {
        return this.getRule(e).symbol || " ";
    },
    formatCurrency: function(e: any) {
        var t = arguments.length > 1 ? arguments[1] : e, i = this.getCurrentCountry(), n = this.getRule(i), a = this.getRealMoney(t, i), o = this.formatNumber(a, i), r = n.symbol || " ";
        return r ? n.noSpace ? r + o : r + " " + o : o;
    },
    formatCurrencyInteger: function(e: any) {
        var t = arguments.length > 1 ? arguments[1] : e, i = this.getCurrentCountry(), n = this.getRule(i), a = this.getRealMoney(t, i), o = Math.max(0, Math.floor(Number(a) || 0)), r = n.group || ", ", s = String(o).replace(/\B(?=(\d{3})+(?!\d))/g, r), l = n.symbol || " ";
        return l ? n.noSpace ? l + s : l + " " + s : s;
    }
};

export default CurrencyFormatService;
