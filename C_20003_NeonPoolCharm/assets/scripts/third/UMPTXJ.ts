import { LZFAHNEP } from "./LZFAHNEP";

export class UMPTXJ extends LZFAHNEP {
    XYGVPHVSFFPUJDPP = {};

    ISPAXF = {};

    EALXWBUECJOTDOW = {};

    CRYLRA(e, t, o, n) {
        if (null != e[t]) e[t].push(new MsgFuc(n, o));else {
            e[t] = [];
            e[t].push(new MsgFuc(n, o));
        }
    }

    HWZEEGYDTCHMYPA(e, t, o) {
        this.CRYLRA(this.XYGVPHVSFFPUJDPP, e, t, o);
    }

    MOYJHJXDBD(e, t, o) {
        this.CRYLRA(this.EALXWBUECJOTDOW, e, t, o);
    }

    QZWZVTBXDV(e, t) {
        this.KPFDIKEBW(this.ISPAXF, e, t);
        this.KPFDIKEBW(this.XYGVPHVSFFPUJDPP, e, t);
        this.KPFDIKEBW(this.EALXWBUECJOTDOW, e, t);
    }

    UYCVCIJQEQX(e, t, o) {
        this.TPYUUEWBAQHYQIL(this.EALXWBUECJOTDOW, e, t, o);
    }

    RVUSXQFHWT(e, t, o) {
        this.TPYUUEWBAQHYQIL(this.XYGVPHVSFFPUJDPP, e, t, o);
    }

    TPYUUEWBAQHYQIL(e, t, o, n) {
        if (null != e[t] && e[t].length > 0) {
            let i = null;
            for (let a = 0; a < e[t].length; a++) if (e[t][a].XZFADQBYSH == o && e[t][a].ZRTLLSTONYUWZN == n) {
                i = e[t][a];
                break;
            }
            const r = e[t].indexOf(i);
            r > -1 && e[t].splice(r, 1);
            null != e[t] && 0 == e[t].length && delete e[t];
        }
    }

    KPFDIKEBW(e, t, o) {
        null != e[t] && e[t].forEach(function (e) {
            e.XZFADQBYSH.call(e.ZRTLLSTONYUWZN, o);
        });
    }

    EFNUOHUWYV(e, t, o) {
        this.TPYUUEWBAQHYQIL(this.ISPAXF, e, t, o);
    }

    VAZBFSLPHOOGPP(e, t, o) {
        this.CRYLRA(this.ISPAXF, e, t, o);
    }
}

export function MsgFuc(e, t) {
    this.ZRTLLSTONYUWZN = e;
    this.XZFADQBYSH = t;
    this.XZFADQBYSH.bind(e);
}
