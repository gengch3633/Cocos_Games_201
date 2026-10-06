LocalDataUtil: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "4cebd875nJPm4/QlE4CRvCy", "LocalDataUtil");
Object.defineProperty(i, "__esModule", {
value: !0
});
var n = e("../core/CryptoHelper"), a = e("../../src/middle/MiddleProjectAdapterConfig"), o = function() {
function e() {}
e.getInstance = function() {
null == e._instance && (e._instance = new e());
return e._instance;
};
e.prototype.getStorageKey = function(e) {
return (a.MIDDLE_PROJECT_ADAPTER_CONFIG.gameName || "default").replace(/\s+/g, "_") + "_" + e;
};
e.prototype.saveLocalStorage = function(e, t) {
cc.sys.localStorage.setItem(n.default.base64Encode(this.getStorageKey(e)), n.default.base64Encode(JSON.stringify(t)));
};
e.prototype.getLocalStorage = function(e) {
var t = cc.sys.localStorage.getItem(n.default.base64Encode(this.getStorageKey(e)));
return t && "" != t && null != t && "nan" != t ? JSON.parse(n.default.base64Decode(t)) : null;
};
e.prototype.removeLocalStorage = function(e) {
cc.sys.localStorage.removeItem(n.default.base64Encode(this.getStorageKey(e)));
};
e._instance = null;
return e;
}();
i.default = o.getInstance();
cc._RF.pop();
}