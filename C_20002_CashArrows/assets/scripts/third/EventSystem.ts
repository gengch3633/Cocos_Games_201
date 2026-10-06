import Handler from "./Handler";

export const CLOSE_RECONNECT = "CLOSE_RECONNECT";

class EventListener extends Handler {
    _dispatcher: EventDispatcher | null = null;
    _type = "";

    constructor(caller?: unknown, method?: (...args: unknown[]) => void, args?: unknown[] | null, once?: boolean) {
        super(caller, method, args, once);
    }

    recover(): void {
        if (this._id > 0) {
            this._id = 0;
            EventListener._pool.push(this.clear());
        }
    }

    register(dispatcher: EventDispatcher, type: string): void {
        this._dispatcher = dispatcher;
        this._type = type;
    }

    check(dispatcher: EventDispatcher, type: string): boolean {
        return !((this._dispatcher && this._dispatcher !== dispatcher) || (this._type && this._type !== type));
    }

    static create(caller: unknown, method: (...args: unknown[]) => void, args?: unknown[] | null, once = true): EventListener {
        if (EventListener._pool.length) {
            return EventListener._pool.pop()!.setTo(caller, method, args, once) as EventListener;
        }
        return new EventListener(caller, method, args, once);
    }

    static _pool: EventListener[] = [];
}

class EventDispatcher {
    _events: Record<string, EventListener | EventListener[]> = {};

    event(type: string, data: unknown = null): boolean {
        if (!this._events || !this._events[type]) {
            return false;
        }

        const listeners = this._events[type];
        if ((listeners as EventListener).run) {
            const listener = listeners as EventListener;
            if (listener.once) {
                delete this._events[type];
            }
            if (listener.check(this, type)) {
                if (data != null) {
                    listener.runWith(data);
                } else {
                    listener.run();
                }
            }
        } else {
            const list = listeners as EventListener[];
            for (let i = 0; i < list.length; i++) {
                const listener = list[i];
                if (listener && listener.check(this, type)) {
                    if (data != null) {
                        listener.runWith(data);
                    } else {
                        listener.run();
                    }
                }
                if (!listener || listener.once) {
                    list.splice(i, 1);
                    i--;
                }
            }
            if (list.length === 0 && this._events) {
                delete this._events[type];
            }
        }
        return true;
    }

    on(type: string, caller: unknown, method: (...args: unknown[]) => void, args: unknown[] | null = null): this {
        return this._createListener(type, caller, method, args, false);
    }

    _createListener(
        type: string,
        caller: unknown,
        method: (...args: unknown[]) => void,
        args: unknown[] | null,
        once: boolean,
        replaceExisting = true,
    ): this {
        if (replaceExisting) {
            this.off(type, caller, method, once);
        }
        const listener = EventListener.create(caller || this, method, args, once);
        listener.register(this, type);
        if (!this._events) {
            this._events = {};
        }
        const current = this._events[type];
        if (current) {
            if ((current as EventListener).run) {
                this._events[type] = [current as EventListener, listener];
            } else {
                (current as EventListener[]).push(listener);
            }
        } else {
            this._events[type] = listener;
        }
        return this;
    }

    off(type: string, caller: unknown, method: (...args: unknown[]) => void, once = false): this {
        if (!this._events || !this._events[type]) {
            return this;
        }
        const listeners = this._events[type];
        if (listeners != null) {
            if ((listeners as EventListener).run) {
                const listener = listeners as EventListener;
                if ((!caller || listener.caller === caller) && (method == null || listener.method === method) && (!once || listener.once)) {
                    delete this._events[type];
                    listener.recover();
                }
            } else {
                const list = listeners as EventListener[];
                for (let i = 0; i < list.length; i++) {
                    const listener = list[i];
                    if (listener && (!caller || listener.caller === caller) && (method == null || listener.method === method) && (!once || listener.once)) {
                        list.splice(i, 1);
                        i--;
                        listener.recover();
                    }
                }
                if (list.length === 0) {
                    delete this._events[type];
                }
            }
        }
        return this;
    }

    offAllCaller(caller: unknown): this {
        if (caller && this._events) {
            for (const type in this._events) {
                this.off(type, caller, null as unknown as (...args: unknown[]) => void);
            }
        }
        return this;
    }
}

export default class EventSystem {
    static dispatcher = new EventDispatcher();

    static listen(event: string, callback: (...args: unknown[]) => void, target?: unknown, args?: unknown[] | null): void {
        this.dispatcher.off(event, target, callback);
        this.dispatcher.on(event, target, callback, args);
    }

    static ignore(event: string, callback: (...args: unknown[]) => void, target?: unknown): void {
        this.dispatcher.off(event, target, callback, false);
    }

    static trigger(event: string, data?: unknown): void {
        this.dispatcher.event(event, data);
    }

    static ignoreAll(target: unknown): void {
        this.dispatcher.offAllCaller(target);
    }
}
