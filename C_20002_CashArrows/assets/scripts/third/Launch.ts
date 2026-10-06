import ArchiveMgr from "./ArchiveMgr";
import ConfigMgr from "./ConfigMgr";
import MultiPlatform from "./MultiPlatform";
import UMengManger from "./UMengManger";
import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import ClickAudio from "./ClickAudio";
import Tips from "./Tips";
import LanguageService from "./LanguageService";

export default class Launch extends Singleton {
    addSceneChangeHandle() {
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this.beforeSceneLaunchHandle, this);
    }

    beforeSceneLaunchHandle(e: cc.Node) {
        var t = e.getComponentInChildren(cc.Canvas), i = t ? t.node : e;
        ResMgr.getInstance().getKeeper(i, true);
        ClickAudio.addClickAudio(i);
    }

    load(e: any, t: any, i: any) {
        var n, d = this, h = {
            total: 1,
            cur: 0
        };
        h.total += null !== (n = null == t ? void 0 : t.length) && void 0 !== n ? n : 0;
        return new Promise<void>(function (n) {
            var f = cc.sys.isBrowser, g = cc.sys.isNative;
            if (f) {
                e.dataSyncToServer = false;
                console.log(" 浏览器环境下不支持数据同步功能 ");
            }
            e.dataSyncToServer && !e.login && (e.login = true);
            UMengManger.getInstance().enable = e.report;
            var m = function () {
                h.cur++;
                i && i(h.total, h.cur);
                if (h.cur >= h.total) {
                    d.addSceneChangeHandle();
                    n();
                }
            };
            MultiPlatform.getInstance().init(e);
            if (f) {
                h.total++;
                console.log(" 浏览器环境 ， 跳过平台登录 ， 直接走业务登录/ 注册 ");
                ArchiveMgr.getInstance().init(false).then(function (e) {
                    console.log(" 数据存档加载完成, 加载结果 ", e);
                    e ? m() : Tips.show(LanguageService.t(" key_tip_archive_load_fail "));
                }).catch(function (e) {
                    console.error(" 浏览器环境存档初始化失败 ", e);
                    m();
                });
            } else if (g) {
                h.total++;
                console.log(" 原生环境 ， 跳过小游戏平台登录 ");
                ArchiveMgr.getInstance().init(false).then(function (e) {
                    console.log(" 原生环境数据存档加载完成, 加载结果 ", e);
                    m();
                }).catch(function (e) {
                    console.error(" 原生环境存档初始化失败 ", e);
                    m();
                });
            } else if (e.login) {
                h.total++;
                h.total++;
                console.log(" 开始登录 ");
                MultiPlatform.getInstance().login().then(function (t) {
                    if (t) {
                        m();
                        console.log(" 开始加载数据存档 ");
                        ArchiveMgr.getInstance().init(e.dataSyncToServer).then(function (e) {
                            console.log(" 数据存档加载完成, 加载结果 ", e);
                            e ? m() : Tips.show(LanguageService.t(" key_tip_archive_load_fail "));
                        });
                    } else Tips.show(LanguageService.t(" key_tip_login_fail_network "));
                });
            }
            ConfigMgr.getInstance().loadAll(null).then(async function (e) {
                if (e) {
                    console.log(" 配置文件加载完成 ");
                    m();
                } else {
                    Tips.show(LanguageService.t(" key_tip_config_load_fail "));
                }
            });
            t.forEach(function (e: any) {
                return ResMgr.getInstance().getBundle(e).then(async function (t) {
                    if (t) {
                        console.log(" bundle- > " + e + " 加载完成 ");
                        m();
                    } else {
                        Tips.show(LanguageService.t(" key_tip_resource_load_fail "));
                    }
                });
            });
        });
    }
}
