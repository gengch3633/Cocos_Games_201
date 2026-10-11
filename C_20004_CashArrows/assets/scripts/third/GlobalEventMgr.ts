import Singleton from "./Singleton";

export default class GlobalEventMgr extends Singleton {
    public event: cc.EventTarget = new cc.EventTarget();

    public on(eventName: string, callback: (...args: any[]) => void, target?: any, useCapture: boolean = false): void {
        this.event.on(eventName, callback, target, useCapture);
    }

    public once(eventName: string, callback: (...args: any[]) => void, target?: any): void {
        this.event.once(eventName, callback, target);
    }

    public off(eventName: string, callback?: (...args: any[]) => void, target?: any): void {
        this.event.off(eventName, callback, target);
    }

    public targetOff(target: any): void {
        this.event.targetOff(target);
    }

    public emit(eventName: string, ...args: any[]): void {
        this.event.emit(eventName, ...args);
    }
}