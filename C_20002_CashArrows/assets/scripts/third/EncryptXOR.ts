import Singleton from "./Singleton";

export default class EncryptXOR extends Singleton {
    key = 15;

    encrypt(text: string) {
        return this.textFormat(text);
    }

    decrypt(text: string) {
        return this.textFormat(text);
    }

    textFormat(text: string) {
        const self = this;
        const bytes = this.encode(text);
        bytes.forEach(function (value: number, index: number) {
            bytes[index] = value ^ self.key;
        });
        return this.decode(bytes);
    }

    encode(text: string) {
        return unescape(encodeURIComponent(text)).split("").map(function (ch: string) {
            return ch.charCodeAt(0);
        });
    }

    decode(bytes: number[]) {
        const chars = bytes.map(function (value: number) {
            return String.fromCharCode(value);
        });
        return decodeURIComponent(escape(chars.join("")));
    }
}
