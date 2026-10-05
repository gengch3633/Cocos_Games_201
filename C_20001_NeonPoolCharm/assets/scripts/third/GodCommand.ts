import { TouchType } from "./GodGuide";
import GuideEvent from "./GuideEvent";

declare const async: {
    eachSeries<T>(
        arr: T[],
        iteratee: (item: T, callback: () => void) => void,
        done: () => void
    ): void;
};

interface GodCommandStep {
    command: { args: unknown };
    hideGirl?: boolean;
    text?: string;
    textOffsetX?: number;
    textOffsetY?: number;
    fingerType?: number;
    clickAnywhereToEnd?: boolean;
    playTime?: number;
    desc?: string;
}

interface GodGuideInstance {
    _targetNode: cc.Node;
    _clickDelegate: (() => void) | null;
    VIDEO: cc.VideoPlayer;
    showText(
        text: unknown,
        showGirl: boolean,
        offsetX: number,
        offsetY: number,
        callback: () => void
    ): void;
    find(args: unknown, callback: (node: cc.Node) => void): void;
    showFingerText(
        node: cc.Node,
        text: string,
        offsetX: number,
        offsetY: number,
        showGirl: boolean
    ): void;
    fingerToNode(node: cc.Node, fingerType: number, callback: () => void): void;
    touchSimulation(node: cc.Node): void;
    getTask(): { autorun: boolean };
    openPage(pageName: string, callback: () => void): void;
    scheduleOnce(callback: () => void, delay: number): void;
}

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

    static text(god: GodGuideInstance, step: GodCommandStep, done: () => void): void {
        let args = step.command.args;
        if (args && (typeof args === "string" || typeof args === "number")) {
            args = [args];
        }
        const showGirl = !step.hideGirl;
        const autorun = god.getTask().autorun;
        async.eachSeries(args as unknown[], (text, next) => {
            let finished = false;
            god.showText(text, showGirl, step.textOffsetX, step.textOffsetY, () => {
                next();
            });
            if (autorun) {
                setTimeout(() => {
                    if (!finished) {
                        finished = true;
                        next();
                    }
                }, 1000);
            }
        }, done);
    }

    static finger(god: GodGuideInstance, step: GodCommandStep, done: () => void): void {
        const args = step.command.args;
        god._targetNode = null;
        const showGirl = !step.hideGirl;
        god.find(args, (node) => {
            god.showFingerText(node, step.text, step.textOffsetX, step.textOffsetY, showGirl);
            god.fingerToNode(node, step.fingerType || TouchType.Click, () => {
                god._targetNode = node;
                if (step.clickAnywhereToEnd) {
                    god._clickDelegate = () => {
                        cc.log("wide node clicked");
                        god._clickDelegate = null;
                        done();
                    };
                } else {
                    god._clickDelegate = null;
                    node.once(cc.Node.EventType.TOUCH_END, () => {
                        cc.log("node clicked");
                        done();
                    });
                }
            });
            if (god.getTask().autorun) {
                god.touchSimulation(node);
            }
        });
    }

    static ani(god: GodGuideInstance, step: GodCommandStep, done: () => void): void {
        const args = step.command.args;
        god._targetNode = null;
        const showGirl = !step.hideGirl;
        god.find(args, (node) => {
            god.showFingerText(node, step.text, step.textOffsetX, step.textOffsetY, showGirl);
            god.fingerToNode(node, step.fingerType || TouchType.Click, () => {
                god._targetNode = node;
                cc.log("节点被点击");
                done();
            });
            if (god.getTask().autorun) {
                god.touchSimulation(node);
            }
        });
    }

    static locator(god: GodGuideInstance, step: GodCommandStep, done: () => void): void {
        const args = step.command.args;
        god.find(args, (node) => {
            god._targetNode = node;
            node.once(cc.Node.EventType.TOUCH_END, () => {
                cc.log("节点被点击");
                done();
            });
            if (god.getTask().autorun) {
                god.touchSimulation(node);
            }
        });
    }

    static video(god: GodGuideInstance, step: GodCommandStep, done: () => void): void {
        god.VIDEO.node.active = true;
        god.VIDEO.play();
        god.scheduleOnce(() => {
            god.VIDEO.node.active = false;
            cc.log("播放完成");
            cc.game.emit(GuideEvent.VideoEnd);
            done();
        }, step.playTime || 0);
    }

    static openpage(god: GodGuideInstance, step: GodCommandStep, done: () => void): void {
        const pageName = step.command.args;
        if (pageName && typeof pageName === "string") {
            god.openPage(pageName, done);
        } else {
            console.error("检查配置参数", step.desc, step.command);
        }
    }
}
