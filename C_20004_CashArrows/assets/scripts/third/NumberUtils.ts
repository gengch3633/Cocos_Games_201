import Random from "./Random";

export default class NumberUtils {
    public static ChinesWords: string[] = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

    public static ChinesUnit: string[] = ["", "十", "百", "千", "万", "亿", "十", "百", "千"];

    public static dayToDate(dayNum: number): { year: number; month: number; day: number } {
        const monthDays: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const year: number = Math.floor(dayNum / 365);
        const restDay: number = dayNum - 365 * year;
        let total: number = 0;
        let month: number = 0;
        for (let i = 0; i < monthDays.length; i++) {
            total += monthDays[i];
            if (total > restDay) {
                month = i;
                total -= monthDays[i];
                break;
            }
        }
        const result = {
            year: year,
            month: month + 1,
            day: restDay - total
        };
        if (result.day <= 0) {
            result.month = month;
            result.day = monthDays[month - 1];
        }
        return result;
    }

    public static isMonthLastDay(dayNum: number): boolean {
        const monthDays: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const date = NumberUtils.dayToDate(dayNum);
        return date.day >= monthDays[date.month - 1];
    }

    public static formatSeconds(seconds: number, format: string = "mm:ss"): string {
        seconds = Math.max(seconds, 0);
        const hour: string = Math.floor(seconds / 3600).toString();
        const minute: string = Math.floor(seconds / 60 % 60).toString();
        const second: string = Math.floor(seconds % 60).toString();
        const timeMap: { [key: string]: string } = {
            h: hour,
            hh: hour.padStart(2, "0"),
            m: minute,
            mm: minute.padStart(2, "0"),
            s: second,
            ss: second.padStart(2, "0")
        };
        return format.replace(/hh|h|mm|m|ss|s/g, (key: string): string => timeMap[key]);
    }

    public static formatTime(seconds: number, chinese: boolean = false): string {
        let result: string = "";
        let minutes: number = seconds / 60;
        minutes = parseInt(minutes.toString(), 10);
        let restSeconds: number = seconds - 60 * minutes;
        restSeconds = parseInt(restSeconds.toString(), 10);
        result += minutes > 9
            ? minutes + (chinese ? "分" : ":")
            : "0" + minutes + (chinese ? "分" : ":");
        result += restSeconds > 9 ? restSeconds.toString() : "0" + restSeconds;
        return result + (chinese ? "秒" : "");
    }

    public static getDay(): number {
        const time: number = new Date().getTime();
        return NumberUtils.timeStampToDay(time);
    }

    public static timeStampToDay(time: number, timezone: number = 8): number {
        time += 36e5 * timezone;
        return Math.floor(time / 1e3 / 60 / 60 / 24);
    }

    public static isNewDay(time: number = 0): boolean {
        const date: Date = new Date(time);
        const now: Date = new Date();
        return date.getFullYear() < now.getFullYear()
            || date.getMonth() < now.getMonth()
            || date.getDate() < now.getDate();
    }

    public static toFixed(value: number, digits: number = 1): number {
        if (typeof value !== "number") return 0;
        if (isNaN(value)) return 0;
        if (value === Infinity) return 0;
        if (digits <= 0) return Math.round(value);
        const pow: number = Math.pow(10, digits);
        return Math.round(value * pow) / pow;
    }

    public static split(total: number, count: number): number[] {
        if (count <= 0 || total <= 0) throw new Error("目标值和分割份数必须大于0");
        const result: number[] = new Array(count).fill(0);
        let used: number = 0;
        for (let i = 0; i < count - 1; i++) {
            const value: number = Random.floatRange(0.1, total - used - 0.1 * (count - i - 1));
            result[i] = value;
            used += value;
        }
        result[count - 1] = total - used;
        if (result[count - 1] <= 0) throw new Error("分割后的值不能小于等于0");
        return result;
    }

    public static formatChinesNum(num: number): string {
        if (NumberUtils.ChinesWords[num]) return NumberUtils.ChinesWords[num];
        if (num > 10 && num < 20) {
            const str: string = num.toString();
            const digit: string = str.substring(1, 2);
            return NumberUtils.ChinesUnit[1] + NumberUtils.ChinesWords[Number(digit)];
        }
        if (num > 10) {
            let result: string = "";
            const str: string = num.toString();
            for (let i = 0; i < str.length; ++i) {
                const digit: string = str.substring(i, i + 1);
                const unitIndex: number = str.length - i - 1;
                result += NumberUtils.ChinesWords[Number(digit)] + NumberUtils.ChinesUnit[unitIndex];
            }
            return result;
        }
        return "零";
    }

