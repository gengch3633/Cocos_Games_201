import UserArchive from "./UserArchive";

export default class UserData extends UserArchive {
    bool_firstdie = true;
    sidebar = false;
    level = 1;
    music = true;
    sound = true;
    shake = true;
    dragSpeed = 0.5;
    colorMode = false;
    userID: string | null = null;
    firstVersion = "";
    num_tipscards = 0;
    openId = "";
    yid = "";
    cash_balance = 0;
    hint_prop_count = 0;
    guideline_prop_count = 0;
    bubble_balance = "";
    user_level = 1;
    recentRandomLevels: any[] = [];
    extract_money?: any;
    bubble_status?: any;
    levels_passed_count?: any;
    current_extract_levels_passed_count?: any;
    levels_passed_limit?: any;
    sign_in_days?: any;
    sign_in_limit?: any;
    extract_user_level?: any;
    level_limit?: any;

    constructor() {
        super("UserData");
    }

    init(_isNew?: boolean): void {
    }

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
