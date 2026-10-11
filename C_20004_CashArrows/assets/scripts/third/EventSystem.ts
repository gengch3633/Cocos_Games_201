import Handler from "./Handler";

export const CLOSE_RECONNECT = "CLOSE_RECONNECT";

class EventHandler extends Handler {
    public _dispatcher: EventDispatcher = null;
    public _type: string = null;

    constructor(caller: any, method: Function, args: any[], once: boolean) {
        super(caller, method, args, once);
    }

    public recover(): void {
        if (this._id > 0) {
            this._id = 0;
            EventHandler._pool.push(this.clear());
        }
    }

    public register(dispatcher: EventDispatcher, type: string): void {
        this._dispatcher = dispatcher;
        this._type = type;
    }

    public check(dispatcher: EventDispatcher, type: string): boolean {
        return !((this._dispatcher && this._dispatcher != dispatcher) || (this._type && this._type != type));
    }

    public static create(caller: any, method: Function, args: any[] = null, once: boolean = true): EventHandler {
        if (EventHandler._pool.length) {
            return EventHandler._pool.pop().setTo(caller, method, args, once);
        }
        return new EventHandler(caller, method, args, once);
    }

    public static _pool: EventHandler[] = [];
}

class EventDispatcher {
    public _events: any = null;

    public event(type: string, data: any = null): boolean {
        if (!this._events || !this._events[type]) {
            return false;
        }
        const list = this._events[type];
        if (list.run) {
            if (list.once) {
                delete this._events[type];
            }
            if (list.check(this, type)) {
                if (null != data) {
                    list.runWith(data);
                } else {
                    list.run();
                }
            }
        } else {
            for (let i = 0, len = list.length; i < len; i++) {
                const handler = list[i];
                if (handler && handler.check(this, type)) {
                    if (null != data) {
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
            if (0 === list.length && this._events) {
                delete this._events[type];
            }
        }
        return true;
    }

    public on(type: string, caller: any, method: Function, once: boolean = null): EventDispatcher {
        return this._createListener(type, caller, method, once, false);
    }

    public _createListener(type: string, caller: any, method: Function, once: any, isOff: boolean, check: boolean = true): EventDispatcher {
        if (check) {
            this.off(type, caller, method, isOff);
        }
        const handler = EventHandler.create(caller || this, method, once, isOff);
        handler.register(this, type);
        if (!this._events) {
            this._events = {};
        }
        const events = this._events;
        if (events[type]) {
            if (events[type].run) {
                events[type] = [events[type], handler];
            } else {
                events[type].push(handler);
            }
        } else {
            events[type] = handler;
        }
        return this;
    }

    public off(type: string, caller: any, method: Function, once: boolean = false): EventDispatcher {
        if (!this._events || !this._events[type]) {
            return this;
        }
        const list = this._events[type];
        if (null != list) {
            if (list.run) {
                if ((!caller || list.caller === caller) && (null == method || list.method === method) && (!once || list.once)) {
                    delete this._events[type];
                    list.recover();
                }
            } else {
                for (let i = 0; i < list.length; i++) {
                    const handler = list[i];
                    if (handler && (!caller || handler.caller === caller) && (null == method || handler.method === method) && (!once || handler.once)) {
                        list.splice(i, 1);
                        i--;
                        handler.recover();
                    }
                }
                if (0 === list.length) {
                    delete this._events[type];
                }
            }
        }
        return this;
    }

    public offAllCaller(caller: any): EventDispatcher {
        if (caller && this._events) {
            for (const type in this._events) {
                this.off(type, caller, null);
            }
        }
        return this;
    }
}

class EventSystem {
    public static dispatcher: EventDispatcher = new EventDispatcher();

    public static listen(type: string, caller: any, method: Function, once: any): void {
        this.dispatcher.off(type, method, caller);
        this.dispatcher.on(type, method, caller, once);
    }

    public static ignore(type: string, caller: any, method: Function): void {
        this.dispatcher.off(type, method, caller, false);
    }

    public static trigger(type: string, data?: any): void {
        this.dispatcher.event(type, data);
    }

    public static ignoreAll(caller: any): void {
        this.dispatcher.offAllCaller(caller);
    }
}

export default EventSystem;