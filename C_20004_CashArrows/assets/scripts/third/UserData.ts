import UserArchive from "./UserArchive";

const { ccclass } = cc._decorator;

@ccclass
export default class UserData extends UserArchive {
    public bool_firstdie: boolean = true;

    public sidebar: boolean = false;

    public level: number = 1;

    public music: boolean = true;

    public sound: boolean = true;

    public shake: boolean = true;

    public dragSpeed: number = 0.5;

    public colorMode: boolean = false;

    public userID: string | null = null;

    public firstVersion: string = "";

    public num_tipscards: number = 0;

    public openId: string = "";

    public yid: string = "";

    public cash_balance: number = 0;

    public hint_prop_count: number = 0;

    public guideline_prop_count: number = 0;

    public bubble_balance: string = "";

    public user_level: number = 1;

    public recentRandomLevels: any[] = [];

    constructor() {
        super("UserData");
    }

    public init(): void {
    }

    public static getUserId(len: number): string {
        const chars = "1234567890abcdefghijklmnopqrstuvwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const result: string[] = [];
        for (let i = 0; i < len; i++) {
            result.push(chars[Math.floor(Math.random() * chars.length)]);
        }
        result.sort(() => (Math.random() > 0.5 ? 1 : -1));
        return result.join("");
    }
}