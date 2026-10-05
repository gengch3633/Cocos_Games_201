import EventDispatcher from "./EventDispatcher";

const { ccclass } = cc._decorator;

@ccclass
export default class EventMgr {
    static dispatcher = new EventDispatcher();

    static ignoreAllByCaller(caller: unknown): void {
        this.dispatcher.offAllCaller(caller);
    }

    static listen(event: string, method: Function, caller: unknown, args: unknown = null): void {
        this.dispatcher.off(event, caller, method);
        this.dispatcher.on(event, caller, method, args);
    }

    static trigger(event: string, data?: unknown): void {
        this.dispatcher.event(event, data);
    }

    static ignore(event: string, method: Function, caller: unknown): void {
        this.dispatcher.off(event, caller, method, false);
    }

    static ignoreAllByEvent(event: string): void {
        this.dispatcher.offAll(event);
    }
}
