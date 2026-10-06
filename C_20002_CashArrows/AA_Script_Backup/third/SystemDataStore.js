let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "53538GMMF1Hf5o1k242rGsO", "SystemDataStore");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e(BusinessCommonConfig "
} ].js), a = e(" BusinessRequestDescriptors.js "), o = new (e(" RequestDescriptor.js ").default)(a.BUSINESS_REQUEST_DESCRIPTORS), r = new (function() {
function e() {
this.gameName = n.BUSINESS_COMMON_CONFIG.gameName;
this.encrypt = 1;
this.new_user = 0;
this._languageType = n.BUSINESS_COMMON_CONFIG.defaultLanguage;
}
e.prototype.setLanguageType = function(e) {
this._languageType = e;
};
e.prototype.getLanguageType = function() {
return this._languageType;
};
e.prototype.init_config = function(e) {
var t = e.is_encrypt, i = e.new_user;
this.encrypt = t || 0;
var n = null != i ? i : e.is_new;
this.new_user = n ? 1 : 0;
console.log("[SystemDataStore] init_config: new_user = " + this.new_user + " raw_new_user = " + i + " raw_is_new = " + e.is_new);
};
e.prototype.getCDNUrl = function() {
return n.BUSINESS_COMMON_CONFIG.cdnUrl;
};
e.prototype.getServerReleaseUrl = function() {
return n.BUSINESS_COMMON_CONFIG.serverDomainPrefix;
};
e.prototype.get_request_url = function() {
return this.getServerReleaseUrl();
};
e.prototype.get_version_url = function() {
return this.getServerReleaseUrl() + o.getUri(" HotUpdate ");
};
e.prototype.is_new_user = function() {
return 1 === this.new_user;
};
return e;
}())();
i.default = r;
cc._RF.pop();
