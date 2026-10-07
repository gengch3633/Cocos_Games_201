import { LZFAHNEP } from "./LZFAHNEP";

export class MsgFuc {
    ZRTLLSTONYUWZN: any;
    XZFADQBYSH: (...args: any[]) => void;

    constructor(target: any, callback: (...args: any[]) => void) {
        this.ZRTLLSTONYUWZN = target;
        this.XZFADQBYSH = callback;
        this.XZFADQBYSH.bind(target);
    }
}

export class UMTPTXJ extends LZFAHNEP {
    XYGVPHVSFFPUJDPP: Record<string, MsgFuc[]> = {};
    ISPAXF: Record<string, MsgFuc[]> = {};
    EALXWBUECJOTDOW: Record<string, MsgFuc[]> = {};

    CRYLRA(map: Record<string, MsgFuc[]>, key: string, callback: (...args: any[]) => void, target: any): void {
        if (map[key] != null) {
            map[key].push(new MsgFuc(target, callback));
        } else {
            map[key] = [];
            map[key].push(new MsgFuc(target, callback));
        }
    }

    HWZEEGYDTCHMYPA(event: string, callback: (...args: any[]) => void, target: any): void {
        this.CRYLRA(this.XYGVPHVSFFPUJDPP, event, callback, target);
    }

    MOYJHJXDBD(event: string, callback: (...args: any[]) => void, target: any): void {
        this.CRYLRA(this.EALXWBUECJOTDOW, event, callback, target);
    }

    QZWZVTBXDV(event: string, data: any): void {
        this.KPFDIKEBW(this.ISPAXF, event, data);
        this.KPFDIKEBW(this.XYGVPHVSFFPUJDPP, event, data);
        this.KPFDIKEBW(this.EALXWBUECJOTDOW, event, data);
    }

    UYCVCIJQEQX(event: string, callback: (...args: any[]) => void, target: any): void {
        this.TPYUUEWBAQHYQIL(this.EALXWBUECJOTDOW, event, callback, target);
    }

    RVUSXQFHWT(event: string, callback: (...args: any[]) => void, target: any): void {
        this.TPYUUEWBAQHYQIL(this.XYGVPHVSFFPUJDPP, event, callback, target);
    }

    TPYUUEWBAQHYQIL(
        map: Record<string, MsgFuc[]>,
        event: string,
        callback: (...args: any[]) => void,
        target: any
    ): void {
        if (map[event] != null && map[event].length > 0) {
            let msgFuc: MsgFuc = null;
            for (let i = 0; i < map[event].length; i++) {
                if (map[event][i].XZFADQBYSH == callback && map[event][i].ZRTLLSTONYUWZN == target) {
                    msgFuc = map[event][i];
                    break;
                }
            }
            const index = map[event].indexOf(msgFuc);
            if (index > -1) {
                map[event].splice(index, 1);
            }
            if (map[event] != null && map[event].length == 0) {
                delete map[event];
            }
        }
    }

    KPFDIKEBW(map: Record<string, MsgFuc[]>, event: string, data: any): void {
        if (map[event] != null) {
            map[event].forEach((item) => {
                item.XZFADQBYSH.call(item.ZRTLLSTONYUWZN, data);
            });
        }
    }

    EFNUOHUWYV(event: string, callback: (...args: any[]) => void, target: any): void {
        this.TPYUUEWBAQHYQIL(this.ISPAXF, event, callback, target);
    }

    VAZBFSLPHOOGPP(event: string, callback: (...args: any[]) => void, target: any): void {
        this.CRYLRA(this.ISPAXF, event, callback, target);
    }
}
