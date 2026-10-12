import ArchiveMgr from "./ArchiveMgr";
import ClickAudio from "./ClickAudio";
import ConfigMgr from "./ConfigMgr";
import LanguageService from "./LanguageService";
import MultiPlatform from "./MultiPlatform";
import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import Tips from "./Tips";
import UMengManger from "./UMengManger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Launch extends Singleton {
    private addSceneChangeHandle(): void {
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this.beforeSceneLaunchHandle, this);
    }

    private beforeSceneLaunchHandle(scene: cc.Scene): void {
        const canvas = scene.getComponentInChildren(cc.Canvas);
        const node = canvas ? canvas.node : scene;
        ResMgr.getInstance().getKeeper(node, true);
        ClickAudio.addClickAudio(node);
    }

    public async load(config: any, bundles: string[], onProgress?: (total: number, cur: number) => void): Promise<void> {
        await new Promise<void>((resolve) => {
            const self = this;
            const tracker = { total: 1, cur: 0 };
            tracker.total += bundles ? bundles.length : 0;

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

            const onTaskComplete = () => {
                tracker.cur++;
                if (onProgress) {
                    onProgress(tracker.total, tracker.cur);
                }
                if (tracker.cur >= tracker.total) {
                    self.addSceneChangeHandle();
                    resolve();
                }
            };

            MultiPlatform.getInstance().init(config);

            if (isBrowser) {
                tracker.total++;
                console.log("浏览器环境，跳过平台登录，直接走业务登录/注册");
                ArchiveMgr.getInstance().init(false).then((success) => {
                    console.log("数据存档加载完成,加载结果", success);
                    if (success) {
                        onTaskComplete();
                    } else {
                        Tips.show(LanguageService.t("key_tip_archive_load_fail"));
                    }
                }).catch((err) => {
                    console.error("浏览器环境存档初始化失败", err);
                    onTaskComplete();
                });
            } else if (isNative) {
                tracker.total++;
                console.log("原生环境，跳过小游戏平台登录");
                ArchiveMgr.getInstance().init(false).then((success) => {
                    console.log("原生环境数据存档加载完成,加载结果", success);
                    onTaskComplete();
                }).catch((err) => {
                    console.error("原生环境存档初始化失败", err);
                    onTaskComplete();
                });
            } else if (config.login) {
                tracker.total++;
                tracker.total++;
                console.log("开始登录");
                MultiPlatform.getInstance().login().then((loginSuccess) => {
                    if (loginSuccess) {
                        onTaskComplete();
                        console.log("开始加载数据存档");
                        ArchiveMgr.getInstance().init(config.dataSyncToServer).then((success) => {
                            console.log("数据存档加载完成,加载结果", success);
                            if (success) {
                                onTaskComplete();
                            } else {
                                Tips.show(LanguageService.t("key_tip_archive_load_fail"));
                            }
                        });
                    } else {
                        Tips.show(LanguageService.t("key_tip_login_fail_network"));
                    }
                });
            }

            ConfigMgr.getInstance().loadAll(null).then((success) => {
                if (success) {
                    console.log("配置文件加载完成");
                    onTaskComplete();
                } else {
                    Tips.show(LanguageService.t("key_tip_config_load_fail"));
                }
            });

            if (bundles) {
                bundles.forEach((bundle) => {
                    ResMgr.getInstance().getBundle(bundle).then((success) => {
                        if (success) {
                            console.log("bundle->" + bundle + " 加载完成");
                            onTaskComplete();
                        } else {
                            Tips.show(LanguageService.t("key_tip_resource_load_fail"));
                        }
                    });
                });
            }
        });
    }
}