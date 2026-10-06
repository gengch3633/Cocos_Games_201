import UserArchive from "./UserArchive";

export default class UserData extends UserArchive {
    bool_firstdie: boolean = true;
    sidebar: boolean = false;
    level: number = 1;
    music: boolean = true;
    sound: boolean = true;
    shake: boolean = true;
    dragSpeed: number = .5;
    colorMode: boolean = false;
    userID: any = null;
    firstVersion: string = "";
    num_tipscards: number = 0;
    openId: string = "";
    yid: string = "";
    cash_balance: number = 0;
    hint_prop_count: number = 0;
    guideline_prop_count: number = 0;
    bubble_balance: string = "";
    user_level: number = 1;
    recentRandomLevels: any[] = [];

    constructor() {
        super("UserData");
    }

    init() {
    }

    static getUserId(e: number) {
        var t = "1234567890abcdefghijklmnopqrstuvwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        Date.now();
        for (var i = [], n = 0; n < e; n++) i.push(t[Math.floor(Math.random() * t.length)]);
        i.sort(function() {
            return Math.random() > .5 ? 1 : -1;
        });
        return i.join("");
    }
}
