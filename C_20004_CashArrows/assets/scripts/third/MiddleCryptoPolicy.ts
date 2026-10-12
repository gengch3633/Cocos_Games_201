export interface MiddleCryptoPolicyEntry {
    fixedKey: string;
    dateString: string;
}

export interface MiddleCryptoPolicyData {
    iv: string;
    legacy: MiddleCryptoPolicyEntry;
    v2: MiddleCryptoPolicyEntry;
}

export const MIDDLE_CRYPTO_POLICY: MiddleCryptoPolicyData = {
    iv: "0000000000000000",
    legacy: {
        fixedKey: "ad_config_199201",
        dateString: "20220323"
    },
    v2: {
        fixedKey: "wbv_config_18231",
        dateString: "20251126"
    }
};