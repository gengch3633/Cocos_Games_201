export default class TimeUtils {
    static getTimestamp(): number {
        return new Date().getTime();
    }

    static getDateString(): string {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        return (hours < 10 ? "0" + hours : String(hours)) + ":" + (minutes < 10 ? "0" + minutes : String(minutes));
    }

    static secondsToHMS(seconds: number, showHours = true): string {
        if (seconds < 60 && showHours) {
            const s = seconds;
            return "00:00:" + (s < 10 ? "0" + s : s);
        }
        if (seconds < 60 && !showHours) {
            const s = seconds;
            return "00:" + (s < 10 ? "0" + s : s);
        }
        if (!showHours && seconds < 3600) {
            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
        }
        if (seconds < 3600) {
            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            return "00:" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
        }
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
    }

    static getUTCTime(): number {
        const now = new Date();
        const utc = new Date(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds(),
        ).getTime();
        return Math.floor(utc / 1000);
    }

    static getTimeinSeconds(): number {
        return Math.floor(+new Date() / 1000);
    }

    static getTargetTimestamp(hours = 0, minutes = 0, seconds = 0): number {
        const today = new Date(new Date().toLocaleDateString()).getTime();
        return new Date(today + 1000 * (3600 * hours + 60 * minutes + seconds)).getTime();
    }

    static msToHMS(ms: number, separator = ":", showHours = true): string {
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms - 3600000 * h) / 60000);
        const s = Math.floor((ms - 3600000 * h - 60000 * m) / 1000);
        return (h !== 0 || showHours ? h.toString().padStart(2, "0") + ":" : "") + m.toString().padStart(2, "0") + separator + s.toString().padStart(2, "0");
    }

    static getTimeInMilliseconds(): number {
        return +new Date();
    }

    static getDate(): string {
        return new Date().toLocaleDateString();
    }

    static formatSeconds(seconds: number): string {
        let sec = Math.floor(seconds);
        let minutes = 0;
        let hours = 0;
        let days = 0;
        if (sec > 60) {
            minutes = Math.floor(sec / 60);
            sec = Math.floor(sec % 60);
            if (minutes > 60) {
                hours = Math.floor(minutes / 60);
                minutes = Math.floor(minutes % 60);
                if (hours > 24) {
                    days = Math.floor(hours / 24);
                    hours = Math.floor(hours % 24);
                }
            }
        }
        let result = "";
        if (sec > 0) {
            result = " " + Math.floor(sec) + " " + i18n.t("task_daily_word_10");
        }
        if (minutes > 0) {
            result = " " + Math.floor(minutes) + " " + i18n.t("task_daily_word_9") + result;
        }
        if (hours > 0) {
            result = " " + Math.floor(hours) + " " + i18n.t("task_daily_word_8") + result;
        }
        if (days > 0) {
            result = " " + Math.floor(days) + " " + i18n.t("day_name") + result;
        }
        return result;
    }
}
