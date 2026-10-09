import SystemDataSys from "./SystemDataSys";

export default class FormData {
    _boundary_key = "AaB03x";
    _boundary = "";
    _end_boundary = "";
    _result = "";
    _formResult = "";

    constructor() {
        this._boundary = "--" + this._boundary_key;
        this._end_boundary = this._boundary + "--";
        this._result = "";
    }

    append(e, t) {
        this._result += this._boundary + "\r\n";
        this._result += 'Content-Disposition: form-data; name="' + e + '"\r\n\r\n';
        this._result += t + "\r\n";
    }

    arrayBuffer() {
        this._formResult = this._result + this._end_boundary;
        const e = [];
        SystemDataSys.encrypt || (this._formResult = this.ch2Unicdoe(this._formResult));
        for (let t = 0; t < this._formResult.length; t++) e.push(this._formResult.charCodeAt(t));
        return new Uint8Array(e).buffer;
    }

    ch2Unicdoe(e) {
        if (!e) return "";
        let t = "";
        const o = new RegExp("[一-龥]+");
        const n = new RegExp("[`~！@#￥……&*（）——|，、？]");
        for (let i = 0; i < e.length; i++) {
            const a = e.charAt(i);
            if (o.test(a)) t += "%u" + a.charCodeAt(0).toString(16); else if (n.test(a)) {
                const r = a.charCodeAt(0).toString(16);
                t += "%u" + "0000".substring(0, 4 - r.length) + r;
            } else t += a;
        }
        return t;
    }
}
