export function isInteger(value: number): boolean {
    return typeof value == "number" && value % 1 == 0;
}

export function randomNum(min: number, max?: number): number {
    switch (arguments.length) {
        case 1:
            return parseInt(String(Math.random() * min + 1), 10);
        case 2:
            return parseInt(String(Math.random() * (max - min + 1) + min), 10);
        default:
            return 0;
    }
}

export function randomSameNum(total: number, count: number): number[] {
    const pool: number[] = [];
    for (let i = 0; i < total; i++) {
        pool.push(i);
    }
    const result: number[] = [];
    for (let i = 0; i < count; i++) {
        const index = randomNum(0, pool.length - 1);
        const picked = pool.splice(index, 1);
        result.push(picked[0]);
    }
    return result;
}

export function randomSameNum2(start: number, end: number, count: number): number[] {
    const pool: number[] = [];
    for (let i = start; i < end; i++) {
        pool.push(i);
    }
    const result: number[] = [];
    for (let i = 0; i < count; i++) {
        const index = randomNum(0, pool.length - 1);
        const picked = pool.splice(index, 1);
        result.push(picked[0]);
    }
    return result;
}

export function randomSameNumExclude(start: number, end: number, count: number, exclude: string): number[] {
    const pool: number[] = [];
    for (let i = start; i < end; i++) {
        if (i.toString() != exclude) {
            pool.push(i);
        }
    }
    const result: number[] = [];
    for (let i = 0; i < count; i++) {
        const index = randomNum(0, pool.length - 1);
        const picked = pool.splice(index, 1);
        result.push(picked[0]);
    }
    return result;
}

export function replace_spec(text: string): string {
    const pattern = new RegExp("[`~%!@#^''?！@#￥……&——‘”“？*()（），。、]");
    let result = "";
    for (let i = 0; i < text.length; i++) {
        result += text.substr(i, 1).replace(pattern, "");
    }
    return result;
}

export function array_contains(arr: unknown[], value: unknown): boolean {
    for (const key in arr) {
        if (arr[key] == value) {
            return true;
        }
    }
    return false;
}

export function strClamp(text: string, maxLen: number, suffix?: string): string {
    if (text.length <= 2 * maxLen) {
        return text;
    }
    suffix = suffix == null ? "..." : suffix;
    maxLen *= 2;
    const chars = (() => {
        const items: { v: number; pos: number }[] = [];
        let high = 0;
        for (let i = 0; i < text.length; ) {
            const pos = i;
            const code = text.charCodeAt(i++);
            if (code != 65039) {
                if (high) {
                    const value = 65536 + ((high - 55296) << 10) + (code - 56320);
                    items.push({ v: value, pos });
                    high = 0;
                } else if (code >= 55296 && code <= 56319) {
                    high = code;
                } else {
                    items.push({ v: code, pos });
                }
            }
        }
        return items;
    })();
    let byteCount = 0;
    let lastIndex = 0;
    for (let i = 0; i < chars.length; ++i) {
        let width = 1;
        if (chars[i].v >= 128) {
            width = 2;
        }
        if (byteCount + width > maxLen) {
            break;
        }
        lastIndex = i;
        byteCount += width;
    }
    if (chars.length - 1 == lastIndex) {
        return text;
    }
    const suffixWidth = suffix ? 1 : 0;
    return text.substring(0, chars[lastIndex - suffixWidth].pos + 1) + suffix;
}

export function formatDateTime(date: Date): string {
    const year = date.getFullYear();
    let month: string | number = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    let day: string | number = date.getDate();
    day = day < 10 ? "0" + day : day;
    let hours: string | number = date.getHours();
    hours = hours < 10 ? "0" + hours : hours;
    let minutes: string | number = date.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const seconds = date.getSeconds();
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
}

export function rotDir(vec: cc.Vec2, angle: number): cc.Vec2 {
    const x = vec.x * Math.cos(angle) - Math.pow(vec.y, Math.sin(angle));
    const y = vec.x * Math.sin(angle) + Math.pow(vec.y, Math.cos(angle));
    return cc.v2(x, y);
}

