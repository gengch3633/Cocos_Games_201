import Singleton from "./Singleton";

export default class GlobalEventMgr extends Singleton {
    event = new cc.EventTarget();

    on(type: any, callback: any, target: any, useCapture: boolean = false) {
        this.event.on(type, callback, target, useCapture);
    }

    once(type: any, callback: any, target: any) {
        this.event.once(type, callback, target);
    }

    off(type: any, callback: any, target: any) {
        this.event.off(type, callback, target);
    }

    targetOff(target: any) {
        this.event.targetOff(target);
    }

    emit(type: any, ...args: any[]) {
        const event = this.event;
        event.emit.apply(event, [type, ...args]);
    }
}
