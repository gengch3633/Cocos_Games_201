import AudioManager from "./AudioManager";
import GameServiceMgr from "./GameServiceMgr";
import { GodCommand } from "./GodCommand";
import GuideFinger from "./GuideFinger";
import { Locator } from "./Locator";
import PlayerDataSys from "./PlayerDataSys";
import SdkHelper from "./SdkHelper";
import SystemDataSys from "./SystemDataSys";

declare const async: any;

const { ccclass, property } = cc._decorator;

const DEG_TO_RAD = 2 * Math.PI / 360;

function rotatePoint(point, angle, origin) {
    const result = cc.v2();
    const rad = -angle * DEG_TO_RAD;
    result.x = (point.x - origin.x) * Math.cos(rad) - (point.y - origin.y) * Math.sin(rad) + origin.x;
    result.y = (point.x - origin.x) * Math.sin(rad) + (point.y - origin.y) * Math.cos(rad) + origin.y;
    return result;
}

function rectCorners(rect, angle, origin) {
    return [cc.v2(rect.x, rect.y), cc.v2(rect.x + rect.width, rect.y), cc.v2(rect.x + rect.width, rect.y + rect.height), cc.v2(rect.x, rect.y + rect.height)].map(function (point) {
        return rotatePoint(point, angle, origin);
    });
}

function getCanvasRect(element) {
    const doc = document.documentElement;
    const offsetX = window.pageXOffset - doc.clientLeft;
    const offsetY = window.pageYOffset - doc.clientTop;
    if ("function" == typeof element.getBoundingClientRect) {
        const rect = element.getBoundingClientRect();
        return {
            left: rect.left + offsetX,
            top: rect.top + offsetY,
            width: rect.width,
            height: rect.height
        };
    }
    if (element instanceof HTMLCanvasElement) {
        return {
            left: offsetX,
            top: offsetY,
            width: element.width,
            height: element.height
        };
    }
    return {
        left: offsetX,
        top: offsetY,
        width: parseInt(element.style.width),
        height: parseInt(element.style.height)
    };
}

function simulateClick(x, y) {
    let frame;
    const inputManager = (window as any)._cc ? (window as any)._cc.inputManager : (cc as any).internal.inputManager;
    if (cc.sys.isBrowser) {
        frame = getCanvasRect(document.getElementById("GameCanvas"));
    } else {
        frame = cc.view.getFrameSize();
        frame.left = 0;
        frame.top = 0;
    }
    const viewport = cc.view.getViewportRect();
    const scaleX = cc.view.getScaleX();
    const scaleY = cc.view.getScaleY();
    const ratio = cc.view.getDevicePixelRatio();
    const px = (x * scaleX + viewport.x) / ratio + frame.left;
    const py = frame.top + frame.height - (y * scaleY + viewport.y) / ratio;
    const point = cc.v2(px, py);
    cc.log("模拟点击坐标：" + point.x + ", " + point.y);
    const touch = inputManager.getTouchByXY(point.x, point.y, frame);
    inputManager.handleTouchesBegin([touch]);
    setTimeout(function () {
        inputManager.handleTouchesEnd([touch]);
    }, 200);
}

export const TouchType = cc.Enum({
    Click: 0,
    DragHorizontal: 1,
    DragVertical: 2
});

@ccclass
export default class GodGuide extends cc.Component {

    _selector = "";
    stepId = 0;

    @property(cc.Prefab)
    FINGER_PREFAB: cc.Prefab = null;

    @property(cc.Prefab)
    TEXT_PREFAB: cc.Prefab = null;

    endTaskid = 1e3;
    GodGuide = null;
    _targetNode = null;
    _debugNode = null;
    _autorun = null;
    _mask = null;
    _maskBg = null;
    _task = null;
    _dispatchEvent = null;
    _clickDelegate = null;
    _finger = null;
    _text = null;
    _recordSteps = null;

    get selector() {
        return this._selector;
    }

    set selector(value) {
        this._selector = value;
        this.find(value);
    }

    get getGuideId() {
        return SystemDataSys.is_IOS_reviewer ? 1e3 : PlayerDataSys.guide_id || 0;
    }

    run(callback) {
        const self = this;
        if (this._task) {
            console.log("this._task.steps----------\x3e", this._task.steps);
            async.eachSeries(this._task.steps, function (step, next) {
                const guideId = self.getGuideId;
                console.log("step.id----------\x3e", step.id, ".id----------\x3e", guideId);
                self.stepId = step.id;
                if (step.id <= guideId) {
                    self._task.debug && console.log("跳过步骤 " + step.desc);
                    next();
                } else {
                    self._processStep(step, next);
                }
            }, function () {
                self._task = null;
                cc.log("任务结束");
                self._mask.node.active = false;
                self._finger && (self._finger.active = false);
                callback && callback();
            });
        }
    }

