import { TouchType } from "./GodGuide";
import GuideEvent from "./GuideEvent";

declare const async: any;

export class GodCommand {
    static text(guide, step, done) {
        let args = step.command.args;
        if (args && ("string" == typeof args || "number" == typeof args)) {
            args = [args];
        }
        const showGirl = !step.hideGirl;
        const autorun = guide.getTask().autorun;
        async.eachSeries(args, function (text, next) {
            let finished = false;
            guide.showText(text, showGirl, step.textOffsetX, step.textOffsetY, function () {
                next();
            });
            autorun && setTimeout(function () {
                if (!finished) {
                    finished = true;
                    next();
                }
            }, 1e3);
        }, done);
    }

    static finger(guide, step, done) {
        const args = step.command.args;
        guide._targetNode = null;
        const showGirl = !step.hideGirl;
        guide.find(args, function (node) {
            guide.showFingerText(node, step.text, step.textOffsetX, step.textOffsetY, showGirl);
            guide.fingerToNode(node, step.fingerType || TouchType.Click, function () {
                guide._targetNode = node;
                if (step.clickAnywhereToEnd) {
                    guide._clickDelegate = function () {
                        cc.log("wide node clicked");
                        guide._clickDelegate = null;
                        done();
                    };
                } else {
                    guide._clickDelegate = null;
                    node.once(cc.Node.EventType.TOUCH_END, function () {
                        cc.log("node clicked");
                        done();
                    });
                }
            });
            guide.getTask().autorun && guide.touchSimulation(node);
        });
    }

    static ani(guide, step, done) {
        const args = step.command.args;
        guide._targetNode = null;
        const showGirl = !step.hideGirl;
        guide.find(args, function (node) {
            guide.showFingerText(node, step.text, step.textOffsetX, step.textOffsetY, showGirl);
            guide.fingerToNode(node, step.fingerType || TouchType.Click, function () {
                guide._targetNode = node;
                cc.log("节点被点击");
                done();
            });
            guide.getTask().autorun && guide.touchSimulation(node);
        });
    }

    static locator(guide, step, done) {
        const args = step.command.args;
        guide.find(args, function (node) {
            guide._targetNode = node;
            node.once(cc.Node.EventType.TOUCH_END, function () {
                cc.log("节点被点击");
                done();
            });
            guide.getTask().autorun && guide.touchSimulation(node);
        });
    }

    static video(guide, step, done) {
        guide.VIDEO.node.active = true;
        guide.VIDEO.play();
        guide.scheduleOnce(function () {
            guide.VIDEO.node.active = false;
            cc.log("播放完成");
            cc.game.emit(GuideEvent.VideoEnd);
            done();
        }, step.playTime || 0);
    }

    static openpage(guide, step, done) {
        const args = step.command.args;
        if (args && "string" == typeof args) {
            guide.openPage(args, done);
        } else {
            console.error("检查配置参数", step.desc, step.command);
        }
    }

    static DIALOGUE = "dialogue";
    static FINGER = "finger";
    static OPENPAGE = "openpage";
    static ANI = "ani";
    static TEXT = "text";
    static LOCATOR = "locator";
    static SAVE = "save";
    static NODETEXT = "nodetext";
    static VIDEO = "video";
    static typeList = [GodCommand.DIALOGUE, GodCommand.FINGER, GodCommand.TEXT, GodCommand.LOCATOR, GodCommand.SAVE, GodCommand.VIDEO, GodCommand.ANI, GodCommand.OPENPAGE];
}
