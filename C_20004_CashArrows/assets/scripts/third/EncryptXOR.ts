import Singleton from "./Singleton";

export default class EncryptXOR extends Singleton {
    public key: number = 15;

    public encrypt(text: string): string {
        return this.textFormat(text);
    }

    public decrypt(text: string): string {
        return this.textFormat(text);
    }

    private textFormat(text: string): string {
        const codes = this.encode(text);
        codes.forEach((code, index) => {
            codes[index] = code ^ this.key;
        });
        return this.decode(codes);
    }

    private encode(text: string): number[] {
        return unescape(encodeURIComponent(text))
            .split("")
            .map((ch) => ch.charCodeAt(0));
    }

    private decode(codes: number[]): string {
        const chars = codes.map((code) => String.fromCharCode(code));
        return decodeURIComponent(escape(chars.join("")));
    }
}