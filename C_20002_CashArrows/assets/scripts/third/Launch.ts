import ArchiveMgr from "./ArchiveMgr";
import ClickAudio from "./ClickAudio";
import ConfigMgr from "./ConfigMgr";
import LanguageService from "./LanguageService";
import MultiPlatform from "./MultiPlatform";
import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import Tips from "./Tips";
import UMengManger from "./UMengManger";

export default class Launch extends Singleton {
    addSceneChangeHandle(): void {
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this.beforeSceneLaunchHandle, this);
    }

    beforeSceneLaunchHandle(scene: cc.Scene): void {
        const canvas = scene.getComponentInChildren(cc.Canvas);
        const root = canvas ? canvas.node : scene;
        ResMgr.getInstance().getKeeper(root, true);
        ClickAudio.addClickAudio(root);
    }

    load(config: any, bundles: string[] | null | undefined, progress?: (total: number, cur: number) => void): Promise<void> {
        const progressState = {
            total: 1,
            cur: 0,
        };
        progressState.total += bundles != null ? bundles.length : 0;

        return new Promise((resolve) => {
            const isBrowser = cc.sys.isBrowser;
            const isNative = cc.sys.isNative;

            if (isBrowser) {
                config.dataSyncToServer = false;
                console.log("浏览器环境下不支持数据同步功能");
            }
            if (config.dataSyncToServer && !config.login) {
                config.login = true;
            }
            UMengManger.getInstance().enable = config.report;

            const step = () => {
                progressState.cur++;
                progress && progress(progressState.total, progressState.cur);
                if (progressState.cur >= progressState.total) {
                    this.addSceneChangeHandle();
                    resolve();
                }
            };

            MultiPlatform.getInstance().init(config);

            if (isBrowser) {
                progressState.total++;
                console.log("浏览器环境，跳过平台登录，直接走业务登录/注册");
                ArchiveMgr.getInstance().init(false).then((ok) => {
                    console.log("数据存档加载完成,加载结果", ok);
                    if (ok) {
                        step();
                    } else {
                        Tips.show(LanguageService.t("key_tip_archive_load_fail"));
                    }
                }).catch((err) => {
                    console.error("浏览器环境存档初始化失败", err);
                    step();
                });
            } else if (isNative) {
                progressState.total++;
                console.log("原生环境，跳过小游戏平台登录");
                ArchiveMgr.getInstance().init(false).then((ok) => {
                    console.log("原生环境数据存档加载完成,加载结果", ok);
                    step();
                }).catch((err) => {
                    console.error("原生环境存档初始化失败", err);
                    step();
                });
            } else if (config.login) {
                progressState.total++;
                progressState.total++;
                console.log("开始登录");
                MultiPlatform.getInstance().login().then((loggedIn) => {
                    if (loggedIn) {
                        step();
                        console.log("开始加载数据存档");
                        ArchiveMgr.getInstance().init(config.dataSyncToServer).then((ok) => {
                            console.log("数据存档加载完成,加载结果", ok);
                            if (ok) {
                                step();
                            } else {
                                Tips.show(LanguageService.t("key_tip_archive_load_fail"));
                            }
                        });
                    } else {
                        Tips.show(LanguageService.t("key_tip_login_fail_network"));
                    }
                });
            }

            ConfigMgr.getInstance().loadAll(null).then((ok) => {
                if (ok) {
                    console.log("配置文件加载完成");
                    step();
                } else {
                    Tips.show(LanguageService.t("key_tip_config_load_fail"));
                }
            });

            if (bundles) {
                bundles.forEach((bundleName) => {
                    ResMgr.getInstance().getBundle(bundleName).then((bundle) => {
                        if (bundle) {
                            console.log("bundle->" + bundleName + " 加载完成");
                            step();
                        } else {
                            Tips.show(LanguageService.t("key_tip_resource_load_fail"));
                        }
                    });
                });
            }
        });
    }
}
