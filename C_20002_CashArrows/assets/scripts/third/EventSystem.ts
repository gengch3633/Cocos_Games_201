import Handler from "./Handler";

export const CLOSE_RECONNECT = "CLOSE_RECONNECT";

class EventHandler extends Handler {
    _dispatcher: EventDispatcher | null = null;
    _type: string | null = null;

    constructor(caller: any, method: Function | null, args: any[] | null, once: boolean) {
        super(caller, method, args, once);
    }

    recover(): void {
        if (this._id > 0) {
            this._id = 0;
            EventHandler._pool.push(this.clear() as EventHandler);
        }
    }

    register(dispatcher: EventDispatcher, type: string): void {
        this._dispatcher = dispatcher;
        this._type = type;
    }

    check(dispatcher: EventDispatcher, type: string): boolean {
        return !(this._dispatcher && this._dispatcher !== dispatcher || this._type && this._type !== type);
    }

    static _pool: EventHandler[] = [];

    static create(caller: any, method: Function | null, args: any[] | null = null, once: boolean = true): EventHandler {
        return EventHandler._pool.length
            ? (EventHandler._pool.pop() as EventHandler).setTo(caller, method, args, once) as EventHandler
            : new EventHandler(caller, method, args, once);
    }
}

class EventDispatcher {
    _events: { [key: string]: EventHandler | EventHandler[] } | null = null;

    event(type: string, data: any = null): boolean {
        if (!this._events || !this._events[type]) {
            return false;
        }
        const handlers = this._events[type];
        if ((handlers as EventHandler).run) {
            const handler = handlers as EventHandler;
            if (handler.once) {
                delete this._events[type];
            }
            if (handler.check(this, type)) {
                if (data != null) {
                    handler.runWith(data);
                } else {
                    handler.run();
                }
            }
        } else {
            const list = handlers as EventHandler[];
            for (let i = 0, len = list.length; i < len; i++) {
                const handler = list[i];
                if (handler && handler.check(this, type)) {
                    if (data != null) {
                        handler.runWith(data);
                    } else {
                        handler.run();
                    }
                }
                if (!handler || handler.once) {
                    list.splice(i, 1);
                    i--;
                    len--;
                }
            }
            if (list.length === 0 && this._events) {
                delete this._events[type];
            }
        }
        return true;
    }

    on(type: string, caller: any, method: Function, args: any[] | null = null): this {
        return this._createListener(type, caller, method, args, false);
    }

    _createListener(
        type: string,
        caller: any,
        method: Function,
        args: any[] | null,
        once: boolean,
        offBefore: boolean = true
    ): this {
        if (offBefore) {
            this.off(type, caller, method, once);
        }
        const handler = EventHandler.create(caller || this, method, args, once);
        handler.register(this, type);
        if (!this._events) {
            this._events = {};
        }
        const events = this._events;
        if (events[type]) {
            if ((events[type] as EventHandler).run) {
                events[type] = [events[type] as EventHandler, handler];
            } else {
                (events[type] as EventHandler[]).push(handler);
            }
        } else {
            events[type] = handler;
        }
        return this;
    }

    off(type: string, caller: any, method: Function | null, onceOnly: boolean = false): this {
        if (!this._events || !this._events[type]) {
            return this;
        }
        const handlers = this._events[type];
        if (handlers != null) {
            if ((handlers as EventHandler).run) {
                const handler = handlers as EventHandler;
                if ((!caller || handler.caller === caller) &&
                    (method == null || handler.method === method) &&
                    (!onceOnly || handler.once)) {
                    delete this._events[type];
                    handler.recover();
                }
            } else {
                const list = handlers as EventHandler[];
                for (let i = 0; i < list.length; i++) {
                    const handler = list[i];
                    if (handler &&
                        (!caller || handler.caller === caller) &&
                        (method == null || handler.method === method) &&
                        (!onceOnly || handler.once)) {
                        list.splice(i, 1);
                        i--;
                        handler.recover();
                    }
                }
                if (list.length === 0) {
                    delete this._events[type];
                }
            }
        }
        return this;
    }

    offAllCaller(caller: any): this {
        if (caller && this._events) {
            for (const type in this._events) {
                this.off(type, caller, null);
            }
        }
        return this;
    }
}

export default class EventSystem {
    static dispatcher = new EventDispatcher();

    static listen(event: string, handler: Function, target: any, once?: boolean): void {
        this.dispatcher.off(event, target, handler);
        this.dispatcher.on(event, target, handler, once);
    }

    static ignore(event: string, handler: Function, target: any): void {
        this.dispatcher.off(event, target, handler, false);
    }

    static trigger(event: string, data?: any): void {
        this.dispatcher.event(event, data);
    }

    static ignoreAll(target: any): void {
        this.dispatcher.offAllCaller(target);
    }
}
