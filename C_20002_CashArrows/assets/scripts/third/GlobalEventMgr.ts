import Singleton from "./Singleton";

export default class GlobalEventMgr extends Singleton {
    event = new cc.EventTarget();

    on(event: string, callback: Function, target?: any, useCapture?: boolean): void {
        if (useCapture === undefined) {
            useCapture = false;
        }
        this.event.on(event, callback, target, useCapture);
    }

    once(event: string, callback: Function, target?: any): void {
        this.event.once(event, callback, target);
    }

    off(event: string, callback?: Function, target?: any): void {
        this.event.off(event, callback, target);
    }

    targetOff(target: any): void {
        this.event.targetOff(target);
    }

    emit(event: string, ...args: any[]): void {
        this.event.emit(event, ...args);
    }
}