    public static UnitConversion(value: number, round: boolean = false): string {
        const absValue: number = Math.abs(value);
        const units: { count: number; unit: string }[] = [
            { count: Infinity, unit: "域" },
            { count: Infinity, unit: "古戈尔" },
            { count: Infinity, unit: "梵境" },
            { count: Infinity, unit: "太虚" },
            { count: Infinity, unit: "太初" },
            { count: Infinity, unit: "极乐" },
            { count: Infinity, unit: "轮回" },
            { count: Infinity, unit: "大成" },
            { count: Infinity, unit: "化一" },
            { count: Infinity, unit: "天巧" },
            { count: Infinity, unit: "天哭" },
            { count: Infinity, unit: "天暴" },
            { count: Infinity, unit: "天慧" },
            { count: Infinity, unit: "天牢" },
            { count: Infinity, unit: "天败" },
            { count: Infinity, unit: "天损" },
            { count: Infinity, unit: "天罪" },
            { count: Infinity, unit: "天平" },
            { count: 1e308, unit: "天剑" },
            { count: 1e304, unit: "天寿" },
            { count: 1e300, unit: "天退" },
            { count: 1e296, unit: "天究" },
            { count: 1e292, unit: "天微" },
            { count: 1e288, unit: "天煞" },
            { count: 1e284, unit: "天异" },
            { count: 1e280, unit: "天速" },
            { count: 1e276, unit: "天空" },
            { count: 1e272, unit: "天佑" },
            { count: 1e268, unit: "天暗" },
            { count: 1e264, unit: "天健" },
            { count: 1e260, unit: "天玄" },
            { count: 1e266, unit: "天伤" },
            { count: 1e262, unit: "天孤" },
            { count: 1e258, unit: "天满" },
            { count: 1e254, unit: "天富" },
            { count: 1e250, unit: "天贵" },
            { count: 1e246, unit: "天英" },
            { count: 1e242, unit: "天威" },
            { count: 1e238, unit: "天猛" },
            { count: 1e234, unit: "天雄" },
            { count: 1e230, unit: "天勇" },
            { count: 1e226, unit: "天闲" },
            { count: 1e222, unit: "天机" },
            { count: 1e218, unit: "天罡" },
            { count: 1e214, unit: "天魁" },
            { count: 1e210, unit: "兑" },
            { count: 1e216, unit: "艮" },
            { count: 1e212, unit: "离" },
            { count: 1e208, unit: "坎" },
            { count: 1e204, unit: "震" },
            { count: 1e200, unit: "巽" },
            { count: 1e196, unit: "坤" },
            { count: 1e192, unit: "乾" },
            { count: 1e188, unit: "亥" },
            { count: 1e184, unit: "戌" },
            { count: 1e180, unit: "酉" },
            { count: 1e176, unit: "申" },
            { count: 1e172, unit: "未" },
            { count: 1e168, unit: "午" },
            { count: 1e164, unit: "巳" },
            { count: 1e160, unit: "辰" },
            { count: 1e156, unit: "卯" },
            { count: 1e152, unit: "寅" },
            { count: 1e148, unit: "丑" },
            { count: 1e144, unit: "子" },
            { count: 1e140, unit: "魄" },
            { count: 1e136, unit: "髓" },
            { count: 1e132, unit: "砂" },
            { count: 1e128, unit: "晶" },
            { count: 1e124, unit: "玉" },
            { count: 1e120, unit: "灵" },
            { count: 1e116, unit: "坞" },
            { count: 1e112, unit: "漠" },
            { count: 1e108, unit: "瞬息" },
            { count: 1e104, unit: "净" },
            { count: 1e100, unit: "仄" },
            { count: 1e96, unit: "虚" },
            { count: 1e92, unit: "须臾" },
            { count: 1e88, unit: "无间" },
            { count: 1e84, unit: "弹指" },
            { count: 1e80, unit: "无极" },
            { count: 1e76, unit: "天数" },
            { count: 1e72, unit: "大数" },
            { count: 1e68, unit: "无量" },
            { count: 1e64, unit: "不思议" },
            { count: 1e60, unit: "那由他" },
            { count: 1e56, unit: "阿僧祇" },
            { count: 1e52, unit: "恒河沙" },
            { count: 1e48, unit: "极" },
            { count: 1e44, unit: "载" },
            { count: 1e40, unit: "正" },
            { count: 1e36, unit: "涧" },
            { count: 1e32, unit: "沟" },
            { count: 1e28, unit: "穰" },
            { count: 1e24, unit: "秭" },
            { count: 1e20, unit: "垓" },
            { count: 1e16, unit: "京" },
            { count: 1e12, unit: "兆" },
            { count: 1e8, unit: "亿" },
            { count: 1e4, unit: "万" }
        ].sort((a: { count: number; unit: string }, b: { count: number; unit: string }): number => b.count - a.count)
            .find((item: { count: number; unit: string }): boolean => absValue >= item.count);

        if (matched) {
            const count: number = matched.count;
            const unit: string = matched.unit;
            const text: string = absValue % count === 0
                ? (absValue / count).toString()
                : (absValue / count).toFixed(2);
            return round
                ? "" + Math.round(absValue / count) + unit
                : (value > 0 ? "" : "-") + text + unit;
        }
        return NumberUtils.decimalPlaces(value) > 2 ? value.toFixed(2) : value.toString();
    }

    public static decimalPlaces(value: number): number {
        const str: string = value.toString();
        return str.includes(".") ? str.split(".")[1].length : 0;
    }
}