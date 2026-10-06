import Singleton from "./Singleton";

export default class GlobalEventMgr extends Singleton {
    event = new cc.EventTarget();

    on(event: string, callback: (...args: unknown[]) => void, target?: unknown, useCapture = false): void {
        this.event.on(event, callback, target, useCapture);
    }

    once(event: string, callback: (...args: unknown[]) => void, target?: unknown): void {
        this.event.once(event, callback, target);
    }

    off(event: string, callback: (...args: unknown[]) => void, target?: unknown): void {
        this.event.off(event, callback, target);
    }

    targetOff(target: unknown): void {
        this.event.targetOff(target);
    }

    emit(event: string, ...args: unknown[]): void {
        this.event.emit(event, ...args);
    }
}
