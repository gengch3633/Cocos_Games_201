import Singleton from "./Singleton";

export default class EncryptXOR extends Singleton {
    key = 15;

    encrypt(text: string): string {
        return this.textFormat(text);
    }

    decrypt(text: string): string {
        return this.textFormat(text);
    }

    textFormat(text: string): string {
        const encoded = this.encode(text);
        encoded.forEach((value, index) => {
            encoded[index] = value ^ this.key;
        });
        return this.decode(encoded);
    }

    encode(text: string): number[] {
        return unescape(encodeURIComponent(text)).split("").map((char) => char.charCodeAt(0));
    }

    decode(bytes: number[]): string {
        const chars = bytes.map((value) => String.fromCharCode(value));
        return decodeURIComponent(escape(chars.join("")));
    }
}
