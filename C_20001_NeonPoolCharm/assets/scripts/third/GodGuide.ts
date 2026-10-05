export const TouchType = cc.Enum({
    Click: 0,
    DragHorizontal: 1,
    DragVertical: 2,
});

import { GodCommand } from "./GodCommand";
import GuideFinger from "./GuideFinger";
import { Locator } from "./Locator";
import GameServiceMgr from "./GameServiceMgr";
import AudioManager from "./AudioManager";
import SdkHelper from "./SdkHelper";
import PlayerDataSys from "./PlayerDataSys";
import SystemDataSys from "./SystemDataSys";

declare const async: {
    eachSeries<T>(
        arr: T[],
        iteratee: (item: T, callback: () => void) => void,
        done: () => void
    ): void;
    series(
        tasks: Record<string, (callback: () => void) => void>,
        done: () => void
    ): void;
};

const DEG_TO_RAD = (2 * Math.PI) / 360;

interface GuideStep {
    id: number;
    desc: string;
    mask?: boolean;
    blackMask?: boolean;
    blackMask2?: boolean;
    delayTime?: number;
    save?: boolean;
    sound?: string;
    taskEndCloseMask?: boolean;
    command: { cmd: string; args?: unknown };
    onStart?: (done: () => void) => void;
    onEnd?: (done: () => void) => void;
}

interface GuideTask {
    autorun: boolean;
    debug: boolean;
    debugUI?: boolean;
    steps: GuideStep[];
}

interface RecordStep {
    desc: string;
    command: { cmd: string; args: string };
    delay: number;
}

function rotatePoint(point: cc.Vec2, angle: number, origin: cc.Vec2): cc.Vec2 {
    const rad = -angle * DEG_TO_RAD;
    return cc.v2(
        (point.x - origin.x) * Math.cos(rad) - (point.y - origin.y) * Math.sin(rad) + origin.x,
        (point.x - origin.x) * Math.sin(rad) + (point.y - origin.y) * Math.cos(rad) + origin.y
    );
}

function getRectPoints(rect: cc.Rect, angle: number, origin: cc.Vec2): cc.Vec2[] {
    return [
        cc.v2(rect.x, rect.y),
        cc.v2(rect.x + rect.width, rect.y),
        cc.v2(rect.x + rect.width, rect.y + rect.height),
        cc.v2(rect.x, rect.y + rect.height),
    ].map((point) => rotatePoint(point, angle, origin));
}

function getElementRect(element: HTMLElement): { left: number; top: number; width: number; height: number } {
    const html = document.documentElement;
    const offsetX = window.pageXOffset - html.clientLeft;
    const offsetY = window.pageYOffset - html.clientTop;
    if (typeof element.getBoundingClientRect == "function") {
        const rect = element.getBoundingClientRect();
        return {
            left: rect.left + offsetX,
            top: rect.top + offsetY,
            width: rect.width,
            height: rect.height,
        };
    }
    if (element instanceof HTMLCanvasElement) {
        return {
            left: offsetX,
            top: offsetY,
            width: element.width,
            height: element.height,
        };
    }
    return {
        left: offsetX,
        top: offsetY,
        width: parseInt(element.style.width),
        height: parseInt(element.style.height),
    };
}

