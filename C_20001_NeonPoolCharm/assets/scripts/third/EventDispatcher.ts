import EventHandler from "./EventHandler";

export default class EventDispatcher {
    _events: Record<string, EventHandler | EventHandler[]> = null;

    off(event: string, caller?: any, method?: Function, onceOnly: boolean = false): this {
        if (!this._events || !this._events[event]) {
            return this;
        }
        const handlers = this._events[event];
        if (handlers != null) {
            if ((handlers as EventHandler).run) {
                const handler = handlers as EventHandler;
                if (
                    (!caller || handler.caller === caller) &&
                    (method == null || handler.method === method) &&
                    (!onceOnly || handler.once)
                ) {
                    delete this._events[event];
                    handler.recover();
                }
            } else {
                const list = handlers as EventHandler[];
                let removed = 0;
                const len = list.length;
                for (let i = 0; i < len; i++) {
                    const handler = list[i];
                    if (handler) {
                        if (
                            handler &&
                            (!caller || handler.caller === caller) &&
                            (method == null || handler.method === method) &&
                            (!onceOnly || handler.once)
                        ) {
                            removed++;
                            list[i] = "NULL" as any;
                            handler.recover();
                        }
                    } else {
                        list[i] = "NULL" as any;
                        removed++;
                    }
                }
                if (removed === len) {
                    delete this._events[event];
                } else if (removed > 0) {
                    let compact = 0;
                    for (let i = 0; i < len; ++i) {
                        const handler = list[i];
                        if (handler == null) {
                            list.splice(i);
                            break;
                        }
                        if (handler == ("NULL" as any)) {
                            list[i] = null;
                        } else {
                            if (i != compact) {
                                list[compact] = handler;
                                list[i] = null;
                            }
                            ++compact;
                        }
                    }
                    list.length = len - removed;
                }
            }
        }
        return this;
    }

    _createListener(
        event: string,
        caller: any,
        method: Function,
        args: any,
        once: boolean,
        recoverBefore: boolean = true
    ): this {
        if (recoverBefore) {
            this.off(event, caller, method, once);
        }
        const handler = EventHandler.create(caller || this, method, args, once);
        handler.register(this, event);
        if (!this._events) {
            this._events = {};
        }
        const events = this._events;
        if (events[event]) {
            if ((events[event] as EventHandler).run) {
                events[event] = [events[event] as EventHandler, handler];
            } else {
                (events[event] as EventHandler[]).push(handler);
            }
        } else {
            events[event] = handler;
        }
        return this;
    }

    event(event: string, data: any = null): boolean {
        if (!this._events || !this._events[event]) {
            return false;
        }
        const handlers = this._events[event];
        if ((handlers as EventHandler).run) {
            const handler = handlers as EventHandler;
            if (handler.once) {
                delete this._events[event];
            }
            if (handler.check(this, event)) {
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
                if (handler && handler.check(this, event)) {
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
                delete this._events[event];
            }
        }
        return true;
    }

    _recoverHandlers(handlers: EventHandler | EventHandler[]): void {
        if (handlers) {
            if ((handlers as EventHandler).run) {
                (handlers as EventHandler).recover();
            } else {
                const list = handlers as EventHandler[];
                for (let i = list.length - 1; i > -1; i--) {
                    if (list[i]) {
                        list[i].recover();
                        list[i] = null;
                    }
                }
            }
        }
    }

    once(event: string, caller: any, method: Function, args: any = null): this {
        return this._createListener(event, caller, method, args, true);
    }

    offAllCaller(caller: any): this {
        if (caller && this._events) {
            for (const event in this._events) {
                this.off(event, caller, null);
            }
        }
        return this;
    }

    hasListener(event: string): boolean {
        return !!(this._events && this._events[event]);
    }

    offAll(event: string = null): this {
        const events = this._events;
        if (!events) {
            return this;
        }
        if (event) {
            this._recoverHandlers(events[event]);
            delete events[event];
        } else {
            for (const key in events) {
                this._recoverHandlers(events[key]);
            }
            this._events = null;
        }
        return this;
    }

    on(event: string, caller: any, method: Function, args: any = null): this {
        return this._createListener(event, caller, method, args, false);
    }
}
