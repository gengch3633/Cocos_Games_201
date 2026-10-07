import { TouchType } from "./GodGuide";
import GuideEvent from "./GuideEvent";

declare const async: any;

export class GodCommand {
    static DIALOGUE = "dialogue";
    static FINGER = "finger";
    static OPENPAGE = "openpage";
    static ANI = "ani";
    static TEXT = "text";
    static LOCATOR = "locator";
    static SAVE = "save";
    static NODETEXT = "nodetext";
    static VIDEO = "video";
    static typeList = [
        GodCommand.DIALOGUE,
        GodCommand.FINGER,
        GodCommand.TEXT,
        GodCommand.LOCATOR,
        GodCommand.SAVE,
        GodCommand.VIDEO,
        GodCommand.ANI,
        GodCommand.OPENPAGE,
    ];

    static text(guide: any, step: any, callback: () => void): void {
        let args = step.command.args;
        if (!args || (typeof args != "string" && typeof args != "number")) {
            // keep args as-is
        } else {
            args = [args];
        }
        const showGirl = !step.hideGirl;
        const autorun = guide.getTask().autorun;
        async.eachSeries(
            args,
            (text: any, next: () => void) => {
                let done = false;
                guide.showText(text, showGirl, step.textOffsetX, step.textOffsetY, () => {
                    next();
                });
                if (autorun) {
                    setTimeout(() => {
                        if (!done) {
                            done = true;
                            next();
                        }
                    }, 1e3);
                }
            },
            callback
        );
    }

    static finger(guide: any, step: any, callback: () => void): void {
        const args = step.command.args;
        guide._targetNode = null;
        const showGirl = !step.hideGirl;
        guide.find(args, (node: cc.Node) => {
            guide.showFingerText(node, step.text, step.textOffsetX, step.textOffsetY, showGirl);
            guide.fingerToNode(node, step.fingerType || TouchType.Click, () => {
                guide._targetNode = node;
                if (step.clickAnywhereToEnd) {
                    guide._clickDelegate = () => {
                        cc.log("wide node clicked");
                        guide._clickDelegate = null;
                        callback();
                    };
                } else {
                    guide._clickDelegate = null;
                    node.once(cc.Node.EventType.TOUCH_END, () => {
                        cc.log("node clicked");
                        callback();
                    });
                }
            });
            if (guide.getTask().autorun) {
                guide.touchSimulation(node);
            }
        });
    }

    static ani(guide: any, step: any, callback: () => void): void {
        const args = step.command.args;
        guide._targetNode = null;
        const showGirl = !step.hideGirl;
        guide.find(args, (node: cc.Node) => {
            guide.showFingerText(node, step.text, step.textOffsetX, step.textOffsetY, showGirl);
            guide.fingerToNode(node, step.fingerType || TouchType.Click, () => {
                guide._targetNode = node;
                cc.log("节点被点击");
                callback();
            });
            if (guide.getTask().autorun) {
                guide.touchSimulation(node);
            }
        });
    }

    static locator(guide: any, step: any, callback: () => void): void {
        const args = step.command.args;
        guide.find(args, (node: cc.Node) => {
            guide._targetNode = node;
            node.once(cc.Node.EventType.TOUCH_END, () => {
                cc.log("节点被点击");
                callback();
            });
            if (guide.getTask().autorun) {
                guide.touchSimulation(node);
            }
        });
    }

    static video(guide: any, step: any, callback: () => void): void {
        guide.VIDEO.node.active = true;
        guide.VIDEO.play();
        guide.scheduleOnce(() => {
            guide.VIDEO.node.active = false;
            cc.log("播放完成");
            cc.game.emit(GuideEvent.VideoEnd);
            callback();
        }, step.playTime || 0);
    }

    static openpage(guide: any, step: any, callback: () => void): void {
        const args = step.command.args;
        if (args && typeof args == "string") {
            guide.openPage(args, callback);
        } else {
            console.error("检查配置参数", step.desc, step.command);
        }
    }
}