    _processStep(step, done) {
        const self = this;
        async.series({
            stepStart: function (next) {
                if (step.onStart) {
                    step.onStart(function () {
                        next();
                    });
                } else {
                    next();
                }
            },
            stepCommand: function (next) {
                self._mask.node.active = step.mask;
                self._maskBg.opacity = step.blackMask ? 120 : 0;
                self.scheduleOnce(function () {
                    step.blackMask2 && (self._maskBg.opacity = 120);
                    self._processStepCommand(step, function () {
                        next();
                    });
                }, step.delayTime || 0);
            },
            taskEnd: function (next) {
                self._mask._graphics.clear();
                step.taskEndCloseMask && (self._mask.node.active = false);
                step.command.cmd == GodCommand.ANI && step.onEnd || (self._finger.active = false);
                if (step.onEnd) {
                    step.onEnd(function () {
                        self._finger.active = false;
                        step.sound && AudioManager.getInstance().stopMusic(step.sound, false);
                        next();
                    });
                } else {
                    step.sound && AudioManager.getInstance().stopMusic(step.sound, false);
                    next();
                }
            }
        }, function () {
            step.save && self.setGuideId(step.id);
            SdkHelper.reportData("guide_id", {
                id: step.id
            });
            self._task.debug && console.log("步骤【" + step.desc + "】结束！");
            done();
        });
    }

