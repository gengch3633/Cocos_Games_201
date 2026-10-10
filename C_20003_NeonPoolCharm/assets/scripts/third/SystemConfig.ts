import GlobalDataMgr from "./GlobalDataMgr";

export const languages = {
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

export const CardType = {
    Dana: "dana",
    Ovo: "ovo",
    ShoppPay: "shopee"
};

export const GAME_NAME = "好运台球";
export const SUBJECT_NAME = "台球王";
export const MONEY_PRO = 100;
export const GOLD_PRO = 1e4;
export const NOT_USE_DEVICE_ID_LS_KEY = "not_use_device_id";
export const DEBUG_DEVICE_ID_LS_KEY = "debug_device_id";
export const USER_AGREEMENT = "";
export const PRIVACY_AGREEMENT = "";
export const CASH_PRO = 1e4;
export const DISTANCE_TOP = 40;
export const DISTANCE_BOTTOM = 20;
export const Default_Language = "BR";
export const Test_Language = "BR";

export const Currency = {
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

export const defaultCurrencyMulty = 100;

export enum CurrencyMulty {
    ID = 100,
    TR = 100,
    US = 100,
    BR = 100,
    JP = 100,
    CN = 100
}

export const EPhonePrefix = {
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

export const UseSystemFont = {};
export const UseSpecialFont = {};

export const Payment_platform = [{
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

export const ChannelConfig = {
    [CardType.Dana]: {
        icon: "plat_dana",
        name: "DANA"
    },
    [CardType.Ovo]: {
        icon: "plat_vov",
        name: "OVO"
    },
    [CardType.ShoppPay]: {
        icon: "plat_shopeepay",
        name: "ShopeePay"
    }
};

export const platform_config_ID = [{
    card: CardType.Dana
}, {
    card: CardType.Ovo
}, {
    card: CardType.ShoppPay
}];

export function getPlatformConfig() {
    switch (GlobalDataMgr.curLanguage) {
        case languages.ID:
            return platform_config_ID;
    }
    return platform_config_ID;
}
