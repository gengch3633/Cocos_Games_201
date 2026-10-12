import Handler from "./Handler";

export const CLOSE_RECONNECT = "CLOSE_RECONNECT";

class EventHandler extends Handler {
    private static _pool: EventHandler[] = [];

    private _dispatcher: EventDispatcher = null;
    private _type: string = null;

    public constructor(caller: any, method: Function, args: any[], once: boolean) {
        super(caller, method, args, once);
    }

    public recover(): void {
        if (this._id > 0) {
            this._id = 0;
            EventHandler._pool.push(this.clear() as EventHandler);
        }
    }

    public register(dispatcher: EventDispatcher, type: string): void {
        this._dispatcher = dispatcher;
        this._type = type;
    }

    public check(dispatcher: EventDispatcher, type: string): boolean {
        return !((this._dispatcher && this._dispatcher !== dispatcher) || (this._type && this._type !== type));
    }

    public static create(caller: any, method: Function, args: any[] = null, once: boolean = true): EventHandler {
        if (EventHandler._pool.length > 0) {
            const handler = EventHandler._pool.pop();
            handler.setTo(caller, method, args, once);
            return handler;
        }
        return new EventHandler(caller, method, args, once);
    }
}

class EventDispatcher {
    private _events: { [type: string]: EventHandler | EventHandler[] } = null;

    public event(type: string, data: any = null): boolean {
        if (!this._events || !this._events[type]) {
            return false;
        }

        const listeners = this._events[type];
        if (Array.isArray(listeners)) {
            for (let i = 0, len = listeners.length; i < len; i++) {
                const handler = listeners[i];
                if (handler && handler.check(this, type)) {
                    if (data != null) {
                        handler.runWith(data);
                    } else {
                        handler.run();
                    }
                }
                if (!handler || handler.once) {
                    listeners.splice(i, 1);
                    i--;
                    len--;
                }
            }
            if (listeners.length === 0) {
                delete this._events[type];
            }
        } else {
            if (listeners.once) {
                delete this._events[type];
            }
            if (listeners.check(this, type)) {
                if (data != null) {
                    listeners.runWith(data);
                } else {
                    listeners.run();
                }
            }
        }
        return true;
    }

    public on(type: string, caller: any, listener: Function, args: any[] = null): this {
        return this._createListener(type, caller, listener, args, false);
    }

    public off(type: string, caller: any, listener: Function, onceOnly: boolean = false): this {
        if (!this._events || !this._events[type]) {
            return this;
        }

        const handlers = this._events[type];
        if (Array.isArray(handlers)) {
            for (let i = 0; i < handlers.length; i++) {
                const handler = handlers[i];
                if (handler && (!caller || handler.caller === caller) && (listener == null || handler.method === listener) && (!onceOnly || handler.once)) {
                    handlers.splice(i, 1);
                    i--;
                    handler.recover();
                }
            }
            if (handlers.length === 0) {
                delete this._events[type];
            }
        } else if (handlers) {
            if ((!caller || handlers.caller === caller) && (listener == null || handlers.method === listener) && (!onceOnly || handlers.once)) {
                delete this._events[type];
                handlers.recover();
            }
        }
        return this;
    }

    public offAllCaller(caller: any): this {
        if (caller && this._events) {
            for (const type in this._events) {
                this.off(type, caller, null);
            }
        }
        return this;
    }

    private _createListener(type: string, caller: any, listener: Function, args: any[] = null, once: boolean, offBefore: boolean = true): this {
        if (offBefore) {
            this.off(type, caller, listener, once);
        }
        const handler = EventHandler.create(caller || this, listener, args, once);
        handler.register(this, type);

        if (!this._events) {
            this._events = {};
        }
        const handlers = this._events;
        const existing = handlers[type];
        if (!existing) {
            handlers[type] = handler;
        } else if (Array.isArray(existing)) {
            existing.push(handler);
        } else {
            handlers[type] = [existing, handler];
        }
        return this;
    }
}

export default class EventSystem {
    public static dispatcher: EventDispatcher = new EventDispatcher();

    public static listen(type: string, listener: Function, caller: any, args: any[] = null): void {
        this.dispatcher.off(type, caller, listener);
        this.dispatcher.on(type, caller, listener, args);
    }

    public static ignore(type: string, listener: Function, caller: any): void {
        this.dispatcher.off(type, caller, listener, false);
    }

    public static trigger(type: string, data: any = null): void {
        this.dispatcher.event(type, data);
    }

    public static ignoreAll(caller: any): void {
        this.dispatcher.offAllCaller(caller);
    }
}