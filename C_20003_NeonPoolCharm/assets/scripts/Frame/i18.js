let e = require;let t = module;let a = exports;
    "use strict";

    cc._RF.push(t, "71d820hYo9HrJy7tTPoIPgw", "i18");
    Object.defineProperty(a, "__esModule", {
      value: !0
    });
    var o = function () {
      function e() {}
      e.updataString = function () {
        for (var t = e._FRESH_STRINGArray.length - 1; t >= 0; t--) {
          var a = e._FRESH_STRINGArray[t];
          if (cc.isValid(a) && a.sKey) {
            var o = e.getKeyStr(a.sKey);
            a.keystring = o;
            a.string = o;
          } else e._FRESH_STRINGArray.splice(t, 1);
        }
      };
      e.parseURL = function (e) {
        for (var t, a = {}, o = e.split("&"), n = o.length, i = 0; i < n; i++) if (o[i]) {
          (t = o[i].split("=="))[1] = t[1].replace(/%/g, "%25");
          a[t[0]] = decodeURIComponent(t[1]);
        }
        return a;
      };
      e.setLanguage = function (t) {
        function a(e) {
          for (var t = e.indexOf("#"), a = (e = e.substring(0, -1 == t ? e.length : t)).split(-1 != e.indexOf("_") ? "_" : "-"), o = a.length - 1; o >= 0; o--) "" == a[o] && a.splice(o, 1);
          var n = {
            lang: a[0],
            country: "SBALL"
          };
          a.length > 1 && (n = {
            lang: a[0],
            country: a[a.length - 1]
          });
          return n;
        }
        var o = function () {
          for (var o = a(t), n = e.COUNTRY_LIST, i = 0, r = n; i < r.length; i++) {
            var c = r[i];
            if (o.country.toLowerCase() == c.country.toLowerCase()) return c;
          }
          o = {
            lang: "en",
            country: "SBALL"
          };
          for (var s = 0, l = n; s < l.length; s++) {
            c = l[s];
            if (o.country.toLowerCase() == c.country.toLowerCase()) return c;
          }
          return n[0];
        }();
        e.myLanguge = o.language;
        e.updataString();
      };
      e.getKeyStr = function (t) {
        if (e.i18nArray) {
          var a = e.changeStr(t);
          if (a) {
            var o = a.indexOf("??&");
            if (-1 != o) {
              var n = a.substring(0, o),
                i = a.substring(o + 2, a.length),
                r = e.parseURL(i),
                c = n.match(/xxx_\d/g);
              if (c) for (var s = 0; s < c.length; s++) n = n.replace(c[s], r["value" + c[s].substring(4, 5)]);
              return n;
            }
            return a;
          }
          return null;
        }
      };
      e.getReplaceStr = function (t, a) {
        if (e.i18nArray[t] && e.i18nArray[t][a]) return e.i18nArray[t][a][e.myLanguge] ? e.i18nArray[t][a][e.myLanguge] : e.i18nArray[t][a].en ? e.i18nArray[t][a].en : null;
      };
      e.changeStr = function (t) {
        for (var a in e.i18nArray) {
          var o = t.indexOf(a);
          if (-1 != o) {
            var n = t,
              i = t.substring(o + a.length, o + a.length + 3),
              r = parseInt(i),
              c = e.getReplaceStr(a, r);
            if (c) {
              n = t.replace(a + i, c);
              var s = this.changeStr(n);
              s && (n = s);
            }
            return n;
          }
        }
        return null;
      };
      e.addi18nArray = function (t) {
        var a = this;
        if (e.i18nArray) for (var o = 0, n = t; o < n.length; o++) {
          var i = n[o],
            r = i.key.lastIndexOf("_") + 1,
            c = i.key.substring(0, r),
            s = parseInt(i.key.substring(r, i.key.length));
          null == e.i18nArray[c] && (e.i18nArray[c] = {});
          null == e.i18nArray[c][s] ? e.i18nArray[c][s] = i : console.error("" + c + s + " 已存在");
        } else {
          e.i18nArray = {};
          setTimeout(function () {
            a.addi18nArray(t);
          }, 16.6);
        }
      };
      e.init = function (t, a, o) {
        e.addi18nArray(t);
        e.setLanguage(a || cc.sys.languageCode);
        o && (e.COUNTRY_LIST = o);
        var n = function (t) {
            var a = e.getKeyStr(t);
            if (a) {
              if (!this.sKey) {
                for (var o = e._FRESH_STRINGArray.length - 1; o >= 0; o--) {
                  var n = e._FRESH_STRINGArray[o];
                  cc.isValid(n) && n.sKey || e._FRESH_STRINGArray.splice(o, 1);
                }
                e._FRESH_STRINGArray.push(this);
              }
              this.sKey = t;
              this.keystring = a;
              t = a;
            } else this.sKey && this.keystring != t && (this.sKey = null);
            return t;
          },
          i = Object.getOwnPropertyDescriptor(cc.Label.prototype, "string");
        Object.defineProperty(cc.Label.prototype, "string", {
          set: function (e) {
            i.set.call(this, n.call(this, e.toString()));
          },
          get: function () {
            this._string = n.call(this, this._string);
            return i.get.call(this);
          }
        });
        var r = Object.getOwnPropertyDescriptor(cc.RichText.prototype, "string");
        Object.defineProperty(cc.RichText.prototype, "string", {
          set: function (e) {
            r.set.call(this, n.call(this, e.toString()));
          },
          get: function () {
            this._N$string = n.call(this, this._N$string);
            return r.get.call(this);
          }
        });
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
    a.default = o;
    cc.js.setClassName("i18", o);
    cc._RF.pop();
