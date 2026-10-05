export default class ColorUtil {
    static isHex(color: string): boolean {
        return /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(color);
    }

    static rgbaToHex(color: { r: number; g: number; b: number; a?: number }): string {
        const r = (256 | color.r).toString(16).slice(1);
        const g = (256 | color.g).toString(16).slice(1);
        const b = (256 | color.b).toString(16).slice(1);
        if (color.a == null) {
            return ("#" + r + g + b).toUpperCase();
        }
        return ("#" + r + g + b + (256 | color.a).toString(16).slice(1)).toUpperCase();
    }

    static hexToRgba(hex: string): { r: number; g: number; b: number; a: number } | null {
        if (!ColorUtil.isHex(hex)) {
            return null;
        }
        return {
            r: parseInt(hex.substr(1, 2), 16) || 0,
            g: parseInt(hex.substr(3, 2), 16) || 0,
            b: parseInt(hex.substr(5, 2), 16) || 0,
            a: parseInt(hex.substr(7, 2), 16) || 255,
        };
    }
}
