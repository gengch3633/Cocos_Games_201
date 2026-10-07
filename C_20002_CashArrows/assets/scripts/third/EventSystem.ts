import Handler from "./Handler";

export const CLOSE_RECONNECT = " CLOSE_RECONNECT ";

class EventListener extends Handler {
    _dispatcher: EventDispatcher = null;
    _type: string = null;

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
        return !(this._dispatcher && this._dispatcher != dispatcher || this._type && this._type != type);
    }

    static create(caller: any, method: Function, args: any = null, once: boolean = true): EventListener {
        return EventListener._pool.length
            ? EventListener._pool.pop().setTo(caller, method, args, once) as EventListener
            : new EventListener(caller, method, args, once);
    }

    static _pool: EventListener[] = [];
}

class EventDispatcher {
    _events: { [key: string]: EventListener | EventListener[] } = null;

    event(type: string, data: any = null): boolean {
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
                data != null ? listener.runWith(data) : listener.run();
            }
        } else {
            const list = listeners as EventListener[];
            for (let i = 0, length = list.length; i < length; i++) {
                const listener = list[i];
                if (listener && listener.check(this, type)) {
                    data != null ? listener.runWith(data) : listener.run();
                }
                if (!listener || listener.once) {
                    list.splice(i, 1);
                    i--;
                    length--;
                }
            }
            if (list.length === 0 && this._events) {
                delete this._events[type];
            }
        }
        return true;
    }

    on(type: string, caller: any, method: Function, args?: any): this {
        return this._createListener(type, caller, method, args, false);
    }

    _createListener(type: string, caller: any, method: Function, args: any, once: boolean, offBefore: boolean = true): this {
        if (offBefore) {
            this.off(type, caller, method, once);
        }
        const listener = EventListener.create(caller || this, method, args, once);
        listener.register(this, type);
        if (!this._events) {
            this._events = {};
        }
        const current = this._events;
        if (current[type]) {
            if ((current[type] as EventListener).run) {
                current[type] = [current[type] as EventListener, listener];
            } else {
                (current[type] as EventListener[]).push(listener);
            }
        } else {
            current[type] = listener;
        }
        return this;
    }

    off(type: string, caller: any, method: Function, once?: boolean): this {
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

    static listen(event: string, callback: Function, caller: any, args?: any[]): void {
        this.dispatcher.off(event, caller, callback);
        this.dispatcher.on(event, caller, callback, args);
    }

    static ignore(event: string, callback: Function, caller: any): void {
        this.dispatcher.off(event, caller, callback, false);
    }

    static trigger(event: string, data?: any): void {
        this.dispatcher.event(event, data);
    }

    static ignoreAll(caller: any): void {
        this.dispatcher.offAllCaller(caller);
    }
}
