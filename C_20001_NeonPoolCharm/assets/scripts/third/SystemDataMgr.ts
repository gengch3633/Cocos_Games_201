import HotUpdate from "./HotUpdate";
import * as SystemConfig from "./SystemConfig";

export default class SystemDataMgr {
    protected _game_name: string = "";
    protected _subject_name: string = "";
    protected _version_test_url: string = "";
    protected _version_release_url: string = "";
    protected _server_test_url: string = "";
    protected _server_release_url: string = "";
    protected _encrypt: number = 0;
    protected _online_release: boolean = false;
    protected _reviewing: boolean = false;
    is_reviewer: boolean = true;
    forbid_red_envelope: boolean = true;
    forbid_pai: boolean = true;
    protected _reviewing_splash: number = 0;
    protected _reviewing_antian: boolean = false;
    protected _reviewing_img_ad: number = 0;
    protected _reviewing_insert_ad: number = 0;
    protected _auth_type: boolean = false;
    protected _new_phone: number = 0;
    protected _check_root: number = 0;
    protected _privacy_url: string = "";
    protected _user_url: string = "";
    protected _confmeUrl: string = "";
    protected _confmeUrlTest: string = "";
    ios_help_center_url: string = "";
    android_help_center_url: string =
        "https://haoyuntq.renzhijuzhen.com/help_center?package_name=com.ulike.dhytq";
    isShangHuHao: boolean = false;
    isSuCai: boolean = false;
    server_test_url: string = "";
    server_release_url: string = "";
    user_url: string = "https://haoyuntq.renzhijuzhen.com/user?package_name=com.ulike.dhytq";
    privacy_url: string = "https://haoyuntq.renzhijuzhen.com/private?package_name=com.ulike.dhytq";
    version_test_url: string = "";
    version_release_url: string = "";
    confmeUrl: string = " http://haoyuntq-u.cognizematrix.com";
    confmeUrlTest: string = "http://config-middle-end.huixuanjiasu.com/oversea/";

    constructor() {
        this.online_release = HotUpdate.getInstance().isOnlineRelease();
        this.game_name = SystemConfig.GAME_NAME;
        this.subject_name = SystemConfig.SUBJECT_NAME;
    }

    get is_IOS_reviewer(): boolean {
        return this.is_reviewer && cc.sys.os === cc.sys.OS_IOS;
    }

    get check_root(): number {
        return this._check_root;
    }
    set check_root(value: number) {
        this._check_root = value;
    }

    get reviewing_img_ad(): number {
        return this._reviewing_img_ad;
    }
    set reviewing_img_ad(value: number) {
        this._reviewing_img_ad = value;
    }

    get reviewing_insert_ad(): number {
        return this._reviewing_insert_ad;
    }
    set reviewing_insert_ad(value: number) {
        this._reviewing_insert_ad = value;
    }

    get reviewing_antian(): boolean {
        return this._reviewing_antian;
    }
    set reviewing_antian(value: boolean) {
        this._reviewing_antian = value;
    }

    get new_phone(): number {
        return this._new_phone;
    }
    set new_phone(value: number) {
        this._new_phone = value;
    }

    get auth_type(): boolean {
        return this._auth_type;
    }
    set auth_type(value: boolean) {
        this._auth_type = value;
    }

    get reviewing(): boolean {
        return this._reviewing;
    }
    set reviewing(value: boolean) {
        this._reviewing = value;
    }

    get reviewing_splash(): number {
        return this._reviewing_splash;
    }
    set reviewing_splash(value: number) {
        this._reviewing_splash = value;
    }

    get online_release(): boolean {
        return this._online_release;
    }
    set online_release(value: boolean) {
        this._online_release = value;
    }

    get version_release_url(): string {
        return this._version_release_url;
    }
    set version_release_url(value: string) {
        this._version_release_url = value;
    }

    get version_test_url(): string {
        return this._version_test_url;
    }
    set version_test_url(value: string) {
        this._version_test_url = value;
    }

    get encrypt(): number {
        return this._encrypt;
    }
    set encrypt(value: number) {
        this._encrypt = value;
    }

    get game_name(): string {
        return this._game_name;
    }
    set game_name(value: string) {
        this._game_name = value;
    }

    get subject_name(): string {
        return this._subject_name;
    }
    set subject_name(value: string) {
        this._subject_name = value;
    }

    get server_test_url(): string {
        return this._server_test_url;
    }
    set server_test_url(value: string) {
        this._server_test_url = value;
    }

    get server_release_url(): string {
        return this._server_release_url;
    }
    set server_release_url(value: string) {
        this._server_release_url = value;
    }

    get privacy_url(): string {
        return this._privacy_url;
    }
    set privacy_url(value: string) {
        this._privacy_url = value;
    }

    get user_url(): string {
        return this._user_url;
    }
    set user_url(value: string) {
        this._user_url = value;
    }

    get confmeUrlTest(): string {
        return this._confmeUrlTest;
    }
    set confmeUrlTest(value: string) {
        this._confmeUrlTest = value;
    }

    get confmeUrl(): string {
        return this._confmeUrl;
    }
    set confmeUrl(value: string) {
        this._confmeUrl = value;
    }
}
