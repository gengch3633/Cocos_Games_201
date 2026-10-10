import HotUpdate from "./HotUpdate";
import { GAME_NAME, SUBJECT_NAME } from "./SystemConfig";

export default class SystemDataMgr {
    _game_name = "";
    _subject_name = "";
    _version_test_url = "";
    _version_release_url = "";
    _server_test_url = "";
    _server_release_url = "";
    _encrypt = 0;
    _online_release = false;
    _reviewing = false;
    is_reviewer = true;
    forbid_red_envelope = true;
    forbid_pai = true;
    _reviewing_splash = 0;
    _reviewing_antian = false;
    _reviewing_img_ad = 0;
    _reviewing_insert_ad = 0;
    _auth_type = false;
    _new_phone = 0;
    _check_root = 0;
    _privacy_url = "";
    _user_url = "";
    _confmeUrl = "";
    _confmeUrlTest = "";
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

    get is_IOS_reviewer() {
        return this.is_reviewer && cc.sys.os === cc.sys.OS_IOS;
    }

    get check_root() {
        return this._check_root;
    }

    set check_root(e) {
        this._check_root = e;
    }

    get reviewing_img_ad() {
        return this._reviewing_img_ad;
    }

    set reviewing_img_ad(e) {
        this._reviewing_img_ad = e;
    }

    get reviewing_insert_ad() {
        return this._reviewing_insert_ad;
    }

    set reviewing_insert_ad(e) {
        this._reviewing_insert_ad = e;
    }

    get reviewing_antian() {
        return this._reviewing_antian;
    }

    set reviewing_antian(e) {
        this._reviewing_antian = e;
    }

    get new_phone() {
        return this._new_phone;
    }

    set new_phone(e) {
        this._new_phone = e;
    }

    get auth_type() {
        return this._auth_type;
    }

    set auth_type(e) {
        this._auth_type = e;
    }

    get reviewing() {
        return this._reviewing;
    }

    set reviewing(e) {
        this._reviewing = e;
    }

    get reviewing_splash() {
        return this._reviewing_splash;
    }

    set reviewing_splash(e) {
        this._reviewing_splash = e;
    }

    get online_release() {
        return this._online_release;
    }

    set online_release(e) {
        this._online_release = e;
    }

    get version_release_url() {
        return this._version_release_url;
    }

    set version_release_url(e) {
        this._version_release_url = e;
    }

    get version_test_url() {
        return this._version_test_url;
    }

    set version_test_url(e) {
        this._version_test_url = e;
    }

    get encrypt() {
        return this._encrypt;
    }

    set encrypt(e) {
        this._encrypt = e;
    }

    get game_name() {
        return this._game_name;
    }

    set game_name(e) {
        this._game_name = e;
    }

    get subject_name() {
        return this._subject_name;
    }

    set subject_name(e) {
        this._subject_name = e;
    }

    get server_test_url() {
        return this._server_test_url;
    }

    set server_test_url(e) {
        this._server_test_url = e;
    }

    get server_release_url() {
        return this._server_release_url;
    }

    set server_release_url(e) {
        this._server_release_url = e;
    }

    get privacy_url() {
        return this._privacy_url;
    }

    set privacy_url(e) {
        this._privacy_url = e;
    }

    get user_url() {
        return this._user_url;
    }

    set user_url(e) {
        this._user_url = e;
    }

    get confmeUrlTest() {
        return this._confmeUrlTest;
    }

    set confmeUrlTest(e) {
        this._confmeUrlTest = e;
    }

    get confmeUrl() {
        return this._confmeUrl;
    }

    set confmeUrl(e) {
        this._confmeUrl = e;
    }
}
