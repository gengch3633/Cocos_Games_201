let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "2dc5bNFIP1GIb35GWiAOSFp", "ClientData");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = e("HotUpdate.js"),
      i = e("FormData.js"),
      a = e("PlayerDataSys.js"),
      r = e("SystemDataSys.js"),
      l = {
        aid: "android_id",
        madr: "mac_addr",
        wmr: "wifi_mac_addr",
        platform: cc.sys.os == cc.sys.OS_ANDROID ? "os_name" : "platform"
      },
      s = function () {
        function e() {}
        e.setCommonData = function () {
          e.genUrlString();
          e.setCookieString();
          e.genFormData();
        };
        e.getAttr = function (t) {
          return e[l[t] ? l[t] : t];
        };
        e.clear = function () {
          e.idfa = "";
          e.platform = "";
          e.version_name = "";
          e.device_id = "";
          e.channel_name = "";
          e.device_serial = "";
          e.box_pkg_name = "";
          e.imei = "";
          e.oaid = "";
          e.Latitude = "";
          e.Longitude = "";
          e.os_version = "";
          e.phone_model = "";
          e.phone_brand = "";
          e.os_name = "";
          e.device_type = "";
          e.session_id = "";
          e.network_type = "";
          e.mdi = "";
          e.ii = "";
          e.rii = "";
          e.mac_addr = "";
          e.wifi_mac_addr = "";
          e.android_id = "";
        };
        e.getVersionData = function () {
          for (var t = "", o = ["box_pkg_name", "channel_name", "device_id"], n = 0; n < o.length; n++) {
            var i = o[n],
              a = e[l[i] ? l[i] : i];
            "" != a && null != a && (t += ("" == t ? t : "&") + i + "=" + a);
          }
          return t;
        };
        e.isVivo = function () {
          return !(!r.default.is_reviewer || "vivo" != e.channel_name && "xiaomi" != e.channel_name);
        };
        e.init = function (t) {
          console.log("参数");
          console.log(t);
          e.caid = t.caid || "";
          e.caid_version = t.caid_version || "";
          e.last_caid_version = t.last_caid_version || "";
          e.last_caid = t.last_caid || "";
          e.idfa = t.idfa || "";
          e.platform = t.platform || "";
          e.version_name = t.version_name || "";
          e.device_id = t.device_id || "";
          e.channel_name = t.channel_name || "";
          e.device_serial = t.device_serial || "";
          e.box_pkg_name = t.box_pkg_name || "";
          e.imei = t.imei || "";
          e.oaid = t.oaid || "";
          e.Latitude = t.Latitude || "";
          e.Longitude = t.Longitude || "";
          e.os_version = t.os_version || "";
          e.phone_model = t.phone_model || "";
          e.phone_brand = t.phone_brand || "";
          e.os_name = t.os_name || "";
          e.device_type = t.device_type || "";
          e.session_id = t.session_id || "";
          e.network_type = t.network_type || "";
          e.mdi = t.mdi || "";
          e.ii = t.ii || "";
          e.rii = t.rii || "";
          e.mac_addr = t.madr || "";
          e.wifi_mac_addr = t.wmr || "";
          e.android_id = t.aid || "";
          e.setCommonData();
        };
        e.genFormData = function (t) {
          e.yid = null == t ? e.yid : t;
          var o = e.yid,
            n = new i.default();
          n.append("yid", null != o ? o : "yid_read_fail");
          var a = e[l.device_id ? l.device_id : "device_id"];
          "" != a && null != a && n.append("device_id", a);
          return n;
        };
        e.genUrlString = function () {
          var t = n.default.getInstance().getVersion(),
            o = n.default.getInstance().getBaseVersion();
          console.log("baseVersion:" + o + ",nowVersion:" + t);
          for (var i = "", r = ["version_name", "channel_name", "box_pkg_name", "ii", "idfa", "platform", "madr", "wmr", "oaid", "os_version", "phone_model", "phone_brand", "device_id"], s = 0; s < r.length; s++) {
            var c = r[s],
              u = encodeURI(e[l[c] ? l[c] : c]);
            "" != u && null != u && (i += "&" + c + "=" + u);
          }
          i = "user_id=" + a.default.user_id + i;
          t && (i += "&game_version=" + t + "&base_version=" + o);
          e.url_common_str = i;
        };
        e.setCookieString = function () {
          for (var t = "", o = ["device_id", "ii", "aid", "madr", "idfa", "wmr", "mdi", "rii"], n = 0; n < o.length; n++) {
            var i = o[n],
              r = e[l[i] ? l[i] : i];
            "" != r && null != r && (t += "; " + i + "=" + r);
          }
          t = "yid=" + a.default.yid + t;
          e.cookie_str = t;
          document.cookie = e.cookie_str;
        };
        e.isOppo = function () {
          return !(!r.default.is_reviewer || "oppo" != e.channel_name);
        };
        e.device_id = "";
        e.version_name = "";
        e.channel_name = "";
        e.box_pkg_name = "";
        e.imei = "";
        e.android_id = "";
        e.mac_addr = "";
        e.wifi_mac_addr = "";
        e.oaid = "";
        e.platform = "";
        e.os_name = "";
        e.os_version = "";
        e.phone_model = "";
        e.phone_brand = "";
        e.device_type = "";
        e.mdi = "";
        e.rii = "";
        e.ii = "";
        e.device_serial = "";
        e.Longitude = "";
        e.Latitude = "";
        e.session_id = "";
        e.network_type = "";
        e.idfa = "";
        e.caid = "";
        e.caid_version = "";
        e.last_caid = "";
        e.last_caid_version = "";
        e.url_common_str = "";
        e.cookie_str = "";
        e.form_str = "";
        e.app_version_name = "";
        e.yid = "yid_read_failed";
        return e;
      }();
    o.default = s;
    cc._RF.pop();
