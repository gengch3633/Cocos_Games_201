declare const i18n: any;

export default class TimeUtils {
    static getTimestamp() {
        return new Date().getTime();
    }

    static getDateString() {
        const e = new Date();
        const t = e.getHours();
        const o = e.getMinutes();
        return (t < 10 ? "0" + t : t) + ":" + (o < 10 ? "0" + o : o);
    }

    static secondsToHMS(e, t) {
        if (undefined === t) {
            t = true;
        }
        let o;
        let n;
        if (e < 60 && t) return "00:00:" + ((n = e) < 10 ? "0" + n : n);
        if (e < 60 && !t) return "00:" + ((n = e) < 10 ? "0" + n : n);
        if (!t && e < 3600) return ((o = Math.floor(e / 60)) < 10 ? "0" + o : o) + ":" + ((n = e % 60) < 10 ? "0" + n : n);
        if (e < 3600) return "00:" + ((o = Math.floor(e / 60)) < 10 ? "0" + o : o) + ":" + ((n = e % 60) < 10 ? "0" + n : n);
        const i = Math.floor(e / 3600);
        return (i < 10 ? "0" + i : i) + ":" + ((o = Math.floor(e % 3600 / 60)) < 10 ? "0" + o : o) + ":" + ((n = e % 60) < 10 ? "0" + n : n);
    }

    static getUTCTime() {
        const e = new Date();
        const t = new Date(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds()).getTime();
        return Math.floor(t / 1e3);
    }

    static getTimeinSeconds() {
        return Math.floor(+new Date() / 1e3);
    }

    static getTargetTimestamp(e, t, o) {
        if (undefined === e) {
            e = 0;
        }
        if (undefined === t) {
            t = 0;
        }
        if (undefined === o) {
            o = 0;
        }
        const n = new Date(new Date().toLocaleDateString()).getTime();
        return new Date(n + 1e3 * (3600 * e + 60 * t + o)).getTime();
    }

    static msToHMS(e, t, o) {
        if (undefined === t) {
            t = ":";
        }
        if (undefined === o) {
            o = true;
        }
        const n = Math.floor(e / 36e5);
        const i = Math.floor((e - 36e5 * n) / 6e4);
        const a = Math.floor((e - 36e5 * n - 6e4 * i) / 1e3);
        return (0 !== n || o ? n.toString().padStart(2, "0") + ":" : "") + i.toString().padStart(2, "0") + t + a.toString().padStart(2, "0");
    }

    static getTimeInMilliseconds() {
        return +new Date();
    }

    static getDate() {
        return new Date().toLocaleDateString();
    }

    static formatSeconds(e) {
        let t = Math.floor(e);
        let o = 0;
        let n = 0;
        let i = 0;
        if (t > 60) {
            o = Math.floor(t / 60);
            t = Math.floor(t % 60);
            if (o > 60) {
                n = Math.floor(o / 60);
                o = Math.floor(o % 60);
                if (n > 24) {
                    i = Math.floor(n / 24);
                    n = Math.floor(n % 24);
                }
            }
        }
        let a = "";
        t > 0 && (a = " " + Math.floor(t) + " " + i18n.t("task_daily_word_10"));
        o > 0 && (a = " " + Math.floor(o) + " " + i18n.t("task_daily_word_9") + a);
        n > 0 && (a = " " + Math.floor(n) + " " + i18n.t("task_daily_word_8") + a);
        i > 0 && (a = " " + Math.floor(i) + " " + i18n.t("day_name") + a);
        return a;
    }
}
