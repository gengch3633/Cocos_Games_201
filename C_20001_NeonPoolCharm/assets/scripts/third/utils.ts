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

export function array_contains(arr: unknown[], value: unknown): boolean {
    for (const key in arr) {
        if (arr[key] == value) {
            return true;
        }
    }
    return false;
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
                const isNested = typeof (value as Record<string, unknown>)[key] == "object" && (value as Record<string, unknown>)[key] != null;
                const indentStr = getIndentStr(level + 1);
                output += isArray && isNested ? "" : indentStr;
                output += isArray ? "" : '"' + key + '": ' + (isNested && !leftBracesInSameLine ? "\n" : "");
                output += !isNested || (isNested && leftBracesInSameLine && !isArray) ? "" : indentStr;
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
