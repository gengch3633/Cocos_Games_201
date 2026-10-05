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
    gan_move_roll_multy_base: 0.0006,
    gan_move_roll_multy_aim_base: 0.0013,
    gan_move_roll_multy: 0.0006,
    gan_move_roll_multy_aim: 0.0013,
    debug_alpha: false,
    debug_physicDraw: false,
    ID_WHITEBALL: 100,
    nowgame: {} as Record<string, unknown>,
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
        levelConfig: [
            {
                level: 1,
                exp_need: 100,
                title: "1",
            },
        ],
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
        return cc.sys.localStorage.getItem(GlobalConfig.appName + "_sound") != "0";
    },

    sound_toggle_set(value: boolean): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_sound", value ? "1" : "0");
    },

    music_toggle_get(): boolean {
        const value = cc.sys.localStorage.getItem(GlobalConfig.appName + "_music");
        console.log("music_toggle", value, GlobalConfig.appName + "_music");
        return value != "0";
    },

    music_toggle_set(value: boolean): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_music", value ? "1" : "0");
    },

    sens_toggle_get(): string {
        let value = cc.sys.localStorage.getItem(GlobalConfig.appName + "_sens");
        if (!value) {
            value = "0";
        }
        return value;
    },

    sens_toggle_set(value: string): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_sens", value);
    },

    shop_ball_get(): { arr: number[] } {
        let value: string | { arr: number[] } = cc.sys.localStorage.getItem(GlobalConfig.appName + "_shop_ball");
        console.log("shop_ball_get", value, GlobalConfig.appName + "_shop_ball");
        if (!value) {
            value = { arr: [] };
        }
        if (typeof value == "string") {
            value = JSON.parse(value);
        }
        if (typeof value != "object") {
            value = { arr: [] };
        }
        const result = value as { arr: number[] };
        if (!result.arr) {
            result.arr = [];
        }
        return result;
    },

    shop_ball_set(data: { arr: number[] }): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_shop_ball", JSON.stringify(data));
    },

    shop_ball_add(id: number): void {
        const data = GlobalConfig.shop_ball_get();
        const arr = data.arr || [];
        if (arr.indexOf(id) < 0) {
            arr.push(id);
            GlobalConfig.shop_ball_set(data);
        }
    },

    shop_ball_remove(id: number): void {
        const data = GlobalConfig.shop_ball_get();
        const arr = data.arr || [];
        const index = arr.indexOf(id);
        if (index >= 0) {
            arr.splice(index, 1);
            GlobalConfig.shop_ball_set(data);
        }
    },

    shop_color_get(): string {
        let value = cc.sys.localStorage.getItem(GlobalConfig.appName + "_shop_color");
        console.log("shop_color_get", value, GlobalConfig.appName + "_shop_color");
        if (!value) {
            value = "-1";
        }
        return value;
    },

    shop_color_set(value: string | number): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_shop_color", String(value));
    },

    shop_particle_get(): string {
        let value = cc.sys.localStorage.getItem(GlobalConfig.appName + "_shop_particle");
        console.log("shop_particle_get", value, GlobalConfig.appName + "_shop_particle");
        if (!value) {
            value = "-1";
        }
        return value;
    },

    shop_particle_set(value: string | number): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_shop_particle", String(value));
    },

    get_challenge_list(): { arr: unknown[] } {
        let value: string | { arr: unknown[] } = cc.sys.localStorage.getItem(GlobalConfig.appName + "_challenge_list");
        if (!value) {
            value = { arr: [] };
        }
        if (typeof value == "string") {
            value = JSON.parse(value);
        }
        if (typeof value != "object") {
            value = { arr: [] };
        }
        const result = value as { arr: unknown[] };
        if (!result.arr) {
            result.arr = [];
        }
        console.log("get_challenge_list", result, typeof result, GlobalConfig.appName + "_challenge_list");
        return result;
    },

    add_challenge_list(item: unknown): void {
        const data = GlobalConfig.get_challenge_list();
        const arr = data.arr || [];
        if (arr.indexOf(item) < 0) {
            arr.push(item);
            GlobalConfig.set_challenge_list(data);
        }
    },

    set_challenge_list(data: { arr: unknown[] }): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_challenge_list", JSON.stringify(data));
    },

    freeModeIdx_get(): string {
        let value = cc.sys.localStorage.getItem(GlobalConfig.appName + "_freeModeIdx");
        if (!value) {
            value = "-1";
        }
        return value;
    },

    freeModeIdx_set(value: string | number): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_freeModeIdx", String(value));
    },

    freeModeLastBest_get(): { idx: number; ganNum: number } {
        const value = cc.sys.localStorage.getItem(GlobalConfig.appName + "_freeModeLast");
        return value
            ? JSON.parse(value)
            : {
                  idx: -1,
                  ganNum: 0,
              };
    },

    freeModeLastBest_set(data: { idx: number; ganNum: number }): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_freeModeLast", JSON.stringify(data));
    },

    format_todayStr(): string {
        const date = new Date();
        return date.getFullYear() + "_" + date.getMonth() + "_" + date.getDate();
    },

    rewardDay_get(): string {
        let value = cc.sys.localStorage.getItem(GlobalConfig.appName + "_rewardDay");
        if (!value) {
            value = "-1";
        }
        return value;
    },

    rewardDay_set(): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_rewardDay", GlobalConfig.format_todayStr());
    },

    rewardTimes_get(): number {
        let value = Number(cc.sys.localStorage.getItem(GlobalConfig.appName + "_rewardTimes"));
        if (!value) {
            value = 0;
        }
        if (GlobalConfig.format_todayStr() != GlobalConfig.rewardDay_get()) {
            value = 0;
            GlobalConfig.rewardDay_set();
            GlobalConfig.rewardTimes_set(value);
        }
        return value;
    },

    rewardTimes_set(value: number): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_rewardTimes", String(value));
    },

    shareRewardDay_get(): string {
        let value = cc.sys.localStorage.getItem(GlobalConfig.appName + "_shareRewardDay");
        if (!value) {
            value = "-1";
        }
        return value;
    },

    shareRewardDay_set(): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_shareRewardDay", GlobalConfig.format_todayStr());
    },

    shareRewardTimes_get(): number {
        let value = Number(cc.sys.localStorage.getItem(GlobalConfig.appName + "_shareReward"));
        if (!value) {
            value = 0;
        }
        if (GlobalConfig.format_todayStr() != GlobalConfig.shareRewardDay_get()) {
            value = 0;
            GlobalConfig.shareRewardDay_set();
            GlobalConfig.shareRewardTimes_set(value);
        }
        return value;
    },

    shareRewardTimes_set(value: number): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_shareReward", String(value));
    },

    anonymous_openid_get(): string {
        let value = cc.sys.localStorage.getItem(GlobalConfig.appName + "_anonymous_openid");
        if (!value) {
            value = "-1";
        }
        return value;
    },

    anonymous_openid_set(value: string): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_anonymous_openid", value);
    },

    unlogin_obj_get(): { coin: number; [key: string]: unknown } {
        const value = cc.sys.localStorage.getItem(GlobalConfig.appName + "_unlogin_obj");
        return value ? JSON.parse(value) : { coin: 0 };
    },

    unlogin_obj_set(data: { coin: number; [key: string]: unknown }): void {
        cc.sys.localStorage.setItem(GlobalConfig.appName + "_unlogin_obj", JSON.stringify(data));
    },

    unlogin_obj_setKV(key: string, value: unknown): void {
        const data = GlobalConfig.unlogin_obj_get();
        data[key] = value;
        GlobalConfig.unlogin_obj_set(data);
    },

    unlogin_obj_clear(): void {
        GlobalConfig.unlogin_obj_set({ coin: 0 });
    },
};

export = GlobalConfig;
