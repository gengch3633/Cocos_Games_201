import HotUpdate from "./HotUpdate";
import { GAME_NAME, SUBJECT_NAME } from "./SystemConfig";

export default class SystemDataMgr {
    private _game_name = "";
    private _subject_name = "";
    private _version_test_url = "";
    private _version_release_url = "";
    private _server_test_url = "";
    private _server_release_url = "";
    private _encrypt = 0;
    private _online_release = false;
    private _reviewing = false;
    is_reviewer = true;
    forbid_red_envelope = true;
    forbid_pai = true;
    private _reviewing_splash = 0;
    private _reviewing_antian = false;
    private _reviewing_img_ad = 0;
    private _reviewing_insert_ad = 0;
    private _auth_type = false;
    private _new_phone = 0;
    private _check_root = 0;
    private _privacy_url = "";
    private _user_url = "";
    private _confmeUrl = "";
    private _confmeUrlTest = "";
    ios_help_center_url = "";
    android_help_center_url = "https://haoyuntq.renzhijuzhen.com/help_center?package_name=com.ulike.dhytq";
    isShangHuHao = false;
    isSuCai = false;

    constructor() {
        this.game_name = null;
        this.subject_name = null;
        this.server_test_url = "";
        this.server_release_url = "";
        this.user_url = "https://haoyuntq.renzhijuzhen.com/user?package_name=com.ulike.dhytq";
        this.privacy_url = "https://haoyuntq.renzhijuzhen.com/private?package_name=com.ulike.dhytq";
        this.version_test_url = "";
        this.version_release_url = "";
        this.online_release = HotUpdate.getInstance().isOnlineRelease();
        this.confmeUrl = " http://haoyuntq-u.cognizematrix.com";
        this.confmeUrlTest = "http://config-middle-end.huixuanjiasu.com/oversea/";
        this.game_name = GAME_NAME;
        this.subject_name = SUBJECT_NAME;
    }

    get is_IOS_reviewer(): boolean {
        return this.is_reviewer && cc.sys.os === cc.sys.OS_IOS;
    }

    get check_root(): number {
        return this._check_root;
    }

    set check_root(e: number) {
        this._check_root = e;
    }

    get reviewing_img_ad(): number {
        return this._reviewing_img_ad;
    }

    set reviewing_img_ad(e: number) {
        this._reviewing_img_ad = e;
    }

    get reviewing_insert_ad(): number {
        return this._reviewing_insert_ad;
    }

    set reviewing_insert_ad(e: number) {
        this._reviewing_insert_ad = e;
    }

    get reviewing_antian(): boolean {
        return this._reviewing_antian;
    }

    set reviewing_antian(e: boolean) {
        this._reviewing_antian = e;
    }

    get new_phone(): number {
        return this._new_phone;
    }

    set new_phone(e: number) {
        this._new_phone = e;
    }

    get auth_type(): boolean {
        return this._auth_type;
    }

    set auth_type(e: boolean) {
        this._auth_type = e;
    }

    get reviewing(): boolean {
        return this._reviewing;
    }

    set reviewing(e: boolean) {
        this._reviewing = e;
    }

    get reviewing_splash(): number {
        return this._reviewing_splash;
    }

    set reviewing_splash(e: number) {
        this._reviewing_splash = e;
    }

    get online_release(): boolean {
        return this._online_release;
    }

    set online_release(e: boolean) {
        this._online_release = e;
    }

    get version_release_url(): string {
        return this._version_release_url;
    }

    set version_release_url(e: string) {
        this._version_release_url = e;
    }

    get version_test_url(): string {
        return this._version_test_url;
    }

    set version_test_url(e: string) {
        this._version_test_url = e;
    }

    get encrypt(): number {
        return this._encrypt;
    }

    set encrypt(e: number) {
        this._encrypt = e;
    }

    get game_name(): string {
        return this._game_name;
    }

    set game_name(e: string) {
        this._game_name = e;
    }

    get subject_name(): string {
        return this._subject_name;
    }

    set subject_name(e: string) {
        this._subject_name = e;
    }

    get server_test_url(): string {
        return this._server_test_url;
    }

    set server_test_url(e: string) {
        this._server_test_url = e;
    }

    get server_release_url(): string {
        return this._server_release_url;
    }

    set server_release_url(e: string) {
        this._server_release_url = e;
    }

    get privacy_url(): string {
        return this._privacy_url;
    }

    set privacy_url(e: string) {
        this._privacy_url = e;
    }

    get user_url(): string {
        return this._user_url;
    }

    set user_url(e: string) {
        this._user_url = e;
    }

    get confmeUrlTest(): string {
        return this._confmeUrlTest;
    }

    set confmeUrlTest(e: string) {
        this._confmeUrlTest = e;
    }

    get confmeUrl(): string {
        return this._confmeUrl;
    }

    set confmeUrl(e: string) {
        this._confmeUrl = e;
    }
}