export function ArrayBufferToString2(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    return String.fromCharCode.apply(null, bytes as unknown as number[]);
}

export function Uint8ArrayToString(bytes: Uint8Array): string {
    let result = "";
    for (let i = 0; i < bytes.length; i++) {
        result += String.fromCharCode(bytes[i]);
    }
    return result;
}

export function stringToByteArray(text: string): Uint8Array | number[] {
    const bytes = new (typeof window !== "undefined" && window.Uint8Array ? Uint8Array : Array)(text.length);
    for (let i = 0, len = text.length; i < len; ++i) {
        bytes[i] = text.charCodeAt(i) & 255;
    }
    return bytes;
}

export function formatJSON(json: string, indent?: string, leftBracesInSameLine?: boolean): string {
    function getIndentStr(level: number): string {
        let str = "";
        for (let i = 0; i < level; i++) {
            str += indent || "  ";
        }
        return str;
    }

    function formatValue(value: unknown, level?: number): string {
        level = level == null ? 0 : level;
        let output = "";
        if (typeof value == "object" && value != null) {
            const isArray = value instanceof Array;
            let index = 0;
            output += (isArray ? "[" : "{") + "\n";
            for (const key in value as object) {
                output += index++ > 0 ? ",\n" : "";
                const nested =
                    typeof (value as Record<string, unknown>)[key] == "object" &&
                    (value as Record<string, unknown>)[key] != null;
                const indentStr = getIndentStr(level + 1);
                output += isArray && nested ? "" : indentStr;
                output += isArray ? "" : '"' + key + '": ' + (nested && !leftBracesInSameLine ? "\n" : "");
                output += !nested || (nested && leftBracesInSameLine && !isArray) ? "" : indentStr;
                output += formatValue((value as Record<string, unknown>)[key], level + 1);
            }
            output += "\n" + getIndentStr(level) + (isArray ? "]" : "}");
        } else {
            const quote = typeof value == "string" ? '"' : "";
            output += quote + value + quote;
        }
        return output;
    }

    return formatValue(eval("(" + json + ")"));
}

export function save(content: string, filename: string): void {
    const anchor = document.getElementById("SaveChrome") as HTMLAnchorElement;
    anchor.download = filename + ".txt";
    anchor.href = "data:text/csv;charset=utf-8," + content;
    anchor.click();
}

export function save2(data: unknown, filename = "sprite", suffix = "json"): void {
    const json = JSON.stringify(data);
    const formatted = formatJSON(json);
    const mimeTypes: Record<string, string> = {
        txt: "text/plain",
        png: "image/png",
        jpeg: "image/jpeg",
        jpg: "image/jpeg",
        json: "text/plain",
    };
    if (mimeTypes[suffix]) {
        const fullName = filename + "." + suffix;
        const blob = new Blob([formatted], { type: mimeTypes[suffix] });
        const msSaveOrOpenBlob = (window.navigator as any).msSaveOrOpenBlob;
        if (msSaveOrOpenBlob) {
            msSaveOrOpenBlob(blob, fullName);
        } else {
            const anchor = document.createElement("a");
            const url = URL.createObjectURL(blob);
            anchor.href = url;
            anchor.download = fullName;
            document.body.appendChild(anchor);
            anchor.click();
            setTimeout(() => {
                document.body.removeChild(anchor);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
        console.log("File has been saved:", fullName);
    } else {
        console.log("File not saved. Suffix not exist:", suffix);
    }
}

export function clone<T>(value: T): T {
    let result: T;
    if (typeof value == "object") {
        if (value === null) {
            result = null;
        } else if (value instanceof Array) {
            result = [] as T;
            for (let i = 0, len = value.length; i < len; i++) {
                (result as unknown[]).push(clone(value[i]));
            }
        } else {
            result = {} as T;
            for (const key in value as object) {
                (result as Record<string, unknown>)[key] = clone((value as Record<string, unknown>)[key]);
            }
        }
    } else {
        result = value;
    }
    return result;
}
