export default class ColorUtil {
    static isHex(value) {
        return /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(value);
    }

    static rgbaToHex(color) {
        const r = (256 | color.r).toString(16).slice(1);
        const g = (256 | color.g).toString(16).slice(1);
        const b = (256 | color.b).toString(16).slice(1);
        return null == color.a ? ("#" + r + g + b).toUpperCase() : ("#" + r + g + b + (256 | color.a).toString(16).slice(1)).toUpperCase();
    }

    static hexToRgba(hex) {
        return ColorUtil.isHex(hex) ? {
            r: parseInt(hex.substr(1, 2), 16) || 0,
            g: parseInt(hex.substr(3, 2), 16) || 0,
            b: parseInt(hex.substr(5, 2), 16) || 0,
            a: parseInt(hex.substr(7, 2), 16) || 255
        } : null;
    }
}