function simulateTouch(x: number, y: number): void {
    let frameRect: { left: number; top: number; width: number; height: number };
    const inputManager = (window as any)._cc
        ? (window as any)._cc.inputManager
        : (cc as any).internal.inputManager;
    if (cc.sys.isBrowser) {
        frameRect = getElementRect(document.getElementById("GameCanvas"));
    } else {
        frameRect = cc.view.getFrameSize();
        frameRect.left = 0;
        frameRect.top = 0;
    }
    const viewport = cc.view.getViewportRect();
    const scaleX = cc.view.getScaleX();
    const scaleY = cc.view.getScaleY();
    const pixelRatio = cc.view.getDevicePixelRatio();
    const touchX = (x * scaleX + viewport.x) / pixelRatio + frameRect.left;
    const touchY = frameRect.top + frameRect.height - (y * scaleY + viewport.y) / pixelRatio;
    const touchPoint = cc.v2(touchX, touchY);
    cc.log("模拟点击坐标：" + touchPoint.x + ", " + touchPoint.y);
    const touch = inputManager.getTouchByXY(touchPoint.x, touchPoint.y, frameRect);
    inputManager.handleTouchesBegin([touch]);
    setTimeout(() => {
        inputManager.handleTouchesEnd([touch]);
    }, 200);
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class GodGuide extends cc.Component {
    @property(cc.Prefab)
    FINGER_PREFAB: cc.Prefab = null;

    @property(cc.Prefab)
    TEXT_PREFAB: cc.Prefab = null;

    _selector = "";
    stepId = 0;
    endTaskid = 1000;
    GodGuide: GodGuide = null;
    _targetNode: cc.Node = null;
    _debugNode: cc.Node = null;
    _autorun: cc.Label = null;
    _mask: cc.Mask = null;
    _maskBg: cc.Node = null;
    _task: GuideTask = null;
    _dispatchEvent: typeof cc.Node.prototype.dispatchEvent = null;
    _clickDelegate: (() => void) | null = null;
    _finger: cc.Node = null;
    _text: cc.Node = null;
    _recordSteps: RecordStep[] = null;
    VIDEO: cc.VideoPlayer = null;

    get selector(): string {
        return this._selector;
    }

    set selector(value: string) {
        this._selector = value;
        this.find(value);
    }

    get getGuideId(): number {
        return SystemDataSys.is_IOS_reviewer ? 1000 : PlayerDataSys.guide_id || 0;
    }

    run(callback?: () => void): void {
        if (this._task) {
            console.log("this._task.steps---------->", this._task.steps);
            async.eachSeries(this._task.steps, (step, next) => {
                const guideId = this.getGuideId;
                console.log("step.id---------->", step.id, ".id---------->", guideId);
                this.stepId = step.id;
                if (step.id <= guideId) {
                    if (this._task.debug) {
                        console.log("跳过步骤 " + step.desc);
                    }
                    next();
                } else {
                    this._processStep(step, next);
                }
            }, () => {
                this._task = null;
                cc.log("任务结束");
                this._mask.node.active = false;
                if (this._finger) {
                    this._finger.active = false;
                }
                callback && callback();
            });
        }
    }

    _processStep(step: GuideStep, done: () => void): void {
        async.series(
            {
                stepStart: (next) => {
                    if (step.onStart) {
                        step.onStart(() => next());
                    } else {
                        next();
                    }
                },
                stepCommand: (next) => {
                    this._mask.node.active = !!step.mask;
                    this._maskBg.opacity = step.blackMask ? 120 : 0;
                    this.scheduleOnce(() => {
                        if (step.blackMask2) {
                            this._maskBg.opacity = 120;
                        }
                        this._processStepCommand(step, () => next());
                    }, step.delayTime || 0);
                },
                taskEnd: (next) => {
                    this._mask._graphics.clear();
                    if (step.taskEndCloseMask) {
                        this._mask.node.active = false;
                    }
                    if (step.command.cmd == GodCommand.ANI && step.onEnd) {
                        // keep finger visible until onEnd
                    } else {
                        this._finger.active = false;
                    }
                    if (step.onEnd) {
                        step.onEnd(() => {
                            this._finger.active = false;
                            if (step.sound) {
                                AudioManager.getInstance().stopMusic(step.sound, false);
                            }
                            next();
                        });
                    } else {
                        if (step.sound) {
                            AudioManager.getInstance().stopMusic(step.sound, false);
                        }
                        next();
                    }
                },
            },
            () => {
                if (step.save) {
                    this.setGuideId(step.id);
                }
                SdkHelper.reportData("guide_id", { id: step.id });
                if (this._task.debug) {
                    console.log("步骤【" + step.desc + "】结束！");
                }
                done();
            }
        );
    }

    init(): void {
        this.node.setContentSize(cc.winSize);
        this._targetNode = null;
        if (this.FINGER_PREFAB) {
            this._finger = cc.instantiate(this.FINGER_PREFAB);
            this._finger.parent = this.node;
            this._finger.active = false;
        }
        if (this.TEXT_PREFAB) {
            this._text = cc.instantiate(this.TEXT_PREFAB);
            this._text.parent = this.node;
            this._text.active = false;
        }
        this._debugNode = this.node.getChildByName("debug");
        this._autorun = cc.find("autorun/Background/Label", this._debugNode).getComponent(cc.Label);
        this._autorun.string = "自动执行（关）";
        this._mask = this.node.getComponentInChildren(cc.Mask);
        this._maskBg = this._mask.node.getChildByName("bg");
        this._mask.inverted = true;
        this._mask.node.active = false;
        this.node.on(
            cc.Node.EventType.TOUCH_START,
            (event: cc.Event.EventTouch) => {
                if (this._dispatchEvent) {
                    this.node._touchListener.setSwallowTouches(false);
                } else if (this._mask.node.active) {
                    if (this._targetNode) {
                        if (this._targetNode.isValid) {
                            if (this._clickDelegate) {
                                this.node._touchListener.setSwallowTouches(false);
                                cc.log("允许点击任意位置，放行");
                                this._clickDelegate();
                            } else if (this._targetNode.getBoundingBoxToWorld().contains(event.getLocation())) {
                                this.node._touchListener.setSwallowTouches(false);
                                cc.log("命中目标节点，放行");
                            } else {
                                this.node._touchListener.setSwallowTouches(true);
                                cc.log("未命中目标节点，拦截");
                            }
                        } else {
                            cc.warn("节点被销毁了");
                            this.node._touchListener.setSwallowTouches(true);
                        }
                    } else {
                        this.node._touchListener.setSwallowTouches(true);
                    }
                } else {
                    this.node._touchListener.setSwallowTouches(false);
                }
            },
            this
        );
    }

    start(): void {
        cc.debug.setDisplayStats(false);
    }

    showText(text: string, showGirl: boolean, offsetX: number, offsetY: number, callback: () => void): void {
        this._text.once("click", callback);
        const textComp = this._text.getComponent(this.TEXT_PREFAB.name) as any;
        const position = cc.v3(0, 0, 0);
        if (offsetX) {
            position.x += offsetX;
        }
        if (offsetY) {
            position.y += offsetY;
        }
        textComp.setPos(position);
        textComp.setText(text, showGirl);
    }

    showVideo(): void {}

    showFingerText(
        target: cc.Node,
        text: string,
        offsetX: number,
        offsetY: number,
        showGirl: boolean
    ): void {
        const textComp = this._text.getComponent(this.TEXT_PREFAB.name) as any;
        const position = this.node.convertToNodeSpaceAR(target.parent.convertToWorldSpaceAR(target.position));
        if (offsetX) {
            position.x += offsetX;
        }
        if (offsetY) {
            position.y += offsetY;
        }
        textComp.setPos(position);
        textComp.setText(text, showGirl);
    }

    getNodeFullPath(node: cc.Node): string {
        const parts: string[] = [];
        let current = node;
        do {
            parts.unshift(current.name);
            current = current.parent;
        } while (current && current.name != "Canvas");
        return parts.join("/");
    }

    fingerToNode(target: cc.Node, fingerType: number, callback: () => void): void {
        if (!this._finger) {
            callback();
            return;
        }
        this._finger.active = true;
        const position = this.node.convertToNodeSpaceAR(target.parent.convertToWorldSpaceAR(target.position));
        this._finger.setPosition(position);
        this._finger.getComponent(GuideFinger).play(fingerType);
        callback();
    }

    getNodePoints(rect: cc.Rect, angle: number, origin: cc.Vec2): cc.Vec2[] {
        return getRectPoints(rect, angle, origin);
    }

    setAutorun(): void {
        if (this._task) {
            this._task.autorun = !this._task.autorun;
            this._autorun.string = "自动执行(" + (this._task.autorun ? "开" : "关") + ")";
        }
    }

    setGuideId(id: number): void {
        if (PlayerDataSys.guide_id != id) {
            PlayerDataSys.guide_id = id;
            GameServiceMgr.submitGuideLevel(id);
        }
    }

    startRecordNodeTouch(): void {
        if (this._task) {
            cc.warn("任务引导中，不能录制");
        } else if (this._dispatchEvent) {
            cc.warn("已经进入录制模式");
        } else {
            this._dispatchEvent = cc.Node.prototype.dispatchEvent;
            this._recordSteps = [];
            const guide = this;
            let lastTime = Date.now();
            cc.Node.prototype.dispatchEvent = function (event: cc.Event) {
                guide._dispatchEvent.call(this, event);
                if (!guide.isGuideNode(this) && event.type === cc.Node.EventType.TOUCH_END) {
                    const now = Date.now();
                    const delay = (now - lastTime) / 1000;
                    lastTime = now;
                    const path = guide.getNodeFullPath(this);
                    guide._recordSteps.push({
                        desc: "点击" + path,
                        command: {
                            cmd: "finger",
                            args: path,
                        },
                        delay,
                    });
                }
            };
        }
    }

    close(): void {
        this.node.active = false;
    }

    locateNodeByEvent(event: cc.Event.EventCustom): void {
        this._selector = event.getUserData() as string;
    }

    getTask(): GuideTask {
        return this._task;
    }

    find(selector: string, callback?: (node: cc.Node, rect?: cc.Rect) => void): void {
        Locator.locateNode(cc.find("Canvas"), selector, (error, node) => {
            if (error) {
                cc.log(error);
            } else {
                cc.log("定位节点成功", selector);
                const rect = this._focusToNode(node);
                callback && callback(node, rect);
            }
        });
    }

    fillPolygon(points: cc.Vec2[]): void {
        const first = points[0];
        this._mask._graphics.moveTo(first.x, first.y);
        points.slice(1).forEach((point) => {
            this._mask._graphics.lineTo(point.x, point.y);
        });
        this._mask._graphics.lineTo(first.x, first.y);
        this._mask._graphics.stroke();
        this._mask._graphics.fill();
    }

    isGuideNode(node: cc.Node): boolean {
        let current: cc.Node = node;
        do {
            if (current === this.node) {
                return true;
            }
        } while ((current = current.parent));
        return false;
    }

    stopRecordNodeTouch(): void {
        if (this._dispatchEvent) {
            cc.Node.prototype.dispatchEvent = this._dispatchEvent;
            this._dispatchEvent = null;
            cc.warn("退出录制状态");
        } else {
            cc.warn("未进入录制状态");
        }
    }

    touchSimulation(target: cc.Node, delay = 1): void {
        if (this._task.debug) {
            console.log("自动执行，模拟触摸");
        }
        this.scheduleOnce(() => {
            cc.log("自动节点 :", JSON.stringify(target.position));
            const worldPos = target.parent.convertToWorldSpaceAR(target.position);
            cc.log("世界节点 :", JSON.stringify(worldPos));
            simulateTouch(worldPos.x, worldPos.y);
        }, delay);
    }

    end(): void {
        this.stepId = 1000;
        this.setGuideId(this.stepId);
    }

    playRecordNodeTouch(autoRun?: boolean): void {
        this.stopRecordNodeTouch();
        if (this._recordSteps && this._recordSteps.length) {
            cc.log("生成任务：", JSON.stringify(this._recordSteps));
            const task: GuideTask = {
                autorun: !!autoRun,
                debug: true,
                steps: this._recordSteps as unknown as GuideStep[],
            };
            this._recordSteps = null;
            this.setTask(task);
            this.run();
        }
    }

    onLoad(): void {
        this.init();
        this.GodGuide = this;
    }

    fillPoints(points: cc.Vec2[]): void {
        const first = points[0];
        this._mask._graphics.moveTo(first.x, first.y);
        points.slice(1).forEach((point) => {
            this._mask._graphics.lineTo(point.x, point.y);
        });
        this._mask._graphics.lineTo(first.x, first.y);
        this._mask._graphics.stroke();
        this._mask._graphics.fill();
    }

    _processStepCommand(step: GuideStep, done: () => void): void {
        const handler = (GodCommand as any)[step.command.cmd];
        if (handler) {
            if (this._task.debug) {
                console.log(
                    "执行步骤【" + step.desc + "】指令: " + step.command.cmd + " time: " + cc.director.getTotalTime()
                );
            }
            if (step.sound) {
                AudioManager.getInstance().playMusic(step.sound);
            }
            handler(this, step, () => {
                if (this._task.debug) {
                    console.log(
                        "步骤【" +
                            step.desc +
                            "】指令: " +
                            step.command.cmd +
                            " 执行完毕 time: " +
                            cc.director.getTotalTime()
                    );
                }
                done();
            });
        } else {
            if (this._task.debug) {
                console.log("执行步骤【" + step.desc + "】指令: " + step.command.cmd + " 不存在！");
            }
            done();
        }
    }

    setTask(task: GuideTask): void {
        if (this._task) {
            cc.warn("当前任务还未处理完毕！");
        } else {
            this._debugNode.active = !!task.debugUI;
            this._autorun.string = "自动执行(" + (task.autorun ? "开" : "关") + ")";
            this._task = task;
        }
    }

    openPage(_pageName: string, callback: () => void): void {
        callback();
    }

    _focusToNode(node: cc.Node): cc.Rect {
        this._mask._graphics.clear();
        const worldRect = node.getBoundingBoxToWorld();
        const localOrigin = this.node.convertToNodeSpaceAR(worldRect.origin);
        worldRect.x = localOrigin.x;
        worldRect.y = localOrigin.y;
        this._mask._graphics.fillRect(worldRect.x, worldRect.y, worldRect.width, worldRect.height);
        return worldRect;
    }

    log(message: string): void {
        if (this._task.debug) {
            cc.log(message);
        }
    }
}
