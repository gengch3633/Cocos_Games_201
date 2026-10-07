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

    append(name: string, value: string): void {
        this._result += this._boundary + "\r\n";
        this._result += 'Content-Disposition: form-data; name="' + name + '"\r\n\r\n';
        this._result += value + "\r\n";
    }

    arrayBuffer(): ArrayBuffer {
        this._formResult = this._result + this._end_boundary;
        const bytes: number[] = [];
        if (!SystemDataSys.encrypt) {
            this._formResult = this.ch2Unicdoe(this._formResult);
        }
        for (let i = 0; i < this._formResult.length; i++) {
            bytes.push(this._formResult.charCodeAt(i));
        }
        return new Uint8Array(bytes).buffer;
    }

    ch2Unicdoe(str: string): string {
        if (!str) {
            return "";
        }
        let result = "";
        const chinese = new RegExp("[\u4e00-\u9fa5]+");
        const special = new RegExp("[`~！@#￥……&*（）——|，、？]");
        for (let i = 0; i < str.length; i++) {
            const char = str.charAt(i);
            if (chinese.test(char)) {
                result += "%u" + char.charCodeAt(0).toString(16);
            } else if (special.test(char)) {
                const hex = char.charCodeAt(0).toString(16);
                result += "%u" + "0000".substring(0, 4 - hex.length) + hex;
            } else {
                result += char;
            }
        }
        return result;
    }
}
