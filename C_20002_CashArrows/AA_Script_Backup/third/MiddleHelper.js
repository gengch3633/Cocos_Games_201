let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "ac50cEs+UZEGqjhYqn/pr3h", "MiddleHelper");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e("MiddleRequestDescriptors.js"),
a = e("MiddleProjectAdapterConfig.js"),
o = e("ClientDataStore.js"),
r = e("BusinessAnalyticsService.js"),
s = e("MiddleNetwork.js"),
l = e("PlatformBridge.js"),
c = new(function() {
  function e() {
    this.kIsUploadIPFirstCall = "com.sdk.kIsUploadIPFirstCall";
    this.isSupportHot = ! 1;
    this.isFinishRegional = ! 1;
    this.hasServerCountry = ! 1;
    this.banRed = ! 0;
    this.banPay = ! 1;
    this.recogIRE = ! 1;
    this.recogTF = ! 1;
    this.mfi = ! 0;
    this.country = null;
  }
  e.prototype.normalizeCountry = function(e) {
    if(! e) return "";
    var t = String(e).toUpperCase();
    return "GB" === t? "UK": t;
  }
;
  e.prototype.mapLanguageToCountry = function(e) {
    return {
      zh: "CN", en: "US", id: "ID", pt: "BR", ru: "RU", de: "DE", fr: "FR", es: "MX", hi: "IN", th: "TH", ja: "JP", ko: "KR", fil: "PH", tl: "PH"
    }
[String(e|| "").toLowerCase()]|| "IN";
  }
;
  e.prototype.resolveDefaultCountry = function() {
    return this.normalizeCountry(o.default.local_country)|| this.mapLanguageToCountry(cc.sys.language);
  }
;
  e.prototype.applyCountry = function(e) {
    var t = this.normalizeCountry(e);
    t|| (t = this.resolveDefaultCountry());
    this.saveLocalCountry(t);
    o.default.local_country = t;
    "function" == typeof o.default.buildCommonUrlStr&& o.default.buildCommonUrlStr();
    "function" == typeof o.default.buildMiddleCommonUrlStr&& o.default.buildMiddleCommonUrlStr();
    return t;
  }
;
  e.prototype.localCountry = function() {
    if(! this.country) try {
      this.country = cc.sys.localStorage.getItem("com.sdk.country");
    } catch(e) {
    }
    return this.country;
  }
;
  e.prototype.saveLocalCountry = function(e) {
    try {
      cc.sys.localStorage.setItem("com.sdk.country", e);
    } catch(e) {
    }
    this.country = e;
  }
;
  e.prototype.getRegionalState = function() {
    return {
      isSupportHot: this.isSupportHot, isFinishRegional: this.isFinishRegional, hasServerCountry: this.hasServerCountry, banRed: this.banRed, banPay: this.banPay, recogIRE: this.recogIRE, recogTF: this.recogTF, mfi: this.mfi, country: this.country|| this.localCountry()
    }
;
  }
;
  e.prototype.initAdSdkAfterRegional = function(e, t) {
    try {
      var i = t|| o.default.local_country|| "IN", n = !(! e|| ! 0 !== e.is_ump&& ! 0 !== e.is_ump_country), r = a.MIDDLE_PROJECT_ADAPTER_CONFIG.maxKey|| "";
      l.default.getNativeBridge().initSdk(r, i, n);
      console.log("[MiddleHelper.middleCountry] fuelProfitGear called", {
        ipCountry: i, isUMP: n
      }
);
    } catch(e) {
      console.warn("[MiddleHelper.middleCountry] fuelProfitGear call failed", e);
    }
  }
;
  e.prototype.getIpRequestIsFirstFlag = function() {
    var e = ! 1;
    try {
(e = null === cc.sys.localStorage.getItem(this.kIsUploadIPFirstCall))&& cc.sys.localStorage.setItem(this.kIsUploadIPFirstCall, "1");
    } catch(t) {
      e = ! 0;
    }
    return e;
  }
;
  e.prototype.reportIPInfo = function(e, t, i) {
    void 0 === i&& (i = ! 1);
    var n = {
      ip_config_value: e, ip_config_status: t, ip_first_req: i, redirect_type: "0"
    }
;
    r.default.reportData("ip_config", n);
  }
;
  e.prototype.middleCountry = function(e, t, i) {
    var a, o = this, r = "[MiddleHelper.middleCountry]", l = this.getIpRequestIsFirstFlag();
    this.reportIPInfo("", 0, l);
    var c = function(e, t) {
      var n = o.normalizeCountry(o.localCountry()), a = o.applyCountry(n|| o.resolveDefaultCountry());
      o.isFinishRegional = ! 0;
      o.hasServerCountry = ! 1;
      o.initAdSdkAfterRegional(null, a);
      o.reportIPInfo(e|| t, - 1, l);
      console.warn(r, "归因失败，使用国家:", a, "source:", n? "cache": "default", "reason:", t);
      null == i|| i(e);
    }
;
    if(null === (a = n.MIDDLE_REQUEST_DESCRIPTORS.Regional)|| void 0 === a? void 0: a.url) s.default.getMiddleCountry(null, function(i) {
      try {
        var n = (null == i? void 0: i.data)|| i|| {
        }
;
        console.log(r, "解析结果 →", JSON.stringify(n));
        var a = o.normalizeCountry(n&& n.region), s = o.applyCountry(a|| o.localCountry()|| o.resolveDefaultCountry());
        o.isFinishRegional = ! 0;
        o.hasServerCountry = ! ! a;
        o.isSupportHot = n.up_h|| ! 1;
        o.banRed = ! ! n.forbid_red_envelope;
        o.banPay = ! 1;
        o.recogIRE = ! ! n.recog_ire;
        o.recogTF = ! ! n.recog_tf;
        void 0 !== n.mfi&& null !== n.mfi&& (o.mfi = ! ! n.mfi);
        o.initAdSdkAfterRegional(n, s);
        o.reportIPInfo(n, 1, l);
        var u = n.forbid_used|| n.forbid_red_envelope|| ! 1;
        console.log(r, "country →", s, "  isSupportHot →", o.isSupportHot, "  forbid_used →", u);
        if(u) {
          console.warn(r, "账号封禁，触发 onBan");
          null == t|| t(n);
          return;
        }
        console.log(r, "正常进入游戏，触发 onEnterGame，onEnterGame 类型 →", typeof e);
        null == e|| e(n);
      } catch(e) {
        console.error(r, "解析响应异常 →", e);
        c(e, "parse_error");
      }
    }
, function(e) {
      console.warn(r, "请求失败或无响应，触发 onBackstop  err →", JSON.stringify(e));
      c(e, "request_fail");
    }
);
    else {
      console.warn(r, "regionalUrl 为空，直接 onBackstop");
      c(void 0, "missing_url");
    }
  }
;
  e.prototype.initMiddleFundsPlatform = function() {
  }
;
  return e;
}
())();
i.default = c;
cc._RF.pop();
