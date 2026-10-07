import UserArchive from "./UserArchive";

export default class UserData extends UserArchive {
    bool_firstdie: boolean = true;
    sidebar: boolean = false;
    level: number = 1;
    music: boolean = true;
    sound: boolean = true;
    shake: boolean = true;
    dragSpeed: number = 0.5;
    colorMode: boolean = false;
    userID: string = null;
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

    init(_isNew: boolean): void {}

    static getUserId(length: number): string {
        const chars = "1234567890abcdefghijklmnopqrstuvwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const result: string[] = [];
        for (let i = 0; i < length; i++) {
            result.push(chars[Math.floor(Math.random() * chars.length)]);
        }
        result.sort(() => (Math.random() > 0.5 ? 1 : -1));
        return result.join("");
    }
}
