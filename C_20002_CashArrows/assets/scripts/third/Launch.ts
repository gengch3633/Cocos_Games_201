import ArchiveMgr from "./ArchiveMgr";
import ConfigMgr from "./ConfigMgr";
import MultiPlatform from "./MultiPlatform";
import UMengManger from "./UMengManger";
import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import ClickAudio from "./ClickAudio";
import Tips from "./Tips";
import * as LanguageService from "./LanguageService";

interface LaunchOptions {
    dataSyncToServer?: boolean;
    login?: boolean;
    report?: boolean;
}

interface ProgressState {
    total: number;
    cur: number;
}

export default class Launch extends Singleton {
    addSceneChangeHandle(): void {
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this.beforeSceneLaunchHandle, this);
    }

    beforeSceneLaunchHandle(scene: cc.Node): void {
        const canvas = scene.getComponentInChildren(cc.Canvas);
        const root = canvas ? canvas.node : scene;
        ResMgr.getInstance().getKeeper(root, true);
        ClickAudio.addClickAudio(root);
    }

    load(options: LaunchOptions, bundles: string[], onProgress?: (total: number, current: number) => void): Promise<void> {
        const progress: ProgressState = { total: 1, cur: 0 };
        progress.total += bundles?.length || 0;

        return new Promise((resolve) => {
            const isBrowser = cc.sys.isBrowser;
            const isNative = cc.sys.isNative;

            if (isBrowser) {
                options.dataSyncToServer = false;
                console.log("浏览器环境下不支持数据同步功能");
            }

            if (options.dataSyncToServer && !options.login) {
                options.login = true;
            }

            UMengManger.getInstance().enable = !!options.report;

            const step = () => {
                progress.cur++;
                onProgress?.(progress.total, progress.cur);
                if (progress.cur >= progress.total) {
                    this.addSceneChangeHandle();
                    resolve();
                }
            };

            MultiPlatform.getInstance().init(options as Record<string, unknown>);

            if (isBrowser) {
                progress.total++;
                console.log("浏览器环境，跳过平台登录，直接走业务登录/注册");
                ArchiveMgr.getInstance()
                    .init(false)
                    .then((success) => {
                        console.log("数据存档加载完成,加载结果", success);
                        if (success) {
                            step();
                        } else {
                            Tips.show(LanguageService.t("key_tip_archive_load_fail"));
                        }
                    })
                    .catch((error) => {
                        console.error("浏览器环境存档初始化失败", error);
                        step();
                    });
            } else if (isNative) {
                progress.total++;
                console.log("原生环境，跳过小游戏平台登录");
                ArchiveMgr.getInstance()
                    .init(false)
                    .then((success) => {
                        console.log("原生环境数据存档加载完成,加载结果", success);
                        step();
                    })
                    .catch((error) => {
                        console.error("原生环境存档初始化失败", error);
                        step();
                    });
            } else if (options.login) {
                progress.total += 2;
                console.log("开始登录");
                MultiPlatform.getInstance()
                    .login()
                    .then((success) => {
                        if (success) {
                            step();
                            console.log("开始加载数据存档");
                            ArchiveMgr.getInstance().init(!!options.dataSyncToServer).then((loaded) => {
                                console.log("数据存档加载完成,加载结果", loaded);
                                if (loaded) {
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

            ConfigMgr.getInstance().loadAll(null as unknown as string).then((success) => {
                if (success) {
                    console.log("配置文件加载完成");
                    step();
                } else {
                    Tips.show(LanguageService.t("key_tip_config_load_fail"));
                }
            });

            bundles.forEach((bundleName) => {
                ResMgr.getInstance()
                    .getBundle(bundleName)
                    .then((bundle) => {
                        if (bundle) {
                            console.log("bundle->" + bundleName + " 加载完成");
                            step();
                        } else {
                            Tips.show(LanguageService.t("key_tip_resource_load_fail"));
                        }
                    });
            });
        });
    }
}
