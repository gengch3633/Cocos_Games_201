const GlobalConfig = {
    appID: 1001,
    appName: "ball",
    ball_radius: 18.7,
    Editor_MaxBallSize: 20,
    PowerMax: 98,
    PowerMin: 1,
    BallAimLineLen: 90,
    BallRoleAngle: 30,
    gan_move_rad_multy_aim_base: 18,
    gan_move_rad_multy_normal_base: 3,
    gan_move_rad_multy_aim: 10,
    gan_move_rad_multy_normal: 2,
    gan_move_roll_multy_base: 6e-4,
    gan_move_roll_multy_aim_base: 13e-5,
    gan_move_roll_multy: 6e-4,
    gan_move_roll_multy_aim: 13e-5,
    debug_alpha: false,
    debug_physicDraw: false,
    ID_WHITEBALL: 100,
    nowgame: {},
    testDBInLocalhost: false,
    testDBInALI: false,
    windowsSave: true,
    setting: {
        sound_effect: true,
        music_effect: true,
        config_wxSyncToMongo: true,
        platform_wx: {
            db_url: "http://127.0.0.1:8081/",
            platform_str: "wx",
        },
        platform_tt: {
            db_url: "http://127.0.0.1:8081/",
            platform_str: "tt",
        },
        platform_other: {
            db_url: "http://127.0.0.1:8081/",
            platform_str: "wx",
        },
        platform_alitestball: {
            db_url: "http://127.0.0.1:8081/",
            platform_str: "alitestball",
        },
        platform_localhost: {
            db_url: "http://127.0.0.1:8081/",
            platform_str: "localhost",
        },
    },
    staticConfig: {
        levelConfig: [{ level: 1, exp_need: 100, title: "1" }],
        titleConfig: {},
    },
    colors: {
        gray_hex: "#999999",
        black_hex: "#323232",
        blue_hex: "#00C8FF",
        green_hex: "#00AA8C",
        red_hex: "#AA008C",
        yellow_hex: "#FFC800",
        bgColor_hex: "#DEDEDE",
        orange_hex: "ff6a6a",
    },

    sound_toggle_get(): boolean {
        return 0 != cc.sys.localStorage.getItem(GlobalConfig.appName + "_sound");
    },

    sound_toggle_set(value: boolean): void {
        const t = value ? 1 : 0;
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_sound", t);
    },

    music_toggle_get(): boolean {
        const e = cc.sys.localStorage.getItem(GlobalConfig.appName + "_music");
        console.log("music_toggle", e, GlobalConfig.appName + "_music");
        return 0 != e;
    },

    music_toggle_set(value: boolean): void {
        const t = value ? 1 : 0;
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_music", t);
    },

    sens_toggle_get(): string | number {
        let e = cc.sys.localStorage.getItem(GlobalConfig.appName + "_sens");
        if (!e) {
            e = 0;
        }
        return e;
    },

    sens_toggle_set(value: string | number): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_sens", value);
    },

    shop_ball_get(): { arr: any[] } {
        let e = cc.sys.localStorage.getItem(GlobalConfig.appName + "_shop_ball");
        console.log("shop_ball_get", e, GlobalConfig.appName + "_shop_ball");
        if (!e) {
            e = { arr: [] };
        }
        if (typeof e == "string") {
            e = JSON.parse(e);
        }
        if (typeof e != "object") {
            e = { arr: [] };
        }
        if (!e.arr) {
            e.arr = [];
        }
        return e;
    },

    shop_ball_set(value: any): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_shop_ball", JSON.stringify(value));
    },

    shop_ball_add(value: any): void {
        const t = GlobalConfig.shop_ball_get();
        const n = t.arr || [];
        if (n.indexOf(value) < 0) {
            n.push(value);
            GlobalConfig.shop_ball_set(t);
        }
    },

    shop_ball_remove(value: any): void {
        const t = GlobalConfig.shop_ball_get();
        const n = t.arr || [];
        const i = n.indexOf(value);
        if (i >= 0) {
            n.splice(i, 1);
            GlobalConfig.shop_ball_set(t);
        }
    },

    shop_color_get(): string | number {
        let e = cc.sys.localStorage.getItem(GlobalConfig.appName + "_shop_color");
        console.log("shop_color_get", e, GlobalConfig.appName + "_shop_color");
        if (!e) {
            e = -1;
        }
        return e;
    },

    shop_color_set(value: string | number): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_shop_color", value);
    },

    shop_particle_get(): string | number {
        let e = cc.sys.localStorage.getItem(GlobalConfig.appName + "_shop_particle");
        console.log("shop_particle_get", e, GlobalConfig.appName + "_shop_particle");
        if (!e) {
            e = -1;
        }
        return e;
    },

    shop_particle_set(value: string | number): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_shop_particle", value);
    },

    get_challenge_list(): { arr: any[] } {
        let e = cc.sys.localStorage.getItem(GlobalConfig.appName + "_challenge_list");
        if (!e) {
            e = { arr: [] };
        }
        if (typeof e == "string") {
            e = JSON.parse(e);
        }
        if (typeof e != "object") {
            e = { arr: [] };
        }
        if (!e.arr) {
            e.arr = [];
        }
        console.log("get_challenge_list", e, typeof e, GlobalConfig.appName + "_challenge_list");
        return e;
    },

    add_challenge_list(value: any): void {
        const t = GlobalConfig.get_challenge_list();
        const n = t.arr || [];
        if (n.indexOf(value) < 0) {
            n.push(value);
            GlobalConfig.set_challenge_list(t);
        }
    },

    set_challenge_list(value: any): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_challenge_list", JSON.stringify(value));
    },

    freeModeIdx_get(): string | number {
        let e = cc.sys.localStorage.getItem(GlobalConfig.appName + "_freeModeIdx");
        if (!e) {
            e = -1;
        }
        return e;
    },

    freeModeIdx_set(value: string | number): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_freeModeIdx", value);
    },

    freeModeLastBest_get(): { idx: number; ganNum: number } {
        const e = cc.sys.localStorage.getItem(GlobalConfig.appName + "_freeModeLast");
        return e ? JSON.parse(e) : { idx: -1, ganNum: 0 };
    },

    freeModeLastBest_set(value: { idx: number; ganNum: number }): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_freeModeLast", JSON.stringify(value));
    },

    format_todayStr(): string {
        const e = new Date();
        return e.getFullYear() + "_" + e.getMonth() + "_" + e.getDate();
    },

    rewardDay_get(): string | number {
        let e = cc.sys.localStorage.getItem(GlobalConfig.appName + "_rewardDay");
        if (!e) {
            e = -1;
        }
        return e;
    },

    rewardDay_set(): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_rewardDay", GlobalConfig.format_todayStr());
    },

    rewardTimes_get(): string | number {
        let e = cc.sys.localStorage.getItem(GlobalConfig.appName + "_rewardTimes");
        if (!e) {
            e = 0;
        }
        if (GlobalConfig.format_todayStr() != GlobalConfig.rewardDay_get()) {
            e = 0;
            GlobalConfig.rewardDay_set();
            GlobalConfig.rewardTimes_set(e);
        }
        return e;
    },

    rewardTimes_set(value: string | number): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_rewardTimes", value);
    },

    shareRewardDay_get(): string | number {
        let e = cc.sys.localStorage.getItem(GlobalConfig.appName + "_shareRewardDay");
        if (!e) {
            e = -1;
        }
        return e;
    },

    shareRewardDay_set(): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_shareRewardDay", GlobalConfig.format_todayStr());
    },

    shareRewardTimes_get(): string | number {
        let e = cc.sys.localStorage.getItem(GlobalConfig.appName + "_shareReward");
        if (!e) {
            e = 0;
        }
        if (GlobalConfig.format_todayStr() != GlobalConfig.shareRewardDay_get()) {
            e = 0;
            GlobalConfig.shareRewardDay_set();
            GlobalConfig.shareRewardTimes_set(e);
        }
        return e;
    },

    shareRewardTimes_set(value: string | number): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_shareReward", value);
    },

    anonymous_openid_get(): string | number {
        let e = cc.sys.localStorage.getItem(GlobalConfig.appName + "_anonymous_openid");
        if (!e) {
            e = -1;
        }
        return e;
    },

    anonymous_openid_set(value: string | number): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_anonymous_openid", value);
    },

    unlogin_obj_get(): { coin: number; [key: string]: any } {
        const e = cc.sys.localStorage.getItem(GlobalConfig.appName + "_unlogin_obj");
        return e ? JSON.parse(e) : { coin: 0 };
    },

    unlogin_obj_set(value: any): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_unlogin_obj", JSON.stringify(value));
    },

    unlogin_obj_setKV(key: string, value: any): void {
        const n = GlobalConfig.unlogin_obj_get();
        n[key] = value;
        GlobalConfig.unlogin_obj_set(n);
    },

    unlogin_obj_clear(): void {
        GlobalConfig.unlogin_obj_set({ coin: 0 });
    },
};

export default GlobalConfig;