    init() {
        const self = this;
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
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            if (self._dispatchEvent) {
                (self.node as any)._touchListener.setSwallowTouches(false);
            } else if (self._mask.node.active) {
                if (self._targetNode) {
                    if (self._targetNode.isValid) {
                        if (self._clickDelegate) {
                            (self.node as any)._touchListener.setSwallowTouches(false);
                            cc.log("允许点击任意位置，放行");
                            self._clickDelegate();
                        } else if (self._targetNode.getBoundingBoxToWorld().contains(event.getLocation())) {
                            (self.node as any)._touchListener.setSwallowTouches(false);
                            cc.log("命中目标节点，放行");
                        } else {
                            (self.node as any)._touchListener.setSwallowTouches(true);
                            cc.log("未命中目标节点，拦截");
                        }
                    } else {
                        cc.warn("节点被销毁了");
                        (self.node as any)._touchListener.setSwallowTouches(true);
                    }
                } else {
                    (self.node as any)._touchListener.setSwallowTouches(true);
                }
            } else {
                (self.node as any)._touchListener.setSwallowTouches(false);
            }
        }, this);
    }

    start() {
        cc.debug.setDisplayStats(false);
    }

    showText(text, showGirl, offsetX, offsetY, callback) {
        this._text.once("click", callback);
        const textComp = this._text.getComponent(this.TEXT_PREFAB.name);
        const pos = cc.v3(0, 0, 0);
        offsetX && (pos.x += offsetX);
        offsetY && (pos.y += offsetY);
        textComp.setPos(pos);
        textComp.setText(text, showGirl);
    }

    showVideo() {
    }

    showFingerText(node, text, offsetX, offsetY, showGirl) {
        const textComp = this._text.getComponent(this.TEXT_PREFAB.name);
        const pos = this.node.convertToNodeSpaceAR(node.parent.convertToWorldSpaceAR(node.position));
        offsetX && (pos.x += offsetX);
        offsetY && (pos.y += offsetY);
        textComp.setPos(pos);
        textComp.setText(text, showGirl);
    }

    getNodeFullPath(node) {
        const names = [];
        let current = node;
        do {
            names.unshift(current.name);
            current = current.parent;
        } while (current && "Canvas" !== current.name);
        return names.join("/");
    }

    fingerToNode(node, touchType, callback) {
        this._finger || callback();
        this._finger.active = true;
        const pos = this.node.convertToNodeSpaceAR(node.parent.convertToWorldSpaceAR(node.position));
        this._finger.position = pos;
        this._finger.getComponent(GuideFinger).play(touchType);
        callback();
    }

    getNodePoints(rect, angle, origin) {
        return rectCorners(rect, angle, origin).map(function (point) {
            return point;
        });
    }

    setAutorun() {
        if (this._task) {
            this._task.autorun = !this._task.autorun;
            this._autorun.string = "自动执行(" + (this._task.autorun ? "开" : "关") + ")";
        }
    }

    setGuideId(id) {
        if (PlayerDataSys.guide_id != id) {
            PlayerDataSys.guide_id = id;
            GameServiceMgr.submitGuideLevel(id);
        }
    }

    startRecordNodeTouch() {
        if (this._task) {
            cc.warn("任务引导中，不能录制");
        } else if (this._dispatchEvent) {
            cc.warn("已经进入录制模式");
        } else {
            this._dispatchEvent = cc.Node.prototype.dispatchEvent;
            this._recordSteps = [];
            const self = this;
            let time = Date.now();
            cc.Node.prototype.dispatchEvent = function (event) {
                self._dispatchEvent.call(this, event);
                if (!self.isGuideNode(this) && event.type === cc.Node.EventType.TOUCH_END) {
                    const now = Date.now();
                    const delay = (now - time) / 1e3;
                    time = now;
                    const path = self.getNodeFullPath(this);
                    self._recordSteps.push({
                        desc: "点击" + path,
                        command: {
                            cmd: "finger",
                            args: path
                        },
                        delay: delay
                    });
                }
            };
        }
    }

    close() {
        this.node.active = false;
    }

    locateNodeByEvent(editBox) {
        this._selector = editBox.string;
    }

    getTask() {
        return this._task;
    }

    find(locator, callback) {
        const self = this;
        Locator.locateNode(cc.find("Canvas"), locator, function (err, node) {
            if (err) {
                cc.log(err);
            } else {
                cc.log("定位节点成功", locator);
                const rect = self._focusToNode(node);
                callback && callback(node, rect);
            }
        });
    }

    fillPolygon(points) {
        const self = this;
        const first = points[0];
        this._mask._graphics.moveTo(first.x, first.y);
        points.slice(1).forEach(function (point) {
            self._mask._graphics.lineTo(point.x, point.y);
        });
        this._mask._graphics.lineTo(first.x, first.y);
        this._mask._graphics.stroke();
        this._mask._graphics.fill();
    }

    isGuideNode(node) {
        let found = false;
        let current = node;
        do {
            if (current === this.node) {
                found = true;
                break;
            }
        } while (current = current.parent);
        return found;
    }

    stopRecordNodeTouch() {
        if (this._dispatchEvent) {
            cc.Node.prototype.dispatchEvent = this._dispatchEvent;
            this._dispatchEvent = null;
            cc.warn("退出录制状态");
        } else {
            cc.warn("未进入录制状态");
        }
    }

    touchSimulation(node, delay?) {
        if (undefined === delay) {
            delay = 1;
        }
        this._task.debug && console.log("自动执行，模拟触摸");
        this.scheduleOnce(function () {
            cc.log("自动节点 :", JSON.stringify(node.position));
            const world = node.parent.convertToWorldSpaceAR(node.position);
            cc.log("世界节点 :", JSON.stringify(world));
            simulateClick(world.x, world.y);
        }, delay);
    }

    end() {
        this.stepId = 1e3;
        this.setGuideId(this.stepId);
    }

    playRecordNodeTouch(unused, autorun) {
        this.stopRecordNodeTouch();
        if (this._recordSteps && this._recordSteps.length) {
            cc.log("生成任务：", JSON.stringify(this._recordSteps));
            const task = {
                autorun: !!autorun,
                debug: true,
                steps: this._recordSteps
            };
            this._recordSteps = null;
            this.setTask(task);
            this.run();
        }
    }

    onLoad() {
        this.init();
        this.GodGuide = this;
    }

    fillPoints(points) {
        const self = this;
        const first = points[0];
        this._mask._graphics.moveTo(first.x, first.y);
        points.slice(1).forEach(function (point) {
            self._mask._graphics.lineTo(point.x, point.y);
        });
        this._mask._graphics.lineTo(first.x, first.y);
        this._mask._graphics.stroke();
        this._mask._graphics.fill();
    }

    _processStepCommand(step, done) {
        const self = this;
        const command = GodCommand[step.command.cmd];
        if (command) {
            this._task.debug && console.log("执行步骤【" + step.desc + "】指令: " + step.command.cmd + " time: " + cc.director.getTotalTime());
            step.sound && AudioManager.getInstance().playMusic(step.sound);
            command(this, step, function () {
                self._task.debug && console.log("步骤【" + step.desc + "】指令: " + step.command.cmd + " 执行完毕 time: " + cc.director.getTotalTime());
                done();
            });
        } else {
            this._task.debug && console.log("执行步骤【" + step.desc + "】指令: " + step.command.cmd + " 不存在！");
            done();
        }
    }

    setTask(task) {
        if (this._task) {
            cc.warn("当前任务还未处理完毕！");
        } else {
            this._debugNode.active = !!task.debugUI;
            this._autorun.string = "自动执行(" + (task.autorun ? "开" : "关") + ")";
            this._task = task;
        }
    }

    openPage(name, callback) {
        callback();
    }

    _focusToNode(node) {
        this._mask._graphics.clear();
        const rect = node.getBoundingBoxToWorld();
        const origin = this.node.convertToNodeSpaceAR(rect.origin);
        rect.x = origin.x;
        rect.y = origin.y;
        this._mask._graphics.fillRect(rect.x, rect.y, rect.width, rect.height);
        return rect;
    }

    log(message) {
        this._task.debug && cc.log(message);
    }
}
