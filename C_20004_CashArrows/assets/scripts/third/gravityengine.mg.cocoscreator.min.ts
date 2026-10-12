function ownKeys(object, enumerableOnly) {
    const keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        let symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter((sym) => Object.getOwnPropertyDescriptor(object, sym).enumerable);
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function objectSpread(target, ...sources) {
    sources.forEach((source, index) => {
        const src = source != null ? source : {};
        if ((index + 1) % 2) {
            ownKeys(Object(src), true).forEach((key) => {
                target[key] = src[key];
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(src));
        } else {
            ownKeys(Object(src)).forEach((key) => {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(src, key));
            });
        }
    });
    return target;
}

const LIB_INFO = {
    LIB_VERSION: "4.8.1",
    LIB_NAME: "MG",
    LIB_STACK: "cocoscreator",
    BASE_URL: "https://backend.gravity-engine.com/event_center/api/v1"
};

const utils = {};
const arrayProto = Array.prototype;
const objectProto = Object.prototype;
const slice = arrayProto.slice;
const toString = objectProto.toString;
const hasOwn = objectProto.hasOwnProperty;
const nativeForEach = arrayProto.forEach;
const nativeIsArray = Array.isArray;
const BREAKER = {};

utils.isNumber = function (value) {
    return typeof value === "number"
        ? value - value === 0
        : typeof value === "string" && value.trim() !== "" && (Number.isFinite ? Number.isFinite(+value) : isFinite(+value));
};

utils.each = function (obj, iteratee, context) {
    if (obj == null) {
        return false;
    }
    if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iteratee, context);
    } else if (obj.length === +obj.length) {
        for (let i = 0, len = obj.length; i < len; i++) {
            if (i in obj && iteratee.call(context, obj[i], i, obj) === BREAKER) {
                return false;
            }
        }
    } else {
        for (const key in obj) {
            if (hasOwn.call(obj, key) && iteratee.call(context, obj[key], key, obj) === BREAKER) {
                return false;
            }
        }
    }
};

utils.sleep = function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

utils.extend = function (target) {
    utils.each(slice.call(arguments, 1), (source) => {
        for (const key in source) {
            if (source[key] !== undefined) {
                target[key] = source[key];
            }
        }
    });
    return target;
};

