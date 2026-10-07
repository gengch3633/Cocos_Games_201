import EventDispatcher from "./EventDispatcher";

const { ccclass } = cc._decorator;

@ccclass
export default class EventMgr {
    static ignoreAllByCaller(caller: any): void {
        EventMgr.dispatcher.offAllCaller(caller);
    }

    static listen(event: string, method: Function, caller: any, args?: any): void {
        EventMgr.dispatcher.off(event, caller, method);
        EventMgr.dispatcher.on(event, caller, method, args);
    }

    static trigger(event: string, data?: any): void {
        EventMgr.dispatcher.event(event, data);
    }

    static ignore(event: string, method: Function, caller: any): void {
        EventMgr.dispatcher.off(event, caller, method, false);
    }

    static ignoreAllByEvent(event: string): void {
        EventMgr.dispatcher.offAll(event);
    }

    static dispatcher: EventDispatcher = new EventDispatcher();
}
