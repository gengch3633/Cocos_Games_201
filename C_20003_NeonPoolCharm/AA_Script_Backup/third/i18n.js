let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "964b2BU6RJMu6F1DggtoYjD", "i18n");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = function () {
      function e() {}
      e.changeStr = function (t) {
        for (var o in e.i18nArray) {
          var n = t.indexOf(o);
          if (-1 != n) {
            var i = t,
              a = t.substring(n + o.length, n + o.length + 3),
              r = parseInt(a),
              l = e.getReplaceStr(o, r);
            if (l) {
              i = t.replace(o + a, l);
              var s = this.changeStr(i);
              s && (i = s);
            }
            return i;
          }
        }
        return null;
      };
      e.init = function (t, o, n) {
        e.addi18nArray(t);
        e.setLanguage(o || cc.sys.languageCode);
        n && (e.COUNTRY_LIST = n);
        var i = function (t) {
            var o = e.getKeyStr(t);
            if (o) {
              if (!this.sKey) {
                for (var n = e._FRESH_STRINGArray.length - 1; n >= 0; n--) {
                  var i = e._FRESH_STRINGArray[n];
                  cc.isValid(i) && i.sKey || e._FRESH_STRINGArray.splice(n, 1);
                }
                e._FRESH_STRINGArray.push(this);
              }
              this.sKey = t;
              this.keystring = o;
              t = o;
            } else this.sKey && this.keystring != t && (this.sKey = null);
            return t;
          },
          a = Object.getOwnPropertyDescriptor(cc.Label.prototype, "string");
        Object.defineProperty(cc.Label.prototype, "string", {
          set: function (e) {
            a.set.call(this, i.call(this, e.toString()));
          },
          get: function () {
            this._string = i.call(this, this._string);
            return a.get.call(this);
          }
        });
        var r = Object.getOwnPropertyDescriptor(cc.RichText.prototype, "string");
        Object.defineProperty(cc.RichText.prototype, "string", {
          set: function (e) {
            r.set.call(this, i.call(this, e.toString()));
          },
          get: function () {
            this._N$string = i.call(this, this._N$string);
            return r.get.call(this);
          }
        });
      };
      e.getKeyStr = function (t) {
        if (e.i18nArray) {
          var o = e.changeStr(t);
          if (o) {
            var n = o.indexOf("??&");
            if (-1 != n) {
              var i = o.substring(0, n),
                a = o.substring(n + 2, o.length),
                r = e.parseURL(a),
                l = i.match(/xxx_\d/g);
              if (l) for (var s = 0; s < l.length; s++) i = i.replace(l[s], r["value" + l[s].substring(4, 5)]);
              return i;
            }
            return o;
          }
          return null;
        }
      };
      e.addi18nArray = function (t) {
        var o = this;
        if (e.i18nArray) for (var n = 0, i = t; n < i.length; n++) {
          var a = i[n],
            r = a.key.lastIndexOf("_");
          if (!(r < 0)) {
            var l = r + 1,
              s = a.key.substring(0, l),
              c = parseInt(a.key.substring(l, a.key.length));
            null == e.i18nArray[s] && (e.i18nArray[s] = {});
            null == e.i18nArray[s][c] ? e.i18nArray[s][c] = a : console.error("" + s + c + " 已存在");
          }
        } else {
          e.i18nArray = {};
          setTimeout(function () {
            o.addi18nArray(t);
          }, 16.6);
        }
      };
      e.updataString = function () {
        for (var t = e._FRESH_STRINGArray.length - 1; t >= 0; t--) {
          var o = e._FRESH_STRINGArray[t];
          if (cc.isValid(o) && o.sKey) {
            var n = e.getKeyStr(o.sKey);
            o.keystring = n;
            o.string = n;
          } else e._FRESH_STRINGArray.splice(t, 1);
        }
      };
      e.setLanguage = function (t) {
        function o(e) {
          for (var t = e.indexOf("#"), o = (e = e.substring(0, -1 == t ? e.length : t)).split(-1 != e.indexOf("_") ? "_" : "-"), n = o.length - 1; n >= 0; n--) "" == o[n] && o.splice(n, 1);
          var i = {
            lang: o[0],
            country: "SBALL"
          };
          o.length > 1 && (i = {
            lang: o[0],
            country: o[o.length - 1]
          });
          return i;
        }
        var n = function () {
          for (var n = o(t), i = e.COUNTRY_LIST, a = 0, r = i; a < r.length; a++) {
            var l = r[a];
            if (n.country.toLowerCase() == l.country.toLowerCase()) return l;
          }
          n = {
            lang: "en",
            country: "SBALL"
          };
          for (var s = 0, c = i; s < c.length; s++) {
            l = c[s];
            if (n.country.toLowerCase() == l.country.toLowerCase()) return l;
          }
          return i[0];
        }();
        e.myLanguge = n.language;
        e.updataString();
      };
      e.getReplaceStr = function (t, o) {
        if (e.i18nArray[t] && e.i18nArray[t][o]) return e.i18nArray[t][o][e.myLanguge] ? e.i18nArray[t][o][e.myLanguge] : e.i18nArray[t][o].en ? e.i18nArray[t][o].en : null;
      };
      e.parseURL = function (e) {
        for (var t, o = {}, n = e.split("&"), i = n.length, a = 0; a < i; a++) if (n[a]) {
          (t = n[a].split("=="))[1] = t[1].replace(/%/g, "%25");
          o[t[0]] = decodeURIComponent(t[1]);
        }
        return o;
      };
      e.i18nArray = {};
      e.myLanguge = "en";
      e.COUNTRY_LIST = [{
        id: 101,
        name: "美国",
        country: "US",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 102,
        name: "英国",
        country: "GB",
        language: "en",
        rate: 1,
        symbol: "￡",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 103,
        name: "法国",
        country: "FR",
        language: "fr",
        rate: 1,
        symbol: "€",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 104,
        name: "德国",
        country: "DE",
        language: "de",
        rate: 1,
        symbol: "€",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 105,
        name: "日本",
        country: "JP",
        language: "ja",
        rate: 100,
        symbol: "円",
        ad_t: 1,
        cash_id: [122, 126, 101, 103]
      }, {
        id: 106,
        name: "加拿大",
        country: "CA",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 107,
        name: "澳大利亚",
        country: "AU",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 108,
        name: "新西兰",
        country: "NZ",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 109,
        name: "挪威",
        country: "NO",
        language: "no",
        rate: 10,
        symbol: "NOK",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 110,
        name: "新加坡",
        country: "SG",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 111,
        name: "瑞典",
        country: "SE",
        language: "se",
        rate: 10,
        symbol: "SEK",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 112,
        name: "瑞士",
        country: "CH",
        language: "de",
        rate: 1,
        symbol: "CHF",
        ad_t: 1,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 201,
        name: "西班牙",
        country: "ES",
        language: "es",
        rate: 1,
        symbol: "€",
        ad_t: 2,
        cash_id: [113, 111, 101, 103]
      }, {
        id: 202,
        name: "阿拉伯",
        country: "SA",
        language: "ar",
        rate: 5,
        symbol: "SR",
        ad_t: 2,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 203,
        name: "波兰",
        country: "PL",
        language: "pl",
        rate: 5,
        symbol: "złote",
        ad_t: 2,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 204,
        name: "韩国",
        country: "KR",
        language: "ko",
        rate: 1e3,
        symbol: "₩",
        ad_t: 2,
        cash_id: [130, 101, 103, 102]
      }, {
        id: 205,
        name: "意大利",
        country: "IT",
        language: "it",
        rate: 1,
        symbol: "€",
        ad_t: 2,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 206,
        name: "比利时",
        country: "BE",
        language: "nl",
        rate: 1,
        symbol: "€",
        ad_t: 2,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 207,
        name: "荷兰",
        country: "NL",
        language: "nl",
        rate: 1,
        symbol: "€",
        ad_t: 2,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 301,
        name: "印度",
        country: "IN",
        language: "hi",
        rate: 80,
        symbol: "₹",
        ad_t: 3,
        cash_id: [124, 125, 101, 103]
      }, {
        id: 302,
        name: "印尼",
        country: "ID",
        language: "in",
        rate: 15e3,
        symbol: "Rp",
        ad_t: 3,
        cash_id: [105, 106, 101, 103]
      }, {
        id: 303,
        name: "葡萄牙",
        country: "PT",
        language: "pt",
        rate: 1,
        symbol: "€",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 304,
        name: "泰国",
        country: "TH",
        language: "th",
        rate: 30,
        symbol: "฿",
        ad_t: 3,
        cash_id: [112, 118, 101, 103]
      }, {
        id: 305,
        name: "菲律宾",
        country: "PH",
        language: "fil",
        rate: 50,
        symbol: "₱",
        ad_t: 3,
        cash_id: [121, 116, 101, 103]
      }, {
        id: 306,
        name: "马来西亚",
        country: "MY",
        language: "ms",
        rate: 5,
        symbol: "RM",
        ad_t: 3,
        cash_id: [119, 121, 101, 103]
      }, {
        id: 307,
        name: "哥伦比亚",
        country: "CO",
        language: "es",
        rate: 3e3,
        symbol: "COP",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 308,
        name: "阿根廷",
        country: "AR",
        language: "es",
        rate: 350,
        symbol: "ARS",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 309,
        name: "墨西哥",
        country: "MX",
        language: "es",
        rate: 20,
        symbol: "Mex.$",
        ad_t: 3,
        cash_id: [113, 111, 101, 103]
      }, {
        id: 310,
        name: "巴西",
        country: "BR",
        language: "pt",
        rate: 5,
        symbol: "R$",
        ad_t: 3,
        cash_id: [107, 113, 123, 101]
      }, {
        id: 311,
        name: "越南",
        country: "VN",
        language: "vi",
        rate: 2e4,
        symbol: "₫",
        ad_t: 3,
        cash_id: [120, 115, 101, 103]
      }, {
        id: 312,
        name: "土耳其",
        country: "TR",
        language: "tr",
        rate: 8,
        symbol: "₺",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 313,
        name: "罗马尼亚",
        country: "RO",
        language: "ro",
        rate: 5,
        symbol: "Lei",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 314,
        name: "约旦",
        country: "JO",
        language: "ar",
        rate: 1,
        symbol: "$",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 315,
        name: "伊拉克",
        country: "IQ",
        language: "ar",
        rate: 1,
        symbol: "$",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 316,
        name: "埃及",
        country: "EG",
        language: "ar",
        rate: 1,
        symbol: "$",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 317,
        name: "以色列",
        country: "IL",
        language: "ar",
        rate: 1,
        symbol: "$",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 318,
        name: "俄罗斯",
        country: "RU",
        language: "ru",
        rate: 70,
        symbol: "₽",
        ad_t: 3,
        cash_id: [114, 117, 101, 103]
      }, {
        id: 319,
        name: "乌克兰",
        country: "UA",
        language: "uk",
        rate: 20,
        symbol: "₴",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }, {
        id: 400,
        name: "SBALL",
        country: "SBALL",
        language: "en",
        rate: 1,
        symbol: "$",
        ad_t: 3,
        cash_id: [101, 103, 102, 104]
      }];
      e._FRESH_STRINGArray = [];
      return e;
    }();
    o.default = n;
    cc.js.setClassName("PoolI18n", n);
    cc._RF.pop();
