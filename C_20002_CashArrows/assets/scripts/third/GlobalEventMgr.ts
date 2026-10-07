import Singleton from "./Singleton";

export default class GlobalEventMgr extends Singleton {
    event = new cc.EventTarget();

    on(type: string, callback: Function, target: any, useCapture: boolean = false): void {
        this.event.on(type, callback, target, useCapture);
    }

    once(type: string, callback: Function, target: any): void {
        this.event.once(type, callback, target);
    }

    off(type: string, callback: Function, target: any): void {
        this.event.off(type, callback, target);
    }

    targetOff(target: any): void {
        this.event.targetOff(target);
    }

    emit(type: string, ...args: any[]): void {
        this.event.emit(type, ...args);
    }
}
