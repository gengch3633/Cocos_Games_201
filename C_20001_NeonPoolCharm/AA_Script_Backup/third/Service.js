let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "774a89zcEtNn4DJeHjrMPDd", "Service");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = e("SystemDataSys.js"),
i = e("ClientData.js"),
a = e("SdkHelper.js"),
r = e("TimeUtils.js"),
l = e("HttpUtil.js"),
s = e("UrlMgr.js"),
c = function() {
  function e() {
  }
  e.genSign = function(e, t, o) {
    for(var n = ["version_name", "channel_name", "device_id", "time"], a = "/"+ s.default.getInstance().getUri(e), r = 0;
    r < n.length;
    r++) {
      var l = n[r];
      if("time" == l) a+= " "+ t;
      else {
        var c = i.default.getAttr(l);
        a+= "" != c&& null != c? " "+ c: " null";
      }
    }
    a+= " "+ o;
    a+= " gohell";
    return CryptoJS.enc.Base64.stringify(CryptoJS.MD5(a)).replace(new RegExp("\\+", "g"), "-").replace(new RegExp("/", "g"), "_").replace(new RegExp("=", "g"), "");
  }
;
  e.uuid = function() {
    for(var e = [], t = 0;
    t < 36;
    t++) e[t] = "0123456789abcdef".substr(Math.floor(16* Math.random()), 1);
    e[14] = "4";
    e[19] = "0123456789abcdef".substr(3& e[19]| 8, 1);
    e[8] = e[13] = e[18] = e[23] = "-";
    return e.join("");
  }
;
  e.getCommonUrlData = function(t) {
    var o = a.default.getUrlSplicingString(),
    n = "/"+ s.default.getInstance().getUri(t);
    if(null != o) {
      var i = r.default.getUTCTime(),
      l = e.uuid();
      o+= "&nonce_str="+ l+ "&et="+ i+ "&ngister="+ a.default.getNgister(n, i, l);
    }
    return o;
  }
;
  e.genCommonRequestData = function() {
    return i.default.genFormData();
  }
;
  e.genRequestUrl = function(t) {
    var o = s.default.getInstance().getUrl(t),
    n = e.getCommonUrlData(t);
    return n? o+ "?"+ n: o;
  }
;
  e.getRequestData = function(e) {
    a.default.bd_did|| a.default.initBD(a.default.getBD_did()|| "");
(e = Object.assign({
    }
, e)).dev_token = a.default.bd_did;
    var t = this.genCommonRequestData();
    if(e) {
      e = n.default.encrypt? a.default.getAesEncrypData(JSON.stringify(e)): JSON.stringify(e);
      t.append("business_data", e);
    }
    return t;
  }
;
  e.getRegionalData = function(t) {
    var o = s.default.getInstance().getConfmeUrl(t),
    n = e.getCommonUrlData(t),
    i = a.default.getRealCountry(),
    r = a.default.getDeviceStatus()|| {
    }
;
    console.log("获取中台IP策略参数==", r);
    var l = {
      ir: r.ir|| "0",
      ie: r.ie|| "0",
      irv: r.irv|| "0",
      ix: r.ix|| "0",
      ih: r.ih|| "0",
      io: r.io|| "0",
      iw: r.iw|| "0",
      id: r.id|| "0",
      ids: r.ids|| "0"
    }
;
    return(n+= "&region="+ i+ "&ds="+ JSON.stringify(l))? o+ "?"+ n: o;
  }
;
  e.request = function(t) {
    l.default.queuePost(e.genRequestUrl(t.getRequestType()), e.getRequestData(t.getRequestData()), t);
  }
;
  return e;
}
();
o.default = c;
cc._RF.pop();