utils.extend2Layers = function (target) {
    utils.each(slice.call(arguments, 1), (source) => {
        for (const key in source) {
            if (source[key] === undefined) {
                continue;
            }
            if (utils.isObject(source[key]) && utils.isObject(target[key])) {
                utils.extend(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    });
    return target;
};

utils.isArray = nativeIsArray || function (value) {
    return toString.call(value) === "[object Array]";
};

utils.isFunction = function (value) {
    try {
        return typeof value === "function";
    } catch (e) {
        return false;
    }
};

utils.isPromise = function (value) {
    return toString.call(value) === "[object Promise]" && value != null;
};

utils.isObject = function (value) {
    return toString.call(value) === "[object Object]" && value != null;
};

utils.isEmptyObject = function (value) {
    if (utils.isObject(value)) {
        for (const key in value) {
            if (hasOwn.call(value, key)) {
                return false;
            }
        }
        return true;
    }
    return false;
};

utils.isUndefined = function (value) {
    return value === undefined;
};

utils.isString = function (value) {
    return toString.call(value) === "[object String]";
};

utils.isDate = function (value) {
    return toString.call(value) === "[object Date]";
};

utils.isBoolean = function (value) {
    return toString.call(value) === "[object Boolean]";
};

utils.isNumber = function (value) {
    return toString.call(value) === "[object Number]" && /[\d\.]+/.test(String(value));
};

utils.isJSONString = function (value) {
    try {
        JSON.parse(value);
    } catch (e) {
        return false;
    }
    return true;
};

utils.decodeURIComponent = function (value) {
    let result = "";
    try {
        result = decodeURIComponent(value);
    } catch (e) {
        result = value;
    }
    return result;
};

utils.encodeURIComponent = function (value) {
    let result = "";
    try {
        result = encodeURIComponent(value);
    } catch (e) {
        result = value;
    }
    return result;
};

utils.utf8Encode = function (input) {
    let output = "";
    let start = 0;
    let end = 0;
    const str = (input + "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const len = str.length;
    for (let i = 0; i < len; i++) {
        const code = str.charCodeAt(i);
        let encoded = null;
        if (code < 128) {
            end++;
        } else if (code > 127 && code < 2048) {
            encoded = String.fromCharCode((code >> 6) | 192, (code & 63) | 128);
        } else {
            encoded = String.fromCharCode((code >> 12) | 224, ((code >> 6) & 63) | 128, (code & 63) | 128);
        }
        if (encoded !== null) {
            if (start < end) {
                output += str.substring(start, end);
            }
            output += encoded;
            start = end = i + 1;
        }
    }
    if (start < end) {
        output += str.substring(start, str.length);
    }
    return output;
};

utils.base64Encode = function (input) {
    const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    if (!input) {
        return input;
    }
    const str = utils.utf8Encode(input);
    const parts = [];
    let offset = 0;
    let partIndex = 0;
    let output = "";
    while (offset < str.length) {
        const chr1 = str.charCodeAt(offset++);
        const chr2 = str.charCodeAt(offset++);
        const chr3 = str.charCodeAt(offset++);
        const enc1 = chr1 >> 2;
        const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        let enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        let enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = 64;
            enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        parts[partIndex++] = keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    output = parts.join("");
    switch (str.length % 3) {
        case 1:
            output = output.slice(0, -2) + "==";
            break;
        case 2:
            output = output.slice(0, -1) + "=";
            break;
    }
    return output;
};

utils.encodeDates = function (obj) {
    utils.each(obj, (value, key) => {
        if (utils.isDate(value)) {
            obj[key] = utils.formatDate(value);
        } else if (utils.isObject(value)) {
            obj[key] = utils.encodeDates(value);
        } else if (utils.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                if (utils.isDate(value[i])) {
                    obj[key][i] = utils.formatDate(value[i]);
                }
            }
        }
    });
    return obj;
};

utils.formatDate = function (date) {
    function pad(value) {
        return value < 10 ? "0" + value : value;
    }
    const ms = date.getMilliseconds();
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + " " +
        pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds()) + "." +
        (ms < 100 && ms > 9 ? "0" + ms : ms < 10 ? "00" + ms : ms);
};

utils.searchObjDate = function (obj) {
    try {
        if (utils.isObject(obj) || utils.isArray(obj)) {
            utils.each(obj, (value, key) => {
                if (utils.isObject(value) || utils.isArray(value)) {
                    utils.searchObjDate(obj[key]);
                } else if (utils.isDate(value)) {
                    obj[key] = utils.formatDate(value);
                }
            });
        }
    } catch (e) {
        logger.warn(e);
    }
};

utils.UUID = function () {
    const time = new Date().getTime();
    return String(Math.random()).replace(".", "").slice(1, 11) + "-" + time;
};

utils.UUIDv4 = function () {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === "x" ? r : (r & 3) | 8;
        return v.toString(16);
    });
};

utils.setMpPlatform = function (platform) {
    utils.mpPlatform = platform;
};

utils.getMpPlatform = function () {
    return utils.mpPlatform;
};

utils.createExtraHeaders = function () {
    return {
        "GE-Integration-Type": LIB_INFO.LIB_NAME,
        "GE-Integration-Version": LIB_INFO.LIB_VERSION,
        "GE-Integration-Count": "1",
        "GE-Integration-Extra": utils.getMpPlatform()
    };
};

utils.checkAppId = function (appId) {
    if (typeof appId === "number") {
        appId = String(appId);
    } else if (typeof appId !== "string") {
        return "";
    }
    return appId.replace(/\s*/g, "");
};

utils.checkUrl = function (url) {
    return utils.url("basic", url.replace(/\s*/g, ""));
};

utils.url = (function () {
    function tldPattern() {
        return new RegExp(/(.*?)\.?([^.]*?)\.(com|net|org|biz|ws|in|me|co\.uk|co|org\.uk|ltd\.uk|plc\.uk|me\.uk|edu|mil|br\.com|cn\.com|eu\.com|hu\.com|no\.com|qc\.com|sa\.com|se\.com|se\.net|us\.com|uy\.com|ac|co\.ac|gv\.ac|or\.ac|ac\.ac|af|am|as|at|ac\.at|co\.at|gv\.at|or\.at|asn\.au|com\.au|edu\.au|org\.au|net\.au|id\.au|be|ac\.be|adm\.br|adv\.br|am\.br|arq\.br|art\.br|bio\.br|cng\.br|cnt\.br|com\.br|ecn\.br|eng\.br|esp\.br|etc\.br|eti\.br|fm\.br|fot\.br|fst\.br|g12\.br|gov\.br|ind\.br|inf\.br|jor\.br|lel\.br|med\.br|mil\.br|net\.br|nom\.br|ntr\.br|odo\.br|org\.br|ppg\.br|pro\.br|psc\.br|psi\.br|rec\.br|slg\.br|tmp\.br|tur\.br|tv\.br|vet\.br|zlg\.br|br|ab\.ca|bc\.ca|mb\.ca|nb\.ca|nf\.ca|ns\.ca|nt\.ca|on\.ca|pe\.ca|qc\.ca|sk\.ca|yk\.ca|ca|cc|ac\.cn|net\.cn|com\.cn|edu\.cn|gov\.cn|org\.cn|bj\.cn|sh\.cn|tj\.cn|cq\.cn|he\.cn|nm\.cn|ln\.cn|jl\.cn|hl\.cn|js\.cn|zj\.cn|ah\.cn|gd\.cn|gx\.cn|hi\.cn|sc\.cn|gz\.cn|yn\.cn|xz\.cn|sn\.cn|gs\.cn|qh\.cn|nx\.cn|xj\.cn|tw\.cn|hk\.cn|mo\.cn|cn|cx|cz|de|dk|fo|com\.ec|tm\.fr|com\.fr|asso\.fr|presse\.fr|fr|gf|gs|co\.il|net\.il|ac\.il|k12\.il|gov\.il|muni\.il|ac\.in|co\.in|org\.in|ernet\.in|gov\.in|net\.in|res\.in|is|it|ac\.jp|co\.jp|go\.jp|or\.jp|ne\.jp|ac\.kr|co\.kr|go\.kr|ne\.kr|nm\.kr|or\.kr|li|lt|lu|asso\.mc|tm\.mc|com\.mm|org\.mm|net\.mm|edu\.mm|gov\.mm|ms|nl|no|nu|pl|ro|org\.ro|store\.ro|tm\.ro|firm\.ro|www\.ro|arts\.ro|rec\.ro|info\.ro|nom\.ro|nt\.ro|se|si|com\.sg|org\.sg|net\.sg|gov\.sg|sk|st|tf|ac\.th|co\.th|go\.th|mi\.th|net\.th|or\.th|tm|to|com\.tr|edu\.tr|gov\.tr|k12\.tr|net\.tr|org\.tr|com\.tw|org\.tw|net\.tw|ac\.uk|uk\.com|uk\.net|gb\.com|gb\.net|vg|sh|kz|ch|info|ua|gov|name|pro|ie|hk|com\.hk|org\.hk|net\.hk|edu\.hk|us|tk|cd|by|ad|lv|eu\.lv|bz|es|jp|cl|ag|mobi|eu|co\.nz|org\.nz|net\.nz|maori\.nz|iwi\.nz|io|la|md|sc|sg|vc|tw|travel|my|se|tv|pt|com\.pt|edu\.pt|asia|fi|com\.ve|net\.ve|fi|org\.ve|web\.ve|info\.ve|co\.ve|tel|im|gr|ru|net\.ru|org\.ru|hr|com\.hr|ly|xyz)$/);
    }

    function segment(index, value) {
        const first = index.charAt(0);
        const parts = value.split(first);
        if (first === index) {
            return parts;
        }
        const n = parseInt(index.substring(1), 10);
        return parts[n < 0 ? parts.length + n : n - 1];
    }

    function parseQuery(query, source) {
        const first = query.charAt(0);
        const pairs = source.split("&");
        let pair;
        const result = {};
        const rest = {};
        const key = query.substring(1);
        for (let i = 0, len = pairs.length; i < len; i++) {
            pair = pairs[i].match(/(.*?)=(.*)/) || [pairs[i], pairs[i], ""];
            if (pair[1].replace(/\s/g, "") !== "") {
                pair[2] = utils.decodeURIComponent((pair[2] || "").replace(/\+/g, " "));
                if (key === pair[1]) {
                    return pair[2];
                }
                const indexed = pair[1].match(/(.*)\[([0-9]+)\]/);
                if (indexed) {
                    rest[indexed[1]] = rest[indexed[1]] || [];
                    rest[indexed[1]][indexed[2]] = pair[2];
                } else {
                    rest[pair[1]] = pair[2];
                }
            }
        }
        return first === query ? rest : rest[key];
    }

    return function (key, urlStr) {
        const result = {};
        const currentUrl = urlStr || window.location.toString();
        if (key === "tld?") {
            return tldPattern();
        }
        if (!key) {
            return currentUrl;
        }
        let target = currentUrl;
        key = key.toString();
        if (target.match(/^mailto:([^/].+)/)) {
            const match = target.match(/^mailto:([^/].+)/);
            result.protocol = "mailto";
            result.email = match[1];
        } else {
            let match;
            if (target.match(/(.*?)\/#!(.*)/)) {
                match = target.match(/(.*?)\/#!(.*)/);
                target = match[1] + match[2];
            }
            if (target.match(/(.*?)#(.*)/)) {
                match = target.match(/(.*?)#(.*)/);
                result.hash = match[2];
                target = match[1];
            }
            if (result.hash && key.match(/^#/)) {
                return parseQuery(key, result.hash);
            }
            if (target.match(/(.*?)\?(.*)/)) {
                match = target.match(/(.*?)\?(.*)/);
                result.query = match[2];
                target = match[1];
            }
            if (result.query && key.match(/^\?/)) {
                return parseQuery(key, result.query);
            }
            if (target.match(/(.*?):?\/\/(.*)/)) {
                match = target.match(/(.*?):?\/\/(.*)/);
                result.protocol = match[1].toLowerCase();
                target = match[2];
            }
            if (target.match(/(.*?)(\/.*)/)) {
                match = target.match(/(.*?)(\/.*)/);
                result.path = match[2];
                target = match[1];
            }
            result.path = (result.path || "").replace(/^([^/])/, "/$1").replace(/\/$/, "");
            key = key.match(/^[-0-9]+$/) ? key.replace(/^([^/])/, "/$1") : key;
            if (key.match(/^\//)) {
                return segment(key, result.path.substring(1));
            }
            const lastSegment = segment("/-1", result.path.substring(1));
            const fileMatch = lastSegment && lastSegment.match(/(.*?)\.(.*)/);
            if (fileMatch) {
                result.file = fileMatch[0];
                result.filename = fileMatch[1];
                result.fileext = fileMatch[2];
            }
            if (target.match(/(.*):([0-9]+)$/)) {
                match = target.match(/(.*):([0-9]+)$/);
                result.port = match[2];
                target = match[1];
            }
            if (target.match(/(.*?)@(.*)/)) {
                match = target.match(/(.*?)@(.*)/);
                result.auth = match[1];
                target = match[2];
            }
            if (result.auth) {
                const auth = result.auth.match(/(.*):(.*)/);
                result.user = auth ? auth[1] : result.auth;
                result.pass = auth ? auth[2] : undefined;
            }
            result.hostname = target.toLowerCase();
            if (key.charAt(0) === ".") {
                return segment(key, result.hostname);
            }
            if (tldPattern()) {
                const tldMatch = result.hostname.match(tldPattern());
                if (tldMatch) {
                    result.tld = tldMatch[3];
                    result.domain = tldMatch[2] ? tldMatch[2] + "." + tldMatch[3] : undefined;
                    result.sub = tldMatch[1] || undefined;
                }
            }
            const portStr = result.port ? ":" + result.port : "";
            result.protocol = result.protocol || window.location.protocol.replace(":", "");
            result.port = result.port || (result.protocol === "https" ? "443" : "80");
            result.protocol = result.protocol || (result.port === "443" ? "https" : "http");
            result.basic = result.protocol + "://" + result.hostname + portStr;
        }
        return key in result ? result[key] : key === "{}" ? result : "";
    };
})();

utils.createString = function (length) {
    let result = "";
    let random = Math.random().toString(36).substr(2);
    while (random.length < length) {
        random += Math.random().toString(36).substr(2);
    }
    return random.substr(0, length);
};

utils.createAesKey = function () {
    return utils.createString(16);
};

utils.setQuery = function (params) {
    const pairs = [];
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
        }
    }
    return pairs.join("&");
};

utils.generateEncryptyData = function (data, config) {
    if (config !== undefined) {
        const publicKey = config.publicKey;
        const version = config.version;
        if (publicKey !== undefined && version !== undefined && typeof CryptoJS !== "undefined" && typeof JSEncrypt !== "undefined") {
            const aesKey = utils.createAesKey();
            try {
                const key = CryptoJS.enc.Utf8.parse(aesKey);
                const content = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
                const padding = utils.isUndefined(CryptoJS.pad.Pkcs7) ? CryptoJS.pad.PKCS7 : CryptoJS.pad.Pkcs7;
                const encrypted = CryptoJS.AES.encrypt(content, key, {
                    mode: CryptoJS.mode.ECB,
                    padding: padding
                }).toString();
                const encryptor = new JSEncrypt();
                encryptor.setPublicKey(publicKey);
                const encryptedKey = encryptor.encrypt(aesKey);
                if (encryptedKey === false) {
                    logger.warn("私钥加密失败，返回原数据");
                    return data;
                }
                return { pkv: version, ekey: encryptedKey, payload: encrypted };
            } catch (e) {
                logger.warn("数据加密失败，返回原数据: " + e);
            }
        }
    }
    return data;
};

const logger = {};
logger.enabled = false;

logger.info = function () {
    if (typeof console === "object" && console.log && logger.enabled) {
        try {
            return console.log.apply(console, arguments);
        } catch (e) {
            console.log(arguments[0]);
        }
    }
};

logger.warn = function () {
    if (typeof console === "object" && console.log && logger.enabled) {
        try {
            return console.warn.apply(console, arguments);
        } catch (e) {
            console.warn(arguments[0]);
        }
    }
};

class WebPlatform {
    constructor() {
        this.config = {
            persistenceName: "GravityEngine",
            persistenceNameOld: "GravityEngine_mg"
        };
    }

    getConfig() {
        return this.config;
    }

    getStorage(key, isAsync, callback) {
        const value = localStorage.getItem(key);
        if (!isAsync) {
            return utils.isJSONString(value) ? JSON.parse(value) : {};
        }
        if (utils.isJSONString(value)) {
            callback(JSON.parse(value));
        } else {
            callback({});
        }
    }

    setStorage(key, value) {
        localStorage.setItem(key, value);
    }

    _setSystemProxy(callback) {
        this._sysCallback = callback;
    }

    getSystemInfo(options) {
        let info = {
            mp_platform: "web",
            system: this._getOs(),
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            systemLanguage: navigator.language
        };
        if (this._sysCallback) {
            info = utils.extend(info, this._sysCallback(options));
        }
        options.success(info);
        options.complete();
    }

    _getOs() {
        const ua = navigator.userAgent;
        if (/Windows/i.test(ua)) {
            return /Phone/.test(ua) || /WPDesktop/.test(ua) ? "Windows Phone" : "Windows";
        }
        if (/(iPhone|iPad|iPod)/.test(ua)) {
            return "iOS";
        }
        if (/Android/.test(ua)) {
            return "Android";
        }
        if (/(BlackBerry|PlayBook|BB10)/i.test(ua)) {
            return "BlackBerry";
        }
        if (/Mac/i.test(ua)) {
            return "MacOS";
        }
        if (/Linux/.test(ua)) {
            return "Linux";
        }
        if (/CrOS/.test(ua)) {
            return "ChromeOS";
        }
        return "";
    }

    getNetworkType(options) {
        options.complete();
    }

    onNetworkStatusChange() {
    }

    request(options) {
        const result = {};
        const xhr = new XMLHttpRequest();
        xhr.open(options.method, options.url);
        if (options.header) {
            for (const key in options.header) {
                xhr.setRequestHeader(key, options.header[key]);
            }
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                result.statusCode = 200;
                if (utils.isJSONString(xhr.responseText)) {
                    result.data = JSON.parse(xhr.responseText);
                }
                options.success(result);
            } else if (xhr.status !== 200) {
                result.errMsg = "network error";
                options.fail(result);
            }
        };
        xhr.ontimeout = function () {
            result.errMsg = "timeout";
            options.fail(result);
        };
        xhr.send(options.data);
        return xhr;
    }

    initAutoTrackInstance(instance, config) {
        this.instance = instance;
        this.autoTrack = config.autoTrack;
        const self = this;
        if ("onpagehide" in window) {
            window.onpagehide = function () {
                self.onPageHide(true);
            };
        } else {
            window.onbeforeunload = function () {
                self.onPageHide(true);
            };
        }
        self.onPageShow();
        if (self.autoTrack.appHide) {
            self.instance.timeEvent("ta_page_hide");
        }
        if ("onvisibilitychange" in document) {
            document.onvisibilitychange = function () {
                if (document.hidden) {
                    self.onPageHide(false);
                } else {
                    self.onPageShow();
                    if (self.autoTrack.appHide) {
                        self.instance.timeEvent("ta_page_hide");
                    }
                }
            };
        }
    }

    setGlobal(instance, name) {
        window[name] = instance;
    }

    getAppOptions() {
    }

    showToast() {
    }

    onPageShow() {
        if (this.autoTrack.appShow) {
            const properties = {};
            utils.extend(properties, this.autoTrack.properties);
            if (utils.isFunction(this.autoTrack.callback)) {
                utils.extend(properties, this.autoTrack.callback("appShow"));
            }
            this.instance._internalTrack("$WebPageView", properties);
        }
    }

    onPageHide(isUnload) {
        if (this.autoTrack.appHide) {
            const properties = {};
            utils.extend(properties, this.autoTrack.properties);
            if (utils.isFunction(this.autoTrack.callback)) {
                utils.extend(properties, this.autoTrack.callback("appHide"));
            }
            this.instance._internalTrack("$WebPageHide", properties, new Date(), null, isUnload);
        }
    }

    static createInstance() {
        return new WebPlatform();
    }
}

class MiniProgramAutoTrack {
    constructor(taInstance, config) {
        this.taInstance = taInstance;
        this.config = config || {};
        this.referrer = "Directly open";
        if (this.config.isPlugin) {
            taInstance.App = function () {
                App.apply(this, arguments);
            };
            if (typeof inension === "function") {
                inension(taInstance.Page);
            }
        } else {
            const appCtor = App;
            App = this._initAppExtention(appCtor);
            const pageCtor = Page;
            Page = this._initPageExtension(pageCtor);
        }
    }

    _initPageExtension(pageCtor) {
        const self = this;
        return function (options) {
            const onLoad = options.onLoad;
            const onShow = options.onShow;
            const onShareAppMessage = options.onShareAppMessage;
            let query = {};
            options.onLoad = function (opts) {
                query = opts || {};
                if (typeof onLoad === "function") {
                    onLoad.call(this, opts);
                }
            };
            options.onShow = function (opts) {
                self.onPageShow(query);
                if (typeof onShow === "function") {
                    onShow.call(this, opts);
                }
            };
            if (typeof onShareAppMessage === "function") {
                options.onShareAppMessage = function (opts) {
                    const result = onShareAppMessage.call(this, opts);
                    return self.onPageShare(result);
                };
            }
            return pageCtor(options);
        };
    }

    _initAppExtention(appCtor) {
        const self = this;
        return function (options) {
            const onLaunch = options.onLaunch;
            const onShow = options.onShow;
            const onHide = options.onHide;
            options.onLaunch = function (opts) {
                self.onAppLaunch(opts, this);
                if (typeof onLaunch === "function") {
                    onLaunch.call(this, opts);
                }
            };
            options.onShow = function (opts) {
                self.onAppShow(opts);
                if (typeof onShow === "function") {
                    onShow.call(this, opts);
                }
            };
            options.onHide = function () {
                self.onAppHide();
                if (typeof onHide === "function") {
                    onHide.call(this);
                }
            };
            return appCtor(options);
        };
    }

    onAppLaunch(options, appInstance) {
        this._setAutoTrackProperties(options);
        if (!utils.isUndefined(appInstance)) {
            appInstance[this.taInstance.name] = this.taInstance;
        }
        if (this.config.appLaunch) {
            const properties = {};
            if (options && options.path) {
                properties.$url_query = utils.setQuery(options.query);
                properties.$scene = String(options.scene || options.from);
            }
            this.taInstance._internalTrack("$MPLaunch", properties);
        }
    }

    onAppShow(options) {
        if (this.config.appHide) {
            this.taInstance.timeEvent("$MPHide");
        }
        this._setAutoTrackProperties(options);
        if (this.config.appShow) {
            const properties = {};
            if (options && options.path) {
                properties.$url_path = this._getPath(options.path);
                properties.$url_query = utils.setQuery(options.query);
                properties.$scene = String(options.scene || options.from);
            }
            utils.extend(properties, this.config.properties);
            if (utils.isFunction(this.config.callback)) {
                utils.extend(properties, this.config.callback("appShow"));
            }
            this.taInstance._internalTrack("$MPShow", properties);
        }
    }

    onAppHide() {
        if (this.config.appHide) {
            const properties = {};
            utils.extend(properties, this.config.properties);
            if (utils.isFunction(this.config.callback)) {
                utils.extend(properties, this.config.callback("appHide"));
            }
            this.taInstance._internalTrack("$MPHide", properties);
        }
    }

    _getCurrentPath() {
        let path = "Not to get";
        try {
            const pages = getCurrentPages();
            path = pages[pages.length - 1].route;
        } catch (e) {
            logger.info(e);
        }
        return path;
    }

    _setAutoTrackProperties() {
        this.taInstance._setAutoTrackProperties({});
    }

    _getPath(path) {
        return typeof path === "string" ? path.replace(/^\//, "") : "Abnormal values";
    }

    onPageShare(options) {
        if (this.config.pageShare) {
            let depth = 1;
            try {
                depth = getCurrentPages().length;
            } catch (e) {
                depth = 1;
            }
            this.taInstance._internalTrack("$MPShare", {
                $share_method: "转发消息卡片",
                $share_depth: depth,
                $url_path: this._getCurrentPath()
            });
        }
        return utils.isObject(options) ? options : {};
    }

    onPageShow(query) {
        if (this.config.pageShow) {
            const path = this._getCurrentPath();
            const properties = {
                $url_path: path || "The system did not get a value",
                $url_query: utils.setQuery(query)
            };
            this.referrer = path;
            this.taInstance._internalTrack("$MPViewScreen", properties);
        }
    }
}

class QuickGameAutoTrack {
    constructor(taInstance, config, api) {
        this.taInstance = taInstance;
        this.config = config || {};
        const launchOptions = api.getLaunchOptionsSync();
        this._onShow(launchOptions);
        this.startTracked = true;
        api.onShow((options) => {
            this._onShow(options);
        });
        api.onHide(() => {
            this.startTracked = false;
            if (this.config.appHide) {
                const properties = {};
                utils.extend(properties, this.config.properties);
                if (utils.isFunction(this.config.callback)) {
                    utils.extend(properties, this.config.callback("appHide"));
                }
                this.taInstance._internalTrack("$MPHide", properties);
            }
        });
    }

    _onShow(options) {
        if (!this.startTracked) {
            if (this.config.appHide) {
                this.taInstance.timeEvent("$MPHide");
            }
            if (this.config.appShow) {
                const properties = {};
                utils.extend(properties, this.config.properties);
                if (utils.isFunction(this.config.callback)) {
                    utils.extend(properties, this.config.callback("appShow"));
                }
                this.taInstance._internalTrack("$MPShow", objectSpread(objectSpread({}, properties), {}, {
                    $scene: String(options.scene || options.from),
                    $url_query: utils.setQuery(PlatformProxy.getAppOptions().query)
                }));
            }
        }
    }
}

class MiniProgramPlatform {
    constructor(api, config, innerConfig) {
        this.api = api;
        this.config = config;
        this._config = innerConfig;
    }

    getConfig() {
        return this.config;
    }

    getStorage(key, isAsync, callback) {
        if (!isAsync) {
            if (this._config.platform === "dd_mp") {
                const result = this.api.getStorageSync({ key: key });
                return utils.isJSONString(result.data) ? JSON.parse(result.data) : {};
            }
            const value = this.api.getStorageSync(key);
            return utils.isJSONString(value) ? JSON.parse(value) : {};
        }
        this.api.getStorage({
            key: key,
            success: (res) => {
                const data = utils.isJSONString(res.data) ? JSON.parse(res.data) : {};
                callback(data);
            },
            fail: () => {
                logger.warn("getStorage faild");
                callback({});
            }
        });
    }

    setStorage(key, value) {
        this.api.setStorage({
            key: key,
            data: value
        });
    }

    _getPlatform() {
        return "";
    }

    getSystemInfo(options) {
        const mpPlatform = this._config.mpPlatform;
        this.api.getSystemInfo({
            success: (res) => {
                res.mp_platform = utils.isFunction(mpPlatform) ? mpPlatform(res) : mpPlatform;
                options.success(res);
                if (mpPlatform === "wechat") {
                    options.complete();
                }
            },
            complete: () => {
                options.complete();
            }
        });
    }

    getNetworkType(options) {
        if (utils.isFunction(this.api.getNetworkType)) {
            this.api.getNetworkType({
                success: (res) => {
                    options.success(res);
                },
                complete: () => {
                    options.complete();
                }
            });
        } else {
            options.success({});
            options.complete();
        }
    }

    onNetworkStatusChange(callback) {
        if (utils.isFunction(this.api.onNetworkStatusChange)) {
            this.api.onNetworkStatusChange(callback);
        } else {
            callback({});
        }
    }

    request(options) {
        if (this._config.platform === "ali_mp" || this._config.platform === "dd_mp") {
            const requestOptions = utils.extend({}, options);
            requestOptions.headers = options.header;
            requestOptions.success = (res) => {
                res.statusCode = res.status;
                options.success(res);
            };
            requestOptions.fail = (res) => {
                res.errMsg = res.errorMessage;
                options.fail(res);
            };
            return this._config.platform === "dd_mp"
                ? this.api.httpRequest(requestOptions)
                : this.api.request(requestOptions);
        }
        return this.api.request(options);
    }

    initAutoTrackInstance(instance, config) {
        if (utils.isObject(config.autoTrack)) {
            config.autoTrack.isPlugin = config.is_plugin;
        }
        return new (this._config.mp ? MiniProgramAutoTrack : QuickGameAutoTrack)(instance, config.autoTrack, this.api);
    }

    setGlobal(instance, name) {
        if (this._config.mp) {
            logger.warn("GravityAnalytics: we do not set global name for GE instance when you do not enable auto track.");
        } else {
            GameGlobal[name] = instance;
        }
    }

    getAppOptions(callback) {
        let options = {};
        try {
            options = this.api.getLaunchOptionsSync();
        } catch (e) {
            logger.warn("Cannot get launch options.");
        }
        if (utils.isFunction(callback)) {
            try {
                if (this._config.mp) {
                    this.api.onAppShow(callback);
                } else {
                    this.api.onShow(callback);
                }
            } catch (e) {
                logger.warn("Cannot register onShow callback.");
            }
        }
        return options;
    }

    showToast(message) {
        if (utils.isFunction(this.api.showToast)) {
            const options = { title: message };
            if (this._config.platform === "dd_mp" || this._config.platform === "ali_mp") {
                options.content = message;
            }
            this.api.showToast(options);
        }
    }

    static createInstance() {
        return MiniProgramPlatform._createInstance("R_CURRENT_PLATFORM");
    }

    static _createInstance(platform) {
        switch (platform) {
            case "wechat_mp":
                return new MiniProgramPlatform(wx, {
                    persistenceName: "GravityEngine",
                    persistenceNameOld: "GravityEngine_wechat"
                }, { mpPlatform: "wechat", mp: true, platform: platform });
            case "wechat_mg":
                return new MiniProgramPlatform(wx, {
                    persistenceName: "GravityEngine",
                    persistenceNameOld: "GravityEngine_wechat_game"
                }, { mpPlatform: "wechat", platform: platform });
            case "qq_mp":
                return new MiniProgramPlatform(qq, {
                    persistenceName: "GravityEngine",
                    persistenceNameOld: "GravityEngine_qq"
                }, { mpPlatform: "qq", mp: true, platform: platform });
            case "qq_mg":
                return new MiniProgramPlatform(qq, {
                    persistenceName: "GravityEngine",
                    persistenceNameOld: "GravityEngine_qq_game"
                }, { mpPlatform: "qq", platform: platform });
            case "baidu_mp":
                return new MiniProgramPlatform(swan, {
                    persistenceName: "GravityEngine",
                    persistenceNameOld: "GravityEngine_swan"
                }, {
                    mpPlatform: (info) => info.host,
                    mp: true,
                    platform: platform
                });
            case "baidu_mg":
                return new MiniProgramPlatform(swan, {
                    persistenceName: "GravityEngine",
                    persistenceNameOld: "GravityEngine_swan_game"
                }, {
                    mpPlatform: (info) => info.host,
                    platform: platform
                });
            case "tt_mg":
                return new MiniProgramPlatform(tt, {
                    persistenceName: "GravityEngine",
                    persistenceNameOld: "GravityEngine_tt_game"
                }, {
                    mpPlatform: (info) => info.appName,
                    platform: platform
                });
            case "tt_mp":
                return new MiniProgramPlatform(tt, {
                    persistenceName: "GravityEngine",
                    persistenceNameOld: "GravityEngine_tt"
                }, {
                    mpPlatform: (info) => info.appName,
                    mp: true,
                    platform: platform
                });
            case "ali_mp":
                return new MiniProgramPlatform(my, {
                    persistenceName: "GravityEngine",
                    persistenceNameOld: "GravityEngine_ali"
                }, {
                    mpPlatform: (info) => info.app,
                    mp: true,
                    platform: platform
                });
            case "dd_mp":
                return new MiniProgramPlatform(dd, {
                    persistenceName: "GravityEngine",
                    persistenceNameOld: "GravityEngine_dd"
                }, { mpPlatform: "dingding", mp: true, platform: platform });
            case "bl_mg":
                return new MiniProgramPlatform(bl, {
                    persistenceName: "GravityEngine",
                    persistenceNameOld: "GravityEngine_mg"
                }, { mpPlatform: "bilibili", platform: platform });
            case "kuaishou_mp":
                return new MiniProgramPlatform(ks, {
                    persistenceName: "GravityEngine",
                    persistenceNameOld: "GravityEngine_kuaishou_program"
                }, { mpPlatform: "kuaishou", mp: true, platform: platform });
            case "kuaishou_mg":
                return new MiniProgramPlatform(ks, {
                    persistenceName: "GravityEngine",
                    persistenceNameOld: "GravityEngine_kuaishou_game"
                }, { mpPlatform: "kuaishou_game", platform: platform });
            case "qh360_mg":
                return new MiniProgramPlatform(qh, {
                    persistenceName: "GravityEngine",
                    persistenceNameOld: "GravityEngine_qh360"
                }, { mpPlatform: "qh360", platform: platform });
            case "tb_mp":
                return new MiniProgramPlatform(my, {
                    persistenceName: "GravityEngine",
                    persistenceNameOld: "GravityEngine_tb"
                }, { mpPlatform: "tb", mp: true, platform: platform });
            case "jd_mp":
                return new MiniProgramPlatform(jd, {
                    persistenceName: "GravityEngine",
                    persistenceNameOld: "GravityEngine_jd"
                }, { mpPlatform: "jd", mp: true, platform: platform });
            case "qh360_mp":
                return new MiniProgramPlatform(qh, {
                    persistenceName: "GravityEngine",
                    persistenceNameOld: "GravityEngine_qh360"
                }, { mpPlatform: "qh360", mp: true, platform: platform });
            case "WEB":
                return WebPlatform.createInstance();
            default:
                return undefined;
        }
    }
}

class VivoQuickGameAutoTrack {
    constructor(taInstance, config) {
        this.taInstance = taInstance;
        this.config = config || {};
        if (this.config.appShow) {
            this.taInstance._internalTrack("$MPShow");
        }
        if (this.config.appHide) {
            this.taInstance.timeEvent("$MPHide");
        }
        qg.onShow(() => {
            if (this.config.appHide) {
                this.taInstance.timeEvent("$MPHide");
            }
            if (this.config.appShow) {
                const properties = {};
                utils.extend(properties, this.config.properties);
                if (utils.isFunction(this.config.callback)) {
                    utils.extend(properties, this.config.callback("appShow"));
                }
                this.taInstance._internalTrack("$MPShow");
            }
        });
        qg.onHide(() => {
            if (this.config.appHide) {
                const properties = {};
                utils.extend(properties, this.config.properties);
                if (utils.isFunction(this.config.callback)) {
                    utils.extend(properties, this.config.callback("appHide"));
                }
                this.taInstance._internalTrack("$MPHide");
            }
        });
    }
}

class VivoQuickGamePlatform {
    constructor() {
        this.config = {
            persistenceName: "gravityengine",
            persistenceNameOld: "gravityengine_qg_vivo_game",
            asyncPersistence: true
        };
    }

    getConfig() {
        return this.config || {};
    }

    getStorage(key, isAsync, callback) {
        if (!isAsync) {
            const value = qg.getStorageSync({ key: key });
            return utils.isJSONString(value) ? JSON.parse(value) : {};
        }
        qg.getStorage({
            key: key,
            success: (res) => {
                const data = utils.isJSONString(res) ? JSON.parse(res) : {};
                callback(data);
            },
            fail: () => {
                callback({});
            }
        });
    }

    setStorage(key, value) {
        qg.setStorage({
            key: key,
            value: value
        });
    }

    getSystemInfo(options) {
        qg.getSystemInfo({
            success: (res) => {
                const info = res;
                info.brand = res.manufacturer;
                info.system = [res.osType, res.osVersionName].join(" ");
                info.mp_platform = "vivo_qg";
                options.success(info);
            },
            complete: () => {
                options.complete();
            }
        });
    }

    getQuickDevice(options) {
        const device = {
            os_name: "android",
            android_id: "",
            imei: "",
            oaid: "",
            mac: "",
            android_version: "",
            api_version: 0,
            rom: {
                gravityengine_qg_huawei_game: "EMUI",
                gravityengine_qg: "MIUI",
                gravityengine_qg_oppo_game: "ColorOS",
                gravityengine_qg_vivo_game: "FuntouchOS",
                gravityengine_qg_mz_game: "Flyme"
            }[options.platform],
            rom_version: "",
            phone_brand: "",
            phone_model: ""
        };
        qg.getSystemInfo({
            success: (info) => {
                device.android_version = info.system;
                device.api_version = info.platformVersionCode;
                device.rom_version = info.COREVersion;
                device.phone_brand = info.brand;
                device.phone_model = info.model;
                if (qg.getOAID) {
                    const oaid = qg.getOAID?.().oaid ?? "";
                    device.android_id = oaid;
                    device.imei = oaid;
                    device.oaid = oaid;
                }
                options.success(device);
            }
        });
    }

    getNetworkType(options) {
        qg.getNetworkType({
            success: (res) => {
                const result = res;
                result.networkType = res.type;
                options.success(result);
            },
            complete: () => {
                options.complete();
            }
        });
    }

    onNetworkStatusChange(callback) {
        qg.subscribeNetworkStatus({
            callback: (res) => {
                const result = res;
                result.networkType = res.type;
                callback(result);
            }
        });
    }

    request(options) {
        return qg.request({
            url: options.url,
            data: options.data,
            method: options.method,
            header: options.header,
            success: (res) => {
                options.success(res);
            },
            fail: (res) => {
                options.fail(res);
            }
        });
    }

    initAutoTrackInstance(instance, config) {
        return new VivoQuickGameAutoTrack(instance, config.autoTrack);
    }

    setGlobal(instance, name) {
        globalThis[name] = instance;
    }

    getAppOptions() {
        return {};
    }

    showToast(message) {
        qg.showToast({
            message: message,
            duration: 0
        });
    }

    static createInstance() {
        return new VivoQuickGamePlatform();
    }
}

class QuickGamePlatformAutoTrack {
    constructor(taInstance, config, api) {
        this.taInstance = taInstance;
        this.config = config || {};
        if (this.config.appShow) {
            const properties = {};
            utils.extend(properties, this.config.properties);
            if (utils.isFunction(this.config.callback)) {
                utils.extend(properties, this.config.callback("appShow"));
            }
            this.taInstance._internalTrack("$MPShow", properties);
        }
        if (this.config.appHide) {
            this.taInstance.timeEvent("$MPHide");
        }
        api.onShow(() => {
            if (this.config.appHide) {
                this.taInstance.timeEvent("$MPHide");
            }
            if (this.config.appShow) {
                const properties = {};
                utils.extend(properties, this.config.properties);
                if (utils.isFunction(this.config.callback)) {
                    utils.extend(properties, this.config.callback("appShow"));
                }
                this.taInstance._internalTrack("$MPShow", properties);
            }
        });
        api.onHide(() => {
            if (this.config.appHide) {
                const properties = {};
                utils.extend(properties, this.config.properties);
                if (utils.isFunction(this.config.callback)) {
                    utils.extend(properties, this.config.callback("appHide"));
                }
                this.taInstance._internalTrack("$MPHide", properties);
            }
        });
    }
}

class QuickGamePlatform {
    constructor(api, config, innerConfig) {
        this.api = api;
        this.config = config;
        this._config = innerConfig;
    }

    getConfig() {
        return this.config || {};
    }

    getStorage(key, isAsync, callback) {
        const value = localStorage.getItem(key);
        if (!isAsync) {
            return utils.isJSONString(value) ? JSON.parse(value) : {};
        }
        if (utils.isJSONString(value)) {
            callback(JSON.parse(value));
        } else {
            callback({});
        }
    }

    setStorage(key, value) {
        localStorage.setItem(key, value);
    }

    getSystemInfo(options) {
        const mpPlatform = this._config.mpPlatform;
        this.api.getSystemInfo({
            success: (res) => {
                res.mp_platform = mpPlatform;
                options.success(res);
            },
            complete: () => {
                options.complete();
            }
        });
    }

    getQuickDevice(options) {
        const device = {
            os_name: "android",
            android_id: "",
            imei: "",
            oaid: "",
            mac: "",
            android_version: "",
            api_version: 0,
            rom: {
                gravityengine_qg_huawei_game: "EMUI",
                gravityengine_qg: "MIUI",
                gravityengine_qg_oppo_game: "ColorOS",
                gravityengine_qg_vivo_game: "FuntouchOS",
                gravityengine_qg_mz_game: "Flyme"
            }[options.platform],
            rom_version: "",
            phone_brand: "",
            phone_model: ""
        };
        const self = this;
        this.api.getSystemInfo({
            success: (info) => {
                const done = () => {
                    options.success(device);
                };
                device.android_version = info.system;
                device.api_version = info.platformVersionCode;
                device.rom_version = info.COREVersion;
                device.phone_brand = info.brand;
                device.phone_model = info.model;
                if (self.api.getDeviceId) {
                    self.api.getDeviceId({
                        success: (res) => {
                            device.android_id = res.deviceId;
                            device.imei = res.deviceId;
                            device.oaid = res.deviceId;
                            done();
                        }
                    });
                } else if (self.api.getOAID) {
                    self.api.getOAID({
                        success: (res) => {
                            device.android_id = res.oaid;
                            device.imei = res.oaid;
                            device.oaid = res.oaid;
                            done();
                        }
                    });
                } else {
                    done();
                }
            }
        });
    }

    getNetworkType(options) {
        this.api.getNetworkType({
            success: (res) => {
                options.success(res);
            },
            complete: () => {
                options.complete();
            }
        });
    }

    onNetworkStatusChange(callback) {
        this.api.onNetworkStatusChange({
            callback: (res) => {
                callback(res);
            }
        });
    }

    request(options) {
        const result = {};
        const xhr = new XMLHttpRequest();
        xhr.open(options.method, options.url);
        if (options.header) {
            for (const key in options.header) {
                xhr.setRequestHeader(key, options.header[key]);
            }
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                result.statusCode = 200;
                if (utils.isJSONString(xhr.responseText)) {
                    result.data = JSON.parse(xhr.responseText);
                }
                options.success(result);
            } else if (xhr.status !== 200) {
                result.errMsg = "network error";
                options.fail(result);
            }
        };
        xhr.ontimeout = function () {
            result.errMsg = "timeout";
            options.fail(result);
        };
        xhr.send(options.data);
        return xhr;
    }

    initAutoTrackInstance(instance, config) {
        return new QuickGamePlatformAutoTrack(instance, config.autoTrack, this.api);
    }

    setGlobal(instance, name) {
        globalThis[name] = instance;
    }

    getAppOptions() {
        return this.api.getLaunchOptionsSync();
    }

    showToast(message) {
        this.api.showToast({
            title: message,
            icon: "none",
            duration: 2000
        });
    }

    static createInstance() {
        return QuickGamePlatform._createInstance("R_CURRENT_PLATFORM");
    }

    static _createInstance(platform) {
        switch (platform) {
            case "oppo":
                return new QuickGamePlatform(qg, {
                    persistenceName: "gravityengine",
                    persistenceNameOld: "gravityengine_qg_oppo_game"
                }, { mpPlatform: "oppo_qg" });
            case "huawei":
                return new QuickGamePlatform(hbs, {
                    persistenceName: "gravityengine",
                    persistenceNameOld: "gravityengine_qg_huawei_game"
                }, { mpPlatform: "huawei_qg" });
            case "mz":
                return new QuickGamePlatform(qg, {
                    persistenceName: "gravityengine",
                    persistenceNameOld: "gravityengine_qg_mz_game"
                }, { mpPlatform: "mz" });
            case "xiaomi":
                return new QuickGamePlatform(qg, {
                    persistenceName: "gravityengine",
                    persistenceNameOld: "gravityengine_qg"
                }, { mpPlatform: "xiaomi" });
            default:
                return undefined;
        }
    }
}

class PlatformFactory {
    static createInstance() {
        const PlatformType = Object.freeze({
            WECHAT_GAME: 104,
            QQ_PLAY: 105,
            BAIDU_GAME: 107,
            VIVO_GAME: 108,
            OPPO_GAME: 109,
            HUAWEI_GAME: 110,
            XIAOMI_GAME: 111,
            BYTEDANCE_GAME: 117,
            QTT_GAME: 116,
            LINKSURE: 119,
            WECHAT_MINI_GAME: "WECHAT_GAME",
            BAIDU_MINI_GAME: "BAIDU_MINI_GAME",
            XIAOMI_QUICK_GAME: "XIAOMI_QUICK_GAME",
            OPPO_MINI_GAME: "OPPO_MINI_GAME",
            VIVO_MINI_GAME: "VIVO_MINI_GAME",
            HUAWEI_QUICK_GAME: "HUAWEI_QUICK_GAME",
            BYTEDANCE_MINI_GAME: "BYTEDANCE_MINI_GAME",
            QTT_MINI_GAME: "QTT_MINI_GAME",
            LINKSURE_MINI_GAME: "LINKSURE_MINI_GAME"
        });
        const platform = cc.sys.platform;
        if (platform === PlatformType.WECHAT_GAME || platform === PlatformType.WECHAT_MINI_GAME) {
            return MiniProgramPlatform._createInstance("wechat_mg");
        }
        if (platform === PlatformType.BAIDU_GAME || platform === PlatformType.BAIDU_MIN_GAME) {
            return MiniProgramPlatform._createInstance("baidu_mg");
        }
        if (platform === PlatformType.VIVO_GAME || platform === PlatformType.VIVO_MINI_GAME) {
            return VivoQuickGamePlatform.createInstance();
        }
        if (platform === PlatformType.QQ_PLAY) {
            return MiniProgramPlatform._createInstance("qq_mg");
        }
        if (platform === PlatformType.OPPO_GAME || platform === PlatformType.OPPO_MINI_GAME) {
            return QuickGamePlatform._createInstance("oppo");
        }
        if (platform === PlatformType.HUAWEI_GAME || platform === PlatformType.HUAWEI_QUICK_GAME) {
            return QuickGamePlatform._createInstance("huawei");
        }
        if (platform === PlatformType.XIAOMI_GAME || platform === PlatformType.XIAOMI_QUICK_GAME) {
            return QuickGamePlatform._createInstance("xiaomi");
        }
        if (platform === PlatformType.BYTEDANCE_GAME || platform === PlatformType.BYTEDANCE_MINI_GAME) {
            return MiniProgramPlatform._createInstance("tt_mg");
        }
        const instance = WebPlatform.createInstance();
        instance._sysCallback = function () {
            return {
                system: cc.sys.os.replace(" ", "") + " " + cc.sys.osVersion
            };
        };
        instance.getNetworkType = function (options) {
            const result = {};
            switch (cc.sys.getNetworkType()) {
                case cc.sys.NetworkType.LAN:
                    result.networkType = "WIFI";
                    break;
                case cc.sys.NetworkType.WWAN:
                    result.networkType = "WWAN";
                    break;
                default:
                    result.networkType = "NONE";
            }
            options.success(result);
            options.complete();
        };
        instance.getSystemInfo = function (options) {
            let info = {
                mp_platform: cc.sys.platform.toString(),
                system: instance._getOs(),
                screenWidth: window.screen.width,
                screenHeight: window.screen.height
            };
            if (instance._sysCallback) {
                info = utils.extend(info, instance._sysCallback(options));
            }
            options.success(info);
            options.complete();
        };
        return instance;
    }
}

class PlatformProxy {
    static _getCurrentPlatform() {
        if (!this.currentPlatform) {
            this.currentPlatform = PlatformFactory.createInstance();
        }
        return this.currentPlatform;
    }

    static getConfig() {
        return this._getCurrentPlatform().getConfig();
    }

    static getStorage(key, isAsync, callback) {
        return this._getCurrentPlatform().getStorage(key, isAsync, callback);
    }

    static setStorage(key, value) {
        return this._getCurrentPlatform().setStorage(key, value);
    }

    static getSystemInfo(options) {
        return this._getCurrentPlatform().getSystemInfo(options);
    }

    static getNetworkType(options) {
        return this._getCurrentPlatform().getNetworkType(options);
    }

    static getQuickDevice(options) {
        return this._getCurrentPlatform().getQuickDevice(options);
    }

    static onNetworkStatusChange(callback) {
        this._getCurrentPlatform().onNetworkStatusChange(callback);
    }

    static request(options) {
        return this._getCurrentPlatform().request(options);
    }

    static initAutoTrackInstance(instance, config) {
        return this._getCurrentPlatform().initAutoTrackInstance(instance, config);
    }

    static setGlobal(instance, name) {
        if (instance && name) {
            this._getCurrentPlatform().setGlobal(instance, name);
        }
    }

    static getAppOptions(callback) {
        return this._getCurrentPlatform().getAppOptions(callback);
    }

    static showDebugToast(message) {
        this._getCurrentPlatform().showToast(message);
    }
}

const PROPERTY_KEY_PATTERN = /^\$?[a-zA-Z][a-zA-Z0-9_]{0,49}$/;

class Validator {
    static stripProperties(properties) {
        if (utils.isObject(properties)) {
            utils.each(properties, (value, key) => {
                if (!(utils.isString(value) || utils.isNumber(value) || utils.isDate(value) || utils.isBoolean(value) ||
                    utils.isArray(value) || utils.isObject(value))) {
                    logger.warn("Your data -", key, value, "- format does not meet requirements and may not be stored correctly. Attribute values only support String, Number, Date, Boolean, Array, Object");
                }
            });
        }
        return properties;
    }

    static _checkPropertiesKey(properties) {
        let valid = true;
        utils.each(properties, (value, key) => {
            if (!PROPERTY_KEY_PATTERN.test(key)) {
                logger.warn("Invalid KEY: " + key);
                valid = false;
            }
        });
        return valid;
    }

    static event(eventName) {
        if (utils.isString(eventName) && PROPERTY_KEY_PATTERN.test(eventName)) {
            return true;
        }
        logger.warn("Check the parameter format. The eventName must start with an English letter and contain no more than 50 characters including letters, digits, and underscores: " + eventName);
        return false;
    }

    static propertyName(name) {
        if (utils.isString(name) && PROPERTY_KEY_PATTERN.test(name)) {
            return true;
        }
        logger.warn("Check the parameter format. PropertyName must start with a letter and contain letters, digits, and underscores (_). The value is a string of no more than 50 characters: " + name);
        return false;
    }

    static properties(properties) {
        this.stripProperties(properties);
        if (!properties) {
            return true;
        }
        if (utils.isObject(properties)) {
            if (!this._checkPropertiesKey(properties)) {
                logger.warn("Check the parameter format. The properties key must start with a letter, contain digits, letters, and underscores (_), and contain a maximum of 50 characters");
                return false;
            }
            return true;
        }
        logger.warn("properties can be none, but it must be an object");
        return false;
    }

    static propertiesMust(properties) {
        this.stripProperties(properties);
        if (properties === undefined || !utils.isObject(properties) || utils.isEmptyObject(properties)) {
            logger.warn("properties must be an object with a value");
            return false;
        }
        if (!this._checkPropertiesKey(properties)) {
            logger.warn("Check the parameter format. The properties key must start with a letter, contain digits, letters, and underscores (_), and contain a maximum of 50 characters");
            return false;
        }
        return true;
    }

    static userId(userId) {
        if (utils.isString(userId) && /^.{1,64}$/.test(userId)) {
            return true;
        }
        logger.warn("The user ID must be a string of less than 64 characters and cannot be null");
        return false;
    }

    static userAddProperties(properties) {
        if (!this.propertiesMust(properties)) {
            return false;
        }
        for (const key in properties) {
            if (!utils.isNumber(properties[key])) {
                logger.warn("The attributes of userAdd need to be Number");
                return false;
            }
        }
        return true;
    }

    static userAppendProperties(properties) {
        if (!this.propertiesMust(properties)) {
            return false;
        }
        for (const key in properties) {
            if (!utils.isArray(properties[key])) {
                logger.warn("The attribute of userAppend must be Array");
                return false;
            }
        }
        return true;
    }
}

class HttpTask {
    constructor(data, serverUrl, tryCount, timeout, debugMode, callback) {
        this.data = data;
        this.serverUrl = serverUrl;
        this.callback = callback;
        this.debugMode = debugMode;
        this.tryCount = utils.isNumber(tryCount) ? tryCount : 1;
        this.permissionTryCount = 6;
        this.timeout = utils.isNumber(timeout) ? timeout : 3000;
        this.taClassName = "HttpTask";
    }

    run() {
        const headers = utils.createExtraHeaders();
        headers["content-type"] = "application/json";
        if (this.debugMode === "debug") {
            headers["Turbo-Debug-Mode"] = 1;
        }
        const task = PlatformProxy.request({
            url: this.serverUrl,
            method: "POST",
            data: this.data,
            header: headers,
            success: (res) => {
                if (res?.data?.code === 0) {
                    this.onSuccess(res);
                } else {
                    this.onFailed(res);
                }
            },
            fail: (res) => {
                this.onFailed(res);
            }
        });
        setTimeout(() => {
            if ((utils.isObject(task) || utils.isPromise(task)) && utils.isFunction(task.abort)) {
                task.abort();
            }
        }, this.timeout);
    }

    onSuccess(res) {
        if (res.statusCode === 200) {
            let msg = "Data Verified";
            if (res?.data?.extra?.errors?.length) {
                msg = res.data.extra.errors;
            }
            this.callback({
                code: res?.data?.code,
                msg: msg
            });
        } else {
            this.callback({
                code: -3,
                msg: res.statusCode
            });
        }
    }

    onFailed(res) {
        if (--this.tryCount > 0) {
            setTimeout(() => {
                this.run();
            }, 1000);
        } else {
            this.callback({
                code: -3,
                msg: `${res?.data?.msg}：${res?.data?.extra?.error}`
            });
        }
    }
}

class HttpTaskQueue {
    constructor() {
        this.items = [];
        this.isRunning = false;
        this.showDebug = false;
    }

    enqueue(data, serverUrl, config, useQueue = true) {
        const isDebug = config.debugMode === "debug";
        const task = new HttpTask(JSON.stringify(data), serverUrl, config.maxRetries, config.sendTimeout, config.debugMode, (res) => {
            this.isRunning = false;
            if (utils.isFunction(config.callback)) {
                config.callback(res);
            }
            this._runNext(isDebug);
            if (isDebug) {
                logger.info(`code ${res.code} and msg is ${res.msg}`);
            }
        });
        if (useQueue === true) {
            this.items.push(task);
            this._runNext(isDebug);
        } else {
            task.run();
        }
    }

    _dequeue() {
        return this.items.shift();
    }

    _runNext(isDebug) {
        if (this.items.length > 0 && !this.isRunning) {
            this.isRunning = true;
            if (isDebug) {
                this._dequeue().run();
            } else {
                const tasks = this.items.splice(0, this.items.length);
                const first = tasks[0];
                const payload = JSON.parse(first.data);
                for (let i = 1; i < tasks.length; i++) {
                    const other = JSON.parse(tasks[i].data);
                    payload.event_list = payload.event_list.concat(other.event_list);
                }
                payload.$flush_time = new Date().getTime();
                new HttpTask(JSON.stringify(payload), first.serverUrl, first.tryCount, first.timeout, first?.debugMode, first.callback).run();
            }
        }
    }
}

const httpQueue = new HttpTaskQueue();

const DEFAULT_CONFIG = {
    name: "GravityEngine",
    is_plugin: false,
    maxRetries: 3,
    sendTimeout: 5000,
    enablePersistence: true,
    asyncPersistence: false,
    strict: false,
    debugMode: "none"
};

const PRESET = {
    properties: {
        $lib_version: LIB_INFO.LIB_VERSION,
        $lib: LIB_INFO.LIB_STACK,
        $scene: "",
        $today_first_scene: ""
    },
    getSystemInfo: function (callback) {
        PlatformProxy.onNetworkStatusChange((res) => {
            this.properties.$network_type = res.networkType;
        });
        PlatformProxy.getNetworkType({
            success: (res) => {
                this.properties.$network_type = res.networkType;
            },
            complete: () => {
                PlatformProxy.getSystemInfo({
                    success: (info) => {
                        logger.info(JSON.stringify(info, null, 4));
                        const properties = {
                            $manufacturer: info.brand,
                            $brand: info.brand,
                            $model: info.model,
                            $screen_width: Number(info.screenWidth),
                            $screen_height: Number(info.screenHeight),
                            $system_language: info.language,
                            $os: info.platform,
                            $os_version: info.system
                        };
                        utils.extend(this.properties, properties);
                        utils.setMpPlatform(info.mp_platform);
                    },
                    complete: () => {
                        callback();
                    }
                });
            }
        });
    }
};

class Store {
    constructor(config, onReady) {
        this.enabled = config.enablePersistence;
        if (this.enabled) {
            if (config.isChildInstance) {
                this.name = config.persistenceName + "_" + config.name;
                this.nameOld = config.persistenceNameOld + "_" + config.name;
            } else {
                this.name = config.persistenceName;
                this.nameOld = config.persistenceNameOld;
            }
            if (config.asyncPersistence) {
                this._state = {};
                PlatformProxy.getStorage(this.name, true, (data) => {
                    if (utils.isEmptyObject(data)) {
                        PlatformProxy.getStorage(this.nameOld, true, (oldData) => {
                            this._state = utils.extend2Layers({}, oldData, this._state);
                            this._init(config, onReady);
                            this._save();
                        });
                    } else {
                        this._state = utils.extend2Layers({}, data, this._state);
                        this._init(config, onReady);
                        this._save();
                    }
                });
            } else {
                this._state = PlatformProxy.getStorage(this.name) || {};
                if (utils.isEmptyObject(this._state)) {
                    this._state = PlatformProxy.getStorage(this.nameOld) || {};
                }
                this._init(config, onReady);
            }
        } else {
            this._state = {};
            this._init(config, onReady);
        }
    }

    _init(config, onReady) {
        if (!this.getDistinctId()) {
            this.setDistinctId(utils.UUID());
        }
        if (!config.isChildInstance && !this.getDeviceId()) {
            this._setDeviceId(utils.UUID());
        }
        this.initComplete = true;
        if (typeof onReady === "function") {
            onReady();
        }
        const stored = PlatformProxy.getStorage(this.name);
        const firstSceneDate = stored?.current_first_scene_date;
        const firstScene = stored?.current_first_scene;
        const today = new Date().toLocaleDateString();
        if (firstScene && firstSceneDate && firstSceneDate === today) {
            PRESET.properties.$today_first_scene = String(stored?.current_first_scene);
        } else {
            const appOptions = PlatformProxy.getAppOptions();
            const scene = String(appOptions?.scene || appOptions?.from);
            PRESET.properties.$today_first_scene = scene;
            this._state.current_first_scene = scene;
            this._state.current_first_scene_date = today;
        }
        this._save();
    }

    _save() {
        if (this.enabled && this.initComplete) {
            PlatformProxy.setStorage(this.name, JSON.stringify(this._state));
        }
    }

    _set(key, value) {
        let data;
        if (typeof key === "string") {
            data = {};
            data[key] = value;
        } else if (typeof key === "object") {
            data = key;
        }
        utils.each(data, (value, k) => {
            this._state[k] = value;
        });
        this._save();
    }

    _get(key) {
        return this._state[key];
    }

    setEventTimer(name, time) {
        const timers = this._state.event_timers || {};
        timers[name] = time;
        this._set("event_timers", timers);
    }

    removeEventTimer(name) {
        const timer = (this._state.event_timers || {})[name];
        if (!utils.isUndefined(timer)) {
            delete this._state.event_timers[name];
            this._save();
        }
        return timer;
    }

    getDeviceId() {
        return this._state.device_id;
    }

    _setDeviceId(deviceId) {
        if (this.getDeviceId()) {
            logger.warn("cannot modify the device id.");
        } else {
            this._set("device_id", deviceId);
        }
    }

    getDistinctId() {
        return this._state.distinct_id;
    }

    setDistinctId(distinctId) {
        this._set("distinct_id", distinctId);
    }

    getAccountId() {
        return this._state.account_id;
    }

    setAccountId(accountId) {
        this._set("account_id", accountId);
    }

    getSuperProperties() {
        return this._state.props || {};
    }

    setSuperProperties(properties, replace) {
        const props = replace ? properties : utils.extend(this.getSuperProperties(), properties);
        this._set("props", props);
    }
}

function getLegacyPersistenceName() {
    return PlatformProxy.getConfig().persistenceNameOld;
}

class GravityAnalyticsAPIForJS {
    constructor(options) {
        options.appId = utils.checkAppId(options?.clientId || "");
        options.accessToken = options.accessToken;
        if (!options.accessToken) {
            console.warn("GravityAnalytics: accessToken must be required");
        }
        options.serverUrl = `${LIB_INFO.BASE_URL}/event/collect/?access_token=${options.accessToken}`;
        const merged = utils.extend({}, DEFAULT_CONFIG, PlatformProxy.getConfig());
        this.config = utils.isObject(options) ? utils.extend(merged, options) : merged;
        this._init(this.config);
    }

    _init(config) {
        this.name = config.name;
        this.appId = config.clientId;
        this.accessToken = config.accessToken;
        const serverUrl = config.serverUrl || config.server_url;
        this.serverUrl = serverUrl;
        this.serverDebugUrl = serverUrl;
        this.configUrl = serverUrl + "/config";
        this.autoTrackProperties = {};
        this._queue = [];
        this.config.syncBatchSize = 100;
        this.config.syncInterval = 60;
        if (config.isChildInstance) {
            this._state = {};
        } else {
            logger.enabled = config.debugMode === "debug";
            this.instances = [];
            this._state = {
                getSystemInfo: false,
                initComplete: false
            };
            PRESET.getSystemInfo(() => {
                this._updateState({ getSystemInfo: true });
            });
            PlatformProxy.setGlobal(this, this.name);
        }
        const appOptions = PlatformProxy.getAppOptions();
        PRESET.properties.$scene = String(appOptions?.scene || appOptions?.from);
        this.store = new Store(config, () => {
            if (this.config.asyncPersistence && utils.isFunction(this.config.persistenceComplete)) {
                this.config.persistenceComplete(this);
            }
            this._updateState();
        });
        this.enabled = !utils.isBoolean(this.store._get("ge_enabled")) || this.store._get("ge_enabled");
        this.isOptOut = !!utils.isBoolean(this.store._get("ge_isOptOut")) && this.store._get("ge_isOptOut");
        const legacyName = getLegacyPersistenceName();
        if ((legacyName === "GravityEngine_wechat_game" || legacyName === "GravityEngine_tt_game" ||
            legacyName.includes("gravityengine_qg")) && config.autoTrack.appLaunch) {
            this.track("$MPLaunch", {
                $url_query: this.setQuery(this.getQuery())
            });
        }
        if (!config.isChildInstance && config.autoTrack) {
            this.autoTrack = PlatformProxy.initAutoTrackInstance(this, config);
        }
    }

    updateConfig() {
    }

    initInstance(name, config) {
        if (!this.config.isChildInstance) {
            if (utils.isString(name) && name !== this.name && utils.isUndefined(this[name])) {
                const child = new GravityAnalyticsAPIForJS(utils.extend({}, this.config, {
                    enablePersistence: false,
                    isChildInstance: true,
                    name: name
                }, config));
                this[name] = child;
                this.instances.push(name);
                this[name]._state = this._state;
                return child;
            }
            logger.warn("initInstance() failed due to the name is invalid: " + name);
            return undefined;
        }
        logger.warn("initInstance() cannot be called on child instance");
        return undefined;
    }

    lightInstance(name) {
        return this[name];
    }

    _setAutoTrackProperties(properties) {
        utils.extend(this.autoTrackProperties, properties);
    }

    setupAndStart(options) {
        if (options != null && options.clientId) {
            this.config.appId = options.clientId;
            this.appId = options.clientId;
        }
        if (this._state.initComplete) {
            return false;
        }
        this._updateState({ initComplete: true });
        return undefined;
    }

    _isReady() {
        return this._state.getSystemInfo && this._state.initComplete && this.store.initComplete &&
            this.config.appId && this.config.accessToken;
    }

    _updateState(state) {
        if (utils.isObject(state)) {
            utils.extend(this._state, state);
        }
        this._onStateChange();
        utils.each(this.instances, (name) => {
            this[name]._onStateChange();
        });
    }

    _onStateChange() {
        if (this._isReady() && this._queue && this._queue.length > 0) {
            utils.each(this._queue, (item) => {
                this[item[0]].apply(this, slice.call(item[1]));
            });
            this._queue = [];
        }
    }

    _hasDisabled() {
        const disabled = !this.enabled || this.isOptOut;
        if (disabled) {
            logger.info("GravityEngine is Pause or Stop!");
        }
        return disabled;
    }

    _sendRequest(event, time, useBeacon) {
        if (this._hasDisabled()) {
            return;
        }
        if (!utils.isUndefined(this.config.disableEventList) && this.config.disableEventList.includes(event.eventName)) {
            logger.info("disabled Event : " + event.eventName);
            return;
        }
        const eventTime = utils.isDate(time) ? time : new Date();
        const payload = {
            event_list: [{
                type: event.type,
                time: new Date(eventTime).getTime()
            }]
        };
        payload.event_list[0].event = event.eventName;
        if (event.type === "track") {
            payload.event_list[0].properties = this.getSendProperties();
            const timer = this.store.removeEventTimer(event.eventName);
            if (!utils.isUndefined(timer)) {
                let duration = new Date().getTime() - timer;
                duration = parseFloat((duration / 1000).toFixed(3));
                if (duration > 86400) {
                    duration = 86400;
                } else if (duration < 0) {
                    duration = 0;
                }
                payload.event_list[0].properties.$event_duration = duration;
            }
        } else {
            payload.event_list[0].properties = {};
        }
        if (utils.isObject(event.properties) && !utils.isEmptyObject(event.properties)) {
            utils.extend(payload.event_list[0].properties, event.properties);
        }
        utils.searchObjDate(payload.event_list[0]);
        payload.client_id = this.appId;
        logger.info(JSON.stringify(payload, null, 4));
        const url = this.serverUrl;
        if (utils.isBoolean(this.config.enableEncrypt) && this.config.enableEncrypt == 1) {
            payload.event_list[0] = utils.generateEncryptyData(payload.event_list[0], undefined);
        }
        if (useBeacon) {
            const formData = new FormData();
            if (this.config.debugMode === "debug") {
                formData.append("source", "client");
                formData.append("appid", this.appId);
                formData.append("deviceId", this.getDeviceId());
                formData.append("data", JSON.stringify(payload.event_list[0]));
            } else {
                formData.append("data", utils.base64Encode(JSON.stringify(payload)));
            }
            navigator.sendBeacon(url, formData);
            if (utils.isFunction(event.onComplete)) {
                event.onComplete({ statusCode: 200 });
            }
        } else {
            httpQueue.enqueue(payload, url, {
                maxRetries: this.config.maxRetries,
                sendTimeout: this.config.sendTimeout,
                callback: event.onComplete,
                debugMode: this.config.debugMode
            });
        }
    }

    _isObjectParams(params) {
        return utils.isObject(params) && utils.isFunction(params.onComplete);
    }

    track(eventName, properties, time, onComplete) {
        if (this._hasDisabled()) {
            return;
        }
        if (this._isObjectParams(eventName)) {
            const params = eventName;
            eventName = params.eventName;
            properties = params.properties;
            time = params.time;
            onComplete = params.onComplete;
        }
        if ((Validator.event(eventName) && Validator.properties(properties)) || !this.config.strict) {
            this._internalTrack(eventName, properties, time, onComplete);
        } else if (utils.isFunction(onComplete)) {
            onComplete({ code: -1, msg: "invalid parameters" });
        }
    }

    _internalTrack(eventName, properties, time, onComplete, useBeacon) {
        if (this._hasDisabled()) {
            return;
        }
        const eventTime = utils.isDate(time) ? time : new Date();
        if (this._isReady()) {
            this._sendRequest({
                type: "track",
                eventName: eventName,
                properties: properties,
                onComplete: onComplete
            }, eventTime, useBeacon);
        } else {
            this._queue.push(["_internalTrack", [eventName, properties, eventTime, onComplete]]);
        }
    }

    userSet(properties, time, onComplete) {
        if (this._hasDisabled()) {
            return;
        }
        if (this._isObjectParams(properties)) {
            const params = properties;
            properties = params.properties;
            time = params.time;
            onComplete = params.onComplete;
        }
        if (Validator.propertiesMust(properties) || !this.config.strict) {
            const eventTime = utils.isDate(time) ? time : new Date();
            if (this._isReady()) {
                this._sendRequest({
                    type: "profile",
                    eventName: "profile_set",
                    properties: properties,
                    onComplete: onComplete
                }, eventTime);
            } else {
                this._queue.push(["userSet", [properties, eventTime, onComplete]]);
            }
        } else {
            logger.warn("calling userSet failed due to invalid arguments");
            if (utils.isFunction(onComplete)) {
                onComplete({ code: -1, msg: "invalid parameters" });
            }
        }
    }

    userSetOnce(properties, time, onComplete) {
        if (this._hasDisabled()) {
            return;
        }
        if (this._isObjectParams(properties)) {
            const params = properties;
            properties = params.properties;
            time = params.time;
            onComplete = params.onComplete;
        }
        if (Validator.propertiesMust(properties) || !this.config.strict) {
            const eventTime = utils.isDate(time) ? time : new Date();
            if (this._isReady()) {
                this._sendRequest({
                    type: "profile",
                    eventName: "profile_set_once",
                    properties: properties,
                    onComplete: onComplete
                }, eventTime);
            } else {
                this._queue.push(["userSetOnce", [properties, eventTime, onComplete]]);
            }
        } else {
            logger.warn("calling userSetOnce failed due to invalid arguments");
            if (utils.isFunction(onComplete)) {
                onComplete({ code: -1, msg: "invalid parameters" });
            }
        }
    }

    userAdd(properties, time, onComplete) {
        if (this._hasDisabled()) {
            return;
        }
        if (this._isObjectParams(properties)) {
            const params = properties;
            properties = params.properties;
            time = params.time;
            onComplete = params.onComplete;
        }
        if (Validator.propertiesMust(properties) || !this.config.strict) {
            const eventTime = utils.isDate(time) ? time : new Date();
            if (this._isReady()) {
                this._sendRequest({
                    type: "profile",
                    eventName: "profile_increment",
                    properties: properties,
                    onComplete: onComplete
                }, eventTime);
            } else {
                this._queue.push(["userAdd", [properties, eventTime, onComplete]]);
            }
        } else {
            logger.warn("calling userAdd failed due to invalid arguments");
            if (utils.isFunction(onComplete)) {
                onComplete({ code: -1, msg: "invalid parameters" });
            }
        }
    }

    userNumberMax(properties, time, onComplete) {
        if (this._hasDisabled()) {
            return;
        }
        if (this._isObjectParams(properties)) {
            const params = properties;
            properties = params.properties;
            time = params.time;
            onComplete = params.onComplete;
        }
        for (const key in properties) {
            if (typeof properties[key] !== "number") {
                const msg = `The key ${key} must be type of number`;
                console.warn(msg);
                if (utils.isFunction(onComplete)) {
                    onComplete({ code: -1, msg: msg });
                }
                return;
            }
        }
        if (Validator.propertiesMust(properties) || !this.config.strict) {
            const eventTime = utils.isDate(time) ? time : new Date();
            if (this._isReady()) {
                this._sendRequest({
                    type: "profile",
                    eventName: "profile_number_max",
                    properties: properties,
                    onComplete: onComplete
                }, eventTime);
            } else {
                this._queue.push(["userNumberMax", [properties, eventTime, onComplete]]);
            }
        } else {
            logger.warn("calling userNumberMax failed due to invalid arguments");
            if (utils.isFunction(onComplete)) {
                onComplete({ code: -1, msg: "invalid parameters" });
            }
        }
    }

    userNumberMin(properties, time, onComplete) {
        if (this._hasDisabled()) {
            return;
        }
        if (this._isObjectParams(properties)) {
            const params = properties;
            properties = params.properties;
            time = params.time;
            onComplete = params.onComplete;
        }
        for (const key in properties) {
            if (typeof properties[key] !== "number") {
                const msg = `The key ${key} must be type of number`;
                console.warn(msg);
                if (utils.isFunction(onComplete)) {
                    onComplete({ code: -1, msg: msg });
                }
                return;
            }
        }
        if (Validator.propertiesMust(properties) || !this.config.strict) {
            const eventTime = utils.isDate(time) ? time : new Date();
            if (this._isReady()) {
                this._sendRequest({
                    type: "profile",
                    eventName: "profile_number_min",
                    properties: properties,
                    onComplete: onComplete
                }, eventTime);
            } else {
                this._queue.push(["userNumberMin", [properties, eventTime, onComplete]]);
            }
        } else {
            logger.warn("calling userNumberMin failed due to invalid arguments");
            if (utils.isFunction(onComplete)) {
                onComplete({ code: -1, msg: "invalid parameters" });
            }
        }
    }

    userDel(time, onComplete) {
        if (this._hasDisabled()) {
            return;
        }
        const properties = {};
        if (Validator.propertiesMust(properties) || !this.config.strict) {
            const eventTime = utils.isDate(time) ? time : new Date();
            if (this._isReady()) {
                this._sendRequest({
                    type: "profile",
                    eventName: "profile_delete",
                    properties: properties,
                    onComplete: onComplete
                }, eventTime);
            } else {
                this._queue.push(["userDel", [properties, eventTime, onComplete]]);
            }
        } else {
            logger.warn("calling userDel failed due to invalid arguments");
            if (utils.isFunction(onComplete)) {
                onComplete({ code: -1, msg: "invalid parameters" });
            }
        }
    }

    userAppend(properties, time, onComplete) {
        if (this._hasDisabled()) {
            return;
        }
        if (this._isObjectParams(properties)) {
            const params = properties;
            properties = params.properties;
            time = params.time;
            onComplete = params.onComplete;
        }
        if (Validator.propertiesMust(properties) || !this.config.strict) {
            const eventTime = utils.isDate(time) ? time : new Date();
            if (this._isReady()) {
                this._sendRequest({
                    type: "profile",
                    eventName: "profile_append",
                    properties: properties,
                    onComplete: onComplete
                }, eventTime);
            } else {
                this._queue.push(["userAppend", [properties, eventTime, onComplete]]);
            }
        } else {
            logger.warn("calling userAppend failed due to invalid arguments");
            if (utils.isFunction(onComplete)) {
                onComplete({ code: -1, msg: "invalid parameters" });
            }
        }
    }

    userUniqAppend(properties, time, onComplete) {
        if (this._hasDisabled()) {
            return;
        }
        if (this._isObjectParams(properties)) {
            const params = properties;
            properties = params.properties;
            time = params.time;
            onComplete = params.onComplete;
        }
        if (Validator.userAppendProperties(properties) || !this.config.strict) {
            const eventTime = utils.isDate(time) ? time : new Date();
            if (this._isReady()) {
                this._sendRequest({
                    type: "profile",
                    eventName: "profile_uniq_append",
                    properties: properties,
                    onComplete: onComplete
                }, eventTime);
            } else {
                this._queue.push(["userUniqAppend", [properties, eventTime, onComplete]]);
            }
        } else {
            logger.warn("calling userAppend failed due to invalid arguments");
            if (utils.isFunction(onComplete)) {
                onComplete({ code: -1, msg: "invalid parameters" });
            }
        }
    }

    userUnset(key, time, onComplete) {
        let properties = { [key]: null };
        if (this._hasDisabled()) {
            return;
        }
        if (this._isObjectParams(properties)) {
            const params = properties;
            properties = params.properties;
            time = params.time;
            onComplete = params.onComplete;
        }
        if (Validator.propertiesMust(properties) || !this.config.strict) {
            const eventTime = utils.isDate(time) ? time : new Date();
            if (this._isReady()) {
                this._sendRequest({
                    type: "profile",
                    eventName: "profile_unset",
                    properties: properties,
                    onComplete: onComplete
                }, eventTime);
            } else {
                this._queue.push(["userUnset", [properties, eventTime, onComplete]]);
            }
        } else {
            logger.warn("calling userUnset failed due to invalid arguments");
            if (utils.isFunction(onComplete)) {
                onComplete({ code: -1, msg: "invalid parameters" });
            }
        }
    }

    uploadQuickAppDeviceInfo() {
        return new Promise((resolve, reject) => {
            PlatformProxy.getQuickDevice({
                success: async (device) => {
                    const data = {
                        os_name: "android",
                        android_id: device.user,
                        imei: device.device,
                        oaid: device.device,
                        mac: device.mac,
                        android_version: device.system,
                        api_version: device.osVersionCode,
                        rom: device.vendorOsName,
                        rom_version: device.vendorOsVersion,
                        phone_brand: device.manufacturer,
                        phone_model: device.model
                    };
                    const url = `${LIB_INFO.BASE_URL}/user/device_info/?access_token=${this.accessToken}&client_id=${this.appId}`;
                    const res = await this.sendNetWork(url, { data: data });
                    return (res.code === 0 ? resolve : reject)(res);
                }
            });
        });
    }

    uploadQuickGameDeviceInfo() {
        return new Promise((resolve, reject) => {
            const platform = getLegacyPersistenceName();
            PlatformProxy.getQuickDevice({
                platform: platform,
                success: async (device) => {
                    const url = `${LIB_INFO.BASE_URL}/user/device_info/?access_token=${this.accessToken}&client_id=${this.appId}`;
                    const res = await this.sendNetWork(url, { data: device });
                    return (res.code === 0 ? resolve : reject)(res);
                }
            });
        });
    }

    logoutEvent() {
        this.track("$MPLogout", {});
    }

    loginEvent() {
        this.track("$MPLogin", {});
    }

    registerEvent() {
        if (getLegacyPersistenceName() === "GravityEngine_quick_mp") {
            this.track("$AppRegister", {});
        } else {
            this.track("$MPRegister", {});
        }
    }

    payEvent(payAmount, payType, orderId, payReason, payMethod) {
        if (typeof payAmount !== "number") {
            throw new Error("pay_amount must be a number");
        }
        if (typeof payType !== "string") {
            throw new Error("pay_type must be a string");
        }
        if (typeof orderId !== "string") {
            throw new Error("order_id must be a string");
        }
        if (typeof payReason !== "string") {
            throw new Error("pay_reason must be a string");
        }
        if (typeof payMethod !== "string") {
            throw new Error("pay_method must be a string");
        }
        this.track("$PayEvent", {
            $pay_amount: payAmount,
            $pay_type: payType,
            $order_id: orderId,
            $pay_reason: payReason,
            $pay_method: payMethod
        });
    }

    bindTAThirdPlatform(taAccountId, taDistinctId) {
        if (!taAccountId && !taDistinctId) {
            throw new Error("taAccountId or taDistinctId must be required");
        }
        if (taAccountId && typeof taAccountId !== "string") {
            throw new Error("taAccountId must be a string");
        }
        if (taDistinctId && typeof taDistinctId !== "string") {
            throw new Error("taDistinctId must be a string");
        }
        this.track("$BindThirdPlatform", {
            $third_platform_type: "ta",
            $ta_account_id: taAccountId,
            $ta_distinct_id: taDistinctId
        });
    }

    adShowEvent(adType, adUnitId, extra) {
        const platform = getLegacyPersistenceName();
        if (platform === "GravityEngine_wechat" || platform === "GravityEngine_wechat_game") {
            if (typeof adType !== "string") {
                throw new Error("ad_type must be a string");
            }
            if (typeof adUnitId !== "string") {
                throw new Error("ad_unit_id must be a string");
            }
            const properties = {
                $ad_type: adType,
                $ad_unit_id: adUnitId,
                $adn_type: "wechat"
            };
            if (Object.prototype.toString.call(extra) === "[object Object]") {
                Object.assign(properties, extra);
            }
            this.track("$AdShow", properties);
        }
    }

    getQuery() {
        return PlatformProxy.getAppOptions().query || {};
    }

    setQuery(params) {
        const pairs = [];
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
            }
        }
        return pairs.join("&");
    }

    sendNetWork(url, data, method = "POST") {
        return new Promise((resolve, reject) => {
            PlatformProxy.request({
                url: url,
                method: method,
                data: typeof data === "string" ? data : JSON.stringify(data),
                header: {
                    "content-type": "application/json"
                },
                success: (res) => {
                    if (res.statusCode === 200) {
                        resolve(res.data);
                    } else {
                        reject(res);
                    }
                },
                fail: (res) => {
                    reject(res);
                }
            });
        });
    }

    _errorPromise(message) {
        return Promise.reject(new Error(message));
    }

    initializeWithHistoryUserInfo(options = {}, historyInfo) {
        return this.initialize(options, historyInfo);
    }

    initialize(options = {}, historyInfo) {
        return new Promise((resolve, reject) => {
            PlatformProxy.getStorage("is_ge_registered", true, async (isRegistered) => {
                let errorMessage = "";
                if (!this._state.initComplete) {
                    errorMessage = "initialize must be called after setupAndStart";
                } else if (!options || !options.name) {
                    errorMessage = "name must be required";
                } else if (!options.version && options.version !== 0) {
                    errorMessage = "version must be required";
                } else if (!(utils.isNumber(options.version) && typeof options.version === "number")) {
                    errorMessage = "version must be type: Number";
                } else if (historyInfo !== undefined) {
                    if (Object.prototype.toString.call(historyInfo) !== "[object Object]") {
                        errorMessage = "history_info must be type: Object";
                    } else if (!historyInfo.company) {
                        errorMessage = "history_info.company must be required";
                    } else if (typeof historyInfo.company !== "string") {
                        errorMessage = "history_info.company must be type: String";
                    } else if (!historyInfo.create_time && historyInfo.create_time !== 0) {
                        errorMessage = "history_info.create_time must be required";
                    } else if (!(utils.isNumber(historyInfo.create_time) && typeof historyInfo.create_time === "number")) {
                        errorMessage = "history_info.create_time must be type: Number";
                    }
                }
                if (errorMessage) {
                    return this._errorPromise(errorMessage).catch((error) => {
                        reject(error);
                    });
                }
                const query = this.getQuery();
                const channel = options.channel || "base_channel";
                const params = {
                    client_id: this.appId,
                    name: options.name,
                    channel: channel,
                    version: options.version,
                    wx_openid: options?.openid || options?.wx_openid || "",
                    wx_unionid: options?.wx_unionid || "",
                    promoted_object_id: options?.promoted_object_id || "",
                    need_return_attribution: options?.enable_sync_attribution || false,
                    ad_data: query
                };
                if (historyInfo) {
                    params.history_info = historyInfo;
                }
                const url = `${LIB_INFO.BASE_URL}/user/initialize/?access_token=${this.accessToken}`;
                const res = await this.sendNetWork(url, params);
                if (res.code !== 0) {
                    return reject(res);
                }
                const platform = getLegacyPersistenceName();
                console.log("gravity current platform: " + platform);
                if (platform === "GravityEngine_quick_mp") {
                    this.uploadQuickAppDeviceInfo();
                } else if (platform.includes("gravityengine_qg")) {
                    this.uploadQuickGameDeviceInfo();
                }
                const properties = PRESET.properties;
                const now = new Date();
                const year = now.getFullYear();
                const month = ("0" + (now.getMonth() + 1)).slice(-2);
                const day = ("0" + now.getDate()).slice(-2);
                const hour = ("0" + now.getHours()).slice(-2);
                const minute = ("0" + now.getMinutes()).slice(-2);
                const second = ("0" + now.getSeconds()).slice(-2);
                const firstVisitTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
                if (isRegistered !== "Y") {
                    this.userSetOnce({
                        $channel: channel,
                        $manufacturer: properties.$manufacturer,
                        $model: properties.$model,
                        $brand: properties.$brand,
                        $os: properties.$os,
                        $first_visit_time: firstVisitTime,
                        $first_scene: String(PlatformProxy.getAppOptions()?.scene)
                    });
                    const queryString = this.setQuery(this.getQuery());
                    this.track("$MPLaunch", { $url_query: queryString });
                    this.track("$MPShow", { $url_query: queryString });
                }
                PlatformProxy.setStorage("is_ge_registered", JSON.stringify("Y"));
                return resolve(res);
            });
        });
    }

    async queryUserInfo() {
        if (!this._state.initComplete) {
            return this._errorPromise("queryUserInfo must be called after setupAndStart");
        }
        const url = `${LIB_INFO.BASE_URL}/user/get/?access_token=${this.accessToken}&client_id=${this.appId}`;
        const res = await this.sendNetWork(url, {}, "GET");
        if (res.code !== 0) {
            throw res;
        }
        return res;
    }

    authorizeOpenID(openId) {
        this.identify(openId);
    }

    identify(distinctId) {
        if (this._hasDisabled()) {
            return;
        }
        if (typeof distinctId === "number") {
            distinctId = String(distinctId);
        } else if (typeof distinctId !== "string") {
            return false;
        }
        this.store.setDistinctId(distinctId);
        return undefined;
    }

    getDistinctId() {
        return this.store.getDistinctId();
    }

    login(accountId) {
        if (this._hasDisabled()) {
            return;
        }
        if (typeof accountId === "number") {
            accountId = String(accountId);
        } else if (typeof accountId !== "string") {
            return false;
        }
        this.store.setAccountId(accountId);
        return undefined;
    }

    getAccountId() {
        return this.store.getAccountId();
    }

    logout() {
        if (!this._hasDisabled()) {
            this.store.setAccountId(null);
        }
    }

    setSuperProperties(properties) {
        if (this._hasDisabled()) {
            return;
        }
        if (Validator.propertiesMust(properties) || !this.config.strict) {
            this.store.setSuperProperties(properties);
        } else {
            logger.warn("setSuperProperties parameter must be a valid property value");
        }
    }

    registerApp(properties) {
        this.setSuperProperties(properties);
    }

    clearSuperProperties() {
        if (!this._hasDisabled()) {
            this.store.setSuperProperties({}, true);
        }
    }

    unsetSuperProperty(key) {
        if (this._hasDisabled()) {
            return;
        }
        if (utils.isString(key)) {
            const properties = this.getSuperProperties();
            delete properties[key];
            this.store.setSuperProperties(properties, true);
        }
    }

    getSuperProperties() {
        return this.store.getSuperProperties();
    }

    getSendProperties() {
        try {
            const properties = utils.extend({}, PRESET.properties, this.autoTrackProperties, this.store.getSuperProperties(), this.dynamicProperties ? this.dynamicProperties() : {});
            for (const key in properties) {
                if (typeof properties[key] === "string") {
                    properties[key] = properties[key].substring(0, 8192);
                }
            }
            return properties;
        } catch (e) {
            return {};
        }
    }

    getPresetProperties() {
        const preset = PRESET.properties;
        const result = {};
        let value = preset.$system_language;
        result.system_language = utils.isUndefined(value) ? "" : value;
        value = preset.$os;
        result.os = utils.isUndefined(value) ? "" : value;
        value = preset.$screen_width;
        result.screenWidth = utils.isUndefined(value) ? 0 : value;
        value = preset.$screen_height;
        result.screenHeight = utils.isUndefined(value) ? 0 : value;
        value = preset.$network_type;
        result.networkType = utils.isUndefined(value) ? "" : value;
        value = preset.$model;
        result.deviceModel = utils.isUndefined(value) ? "" : value;
        value = preset.$os_version;
        result.osVersion = utils.isUndefined(value) ? "" : value;
        result.deviceId = this.getDeviceId();
        const zoneOffset = 0 - new Date().getTimezoneOffset() / 60;
        result.zoneOffset = zoneOffset;
        value = preset.$manufacturer;
        result.manufacturer = utils.isUndefined(value) ? "" : value;
        value = preset.$manufacturer;
        result.brand = utils.isUndefined(value) ? "" : value;
        result.toEventPresetProperties = function () {
            return {
                $app_id: this.appId,
                $model: result.deviceModel,
                $screen_width: result.screenWidth,
                $screen_height: result.screenHeight,
                $system_language: result.system_language,
                $os: result.os,
                $os_version: result.osVersion,
                $network_type: result.networkType,
                $manufacturer: result.manufacturer,
                $brand: result.manufacturer,
                $scene: String(PlatformProxy.getAppOptions()?.scene || PlatformProxy.getAppOptions()?.from)
            };
        };
        return result;
    }

    setDynamicSuperProperties(callback) {
        if (this._hasDisabled()) {
            return;
        }
        if (typeof callback === "function") {
            if (Validator.properties(callback()) || !this.config.strict) {
                this.dynamicProperties = callback;
            } else {
                logger.warn("A dynamic public property must return a valid property value");
            }
        } else {
            logger.warn("setDynamicSuperProperties parameter must be a function type");
        }
    }

    timeEvent(eventName, time) {
        if (this._hasDisabled()) {
            return;
        }
        const eventTime = utils.isDate(time) ? time : new Date();
        if (this._isReady()) {
            if (Validator.event(eventName) || !this.config.strict) {
                this.store.setEventTimer(eventName, eventTime.getTime());
            } else {
                logger.warn("calling timeEvent failed due to invalid eventName: " + eventName);
            }
        } else {
            this._queue.push(["timeEvent", [eventName, eventTime]]);
        }
    }

    getDeviceId() {
        return PRESET.properties.$device_id;
    }

    enableTracking(enabled) {
        this.enabled = enabled;
        this.store._set("ta_enabled", enabled);
    }

    optOutTracking() {
        this.store.setSuperProperties({}, true);
        this.store.setDistinctId(utils.UUID());
        this.store.setAccountId(null);
        this._queue.splice(0, this._queue.length);
        this.isOptOut = true;
        this.store._set("ge_isOptOut", true);
    }

    optOutTrackingAndDeleteUser() {
        const time = new Date();
        this._sendRequest({ type: "user_del" }, time);
        this.optOutTracking();
    }

    optInTracking() {
        this.isOptOut = false;
        this.store._set("ge_isOptOut", false);
    }

    setTrackStatus(status) {
        switch (status) {
            case "PAUSE":
                this.eventSaveOnly = false;
                this.optInTracking();
                this.enableTracking(false);
                break;
            case "STOP":
                this.eventSaveOnly = false;
                this.optOutTracking(true);
                break;
            default:
                this.eventSaveOnly = false;
                this.optInTracking();
                this.enableTracking(true);
        }
    }
}

const NATIVE_DEFAULT_CONFIG = {
    name: "GravityEngine",
    enableLog: true,
    enableNative: false
};

class GravityAnalyticsAPI {
    constructor(options) {
        options.appId = utils.checkAppId(options.clientId);
        options.accessToken = options.accessToken;
        if (options.appId) {
            if (!options.accessToken) {
                console.warn("GravityAnalytics: accessToken must be required");
            }
        } else {
            console.warn("GravityAnalytics: clientId must be required");
        }
        options.serverUrl = `${LIB_INFO.BASE_URL}/event/collect/?access_token=${options.accessToken}`;
        const merged = utils.extend({}, NATIVE_DEFAULT_CONFIG, PlatformProxy.getConfig());
        this.config = utils.isObject(options) ? utils.extend(merged, options) : merged;
        this._init(this.config);
    }

    _isNativePlatform() {
        return (this._isIOS() || this._isAndroid()) && this.config.enableNative;
    }

    _isIOS() {
        return cc.sys.isNative && cc.sys.os === "iOS";
    }

    _isAndroid() {
        return cc.sys.isNative && cc.sys.os === "Android";
    }

    _init(config) {
        this.name = config.name;
        this.appId = config.clientId;
        this.accessToken = config.accessToken;
        const serverUrl = config.serverUrl || config.server_url;
        this.serverUrl = serverUrl;
        this.serverDebugUrl = serverUrl + "/data_debug";
        this.configUrl = serverUrl + "/config";
        if (this._isNativePlatform()) {
            this.initInstanceForNative(this.name, config, this.appId);
            this._readStorage(config);
        } else {
            this.geJs = new GravityAnalyticsAPIForJS(config);
        }
    }

    _readStorage(config) {
        let name = config.persistenceName;
        let nameOld = config.persistenceNameOld;
        if (config.isChildInstance) {
            name = config.persistenceName + "_" + config.name;
            nameOld = config.persistenceNameOld + "_" + config.name;
        }
        this._state = PlatformProxy.getStorage(name) || {};
        if (utils.isEmptyObject(this._state)) {
            this._state = PlatformProxy.getStorage(nameOld) || {};
        }
        if (utils.isEmptyObject(this._state)) {
            PlatformProxy.getStorage(name, true, (data) => {
                if (utils.isEmptyObject(data)) {
                    PlatformProxy.getStorage(nameOld, true, (oldData) => {
                        this._state = utils.extend2Layers({}, oldData, this._state);
                    });
                } else {
                    this._state = utils.extend2Layers({}, data, this._state);
                }
                if (this._state.distinct_id) {
                    this.identifyForNative(this._state.distinct_id);
                }
                if (this._state.account_id) {
                    this.loginForNative(this._state.account_id);
                }
            });
        } else {
            if (this._state.distinct_id) {
                this.identifyForNative(this._state.distinct_id);
            }
            if (this._state.account_id) {
                this.loginForNative(this._state.account_id);
            }
        }
    }

    initInstance(name, config) {
        if (this._isNativePlatform()) {
            this[name] = utils.isUndefined(config)
                ? new GravityAnalyticsAPI(this.config)
                : new GravityAnalyticsAPI(config);
        } else {
            this[name] = this.geJs.initInstance(name, config);
        }
        return this[name];
    }

    lightInstance(name) {
        return this[name];
    }

    setupAndStart() {
        if (this._isNativePlatform()) {
            const self = this;
            window.__autoTrackCallback = function (event) {
                if (utils.isFunction(self.config.autoTrack.callback)) {
                    return JSON.stringify(self.config.autoTrack.callback(event));
                }
                return "{}";
            };
            this.startGravityAnalyticsForNative();
        } else {
            this.geJs.setupAndStart();
        }
    }

    track(eventName, properties, time, onComplete) {
        if (this._isNativePlatform()) {
            this.trackForNative(eventName, properties, time, this.appId);
        } else {
            this.geJs.track(eventName, properties, time, onComplete);
        }
    }

    initializeWithHistoryUserInfo(options = {}, historyInfo) {
        return this.geJs.initializeWithHistoryUserInfo(options, historyInfo);
    }

    initialize(options = {}, historyInfo) {
        if (!this._isNativePlatform()) {
            return this.geJs.initialize(options, historyInfo);
        }
        return undefined;
    }

    queryUserInfo() {
        if (!this._isNativePlatform()) {
            return this.geJs.queryUserInfo();
        }
        return undefined;
    }

    registerApp(properties) {
        if (!this._isNativePlatform()) {
            return this.geJs.registerApp(properties);
        }
        return undefined;
    }

    registerEvent() {
        if (!this._isNativePlatform()) {
            return this.geJs.registerEvent();
        }
        return undefined;
    }

    loginEvent() {
        if (!this._isNativePlatform()) {
            return this.geJs.loginEvent();
        }
        return undefined;
    }

    logoutEvent() {
        if (!this._isNativePlatform()) {
            return this.geJs.logoutEvent();
        }
        return undefined;
    }

    payEvent(payAmount, payType, orderId, payReason, payMethod) {
        if (!this._isNativePlatform()) {
            return this.geJs.payEvent(payAmount, payType, orderId, payReason, payMethod);
        }
        return undefined;
    }

    bindTAThirdPlatform(taAccountId, taDistinctId) {
        if (!this._isNativePlatform()) {
            return this.geJs.bindTAThirdPlatform(taAccountId, taDistinctId);
        }
        return undefined;
    }

    adShowEvent(adType, adUnitId, extra) {
        if (!this._isNativePlatform()) {
            return this.geJs.adShowEvent(adType, adUnitId, extra);
        }
        return undefined;
    }

    userSet(properties, time, onComplete) {
        if (this._isNativePlatform()) {
            this.userSetForNative(properties, this.appId);
        } else {
            this.geJs.userSet(properties, time, onComplete);
        }
    }

    userSetOnce(properties, time, onComplete) {
        if (this._isNativePlatform()) {
            this.userSetOnceForNative(properties, this.appId);
        } else {
            this.geJs.userSetOnce(properties, time, onComplete);
        }
    }

    userUnset(key, time, onComplete) {
        if (this._isNativePlatform()) {
            this.userUnsetForNative(key, this.appId);
        } else {
            this.geJs.userUnset(key, time, onComplete);
        }
    }

    userDel(time, onComplete) {
        if (this._isNativePlatform()) {
            this.userDelForNative(this.appId);
        } else {
            this.geJs.userDel(time, onComplete);
        }
    }

    userAdd(properties, time, onComplete) {
        if (this._isNativePlatform()) {
            this.userAddForNative(properties, this.appId);
        } else {
            this.geJs.userAdd(properties, time, onComplete);
        }
    }

    userNumberMax(properties, time, onComplete) {
        if (!this._isNativePlatform()) {
            this.geJs.userNumberMax(properties, time, onComplete);
        }
    }

    userNumberMin(properties, time, onComplete) {
        if (!this._isNativePlatform()) {
            this.geJs.userNumberMin(properties, time, onComplete);
        }
    }

    userAppend(properties, time, onComplete) {
        if (this._isNativePlatform()) {
            this.userAppendForNative(properties, this.appId);
        } else {
            this.geJs.userAppend(properties, time, onComplete);
        }
    }

    userUniqAppend(properties, time, onComplete) {
        if (this._isNativePlatform()) {
            this.userUniqAppendForNative(properties, this.appId);
        } else {
            this.geJs.userUniqAppend(properties, time, onComplete);
        }
    }

    authorizeOpenID(openId) {
        this.identify(openId);
    }

    identify(distinctId) {
        if (this._isNativePlatform()) {
            this.identifyForNative(distinctId, this.appId);
        } else {
            this.geJs.identify(distinctId);
        }
    }

    getDistinctId() {
        return this._isNativePlatform() ? this.getDistinctIdForNative(this.appId) : this.geJs.getDistinctId();
    }

    login(accountId) {
        if (this._isNativePlatform()) {
            this.loginForNative(accountId, this.appId);
        } else {
            this.geJs.login(accountId);
        }
    }

    getAccountId() {
        return this._isNativePlatform() ? this.getAccountIdForNative(this.appId) : this.geJs.getAccountId();
    }

    logout() {
        if (this._isNativePlatform()) {
            this.logoutForNative(this.appId);
        } else {
            this.geJs.logout();
        }
    }

    setSuperProperties(properties) {
        if (this._isNativePlatform()) {
            this.setSuperPropertiesForNative(properties, this.appId);
        } else {
            this.geJs.setSuperProperties(properties);
        }
    }

    clearSuperProperties() {
        if (this._isNativePlatform()) {
            this.clearSuperPropertiesForNative(this.appId);
        } else {
            this.geJs.clearSuperProperties();
        }
    }

    unsetSuperProperty(key) {
        if (this._isNativePlatform()) {
            this.unsetSuperPropertyForNative(key, this.appId);
        } else {
            this.geJs.unsetSuperProperty(key);
        }
    }

    getSuperProperties() {
        return this._isNativePlatform() ? this.getSuperPropertiesForNative(this.appId) : this.geJs.getSuperProperties();
    }

    getPresetProperties() {
        if (!this._isNativePlatform()) {
            return this.geJs.getPresetProperties();
        }
        const preset = this.getPresetPropertiesForNative(this.appId);
        const result = {};
        let value = preset.$system_language;
        result.system_language = utils.isUndefined(value) ? "" : value;
        value = preset.$os;
        result.os = utils.isUndefined(value) ? "" : value;
        value = preset.$screen_width;
        result.screenWidth = utils.isUndefined(value) ? 0 : value;
        value = preset.$screen_height;
        result.screenHeight = utils.isUndefined(value) ? 0 : value;
        value = preset.$network_type;
        result.networkType = utils.isUndefined(value) ? "" : value;
        value = preset.$device_model;
        result.deviceModel = utils.isUndefined(value) ? "" : value;
        value = preset.$os_version;
        result.osVersion = utils.isUndefined(value) ? "" : value;
        result.deviceId = this.getDeviceId();
        const zoneOffset = 0 - new Date().getTimezoneOffset() / 60;
        result.zoneOffset = zoneOffset;
        value = preset.$manufacturer;
        result.manufacturer = utils.isUndefined(value) ? "" : value;
        value = preset.$manufacturer;
        result.brand = utils.isUndefined(value) ? "" : value;
        result.toEventPresetProperties = function () {
            return {
                $device_model: result.deviceModel,
                $device_id: result.deviceId,
                $screen_width: result.screenWidth,
                $screen_height: result.screenHeight,
                $system_language: result.system_language,
                $os: result.os,
                $os_version: result.osVersion,
                $network_type: result.networkType,
                $zone_offset: zoneOffset,
                $manufacturer: result.manufacturer,
                $brand: result.manufacturer
            };
        };
        return result;
    }

    setDynamicSuperProperties(callback) {
        if (this._isNativePlatform()) {
            if (typeof callback === "function") {
                this.dynamicProperties = callback;
                window.__dynamicPropertiesForNative = function (msg) {
                    console.log("__dynamicPropertiesForNative: native msg: ", msg);
                    return JSON.stringify(utils.encodeDates(callback()));
                };
                this.setDynamicSuperPropertiesForNative("__dynamicPropertiesForNative");
            } else {
                logger.warn("setDynamicSuperProperties parameter must be a function type");
            }
        } else {
            this.geJs.setDynamicSuperProperties(callback);
        }
    }

    timeEvent(eventName, time) {
        return this._isNativePlatform()
            ? this.timeEventForNative(eventName, this.appId)
            : this.geJs.timeEvent(eventName, time);
    }

    getDeviceId() {
        return this._isNativePlatform() ? this.getDeviceIdForNative(this.appId) : this.geJs.getDeviceId();
    }

    enableTracking(enabled) {
        if (this._isNativePlatform()) {
            this.enableTrackingForNative(enabled, this.appId);
        } else {
            this.geJs.enableTracking(enabled);
        }
    }

    optOutTracking() {
        if (this._isNativePlatform()) {
            this.optOutTrackingForNative(this.appId);
        } else {
            this.geJs.optOutTracking();
        }
    }

    optOutTrackingAndDeleteUser() {
        if (this._isNativePlatform()) {
            this.optOutTrackingAndDeleteUserForNative(this.appId);
        } else {
            this.geJs.optOutTrackingAndDeleteUser();
        }
    }

    optInTracking() {
        if (this._isNativePlatform()) {
            this.optInTrackingForNative(this.appId);
        } else {
            this.geJs.optInTracking();
        }
    }

    setTrackStatus(status) {
        if (this._isNativePlatform()) {
            this.setTrackStatusForNative(status, this.appId);
        } else {
            this.geJs.setTrackStatus(status);
        }
    }

    trackForNative(eventName, properties, time, appId) {
        const timeStr = utils.isDate(time) ? utils.formatDate(time) : "";
        if (utils.isUndefined(properties)) {
            properties = {};
        }
        const props = utils.extend(properties, this.dynamicProperties ? this.dynamicProperties() : {});
        const encoded = utils.encodeDates(props);
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "track", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", eventName, JSON.stringify(encoded), timeStr, appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "track:properties:time:appId:", eventName, JSON.stringify(encoded), timeStr, appId);
        }
    }

    timeEventForNative(eventName, appId) {
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "timeEvent", "(Ljava/lang/String;Ljava/lang/String;)V", eventName, appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "timeEvent:appId:", eventName, appId);
        }
    }

    loginForNative(accountId, appId) {
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "login", "(Ljava/lang/String;Ljava/lang/String;)V", accountId, appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "login:appId:", accountId, appId);
        }
    }

    logoutForNative(appId) {
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "logout", "(Ljava/lang/String;)V", appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "logout:", appId);
        }
    }

    setSuperPropertiesForNative(properties, appId) {
        const encoded = utils.encodeDates(properties);
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "setSuperProperties", "(Ljava/lang/String;Ljava/lang/String;)V", JSON.stringify(encoded), appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "setSuperProperties:appId:", JSON.stringify(encoded), appId);
        }
    }

    getSuperPropertiesForNative(appId) {
        let result = "{}";
        if (this._isAndroid()) {
            result = jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "getSuperProperties", "(Ljava/lang/String;)V", appId);
        } else if (this._isIOS()) {
            result = jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "getSuperProperties:", appId);
        }
        return JSON.parse(result);
    }

    unsetSuperPropertyForNative(key, appId) {
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "unsetSuperProperty", "(Ljava/lang/String;Ljava/lang/String;)V", key, appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "unsetSuperProperty:appId:", key, appId);
        }
    }

    clearSuperPropertiesForNative(appId) {
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "clearSuperProperties", "(Ljava/lang/String;)V", appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "clearSuperProperties:", appId);
        }
    }

    userSetForNative(properties, appId) {
        const encoded = utils.encodeDates(properties);
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "userSet", "(Ljava/lang/String;Ljava/lang/String;)V", JSON.stringify(encoded), appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "userSet:appId:", JSON.stringify(encoded), appId);
        }
    }

    userSetOnceForNative(properties, appId) {
        const encoded = utils.encodeDates(properties);
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "userSetOnce", "(Ljava/lang/String;Ljava/lang/String;)V", JSON.stringify(encoded), appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "userSetOnce:appId:", JSON.stringify(encoded), appId);
        }
    }

    userAppendForNative(properties, appId) {
        const encoded = utils.encodeDates(properties);
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "userAppend", "(Ljava/lang/String;Ljava/lang/String;)V", JSON.stringify(encoded), appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "userAppend:appId:", JSON.stringify(encoded), appId);
        }
    }

    userUniqAppendForNative(properties, appId) {
        const encoded = utils.encodeDates(properties);
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "userUniqAppend", "(Ljava/lang/String;Ljava/lang/String;)V", JSON.stringify(encoded), appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "userUniqAppend:appId:", JSON.stringify(encoded), appId);
        }
    }

    userAddForNative(properties, appId) {
        const encoded = utils.encodeDates(properties);
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "userAdd", "(Ljava/lang/String;Ljava/lang/String;)V", JSON.stringify(encoded), appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "userAdd:appId:", JSON.stringify(encoded), appId);
        }
    }

    userUnsetForNative(key, appId) {
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "userUnset", "(Ljava/lang/String;Ljava/lang/String;)V", key, appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "userUnset:appId:", key, appId);
        }
    }

    userDelForNative(appId) {
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "userDel", "(Ljava/lang/String;)V", appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "userDel:", appId);
        }
    }

    authorizeOpenIDForNative(openId, appId) {
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "authorizeOpenID", "(Ljava/lang/String;Ljava/lang/String;)V", openId, appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "authorizeOpenID:appId:", openId, appId);
        }
    }

    identifyForNative(distinctId, appId) {
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "identify", "(Ljava/lang/String;Ljava/lang/String;)V", distinctId, appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "identify:appId:", distinctId, appId);
        }
    }

    initInstanceForNative(name, config, appId) {
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "setCustomerLibInfo", "(Ljava/lang/String;Ljava/lang/String;)V", LIB_INFO.LIB_NAME, LIB_INFO.LIB_VERSION);
            if (utils.isUndefined(config)) {
                jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "initInstanceAppId", "(Ljava/lang/String;Ljava/lang/String;)V", name, appId);
            } else {
                jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "initInstanceConfig", "(Ljava/lang/String;Ljava/lang/String;)V", name, JSON.stringify(config));
            }
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "setCustomerLibInfoWithLibName:libVersion:", LIB_INFO.LIB_NAME, LIB_INFO.LIB_VERSION);
            if (utils.isUndefined(config)) {
                jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "initInstance:appId:", name, appId);
            } else {
                jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "initInstance:config:", name, JSON.stringify(config));
            }
        }
    }

    lightInstanceForNative(name, appId) {
        if (this._isAndroid()) {
            return jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "lightInstance", "(Ljava/lang/String;Ljava/lang/String;)V", name, appId);
        }
        if (this._isIOS()) {
            return jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "lightInstance:appId:", name, appId);
        }
        return undefined;
    }

    startGravityAnalyticsForNative(appId) {
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "startGravityAnalytics", "(Ljava/lang/String;)V", appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "startGravityAnalytics:", appId);
        }
    }

    setDynamicSuperPropertiesForNative(callbackName, appId) {
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "setDynamicSuperProperties", "(Ljava/lang/String;Ljava/lang/String;)V", callbackName, appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "setDynamicSuperProperties:appId:", callbackName, appId);
        }
    }

    getDeviceIdForNative(appId) {
        if (this._isAndroid()) {
            return jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "getDeviceId", "(Ljava/lang/String;)Ljava/lang/String;", appId);
        }
        if (this._isIOS()) {
            return jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "getDeviceId:", appId);
        }
        return undefined;
    }

    getDistinctIdForNative(appId) {
        if (this._isAndroid()) {
            return jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "getDistinctId", "(Ljava/lang/String;)Ljava/lang/String;", appId);
        }
        if (this._isIOS()) {
            return jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "getDistinctId:", appId);
        }
        return undefined;
    }

    getAccountIdForNative(appId) {
        if (this._isAndroid()) {
            return jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "getAccountId", "(Ljava/lang/String;)Ljava/lang/String;", appId);
        }
        if (this._isIOS()) {
            return jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "getAccountId:", appId);
        }
        return undefined;
    }

    getPresetPropertiesForNative(appId) {
        let result = "{}";
        if (this._isAndroid()) {
            result = jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "getPresetProperties", "(Ljava/lang/String;)Ljava/lang/String;", appId);
        } else if (this._isIOS()) {
            result = jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "getPresetProperties:", appId);
        }
        return JSON.parse(result);
    }

    enableTrackingForNative(enabled, appId) {
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "enableTracking", "(Ljava/lang/String;Ljava/lang/String;)V", enabled.toString(), appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "enableTracking:appId:", enabled.toString(), appId);
        }
    }

    optOutTrackingForNative(appId) {
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "optOutTracking", "(Ljava/lang/String;)V", appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "optOutTracking:", appId);
        }
    }

    optOutTrackingAndDeleteUserForNative(appId) {
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "optOutTrackingAndDeleteUser", "(Ljava/lang/String;)V", appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "optOutTrackingAndDeleteUser:", appId);
        }
    }

    optInTrackingForNative(appId) {
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "optInTracking", "(Ljava/lang/String;)V", appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "optInTracking:", appId);
        }
    }

    setTrackStatusForNative(status, appId) {
        if (this._isAndroid()) {
            jsb.reflection.callStaticMethod("com/cocos/game/CocosCreatorProxyApi", "setTrackStatus", "(Ljava/lang/String;Ljava/lang/String;)V", status, appId);
        } else if (this._isIOS()) {
            jsb.reflection.callStaticMethod("CocosCreatorProxyApi", "setTrackStatus:appId:", status, appId);
        }
    }
}

window.GravityAnalyticsAPI = GravityAnalyticsAPI;
window.GravityAnalyticsAPIForJS = GravityAnalyticsAPIForJS;

export default GravityAnalyticsAPI;