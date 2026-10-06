declare const jsb: any;

import { GVYOSIN } from "./GVYOSIN";

export class XWRHYLPIOGNSH {
    MDOKKVQUSOZBUD = "";
    MILTNZ = "";
    PGQSCYPDMUTK = "";
    ZRXAERRUGNSM = "";
    OFBTDJQFN = 1;

    constructor() {
        this.MDOKKVQUSOZBUD = GVYOSIN.MDOKKVQUSOZBUD;
        this.MILTNZ = GVYOSIN.MILTNZ;
        this.PGQSCYPDMUTK = GVYOSIN.PGQSCYPDMUTK;
        this.ZRXAERRUGNSM = GVYOSIN.ZRXAERRUGNSM;
        this.OFBTDJQFN = GVYOSIN.OFBTDJQFN;
    }

    MPNQKRF(value: string): string {
        return value;
    }

    OJYMNBSPWNKSRNA(value: string): number {
        let hash = 0;
        for (let i = 0; i < value.length; i++) {
            hash = (31 * hash + value.charCodeAt(i)) | 0;
        }
        return hash;
    }

    MKHZXYYX(): boolean {
        return jsb.reflection.callStaticMethod(this.MDOKKVQUSOZBUD, this.MPNQKRF(GVYOSIN.WOCPZPIRLYBI), "()Z");
    }

    XVQFJJJHUQWTY(entry: string): boolean {
        return jsb.reflection.callStaticMethod(
            this.MDOKKVQUSOZBUD,
            this.MPNQKRF(GVYOSIN.XUMCMXUBF),
            "(Ljava/lang/String;)Z",
            entry
        );
    }

    HBQFOOCDXAZ(position: number): void {
        jsb.reflection.callStaticMethod(
            this.MDOKKVQUSOZBUD,
            this.MPNQKRF(GVYOSIN.UBWNMRTPEYNSRW),
            "(I)V",
            position
        );
    }

    static ZSYXBLSKYBGCRTL(): XWRHYLPIOGNSH {
        return this.RDOJBJNH;
    }

    ORZJESUZUCCUKEDV(value: string): void {
        jsb.reflection.callStaticMethod(
            this.MDOKKVQUSOZBUD,
            this.MPNQKRF(GVYOSIN.XPXGZHQTLFKOPTQV),
            "(Ljava/lang/String;)V",
            value
        );
    }

    WNLBMXMEUWELMZGL(type: number, eventName: string, payload: unknown): void {
        const json = JSON.stringify(payload);
        jsb.reflection.callStaticMethod(
            this.MDOKKVQUSOZBUD,
            this.MPNQKRF(GVYOSIN.YRNGADCWZXK),
            "(ILjava/lang/String;Ljava/lang/String;)V",
            type,
            eventName,
            json
        );
    }

    JFFPSVW(entry: string): boolean {
        return jsb.reflection.callStaticMethod(
            this.MDOKKVQUSOZBUD,
            this.MPNQKRF(GVYOSIN.PENETODX),
            "(Ljava/lang/String;)Z",
            entry
        );
    }

    YDFDNEPFGPRESZ(key: string): string {
        return jsb.reflection.callStaticMethod(
            this.MDOKKVQUSOZBUD,
            this.MPNQKRF(GVYOSIN.IMYDTQP),
            "(Ljava/lang/String;)Ljava/lang/String;",
            key
        );
    }

    ENFYLZFAPPIG(): void {
        jsb.reflection.callStaticMethod(this.MDOKKVQUSOZBUD, this.MPNQKRF(GVYOSIN.ENFYLZFAPPIG), "()V");
    }

    LTBBUBX(position: number, offset: number, height: number): void {
        jsb.reflection.callStaticMethod(
            this.MDOKKVQUSOZBUD,
            this.MPNQKRF(GVYOSIN.EBTJYCXYIDHWS),
            "(III)V",
            position,
            offset,
            height
        );
    }

    ZBFDUZXA(entry: string): boolean {
        return jsb.reflection.callStaticMethod(
            this.MDOKKVQUSOZBUD,
            this.MPNQKRF(GVYOSIN.YLRFVCYCCCYL),
            "(Ljava/lang/String;)Z",
            entry
        );
    }

    RVZMUJV(payload: { event_name: string; properties?: Record<string, unknown> }, flush: boolean, realtime: boolean): void {
        const json = JSON.stringify(payload);
        jsb.reflection.callStaticMethod(
            this.MDOKKVQUSOZBUD,
            this.MPNQKRF(GVYOSIN.XTXPMOKCNXI),
            "(Ljava/lang/String;ZZ)V",
            json,
            flush,
            realtime
        );
    }

    YDKKCKYYIQZTDCWY(entry: string): boolean {
        return jsb.reflection.callStaticMethod(
            this.MDOKKVQUSOZBUD,
            this.MPNQKRF(GVYOSIN.APNFOB),
            "(Ljava/lang/String;)Z",
            entry
        );
    }

    AUGKPUOQQSPRPKQU(entry: string): void {
        jsb.reflection.callStaticMethod(
            this.MDOKKVQUSOZBUD,
            this.MPNQKRF(GVYOSIN.UPJRPLSXMB),
            "(Ljava/lang/String;)V",
            entry
        );
    }

    XOEBJMYVK(value: string): void {
        jsb.reflection.callStaticMethod(
            this.MDOKKVQUSOZBUD,
            this.MPNQKRF(GVYOSIN.ILGPNHKCNXFIPD),
            "(Ljava/lang/String;)V",
            value
        );
    }

    RVIUIWJHMUDCSKSL(): void {
        const payload = {
            engine: "cocos",
            engine_ver: cc.ENGINE_VERSION,
            sdk_ver: this.ZRXAERRUGNSM,
            sdk_ver_code: this.OFBTDJQFN,
            api_name: this.MILTNZ,
            api_method: this.PGQSCYPDMUTK,
        };
        const json = JSON.stringify(payload);
        jsb.reflection.callStaticMethod(
            this.MDOKKVQUSOZBUD,
            this.MPNQKRF(GVYOSIN.RVIUIWJHMUDCSKSL),
            "(Ljava/lang/String;)V",
            json
        );
    }

    KAAPHLHD(msgId: number, method: string, headers: string, body: string): void {
        jsb.reflection.callStaticMethod(
            this.MDOKKVQUSOZBUD,
            this.MPNQKRF(GVYOSIN.KAAPHLHD),
            "(ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
            msgId,
            method,
            headers,
            body
        );
    }

    RSGPVX(entry: string): boolean {
        return jsb.reflection.callStaticMethod(
            this.MDOKKVQUSOZBUD,
            this.MPNQKRF(GVYOSIN.PQTDBKYXIR),
            "(Ljava/lang/String;)Z",
            entry
        );
    }

    static RDOJBJNH = new XWRHYLPIOGNSH();
}
