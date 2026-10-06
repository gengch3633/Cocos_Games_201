import { LZFAHNEP } from "./LZFAHNEP";

export class MsgFuc {
    ZRTLLSTONYUWZN: unknown;
    XZFADQBYSH: (...args: unknown[]) => void;

    constructor(target: unknown, callback: (...args: unknown[]) => void) {
        this.ZRTLLSTONYUWZN = target;
        this.XZFADQBYSH = callback;
        this.XZFADQBYSH.bind(target);
    }
}

export class UMPTXJ extends LZFAHNEP {
    XYGVPHVSFFPUJDPP: Record<string, MsgFuc[]> = {};
    ISPAXF: Record<string, MsgFuc[]> = {};
    EALXWBUECJOTDOW: Record<string, MsgFuc[]> = {};

    CRYLRA(store: Record<string, MsgFuc[]>, key: string, callback: (...args: unknown[]) => void, target: unknown): void {
        if (store[key] != null) {
            store[key].push(new MsgFuc(target, callback));
        } else {
            store[key] = [new MsgFuc(target, callback)];
        }
    }

    HWZEEGYDTCHMYPA(key: string, callback: (...args: unknown[]) => void, target: unknown): void {
        this.CRYLRA(this.XYGVPHVSFFPUJDPP, key, callback, target);
    }

    MOYJHJXDBD(key: string, callback: (...args: unknown[]) => void, target: unknown): void {
        this.CRYLRA(this.EALXWBUECJOTDOW, key, callback, target);
    }

    QZWZVTBXDV(key: string, payload: unknown): void {
        this.KPFDIKEBW(this.ISPAXF, key, payload);
        this.KPFDIKEBW(this.XYGVPHVSFFPUJDPP, key, payload);
        this.KPFDIKEBW(this.EALXWBUECJOTDOW, key, payload);
    }

    UYCVCIJQEQX(key: string, callback: (...args: unknown[]) => void, target: unknown): void {
        this.TPYUUEWBAQHYQIL(this.EALXWBUECJOTDOW, key, callback, target);
    }

    RVUSXQFHWT(key: string, callback: (...args: unknown[]) => void, target: unknown): void {
        this.TPYUUEWBAQHYQIL(this.XYGVPHVSFFPUJDPP, key, callback, target);
    }

    TPYUUEWBAQHYQIL(
        store: Record<string, MsgFuc[]>,
        key: string,
        callback: (...args: unknown[]) => void,
        target: unknown
    ): void {
        if (store[key] != null && store[key].length > 0) {
            let found: MsgFuc = null;
            for (let i = 0; i < store[key].length; i++) {
                if (store[key][i].XZFADQBYSH == callback && store[key][i].ZRTLLSTONYUWZN == target) {
                    found = store[key][i];
                    break;
                }
            }
            const index = store[key].indexOf(found);
            if (index > -1) {
                store[key].splice(index, 1);
            }
            if (store[key] != null && store[key].length == 0) {
                delete store[key];
            }
        }
    }

    KPFDIKEBW(store: Record<string, MsgFuc[]>, key: string, payload: unknown): void {
        if (store[key] != null) {
            store[key].forEach((entry) => {
                entry.XZFADQBYSH.call(entry.ZRTLLSTONYUWZN, payload);
            });
        }
    }

    EFNUOHUWYV(key: string, callback: (...args: unknown[]) => void, target: unknown): void {
        this.TPYUUEWBAQHYQIL(this.ISPAXF, key, callback, target);
    }

    VAZBFSLPHOOGPP(key: string, callback: (...args: unknown[]) => void, target: unknown): void {
        this.CRYLRA(this.ISPAXF, key, callback, target);
    }
}
