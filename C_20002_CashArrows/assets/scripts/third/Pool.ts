export default class Pool {
    lendArr: any[] = [];
    arr: any[] = [];
    validAction: (e: any) => boolean = function () {
        return !0;
    };
    createAction: (() => any) | undefined;
    _isInit: boolean = !1;
    _capacity: number = 0;

    constructor(e: number = 0) {
        this._capacity = e;
    }

    get isInit() {
        return this._isInit;
    }

    setCreateAction(e: () => any) {
        this.createAction = e;
        this._isInit = !0;
        return this;
    }

    setValidAction(e: (item: any) => boolean) {
        this.validAction = e;
        return this;
    }

    get size() {
        return this.arr.length;
    }

    get capacity() {
        return this._capacity;
    }

    set capacity(e: number) {
        this._capacity = e;
        this.resize();
    }

    resize() {
        var e, t = this.arr.length + this.lendArr.length - this._capacity;
        if (!(t <= 0)) for (var i = 0; i < t; i++) null !== (e = this.arr.shift()) && void 0 !== e || this.lendArr.shift();
    }

    get() {
        var e = null;
        if (this.arr.length > 0) e = this.arr.shift();
        else if (this._capacity <= 0 || this._capacity > this.lendArr.length) {
            if (!this.createAction) return null;
            e = this.createAction();
        } else {
            if (!(this.lendArr.length > 0)) return null;
            e = this.lendArr.shift();
        }
        return this.validAction(e) ? (this.lendArr.indexOf(e) < 0 && this.lendArr.push(e), e) : this.get();
    }

    put(e: any) {
        if (!this.validAction(e)) {
            var t = this.lendArr.indexOf(e);
            t >= 0 && this.lendArr.splice(t, 1);
            return !1;
        }
        if (this.arr.indexOf(e) >= 0) return !1;
        var i = this.lendArr.indexOf(e);
        i >= 0 && this.lendArr.splice(i, 1);
        this.arr.push(e);
        return !0;
    }

    getLendArr() {
        return this.lendArr;
    }

    recoverAllLends() {
        for (var e, t; (null === (e = this.lendArr) || void 0 === e ? void 0 : e.length) > 0;) {
            var i = null === (t = this.lendArr) || void 0 === t ? void 0 : t.shift();
            this.put(i);
        }
    }

    clear() {
        this.lendArr = [];
        this.arr = [];
    }
}
