let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "e75c0jIZDlBAKHjInAnjHip", "SystemConfig");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    o.getPlatformConfig = o.platform_config_ID = o.ChannelConfig = o.Payment_platform = o.UseSpecialFont = o.UseSystemFont = o.EPhonePrefix = o.CurrencyMulty = o.defaultCurrencyMulty = o.Currency = o.Test_Language = o.Default_Language = o.DISTANCE_BOTTOM = o.DISTANCE_TOP = o.CASH_PRO = o.PRIVACY_AGREEMENT = o.USER_AGREEMENT = o.DEBUG_DEVICE_ID_LS_KEY = o.NOT_USE_DEVICE_ID_LS_KEY = o.GOLD_PRO = o.MONEY_PRO = o.SUBJECT_NAME = o.GAME_NAME = o.CardType = o.languages = void 0;
    var n,
      i = e("GlobalDataMgr.js");
    o.languages = {
      ID: "ID",
      BR: "BR",
      RU: "RU",
      US: "US",
      DE: "DE",
      UK: "UK",
      CA: "CA",
      AU: "AU",
      NZ: "NZ",
      DK: "DK",
      AT: "AT",
      CH: "CH",
      JP: "JP",
      KR: "KR",
      PH: "PH",
      IN: "IN",
      CN: "CN"
    };
    o.CardType = {
      Dana: "dana",
      Ovo: "ovo",
      ShoppPay: "shopee"
    };
    o.GAME_NAME = "好运台球";
    o.SUBJECT_NAME = "台球王";
    o.MONEY_PRO = 100;
    o.GOLD_PRO = 1e4;
    o.NOT_USE_DEVICE_ID_LS_KEY = "not_use_device_id";
    o.DEBUG_DEVICE_ID_LS_KEY = "debug_device_id";
    o.USER_AGREEMENT = "";
    o.PRIVACY_AGREEMENT = "";
    o.CASH_PRO = 1e4;
    o.DISTANCE_TOP = 40;
    o.DISTANCE_BOTTOM = 20;
    o.Default_Language = "BR";
    o.Test_Language = "BR";
    o.Currency = {
      ID: "Rp",
      US: "$",
      BR: "R$",
      RU: "₽",
      UK: "￡",
      DE: "€",
      CA: "C$",
      AU: "A$",
      NZ: "NZ$",
      DK: "kr",
      AT: "€",
      CH: "CHF",
      JP: "¥",
      KR: "₩",
      IN: "₹",
      PH: "₱",
      CN: "￥"
    };
    o.defaultCurrencyMulty = 100;
    (function (e) {
      e[e.ID = 100] = "ID";
      e[e.TR = 100] = "TR";
      e[e.US = 100] = "US";
      e[e.BR = 100] = "BR";
      e[e.JP = 100] = "JP";
      e[e.CN = 100] = "CN";
    })(o.CurrencyMulty || (o.CurrencyMulty = {}));
    o.EPhonePrefix = {
      CN: "+86",
      ID: "+62",
      BR: "+55",
      RU: "+7",
      US: "+1",
      DE: "+49",
      UK: "+44",
      CA: "",
      AU: "",
      NZ: "",
      DK: "",
      AT: "",
      CH: "",
      JP: "",
      KR: "+82",
      PH: "90",
      IN: "+91"
    };
    o.UseSystemFont = {};
    o.UseSpecialFont = {};
    o.Payment_platform = [{
      id: "1",
      wareType: "pay_dana",
      des: "DANA"
    }, {
      id: "2",
      wareType: "pay_ovo",
      des: "OVO"
    }, {
      id: "3",
      wareType: "pay_paypal",
      des: "PayPal"
    }, {
      id: "4",
      wareType: "pay_paytabs",
      des: "PayTabs"
    }, {
      id: "5",
      wareType: "pay_fawry",
      des: "Fawry"
    }, {
      id: "6",
      wareType: "pay_mesary",
      des: "Masary"
    }, {
      id: "7",
      wareType: "pay_sadad",
      des: "SADAD"
    }, {
      id: "8",
      wareType: "pay_onecard",
      des: "One Card"
    }, {
      id: "9",
      wareType: "pay_cashu",
      des: "CashU"
    }, {
      id: "10",
      wareType: "pay_stc",
      des: "STC Pay"
    }, {
      id: "11",
      wareType: "pay_skrill",
      des: "Skrill"
    }, {
      id: "12",
      wareType: "pay_picpay",
      des: "PicPay"
    }, {
      id: "13",
      wareType: "pay_pagbank",
      des: "PagBank"
    }, {
      id: "14",
      wareType: "pay_pix",
      des: "PIX"
    }, {
      id: "15",
      wareType: "pay_itau",
      des: "Banco Itaú"
    }, {
      id: "16",
      wareType: "pay_ame",
      des: "AME"
    }];
    o.ChannelConfig = ((n = {})[o.CardType.Dana] = {
      icon: "plat_dana",
      name: "DANA"
    }, n[o.CardType.Ovo] = {
      icon: "plat_vov",
      name: "OVO"
    }, n[o.CardType.ShoppPay] = {
      icon: "plat_shopeepay",
      name: "ShopeePay"
    }, n);
    o.platform_config_ID = [{
      card: o.CardType.Dana
    }, {
      card: o.CardType.Ovo
    }, {
      card: o.CardType.ShoppPay
    }];
    o.getPlatformConfig = function () {
      switch (i.default.curLanguage) {
        case o.languages.ID:
          return o.platform_config_ID;
      }
      return o.platform_config_ID;
    };
    cc._RF.pop();
